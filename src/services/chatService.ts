import { api } from './api';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const chatService = {
  async askChatbot(message: string, history: ChatMessage[] = []) {
    try {
      const response = await api.post('/chatbot/ask', {
        message,
        history
      });
      return response.data;
    } catch (error: any) {
      console.error('Error asking chatbot:', error);
      throw error;
    }
  },

  async askBot(message: string, history: ChatMessage[] = []) {
    return this.askChatbot(message, history);
  }
};
