import React from "react";

function DashboardHeader({ title, subtitle, actions }) {
  return (
    <div className="dashboard-header">
      <div className="dashboard-header-copy">
        <h1>{title}</h1>

        {subtitle && <p>{subtitle}</p>}
      </div>

      {actions && (
        <div className="dashboard-header-actions">{actions}</div>
      )}
    </div>
  );
}

export default DashboardHeader;