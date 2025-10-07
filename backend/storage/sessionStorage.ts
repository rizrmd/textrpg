// localStorage wrapper for client-side persistence
export class SessionStorage {
  private static readonly PLAYER_ID_KEY = 'textrpg_player_id';
  private static readonly GAME_STATE_KEY = 'textrpg_game_state';

  static getPlayerId(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(this.PLAYER_ID_KEY);
    } catch {
      return null;
    }
  }

  static setPlayerId(playerId: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.PLAYER_ID_KEY, playerId);
    } catch {
      // localStorage not available
    }
  }

  static saveGameState(gameState: any): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.GAME_STATE_KEY, JSON.stringify(gameState));
    } catch {
      // localStorage not available or quota exceeded
    }
  }

  static loadGameState(): any | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.GAME_STATE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static clearGameState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.GAME_STATE_KEY);
      localStorage.removeItem(this.PLAYER_ID_KEY);
    } catch {
      // localStorage not available
    }
  }
}