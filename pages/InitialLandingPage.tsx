import React from 'react';
import { LeafIcon } from '../components/icons/Icons';

interface InitialLandingPageProps {
  onGetStarted: () => void;
}

export const InitialLandingPage: React.FC<InitialLandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-gradient-to-br from-green-400 to-lime-600 min-h-screen flex flex-col items-center justify-center text-white p-4">
      <div className="text-center">
        <div className="inline-block bg-white/20 p-6 rounded-full mb-6 animate-pulse">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-green-600">
                <span className="scale-[2]">
                    <LeafIcon />
                </span>
            </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          Welcome to Green Land
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
          Your AI-powered guide to sustainable and successful organic farming.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-white text-green-700 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:bg-lime-100 hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-lime-300"
        >
          Get Started
        </button>
      </div>
       <div className="absolute bottom-4 text-center text-white/70 text-sm">
        Powered by Google Gemini
      </div>
    </div>
  );
};