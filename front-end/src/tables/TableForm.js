
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createTable } from '../utils/api';

function TableForm() {
  const [formData, setFormData] = useState({
    table_name: '',
    capacity: '',
  });
  const history = useHistory();

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // ensure capacity is a number
      formData.capacity = Number(formData.capacity);
      await createTable({ data: formData });
      history.push('/dashboard'); // redirect to dashboard after creating the table
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const handleCancel = () => {
    history.goBack(); // navigate back to the previous page
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="table_name">Table Name:</label>
        <input
          id="table_name"
          name="table_name"
          type="text"
          className="form-control"
          value={formData.table_name}
          onChange={handleChange}
          required
          minLength="2"
        />
      </div>
      <div className="form-group">
        <label htmlFor="capacity">Capacity:</label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          className="form-control"
          value={formData.capacity}
          onChange={handleChange}
          required
          min="1"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      <button type="button" className="btn btn-secondary" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}

export default TableForm;
