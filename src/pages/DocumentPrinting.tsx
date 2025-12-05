import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// ========================================
// STATIC DATA AND CONFIGURATION
// ========================================

// 4 Document Printing cards
const moduleData = [
  { title: 'Certificate Print', icon: '📜' },
  { title: 'Inquiry on Unit Holders', icon: '🔍' },
  { title: 'Audit Inquiry', icon: '📊' },
  { title: 'WHT Certificate Printing', icon: '🧾' },
];

const modules = moduleData.map(m => ({
  title: m.title,
  icon: m.icon,
}));

// ========================================
// MAIN DOCUMENT PRINTING COMPONENT
// ========================================

function DocumentPrinting() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ========================================
  // HANDLERS
  // ========================================

  const handleModalOpen = (idx: number) => {
    setModalIdx(idx);
  };

  const handleModalClose = () => {
    setModalIdx(null);
  };

  // ========================================
  // RENDER
  // ========================================

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
            {/* Document Printing Cards Grid */}
            <div className="setup-modules-grid">
              {modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="setup-module-card"
                  tabIndex={0}
                  onClick={() => handleModalOpen(idx)}
                  onKeyDown={e => { 
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleModalOpen(idx);
                    }
                  }}
                >
                  <div className="setup-module-icon">{mod.icon}</div>
                  <div className="setup-module-title">{mod.title}</div>
                </div>
              ))}
            </div>
            
            {/* Modal */}
            {modalIdx !== null && createPortal(
              <div className={`setup-modal-overlay ${isMobile ? 'mobile' : ''}`}
                onClick={handleModalClose}
              >
                <div className={`setup-modal-container ${isMobile ? 'mobile' : ''}`}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="setup-modal-header">
                    <div className="setup-modal-header-content">
                      <span className="setup-modal-header-icon">{modules[modalIdx].icon}</span>
                      <span className="setup-modal-header-title">{modules[modalIdx].title}</span>
                    </div>
                    <button
                      onClick={handleModalClose}
                      className="setup-modal-close-btn"
                      aria-label="Close modal"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="setup-modal-content">
                    <div className="empty-content">
                      <p>Content for {modules[modalIdx].title} will be implemented here.</p>
                      <p>This is a placeholder modal.</p>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="setup-modal-footer">
                    <p>Document Printing Module</p>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DocumentPrinting;

