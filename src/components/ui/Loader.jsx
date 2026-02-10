export default function Loader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center min-h-screen"
    >
      <p className="text-gray-600 text-lg">Loading…</p>
    </div>
  );
}

