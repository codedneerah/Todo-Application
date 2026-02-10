import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "../api/todos";
import { useForm } from "react-hook-form";

export default function CreateTodo() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsOpen(false);
      reset();
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Todo
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Todo</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter todo title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...register("description")}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter description"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("completed")}
                    className="mr-2"
                  />
                  Completed
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {mutation.isPending ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
