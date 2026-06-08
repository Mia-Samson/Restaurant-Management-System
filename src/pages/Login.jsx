import Navbar from "../components/Navbar";

function AdminLogin() {
  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card">
          <h2>Admin Login</h2>

          <input placeholder="Username" />
          <input type="password" placeholder="Password" />

          <button className="primary-btn">Login</button>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
