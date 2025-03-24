import React, { useState } from "react";
import ChildrenGuestPassForm from "./ChildrenGuestPassForm";
import GuestPassForm from "./GuestPassForm";
import TenVisitGuestPassForm from "./TenVisitGuestPassForm"; // Import the new component
import ATSUPunchCardForm from "./ATSUPunchCardForm";
import YouthGuestPassForm from "./YouthGuestPassForm";
import AthleticTapeForm from "./AthleticTapeForm";
import HairTieForm from "./HairTieForm";
import PunchCardSheetForm from "./PunchCardSheetForm";

function WelcomePage() {
  const [selectedProduct, setSelectedProduct] = useState("");

  const renderForm = () => {
    switch (selectedProduct) {
      case "10-visit-children":
        return <ChildrenGuestPassForm />;
      case "10-visit":
        return <TenVisitGuestPassForm />; // Use the new component
      case "atsu-punch-card":
        return <ATSUPunchCardForm />;
      case "daily-guest-pass":
        return <GuestPassForm />;
      case "youth-guest-pass":
        return <YouthGuestPassForm />;
      case "athletic-tape":
        return <AthleticTapeForm />;
      case "hair-tie":
        return <HairTieForm />;
      case "punch-card-sheet":
        return <PunchCardSheetForm />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="truman-purple">Student Recreation Center</h1>
        <h2 className="truman-purple">Guest Pass System</h2>
        <div className="mb-3">
          <label className="form-label truman-purple">Select Product</label>
          <select
            className="form-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Choose a product</option>
            <option value="10-visit-children">10 Visit Children Guest Pass</option>
            <option value="10-visit">10 Visit Guest Pass</option>
            <option value="atsu-punch-card">ATSU Punch Card</option>
            <option value="daily-guest-pass">Daily Guest Pass</option>
            <option value="youth-guest-pass">Youth Guest Pass</option>
            <option value="athletic-tape">Athletic Tape</option>
            <option value="hair-tie">Hair Tie</option>
            <option value="punch-card-sheet">Punch Card Sheet</option>
          </select>
        </div>
      </div>
      {renderForm()}
    </div>
  );
}

export default WelcomePage;