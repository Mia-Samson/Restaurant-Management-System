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

    try {
      const token = localStorage.getItem("token");

      await requestJson("/feedback.php", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          rating: formData.rating,
          comments: formData.comments,
        }),
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
              placeholder="Enter your feedback"
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

{
  /*import Navbar from "../components/Navbar";

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
}

{
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
