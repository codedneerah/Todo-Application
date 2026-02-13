// ====== MOCK DATA FOR DEVELOPMENT/TESTING ======
// Use this when the real API is not available

export const mockTodos = [
  {
    id: '1',
    title: 'Learn React',
    description: 'Study React fundamentals and hooks',
    completed: false,
    category: 'learning',
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Build Todo App',
    description: 'Create a functional todo application',
    completed: true,
    category: 'work',
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Implement WebSocket',
    description: 'Add real-time updates with WebSocket',
    completed: false,
    category: 'work',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Write Documentation',
    description: 'Create comprehensive API documentation',
    completed: false,
    category: 'work',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Exercise',
    description: 'Go for a 30-minute run',
    completed: false,
    category: 'health',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
];

export const getMockTodos = ({ page = 1, search = '', status = '', category = '', priority = '' }) => {
  let filtered = [...mockTodos];

  if (search) {
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status === 'completed') {
    filtered = filtered.filter((t) => t.completed);
  } else if (status === 'incomplete') {
    filtered = filtered.filter((t) => !t.completed);
  }

  if (category) {
    filtered = filtered.filter((t) => t.category === category);
  }

  if (priority) {
    filtered = filtered.filter((t) => t.priority === priority);
  }

  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTodos = filtered.slice(startIndex, endIndex);

  return {
    data: paginatedTodos,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
};
