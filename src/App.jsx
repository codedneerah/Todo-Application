import { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import LoginNotification from "./components/LoginNotification";
import Loader from "./components/ui/Loader";
import ErrorBoundary from "./components/ErrorBoundary";
import SEOMeta from "./components/SEOMeta";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <ErrorBoundary>
      <SEOMeta />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <LoginNotification />
        <main
          id="main-content"
          className="flex-1"
          role="main"
          tabIndex="-1"
        >
          <Suspense fallback={<Loader />}>
            <AppRoutes />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
