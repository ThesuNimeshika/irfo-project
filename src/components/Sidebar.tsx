
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const sidebarWidth = 180; // px, increased for better visibility

const navItems = [
  { label: 'Dashboard', icon: '🏠', link: '/' },
  { label: 'Setup', icon: '⚙️', link: '/Setup' },
  { label: 'Registration', icon: '📝', link: '/registration' },
  { label: 'Unit Operations', icon: '🔢', link: '/unit-operations' },
  { label: 'Approval', icon: '✅', link: '/approval' },
  { label: 'Document Printing', icon: '🖨️', link: '/document-printing' },
  { label: 'Security', icon: '🔒', link: '/security' },
  {
    label: 'Report', icon: '📊',
    children: [
      { label: 'MIS', link: '/report/mis' },
      { label: 'Dividend Reports', link: '/report/dividend' },
      { label: 'Other Reports', link: '/report/other' },
    ]
  },
];

function SidebarNav({ onNavigate }: { onNavigate?: (link: string) => void }) {
  const [reportOpen, setReportOpen] = useState(false);
  const [activeLabel, setActiveLabel] = useState('');
  const [reportHovered, setReportHovered] = useState(false);
  const reportBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        reportOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        reportBtnRef.current &&
        !reportBtnRef.current.contains(e.target as Node)
      ) {
        setReportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [reportOpen]);
  return (
    <nav style={{
      width: sidebarWidth,
      minWidth: sidebarWidth,
      maxWidth: sidebarWidth,
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 72,
      boxShadow: '2px 0 12px 0 rgba(165,180,252,0.10)',
      transition: 'box-shadow 0.3s',
      overflowY: 'auto',
    }}>
      {navItems.map((item) => (
        <div key={item.label} style={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          {item.label === 'Report' ? (
            <div className="btn-group dropup" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                className={`sidebar-report-btn${reportOpen ? ' active' : ''}`}
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={reportOpen}
                ref={reportBtnRef}
                onClick={() => {
                  setReportOpen(v => !v);
                  setActiveLabel('Report');
                }}
                onMouseEnter={() => setReportHovered(true)}
                onMouseLeave={() => setReportHovered(false)}
                style={{
                  width: '90%',
                  margin: '8px 0',
                  background: reportOpen || activeLabel === 'Report' ? '#e0e7ff' : 'none',
                  color: '#4f46e5',
                  border: reportOpen || activeLabel === 'Report' ? '2px solid #4f46e5' : '1px solid transparent',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  boxShadow: reportOpen || activeLabel === 'Report' ? '0 2px 12px 0 rgba(79,70,229,0.10)' : undefined,
                  transition: 'box-shadow 0.2s, background 0.2s, border 0.2s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 20, marginRight: 8 }}>{item.icon}</span>
                  Report
                </span>
                <span style={{ marginLeft: 8, fontSize: 14 }}>{reportOpen ? '▲' : '▼'}</span>
              </button>
              {reportHovered && !reportOpen && (
                <div style={{
                  position: 'absolute',
                  top: '-32px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#222',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px 0 rgba(80,80,120,0.10)',
                  zIndex: 3000,
                  pointerEvents: 'none',
                }}>
                  Click to view more
                </div>
              )}
              {reportOpen && (
                <div
                  className="dropdown-menu show"
                  ref={dropdownRef}
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    top: 'auto',
                    transform: 'translateX(-50%)',
                    minWidth: 180,
                    background: '#fff',
                    border: '1px solid #dee2e6',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px 0 rgba(80,80,120,0.25), 0 1.5px 8px 0 rgba(80,80,120,0.10)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '4px 0',
                    marginBottom: 8,
                  }}
                >
                  {item.children && item.children.map(child => (
                    <button
                      key={child.label}
                      className="dropdown-item"
                      onClick={() => {
                        setReportOpen(false);
                        setActiveLabel('Report');
                        if (onNavigate && child.link) onNavigate(child.link);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#212529',
                        fontSize: 15,
                        padding: '8px 20px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: 0,
                        margin: 0,
                        transition: 'background 0.2s',
                        width: '100%',
                        textDecoration: 'none',
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = '#f8f9fa')}
                      onMouseOut={e => (e.currentTarget.style.background = 'none')}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setActiveLabel(item.label);
                if (onNavigate && item.link) onNavigate(item.link);
              }}
              className={`sidebar-btn${activeLabel === item.label ? ' active' : ''}`}
              style={{
                width: '100%',
                background: activeLabel === item.label ? '#e0e7ff' : 'none',
                border: activeLabel === item.label ? '2px solid #4f46e5' : '1px solid transparent',
                color: '#4f46e5',
                fontWeight: 700,
                fontSize: 14,
                padding: '14px 0 8px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: 6,
                transition: 'background 0.2s, border 0.2s',
                position: 'relative',
                lineHeight: 1.1,
              }}
            >
              <span style={{ fontSize: 24, marginBottom: 2 }}>{item.icon}</span>
              <span style={{ fontSize: 12, wordBreak: 'break-word', textAlign: 'center' }}>{item.label}</span>
            </button>
          )}
        </div>
      ))}
      {/* Add Bootstrap-like dropright styles */}
      <style>{`
        .btn.btn-secondary.dropdown-toggle {
          user-select: none;
        }
        .btn.btn-secondary.dropdown-toggle:after {
          display: none;
        }
        .dropdown-menu {
          font-size: 1rem;
        }
        .dropdown-item:active {
          background: #e9ecef !important;
        }
        .dropdown-menu.show {
          display: flex;
        }
        .sidebar-report-btn {
          background: none;
          color: #4f46e5;
          border: 1px solid transparent;
          border-radius: 6px;
          font-weight: 700;
          font-size: 15px;
          transition: box-shadow 0.2s, background 0.2s, border 0.2s;
        }
        .sidebar-report-btn.active {
          background: #e0e7ff !important;
          color: #4f46e5 !important;
          border: 2px solid #4f46e5 !important;
          box-shadow: 0 2px 12px 0 rgba(79,70,229,0.10);
        }
        .sidebar-btn.active {
          background: #e0e7ff !important;
          color: #4f46e5 !important;
          border: 2px solid #4f46e5 !important;
        }
      `}</style>
    </nav>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // Responsive: show sidebar on desktop, show button on mobile/tablet
  return (
    <>
      {/* Desktop sidebar */}
      <div className="sidebar-desktop">
        <SidebarNav onNavigate={(link) => navigate(link)} />
      </div>
      {/* Mobile/Tablet floating button and drawer */}
      <button
        className="sidebar-fab"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a5b4fc 0%, #f0abfc 100%)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 16px 0 rgba(165,180,252,0.18)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          cursor: 'pointer',
        }}
        aria-label="Open sidebar"
      >
        ☰
      </button>
      {open && (
        <div
          className="sidebar-drawer"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 240,
            height: '100vh',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)',
            zIndex: 1400,
            boxShadow: '-2px 0 16px 0 rgba(165,180,252,0.18)',
            animation: 'slideInSidebar 0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => setOpen(false)}
            style={{
              alignSelf: 'flex-end',
              margin: 16,
              background: 'none',
              border: 'none',
              fontSize: 28,
              color: '#a5b4fc',
              cursor: 'pointer',
            }}
            aria-label="Close sidebar"
          >
            ×
          </button>
          <SidebarNav onNavigate={(link) => { navigate(link); setOpen(false); }} />
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-fab { display: flex !important; }
        }
        @media (min-width: 901px) {
          .sidebar-desktop { display: block !important; }
          .sidebar-fab { display: none !important; }
        }
        @keyframes slideInSidebar {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: none; opacity: 1; }
        }
      `}</style>
    </>
  );
}
