import React, { useState } from "react";

function YouthGuestPassForm({ onClose, product }) {
  const [formData, setFormData] = useState({
    sponsorName: "",
    guestName: "",
    dateOfBirth: "",
    staffInitials: "",
    emailReceipt: false,
    email: "",
  });
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (name === "dateOfBirth") {
      validateAge(value);
    }
  };

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

  const validateForm = () => {
    if (!formData.sponsorName || !formData.guestName || !formData.dateOfBirth || !formData.staffInitials) {
      setError("All fields except email are required.");
      return false;
    }
    if (
      /[0-9]/.test(formData.sponsorName) ||
      /[0-9]/.test(formData.guestName) ||
      /[0-9]/.test(formData.staffInitials)
    ) {
      setError("Sponsor Name, Guest Name, and Staff Initials cannot contain numbers.");
      return false;
    }
    if (!isEligible) {
      setError("Youth Guest Pass is only available for guests 14 or younger.");
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
      sponsorName: formData.sponsorName,
      guestName: formData.guestName,
      dateOfBirth: formData.dateOfBirth,
      staffInitials: formData.staffInitials,
      email: formData.emailReceipt ? formData.email : null,
      product,
    };

    try {
      const response = await fetch("http://localhost:5000/api/submit-guest-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestPassData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit Youth Guest Pass.");
      }

      const data = await response.text();

      setSuccess("Youth Guest Pass submitted successfully!");
      setFormData({
        sponsorName: "",
        guestName: "",
        dateOfBirth: "",
        staffInitials: "",
        emailReceipt: false,
        email: "",
      });
      setIsEligible(false);

      setTimeout(() => {
        if (onClose) {
          try {
            onClose();
          } catch (err) {
            console.error("Error in onClose:", err);
            setError("Form submitted, but there was an issue closing the form.");
          }
        }
      }, 2000);
    } catch (err) {
      console.error("Error submitting Youth Guest Pass:", err);
      setError(err.message || "An unexpected error occurred while submitting the form.");
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
            required
            pattern="^[A-Za-z ]+$"
            title="No numbers allowed"
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
            pattern="^[A-Za-z ]+$"
            title="No numbers allowed"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Guest Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
          {formData.dateOfBirth && (
            <div className={`mt-2 ${isEligible ? "text-success" : "text-danger"}`}>
              {isEligible ? "Eligible for Youth Guest Pass" : "Not eligible - must be 14 or younger"}
            </div>
          )}
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
            pattern="^[A-Za-z ]+$"
            title="No numbers allowed"
          />
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
              required={formData.emailReceipt}
            />
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn truman-button"
            disabled={loading || !isEligible}
          >
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

export default YouthGuestPassForm;
