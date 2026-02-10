import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, deleteTodo, getUserTodos } from "../api/todos";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateTodo from "../components/CreateTodo";
import EditTodo from "../components/EditTodo";
import Loader from "../components/ui/Loader";
import { FaEdit, FaTrash, FaCheck, FaClock, FaSearch, FaFilter, FaPlus } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function Todos() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["todos", page, search, status, category, priority, isAuthenticated],
    queryFn: () => isAuthenticated ? getUserTodos({ page, search, status, category, priority }) : getTodos({ page, search, status, category, priority }),
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, category, priority]);

  if (isLoading) return <Loader />;
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Todos</h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    </div>
  );

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: 'bg-blue-100 text-blue-800',
      personal: 'bg-purple-100 text-purple-800',
      health: 'bg-green-100 text-green-800',
      learning: 'bg-orange-100 text-orange-800',
    };
    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isAuthenticated ? `${user?.name}'s Tasks` : 'Todo Application'}
              </h1>
              <p className="text-gray-600 text-lg">Manage your tasks efficiently and stay organized</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{data?.total || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {data?.data?.filter(todo => todo.completed).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                aria-label="Search todos"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                aria-label="Filter by status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="completed">✅ Completed</option>
                <option value="incomplete">⏳ Pending</option>
              </select>

              <select
                aria-label="Filter by category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="work">💼 Work</option>
                <option value="personal">🏠 Personal</option>
              </select>

              <select
                aria-label="Filter by priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg border ${viewMode === "grid" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300"}`}
                aria-label="Grid view"
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-lg border ${viewMode === "list" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300"}`}
                aria-label="List view"
              >
                ☰
              </button>
            </div>

            <CreateTodo />
          </div>

          {/* Active Filters Display */}
          {(search || status || category || priority) && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2">Active filters:</span>
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                </span>
              )}
              {status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Status: {status}
                  <button onClick={() => setStatus("")} className="ml-2 text-green-600 hover:text-green-800">×</button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  Category: {category}
                  <button onClick={() => setCategory("")} className="ml-2 text-purple-600 hover:text-purple-800">×</button>
                </span>
              )}
              {priority && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  Priority: {priority}
                  <button onClick={() => setPriority("")} className="ml-2 text-orange-600 hover:text-orange-800">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Todo Grid/List */}
        <div className="mb-8">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.data?.map((todo) => (
                <div key={todo.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link
                        to={`/todos/${todo.id}`}
                        className="font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors block mb-2"
                      >
                        {todo.title}
                      </Link>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">{todo.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingTodo(todo)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Edit todo"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this todo?")) {
                            deleteMutation.mutate(todo.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete todo"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {todo.completed ? (
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                          <FaCheck className="mr-1" size={12} />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                          <FaClock className="mr-1" size={12} />
                          Pending
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#{todo.id}</span>
                  </div>

                  <div className="flex gap-2">
                    {todo.category && (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(todo.category)}`}>
                        {todo.category}
                      </span>
                    )}
                    {todo.priority && (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(todo.priority)}`}>
                        {todo.priority}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.data?.map((todo) => (
                <div key={todo.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0">
                        {todo.completed ? (
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <FaCheck className="text-green-600" size={14} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <FaClock className="text-yellow-600" size={14} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Link
                          to={`/todos/${todo.id}`}
                          className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {todo.title}
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">{todo.description}</p>
                        <div className="flex gap-2 mt-2">
                          {todo.category && (
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(todo.category)}`}>
                              {todo.category}
                            </span>
                          )}
                          {todo.priority && (
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(todo.priority)}`}>
                              {todo.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTodo(todo)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label="Edit todo"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this todo?")) {
                            deleteMutation.mutate(todo.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Delete todo"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {data?.data?.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No todos found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first task!</p>
            <CreateTodo />
          </div>
        )}

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data.total)} of {data.total} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(data.totalPages - 4, page - 2)) + i;
                    if (pageNum > data.totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          page === pageNum
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingTodo && (
          <EditTodo todo={editingTodo} onClose={() => setEditingTodo(null)} />
        )}
      </main>
    </div>
  );
}
