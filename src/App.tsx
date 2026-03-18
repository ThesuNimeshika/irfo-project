import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Setup from './pages/Setup';
import FourCardsWithModal from './pages/RegistrationSetup';
import UnitOperations from './pages/UnitOperations';
import Approval from './pages/Approval';
import DocumentPrinting from './pages/DocumentPrinting';
import Login from './pages/Login';
import OtpAuth from './pages/OtpAuth';
import ResetRequest from './pages/ResetRequest';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// CSS import ORDER matters:
// 1. index.css is imported in main.tsx (already correct)
// 2. App.css — base layout & dashboard styles
import './App.css';
// 3. Setup.css — modal, input, button, table styles
import './Setup.css';
// 4. glass-overrides.css — LAST: overrides inline styles in all TSX files
import './glass-overrides.css';
import './modal-layout-fixes.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<OtpAuth />} />
          <Route path="/reset-request" element={<ResetRequest />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
          <Route path="/registrationsetup" element={<ProtectedRoute><FourCardsWithModal /></ProtectedRoute>} />
          <Route path="/unit-operations" element={<ProtectedRoute><UnitOperations /></ProtectedRoute>} />
          <Route path="/approval" element={<ProtectedRoute><Approval /></ProtectedRoute>} />
          <Route path="/document-printing" element={<ProtectedRoute><DocumentPrinting /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;