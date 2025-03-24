import React, { useState } from 'react';
import GuestPassForm from './components/GuestPassForm';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mt-5">
      <button className="btn btn-primary" onClick={() => setShowForm(true)}>
        Sell Guest Pass
      </button>
      {showForm && <GuestPassForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

export default App;