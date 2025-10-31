
import React, { useState } from 'react';
import { SendIcon } from './icons/Icons';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask a question or try a topic from the menu..."
        disabled={isLoading}
        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-200 shadow-sm"
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-green-600 text-white rounded-full disabled:bg-gray-400 hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <SendIcon />
      </button>
    </form>
  );
};
