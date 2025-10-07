import { randomUUID } from 'crypto';
import type { PlayerSession } from '../types/player';
import type { ServerWebSocket } from 'bun';
import { createInitialBattleState } from './gameEngine';
import { MemoryStore } from '../storage/memoryStore';

export class PlayerManager {
  static createPlayerSession(ws: ServerWebSocket<unknown>): PlayerSession {
    const sessionId = randomUUID();
    const playerId = randomUUID();

    const session: PlayerSession = {
      id: sessionId,
      playerId,
      battleState: createInitialBattleState(),
      ws,
      lastActivity: Date.now(),
      connected: true
    };

    MemoryStore.saveSession(session);
    return session;
  }

  static getPlayerSession(sessionId: string): PlayerSession | undefined {
    return MemoryStore.getSession(sessionId);
  }

  static getPlayerSessionByWebSocket(ws: ServerWebSocket<unknown>): PlayerSession | undefined {
    const sessions = MemoryStore.getAllSessions();
    for (const session of sessions) {
      if (session.ws === ws && session.connected) {
        return session;
      }
    }
    return undefined;
  }

  static updatePlayerActivity(sessionId: string): void {
    const session = MemoryStore.getSession(sessionId);
    if (session) {
      session.lastActivity = Date.now();
      MemoryStore.saveSession(session);
    }
  }

  static disconnectPlayer(ws: ServerWebSocket<unknown>): void {
    const session = this.getPlayerSessionByWebSocket(ws);
    if (session) {
      session.connected = false;
      MemoryStore.saveSession(session);
      // Keep session for potential reconnection, but mark as disconnected
    }
  }

  static cleanupInactiveSessions(maxAge: number = 24 * 60 * 60 * 1000): void {
    MemoryStore.cleanupInactiveSessions(maxAge);
  }

  static getAllActiveSessions(): PlayerSession[] {
    return MemoryStore.getAllSessions().filter(session => session.connected);
  }
}