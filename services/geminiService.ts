import { GoogleGenAI, Chat, GenerateContentResponse, Modality, Content } from "@google/genai";
import type { FunctionDeclaration } from '@google/genai';

let ai: GoogleGenAI | null = null;

const getAIInstance = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

interface InitChatParams {
    systemInstruction: string;
    tools?: { functionDeclarations: FunctionDeclaration[] }[];
}

export const initChat = ({ systemInstruction, tools }: InitChatParams): Chat => {
  const genAI = getAIInstance();
  return genAI.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      tools: tools,
    },
  });
};

// This function will handle non-search messages using the chat session
export const sendMessageInChat = async (chat: Chat, message: string): Promise<GenerateContentResponse> => {
  try {
    const result = await chat.sendMessage(message);
    return result;
  } catch (error) {
    console.error("Gemini API chat error:", error);
    throw new Error("Failed to get response from AI chat");
  }
};

// This function will handle search-enabled messages
export const searchWithAI = async (message: string, systemInstruction: string, history: Content[]): Promise<GenerateContentResponse> => {
    const genAI = getAIInstance();
    try {
        const contents = [...history, { role: 'user', parts: [{ text: message }] }];
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
              systemInstruction,
              tools: [{googleSearch: {}}],
            },
        });
        return response;
    } catch (error) {
        console.error("Gemini API search error:", error);
        throw new Error("Failed to get response from AI search");
    }
};

export const identifyWithImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<GenerateContentResponse> => {
  const genAI = getAIInstance();
  const fullPrompt = prompt || "Identify what is in this image and provide advice if it's a plant pest or disease.";

  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    };
    const textPart = { text: fullPrompt };

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: "You are an expert agriculturalist specializing in identifying plant pests and diseases from images. Provide a clear identification, potential risks, and detailed organic treatment recommendations. Be concise and practical.",
      },
    });
    return response;
  } catch (error) {
    console.error("Gemini API image identification error:", error);
    throw new Error("Failed to get response from AI for image identification");
  }
};


export const generateImageFromText = async (prompt: string): Promise<string> => {
  const genAI = getAIInstance();
  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Image Generation API error:", error);
    throw new Error("Failed to generate image from AI");
  }
};