import index from "./frontend/index.html";
import { PlayerManager } from "./backend/services/playerManager";
import { BattleManager } from "./backend/services/battleManager";
import type { WebSocketMessage } from "./backend/types/websocket";

// Clean server entry point - all game logic moved to backend services
const server = Bun.serve({
  port: 7879,
  routes: {
    "/*": index,
  },
  fetch(req, server) {
    const url = new URL(req.url);

    // Handle WebSocket upgrade
    if (url.pathname === '/ws') {
      const upgraded = server.upgrade(req);
      if (upgraded) return undefined;
    }

    return new Response('Not found', { status: 404 });
  },
  websocket: {
    open(ws) {
      console.log('Client connected');
      // Create new player session for this WebSocket connection
      const session = PlayerManager.createPlayerSession(ws);
      BattleManager.startEnemyAttacks(session);

      // Send initial state
      ws.send(JSON.stringify({ type: 'state', data: session.battleState }));
    },
    message(ws, message) {
      try {
        const data = JSON.parse(message.toString()) as WebSocketMessage;
        const session = PlayerManager.getPlayerSessionByWebSocket(ws);

        if (session) {
          PlayerManager.updatePlayerActivity(session.id);
          BattleManager.handlePlayerAction(session, data.action, data.item, data.locationIndex);

          // Send updated state back to client
          ws.send(JSON.stringify({ type: 'state', data: session.battleState }));
        }
      } catch (error) {
        console.error('Invalid message:', error);
      }
    },
    close(ws) {
      console.log('Client disconnected');
      PlayerManager.disconnectPlayer(ws);
    }
  },
  development: {
    hmr: true,
    console: true,
  }
});

console.log(`Server running at http://localhost:${server.port}`);
