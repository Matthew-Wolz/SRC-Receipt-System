import React, { useState } from "react";
import ReceiptForm from "./ReceiptForm";

function GuestPassForm({ onClose }) {
  const [sponsorName, setSponsorName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [staffInitials, setStaffInitials] = useState("");
  const [showReceiptForm, setShowReceiptForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowReceiptForm(true);
  };

  return (
    <div className="mt-4 p-4 truman-form">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label truman-purple">Sponsor Name</label>
          <input
            type="text"
            className="form-control"
            value={sponsorName}
            onChange={(e) => setSponsorName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label truman-purple">Guest Name</label>
          <input
            type="text"
            className="form-control"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label truman-purple">SRC Staff Initials</label>
          <input
            type="text"
            className="form-control"
            value={staffInitials}
            onChange={(e) => setStaffInitials(e.target.value)}
            required
          />
        </div>
        <div className="d-flex gap-2"> {/* Flexbox for button alignment */}
          <button type="submit" className="btn truman-button flex-grow-1">
            Next
          </button>
          <button
            type="button"
            className="btn truman-button flex-grow-1"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </form>
      {showReceiptForm && (
        <ReceiptForm
          sponsorName={sponsorName}
          guestName={guestName}
          staffInitials={staffInitials}
          onClose={onClose}
        />
      )}
    </div>
  );
}

export default GuestPassForm;