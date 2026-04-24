import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "../api/todos";
import { useForm } from "react-hook-form";

interface Todo {
  id: string | number;
  title: string;
  description?: string;
  completed: boolean;
}

interface EditTodoProps {
  todo: Todo;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  completed: boolean;
}

export default function EditTodo({ todo, onClose }: EditTodoProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: todo.title,
      description: todo.description || "",
      completed: todo.completed,
    },
  });

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: FormData }) => updateTodo({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", todo.id] });
      onClose();
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({ id: todo.id, payload: data });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-6">Edit Todo</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter todo title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Enter description (optional)"
            />
          </div>
          <div className="mb-8">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("completed")}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium">Mark as completed</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {mutation.isPending ? "Updating..." : "Update Todo"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
          {mutation.isError && (
            <p className="text-red-500 text-sm mt-3 text-center">
              Error updating todo. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
