// Mock data for demonstration since the API endpoint is not available
let mockTodos = [
  { id: 1, title: "Learn React", description: "Study React fundamentals", completed: false, userId: 1 },
  { id: 2, title: "Build Todo App", description: "Create a functional todo application", completed: true, userId: 1 },
  { id: 3, title: "Add Pagination", description: "Implement pagination for todo list", completed: false, userId: 1 },
  { id: 4, title: "Style Components", description: "Apply Tailwind CSS styling", completed: true, userId: 1 },
  { id: 5, title: "Test Application", description: "Test all features and fix bugs", completed: false, userId: 1 },
  { id: 6, title: "Deploy App", description: "Deploy to production environment", completed: false, userId: 1 },
  { id: 7, title: "Write Documentation", description: "Create comprehensive README", completed: true, userId: 1 },
  { id: 8, title: "Add Error Handling", description: "Implement error boundaries", completed: true, userId: 1 },
  { id: 9, title: "Optimize Performance", description: "Improve app performance", completed: false, userId: 1 },
  { id: 10, title: "Add Accessibility", description: "Ensure WCAG compliance", completed: false, userId: 1 },
  { id: 11, title: "Implement Search", description: "Add search functionality", completed: true, userId: 1 },
  { id: 12, title: "Add Filtering", description: "Implement status filtering", completed: true, userId: 1 },
  { id: 13, title: "Learn TypeScript", description: "Study TypeScript for better development", completed: false, userId: 2 },
  { id: 14, title: "Setup CI/CD", description: "Configure continuous integration and deployment", completed: false, userId: 2 },
  { id: 15, title: "Code Review", description: "Review pull requests and provide feedback", completed: true, userId: 2 },
];

let mockUsers = [
  { id: 1, email: "user@example.com", password: "password123", name: "Demo User" },
  { id: 2, email: "admin@example.com", password: "admin123", name: "Admin User" },
];

let currentUser = null;
let authToken = null;

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getTodos = async ({ page = 1, search = "", status = "" }) => {
  await delay();

  let filteredTodos = mockTodos;

  // Apply search filter
  if (search) {
    filteredTodos = filteredTodos.filter(todo =>
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply status filter
  if (status === "completed") {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  } else if (status === "incomplete") {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  }

  // Apply pagination
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTodos = filteredTodos.slice(startIndex, endIndex);

  return {
    data: paginatedTodos,
    total: filteredTodos.length,
    page,
    limit,
    totalPages: Math.ceil(filteredTodos.length / limit),
  };
};

export const getTodoById = async (id) => {
  await delay();
  const todo = mockTodos.find(t => t.id === parseInt(id));
  if (!todo) {
    throw new Error("Todo not found");
  }
  return todo;
};

export const createTodo = async (payload) => {
  await delay();
  const newId = Math.max(...mockTodos.map(t => t.id)) + 1;
  const newTodo = {
    id: newId,
    title: payload.title,
    description: payload.description || "",
    completed: payload.completed || false,
  };
  mockTodos.push(newTodo);
  return newTodo;
};

export const updateTodo = async ({ id, payload }) => {
  await delay();
  const index = mockTodos.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    throw new Error("Todo not found");
  }
  mockTodos[index] = { ...mockTodos[index], ...payload };
  return mockTodos[index];
};

export const deleteTodo = async (id) => {
  await delay();
  const index = mockTodos.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    throw new Error("Todo not found");
  }
  mockTodos.splice(index, 1);
  return { success: true };
};

// Authentication functions
export const register = async (userData) => {
  await delay();
  const existingUser = mockUsers.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  const newUser = {
    id: Math.max(...mockUsers.map(u => u.id)) + 1,
    email: userData.email,
    password: userData.password, // In real app, this would be hashed
    name: userData.name,
  };
  mockUsers.push(newUser);
  currentUser = newUser;
  authToken = `token_${newUser.id}`;
  return { user: newUser, token: authToken };
};

export const login = async (credentials) => {
  await delay();
  const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
  if (!user) {
    throw new Error("Invalid credentials");
  }
  currentUser = user;
  authToken = `token_${user.id}`;
  return { user, token: authToken };
};

export const logout = async () => {
  await delay();
  currentUser = null;
  authToken = null;
  return { success: true };
};

export const getCurrentUser = async () => {
  await delay();
  if (!currentUser) {
    throw new Error("Not authenticated");
  }
  return currentUser;
};

export const getUserTodos = async ({ page = 1, search = "", status = "" }) => {
  await delay();
  if (!currentUser) {
    throw new Error("Not authenticated");
  }

  let userTodos = mockTodos.filter(todo => todo.userId === currentUser.id);

  // Apply search filter
  if (search) {
    userTodos = userTodos.filter(todo =>
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply status filter
  if (status === "completed") {
    userTodos = userTodos.filter(todo => todo.completed);
  } else if (status === "incomplete") {
    userTodos = userTodos.filter(todo => !todo.completed);
  }

  // Apply pagination
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTodos = userTodos.slice(startIndex, endIndex);

  return {
    data: paginatedTodos,
    total: userTodos.length,
    page,
    limit,
    totalPages: Math.ceil(userTodos.length / limit),
  };
};

export const createUserTodo = async (payload) => {
  await delay();
  if (!currentUser) {
    throw new Error("Not authenticated");
  }
  const newId = Math.max(...mockTodos.map(t => t.id)) + 1;
  const newTodo = {
    id: newId,
    title: payload.title,
    description: payload.description || "",
    completed: payload.completed || false,
    userId: currentUser.id,
  };
  mockTodos.push(newTodo);

  // Notify WebSocket subscribers
  if (window.ws && window.ws.readyState === WebSocket.OPEN) {
    window.ws.send(JSON.stringify({
      type: 'task_created',
      data: newTodo
    }));
  }

  return newTodo;
};

// WebSocket functionality
export const connectWebSocket = (onMessage) => {
  if (window.ws && window.ws.readyState === WebSocket.OPEN) {
    return window.ws;
  }

  try {
    const ws = new WebSocket('wss://api.oluwasetemi.dev/ws/tasks');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Auto-reconnect after 5 seconds
      setTimeout(() => connectWebSocket(onMessage), 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    window.ws = ws;
    return ws;
  } catch (error) {
    console.error('WebSocket connection failed:', error);
    return null;
  }
};

export const disconnectWebSocket = () => {
  if (window.ws) {
    window.ws.close();
    window.ws = null;
  }
};
