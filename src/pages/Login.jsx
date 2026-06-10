import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { requestJson } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await requestJson("/login.php", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      // Store JWT token
      localStorage.setItem("token", data.token);
      navigate("/");

      alert("Login successful!");

      // ✅ IMPORTANT: redirect after login
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message || "Invalid credentials");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Admin Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="primary-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
{
  /*import Navbar from "../components/Navbar";

function Login() {
  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Admin Login</h2>

          <input placeholder="Username" />
          <input type="password" placeholder="Password" />

          <button className="primary-btn">Login</button>
        </div>
      </div>
    </>
  );
}

export default Login;*/
}
