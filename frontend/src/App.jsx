import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import ReceiptLookupPage from './components/ReceiptLookup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/receipt-lookup" element={<ReceiptLookupPage />} />
      </Routes>
    </Router>
  );
}

export default App;