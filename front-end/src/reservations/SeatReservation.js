import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, updateTable } from "../utils/api"; 
import ErrorAlert from "../layout/ErrorAlert";

/*===========================
|Seat Reservation Component
===========================*/
function SeatReservation() {
  const [tables, setTables] = useState([]); 
  const [formData, setFormData] = useState({ table_id: "" }); 
  const [error, setError] = useState(null); 
  const history = useHistory();
  const { reservation_id } = useParams();

  // oad tables when the component mounts
  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);
    return () => abortController.abort();
  }, []);

  // handle dropdown change
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  // handles form submission to seat the reservation
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateTable(formData.table_id, reservation_id); // API call to seat reservation
      history.push("/dashboard"); // redirect to the dashboard after seating
    } catch (err) {
      setError(err); // set error if something goes wrong
    }
  };

  // map tables to dropdown options
  const tableOptions = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  
  return (
    <main>
      <h1>Seat Reservation: {reservation_id}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="table_id">Table Number:</label>
          <select
            id="table_id"
            name="table_id"
            className="form-control"
            required
            value={formData.table_id}
            onChange={handleChange}
          >
            <option value="">-- Select a Table --</option>
            {tableOptions}
          </select>
        </div>
        <ErrorAlert error={error} />
        <button type="button" onClick={() => history.goBack()} className="btn btn-secondary mr-2">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </main>
  );
}

export default SeatReservation;