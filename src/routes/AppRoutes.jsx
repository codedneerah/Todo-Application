import { Routes, Route } from "react-router-dom";
import Todos from "../pages/Todos";
import TodoDetails from "../pages/TodoDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import ErrorTest from "../pages/ErrorTest";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Todos />} />
      <Route path="/todos/:id" element={<TodoDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/error-test" element={<ErrorTest />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
