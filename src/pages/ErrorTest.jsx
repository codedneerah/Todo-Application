import { useState } from "react";

export default function ErrorTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Intentional error for testing Error Boundary - This error was triggered by the user to test error handling");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-6xl mb-4">🧪</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Error Boundary Test</h1>
            <p className="text-gray-600 text-sm">
              This page is designed to test the Error Boundary component. Click the button below to deliberately trigger an error and see how the app handles it.
            </p>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-lg">ℹ️</span>
              What is Error Boundary?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Error Boundary is a React component that catches JavaScript errors anywhere in the child component tree, displays a fallback UI, and logs error information. This helps prevent the entire app from crashing.
            </p>
          </div>

          {/* Test Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Test Instructions
            </h3>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Click "Trigger Error" button below</li>
              <li>An intentional error will be thrown</li>
              <li>The Error Boundary should catch it and display an error message</li>
              <li>You should see an error fallback UI instead of a blank page</li>
              <li>A "Reload Page" button will appear to recover</li>
            </ol>
          </div>

          {/* Action Button */}
          <div className="space-y-3">
            <button
              onClick={() => setShouldThrow(true)}
              className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="text-lg">⚡</span>
              Trigger Error for Testing
            </button>

            <p className="text-xs text-gray-500 text-center">
              This action is safe and only for testing purposes.
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-3">
              <strong>Dev Note:</strong> The error triggered here will demonstrate how ErrorBoundary.jsx handles runtime errors.
            </p>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-xs font-mono text-gray-700 break-all">
                Error: Intentional error for testing Error Boundary
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
