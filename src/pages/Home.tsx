import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';

// Example icons (can be replaced with SVGs or icon libraries)
const creationIcon = (
  <span style={{
    display: 'inline-block',
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a5b4fc 0%, #f0abfc 100%)',
    color: '#fff',
    fontSize: 24,
    lineHeight: '40px',
    textAlign: 'center',
    boxShadow: '0 2px 8px 0 rgba(165,180,252,0.15)',
    marginRight: 16,
  }}>💰</span>
);
const redeemIcon = (
  <span style={{
    display: 'inline-block',
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f0abfc 0%, #a5b4fc 100%)',
    color: '#fff',
    fontSize: 24,
    lineHeight: '40px',
    textAlign: 'center',
    boxShadow: '0 2px 8px 0 rgba(240,171,252,0.15)',
    marginRight: 16,
  }}>🔄</span>
);

export default function Home() {
  // Simulate backend value updates with animation
  const [creationPrice, setCreationPrice] = useState(100.00);
  const [redeemPrice, setRedeemPrice] = useState(95.00);
  // State for mobile sidebar drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Example: Animate value changes every 3s
    const interval = setInterval(() => {
      setCreationPrice(p => +(p + (Math.random() - 0.5) * 2).toFixed(2));
      setRedeemPrice(p => +(p + (Math.random() - 0.5) * 2).toFixed(2));
    }, 3000);
  return (
    <>
      <Navbar />
      {/* Mobile menu icon */}
      <button
        className="mobile-menu-icon"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <span style={{ fontSize: 32, color: '#4f46e5' }}>☰</span>
      </button>
      {/* Sidebar drawer for mobile */}
      {sidebarOpen && (
        <div className="mobile-sidebar-drawer">
          <button
            className="mobile-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <span style={{ fontSize: 28, color: '#a5b4fc' }}>×</span>
          </button>
          <Sidebar />
        </div>
      )}
      <div className="home-main-layout">
        {/* Sidebar left-aligned, fixed width (120px) on desktop */}
        <div className="home-sidebar-container">
          <Sidebar />
        </div>
        {/* Main content */}
        <div className="home-main-content">
          <div className="home-card-row">
            {/* Creation Price Card */}
            <div className="home-card">
              {creationIcon}
              <div>
                <div style={{ fontSize: 16, opacity: 0.7 }}>Creation Price</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#4f46e5', transition: 'color 0.3s' }}>
                  ${creationPrice.toFixed(2)}
                </div>
              </div>
            </div>
            {/* Redeem Price Card */}
            <div className="home-card">
              {redeemIcon}
              <div>
                <div style={{ fontSize: 16, opacity: 0.7 }}>Redeem Price</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#d946ef', transition: 'color 0.3s' }}>
                  ${redeemPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Animations & Responsive Styles */}
      <style>{`
        .home-main-layout {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          width: 100vw;
          min-height: calc(100vh - 72px);
          margin: 0;
          padding: 0;
        }
        .home-sidebar-container {
          width: 120px;
          min-width: 120px;
          max-width: 120px;
          height: 100%;
          position: relative;
          z-index: 2;
          background: transparent;
          display: block;
        }
        .home-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          min-height: calc(100vh - 72px);
          margin: 0;
          padding: 0;
        }
        .mobile-menu-icon {
          display: none;
          position: fixed;
          top: 12px;
          right: 16px;
          background: none;
          border: none;
          z-index: 2001;
          padding: 0;
        }
        .mobile-sidebar-drawer {
          display: none;
        }
        @media (max-width: 900px) {
          .mobile-menu-icon {
            display: block !important;
          }
          .mobile-sidebar-drawer {
            display: flex !important;
            flex-direction: column;
            position: fixed;
            top: 0;
            right: 0;
            width: 220px;
            height: 100vh;
            background: linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%);
            z-index: 2002;
            box-shadow: -2px 0 16px 0 rgba(165,180,252,0.18);
            animation: slideInSidebar 0.3s;
            padding: 0;
          }
          .mobile-sidebar-close {
            position: absolute;
            left: 8px;
            top: 8px;
            background: none;
            border: none;
            font-size: 28px;
            color: #a5b4fc;
            cursor: pointer;
            padding: 0;
          }
          .home-main-layout {
            flex-direction: column;
          }
          .home-sidebar-container {
            display: none !important;
          }
          .home-main-content {
            width: 100vw;
            min-width: 0;
            margin: 0;
            padding: 0;
          }
          .home-card-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 12px !important;
            margin: 8px 8px 0 8px !important;
            padding: 0 !important;
            background: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin-top: 8px !important;
          }
          .home-card {
            min-width: 0 !important;
            padding: 1rem 0.5rem !important;
            border-radius: 12px !important;
            margin: 0 !important;
            box-shadow: 0 2px 8px 0 rgba(165,180,252,0.10) !important;
          }
        }
        @media (max-width: 600px) {
          div[style*='background: linear-gradient(120deg, #f0f4ff 0%, #f9e6ff 100%)'] {
            padding: 1rem 0.5rem !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
            border-radius: 12px !important;
            margin-top: 8px !important;
          }
        }
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes popIn {
          0% { transform: scale(0.95); opacity: 0; }
          80% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideInSidebar {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      </div>
      {/* Animations */}
      <style>{`
        /* Responsive Home Layout */
        .home-main-layout {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          width: 100vw;
          min-height: calc(100vh - 72px);
          margin: 0;
          padding: 0;
        }
        .home-sidebar-container {
          width: 120px;
          min-width: 120px;
          max-width: 120px;
          height: 100%;
          position: relative;
          z-index: 2;
          background: transparent;
          display: block;
        }
        .home-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          min-height: calc(100vh - 72px);
          margin: 0;
          padding: 0;
        }
        @media (max-width: 900px) {
          .home-main-layout {
            flex-direction: column;
          }
          .home-sidebar-container {
            display: none !important;
          }
          .home-main-content {
            width: 100vw;
            min-width: 0;
            margin: 0;
            padding: 0;
          }
        }
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes popIn {
          0% { transform: scale(0.95); opacity: 0; }
          80% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 600px) {
          div[style*='background: linear-gradient(120deg, #f0f4ff 0%, #f9e6ff 100%)'] {
            padding: 1rem 0.5rem !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
            border-radius: 12px !important;
            margin-top: 8px !important;
          }
        }
      `}</style>
    </>
  );
}
