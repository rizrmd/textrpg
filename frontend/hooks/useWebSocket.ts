import { useEffect } from "react";
import { useWebSocketStore } from "../stores/webSocketStore";

export const useWebSocket = () => {
  const { battleState, setBattleState, setWebSocket, sendAction } = useWebSocketStore();

  useEffect(() => {
    const websocket = new WebSocket(`ws://${window.location.host}/ws`);

    websocket.onopen = () => {
      console.log("Connected to battle server");
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "state") {
          setBattleState(message.data);
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    websocket.onclose = () => {
      console.log("Disconnected from battle server");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWebSocket(websocket);

    return () => {
      websocket.close();
    };
  }, [setBattleState, setWebSocket]);

  return { battleState, sendAction };
};