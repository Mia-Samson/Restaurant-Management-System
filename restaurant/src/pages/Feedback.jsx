import { useState } from "react";
import Navbar from "../components/Navbar";
import { requestJson } from "../services/api";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rating: "",
    comments: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.rating ||
      !formData.comments.trim()
    ) {
      alert(
        "Please fill in your name, rating, and feedback before submitting.",
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        customer_name: formData.name.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        rating: Number(formData.rating),
        comments: formData.comments.trim(),
        message: formData.comments.trim(),
      };

      await requestJson("/feedback.php", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      alert("Feedback submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        rating: "",
        comments: "",
      });
    } catch (error) {
      console.error("Feedback Error:", error);
      alert(error.message || "Error submitting feedback");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Customer Feedback</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="">Select Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Very Good</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Poor</option>
            </select>

            <textarea
              rows="5"
              name="comments"
              placeholder="Enter feedback"
              value={formData.comments}
              onChange={handleChange}
            />

            <button type="submit" className="primary-btn">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Feedback;

{
  /*import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { requestJson } from "../services/api";

const emptyForm = {
  customer_name: "",
  email: "",
  phone: "",
  rating: "",
  comments: "",
};

function Feedback() {
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
      !formData.comments.tr im()
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
    <>
      <Navbar />
      <div className="complaint-page">
        <div className="complaint-card">
          <h2>Customer Feedback</h2>
          <p>We value your thoughts! Please share your experience.</p>

          {message && <p className="empty-state">{message}</p>}

          <form className="complaint-form" onSubmit={handleSubmit}>
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
              rows="5"
              name="comments"
              placeholder="Enter feedback"
              value={formData.comments}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="primary-btn">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Feedback;





import Navbar from "../components/Navbar";

function Feedback() {
  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Feedback</h2>
          <p>We value your thoughts.</p>

          <button className="primary-btn">Submit Feedback</button>
        </div>
      </div>
    </>
  );
}

export default Feedback;/*}





{
  /*import Navbar from "../components/Navbar";

function Feedback() {
  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Customer Feedback</h2>

          <input type="text" placeholder="Full Name" />

          <input type="email" placeholder="Email Address" />

          <select>
            <option>Rate Your Experience</option>
            <option>⭐⭐⭐⭐⭐ Excellent</option>
            <option>⭐⭐⭐⭐ Good</option>
            <option>⭐⭐⭐ Average</option>
            <option>⭐⭐ Poor</option>
            <option>⭐ Very Poor</option>
          </select>

          <textarea rows="5" placeholder="Share your feedback..."></textarea>

          <button className="primary-btn">Submit Feedback</button>
        </div>
      </div>
    </>
  );
}

export default Feedback;
*/
  /*import { useState } from "react";
import Navbar from "../components/Navbar";
import API_URL from "../services/api";

function Feedback() {
  const [formData, setFormData] = useState({
  name: "",
  rating: "",
  comments: "",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/feedback.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert("Feedback submitted successfully!");

      setFormData({
        name: "",
        rating: "",
        comments: "",
      });

      console.log(data);
    } catch (error) {
      console.error(error);
      alert("Error submitting feedback");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Customer Feedback</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="">Select Rating</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>

            <textarea
              rows="5"
              name="comments"
              placeholder="Your comments"
              value={formData.comments}
              onChange={handleChange}
            ></textarea>

            <button className="primary-btn">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Feedback;*/
}
