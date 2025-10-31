
import React from 'react';
import type { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

// A simple markdown parser
const parseMarkdown = (text: string) => {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>') // Links
    .replace(/^\s*\n\*/gm, '<ul>\n*')
    .replace(/^(\s*\*\s.*)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2')
    .replace(/^\s*\*\s(.*)/gm, '<li>$1</li>'); // Lists

  return { __html: html.replace(/\n/g, '<br />') };
};


export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClasses = isUser
    ? 'bg-green-600 text-white self-end'
    : 'bg-white text-gray-800 self-start shadow-sm';
  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  const icon = isUser ? '🧑‍🌾' : '🤖';

  return (
    <div className={`flex items-start gap-3 w-full ${containerClasses}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
          {icon}
        </div>
      )}
      <div
        className={`max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl ${bubbleClasses}`}
      >
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={parseMarkdown(message.text)} />
        {/* FIX: Add rendering for grounding sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-300/50">
            <h4 className="font-semibold text-xs mb-2">Sources:</h4>
            <ol className="list-decimal list-inside text-xs space-y-1">
              {message.sources.map((source, index) => (
                <li key={index}>
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {source.title || source.uri}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-2xl">
          {icon}
        </div>
      )}
    </div>
  );
};
