import React from "react";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>

      <ul>
        <li>
          <Link to="/admin/dashboard">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/admin/foods">
            Manage Foods
          </Link>
        </li>

        <li>
          <Link to="/admin/orders">
            Manage Orders
          </Link>
        </li>

        <li>
          <Link to="/admin/reviews">
            Manage Reviews
          </Link>
        </li>

        <li>
          <Link to="/">
            Back to Website
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;