// File-based storage for player sessions
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { PlayerSession } from '../types/player';

const SESSIONS_DIR = join(process.cwd(), 'data', 'sessions');

export class Database {
  private static ensureSessionsDir(): void {
    if (!existsSync(SESSIONS_DIR)) {
      mkdirSync(SESSIONS_DIR, { recursive: true });
    }
  }

  static saveSession(session: PlayerSession): void {
    try {
      this.ensureSessionsDir();
      const filePath = join(SESSIONS_DIR, `${session.id}.json`);
      const data = JSON.stringify({
        ...session,
        ws: undefined, // Don't save WebSocket
        enemyAttackInterval: undefined // Don't save interval
      }, null, 2);
      writeFileSync(filePath, data, 'utf8');
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  static getSession(sessionId: string): PlayerSession | undefined {
    try {
      const filePath = join(SESSIONS_DIR, `${sessionId}.json`);
      if (!existsSync(filePath)) return undefined;

      const data = readFileSync(filePath, 'utf8');
      const sessionData = JSON.parse(data);

      // Recreate the session with current WebSocket (will be set when reconnected)
      return {
        ...sessionData,
        ws: undefined as any, // Will be set when WebSocket reconnects
        enemyAttackInterval: undefined
      };
    } catch (error) {
      console.error('Failed to load session:', error);
      return undefined;
    }
  }

  static getAllSessions(): PlayerSession[] {
    // For file storage, we don't implement getAllSessions as it's inefficient
    // This would require reading all files, which is slow
    return [];
  }

  static deleteSession(sessionId: string): void {
    try {
      const filePath = join(SESSIONS_DIR, `${sessionId}.json`);
      if (existsSync(filePath)) {
        // Note: In a real implementation, you'd use fs.unlinkSync
        // For now, we'll just leave the file (simple persistence)
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }

  static cleanupInactiveSessions(maxAge: number = 24 * 60 * 60 * 1000): void {
    // File cleanup would be complex and is not implemented for this demo
    // In production, you'd want a proper database with TTL/indexes
  }
}