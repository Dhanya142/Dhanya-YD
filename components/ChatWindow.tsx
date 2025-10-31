
import React, { useRef, useEffect } from 'react';
import type { Message as MessageType } from '../types';
import { Message } from './Message';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start items-center space-x-3">
          <div className="p-3 bg-gray-200 rounded-full">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="flex items-center space-x-1">
             <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
             <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
             <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
