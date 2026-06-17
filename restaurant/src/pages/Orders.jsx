import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { requestJson } from "../services/api";

const emptyForm = {
  customer_name: "",
  orderType: "Dine-in",
  food_item: "",
  quantity: 1,
  address: "",
  payment_method: "Cash",
  items: [],
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadOrders = async () => {
    try {
      const data = await requestJson("/get_orders.php", {
        headers: authHeaders,
      });
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadMenu = async () => {
    try {
      const data = await requestJson("/food_menu.php", {
        headers: authHeaders,
      });
      setMenuItems(Array.isArray(data) ? data : []);
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    loadOrders();
    loadMenu();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const addItem = () => {
    if (!formData.food_item) return;

    setFormData((p) => ({
      ...p,
      items: [
        ...p.items,
        {
          food_item: p.food_item,
          quantity: Number(p.quantity),
        },
      ],
      food_item: "",
      quantity: 1,
    }));
  };

  const validate = () => {
    if (!formData.customer_name.trim()) return "Name required";
    if (formData.items.length === 0) return "Add at least one item";
    if (formData.orderType === "Delivery" && !formData.address.trim())
      return "Address required for delivery";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return setMessage(err);

    const payload = {
      customer_name: formData.customer_name,
      order_type: formData.orderType,
      items: formData.items,
      address: formData.address,
      payment_method: formData.payment_method,
      order_date: new Date().toISOString(),
    };

    try {
      await requestJson("/create_order.php", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      setMessage("Order placed successfully!");
      setFormData(emptyForm);
      loadOrders();
    } catch (err) {
      setMessage(err.message || "Failed to place order");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        {/* FORM */}
        <div className="card">
          <h2>Place Order</h2>
          {message && <p className="empty-state">{message}</p>}

          <form onSubmit={handleSubmit} className="admin-form">
            {/* CUSTOMER NAME */}
            <input
              name="customer_name"
              placeholder="Your Name"
              value={formData.customer_name}
              onChange={handleChange}
              required
            />

            {/* MENU DROPDOWN */}
            <select
              name="food_item"
              value={formData.food_item}
              onChange={handleChange}
            >
              <option value="">Select Food</option>
              {menuItems.map((m) => (
                <option key={m._id || m.id} value={m.food_name}>
                  {m.food_name} - ₹{m.price}
                </option>
              ))}
            </select>

            {/* QUANTITY */}
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
            />

            {/* ADD ITEM BUTTON */}
            <button type="button" className="secondary-btn" onClick={addItem}>
              Add Item
            </button>

            {/* ITEMS LIST */}
            {formData.items.length > 0 && (
              <div className="items-list">
                {formData.items.map((i, idx) => (
                  <div key={idx} className="item-row">
                    <span>
                      {i.food_item} × {i.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ORDER TYPE */}
            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
              required
            >
              <option value="Dine-in">Dine In</option>
              <option value="Takeaway">Take Away</option>
              <option value="Delivery">Delivery</option>
            </select>

            {/* DELIVERY ADDRESS (ONLY IF DELIVERY) */}
            {formData.orderType === "Delivery" && (
              <textarea
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            )}

            {/* PAYMENT METHOD */}
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              required
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>

            {/* SUBMIT */}
            <button className="primary-btn" type="submit">
              Submit Order
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="card mt-4">
          <h2>My Orders</h2>

          {loadingOrders ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Items</th>
                  <th>Type</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o._id || o.id}>
                    <td>
                      {o.items?.map((i, idx) => (
                        <div key={idx}>
                          {i.food_item} × {i.quantity}
                        </div>
                      ))}
                    </td>
                    <td>{o.order_type}</td>
                    <td>{o.payment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Orders;

{
  /*import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { requestJson } from "../services/api";

const emptyForm = {
  customer_name: "",
  foodItem: "",
  quantity: 1,
  orderType: "Dine-in",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Load existing orders
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

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  // Submit new order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_name.trim() || !formData.foodItem.trim()) {
      setMessage("Please enter your name and food item.");
      return;
    }

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        foodItem: formData.foodItem.trim(),
        quantity: Number(formData.quantity),
        orderType: formData.orderType,
      };

      await requestJson("/create_order.php", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      setMessage("Order placed successfully!");
      setFormData(emptyForm);
      loadOrders();
    } catch (error) {
      setMessage(error.message || "Unable to place order");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="card">
          <h2>Place Your Order</h2>
          {message && <p className="empty-state">{message}</p>}

          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="customer_name"
              placeholder="Your Name"
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
              min="1"
              required
            />
            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
            >
              <option value="Dine-in">Dine-in</option>
              <option value="Takeaway">Takeaway</option>
            </select>

            <button type="submit" className="primary-btn">
              Submit Order
            </button>
          </form>
        </div>

       
        <div className="card mt-4">
          <h2>My Orders</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Food Item</th>
                  <th>Quantity</th>
                  <th>Order Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.foodItem}</td>
                    <td>{order.quantity}</td>
                    <td>{order.orderType}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Orders;*/
}
