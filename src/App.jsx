import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Feedback from "./pages/Feedback";
import Complaint from "./pages/Complaint";
import AdminLogin from "./pages/AdminLogin";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
