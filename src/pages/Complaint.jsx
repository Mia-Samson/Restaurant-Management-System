import { useState } from "react";
import Navbar from "../components/Navbar";
import API_URL from "../services/api";

function Complaint() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
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

      console.log("Token:", token);
      const response = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: formData.name,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit complaint");
      }

      alert("Complaint submitted successfully!");

      setFormData({
        name: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Complaint Error:", error);
      alert(error.message || "Error submitting complaint");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Register Complaint</h2>

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
              type="text"
              name="subject"
              placeholder="Complaint Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              rows="5"
              name="message"
              placeholder="Describe your complaint"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="danger-btn">
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Complaint;

{
  /*import Navbar from "../components/Navbar";

function Complaint() {
  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Complaint</h2>
          <p>Let us improve your experience.</p>

          <button className="danger-btn">Raise Complaint</button>
        </div>
      </div>
    </>
  );
}

export default Complaint;/*}





{
  /*import Navbar from "../components/Navbar";

function Complaint() {
  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Register Complaint</h2>

          <input type="text" placeholder="Full Name" />

          <input type="email" placeholder="Email Address" />

          <input type="tel" placeholder="Phone Number" />

          <select>
            <option>Complaint Category</option>
            <option>Food Quality</option>
            <option>Service</option>
            <option>Billing Issue</option>
            <option>Staff Behaviour</option>
            <option>Other</option>
          </select>

          <textarea
            rows="5"
            placeholder="Describe your complaint..."
          ></textarea>

          <button className="danger-btn">Submit Complaint</button>
        </div>
      </div>
    </>
  );
}

export default Complaint;*/
}

{
  /*import { useState } from "react";
import Navbar from "../components/Navbar";
import API_URL from "../services/api";

function Complaint() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    complaint: "",
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
        `${API_URL}/complaint.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert("Complaint submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        complaint: "",
      });

      console.log(data);
    } catch (error) {
      console.error(error);
      alert("Error submitting complaint");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Register Complaint</h2>

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
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option>Food Quality</option>
              <option>Service</option>
              <option>Billing</option>
              <option>Staff Behaviour</option>
              <option>Other</option>
            </select>

            <textarea
              rows="5"
              name="complaint"
              placeholder="Describe complaint"
              value={formData.complaint}
              onChange={handleChange}
            ></textarea>

            <button className="danger-btn">
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Complaint;*/
}
