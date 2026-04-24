import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoById, updateTodo, deleteTodo } from "../api/todos";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SEOMeta from "../components/SEOMeta";
import Loader from "../components/ui/Loader";
import { FaArrowLeft, FaCheck, FaClock, FaEdit, FaTrash } from "react-icons/fa";

interface TodoFormData {
  title: string;
  description: string;
  completed: boolean;
}

export default function TodoDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: todo, isLoading, error } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => getTodoById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: TodoFormData) => updateTodo({ id: id!, payload: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo", id] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTodo(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate("/");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormData>({
    defaultValues: {
      title: todo?.title || "",
      description: todo?.description || "",
      completed: todo?.completed || false,
    },
  });

  const onSubmit = (data: TodoFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <Loader />;

  if (error || !todo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{(error as Error)?.message || "Todo not found"}</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Back to todos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOMeta
        title={todo.title}
        description={todo.description || "View todo details"}
        ogTitle={todo.title}
        ogDescription={todo.description}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to todos
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {todo.completed ? (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    <FaCheck className="mr-1" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                    <FaClock className="mr-1" />
                    Pending
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaEdit className="mr-1" />
                  {isEditing ? "Cancel" : "Edit"}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this todo?")) {
                      deleteMutation.mutate();
                    }
                  }}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  disabled={deleteMutation.isPending}
                >
                  <FaTrash className="mr-1" />
                  Delete
                </button>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    {...register("description")}
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      {...register("completed")}
                    />
                    Mark as completed
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">{todo.title}</h1>
                <p className="text-gray-600">{todo.description || "No description provided"}</p>

                <div className="flex gap-2">
                  {todo.category && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {todo.category}
                    </span>
                  )}
                  {todo.priority && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                      {todo.priority}
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Created: {todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : "Unknown"}</p>
                  <p className="text-sm text-gray-500">Updated: {todo.updatedAt ? new Date(todo.updatedAt).toLocaleDateString() : "Unknown"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

