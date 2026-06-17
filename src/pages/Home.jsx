import { Link } from "react-router-dom";
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

          {/* <div className="hero-panel">
            <h3>Today&apos;s Specials</h3>
            <ul>
              <li>Signature Pizza</li>
              <li>Refreshing Mocktails</li>
              <li>Chef&apos;s Dessert Box</li>
            </ul>
          </div>*/}
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

        {/*<section className="featured-section">
          <div className="section-heading">
            <p className="eyebrow">Coming soon</p>
            <h2>Menu updates will appear here</h2>
          </div>

          <div className="menu-card empty-state">
            <p>
              The restaurant menu will be shown here once admin items are added.
            </p>
          </div>
        </section>*/}
      </main>
    </>
  );
}

export default Home;
