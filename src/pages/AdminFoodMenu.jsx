import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

function AdminFoodMenu() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    food_name: "",
    category: "",
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      const data = await requestJson("/food_menu.php");
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await requestJson("/food_menu.php", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          food_name: formData.food_name,
          category: formData.category,
          price: formData.price,
          description: formData.description,
        }),
      });

      setFormData({ food_name: "", category: "", price: "", description: "" });
      loadItems();
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to add food item");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Food Menu Management</h1>
        <p>Add items that appear in the customer menu.</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            name="food_name"
            placeholder="Food name"
            value={formData.food_name}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
          <button type="submit" className="primary-btn">
            Add Item
          </button>
        </form>

        <div className="admin-list">
          <h2>Current Items</h2>
          {loading ? (
            <p>Loading menu...</p>
          ) : items.length === 0 ? (
            <p>No food items yet.</p>
          ) : (
            items.map((item) => (
              <div className="admin-list-item" key={item._id || item.id}>
                <strong>{item.food_name}</strong>
                <span>{item.category}</span>
                <span>₹{item.price}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminFoodMenu;
