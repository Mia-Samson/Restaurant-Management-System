import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

const emptyForm = {
  employee_name: "",
  position: "",
  salary: "",
  phone: "",
  joining_date: "",
};

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await requestJson("/employees", { headers: authHeaders });
      setEmployees(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((curr) => ({ ...curr, [name]: value }));
  };

  const startEdit = (emp) => {
    setEditingId(emp._id || emp.id);
    setFormData({
      employee_name: emp.employee_name || "",
      position: emp.position || "",
      salary: emp.salary || "",
      phone: emp.phone || "",
      joining_date: emp.joining_date || "",
    });
  };

  const resetForm = () => {
    setEditingId("");
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editingId) {
        await requestJson(`/employees/${editingId}`, {
          method: "PUT",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setMessage("Employee updated successfully.");
      } else {
        await requestJson("/employees", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setMessage("Employee added successfully.");
      }
      resetForm();
      loadEmployees();
    } catch (error) {
      setMessage(error.message || "Unable to save employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await requestJson(`/employees/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setEmployees((curr) => curr.filter((emp) => (emp._id || emp.id) !== id));
      if (editingId === id) resetForm();
      setMessage("Employee deleted successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to delete employee");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <h2>Employee Management</h2>

        {message && <p className="empty-state">{message}</p>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="employee_name"
            placeholder="Full Name"
            value={formData.employee_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
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
            type="date"
            name="joining_date"
            placeholder="Joining Date"
            value={formData.joining_date}
            onChange={handleChange}
            required
          />
          <button type="submit" className="primary-btn">
            {editingId ? "Update Employee" : "Add Employee"}
          </button>
          {editingId && (
            <button type="button" className="secondary-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>

        <div className="admin-list">
          {loading ? (
            <p className="empty-state">Loading employees...</p>
          ) : employees.length === 0 ? (
            <p className="empty-state">No employees found.</p>
          ) : (
            employees.map((emp) => {
              const empId = emp._id || emp.id;
              return (
                <div key={empId} className="admin-card">
                  <div>
                    <strong>{emp.employee_name}</strong>
                    <p>{emp.position}</p>
                    <small>
                      Salary: {emp.salary} • Phone: {emp.phone} • Joined:{" "}
                      {emp.joining_date}
                    </small>
                  </div>
                  <div className="admin-actions">
                    <button
                      className="secondary-btn"
                      onClick={() => startEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger-btn"
                      onClick={() => handleDelete(empId)}
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

export default Employees;
