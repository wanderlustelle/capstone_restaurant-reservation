import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/* ======================
|   New Reservation Form |
========================*/
// component for flexible and scalable reservation forms

function ReservationForm({ reservation, onSubmit }) {
  const history = useHistory();
  const [formData, setFormData] = useState(
    reservation || {
      first_name: "",
      last_name: "",
      mobile_number: "",
      reservation_date: "",
      reservation_time: "",
      people: "",
    }
  );
  const [error, setError] = useState(null); // state for general error messages
  const [errors, setErrors] = useState({}); // state for specific field errors

  // handle input changes and format mobile number
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile_number") {
      // format phone number with dashes
      const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // validate form inputs before submission
  const validateForm = () => {
    const newErrors = {};
    
    // check for required fields and set error messages
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = "Invalid phone number format. Use XXX-XXX-XXXX";
    }
    
    if (!formData.reservation_date) {
      newErrors.reservation_date = "Reservation date is required";
    }
    
    if (!formData.reservation_time) {
      newErrors.reservation_time = "Reservation time is required";
    }
    
    if (!formData.people || formData.people < 1) {
      newErrors.people = "Number of people must be at least 1";
    }

    setErrors(newErrors); // update state with validation errors
    return Object.keys(newErrors).length === 0; // return true if no errors
  };

  // handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return; // Don't submit if validation fails

    try {
      const response = await createReservation({
        ...formData,
        people: Number(formData.people),
      });

      if (response) {
        history.push(`/dashboard?date=${formData.reservation_date}`);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // rendering the form
  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert error={error} /> 

      {/* Input fields for reservation details */}
      <div className="form-group">
        <label htmlFor="first_name">First Name:</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          placeholder="Enter first name"
        />
        {errors.first_name && <span className="error">{errors.first_name}</span>} 
      </div>

      <div className="form-group">
        <label htmlFor="last_name">Last Name:</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          placeholder="Enter last name"
        />
        {errors.last_name && <span className="error">{errors.last_name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="mobile_number">Mobile Number:</label>
        <input
          type="tel"
          id="mobile_number"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleChange}
          required
          placeholder="XXX-XXX-XXXX"
        />
        {errors.mobile_number && <span className="error">{errors.mobile_number}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="reservation_date">Reservation Date:</label>
        <input
          type="date"
          id="reservation_date"
          name="reservation_date"
          value={formData.reservation_date}
          onChange={handleChange}
          required
          placeholder="YYYY-MM-DD"
        />
        {errors.reservation_date && <span className="error">{errors.reservation_date}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="reservation_time">Reservation Time:</label>
        <input
          type="time"
          id="reservation_time"
          name="reservation_time"
          value={formData.reservation_time}
          onChange={handleChange}
          required
          placeholder="HH:MM"
        />
        {errors.reservation_time && <span className="error">{errors.reservation_time}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="people">Number of People:</label>
        <input
          type="number"
          id="people"
          name="people"
          value={formData.people}
          onChange={handleChange}
          required
          min="1"
          placeholder="1"
        />
        {errors.people && <span className="error">{errors.people}</span>}
      </div>

      <button type="submit" className="btn btn-primary mr-2">Submit</button>
      <button type="button" onClick={() => history.goBack()} className="btn btn-secondary">Cancel</button>
    </form>
  );
}
//some of the mments are redundant but I left them in for clarity and for study purposes
export default ReservationForm;