import React, { useState } from "react";

function ChildrenGuestPassForm() {
  const [guestName, setGuestName] = useState("");
  const [photoId, setPhotoId] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("10 Visit Children Guest Pass submitted!");
  };

  return (
    <div className="mt-4 p-4 truman-form">
      <form onSubmit={handleSubmit}>
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
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={photoId}
            onChange={(e) => setPhotoId(e.target.checked)}
          />
          <label className="form-check-label">Photo Identification</label>
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

export default ChildrenGuestPassForm;