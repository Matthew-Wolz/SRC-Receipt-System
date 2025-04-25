import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestPassForm from "./GuestPassForm";
import ChildrenGuestPassForm from "./ChildrenGuestPassForm";
import YouthGuestPassForm from "./YouthGuestPassForm";
import AthleticTapeForm from "./AthleticTapeForm";
import HairTieForm from "./HairTieForm";
import ATSUPunchCardForm from "./ATSUPunchCardForm";
import PunchCardSheetForm from "./PunchCardSheetForm";

function WelcomePage() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleProductSelect = (e) => {
    const product = e.target.value;
    setSelectedProduct(product);
    
    if (product === "Excel Spreadsheet") {
      navigate('/receipt-lookup');
    } else {
      setShowForm(true);
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
            <option value="AthleticTape">Athletic Tape</option>
            <option value="Hair Tie">Hair Tie</option>
            <option value="ATSU Punch Card">ATSU Punch Card</option>
            <option value="Punch Card Sheet">Punch Card Sheet</option>
            <option value="Excel Spreadsheet">Excel Spreadsheet</option>
          </select>
        </div>
      </div>
      
      {showForm && renderForm()}
    </div>
  );
}

export default WelcomePage;