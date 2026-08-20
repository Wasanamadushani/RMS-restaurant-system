import React from "react";

import DashboardCard from "./DashboardCard";

function DashboardStats({ items }) {
  return (
    <div className="dashboard-cards">
      {items.map((item) => (
        <DashboardCard
          key={item.title}
          icon={item.icon}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
        />
      ))}
    </div>
  );
}

export default DashboardStats;