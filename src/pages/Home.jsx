import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div className="home">
        <div className="hero-card">
          <h1>Welcome to Food Haven</h1>
          <p>Simple, Fast & Elegant Restaurant Experience</p>

          <Link to="/menu-placeholder">
            <button className="primary-btn">Explore Menu</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
