import React, { useState } from 'react';
import { MENU_OPTIONS } from '../constants';
import type { MenuOption } from '../types';
import { SearchIcon } from './icons/Icons';

interface WelcomeScreenProps {
  onStartChat: (prompt: string, isSearch?: boolean) => void;
  onSelectOption: (option: MenuOption) => void;
  onShowImageGenerator: () => void;
}

const MenuOptionCard: React.FC<{ option: MenuOption, onClick: () => void }> = ({ option, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left w-full h-full flex flex-col"
  >
    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-3xl">
      {option.icon}
    </div>
    <h3 className="font-bold text-lg text-gray-800 mb-2">{option.title}</h3>
    <p className="text-gray-600 text-sm flex-grow">{option.description}</p>
  </button>
);


export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat, onSelectOption, onShowImageGenerator }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onStartChat(searchQuery, true);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Green Land!</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Your personal AI guide to organic farming. Search any topic or choose an option below.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for anything... e.g., 'how to make compost'"
            className="w-full pl-6 pr-32 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-200 shadow-sm text-lg"
          />
          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-green-600 text-white rounded-full disabled:bg-gray-400 hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-2"
          >
            <SearchIcon />
            <span className="font-semibold">Search</span>
          </button>
        </form>
      </div>
      
      <div className="text-center mb-8">
        <div className="inline-block relative">
            <h3 className="text-xl font-bold text-gray-700 z-10 relative">Or, try one of these tools</h3>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-green-200/50 -z-0"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MENU_OPTIONS.map((option) => (
          <MenuOptionCard
            key={option.key}
            option={option}
            onClick={
              option.key === 'visualize'
                ? onShowImageGenerator
                : () => onSelectOption(option)
            }
          />
        ))}
      </div>
    </div>
  );
};