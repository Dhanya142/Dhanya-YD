import type React from 'react';

export interface Source {
  uri: string;
  title: string;
}

export interface Message {
  id:string;
  text: string;
  sender: 'user' | 'ai';
  sources?: Source[];
}

export interface MenuOption {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  info: string;
  prompt: string;
  tooltip?: string;
}