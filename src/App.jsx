import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Feedback from "./pages/Feedback";
import Complaint from "./pages/Complaint";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/complaint" element={<Complaint />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
