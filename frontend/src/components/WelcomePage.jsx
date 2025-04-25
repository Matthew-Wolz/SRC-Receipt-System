import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestPassForm from "./GuestPassForm";
import ChildrenGuestPassForm from "./ChildrenGuestPassForm";
import YouthGuestPassForm from "./YouthGuestPassForm";
import AthleticTapeForm from "./AthleticTapeForm";
import HairTieForm from "./HairTieForm";
import ATSUPunchCardForm from "./ATSUPunchCardForm";
import GuestMembershipForm from "./GuestMembershipForm";
import LockerRentalForm from "./LockerRentalForm";

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
      case "Alumni, Spouse, Child 18+ Punch Card ($25)":
        return <GuestPassForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "Child 14-17 Years Old Punch Card ($25)":
        return <ChildrenGuestPassForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "Youth Guest Pass":
        return <YouthGuestPassForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "Athletic Tape":
        return <AthleticTapeForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "Hair Tie":
        return <HairTieForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "ATSU Punch Card":
        return <ATSUPunchCardForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "Guest Membership":
        return <GuestMembershipForm onClose={() => setShowForm(false)} product={selectedProduct} />;
      case "Locker Rental":
        return <LockerRentalForm onClose={() => setShowForm(false)} product={selectedProduct} />;
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
            <option value="Daily Guest Pass">Daily Guest Pass ($3)</option>
            <option value="Alumni, Spouse, Child 18+ Punch Card ($25)">Alumni, Spouse, Child 18+ Punch Card ($25)</option>
            <option value="Child 14-17 Years Old Punch Card ($25)">Child 14-17 Years Old Punch Card ($25)</option>
            <option value="Youth Guest Pass">Youth Guest Pass ($3)</option>
            <option value="Athletic Tape">Athletic Tape ($1)</option>
            <option value="Hair Tie">Hair Tie ($0.25)</option>
            <option value="ATSU Punch Card">ATSU Punch Card ($100)</option>
            <option value="Guest Membership">Guest Membership</option>
            <option value="Locker Rental">Locker Rental</option>
            <option value="Excel Spreadsheet">Excel Spreadsheet and Receipt Lookup</option>
          </select>
        </div>
      </div>
      
      {showForm && renderForm()}
    </div>
  );
}

export default WelcomePage;