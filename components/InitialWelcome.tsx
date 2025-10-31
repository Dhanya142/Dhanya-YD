import React from 'react';
import { LeafIcon } from './icons/Icons';

export const InitialWelcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
        <span className="text-5xl">
            <LeafIcon />
        </span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Green Land!</h2>
      <p>Your personal AI guide to organic farming. How can I help you today?</p>
    </div>
  );
};