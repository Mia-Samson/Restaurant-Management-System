import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { requestJson } from "../services/api";

function FoodMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      const data = await requestJson("/food_menu.php");
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Menu Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

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

        <section className="menu-grid">
          {loading ? (
            <p className="empty-state">Loading menu...</p>
          ) : items.length === 0 ? (
            <p className="empty-state">No food items available.</p>
          ) : (
            items.map((item) => (
              <div className="menu-card" key={item._id || item.id}>
                {item.image && <img src={item.image} alt={item.food_name} />}
                <h3>{item.food_name}</h3>
                <p className="category">{item.category}</p>
                <p className="price">₹{item.price}</p>
                <p className="description">{item.description}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </>
  );
}

export default FoodMenu;

{
  /*
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

export default FoodMenu;*/
}
