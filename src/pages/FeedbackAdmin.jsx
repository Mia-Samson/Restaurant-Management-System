import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

const emptyForm = {
  customer_name: "",
  email: "",
  phone: "",
  rating: "",
  comments: "",
};

function FeedbackAdmin() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const data = await requestJson("/get_feedback.php");
      setFeedback(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const startEdit = (item) => {
    setEditingId(item._id || item.id);
    setFormData({
      customer_name: item.customer_name || item.name || "",
      email: item.email || "",
      phone: item.phone || "",
      rating: item.rating ?? "",
      comments: item.comments || item.message || "",
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
      !formData.rating ||
      !formData.comments.trim()
    ) {
      setMessage("Please enter a name, rating, and feedback comment.");
      return;
    }

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        name: formData.customer_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        rating: Number(formData.rating),
        comments: formData.comments.trim(),
        message: formData.comments.trim(),
      };

      if (editingId) {
        await requestJson(`/feedback/${editingId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        setMessage("Feedback updated successfully.");
      } else {
        await requestJson("/feedback", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        setMessage("Feedback created successfully.");
      }

      resetForm();
      loadFeedback();
    } catch (error) {
      setMessage(error.message || "Unable to save feedback");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback entry?")) return;

    try {
      await requestJson(`/feedback/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setFeedback((current) =>
        current.filter((item) => (item._id || item.id) !== id),
      );
      if (editingId === id) resetForm();
      setMessage("Feedback deleted successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to delete feedback");
    }
  };

  return (
    <AdminLayout>
      <div className="feedback-page">
        <div className="page-header">
          <h1>Feedback Management</h1>
        </div>

        {message && <p className="empty-state">{message}</p>}

        {/* Admin Form for Create + Edit */}
        <form className="feedback-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="customer_name"
            placeholder="Full Name"
            value={formData.customer_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="">Select Rating</option>
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            <option value="4">⭐⭐⭐⭐ Very Good</option>
            <option value="3">⭐⭐⭐ Good</option>
            <option value="2">⭐⭐ Fair</option>
            <option value="1">⭐ Poor</option>
          </select>
          <textarea
            rows="4"
            name="comments"
            placeholder="Enter feedback"
            value={formData.comments}
            onChange={handleChange}
            required
          ></textarea>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editingId ? "Update Feedback" : "Add Feedback"}
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

        {/* Feedback List */}
        <div className="feedback-list">
          {loading ? (
            <p className="empty-state">Loading feedback...</p>
          ) : feedback.length === 0 ? (
            <p className="empty-state">No feedback found yet.</p>
          ) : (
            feedback.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div key={itemId} className="feedback-card">
                  <div>
                    <strong>{item.customer_name || item.name}</strong>
                    <p>
                      Rating: {"⭐".repeat(Number(item.rating) || 0)} (
                      {item.rating || "N/A"})
                    </p>
                    <p>{item.comments || item.message}</p>
                    <small>
                      {item.email || "No email"} • {item.phone || "No phone"}
                    </small>
                  </div>
                  <div className="feedback-actions">
                    <button
                      className="secondary-btn"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger-btn"
                      onClick={() => handleDelete(itemId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default FeedbackAdmin;

{
  /* return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <h1>Feedback Management</h1>
          <p>Review feedback from guests and update or remove it as needed.</p>
        </div>

        {message ? <p className="empty-state">{message}</p> : null}

        <div className="admin-list">
          {loading ? (
            <p className="empty-state">Loading feedback...</p>
          ) : feedback.length === 0 ? (
            <p className="empty-state">No feedback found yet.</p>
          ) : (
            feedback.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div key={itemId} className="admin-list-item">
                  <div>
                    <strong>{item.customer_name || item.name}</strong>
                    <p>
                      Rating: {"⭐".repeat(Number(item.rating) || 0)} (
                      {item.rating || "N/A"})
                    </p>
                    <p>{item.comments || item.message}</p>
                    <small>
                      {item.email || "No email"} • {item.phone || "No phone"}
                    </small>
                  </div>
                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger-btn"
                      type="button"
                      onClick={() => handleDelete(itemId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
  


export default FeedbackAdmin;
*/
}
