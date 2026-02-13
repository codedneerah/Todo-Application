import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoById, updateTodo, deleteTodo, getTodos } from "../api/todos";
import { useState } from "react";
import Loader from "../components/ui/Loader";
import SEOMeta from "../components/SEOMeta";
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaClock, FaCalendar, FaTag, FaFlag, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function TodoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => getTodoById(id),
  });

  // Fetch all todos to enable next/previous navigation
  const { data: allTodosData } = useQuery({
    queryKey: ["todos", "all"],
    queryFn: () => getTodos({ page: 1, search: '', status: '', category: '', priority: '' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTodo({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo", id] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      // Navigate back to list after deletion
      navigate("/");
    },
  });

  // Get next and previous todos
  const currentTodoIndex = allTodosData?.data?.findIndex(t => String(t.id) === String(id)) ?? -1;
  const previousTodo = currentTodoIndex > 0 ? allTodosData?.data?.[currentTodoIndex - 1] : null;
  const nextTodo = currentTodoIndex < (allTodosData?.data?.length - 1) ? allTodosData?.data?.[currentTodoIndex + 1] : null;

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-8xl mb-6">❌</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Todo Not Found</h2>
        <p className="text-gray-600 mb-6">The todo you're looking for doesn't exist or has been deleted.</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back to Todos
        </Link>
      </div>
    </div>
  );

  const handleEdit = () => {
    setEditForm({
      title: data.title,
      description: data.description || "",
      completed: data.completed,
      category: data.category || "",
      priority: data.priority || "",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate({ id: parseInt(id), payload: editForm });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this todo? This action cannot be undone.")) {
      deleteMutation.mutate(parseInt(id));
    }
  };

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
        title={`${data.title || 'Todo'} - TodoApp`}
        description={data.description ? data.description.substring(0, 150) : `View details for ${data.title || 'this todo'}`}
        keywords={`todo, task, ${data.category || 'tasks'}, ${data.priority || 'priority'}`}
        ogTitle={data.title}
        ogDescription={data.description || `A task in TodoApp - ${data.category ? `Category: ${data.category}` : ''}`}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back to Todos
          </Link>
          
          {/* Next/Previous Buttons */}
          <div className="flex gap-2">
            {previousTodo && (
              <Link
                to={`/todos/${previousTodo.id}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                title={`Previous: ${previousTodo.title}`}
              >
                <FaChevronLeft className="mr-2" />
                Previous
              </Link>
            )}
            {nextTodo && (
              <Link
                to={`/todos/${nextTodo.id}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                title={`Next: ${nextTodo.title}`}
              >
                Next
                <FaChevronRight className="ml-2" />
              </Link>
            )}
          </div>
        </div>

        {/* Main Content */}

          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 w-full mb-2"
                />
              ) : (
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.title}</h1>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {data.completed ? (
                    <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                      <FaCheck className="mr-2" size={14} />
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <FaClock className="mr-2" size={14} />
                      Pending
                    </span>
                  )}
                </div>

                {data.category && (
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(data.category)}`}>
                    <FaTag className="mr-1" size={12} />
                    {data.category}
                  </span>
                )}

                {data.priority && (
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(data.priority)}`}>
                    <FaFlag className="mr-1" size={12} />
                    {data.priority}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isAuthenticated && (
              <div className="flex gap-3 ml-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaEdit className="inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTrash className="inline mr-2" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>

              {isEditing ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add a description for this todo..."
                />
              ) : (
                <div className="prose max-w-none">
                  {data.description ? (
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {data.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">No description provided</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>

              {isEditing ? (
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.completed}
                      onChange={(e) => setEditForm({ ...editForm, completed: e.target.checked })}
                      className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Mark as completed</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">No category</option>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="health">Health</option>
                      <option value="learning">Learning</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">No priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${data.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-gray-900 font-medium">
                      {data.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  {data.category && (
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">Category</span>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(data.category)}`}>
                        {data.category}
                      </span>
                    </div>
                  )}

                  {data.priority && (
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">Priority</span>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(data.priority)}`}>
                        {data.priority}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaTag className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-600">ID: #{data.id}</span>
                </div>

                {data.createdAt && (
                  <div className="flex items-center gap-3">
                    <FaCalendar className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">
                      Created: {new Date(data.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {data.updatedAt && (
                  <div className="flex items-center gap-3">
                    <FaCalendar className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">
                      Updated: {new Date(data.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}
