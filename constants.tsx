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
    prompt: "Explain what organic farming is and its main principles.",
  },
  {
    key: 'pest-id',
    icon: '🐛',
    title: "Identify a Pest",
    description: "Describe a bug or pest, and I'll help you identify it and suggest organic control methods.",
    prompt: "I found a small, yellow bug with black spots on my tomato plants. What could it be and how do I get rid of it organically?",
  },
  {
    key: 'disease-diagnosis',
    icon: '🌱',
    title: "Diagnose a Disease",
    description: "Describe the symptoms on your plant, and I'll help diagnose the issue.",
    prompt: "My cucumber leaves have powdery white spots on them. What is this disease?",
  },
  {
    key: 'fertilizer-application',
    icon: '🌿',
    title: "Fertilizer Application",
    description: "Get recommendations on organic fertilizers and how to apply them for your crops.",
    prompt: "Tell me about the best organic fertilizers for tomato plants and how to apply them.",
  },
  {
    key: 'weather',
    icon: '☀️',
    title: "Get Weather Forecast",
    description: "Get the current weather to plan your farming activities for the day.",
    prompt: "What's the weather like right now?",
  },
  {
    key: 'visualize',
    icon: '🖼️',
    title: "Generate Image from Text",
    description: "Describe anything you'd like to see, and the AI will generate an image for you.",
    prompt: "", // Not used for this action
  },
];