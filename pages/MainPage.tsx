import React, { useState } from 'react';
import type { Chat, Content, GenerateContentResponse, GroundingChunk } from '@google/genai';
import { Header } from '../components/Header';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInput } from '../components/ChatInput';
import { ImageGenerator } from '../components/ImageGenerator';
import { ImageIdentifier } from '../components/ImageIdentifier';
import { initChat, searchWithAI, identifyWithImage } from '../services/geminiService';
import { SYSTEM_INSTRUCTION, getWeatherFunctionDeclaration } from '../constants';
import type { Message, Source, MenuOption } from '../types';

// A mock function for the weather tool
const getWeatherReport = () => {
  const temperatures = [18, 20, 22, 25, 28];
  const conditions = ['Sunny', 'Partly Cloudy', 'Clear Skies', 'Light Breeze'];
  const temp = temperatures[Math.floor(Math.random() * temperatures.length)];
  const cond = conditions[Math.floor(Math.random() * conditions.length)];
  return `The current weather is ${temp}°C with ${cond}. It's a great day for farming!`;
}

type View = 'welcome' | 'info' | 'chat' | 'image-generator' | 'image-upload';

export const MainPage: React.FC = () => {
  const [view, setView] = useState<View>('welcome');
  const [selectedOption, setSelectedOption] = useState<MenuOption | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [chatHistoryForSearch, setChatHistoryForSearch] = useState<Content[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleBackToHome = () => {
    setView('welcome');
    setMessages([]);
    setChatSession(null);
    setIsSearchMode(false);
    setChatHistoryForSearch([]);
    setSelectedOption(null);
    setShowTooltip(false);
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

  const handleImageIdentification = async (prompt: string, imageBase64: string, mimeType: string) => {
    const userPrompt = prompt || "Please identify the item in this image and provide relevant advice.";
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `[Image Uploaded] ${userPrompt}`,
      sender: 'user',
    };

    setView('chat');
    setMessages([userMessage]);
    setIsLoading(true);

    try {
      const response = await identifyWithImage(userPrompt, imageBase64, mimeType);
      const { text, sources } = processApiResponse(response);
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text,
        sender: 'ai',
        sources,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: "Sorry, I couldn't identify the image. Please try again.",
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option: MenuOption) => {
    setSelectedOption(option);
    setShowTooltip(false);
    if (option.key === 'visualize') {
        setView('image-generator');
    } else {
        setView('info');
    }
  };
  
  const handleInfoScreenAction = () => {
    if (!selectedOption) return;
    if (selectedOption.key === 'image-id') {
      setView('image-upload');
    } else {
      handleStartChat(selectedOption.prompt);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'info':
        if (!selectedOption) return null;
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-4xl">
                    {selectedOption.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedOption.title}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                    {selectedOption.info}
                </p>

                {selectedOption.tooltip && (
                    <div className="relative inline-block mb-8">
                        <button
                            onClick={() => setShowTooltip(prev => !prev)}
                            className="text-sm text-green-700 hover:text-green-900 transition-colors underline decoration-dotted underline-offset-2"
                        >
                            Learn More
                        </button>
                        {showTooltip && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-20 transition-opacity duration-300 opacity-100">
                                <p>{selectedOption.tooltip}</p>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={handleInfoScreenAction}
                    className="bg-green-600 text-white font-bold text-lg px-10 py-3 rounded-full shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    {selectedOption.key === 'image-id' ? 'Start Identification' : 'Start Conversation'}
                </button>
            </div>
        );
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
      case 'image-upload':
        return <ImageIdentifier onSubmit={handleImageIdentification} />;
      case 'welcome':
      default:
        return <WelcomeScreen onStartChat={handleStartChat} onSelectOption={handleSelectOption} onShowImageGenerator={() => setView('image-generator')} />;
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