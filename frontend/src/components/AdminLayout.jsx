import React from "react";
import { Link, useLocation } from "react-router-dom";

import { FaSignOutAlt } from "react-icons/fa";

function AdminLayout({
  children,
  brand = "FoodieHub",
  menuItems = [],
  backLinkTo = "/",
  backLinkLabel = "Back to Website",
}) {
  const location = useLocation();
  const currentPath = `${location.pathname}${location.hash}`;

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <div className="admin-sidebar">

        <h2 className="admin-logo">
          {brand}
        </h2>

        <ul>

          {menuItems.map((item) => (
            <li
              key={item.to}
              className={
                currentPath === item.to ||
                location.pathname === item.to
                  ? "active"
                  : ""
              }
            >
              <Link to={item.to}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          <li>
            <Link to={backLinkTo}>
              <FaSignOutAlt />
              <span>{backLinkLabel}</span>
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