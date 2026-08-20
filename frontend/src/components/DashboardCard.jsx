import React from "react";

function DashboardCard({ icon, title, value, subtitle }) {
  return (
    <div className="dashboard-card dashboard-stat-card">
      {icon && <div className="dashboard-stat-icon">{icon}</div>}

      <h3>{title}</h3>

      <p>{value}</p>

      {subtitle && (
        <span className="dashboard-card-subtitle">
          {subtitle}
        </span>
      )}
    </div>
  );
}

export default DashboardCard;