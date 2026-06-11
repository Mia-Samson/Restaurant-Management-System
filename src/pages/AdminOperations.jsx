import AdminLayout from "../components/AdminLayout";

function AdminOperations() {
  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Admin Panel</h1>
        <p>Select an operation from the left sidebar to manage it.</p>
      </div>
    </AdminLayout>
  );
}

export default AdminOperations;
