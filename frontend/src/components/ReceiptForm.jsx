import React, { useState } from "react";

function ReceiptForm({ sponsorName, guestName, staffInitials, emailReceipt, onClose }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const guestPassData = {
      sponsorName,
      guestName,
      staffInitials,
      dateSold: new Date().toLocaleDateString(),
      guestPassNumber: 1, // Replace with dynamic logic for incrementing numbers
      email: emailReceipt ? email : null, // Only include email if receipt is requested
    };

    try {
      // Send data to the backend
      const response = await fetch("http://localhost:5000/api/submit-guest-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestPassData),
      });

      if (response.ok) {
        alert("Guest pass submitted successfully!");
        onClose(); // Close the form
      } else {
        alert("Failed to submit guest pass.");
      }
    } catch (error) {
      console.error("Error submitting guest pass:", error);
      alert("An error occurred while submitting the guest pass.");
    }
  };

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit}>
        {emailReceipt && (
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <div className="d-flex gap-2">
          <button type="submit" className="btn truman-button flex-grow-1">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary flex-grow-1"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReceiptForm;