import { useRouteError } from "react-router-dom";

export default function ErrorFallback() {
  const error = useRouteError();

  return (
    <div role="alert" className="p-6 text-red-600">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p>{error?.message || "Unexpected error"}</p>
    </div>
  );
}
