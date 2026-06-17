import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🍽️ Food Haven</h2>

      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/feedback">Feedback</NavLink>
        <NavLink to="/complaint">Complaint</NavLink>
        <NavLink to="/orders">My Orders</NavLink>
        <NavLink to="/payments">My Payments</NavLink>
        <NavLink to="/login">Login</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
