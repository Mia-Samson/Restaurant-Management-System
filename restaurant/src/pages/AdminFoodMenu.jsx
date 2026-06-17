import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

const emptyForm = {
  food_name: "",
  category: "",
  price: "",
  description: "",
  image: null,
};

function AdminFoodMenu() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadItems = async () => {
    const data = await requestJson("/food_menu.php");
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((p) => ({ ...p, image: files[0] }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const validate = () => {
    if (!formData.food_name.trim()) return "Food name required";
    if (!formData.category.trim()) return "Category required";
    if (Number(formData.price) <= 0) return "Price must be greater than 0";
    return null;
  };

  const reset = () => {
    setEditingId("");
    setFormData(emptyForm);
  };

  const startEdit = (item) => {
    setEditingId(item._id || item.id);
    setFormData({
      food_name: item.food_name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return setMessage(err);

    const fd = new FormData();
    fd.append("food_name", formData.food_name);
    fd.append("category", formData.category);
    fd.append("price", formData.price);
    fd.append("description", formData.description);

    if (formData.image) {
      fd.append("image", formData.image);
    }

    try {
      if (editingId) {
        //await fetch(`/food_menu/${editingId}`, {
        await fetch(`/food_menu.php?id=${editingId}`, {
          method: "PUT",
          headers: authHeaders,
          body: fd,
        });
        setMessage("Food item updated");
      } else {
        await fetch("/food_menu", {
          method: "POST",
          headers: authHeaders,
          body: fd,
        });
        setMessage("Food item added");
      }

      reset();
      loadItems();
    } catch (err) {
      setMessage("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;

    //await requestJson(`/food_menu/${id}`, {
    await requestJson(`/food_menu.php?id=${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    setItems((prev) => prev.filter((i) => (i._id || i.id) !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Food Menu Management</h1>
        {message && <p className="empty-state">{message}</p>}

        {/* FORM */}
        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            name="food_name"
            placeholder="Food Name"
            value={formData.food_name}
            onChange={handleChange}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>

            <option value="Main Course">Main Course</option>
            <option value="Starters">Starters</option>
            <option value="Desserts">Desserts</option>
            <option value="Beverages">Beverages</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input type="file" name="image" onChange={handleChange} />

          <div className="form-actions">
            <button className="primary-btn">
              {editingId ? "Update" : "Add"}
            </button>

            {editingId && (
              <button type="button" className="secondary-btn" onClick={reset}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-list">
          {items.map((item) => (
            <div className="admin-list-item" key={item._id || item.id}>
              <div className="col-name">
                <strong>{item.food_name}</strong>
                <small>{item.category}</small>
              </div>

              <div className="col-price">₹{item.price}</div>

              <div className="col-desc">{item.description?.slice(0, 40)}</div>

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
          ))}
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
