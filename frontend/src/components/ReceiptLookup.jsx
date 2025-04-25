import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ReceiptLookupPage() {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingDates, setLoadingDates] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/receipt-dates');
        if (!response.ok) throw new Error('Failed to load dates');
        const dates = await response.json();
        setAvailableDates(dates);
        if (dates.length > 0) setSelectedDate(dates[0]);
      } catch (err) {
        setError('Failed to load available dates');
      } finally {
        setLoadingDates(false);
      }
    };
    fetchDates();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!receiptNumber || !selectedDate) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/receipt/${selectedDate}/${receiptNumber}`
      );
      if (!response.ok) {
        throw new Error('Receipt not found');
      }
      const data = await response.json();
      setReceiptData(data);
    } catch (err) {
      setError(err.message);
      setReceiptData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    window.open("http://localhost:5000/api/receipts", "_blank");
  };

  const handleSendExcelEmail = async () => {
    setIsSendingEmail(true);
    try {
      const response = await fetch("http://localhost:5000/api/send-excel-email", {
        method: "POST"
      });

      if (response.ok) {
        alert("Excel file sent successfully");
      } else {
        throw new Error("Failed to send Excel file");
      }
    } catch (error) {
      console.error("Error sending Excel email:", error);
      alert(error.message);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDownloadPDF = () => {
    if (receiptData && selectedDate) {
      window.open(`http://localhost:5000/api/receipt-pdf/${selectedDate}/${receiptNumber}`, "_blank");
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h1 className="truman-purple">Receipt Lookup</h1>
        
        <div className="d-flex justify-content-between mb-3">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-secondary flex-grow-1 me-2"
          >
            Back to Main Menu
          </button>
          <button 
            onClick={handleDownloadExcel}
            className="btn truman-button flex-grow-1 mx-2"
          >
            Download Excel Sheet
          </button>
          <button 
            onClick={handleSendExcelEmail}
            className="btn truman-button flex-grow-1 ms-2"
            disabled={isSendingEmail}
          >
            {isSendingEmail ? "Sending..." : "Email Excel Sheet"}
          </button>
        </div>
      </div>

      <div className="mt-4 p-4 truman-form">
        <form onSubmit={handleSearch} className="mb-3">
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">Select Date</label>
              <select
                className="form-select"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={loadingDates}
                required
              >
                {loadingDates ? (
                  <option>Loading dates...</option>
                ) : (
                  availableDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))
                )}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Receipt Number</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter receipt number"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  min="1"
                  required
                />
                <button 
                  className="btn truman-button" 
                  type="submit"
                  disabled={loading || loadingDates}
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {receiptData && (
          <div className="receipt-details mt-3">
            <h4>Receipt #{receiptData["Receipt Number"]}</h4>
            <table className="table">
              <tbody>
                {receiptData["Sponsor Name"] && receiptData["Sponsor Name"] !== "N/A" && (
                  <tr>
                    <th>Sponsor Name</th>
                    <td>{receiptData["Sponsor Name"]}</td>
                  </tr>
                )}
                <tr>
                  <th>Guest Name</th>
                  <td>{receiptData["Guest Name"]}</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>{receiptData["Date"]}</td>
                </tr>
                <tr>
                  <th>Timestamp</th>
                  <td>{receiptData["Timestamp"]}</td>
                </tr>
                <tr>
                  <th>Staff Initials</th>
                  <td>{receiptData["Initials"]}</td>
                </tr>
                <tr>
                  <th>Product</th>
                  <td>{receiptData["Item"]}</td>
                </tr>
                <tr>
                  <th>Amount</th>
                  <td>${receiptData["Price"]}</td>
                </tr>
                {receiptData["Email"] && receiptData["Email"] !== "N/A" && (
                  <tr>
                    <th>Email</th>
                    <td>{receiptData["Email"]}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button 
              onClick={handleDownloadPDF}
              className="btn truman-button mt-2"
            >
              Download PDF Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiptLookupPage;