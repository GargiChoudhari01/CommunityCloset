/**
 * Realtime Event Engine (WebSocket / Supabase Realtime Simulation)
 * Publishes and subscribes to chat messages, notifications, and borrow transaction events.
 */

type Listener = (data: any) => void;

class RealtimeService {
  private listeners: Map<string, Set<Listener>> = new Map();

  public subscribe(channel: string, listener: Listener): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel)!.add(listener);

    return () => {
      this.listeners.get(channel)?.delete(listener);
    };
  }

  public publish(channel: string, payload: any) {
    if (this.listeners.has(channel)) {
      this.listeners.get(channel)!.forEach(listener => listener(payload));
    }
  }
}

export const realtimeService = new RealtimeService();
