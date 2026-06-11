import Navbar from "../components/Navbar";

function FoodMenu() {
  return (
    <>
      <Navbar />

      <main className="page-shell">
        <section className="page-header">
          <p className="eyebrow">Customer menu</p>
          <h1>Discover our signature dishes</h1>
          <p>
            A mix of comfort food, fresh ingredients, and flavors made for every
            craving.
          </p>
        </section>

        <section className="menu-card empty-state">
          <p></p>
        </section>
      </main>
    </>
  );
}

export default FoodMenu;
