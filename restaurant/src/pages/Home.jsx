import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <main className="home-page clean-hero">
        <section className="hero-simple">
          <p className="eyebrow">Food Haven</p>

          <h1>
            A refined dining
            <br />
            experience.
          </h1>

          <p className="subtext">
            Thoughtfully prepared dishes, rooted in quality ingredients and
            timeless flavors — served with care, every time.
          </p>

          <div className="hero-actions">
            <Link to="/menu" className="primary-btn">
              Explore Menu
            </Link>
            <Link to="/orders" className="secondary-btn">
              Place Order
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;

{
  /*import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <main className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <p className="eyebrow">Freshly prepared in every bite</p>
            <h1>Welcome to Food Haven</h1>
            <p>
              Enjoy a warm dining experience with flavorful dishes, quick
              service, and a friendly atmosphere.
            </p>

            <div className="hero-actions">
              <Link to="/menu" className="primary-btn">
                Explore Menu
              </Link>
              <Link to="/feedback" className="secondary-btn">
                Share Feedback
              </Link>
            </div>
          </div>

         

        </section>

        <section className="info-grid">
          <article className="info-card">
            <h3>Fast Service</h3>
            <p>Order favorites with quick, friendly support from our team.</p>
          </article>
          <article className="info-card">
            <h3>Fresh Ingredients</h3>
            <p>Every plate is crafted with care and quality produce.</p>
          </article>
          <article className="info-card">
            <h3>Customer First</h3>
            <p>Share your thoughts and let us improve your experience.</p>
          </article>
        </section>

       
      </main>
    </>
  );
}

export default Home;*/
}
