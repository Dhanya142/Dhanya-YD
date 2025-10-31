import React from 'react';
import { LeafIcon } from './icons/Icons';

interface HeaderProps {
  onBack: () => void;
  showBack: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onBack, showBack }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-8 xl:px-16 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <LeafIcon />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Green Land <span className="text-green-600">AI</span>
          </h1>
        </div>
        {showBack && (
          <button
            onClick={onBack}
            className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors"
          >
            &larr; Back to Home
          </button>
        )}
      </div>
    </header>
  );
};