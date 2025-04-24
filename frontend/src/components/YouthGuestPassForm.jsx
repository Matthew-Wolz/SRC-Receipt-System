import React, { useState } from "react";

function YouthGuestPassForm({ onClose, product }) {
  const [sponsorName, setSponsorName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [staffInitials, setStaffInitials] = useState("");
  const [emailReceipt, setEmailReceipt] = useState(false);
  const [email, setEmail] = useState("");
  const [isEligible, setIsEligible] = useState(false);

  const validateAge = (dob) => {
    if (!dob) {
      setIsEligible(false);
      return;
    }
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setIsEligible(age <= 14);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEligible) {
      alert("Youth Guest Pass is only available for guests under 14 years old");
      return;
    }

    const guestPassData = {
      sponsorName,
      guestName,
      dateOfBirth,
      staffInitials,
      email: emailReceipt ? email : null,
      product: "Youth Guest Pass",
    };

    try {
      const response = await fetch("http://localhost:5000/api/submit-guest-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestPassData),
      });

      if (response.ok) {
        alert("Youth Guest Pass submitted successfully!");
        setSponsorName("");
        setGuestName("");
        setDateOfBirth("");
        setStaffInitials("");
        setEmailReceipt(false);
        setEmail("");
        if (onClose) onClose();
      } else {
        const error = await response.text();
        alert(`Failed to submit Youth Guest Pass: ${error}`);
      }
    } catch (error) {
      console.error("Error submitting Youth Guest Pass:", error);
      alert("An error occurred while submitting the Youth Guest Pass.");
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
            pattern="^[A-Za-z ]+$"
            title="No numbers allowed"
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
            pattern="^[A-Za-z ]+$"
            title="No numbers allowed"
          />
        </div>
        <div className="mb-3">
          <label className="form-label truman-purple">Guest Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={dateOfBirth}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
              validateAge(e.target.value);
            }}
            required
          />
          {dateOfBirth && (
            <div className={`mt-2 ${isEligible ? "text-success" : "text-danger"}`}>
              {isEligible ? "Eligible for Youth Guest Pass" : "Not eligible - must be 14 or younger"}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label truman-purple">SRC Staff Initials</label>
          <input
            type="text"
            className="form-control"
            value={staffInitials}
            onChange={(e) => setStaffInitials(e.target.value)}
            required
            pattern="^[A-Za-z ]+$"
            title="No numbers allowed"
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
              required={emailReceipt}
            />
          </div>
        )}
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn truman-button flex-grow-1"
            disabled={!isEligible}
          >
            Submit
          </button>
          {onClose && (
            <button
              type="button"
              className="btn btn-secondary flex-grow-1"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default YouthGuestPassForm;