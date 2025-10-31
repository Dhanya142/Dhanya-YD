
import React, { useState } from 'react';
import { generateImageFromText } from '../services/geminiService';
import { ImageIcon, SendIcon } from './icons/Icons';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const generatedImageUrl = await generateImageFromText(prompt);
      setImageUrl(generatedImageUrl);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Text-to-Image Generator</h2>
      <p className="text-gray-600 mb-8">Describe a scene, object, or concept, and our AI will bring it to life as an image.</p>

      <form onSubmit={handleGenerate} className="w-full max-w-2xl relative mb-8">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'A vibrant and healthy organic vegetable garden in the morning sun'"
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-200 shadow-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-green-600 text-white rounded-full disabled:bg-gray-400 hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <SendIcon />
        </button>
      </form>

      <div className="w-full max-w-2xl h-96 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="text-gray-500 mt-4">Generating your image...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : imageUrl ? (
          <img src={imageUrl} alt={prompt} className="max-w-full max-h-full object-contain rounded-lg" />
        ) : (
          <div className="text-gray-400 flex flex-col items-center gap-2">
            <ImageIcon />
            <p>Your generated image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};