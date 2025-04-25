import React, { useState } from "react";

function GuestPassForm({ product, onClose }) {
  const [formData, setFormData] = useState({
    sponsorName: "",
    guestName: "",
    staffInitials: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === "" || re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Client-side validation
    if (!formData.guestName || !formData.staffInitials) {
      setError("Guest Name and Staff Initials are required.");
      setLoading(false);
      return;
    }

    if (/[0-9]/.test(formData.guestName) || /[0-9]/.test(formData.staffInitials)) {
      setError("Guest Name and Staff Initials cannot contain numbers.");
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address or leave it blank.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/submit-guest-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, product }),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Failed to submit guest pass.");
      }

      setSuccess(data);
      if (formData.email) {
        console.log(`Email should have been sent to: ${formData.email}`);
      }
      setFormData({
        sponsorName: "",
        guestName: "",
        staffInitials: "",
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
          <label className="form-label">Sponsor Name</label>
          <input
            type="text"
            className="form-control"
            name="sponsorName"
            value={formData.sponsorName}
            onChange={handleChange}
          />
        </div>
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
          <label className="form-label">Email (optional)</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

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

export default GuestPassForm;