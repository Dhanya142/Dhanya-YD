import React, { useState } from 'react';
import type { Chat, Content, GenerateContentResponse, GroundingChunk } from '@google/genai';
import { Header } from '../components/Header';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInput } from '../components/ChatInput';
import { ImageGenerator } from '../components/ImageGenerator';
import { initChat, searchWithAI } from '../services/geminiService';
import { SYSTEM_INSTRUCTION, getWeatherFunctionDeclaration } from '../constants';
import type { Message, Source } from '../types';

// A mock function for the weather tool
const getWeatherReport = () => {
  const temperatures = [18, 20, 22, 25, 28];
  const conditions = ['Sunny', 'Partly Cloudy', 'Clear Skies', 'Light Breeze'];
  const temp = temperatures[Math.floor(Math.random() * temperatures.length)];
  const cond = conditions[Math.floor(Math.random() * conditions.length)];
  return `The current weather is ${temp}°C with ${cond}. It's a great day for farming!`;
}

type View = 'welcome' | 'chat' | 'image-generator';

export const MainPage: React.FC = () => {
  const [view, setView] = useState<View>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [chatHistoryForSearch, setChatHistoryForSearch] = useState<Content[]>([]);

  const handleBackToHome = () => {
    setView('welcome');
    setMessages([]);
    setChatSession(null);
    setIsSearchMode(false);
    setChatHistoryForSearch([]);
  };

  const processApiResponse = (response: GenerateContentResponse): { text: string; sources: Source[] } => {
    const text = response.text;
    const sources: Source[] = [];
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk: GroundingChunk) => {
        if (chunk.web) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
        }
      });
    }

    return { text, sources };
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (isSearchMode) {
        const currentHistory = [...chatHistoryForSearch];
        const response = await searchWithAI(text, SYSTEM_INSTRUCTION, currentHistory);
        const { text: responseText, sources } = processApiResponse(response);
        const aiMessage: Message = {
            id: Date.now().toString() + '-ai',
            text: responseText,
            sender: 'ai',
            sources: sources,
        };
        setMessages(prev => [...prev, aiMessage]);
        setChatHistoryForSearch([
          ...currentHistory, 
          { role: 'user' as const, parts: [{ text }] }, 
          { role: 'model' as const, parts: [{ text: responseText }] }
        ]);
      } else if (chatSession) {
        let response = await chatSession.sendMessage(text);
        
        while (response.functionCalls && response.functionCalls.length > 0) {
          const functionCall = response.functionCalls[0];
          if (functionCall.name === 'getWeatherReport') {
            const weather = getWeatherReport();
            response = await chatSession.sendMessage({
              parts: [{
                functionResponse: {
                  name: 'getWeatherReport',
                  response: { weather },
                },
              }],
            });
          } else {
            break; // Unhandled function call
          }
        }
        
        if (response.text) {
          const { text: responseText, sources } = processApiResponse(response);
          const aiMessage: Message = {
              id: Date.now().toString() + '-ai',
              text: responseText,
              sender: 'ai',
              sources,
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      }
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async (prompt: string, searchMode = false) => {
    setIsSearchMode(searchMode);
    setView('chat');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: prompt,
      sender: 'user',
    };
    setMessages([userMessage]);
    setIsLoading(true);
    
    try {
      let response: GenerateContentResponse;
      if (searchMode) {
        setChatHistoryForSearch([]);
        response = await searchWithAI(prompt, SYSTEM_INSTRUCTION, []);
        const { text, sources } = processApiResponse(response);
        const aiMessage: Message = {
          id: Date.now().toString() + '-ai',
          text,
          sender: 'ai',
          sources
        };
        setMessages(prev => [...prev, aiMessage]);
        setChatHistoryForSearch([
            { role: 'user', parts: [{ text: prompt }] },
            { role: 'model', parts: [{ text }] }
        ]);
      } else {
        const chat = initChat({
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ functionDeclarations: [getWeatherFunctionDeclaration] }],
        });
        setChatSession(chat);
        response = await chat.sendMessage(prompt);
        const { text, sources } = processApiResponse(response);
        const aiMessage: Message = {
          id: Date.now().toString() + '-ai',
          text,
          sender: 'ai',
          sources,
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
       console.error(error);
       const errorMessage: Message = {
         id: Date.now().toString() + '-error',
         text: 'Sorry, something went wrong setting up the chat. Please try again.',
         sender: 'ai',
       };
       setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            <ChatWindow messages={messages} isLoading={isLoading} />
            <div className="mt-auto pt-4">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        );
      case 'image-generator':
        return <ImageGenerator />;
      case 'welcome':
      default:
        return <WelcomeScreen onStartChat={handleStartChat} onShowImageGenerator={() => setView('image-generator')} />;
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <Header onBack={handleBackToHome} showBack={view !== 'welcome'} />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 xl:p-12">
        <div className="container mx-auto h-full max-w-4xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
