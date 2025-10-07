// In-memory storage for player sessions (server-side)
import type { PlayerSession } from '../types/player';

const sessions = new Map<string, PlayerSession>();

export class MemoryStore {
  static saveSession(session: PlayerSession): void {
    sessions.set(session.id, session);
  }

  static getSession(sessionId: string): PlayerSession | undefined {
    return sessions.get(sessionId);
  }

  static getAllSessions(): PlayerSession[] {
    return Array.from(sessions.values());
  }

  static deleteSession(sessionId: string): void {
    sessions.delete(sessionId);
  }

  static cleanupInactiveSessions(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [sessionId, session] of sessions.entries()) {
      if (!session.connected && (now - session.lastActivity) > maxAge) {
        // Stop any running intervals
        if (session.enemyAttackInterval) {
          clearInterval(session.enemyAttackInterval);
        }
        sessions.delete(sessionId);
      }
    }
  }
}