import { useRouteError } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from './Alert';

export default function ErrorFallback() {
  const error = useRouteError();

  return (
    <div role="alert" className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Alert variant="danger">
          <AlertTitle className="text-lg">Oops! Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            {error?.message || "An unexpected error occurred"}
          </AlertDescription>
          {error?.status && (
            <AlertDescription className="mt-2 text-xs">
              Error Code: {error.status}
            </AlertDescription>
          )}
        </Alert>
      </div>
    </div>
  );
}
