
import { useState } from 'react';

const sidebarWidth = 120; // px, increased for better visibility

const navItems = [
  { label: 'Setup', icon: '⚙️', link: '/setup' },
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
      zIndex: 1200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 72,
      boxShadow: '2px 0 12px 0 rgba(165,180,252,0.10)',
      transition: 'box-shadow 0.3s',
      overflowY: 'auto',
    }}>
      {navItems.map((item) => (
        <div key={item.label} style={{ width: '100%' }}>
          <button
            onClick={() => {
              if (item.children) setReportOpen(v => !v);
              else if (onNavigate) onNavigate(item.link);
            }}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#4f46e5',
              fontWeight: 600,
            fontSize: 14,
            padding: '14px 0 8px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
              position: 'relative',
              lineHeight: 1.1,
            }}
          >
            <span style={{ fontSize: 24, marginBottom: 2 }}>{item.icon}</span>
            <span style={{ fontSize: 12, wordBreak: 'break-word', textAlign: 'center' }}>{item.label}</span>
            {item.children && (
              <span
                style={{ fontSize: 14, color: '#111', marginTop: 2, fontWeight: 700, cursor: 'pointer', position: 'relative' }}
                onMouseEnter={e => {
                  const tooltip = document.createElement('div');
                  tooltip.textContent = 'Click for view more';
                  tooltip.style.position = 'absolute';
                  tooltip.style.bottom = '-28px';
                  tooltip.style.left = '50%';
                  tooltip.style.transform = 'translateX(-50%)';
                  tooltip.style.background = '#111';
                  tooltip.style.color = '#fff';
                  tooltip.style.padding = '2px 8px';
                  tooltip.style.borderRadius = '4px';
                  tooltip.style.fontSize = '11px';
                  tooltip.style.whiteSpace = 'nowrap';
                  tooltip.style.zIndex = '9999';
                  tooltip.className = 'sidebar-tooltip';
                  e.currentTarget.appendChild(tooltip);
                }}
                onMouseLeave={e => {
                  const tooltip = e.currentTarget.querySelector('.sidebar-tooltip');
                  if (tooltip) e.currentTarget.removeChild(tooltip);
                }}
              >
                {reportOpen ? '▲' : '▼'}
              </span>
            )}
          </button>
          {/* Nested menu for Report */}
          {item.children && reportOpen && (
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 8,
              boxShadow: '0 2px 8px 0 rgba(165,180,252,0.10)',
              margin: '0 4px 8px 4px',
              padding: '4px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              animation: 'fadeInCard 0.4s',
            }}>
              {item.children.map(child => (
                <button
                  key={child.label}
                  onClick={() => onNavigate && onNavigate(child.link)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4f46e5',
                    fontSize: 12,
                    padding: '6px 8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: 4,
                    margin: '2px 0',
                    transition: 'background 0.2s',
                    wordBreak: 'break-word',
                  }}
                >
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  // Responsive: show sidebar on desktop, show button on mobile/tablet
  return (
    <>
      {/* Desktop sidebar */}
      <div className="sidebar-desktop">
        <SidebarNav />
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
          <SidebarNav onNavigate={() => setOpen(false)} />
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
