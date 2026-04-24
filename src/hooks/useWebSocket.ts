import { useEffect, useRef, useState } from 'react';
import { connectWebSocket, disconnectWebSocket, getWebSocketStatus } from '../api/todos';

/**
 * Hook for handling WebSocket connections and real-time updates
 */
export const useWebSocket = (onMessage: (data: unknown) => void, enabled: boolean = true) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) {
      disconnectWebSocket();
      return;
    }

    const handleMessage = (data: unknown) => {
      setStatus(getWebSocketStatus() as any);
      onMessage?.(data);
    };

    const handleError = (error: unknown) => {
      console.error('WebSocket error:', error);
      setStatus(getWebSocketStatus() as any);
    };

    wsRef.current = connectWebSocket(handleMessage, handleError);
    setStatus(getWebSocketStatus() as any);

    return () => {
      disconnectWebSocket();
    };
  }, [enabled, onMessage]);

  return {
    status,
    isConnected: status === 'connected',
  };
};

