import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

const emptyForm = {
  customer_name: "",
  order_id: "",
  amount: "",
  payment_method: "Cash",
  payment_date: "",
};

function PaymentsAdmin() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // ---------------- LOAD DATA ----------------
  const loadPayments = async () => {
    try {
      const data = await requestJson("/get_payments.php", {
        headers: authHeaders,
      });
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage(err.message || "Failed to load payments");
    }
  };

  const loadOrders = async () => {
    try {
      const data = await requestJson("/get_orders.php", {
        headers: authHeaders,
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage(err.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadPayments(), loadOrders()]);
      setLoading(false);
    })();
  }, []);

  // ---------------- AUTO AMOUNT CALC ----------------
  const calculateAmount = (order) => {
    if (!order?.items) return 0;

    return order.items.reduce((sum, item) => {
      const price = item.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  // ---------------- FORM HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // When order changes → auto calculate amount
    if (name === "order_id") {
      const order = orders.find((o) => (o._id || o.id) === value);

      setFormData((prev) => ({
        ...prev,
        order_id: value,
        amount: order ? calculateAmount(order) : "",
      }));

      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- RESET ----------------
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId("");
    setMessage("");
  };

  // ---------------- EDIT ----------------
  const startEdit = (payment) => {
    setEditingId(payment._id || payment.id);

    setFormData({
      customer_name: payment.customer_name || "",
      order_id: payment.order_id || "",
      amount: payment.amount || "",
      payment_method: payment.payment_method || "Cash",
      payment_date: payment.payment_date || "",
    });
  };

  // ---------------- SUBMIT (CREATE / UPDATE) ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_name.trim() || !formData.order_id.trim()) {
      setMessage("Customer name and Order are required");
      return;
    }

    const payload = {
      customer_name: formData.customer_name.trim(),
      order_id: formData.order_id,
      amount: Number(formData.amount),
      payment_method: formData.payment_method,
      payment_date: formData.payment_date,
    };

    try {
      if (editingId) {
        await requestJson(`/payments/${editingId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });

        setMessage("Payment updated successfully");
      } else {
        await requestJson("/create_payment.php", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });

        setMessage("Payment created successfully");
      }

      resetForm();
      await loadPayments();
    } catch (err) {
      setMessage(err.message || "Failed to save payment");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment?")) return;

    try {
      await requestJson(`/payments/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      setPayments((prev) => prev.filter((p) => p._id !== id && p.id !== id));

      setMessage("Payment deleted successfully");
    } catch (err) {
      setMessage(err.message || "Failed to delete payment");
    }
  };

  // ---------------- UI ----------------
  return (
    <AdminLayout>
      <div className="admin-page payments-page">
        <h1>Payment Management</h1>

        {message && <p className="empty-state">{message}</p>}

        {/* FORM */}
        <form className="payment-form admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            value={formData.customer_name}
            onChange={handleChange}
          />

          <select
            name="order_id"
            value={formData.order_id}
            onChange={handleChange}
          >
            <option value="">Select Order</option>
            {orders.map((o) => (
              <option key={o._id || o.id} value={o._id || o.id}>
                {o.customer_name} -{" "}
                {o.items
                  ?.map((i) => `${i.food_item} × ${i.quantity}`)
                  .join(", ")}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            value={formData.amount}
            readOnly
            placeholder="Auto calculated amount"
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

          <div className="form-actions">
            <button className="primary-btn" type="submit">
              {editingId ? "Update Payment" : "Add Payment"}
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

        {/* TABLE */}
        {loading ? (
          <p className="empty-state">Loading payments...</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Order</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p._id || p.id}>
                  <td>{p.customer_name}</td>
                  <td>{p.order_id}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.payment_method}</td>
                  <td>{p.payment_date}</td>
                  <td>
                    <button
                      className="secondary-btn"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="danger-btn"
                      onClick={() => handleDelete(p._id || p.id)}
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

export default PaymentsAdmin;
