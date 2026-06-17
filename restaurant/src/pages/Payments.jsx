import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { requestJson } from "../services/api";

const emptyForm = {
  customer_name: "",
  order_id: "",
  amount: "",
  payment_method: "Cash",
  payment_date: "",
};

function Payments() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Load payments
  const loadPayments = async () => {
    try {
      setLoadingPayments(true);
      const data = await requestJson("/get_payments.php", {
        headers: authHeaders,
      });
      setPayments(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to load payments");
    } finally {
      setLoadingPayments(false);
    }
  };

  // Load orders (to calculate totals)
  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await requestJson("/get_orders.php", {
        headers: authHeaders,
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || "Unable to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadPayments();
    loadOrders();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));

    // Auto-calc amount when order_id changes
    if (name === "order_id") {
      const order = orders.find((o) => (o._id || o.id) === value);
      if (order) {
        // Calculate total = sum of item.price * quantity
        let total = 0;
        if (order.items) {
          order.items.forEach((it) => {
            if (it.price) {
              total += Number(it.price || 0) * Number(it.quantity || 1);
            }
          });
        }
        setFormData((current) => ({ ...current, amount: total }));
      }
    }
  };

  // Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_name.trim() || !formData.order_id.trim()) {
      setMessage("Please enter customer name and select an order.");
      return;
    }

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        order_id: formData.order_id.trim(),
        amount: Number(formData.amount),
        payment_method: formData.payment_method.trim(),
        payment_date: formData.payment_date.trim(),
      };

      console.log("Payment payload:", payload);
      await requestJson("/create_payment.php", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      setMessage("Payment submitted successfully!");
      setFormData(emptyForm);
      loadPayments();
    } catch (error) {
      setMessage(error.message || "Unable to submit payment");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        {/* PAYMENT FORM (same style as Orders form card) */}
        <div className="card">
          <h2>Submit Payment</h2>

          {message && <p className="empty-state">{message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="customer_name"
              placeholder="Customer Name"
              value={formData.customer_name}
              onChange={handleChange}
            />

            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : (
              <select
                name="order_id"
                value={formData.order_id}
                onChange={handleChange}
              >
                <option value="">Select Order</option>
                {orders.map((order) => (
                  <option
                    key={order._id || order.id}
                    value={order._id || order.id}
                  >
                    {order.customer_name} -{" "}
                    {order.items
                      ?.map((it) => `${it.food_item} × ${it.quantity}`)
                      .join(", ")}
                  </option>
                ))}
              </select>
            )}

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              readOnly
            />

            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>

            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
            />

            <button type="submit" className="primary-btn">
              Submit Payment
            </button>
          </form>
        </div>

        {/* PAYMENT LIST (EXACT SAME STRUCTURE AS ORDERS TABLE) */}
        <div className="card mt-4">
          <h2>My Payments</h2>

          {loadingPayments ? (
            <p>Loading payments...</p>
          ) : payments.length === 0 ? (
            <p>No payments found.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id || payment.id}>
                    <td>{payment.order_id}</td>
                    <td>₹{payment.amount}</td>
                    <td>{payment.payment_method}</td>
                    <td>{payment.payment_date}</td>
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

export default Payments;
