export enum View {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  PROJECTS = 'PROJECTS',
  ECO_GENERATOR = 'ECO_GENERATOR',
  VOICE_ASSISTANT = 'VOICE_ASSISTANT',
}

export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  country: string;
  city: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface EcoProject {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'planned';
}

export interface EnvironmentalData {
  aqi: number;
  waterUsage: number;
  energyUsage: number;
  date: string;
}

// Web Speech API Types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
