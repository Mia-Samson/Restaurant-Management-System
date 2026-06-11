import { NavLink } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Dashboard</h2>
        <NavLink to="/admin/dashboard" end>
          Dashboard
        </NavLink>
        <NavLink to="/admin/food-menu">Food Menu</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/admin/payments">Payments</NavLink>
        <NavLink to="/admin/feedback">Feedback</NavLink>
        <NavLink to="/admin/complaints">Complaints</NavLink>
        <NavLink to="/">Back to Site</NavLink>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}

export default AdminLayout;
