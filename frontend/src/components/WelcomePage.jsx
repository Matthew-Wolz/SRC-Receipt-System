import React, { useState } from "react";
import GuestPassForm from "./GuestPassForm";
import ChildrenGuestPassForm from "./ChildrenGuestPassForm";
import YouthGuestPassForm from "./YouthGuestPassForm";
import AthleticTapeForm from "./AthleticTapeForm";
import HairTieForm from "./HairTieForm";
import ATSUPunchCardForm from "./ATSUPunchCardForm";
import PunchCardSheetForm from "./PunchCardSheetForm";
import ReceiptLookup from './ReceiptLookup';

function WelcomePage() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showReceiptLookup, setShowReceiptLookup] = useState(false);

  const handleProductSelect = (e) => {
    setSelectedProduct(e.target.value);
    setShowForm(true);
  };

  const handleDownloadExcel = () => {
    window.open("http://localhost:5000/api/receipts", "_blank");
  };

  const handleClearExcel = async () => {
    if (!window.confirm("Are you sure you want to clear all Excel data? This cannot be undone.")) {
      return;
    }

    setIsClearing(true);
    try {
      const response = await fetch("http://localhost:5000/api/clear-excel", {
        method: "POST"
      });

      if (response.ok) {
        alert("Excel data cleared successfully");
      } else {
        throw new Error("Failed to clear Excel data");
      }
    } catch (error) {
      console.error("Error clearing Excel:", error);
      alert(error.message);
    } finally {
      setIsClearing(false);
    }
  };

  const renderForm = () => {
    switch (selectedProduct) {
      case "Daily Guest Pass":
        return <GuestPassForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "10 Visit Guest Pass":
        return <GuestPassForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "10 Visit Children Guest Pass":
        return <ChildrenGuestPassForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "Youth Guest Pass":
        return <YouthGuestPassForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "Athletic Tape":
        return <AthleticTapeForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "Hair Tie":
        return <HairTieForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "ATSU Punch Card":
        return <ATSUPunchCardForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "Punch Card Sheet":
        return <PunchCardSheetForm onClose={() => setShowForm(false)} product={selectedProduct} />;
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
            onChange={handleProductSelect}
          >
            <option value="">Choose a product</option>
            <option value="Daily Guest Pass">Daily Guest Pass</option>
            <option value="10 Visit Guest Pass">10 Visit Guest Pass</option>
            <option value="10 Visit Children Guest Pass">10 Visit Children Guest Pass</option>
            <option value="Youth Guest Pass">Youth Guest Pass</option>
            <option value="Athletic Tape">Athletic Tape</option>
            <option value="Hair Tie">Hair Tie</option>
            <option value="ATSU Punch Card">ATSU Punch Card</option>
            <option value="Punch Card Sheet">Punch Card Sheet</option>
          </select>
        </div>
        
        <div className="d-flex justify-content-center gap-2 mb-4">
          <button 
            onClick={handleDownloadExcel}
            className="btn truman-button"
          >
            Download Excel Sheet
          </button>
          
          <button 
            onClick={handleClearExcel}
            className="btn btn-danger"
            disabled={isClearing}
          >
            {isClearing ? "Clearing..." : "Clear Excel Data"}
          </button>

          <button 
            onClick={() => setShowReceiptLookup(!showReceiptLookup)}
            className="btn btn-info"
          >
            {showReceiptLookup ? "Hide Receipt Lookup" : "Lookup Receipt"}
          </button>
        </div>
      </div>
      
      {showForm && renderForm()}

      {showReceiptLookup && <ReceiptLookup />}
    </div>
  );
}

export default WelcomePage;
