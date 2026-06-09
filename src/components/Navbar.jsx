import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🍽️ Food Haven</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/feedback">Feedback</Link>
        <Link to="/complaint">Complaint</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;

{
  /*export default Navbar;

import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🍽️ Food Haven</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/feedback">Feedback</Link>
        <Link to="/complaint">Complaint</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;*/
}
