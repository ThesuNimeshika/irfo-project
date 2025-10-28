
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Setup from './pages/Setup';
import FourCardsWithModal from './pages/RegistrationSetup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/registrationsetup" element={<FourCardsWithModal />} />
      </Routes>
    </Router>
  );
}

export default App;
