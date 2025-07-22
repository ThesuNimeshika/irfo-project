import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';



export default function Home() {
  // Simulate backend value updates with animation
  const [creationPrice, setCreationPrice] = useState(100.00);
  const [redeemPrice, setRedeemPrice] = useState(95.00);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 900 : false);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 900);

  // Animate value changes every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCreationPrice(p => +(p + (Math.random() - 0.5) * 2).toFixed(2));
      setRedeemPrice(p => +(p + (Math.random() - 0.5) * 2).toFixed(2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update isMobile and open/close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <>
      <div className="navbar-fixed-wrapper">
        <Navbar />
      </div>
      {/* Mobile menu icon (hamburger) - visible only in mobile, after navbar */}
      {isMobile && (
        <>
          <button
            className="mobile-menu-icon"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar menu"}
            onClick={() => setSidebarOpen(o => !o)}
            style={{zIndex: 3500}}
          >
            {sidebarOpen ? (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="7" y1="7" x2="21" y2="21" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="21" y1="7" x2="7" y2="21" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="7" width="32" height="3.5" rx="1.75" fill="#4f46e5" />
                <rect y="14" width="32" height="3.5" rx="1.75" fill="#4f46e5" />
                <rect y="21" width="32" height="3.5" rx="1.75" fill="#4f46e5" />
              </svg>
            )}
          </button>
          {sidebarOpen && (
            <>
              <div className="mobile-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
              <div className="mobile-sidebar-drawer">
                <button className="sidebar-close-icon" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="7" y1="7" x2="21" y2="21" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="21" y1="7" x2="7" y2="21" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
                <Sidebar />
              </div>
            </>
          )}
        </>
      )}
      <div className="home-main-layout">
        {/* Sidebar left-aligned, fixed width (120px) on desktop */}
        {!isMobile && (
          <div className="home-sidebar-container">
            <Sidebar />
          </div>
        )}
        {/* Main content */}
        <div className="home-main-content">
          <div className="home-cards-container">
            {/* Creation Price Card */}
            <div className="home-card home-card-creation">
              {creationIcon}
              <div>
                <div className="home-card-title">Creation Price</div>
                <div className="home-card-value creation">${creationPrice.toFixed(2)}</div>
              </div>
            </div>
            {/* Redeem Price Card */}
            <div className="home-card home-card-redeem">
              {redeemIcon}
              <div>
                <div className="home-card-title">Redeem Price</div>
                <div className="home-card-value redeem">${redeemPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Animations and Responsive Styles */}
      <style>{`
        html, body, #root {
          max-width: 100vw;
          overflow-x: hidden;
        }
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
          z-index: 1;
          background: transparent;
          display: block;
        }
        /* Sidebar Drawer Overlay (mobile) */
        .mobile-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.18);
          z-index: 3999;
        }
        .mobile-sidebar-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 80vw;
          max-width: 320px;
          height: 100vh;
          background: #fff;
          box-shadow: -2px 0 16px 0 rgba(79,70,229,0.10);
          z-index: 4000;
          display: flex;
          flex-direction: column;
          animation: slideInSidebar 0.25s cubic-bezier(.4,0,.2,1);
          overflow-y: auto;
        }
        .sidebar-close-icon {
          background: none;
          border: none;
          cursor: pointer;
          z-index: 4002;
          padding: 4px;
        }
        @keyframes slideInSidebar {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: none; opacity: 1; }
        }
        /* Mobile menu icon (hamburger) */
        .mobile-menu-icon {
          position: fixed;
          top: 18px;
          right: 18px;
          z-index: 3500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: none;
        }
        /* Ensure Navbar is always above sidebar and sidebar drawer */
        .navbar-fixed-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          z-index: 1000;
          background: transparent;
        }
        .navbar-fixed-wrapper > * {
          z-index: 1001;
        }
        .home-main-layout {
          padding-top: 64px;
        }
        .home-sidebar-container {
          z-index: 1;
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
        .home-cards-container {
          width: 100%;
          background: linear-gradient(120deg, #f0f4ff 0%, #f9e6ff 100%);
          border-radius: 0;
          box-shadow: 0 8px 32px 0 rgba(165,180,252,0.10);
          padding: 2rem 2vw;
          display: flex;
          flex-direction: row;
          gap: 32px;
          justify-content: center;
          align-items: stretch;
          transition: box-shadow 0.3s;
          animation: fadeInCard 1s cubic-bezier(.4,0,.2,1);
          margin-top: 0;
          box-sizing: border-box;
        }
        /* Remove webview-specific margin, use layout padding instead */
        .home-card {
          flex: 1;
          min-width: 180px;
          border-radius: 18px;
          box-shadow: 0 4px 16px 0 rgba(165,180,252,0.15);
          padding: 1.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #2d2d2d;
          font-weight: 600;
          font-size: 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s;
          min-height: 120px;
          margin-bottom: 0;
        }
        .home-card-creation {
          background: linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%);
          animation: popIn 0.8s cubic-bezier(.4,0,.2,1);
        }
        .home-card-redeem {
          background: linear-gradient(135deg, #f9e6ff 0%, #f0abfc 100%);
          animation: popIn 1.1s cubic-bezier(.4,0,.2,1);
        }
        .home-card-title {
          font-size: 16px;
          opacity: 0.7;
        }
        .home-card-value {
          font-size: 28px;
          font-weight: 700;
          transition: color 0.3s;
        }
        .home-card-value.creation {
          color: #4f46e5;
        }
        .home-card-value.redeem {
          color: #d946ef;
        }
        /* Sidebar mobile styles removed as requested */
        @media (max-width: 1100px) {
          .home-cards-container {
            gap: 16px;
            padding: 1.5rem 1vw;
          }
        }
        @media (max-width: 900px) {
          .home-main-layout {
            flex-direction: column;
            padding-top: 40px;
          }
          .home-sidebar-container {
            display: none !important;
          }
          .mobile-menu-icon {
            display: block;
          }
          .home-main-content {
            width: 100vw;
            min-width: 0;
            margin: 0;
            padding: 0;
          }
          .home-cards-container {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
            padding: 1.2rem 5px !important; /* 5px left/right padding */
            margin-top: 0;
            margin-bottom: 0;
            box-sizing: border-box;
          }
          .home-card {
            min-width: 0;
            font-size: 18px;
            padding: 1.2rem 0.7rem;
          }
        }
        @media (max-width: 600px) {
          .home-cards-container {
            padding: 1rem 5px !important;
            margin: 8px 2px 0 2px !important;
            border-radius: 12px !important;
            margin-top: 0 !important;
          }
          .home-card {
            font-size: 16px;
            padding: 1rem 0.5rem;
            min-height: 90px;
          }
          .home-card-title {
            font-size: 14px;
          }
          .home-card-value {
            font-size: 22px;
          }
        }
        @media (max-width: 400px) {
          .home-cards-container {
            padding: 0.5rem 0.2rem !important;
            margin: 8px 2px 0 2px !important;
          }
          .home-card {
            font-size: 14px;
            padding: 0.7rem 0.2rem;
            min-height: 70px;
          }
          .home-card-title {
            font-size: 12px;
          }
          .home-card-value {
            font-size: 16px;
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
      `}</style>
    </>
  );
}
