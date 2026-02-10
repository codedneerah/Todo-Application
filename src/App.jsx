import { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import LoginNotification from "./components/LoginNotification";
import Loader from "./components/ui/Loader";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LoginNotification />
      <Suspense fallback={<Loader />}>
        <AppRoutes />
      </Suspense>
    </div>
  );
}
