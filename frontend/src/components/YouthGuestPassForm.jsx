import React, { useState } from "react";

function YouthGuestPassForm() {
  const [sponsorName, setSponsorName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [dob, setDob] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Youth Guest Pass submitted!");
  };

  const validateDOB = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    setIsAccepted(age <= 14);
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
          <label className="form-label truman-purple">Guest Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              validateDOB(e.target.value);
            }}
            required
          />
          {dob && (
            <div className={`mt-2 ${isAccepted ? "text-success" : "text-danger"}`}>
              {isAccepted ? "Accepted" : "Error: Guest must be 14 or under."}
            </div>
          )}
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn truman-button flex-grow-1">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default YouthGuestPassForm;