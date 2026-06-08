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

export default Feedback;

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
    email: "",
    rating: "",
    feedback: "",
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
        email: "",
        rating: "",
        feedback: "",
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

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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
              name="feedback"
              placeholder="Your feedback"
              value={formData.feedback}
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
