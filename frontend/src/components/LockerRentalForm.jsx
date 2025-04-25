import React, { useState } from "react";

function LockerRentalForm({ onClose, product }) {
  const [formData, setFormData] = useState({
    guestName: "",
    staffInitials: "",
    duration: "",
    emailReceipt: false,
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const durations = ["1 Semester ($15)", "2 Semesters ($25)", "1 Year ($40)"];

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.guestName || !formData.staffInitials || !formData.duration) {
      setError("All fields except email are required.");
      return false;
    }
    if (/[0-9]/.test(formData.guestName) || /[0-9]/.test(formData.staffInitials)) {
      setError("Guest Name and Staff Initials cannot contain numbers.");
      return false;
    }
    if (formData.emailReceipt && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const guestPassData = {
      guestName: formData.guestName,
      staffInitials: formData.staffInitials,
      duration: formData.duration,
      email: formData.emailReceipt ? formData.email : null,
      product,
    };

    try {
      const response = await fetch("http://localhost:5000/api/submit-guest-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestPassData),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Failed to submit locker rental.");
      }

      setSuccess(data);
      setFormData({
        guestName: "",
        staffInitials: "",
        duration: "",
        emailReceipt: false,
        email: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="truman-form p-4">
      <h3>{product}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Guest Name</label>
          <input
            type="text"
            className="form-control"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Staff Initials</label>
          <input
            type="text"
            className="form-control"
            name="staffInitials"
            value={formData.staffInitials}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Duration</label>
          <select
            className="form-select"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          >
            <option value="">Select Duration</option>
            {durations.map(duration => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="emailReceipt"
            checked={formData.emailReceipt}
            onChange={handleChange}
          />
          <label className="form-check-label">Email receipt?</label>
        </div>
        {formData.emailReceipt && (
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="d-flex gap-2">
          <button type="submit" className="btn truman-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default LockerRentalForm;