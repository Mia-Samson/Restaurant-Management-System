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
import FeedbackAdmin from "./pages/FeedbackAdmin";
import ComplaintsAdmin from "./pages/ComplaintsAdmin";
import Employees from "./pages/Employees";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import OrdersAdmin from "./pages/OrdersAdmin";
import PaymentsAdmin from "./pages/PaymentsAdmin";

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
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payments" element={<Payments />} />
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
              <OrdersAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <PaymentsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute>
              <FeedbackAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <ComplaintsAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
