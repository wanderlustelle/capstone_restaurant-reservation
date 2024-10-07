import React from "react";
import { previous, next, today } from "../utils/date-time";



function ReservationButtons({ currentDate, handleDateChange }) {
  return (
    
    <div className="btn-group mt-3" role="group" aria-label="Date navigation">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => handleDateChange(previous(currentDate))}
      >
        Previous
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleDateChange(today())}
      >
        Today
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => handleDateChange(next(currentDate))}
      >
        Next
      </button>
    </div>
  );
}

export default ReservationButtons;