export default function Loader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 text-lg font-medium">Loading…</p>
      <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
    </div>
  );
}

