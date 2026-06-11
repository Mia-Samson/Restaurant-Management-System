import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import FoodMenu from "./pages/FoodMenu";
import Feedback from "./pages/Feedback";
import Complaint from "./pages/Complaint";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFoodMenu from "./pages/AdminFoodMenu";
import AdminOperations from "./pages/AdminOperations";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<FoodMenu />} />
        <Route path="/food-menu" element={<FoodMenu />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminOperations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/food-menu"
          element={
            <ProtectedRoute>
              <AdminFoodMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOperations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <AdminOperations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute>
              <AdminOperations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <AdminOperations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
