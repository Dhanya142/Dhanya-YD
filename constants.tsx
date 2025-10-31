import React from 'react';
import { Type } from '@google/genai';
import type { FunctionDeclaration } from '@google/genai';
import type { MenuOption } from './types';

export const SYSTEM_INSTRUCTION = "You are the Green Land AI, a friendly and expert AI assistant for organic farming. Your tone should be encouraging, knowledgeable, and easy to understand. Provide practical advice, identify problems, and suggest sustainable solutions. When asked about weather, use the provided tools.";

export const getWeatherFunctionDeclaration: FunctionDeclaration = {
  name: 'getWeatherReport',
  description: 'Get the current weather report for the user\'s location to help with farm planning.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: []
  },
};

export const MENU_OPTIONS: MenuOption[] = [
  {
    key: 'what-is-organic',
    icon: '📖',
    title: "What is Organic Farming?",
    description: "Learn the core principles, benefits, and definition of organic agriculture.",
    info: "You've selected 'What is Organic Farming?'. In this session, the AI will provide a detailed breakdown of the core principles, benefits, and common practices of organic agriculture. Click below to get a comprehensive answer.",
    prompt: "Provide a detailed explanation of organic farming. Cover the following key areas:\n1. The core definition and philosophy.\n2. The main principles (e.g., health, ecology, fairness, care).\n3. Key benefits for the environment (like soil health, water quality) and for consumers (health benefits).\n4. Common practices used, such as crop rotation, composting, and natural pest control.",
    tooltip: "This provides a foundational understanding, perfect for beginners or as a refresher on the key concepts of sustainable agriculture.",
  },
  {
    key: 'pest-id',
    icon: '🐛',
    title: "Identify a Pest",
    description: "Describe a bug or pest, and I'll help you identify it and suggest organic control methods.",
    info: "You've selected 'Identify a Pest'. Prepare a description of the pest you've encountered. The AI will use your description to help identify it and suggest sustainable, organic control methods. Click below to start.",
    prompt: "I found a small, yellow bug with black spots on my tomato plants. What could it be and how do I get rid of it organically?",
    tooltip: "Example: 'I see tiny green insects clustered on the underside of my rose leaves.' The more detail, the better the AI can help!",
  },
  {
    key: 'disease-prediction',
    icon: '🌱',
    title: "Disease Prediction",
    description: "Describe plant symptoms to get a potential diagnosis and organic treatment suggestions.",
    info: "You've selected 'Disease Prediction'. Please describe the symptoms you're seeing on your plant (e.g., color changes, spots on leaves, wilting). The AI will help predict the potential issue and suggest organic treatments. Click below to begin.",
    prompt: "My cucumber leaves have powdery white spots on them. What disease could this be, and what are some organic treatments?",
    tooltip: "Example: 'My tomato plant's lower leaves are turning yellow with brown spots.' Mention the plant and where the symptoms appear for a better diagnosis.",
  },
  {
    key: 'problem-solving',
    icon: '💡',
    title: "Problem Solving",
    description: "Describe a farming problem, and get AI-driven solutions and practical advice.",
    info: "You've selected 'Problem Solving'. Think about a challenge you're facing on your farm—it could be about soil, water, pests, or anything else. The AI will help you brainstorm solutions. Click below to start describing your problem.",
    prompt: "I have a problem with poor soil drainage in my main vegetable patch. What are some organic methods to improve it?",
    tooltip: "Be as specific as you can. For example, instead of 'my plants are dying,' try 'the leaves on my zucchini plants are turning yellow and wilting despite regular watering.'",
  },
    {
    key: 'image-id',
    icon: '📸',
    title: "Identify with Image",
    description: "Upload a photo of a pest or disease for AI identification and treatment advice.",
    info: "You've selected 'Identify with Image'. This tool uses AI to analyze your photos. You'll be prompted to upload an image and can add an optional question for the AI. Get ready to select a photo from your device.",
    prompt: "", // Not used directly, the action triggers a different view
    tooltip: "For best results, use a clear, well-lit photo of the affected area. Works great for insects, spots on leaves, or unusual plant growth.",
  },
  {
    key: 'crop-recommendation',
    icon: '🌾',
    title: "Best Crop Recommendation",
    description: "Get personalized crop suggestions based on your location and soil type.",
    info: "You've selected 'Best Crop Recommendation'. To give you the best advice, the AI will ask for your location (e.g., state or district) and soil type (e.g., sandy, clay, loamy). Get ready to provide these details. Click below to start.",
    prompt: "I need a recommendation for the best crops to grow organically. Please ask me for my location and soil type to provide a tailored suggestion.",
    tooltip: "The AI will guide you through a short conversation to gather the necessary details for the most accurate crop recommendations.",
  },
  {
    key: 'fertilizer-application',
    icon: '🌿',
    title: "Fertilizer Application",
    description: "Get recommendations on organic fertilizers and how to apply them for your crops.",
    info: "You've selected 'Fertilizer Application'. This tool provides recommendations for organic fertilizers tailored to specific crops. You can ask about the best types, application methods, and timing. Click below to proceed.",
    prompt: "Tell me about the best organic fertilizers for tomato plants and how to apply them.",
    tooltip: "You can ask for general advice or for specific crops, like 'What's a good organic fertilizer for carrots and when should I apply it?'",
  },
    {
    key: 'training-resources',
    icon: '📞',
    title: "Training & Contact Resources",
    description: "Find training programs and contact details for agricultural organizations in India.",
    info: "You've selected 'Training & Contact Resources'. The AI will provide a list of key organizations that offer training in organic farming, along with contact information for important agricultural bodies in India. Click below to get this information.",
    prompt: "Please provide a list of training programs and contact resources for organic farming in India. Include:\n1. Key national organizations that offer training or certification (like NCOF, PGSOF).\n2. Contact information or websites for major agricultural bodies like ICAR, NABARD, and APEDA.\n3. Mention that users should also check their local State Agriculture Department websites for specific schemes and contacts.",
    tooltip: "This will give you a great starting point for finding certified courses, workshops, and official support channels for organic farming in India."
  },
  {
    key: 'weather',
    icon: '☀️',
    title: "Get Weather Forecast",
    description: "Get the current weather to plan your farming activities for the day.",
    info: "You've selected 'Get Weather Forecast'. The AI will access a tool to provide the current weather conditions for your location, helping you plan your farming activities. Click below to get the report.",
    prompt: "What's the weather like right now?",
    tooltip: "This tool uses your browser's location to provide a real-time weather report, helping you decide on activities like watering or planting.",
  },
  {
    key: 'visualize',
    icon: '🖼️',
    title: "Generate Image from Text",
    description: "Describe anything you'd like to see, and the AI will generate an image for you.",
    info: "You've selected the Image Generator. This tool allows you to create an image from a text description. Think of a scene, an object, or a concept, and the AI will visualize it for you.",
    prompt: "", // Not used for this action
    tooltip: "Be creative! Try generating anything from 'a healthy compost pile teeming with earthworms' to 'a futuristic vertical farm'.",
  },
];