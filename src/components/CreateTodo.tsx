import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "../api/todos";
import { useForm } from "react-hook-form";
// Types imported from react-hook-form

interface CreateTodoFormData {
  title: string;
  description?: string;
  completed?: boolean;
}

interface CreateTodoProps {}

const CreateTodo: React.FC<CreateTodoProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTodoFormData>({
    defaultValues: {
      title: '',
      description: '',
      completed: false,
    },
  });

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsOpen(false);
      reset();
    },
  });

  const onSubmit = (data: CreateTodoFormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        aria-label="Add new todo"
      >
        Add Todo
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="create-todo-title">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h2 id="create-todo-title" className="text-2xl font-bold mb-6">Create New Todo</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter todo title"
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                  placeholder="Enter description (optional)"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("completed")}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Mark as completed
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {mutation.isPending ? "Creating..." : "Create Todo"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  disabled={mutation.isPending}
                >
                  Cancel
                </button>
              </div>
              {mutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
                  <p className="text-sm text-red-800">Failed to create todo. Please try again.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );

};

export default CreateTodo;

