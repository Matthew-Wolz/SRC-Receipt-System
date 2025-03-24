import React, { useState } from 'react';
import ReceiptForm from './ReceiptForm';

function GuestPassForm({ onClose }) {
  const [sponsorName, setSponsorName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [staffInitials, setStaffInitials] = useState('');
  const [showReceiptForm, setShowReceiptForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowReceiptForm(true);
  };

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Sponsor Name</label>
          <input type="text" className="form-control" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Guest Name</label>
          <input type="text" className="form-control" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">SRC Staff Initials</label>
          <input type="text" className="form-control" value={staffInitials} onChange={(e) => setStaffInitials(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-success">Next</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>Close</button>
      </form>
      {showReceiptForm && <ReceiptForm sponsorName={sponsorName} guestName={guestName} staffInitials={staffInitials} onClose={onClose} />}
    </div>
  );
}

export default GuestPassForm;