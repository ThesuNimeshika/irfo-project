
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Setup from './pages/Setup';
import FourCardsWithModal from './pages/RegistrationSetup';
import UnitOperations from './pages/UnitOperations';
import Approval from './pages/Approval';
import DocumentPrinting from './pages/DocumentPrinting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/registrationsetup" element={<FourCardsWithModal />} />
        <Route path="/unit-operations" element={<UnitOperations />} />
        <Route path="/approval" element={<Approval />} />
        <Route path="/document-printing" element={<DocumentPrinting />} />
      </Routes>
    </Router>
  );
}

export default App;
