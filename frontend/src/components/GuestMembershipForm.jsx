import React, { useState } from "react";

function GuestMembershipForm({ onClose, product }) {
  const [formData, setFormData] = useState({
    guestName: "",
    staffInitials: "",
    membershipType: "",
    duration: "",
    emailReceipt: false,
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Membership types with pricing included in display
  const membershipTypes = [
    { value: "Spouse or 18+ Child", label: "Spouse or 18+ Child" },
    { value: "Alumni", label: "Alumni" },
    { value: "Alumni Couple", label: "Alumni Couple" },
  ];

  // Durations with pricing based on membership type
  const getDurationOptions = (membershipType) => {
    const baseDurations = [
      { value: "Spring/Fall Semester", label: "Spring/Fall Semester" },
      { value: "Summer Session", label: "Summer Session" },
      { value: "Annual", label: "Annual" },
    ];

    if (!membershipType) return baseDurations;

    const pricing = {
      "Spouse or 18+ Child": {
        "Spring/Fall Semester": "$125",
        "Summer Session": "$50",
        "Annual": "$300",
      },
      "Alumni": {
        "Spring/Fall Semester": "$125",
        "Summer Session": "$75",
        "Annual": "$425",
      },
      "Alumni Couple": {
        "Spring/Fall Semester": "$300",
        "Summer Session": "$140",
        "Annual": "$740",
      },
    };

    return baseDurations.map((duration) => ({
      ...duration,
      label: `${duration.label} (${pricing[membershipType][duration.value]})`,
    }));
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.guestName || !formData.staffInitials || !formData.membershipType || !formData.duration) {
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
      membershipType: formData.membershipType,
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
        throw new Error(data || "Failed to submit guest membership.");
      }

      setSuccess(data);
      setFormData({
        guestName: "",
        staffInitials: "",
        membershipType: "",
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
          <label className="form-label">Membership Type</label>
          <select
            className="form-select"
            name="membershipType"
            value={formData.membershipType}
            onChange={handleChange}
            required
          >
            <option value="">Select Membership Type</option>
            {membershipTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
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
            {getDurationOptions(formData.membershipType).map((duration) => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
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

export default GuestMembershipForm;