import React, { useState } from "react";

function TenVisitGuestPassForm({ onClose }) {
  const [sponsorName, setSponsorName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [staffInitials, setStaffInitials] = useState("");
  const [emailReceipt, setEmailReceipt] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const guestPassData = {
      sponsorName,
      guestName,
      staffInitials,
      email: emailReceipt ? email : null,
      product: "10 Visit Guest Pass", // Hardcoded for this form
    };

    try {
      const response = await fetch("http://localhost:5000/api/submit-ten-visit-guest-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestPassData),
      });

      if (response.ok) {
        alert("10 Visit Guest Pass submitted successfully!");
        // Reset the form
        setSponsorName("");
        setGuestName("");
        setStaffInitials("");
        setEmailReceipt(false);
        setEmail("");
      } else {
        alert("Failed to submit 10 Visit Guest Pass.");
      }
    } catch (error) {
      console.error("Error submitting 10 Visit Guest Pass:", error);
      alert("An error occurred while submitting the 10 Visit Guest Pass.");
    }
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
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={emailReceipt}
            onChange={(e) => setEmailReceipt(e.target.checked)}
          />
          <label className="form-check-label">Email receipt?</label>
        </div>
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

export default TenVisitGuestPassForm;