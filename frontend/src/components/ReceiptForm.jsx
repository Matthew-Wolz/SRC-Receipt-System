import React, { useState } from 'react';

function ReceiptForm({ sponsorName, guestName, staffInitials, onClose }) {
  const [email, setEmail] = useState('');
  const [emailReceipt, setEmailReceipt] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/send-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sponsorName, guestName, staffInitials, email }),
    });
    if (response.ok) {
      alert('Receipt sent successfully');
      onClose();
    } else {
      alert('Failed to send receipt');
    }
  };

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit}>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" checked={emailReceipt} onChange={(e) => setEmailReceipt(e.target.checked)} />
          <label className="form-check-label">Email receipt?</label>
        </div>
        {emailReceipt && (
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Send Receipt</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>Close</button>
      </form>
    </div>
  );
}

export default ReceiptForm;