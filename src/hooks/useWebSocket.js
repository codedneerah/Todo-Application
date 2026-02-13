import { useEffect, useRef, useState } from 'react';
import { connectWebSocket, disconnectWebSocket, getWebSocketStatus } from '../api/todos';

/**
 * Hook for handling WebSocket connections and real-time updates
 * @param {Function} onMessage - Callback function when message is received
 * @param {Boolean} enabled - Enable/disable WebSocket connection
 */
export const useWebSocket = (onMessage, enabled = true) => {
  const [status, setStatus] = useState('disconnected');
  const wsRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      disconnectWebSocket();
      return;
    }

    const handleMessage = (data) => {
      setStatus(getWebSocketStatus());
      onMessage?.(data);
    };

    const handleError = (error) => {
      console.error('WebSocket error:', error);
      setStatus(getWebSocketStatus());
    };

    wsRef.current = connectWebSocket(handleMessage, handleError);
    setStatus(getWebSocketStatus());

    return () => {
      disconnectWebSocket();
    };
  }, [enabled, onMessage]);

  return {
    status,
    isConnected: status === 'connected',
  };
};
