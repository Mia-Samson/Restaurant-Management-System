import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

const emptyForm = {
  customer_name: "",
  order_type: "Dine In",
  address: "",
  payment_method: "Cash",
  order_date: "",
  items: [],
};

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [item, setItem] = useState({ food_item: "", quantity: 1 });
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadOrders = async () => {
    const data = await requestJson("/get_orders.php", {
      headers: authHeaders,
    });
    console.log("ADMIN RESPONSE:", data);
    setOrders(Array.isArray(data) ? data : []);
  };

  const loadMenu = async () => {
    const data = await requestJson("/food_menu.php", {
      headers: authHeaders,
    });
    setMenu(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadOrders();
    loadMenu();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem((p) => ({ ...p, [name]: value }));
  };

  const addItem = () => {
    if (!item.food_item) return;

    const selectedItem = menu.find((m) => m.food_name === item.food_item);

    if (!selectedItem) {
      console.log("Food not found");
      return;
    }

    setForm((p) => ({
      ...p,
      items: [
        ...p.items,
        {
          food_item: item.food_item,
          quantity: Number(item.quantity),
          price: Number(selectedItem.price || 0),
        },
      ],
    }));

    setItem({ food_item: "", quantity: 1 });
  };

  const removeItem = (index) => {
    setForm((p) => ({
      ...p,
      items: p.items.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    if (!form.customer_name.trim()) return "Customer required";
    if (form.items.length === 0) return "Add at least one item";
    if (form.order_type === "Delivery" && !form.address.trim())
      return "Address required for delivery";
    return null;
  };

  const reset = () => {
    setForm(emptyForm);
    setItem({ food_item: "", quantity: 1 });
    setEditingId("");
  };

  const startEdit = (o) => {
    setEditingId(o._id || o.id);

    setForm({
      customer_name: o.customer_name,
      order_type: o.order_type,
      address: o.address || "",
      payment_method: o.payment_method || "Cash",
      order_date: o.order_date?.slice?.(0, 10) || "",
      items: o.items || [],
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return setMessage(err);

    const payload = {
      customer_name: form.customer_name,
      order_type: form.order_type,
      address: form.address,
      payment_method: form.payment_method,
      order_date: form.order_date || new Date().toISOString(),
      items: form.items,
    };

    if (editingId) {
      await requestJson(`/orders/${editingId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      setMessage("Order updated");
    } else {
      await requestJson("/create_order.php", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      setMessage("Order created");
    }

    reset();
    loadOrders();
  };

  const handleDelete = async (id) => {
    await requestJson(`/orders/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    setOrders((p) => p.filter((o) => (o._id || o.id) !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Order Management</h1>

        {message && <p className="empty-state">{message}</p>}

        {/* FORM */}
        <form className="admin-form" onSubmit={submit}>
          {/* CUSTOMER NAME */}
          <input
            name="customer_name"
            placeholder="Customer Name"
            value={form.customer_name}
            onChange={handleChange}
            required
          />

          {/* ITEM BUILDER */}
          <div className="item-entry">
            <select
              name="food_item"
              value={item.food_item}
              onChange={handleItemChange}
            >
              <option value="">Select Food</option>
              {menu.map((m) => (
                <option key={m._id || m.id} value={m.food_name}>
                  {m.food_name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              min="1"
              value={item.quantity}
              onChange={handleItemChange}
            />

            <button type="button" className="secondary-btn" onClick={addItem}>
              Add Item
            </button>
          </div>

          {/* ITEMS LIST */}
          {form.items.length > 0 && (
            <div className="items-list">
              {form.items.map((i, idx) => (
                <div key={idx} className="item-row">
                  <span>
                    {i.food_item} × {i.quantity}
                  </span>

                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => removeItem(idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ORDER TYPE */}
          <select
            name="order_type"
            value={form.order_type}
            onChange={handleChange}
            required
          >
            <option value="Dine In">Dine In</option>
            <option value="Take Away">Take Away</option>
            <option value="Delivery">Delivery</option>
          </select>

          {/* DELIVERY ADDRESS (ONLY IF DELIVERY) */}
          {form.order_type === "Delivery" && (
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={form.address}
              onChange={handleChange}
              required
            />
          )}

          {/* PAYMENT METHOD */}
          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            required
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          {/* ORDER DATE */}
          <input
            type="date"
            name="order_date"
            value={form.order_date}
            onChange={handleChange}
          />

          {/* ACTIONS */}
          <div className="form-actions">
            <button className="primary-btn" type="submit">
              {editingId ? "Update Order" : "Create Order"}
            </button>

            {editingId && (
              <button type="button" className="secondary-btn" onClick={reset}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* TABLE */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Items</th>
              <th>Type</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id || o.id}>
                <td>{o.customer_name}</td>

                <td>
                  {o.items?.map((i, idx) => (
                    <div key={idx}>
                      {i.food_item} × {i.quantity}
                    </div>
                  ))}
                </td>

                <td>{o.order_type}</td>
                <td>{o.payment_method}</td>
                <td>{o.order_date?.slice?.(0, 10)}</td>

                <td>
                  <button
                    className="secondary-btn"
                    onClick={() => startEdit(o)}
                  >
                    Edit
                  </button>
                  <button
                    className="danger-btn"
                    onClick={() => handleDelete(o._id || o.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default OrdersAdmin;

{
  /*import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

const emptyForm = {
  customer_name: "",
  foodItem: "",
  quantity: "",
  orderType: "",
  status: "",
};

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await requestJson("/get_orders.php", {
        headers: authHeaders,
      });
      setOrders(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      customer_name: item.customer_name || "",
      foodItem: item.foodItem || "",
      quantity: item.quantity || "",
      orderType: item.orderType || "",
      status: item.status || "",
    });
  };

  const resetForm = () => {
    setEditingId("");
    setFormData(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.customer_name.trim() ||
      !formData.foodItem.trim() ||
      !formData.quantity
    ) {
      setMessage("Please enter customer name, food item, and quantity.");
      return;
    }

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        foodItem: formData.foodItem.trim(),
        quantity: Number(formData.quantity),
        orderType: formData.orderType.trim(),
        status: formData.status.trim(),
      };

      if (editingId) {
        await requestJson(`/orders/${editingId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        setMessage("Order updated successfully.");
      } else {
        await requestJson("/create_order.php", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        setMessage("Order created successfully.");
      }

      resetForm();
      loadOrders();
    } catch (error) {
      setMessage(error.message || "Unable to save order");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await requestJson(`/orders/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setOrders((current) => current.filter((o) => o.id !== id));
      if (editingId === id) resetForm();
      setMessage("Order deleted successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to delete order");
    }
  };

  return (
    <AdminLayout>
      <div className="orders-page">
        <h1>Order Management</h1>
        {message && <p className="empty-state">{message}</p>}

        
        <form onSubmit={handleSubmit} className="order-form">
          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            value={formData.customer_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="foodItem"
            placeholder="Food Item"
            value={formData.foodItem}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="orderType"
            placeholder="Order Type (e.g. Dine-in, Takeaway)"
            value={formData.orderType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="status"
            placeholder="Status (e.g. Pending, Completed)"
            value={formData.status}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editingId ? "Update Order" : "Add Order"}
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

       
        {loading ? (
          <p className="empty-state">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="empty-state">No orders found.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Food Item</th>
                <th>Quantity</th>
                <th>Order Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.customer_name}</td>
                  <td>{order.foodItem}</td>
                  <td>{order.quantity}</td>
                  <td>{order.orderType}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      className="secondary-btn"
                      onClick={() => startEdit(order)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger-btn"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default OrdersAdmin;*/
}
