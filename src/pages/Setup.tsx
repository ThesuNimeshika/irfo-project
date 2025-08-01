import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import { useState, useEffect } from 'react';

const moduleData = [
  { title: 'Bank', icon: '🏦' },
  { title: 'Transaction Type', icon: '🔄' },
  { title: 'System Calendar', icon: '📅' },
  { title: 'Trustees', icon: '👔' },
  { title: 'Custodian', icon: '🗄️' },
  { title: 'Postal Area', icon: '📮' },
  { title: 'Dividend Type', icon: '💸' },
  { title: 'Funds', icon: '💰' },
  { title: 'Company', icon: '🏢' },
  { title: 'Promotional Activity', icon: '🎉' },
  { title: 'Other charges', icon: '💳' },
  { title: 'Unit Fee Codes', icon: '🧾' },
  { title: 'Agency Type', icon: '🏷️' },
  { title: 'Agency', icon: '🏬' },
  { title: 'Sub Agency', icon: '🏪' },
  { title: 'Agents', icon: '🧑‍💼' },
  { title: 'Territory', icon: '🗺️' },
  { title: 'Commision Type', icon: '📊' },
  { title: 'Commission Level', icon: '📈' },
  { title: 'Agent commission Definitions', icon: '📝' },
  { title: 'Assign Agents to Commission Definition', icon: '🔗' },
  { title: 'Institution Category', icon: '🏛️' },
  { title: 'Documents Setup', icon: '📄' },
  { title: 'Institution', icon: '🏫' },
  { title: 'Blocking Category', icon: '🚫' },
  { title: 'Customer Zone', icon: '🌐' },
  { title: 'Join Sale Agent', icon: '🤝' },
  { title: 'Complience MSG Setup', icon: '💬' },
  { title: 'Product type', icon: '📦' },
  { title: 'Title', icon: '🔔' },
];

const modules = moduleData.map(m => ({
  title: m.title,
  icon: m.icon,
  description: `Setup for ${m.title}`
}));

function Setup() {
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="navbar-fixed-wrapper">
        <Navbar />
      </div>
      <div className="home-main-layout" style={{ 
        marginTop: 0, 
        paddingTop: 0, 
        display: 'flex', 
        flexDirection: 'row', 
        height: '100vh', 
        minHeight: 'unset', 
        overflow: 'hidden',
        marginBottom: 0,
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)'
      }}>
        {/* Sidebar left-aligned, fixed width on desktop only */}
        <div className="home-sidebar-container">
          <Sidebar />
        </div>
        {/* Main content area */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 0, 
          height: '100vh', 
          overflow: 'auto', 
          padding: 0,
          marginBottom: 0,
          paddingTop: '50px'
        }}>
          <div className="setup-main-card magical-bg animated-bg" style={{ 
            borderRadius: 16, 
            background: 'linear-gradient(120deg, rgba(255,255,255,0.99) 85%, rgba(79,70,229,0.06) 100%), linear-gradient(100deg, rgba(217,70,239,0.04) 0%, rgba(245,158,66,0.04) 100%)', 
            boxShadow: '0 6px 32px 0 rgba(80, 80, 120, 0.13)', 
            padding: 24, 
            minHeight: 0, 
            marginBottom: 0, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid rgba(80,80,120,0.13)',
            backdropFilter: 'blur(2px)'
          }}>
            <div className="setup-modules-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: 'repeat(5, 1fr)',
              gap: '14px', 
              width: '88%', 
              height: '70%',
              alignContent: 'center',
              justifyContent: 'center',
              padding: '18px',
              margin: '0 auto'
            }}>
              {modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="setup-module-card"
                  style={{ 
                    background: '#f8fafc', 
                    borderRadius: 8, 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                    padding: '8px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    fontSize: '12px', 
                    cursor: 'pointer', 
                    transition: 'box-shadow 0.2s, transform 0.2s', 
                    outline: 'none',
                    border: '1px solid #e5e7eb',
                    margin: '3px'
                  }}
                  tabIndex={0}
                  onClick={() => setModalIdx(idx)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setModalIdx(idx); }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{mod.icon}</div>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '11px', 
                    textAlign: 'center',
                    lineHeight: 1.1,
                    wordBreak: 'break-word',
                    color: '#333'
                  }}>{mod.title}</div>
                </div>
              ))}
            </div>
            {/* Modal Popup */}
            {modalIdx !== null && (
              <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.25)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? 16 : 32,
              }}
                onClick={() => setModalIdx(null)}
              >
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 4px 32px #0003',
                    padding: isMobile ? 20 : 32,
                    minWidth: isMobile ? 280 : 320,
                    maxWidth: '90vw',
                    minHeight: 120,
                    position: 'relative',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setModalIdx(null)}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'none',
                      border: 'none',
                      fontSize: 22,
                      color: '#888',
                      cursor: 'pointer',
                    }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <div style={{ fontWeight: 600, fontSize: isMobile ? 18 : 20, marginBottom: 12 }}>{modules[modalIdx].icon} {modules[modalIdx].title}</div>
                  <div style={{ fontSize: isMobile ? 14 : 15 }}>{modules[modalIdx].description}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Setup;
