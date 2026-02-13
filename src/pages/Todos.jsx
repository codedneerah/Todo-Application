import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, deleteTodo, getUserTodos } from "../api/todos";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateTodo from "../components/CreateTodo";
import EditTodo from "../components/EditTodo";
import Loader from "../components/ui/Loader";
import SEOMeta from "../components/SEOMeta";
import { FaEdit, FaTrash, FaCheck, FaClock, FaSearch, FaFilter, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function Todos() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [jumpPage, setJumpPage] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos", page, itemsPerPage, search, status, category, priority, isAuthenticated],
    queryFn: () => isAuthenticated ? getUserTodos({ page, limit: itemsPerPage, search, status, category, priority }) : getTodos({ page, limit: itemsPerPage, search, status, category, priority }),
  });



  if (isLoading) return <Loader />;
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Todos</h2>
        <p className="text-gray-600 mb-6 text-sm">{error.message}</p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
          <Link
            to="/login"
            className="block w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Go to Login
          </Link>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          Check your browser console for more details about this error.
        </p>
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
    <>
      <SEOMeta
        title="Tasks"
        description="Manage your tasks efficiently with TodoApp. Create, edit, and organize your todos with powerful filtering and categorization features."
        keywords="todos, tasks, task manager, productivity, todo list"
        ogTitle="TodoApp - Task Management"
        ogDescription="Organize and manage your tasks efficiently"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <section className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {isAuthenticated ? `${user?.name}'s Tasks` : 'Todo Application'}
                </h1>
                <p className="text-gray-600 text-lg">Manage your tasks efficiently and stay organized</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:flex md:gap-8">
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-500 font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900" aria-label={`Total tasks: ${data?.total || 0}`}>
                    {data?.total || 0}
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-500 font-medium">Completed</p>
                  <p
                    className="text-3xl font-bold text-green-600"
                    aria-label={`Completed tasks: ${data?.data?.filter(todo => todo.completed).length || 0}`}
                  >
                    {data?.data?.filter(todo => todo.completed).length || 0}
                  </p>
                </div>
              </div>
            </div>
          </header>

        {/* Filters and Controls */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8" aria-label="Search and filter tasks">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <label htmlFor="search-todos" className="sr-only">Search tasks</label>
                <FaSearch className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
                <input
                  id="search-todos"
                  type="search"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search tasks by title or description"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div>
                  <label htmlFor="filter-status" className="sr-only">Filter by status</label>
                  <select
                    id="filter-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Filter tasks by completion status"
                  >
                    <option value="">All Status</option>
                    <option value="completed">✅ Completed</option>
                    <option value="incomplete">⏳ Pending</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="filter-category" className="sr-only">Filter by category</label>
                  <select
                    id="filter-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Filter tasks by category"
                  >
                    <option value="">All Categories</option>
                    <option value="work">💼 Work</option>
                    <option value="personal">🏠 Personal</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="filter-priority" className="sr-only">Filter by priority</label>
                  <select
                    id="filter-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Filter tasks by priority level"
                  >
                    <option value="">All Priorities</option>
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              {/* View Mode Toggle */}
              <fieldset className="flex items-center gap-2">
                <legend className="sr-only">View mode</legend>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${viewMode === "grid" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                  aria-label="Switch to grid view"
                  aria-pressed={viewMode === "grid"}
                >
                  ⊞
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${viewMode === "list" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                  aria-label="Switch to list view"
                  aria-pressed={viewMode === "list"}
                >
                  ☰
                </button>
              </fieldset>

              <CreateTodo />
            </div>
          </form>

          {/* Active Filters Display */}
          {(search || status || category || priority) && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Remove search filter: ${search}`}
                >
                  Search: "{search}"
                  <span aria-hidden="true" className="ml-2">×</span>
                </button>
              )}
              {status && (
                <button
                  type="button"
                  onClick={() => setStatus("")}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label={`Remove status filter: ${status}`}
                >
                  Status: {status}
                  <span aria-hidden="true" className="ml-2">×</span>
                </button>
              )}
              {category && (
                <button
                  type="button"
                  onClick={() => setCategory("")}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label={`Remove category filter: ${category}`}
                >
                  Category: {category}
                  <span aria-hidden="true" className="ml-2">×</span>
                </button>
              )}
              {priority && (
                <button
                  type="button"
                  onClick={() => setPriority("")}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label={`Remove priority filter: ${priority}`}
                >
                  Priority: {priority}
                  <span aria-hidden="true" className="ml-2">×</span>
                </button>
              )}
            </div>
          )}
        </section>

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
                        className="font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors block mb-2 truncate"
                        title={todo.title}
                      >
                        {todo.title || 'Untitled Task'}
                      </Link>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">{todo.description || 'No description'}</p>
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
                          className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors block mb-1"
                          title={todo.title}
                        >
                          {todo.title || 'Untitled Task'}
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">{todo.description || 'No description'}</p>
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Results Info */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Showing <span className="text-blue-600 font-bold">{((page - 1) * itemsPerPage) + 1}</span> to <span className="text-blue-600 font-bold">{Math.min(page * itemsPerPage, data.total)}</span> of <span className="text-blue-600 font-bold">{data.total}</span> results
                  </p>
                </div>

                {/* Items Per Page */}
                <div className="flex items-center gap-3">
                  <label htmlFor="items-per-page" className="text-sm text-gray-600 font-medium">Items per page:</label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col gap-6">
                {/* Main Navigation - Previous/Next buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-blue-600 border border-blue-700 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-400 transition-colors"
                    aria-label="Previous page"
                  >
                    <FaChevronLeft size={16} />
                    <span>Back</span>
                  </button>

                  {/* Page Numbers - Show more pages */}
                  <div className="flex gap-1 flex-wrap justify-center max-w-2xl">
                    <button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className="min-w-[40px] h-10 text-sm font-medium rounded-lg transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 disabled:bg-blue-600 disabled:text-white disabled:border-blue-700"
                      aria-label="First page"
                      title="Go to first page"
                    >
                      1
                    </button>
                    
                    {Math.max(1, Math.min(data.totalPages - 6, page - 3)) > 1 && (
                      <span className="px-2 py-2 text-gray-500">...</span>
                    )}

                    {Array.from({ length: Math.min(7, data.totalPages - 1) }, (_, i) => {
                      let startPage = Math.max(2, Math.min(data.totalPages - 6, page - 3));
                      if (data.totalPages === 1) return null;
                      const pageNum = startPage + i;
                      if (pageNum >= data.totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`min-w-[40px] h-10 text-sm font-medium rounded-lg transition-colors ${
                            page === pageNum
                              ? "bg-blue-600 text-white border border-blue-700"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                          }`}
                          aria-current={page === pageNum ? "page" : undefined}
                          aria-label={`Go to page ${pageNum}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {Math.min(data.totalPages - 6, page - 3) + 7 < data.totalPages && (
                      <span className="px-2 py-2 text-gray-500">...</span>
                    )}

                    {data.totalPages > 1 && (
                      <button
                        onClick={() => setPage(data.totalPages)}
                        disabled={page === data.totalPages}
                        className="min-w-[40px] h-10 text-sm font-medium rounded-lg transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 disabled:bg-blue-600 disabled:text-white disabled:border-blue-700"
                        aria-label="Last page"
                        title="Go to last page"
                      >
                        {data.totalPages}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, data.totalPages))}
                    disabled={page >= data.totalPages}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-blue-600 border border-blue-700 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-400 transition-colors"
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <FaChevronRight size={16} />
                  </button>
                </div>

                {/* Jump to Page */}
                <div className="flex items-center justify-center gap-3 flex-wrap py-4 border-y border-gray-200">
                  <label htmlFor="jump-page" className="text-sm text-gray-600 font-medium">Jump to page:</label>
                  <div className="flex gap-2">
                    <input
                      id="jump-page"
                      type="number"
                      min="1"
                      max={data.totalPages}
                      value={jumpPage}
                      onChange={(e) => setJumpPage(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
                      placeholder={`1-${data.totalPages}`}
                      aria-label="Enter page number to jump to"
                    />
                    <button
                      onClick={() => {
                        const pageNum = parseInt(jumpPage);
                        if (pageNum >= 1 && pageNum <= data.totalPages) {
                          setPage(pageNum);
                          setJumpPage("");
                        } else {
                          alert(`Please enter a page number between 1 and ${data.totalPages}`);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      aria-label="Jump to page"
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>

              {/* Page Info */}
              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">
                  Page <span className="text-blue-600 font-bold">{page}</span> of <span className="text-blue-600 font-bold">{data.totalPages}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingTodo && (
          <EditTodo todo={editingTodo} onClose={() => setEditingTodo(null)} />
        )}
      </section>
      </div>
    </>
  );
}
