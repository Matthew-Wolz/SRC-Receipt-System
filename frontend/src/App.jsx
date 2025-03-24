import React, { useState } from "react";
import GuestPassForm from "./components/GuestPassForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="truman-purple">Student Recreation Center</h1>
        <h2 className="truman-purple">Guest Pass System</h2>
        <button
          className="btn btn-primary truman-button"
          onClick={() => setShowForm(true)}
        >
          Sell Guest Pass
        </button>
      </div>
      {showForm && <GuestPassForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

export default App;