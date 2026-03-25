import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const moduleData = [
  { title: 'User Creation', icon: '🍎' },
  { title: 'Password Changer', icon: '🛡️' },
  { title: 'User Rights', icon: '🛡️' },
  { title: 'Back Up', icon: '💽' },
  { title: 'Day End', icon: '🔄' },
  { title: 'User login Details', icon: '📝' },
  { title: 'Mobile Excel File Upload', icon: '📊' },
];

const modules = moduleData.map(m => ({ title: m.title, icon: m.icon }));

function Security() {
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleModalOpen = (index: number) => setModalIdx(index);
  const handleModalClose = () => setModalIdx(null);

  const renderActiveModal = () => {
    if (modalIdx === null) return null;
    const title = modules[modalIdx].title;

    if (title === 'Password Changer') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-700)', marginBottom: '24px', letterSpacing: '0.02em', fontFamily: 'var(--font-body)' }}>Change Password</h2>

          <div className="setup-input-section" style={{ maxWidth: '450px', width: '100%', padding: '28px', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--r-md)', background: 'var(--white)' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Search Row */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="setup-input-group" style={{ flex: 1, margin: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔍</span>
                    <input type="text" className="setup-input-field" placeholder="Search User Name" style={{ textIndent: '26px', height: '40px', borderRadius: 'var(--r-sm)', fontSize: '13px' }} />
                  </div>
                </div>
                <button className="setup-btn" style={{ height: '40px', minWidth: '85px', justifyContent: 'center', borderRadius: 'var(--r-sm)', background: 'var(--white)', color: 'var(--text-700)', border: '1px solid var(--border-mid)', boxShadow: 'var(--shadow-xs)', fontWeight: 'bold' }}>Load</button>
              </div>

              {/* Current Password */}
              <div className="setup-input-group" style={{ margin: 0 }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔒</span>
                  <input type="password" className="setup-input-field" placeholder="Current Password" style={{ textIndent: '26px', height: '40px', borderRadius: 'var(--r-sm)', fontSize: '13px' }} />
                </div>
              </div>

              {/* New Password */}
              <div className="setup-input-group" style={{ margin: 0 }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔒</span>
                  <input type="password" className="setup-input-field" placeholder="New Password" style={{ textIndent: '26px', height: '40px', borderRadius: 'var(--r-sm)', fontSize: '13px' }} />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="setup-input-group" style={{ margin: 0 }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔒</span>
                  <input type="password" className="setup-input-field" placeholder="Confirm Password" style={{ textIndent: '26px', height: '40px', borderRadius: 'var(--r-sm)', fontSize: '13px' }} />
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="setup-action-buttons" style={{ marginTop: '32px' }}>
              <button className="setup-btn" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-mid) 100%)', padding: '12px 48px', borderRadius: 'var(--r-lg)', fontSize: '14px', boxShadow: '0 4px 12px rgba(30,58,138,0.25)', border: 'none', color: 'white' }}>
                Change Password
              </button>
            </div>

          </div>

          <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-500)', fontWeight: 500 }}>
            © 2026 Management Systems (Pvt) Ltd | All rights reserved
          </div>
        </div>
      );
    }

    return (
      <div className="empty-content" style={{ padding: '20px', textAlign: 'center' }}>
        <p>Content for <strong>{title}</strong> will be implemented here.</p>
        <p>This is a placeholder modal for the Security Dashboard.</p>
      </div>
    );
  };

  return (
    <>
      <div className="navbar-fixed-wrapper">
        <Navbar />
      </div>

      <div className="setup-main-layout">
        <div className="home-sidebar-container">
          <Sidebar />
        </div>

        <div className="setup-main-content">
          <div className="setup-main-card magical-bg animated-bg">

            <div className="setup-modules-grid">
              {modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="setup-module-card"
                  tabIndex={0}
                  onClick={() => handleModalOpen(idx)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleModalOpen(idx); }}
                >
                  <div className="setup-module-icon">{mod.icon}</div>
                  <div className="setup-module-title">{mod.title}</div>
                </div>
              ))}
            </div>

            {/* Modal Portal matching UnitOperations.tsx */}
            {modalIdx !== null && createPortal(
              <div className={`setup-modal-overlay ${isMobile ? 'mobile' : ''}`} onClick={handleModalClose}>
                <div className={`setup-modal-container ${isMobile ? 'mobile' : ''}`} onClick={e => e.stopPropagation()}>

                  <div className="setup-modal-header">
                    <div className="setup-modal-header-content">
                      <span className="setup-modal-header-icon">{modules[modalIdx].icon}</span>
                      <span className="setup-modal-header-title">{modules[modalIdx].title}</span>
                    </div>
                    <button onClick={handleModalClose} className="setup-modal-close-btn" aria-label="Close modal">×</button>
                  </div>

                  <div className="setup-modal-content" style={{ overflow: 'auto', padding: '8px', isolation: 'auto' }}>
                    {renderActiveModal()}
                  </div>

                  <div className="setup-modal-footer">
                    <p>Security Dashboard Module</p>
                  </div>

                </div>
              </div>,
              document.body
            )}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Security;
