import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Setup from './pages/Setup';
import FourCardsWithModal from './pages/RegistrationSetup';
import UnitOperations from './pages/UnitOperations';
import Approval from './pages/Approval';
import DocumentPrinting from './pages/DocumentPrinting';

// CSS import ORDER matters:
// 1. index.css is imported in main.tsx (already correct)
// 2. App.css — base layout & dashboard styles
import './App.css';
// 3. Setup.css — modal, input, button, table styles
import './Setup.css';
// 4. glass-overrides.css — LAST: overrides inline styles in all TSX files
import './glass-overrides.css';

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