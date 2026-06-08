import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🍽️ Food Haven</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/feedback">Feedback</Link>
        <Link to="/complaint">Complaint</Link>
        <Link to="/admin">Admin Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
