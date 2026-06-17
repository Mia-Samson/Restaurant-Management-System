import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

const emptyForm = {
  customer_name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  status: "Pending",
};

function ComplaintsAdmin() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await requestJson("/get_complaints.php");
      setComplaints(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
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
      subject: item.subject || "",
      message: item.message || item.complaint || "",
      status: item.status || "Pending",
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
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setMessage(
        "Please enter the customer name, subject, and complaint details.",
      );
      return;
    }

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        name: formData.customer_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        complaint: formData.message.trim(),
        status: formData.status,
      };

      if (editingId) {
        await requestJson(`/complaints/${editingId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        setMessage("Complaint updated successfully.");
      } else {
        await requestJson("/complaints", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        setMessage("Complaint created successfully.");
      }

      resetForm();
      loadComplaints();
    } catch (error) {
      setMessage(error.message || "Unable to save complaint");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;

    try {
      await requestJson(`/complaints/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setComplaints((current) =>
        current.filter((item) => (item._id || item.id) !== id),
      );
      if (editingId === id) resetForm();
      setMessage("Complaint deleted successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to delete complaint");
    }
  };

  return (
    <AdminLayout>
      <div className="complaints-page">
        <div className="page-header">
          <h1>Complaint Management</h1>
        </div>

        {message && <p className="empty-state">{message}</p>}

        {/* Admin Form */}
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
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
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
            rows="4"
            name="message"
            placeholder="Describe complaint"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editingId ? "Update Complaint" : "Add Complaint"}
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

        {/* Complaints List */}
        <div className="complaints-list">
          {loading ? (
            <p className="empty-state">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p className="empty-state">No complaints found.</p>
          ) : (
            complaints.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div key={itemId} className="complaint-card">
                  <div>
                    <strong>{item.customer_name || item.name}</strong>
                    <p>
                      <strong>Subject:</strong> {item.subject}
                    </p>
                    <p>{item.message || item.complaint}</p>
                    <small>
                      Status: <strong>{item.status || "Pending"}</strong>
                    </small>
                    <br />
                    <small>
                      {item.email || "No email"} • {item.phone || "No phone"}
                    </small>
                  </div>
                  <div className="complaint-actions">
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

export default ComplaintsAdmin;

{
  /*
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

const emptyForm = {
  customer_name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  status: "Pending",
};

function ComplaintsAdmin() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await requestJson("/get_complaints.php");
      setComplaints(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
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
      subject: item.subject || "",
      message: item.message || item.complaint || "",
      status: item.status || "Pending",
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
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setMessage(
        "Please enter the customer name, subject, and complaint details.",
      );
      return;
    }

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        name: formData.customer_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        complaint: formData.message.trim(),
        status: formData.status,
      };

      await requestJson(`/complaints/${editingId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      await requestJson(`/complaints/${editingId}/status`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status: formData.status }),
      });

      setMessage("Complaint updated successfully.");
      resetForm();
      loadComplaints();
    } catch (error) {
      setMessage(error.message || "Unable to update complaint");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) {
      return;
    }

    try {
      await requestJson(`/complaints/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setComplaints((current) =>
        current.filter((item) => (item._id || item.id) !== id),
      );
      if (editingId === id) {
        resetForm();
      }
      setMessage("Complaint deleted successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to delete complaint");
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="page-header" style={{ marginBottom: "12px" }}>
          <h1>Complaint Management</h1>
          <p>
            Track customer complaints, update their status, and resolve issues
            quickly.
          </p>
        </div>

        {message && <p className="empty-state">{message}</p>}

        <div>
          {loading ? (
            <p className="empty-state">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p className="empty-state">No complaints found.</p>
          ) : (
            complaints.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div
                  key={itemId}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    padding: "12px",
                    marginBottom: "12px",
                    background: "#fff",
                  }}
                >
                  <div>
                    <strong>{item.customer_name || item.name}</strong>
                    <p>
                      <strong>Subject:</strong> {item.subject}
                    </p>
                    <p>{item.message || item.complaint}</p>
                    <small>
                      Status: <strong>{item.status || "Pending"}</strong>
                    </small>
                    <br />
                    <small>
                      {item.email || "No email"} • {item.phone || "No phone"}
                    </small>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "flex-end",
                      marginTop: "8px",
                    }}
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
}

export default ComplaintsAdmin;
*/
}
