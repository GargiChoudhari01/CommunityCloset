import { env } from '../config/env';

export const apiClient = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`${env.apiUrl}/api${endpoint}`);
      if (response.ok) return await response.json();
    } catch {
      // Offline / Fallback
    }
    return null;
  },

  async post(endpoint: string, body: any) {
    try {
      const response = await fetch(`${env.apiUrl}/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) return await response.json();
    } catch {
      // Offline / Fallback
    }
    return null;
  }
};
