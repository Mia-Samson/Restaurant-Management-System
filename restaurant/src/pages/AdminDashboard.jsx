import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    foodItems: 0,
    employees: 0,
    orders: 0,
    payments: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const foodData = await requestJson("/food_menu.php");
        const employeeData = await requestJson("/employees.php");
        const orderData = await requestJson("/orders.php");
        const paymentData = await requestJson("/payments.php");

        setStats({
          foodItems: Array.isArray(foodData) ? foodData.length : 0,
          employees: Array.isArray(employeeData) ? employeeData.length : 0,
          orders: Array.isArray(orderData) ? orderData.length : 0,
          payments: Array.isArray(paymentData) ? paymentData.length : 0,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <p>Manage the restaurant experience from here.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Food Items</h3>
            <p>{loading ? "Loading..." : stats.foodItems}</p>
          </div>
          <div className="stat-card">
            <h3>Employees</h3>
            <p>{loading ? "Loading..." : stats.employees}</p>
          </div>
          <div className="stat-card">
            <h3>Orders</h3>
            <p>{loading ? "Loading..." : stats.orders}</p>
          </div>
          <div className="stat-card">
            <h3>Payments</h3>
            <p>{loading ? "Loading..." : stats.payments}</p>
          </div>
          <div className="stat-card">
            <h3>Customer Feedback</h3>
          </div>
          <div className="stat-card">
            <h3>Complaints</h3>
          </div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/food-menu" className="primary-btn">
            Manage Food Menu
          </Link>
          <Link to="/admin/orders" className="primary-btn">
            Manage Orders
          </Link>
          <Link to="/admin/payments" className="primary-btn">
            Manage Payments
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;

{
  /*
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { requestJson } from "../services/api";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ foodItems: 0, employees: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const foodData = await requestJson("/food_menu.php");
        const employeeData = await requestJson("/employees.php");

        setStats({
          foodItems: Array.isArray(foodData) ? foodData.length : 0,
          employees: Array.isArray(employeeData) ? employeeData.length : 0,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);
  */
}
{
  /*useEffect(() => {
  async function loadStats() {
    try {
      const data = await requestJson("/food_menu.php");
      setStats({ foodItems: Array.isArray(data) ? data.length : 0 });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  loadStats();
}, []);*/
}

{
  /*
  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <p>Manage the restaurant experience from here.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Food Items</h3>
            <p>{loading ? "Loading..." : stats.foodItems}</p>
          </div>
          <div className="stat-card">
            <h3>Employees</h3>
            <p>{loading ? "Loading..." : stats.employees}</p>
          </div>

          <div className="stat-card">
            <h3>Customer Feedback</h3>
          </div>
          <div className="stat-card">
            <h3>Complaints</h3>
          </div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/food-menu" className="primary-btn">
            Manage Food Menu
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard; 



 <AdminLayout>
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <p>Manage the restaurant experience from here.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Food Items</h3>
            <p>{loading ? "Loading..." : stats.foodItems}</p>
          </div>
          <div className="stat-card">
            <h3>Customer Feedback</h3>
          </div>
          <div className="stat-card">
            <h3>Complaints</h3>
          </div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/food-menu" className="primary-btn">
            Manage Food Menu
          </Link>
        </div>
      </div>
    </AdminLayout>*/
}
