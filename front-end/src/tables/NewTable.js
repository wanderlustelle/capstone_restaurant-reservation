import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/* ==========
| Table Form |
============= */
//this is the form for creating a new table
function NewTable() {
  const history = useHistory();
  const [tableName, setTableName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState(null);
  const [tableNameError, setTableNameError] = useState("");
  const [capacityError, setCapacityError] = useState("");


  useEffect(() => {
    if (capacity !== "" && Number(capacity) < 1) {
      setCapacityError("Capacity must be at least 1 person.");
    } else {
      setCapacityError("");
    }
  }, [capacity]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);

    if (tableNameError || capacityError) return;

    try {
      await createTable(
        {
          table_name: tableName,
          capacity: Number(capacity),
        },
        abortController.signal
      );
      history.push("/dashboard");
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  };

  return (
    <div>
      <h1>Create a New Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="table_name">Table Name:</label>
          <input
            id="table_name"
            name="table_name"
            type="text"
            minLength="2"
            required
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
          {tableNameError && <p className="alert alert-danger">{tableNameError}</p>}
        </div>
        <div>
          <label htmlFor="capacity">Capacity:</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            required
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          {capacityError && <p className="alert alert-danger">{capacityError}</p>}
        </div>
        <button type="submit" data-test-id="submit-button">Submit</button>
        <button type="button" onClick={() => history.goBack()}>Cancel</button>
      </form>
    </div>
  );
}

export default NewTable;