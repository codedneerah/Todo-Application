import { api } from './axios';
import { getMockTodos } from './mock';

// Enable mock mode for development/testing
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const FALLBACK_TO_MOCK = true; // Fallback if API fails

// ====== TODO ENDPOINTS ======

/**
 * Get all todos with pagination (public todos)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-indexed)
 * @param {string} params.search - Search query
 * @param {string} params.status - Filter by status
 * @param {string} params.category - Filter by category
 * @param {string} params.priority - Filter by priority
 * @returns {Promise<Object>} Todos data with pagination info
 */
export const getTodos = async ({ page = 1, limit = 10, search = '', status = '', category = '', priority = '' }) => {
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock data');
    return getMockTodos({ page, search, status, category, priority });
  }

  try {
    // Try /tasks endpoint first (most reliable)
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
    
    // Handle API response with meta object
    if (response.data && response.data.data && response.data.meta) {
      return {
        data: response.data.data,
        total: response.data.meta.total || response.data.data.length,
        page: response.data.meta.page || page,
        limit: response.data.meta.limit || limit,
        totalPages: response.data.meta.totalPages || Math.ceil((response.data.meta.total || response.data.data.length) / limit),
      };
    }
    
    // Handle API response with data and total at root level
    if (response.data && response.data.data) {
      return {
        data: response.data.data,
        total: response.data.total || response.data.data.length,
        page,
        limit: limit,
        totalPages: Math.ceil((response.data.total || response.data.data.length) / limit),
      };
    }
    
    // If API returns array directly, format it
    if (Array.isArray(response.data)) {
      return {
        data: response.data.slice((page - 1) * limit, page * limit),
        total: response.data.length,
        page,
        limit: limit,
        totalPages: Math.ceil(response.data.length / limit),
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ getTodos error on /tasks:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
    });
    
    // Try /todos endpoint as fallback
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
        
        return fallbackResponse.data;
      } catch (taskError) {
        console.error('❌ /tasks endpoint also failed:', taskError.message);
      }
    }
    
    // Fallback to mock data on error
    if (FALLBACK_TO_MOCK) {
      console.log('📦 Falling back to mock data due to API error');
      return getMockTodos({ page, search, status, category, priority });
    }
    
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch todos (${error.response?.status || 'Network error'})`
    );
  }
};

/**
 * Get a single todo by ID
 * @param {string|number} id - Todo ID
 * @returns {Promise<Object>} Todo data
 */
export const getTodoById = async (id) => {
  try {
    // Try /todos endpoint first
    const response = await api.get(`/todos/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ getTodoById error on /todos:', error.message);
    
    // Try /tasks endpoint as fallback
    if (error.response?.status === 404) {
      try {
        const taskResponse = await api.get(`/tasks/${id}`);
        return taskResponse.data?.data || taskResponse.data;
      } catch (taskError) {
        console.error('❌ getTodoById also failed on /tasks:', taskError.message);
        throw taskError;
      }
    }
    
    throw new Error(error.response?.data?.message || 'Failed to fetch todo');
  }
};

/**
 * Create a new todo
 * @param {Object} payload - Todo data
 * @returns {Promise<Object>} Created todo
 */
export const createTodo = async (payload) => {
  // Get user from localStorage to include user ID
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  try {
    // Try /todos endpoint first with PUT method
    const response = await api.post('/todos', {
      title: payload.title || payload.name,
      description: payload.description || '',
      completed: payload.completed || false,
      category: payload.category || '',
      priority: payload.priority || 'medium',
      userId: user?.id || user?._id, // Include user ID for new users
      ...payload,
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ createTodo error on /todos:', error.message);
    
// Try /tasks endpoint as fallback
    if (error.response?.status === 404) {
      try {
        const taskResponse = await api.post('/tasks', {
          title: payload.title || payload.name,
          description: payload.description || '',
          completed: payload.completed || false,
          category: payload.category || '',
          priority: payload.priority || 'medium',
          userId: user?.id || user?._id, // Include user ID for new users
          ...payload,
        });
        return taskResponse.data?.data || taskResponse.data;
      } catch (taskError) {
        console.error('❌ createTodo also failed on /tasks:', taskError.message);
        throw taskError;
      }
    }
    
    throw new Error(error.response?.data?.message || 'Failed to create todo');
  }
};

/**
 * Update a todo
 * @param {Object} params - Update parameters
 * @param {string|number} params.id - Todo ID
 * @param {Object} params.payload - Updated todo data
 * @returns {Promise<Object>} Updated todo
 */
export const updateTodo = async ({ id, payload }) => {
  try {
    // Try /todos endpoint first with PUT method
    const response = await api.put(`/todos/${id}`, {
      title: payload.title || payload.name,
      description: payload.description || '',
      completed: payload.completed || false,
      category: payload.category || '',
      priority: payload.priority || 'medium',
      ...payload,
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('❌ updateTodo error on /todos with PUT:', error.message);
    
    // Try /tasks endpoint with PATCH as fallback
    if (error.response?.status === 404 || error.response?.status === 405) {
      try {
        const taskResponse = await api.patch(`/tasks/${id}`, {
          title: payload.title || payload.name,
          description: payload.description || '',
          completed: payload.completed || false,
          category: payload.category || '',
          priority: payload.priority || 'medium',
          ...payload,
        });
        return taskResponse.data?.data || taskResponse.data;
      } catch (taskError) {
        console.error('❌ updateTodo also failed on /tasks:', taskError.message);
        throw taskError;
      }
    }
    
    throw new Error(error.response?.data?.message || 'Failed to update todo');
  }
};

/**
 * Delete a todo
 * @param {string|number} id - Todo ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteTodo = async (id) => {
  try {
    // Try /todos endpoint first
    const response = await api.delete(`/todos/${id}`);
    return response.data?.data || response.data || { success: true };
  } catch (error) {
    console.error('❌ deleteTodo error on /todos:', error.message);
    
    // Try /tasks endpoint as fallback
    if (error.response?.status === 404) {
      try {
        const taskResponse = await api.delete(`/tasks/${id}`);
        return taskResponse.data?.data || taskResponse.data || { success: true };
      } catch (taskError) {
        console.error('❌ deleteTodo also failed on /tasks:', taskError.message);
        throw taskError;
      }
    }
    
    throw new Error(error.response?.data?.message || 'Failed to delete todo');
  }
};

/**
 * Get user's todos (authenticated)
 * Tries /todos endpoint first, falls back to /tasks
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-indexed)
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {string} params.category - Filter by category
 * @param {string} params.priority - Filter by priority
 * @returns {Promise<Object>} Paginated todos: { data: [...], total, page, limit, totalPages }
 */
export const getUserTodos = async ({ page = 1, limit = 10, search = '', status = '', category = '', priority = '' }) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock data for user todos');
    return getMockTodos({ page, search, status, category, priority });
  }

  try {
    // Try /todos endpoint first
    const response = await api.get('/todos', {
      params: {
        page,
        skip: (page - 1) * limit,
        limit: limit,
        search,
        status,
        category,
        priority,
        userOnly: true,
      },
    });
    console.log('✅ getUserTodos response from /todos:', response.data);
    
    // Handle different response formats
    if (response.data.data) {
      return response.data;
    }
    
    // If API returns array directly, format it
    if (Array.isArray(response.data)) {
      const sliced = response.data.slice((page - 1) * limit, page * limit);
      return {
        data: sliced,
        total: response.data.length,
        page,
        limit: limit,
        totalPages: Math.ceil(response.data.length / limit),
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ getUserTodos error on /todos:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
    });
    
    // Try /tasks endpoint as fallback
    if (error.response?.status === 404) {
      try {
        const fallbackResponse = await api.get('/tasks', {
          params: {
            page,
            skip: (page - 1) * limit,
            limit: limit,
            search,
            status,
            category,
            priority,
            userOnly: true,
          },
        });
        console.log('✅ getUserTodos response from /tasks (fallback):', fallbackResponse.data);
        
        // Handle different response formats
        if (fallbackResponse.data.data) {
          return fallbackResponse.data;
        }
        
        // If API returns array directly, format it
        if (Array.isArray(fallbackResponse.data)) {
          const sliced = fallbackResponse.data.slice((page - 1) * limit, page * limit);
          return {
            data: sliced,
            total: fallbackResponse.data.length,
            page,
            limit: limit,
            totalPages: Math.ceil(fallbackResponse.data.length / limit),
          };
        }
        
        return fallbackResponse.data;
      } catch (taskError) {
        console.error('❌ getUserTodos also failed on /tasks:', taskError.message);
        // Continue to error handling below
      }
    }
    
    // Fallback to mock data on error
    if (FALLBACK_TO_MOCK) {
      console.log('📦 Falling back to mock data due to API error');
      return getMockTodos({ page, search, status, category, priority });
    }
    
    // Provide more helpful error messages
    if (error.response?.status === 401) {
      throw new Error('Please log in to view your todos');
    }
    if (error.response?.status === 403) {
      throw new Error('You do not have permission to view these todos');
    }
    if (error.response?.status === 404) {
      throw new Error('No todos found');
    }
    
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch user todos (${error.response?.status || 'Network error'})`
    );
  }
};

// ====== AUTHENTICATION ENDPOINTS ======

/**
 * Register a new user
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', {
      email: userData.email,
      password: userData.password,
      name: userData.name,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

/**
 * Login user
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

/**
 * Get current user info
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    // Even if logout fails on server, clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: true };
  }
};

// ====== WEBSOCKET SERVICE ======

let ws = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000;
let reconnectTimeout = null;

/**
 * Connect to WebSocket for real-time task updates
 */
export const connectWebSocket = (onMessage, onError = null) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    return ws;
  }

  try {
    const token = localStorage.getItem('authToken');
    const wsUrl = token 
      ? `wss://api.oluwasetemi.dev/ws/client/tasks?token=${token}`
      : 'wss://api.oluwasetemi.dev/ws/client/tasks';

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      reconnectAttempts = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WebSocket message received:', data);
        onMessage(data);
      } catch (error) {
        console.error('❌ WebSocket message parse error:', error);
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      attemptReconnect(onMessage, onError);
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      if (onError) onError(error);
    };

    return ws;
  } catch (error) {
    console.error('❌ WebSocket connection failed:', error);
    if (onError) onError(error);
    return null;
  }
};

/**
 * Attempt to reconnect WebSocket
 */
const attemptReconnect = (onMessage, onError) => {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
    
    reconnectTimeout = setTimeout(() => {
      connectWebSocket(onMessage, onError);
    }, RECONNECT_INTERVAL);
  } else {
    console.error('❌ Max reconnection attempts reached');
  }
};

/**
 * Disconnect WebSocket
 */
export const disconnectWebSocket = () => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  if (ws) {
    ws.close();
    ws = null;
  }

  reconnectAttempts = 0;
};

/**
 * Send message through WebSocket
 */
export const sendWebSocketMessage = (message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
    return true;
  }
  console.warn('⚠️ WebSocket not connected');
  return false;
};

/**
 * Get WebSocket connection status
 */
export const getWebSocketStatus = () => {
  if (!ws) return 'disconnected';
  switch (ws.readyState) {
    case WebSocket.CONNECTING:
      return 'connecting';
    case WebSocket.OPEN:
      return 'connected';
    case WebSocket.CLOSING:
      return 'closing';
    case WebSocket.CLOSED:
      return 'disconnected';
    default:
      return 'unknown';
  }
};
