import React from "react";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Displays the details of all tables.
 * @param tables
 *  the tables data passed as props
 * @returns {JSX.Element}
 */
function TablesList({ tables, tablesError }) {
  return (
    <div className="mt-4">
      {tablesError && <ErrorAlert error={tablesError} />}
      {tables.length ? (
        <ul className="list-group">
          {tables.map((table) => (
            <li key={table.table_id} className="list-group-item">
              <p>
                <strong>Table Name:</strong> {table.table_name}, <strong>Capacity:</strong> {table.capacity}
              </p>
              <p
                data-table-id-status={table.table_id}
                className={table.reservation_id ? "text-danger" : "text-success"}
              >
                {table.reservation_id ? "Occupied" : "Free"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tables found.</p>
      )}
    </div>
  );
}

export default TablesList;