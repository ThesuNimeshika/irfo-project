import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import { useState } from 'react';

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
  return (
    <>
      <div className="navbar-fixed-wrapper">
        <Navbar />
      </div>
      <div className="home-main-layout" style={{ marginTop: 0, paddingTop: 0, display: 'flex', flexDirection: 'row', height: 'calc(100vh - 72px - 48px)', minHeight: 'unset', overflow: 'hidden' }}>
        {/* Sidebar left-aligned, fixed width (120px) on desktop only */}
        <div className="home-sidebar-container">
          <Sidebar />
        </div>
        {/* Main content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0', height: '100%', overflow: 'auto', padding: 8 }}>
          <div className="setup-main-card magical-bg animated-bg" style={{ borderRadius: 16, background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 16px #0001', padding: 24, minHeight: 0, marginBottom: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="setup-modules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, width: '100%', maxWidth: 1200, marginLeft: 32, marginRight: 0 }}>
              {modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="setup-module-card"
                  style={{ background: '#f8fafc', borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 70, fontSize: 13, cursor: 'pointer', transition: 'box-shadow 0.2s', outline: 'none' }}
                  tabIndex={0}
                  onClick={() => setModalIdx(idx)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setModalIdx(idx); }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{mod.icon}</div>
                  <div style={{ fontWeight: 500, fontSize: 14, textAlign: 'center' }}>{mod.title}</div>
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
              }}
                onClick={() => setModalIdx(null)}
              >
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 4px 32px #0003',
                    padding: 32,
                    minWidth: 320,
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
                  <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 12 }}>{modules[modalIdx].icon} {modules[modalIdx].title}</div>
                  <div style={{ fontSize: 15 }}>{modules[modalIdx].description}</div>
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
