import React from "react";

function DashboardTable({
  id,
  title,
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  columns,
  rows,
  renderRow,
  emptyMessage,
}) {
  return (
    <section className="dashboard-section" id={id}>
      <div className="dashboard-section-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {onSearchChange && (
          <div className="dashboard-toolbar">
            <input
              type="text"
              className="dashboard-search-input"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={onSearchChange}
            />
          </div>
        )}
      </div>

      <div className="dashboard-table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map(renderRow)
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="dashboard-empty-state">
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DashboardTable;