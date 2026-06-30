import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUtensils,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <div className="admin-sidebar">

        <h2 className="admin-logo">
          FoodieHub
        </h2>

        <ul>

          <li
            className={
              location.pathname === "/admin/dashboard"
                ? "active"
                : ""
            }
          >
            <Link to="/admin/dashboard">
              <FaTachometerAlt />
              Dashboard
            </Link>
          </li>

          <li
            className={
              location.pathname === "/admin/foods"
                ? "active"
                : ""
            }
          >
            <Link to="/admin/foods">
              <FaUtensils />
              Manage Foods
            </Link>
          </li>

          <li
            className={
              location.pathname === "/admin/orders"
                ? "active"
                : ""
            }
          >
            <Link to="/admin/orders">
              <FaShoppingCart />
              Orders
            </Link>
          </li>

          <li>
            <Link to="#">
              <FaUsers />
              Users
            </Link>
          </li>

          <li>
            <Link to="/">
              <FaSignOutAlt />
              Back to Website
            </Link>
          </li>

        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {children}
      </div>

    </div>
  );
}

export default AdminLayout;