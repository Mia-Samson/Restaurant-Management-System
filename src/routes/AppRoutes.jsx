import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import FoodMenu from "../pages/FoodMenu";
import Orders from "../pages/Orders";
import Payments from "../pages/Payments";
import Feedback from "../pages/Feedback"; // customer form
import Complaint from "../pages/Complaint"; // customer form
import FeedbackAdmin from "../pages/FeedbackAdmin"; // admin view
import ComplaintsAdmin from "../pages/ComplaintsAdmin"; // admin view

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />

        {/* Admin routes */}
        <Route path="/employees" element={<Employees />} />
        <Route path="/food-menu" element={<FoodMenu />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/admin/feedback" element={<FeedbackAdmin />} />
        <Route path="/admin/complaints" element={<ComplaintsAdmin />} />

        {/* Customer routes */}
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/complaint" element={<Complaint />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
