import React, { useState } from "react";
import ChildrenGuestPassForm from "./ChildrenGuestPassForm";
import GuestPassForm from "./GuestPassForm";
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
        return <ChildrenGuestPassForm product="10 Visit Children Guest Pass" />;
      case "10-visit":
        return <GuestPassForm product="10 Visit Guest Pass" />;
      case "atsu-punch-card":
        return <ATSUPunchCardForm product="ATSU Punch Card" />;
      case "daily-guest-pass":
        return <GuestPassForm product="Daily Guest Pass" />;
      case "youth-guest-pass":
        return <YouthGuestPassForm product="Youth Guest Pass" />;
      case "athletic-tape":
        return <AthleticTapeForm product="Athletic Tape" />;
      case "hair-tie":
        return <HairTieForm product="Hair Tie" />;
      case "punch-card-sheet":
        return <PunchCardSheetForm product="Punch Card Sheet" />;
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