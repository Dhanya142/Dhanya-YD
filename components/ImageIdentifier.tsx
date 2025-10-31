import React, { useState, useRef } from 'react';
import { CameraIcon } from './icons/Icons';

interface ImageIdentifierProps {
  onSubmit: (prompt: string, imageBase64: string, mimeType: string) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]); // remove prefix
    reader.onerror = error => reject(error);
  });
};

export const ImageIdentifier: React.FC<ImageIdentifierProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for inline data
        setError('Image is too large. Please select a file smaller than 4MB.');
        return;
      }
      setError(null);
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image to identify.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const base64String = await fileToBase64(imageFile);
      onSubmit(prompt, base64String, imageFile.type);
    } catch (err) {
      setError('Failed to process the image file. Please try again.');
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Identify with an Image</h2>
      <p className="text-gray-600 mb-8">Upload an image of a pest or plant disease, add an optional question, and our AI will help identify it.</p>

      <div className="w-full max-w-2xl mb-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-500 transition-colors ${previewUrl ? 'p-2' : ''}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-2">
              <CameraIcon />
              <p>Click to upload an image</p>
              <span className="text-xs">(Max 4MB)</span>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Optional: Add a question (e.g., 'What is this?')"
          disabled={isLoading}
          className="w-full pl-4 pr-32 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-200 shadow-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !imageFile}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-green-600 text-white rounded-full disabled:bg-gray-400 hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-2 font-semibold"
        >
          {isLoading ? 'Identifying...' : 'Identify'}
        </button>
      </form>
    </div>
  );
};
