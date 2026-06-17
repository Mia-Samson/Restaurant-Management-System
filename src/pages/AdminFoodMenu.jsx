import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

const emptyForm = {
  food_name: "",
  category: "",
  price: "",
  description: "",
  image: "",
};

function AdminFoodMenu() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

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
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id || item.id);
    setFormData({
      food_name: item.food_name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: "",
    });
  };

  const resetForm = () => {
    setEditingId("");
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) formDataObj.append(key, formData[key]);
      });

      if (editingId) {
        await requestJson(`/food_menu/${editingId}`, {
          method: "PUT",
          headers: authHeaders,
          body: formDataObj,
        });
      } else {
        await requestJson("/food_menu", {
          method: "POST",
          headers: authHeaders,
          body: formDataObj,
        });
      }

      resetForm();
      loadItems();
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to save food item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this food item?")) return;
    try {
      await requestJson(`/food_menu/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setItems((current) =>
        current.filter((item) => (item._id || item.id) !== id),
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to delete food item");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Food Menu Management</h1>
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
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editingId ? "Update Item" : "Add Item"}
            </button>
            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
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
                <div className="admin-actions">
                  <button
                    className="secondary-btn"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="danger-btn"
                    onClick={() => handleDelete(item._id || item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminFoodMenu;

{
  /*import { useEffect, useState } from "react";
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
*/
}
