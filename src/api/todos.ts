import { api } from './axios';
import { getMockTodos } from './mock';
import type { Todo } from '../types';

// Enable mock mode for development/testing
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const FALLBACK_TO_MOCK = true; // Fallback if API fails

// ====== TYPES ======
interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Re-export for compatibility
export type { PaginationResponse };

// ====== TODO ENDPOINTS ======

/**
 * Get all todos with pagination (public todos)
 */
export const getTodos = async ({
  page = 1,
  limit = 10, 
  search = '',
  status = '',
  category = '',
  priority = ''
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  priority?: string;
}): Promise<PaginationResponse<Todo>> => {
  if (USE_MOCK_DATA) {
    console.log('Using mock data');
    return getMockTodos({ page, search, status, category, priority });
  }

  try {
    console.log('📋 Fetching from /tasks...');
    const response = await api.get('/tasks', {
      params: {
        page,
        skip: (page - 1) * limit,
        limit: limit,
        search: search || undefined,
        status: status || undefined,
        category: category || undefined,
        priority: priority || undefined,
      },
    });

    console.log('✅ getTodos response from /tasks:', response.data);
    
    if (response.data && response.data.data && response.data.meta) {
      return {
        data: response.data.data,
        total: response.data.meta.total || response.data.data.length,
        page: response.data.meta.page || page,
        limit: response.data.meta.limit || limit,
        totalPages: response.data.meta.totalPages || Math.ceil((response.data.meta.total || response.data.data.length) / limit),
      };
    }
    
    if (response.data && response.data.data) {
      return {
        data: response.data.data,
        total: response.data.total || response.data.data.length,
        page,
        limit: limit,
        totalPages: Math.ceil((response.data.total || response.data.data.length) / limit),
      };
    }
    
    if (Array.isArray(response.data)) {
      return {
        data: response.data.slice((page - 1) * limit, page * limit),
        total: response.data.length,
        page,
        limit: limit,
        totalPages: Math.ceil(response.data.length / limit),
      };
    }
    
    // @ts-ignore
    return response.data;
  } catch (error: any) {
    console.error('❌ getTodos error on /tasks:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
    });
    
    if (error.response?.status === 404) {
      console.log('📋 /tasks not found, trying /todos endpoint as fallback...');
      try {
        const fallbackResponse = await api.get('/todos', {
          params: {
            page,
            skip: (page - 1) * limit,
            limit: limit,
            search: search || undefined,
            status: status || undefined,
            category: category || undefined,
            priority: priority || undefined,
          },
        });
        
        if (fallbackResponse.data && fallbackResponse.data.data && fallbackResponse.data.meta) {
          return {
            data: fallbackResponse.data.data,
            total: fallbackResponse.data.meta.total || fallbackResponse.data.data.length,
            page: fallbackResponse.data.meta.page || page,
            limit: fallbackResponse.data.meta.limit || limit,
            totalPages: fallbackResponse.data.meta.totalPages || Math.ceil((fallbackResponse.data.meta.total || fallbackResponse.data.data.length) / limit),
          };
        }
        
        if (fallbackResponse.data && fallbackResponse.data.data) {
          return {
            data: fallbackResponse.data.data,
            total: fallbackResponse.data.total || fallbackResponse.data.data.length,
            page,
            limit: limit,
            totalPages: Math.ceil((fallbackResponse.data.total || fallbackResponse.data.data.length) / limit),
          };
        }
        
        if (Array.isArray(fallbackResponse.data)) {
          return {
            data: fallbackResponse.data.slice((page - 1) * limit, page * limit),
            total: fallbackResponse.data.length,
            page,
            limit: limit,
            totalPages: Math.ceil(fallbackResponse.data.length / limit),
          };
        }
        
        // @ts-ignore
        return fallbackResponse.data;
      } catch (taskError: any) {
        console.error('❌ /tasks endpoint also failed:', taskError.message);
      }
    }
    
    if (FALLBACK_TO_MOCK) {
      console.log('📦 Falling back to mock data due to API error');
      // @ts-ignore mock return type
      return getMockTodos({ page, search, status, category, priority });
    }
    
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch todos (${error.response?.status || 'Network error'})`
    );
  }
};

export const getTodoById = async (id: string | number): Promise<Todo> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTodo = async (payload: Partial<Todo>): Promise<Todo> => {
  const response = await api.post('/tasks', payload);
  return response.data;
};

export const updateTodo = async ({ id, payload }: { id: string | number; payload: Partial<Todo> }): Promise<Todo> => {
  const response = await api.put(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTodo = async (id: string | number): Promise<{ success: boolean }> => {
  await api.delete(`/tasks/${id}`);
  return { success: true };
};

export const getUserTodos = async ({
  page = 1,
  limit = 10,
  search = '',
  status = '',
  category = '',
  priority = ''
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  priority?: string;
}): Promise<PaginationResponse<Todo>> => {
  return getTodos({ page, limit, search, status, category, priority });
};

// Auth functions
export const register = async (userData: { email: string; password: string; name: string }): Promise<any> => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials: { email: string; password: string }): Promise<any> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async (): Promise<any> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async (): Promise<any> => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// WebSocket functions
export const connectWebSocket = (_onMessage: (data: any) => void, _onError?: (error: Event) => void): WebSocket | null => {
  return null;
};

export const disconnectWebSocket = (): void => {
};

export const sendWebSocketMessage = (_message: any): boolean => {
  return false;
};

export const getWebSocketStatus = (): string => {
  return 'disconnected';
};
