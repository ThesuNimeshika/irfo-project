import logo from '../assets/img/logo.jpg';
import React from 'react'; // Added missing import for React
import { ImExit } from 'react-icons/im';

const navbarStyle: React.CSSProperties = {
  width: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'stretch', // stretch children to navbar height
  padding: '0 0 0 0',
  background: 'linear-gradient(90deg, #fff 0px, rgba(255,255,255,0.85) 32px, rgba(255,255,255,0.0) 64px, #e0e7ff 80px, #a5b4fc 40%, #f0abfc 70%, #a5b4fc 100%)',
  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)',
  minHeight: '72px',
  height: '72px',
  boxSizing: 'border-box',
  gap: 0,
  overflow: 'hidden',
};

const logoStyle: React.CSSProperties = {
  height: '100%',
  width: 'auto',
  objectFit: 'contain',
  background: 'transparent',
  marginRight: '1rem',
  marginLeft: 0,
  marginTop: 0,
  marginBottom: 0,
  paddingTop: 0,
  paddingBottom: 0,
  display: 'block',
  boxSizing: 'border-box',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'Times New Roman, Times, serif',
  fontWeight: 700,
  fontSize: 'clamp(1.1rem, 2.5vw, 2.2rem)',
  color: '#2d2d2d',
  textShadow: '0 2px 12px #fff, 0 1px 2px #a5b4fc, 0 2px 8px #f0abfc',
  letterSpacing: '0.01em',
  lineHeight: 1.1,
  flex: 1,
  textAlign: 'right',
  userSelect: 'none',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  paddingLeft: 0,
  paddingRight: 0,
  whiteSpace: 'normal',
  overflow: 'visible',
};

// Add body padding to prevent content being hidden under the fixed navbar and prevent horizontal scroll
if (typeof window !== 'undefined') {
  document.body.style.paddingTop = '64px';
  document.body.style.overflowX = 'hidden';
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.width = '100%';
  document.documentElement.style.width = '100%';
}

export default function Navbar() {
  // Simulate user info
  const userName = 'User Name';
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const iconRef = React.useRef<HTMLDivElement>(null);
  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownOpen && iconRef.current && !iconRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);
  return (
    <>
      <style>{`
        html, body, #root {
          width: 100% !important;
          max-width: 100vw !important;
          overflow-x: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }
        @media (max-width: 600px) {
          nav[data-navbar] {
            padding-left: 0 !important;
            padding-right: 0.5rem !important;
            min-height: 32px !important;
            height: 32px !important;
            width: 100vw !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }
          nav[data-navbar] img {
            height: 100% !important;
            width: auto !important;
            margin-right: 0.5rem !important;
            box-sizing: border-box !important;
          }
          nav[data-navbar] span {
            font-size: 0.85rem !important;
            text-align: right !important;
            padding-left: 0 !important;
            padding-right: 5px !important;
            word-break: break-word !important;
            white-space: normal !important;
            overflow: visible !important;
            display: block !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
      <nav style={navbarStyle} data-navbar>
        <img src={logo} alt="System Logo" style={logoStyle} />
        <span style={titleStyle}>
          Investor Registration and Service Solution for Fund Operation
        </span>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: 16, paddingRight: 24 }} ref={iconRef}>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginLeft: 16,
              display: 'flex',
              alignItems: 'center',
              outline: 'none',
              position: 'relative',
            }}
            aria-label="User menu"
            onClick={() => setDropdownOpen(v => !v)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* User Icon SVG */}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ borderRadius: '50%', background: '#e0e7ff', padding: 5 }}>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
            </svg>
          </button>
          {/* Tooltip */}
          {hovered && (
            <div style={{
              position: 'absolute',
              top: 44,
              right: 0,
              background: '#fff',
              color: '#222',
              border: '1px solid #eee',
              borderRadius: 6,
              padding: '4px 12px',
              fontSize: 14,
              boxShadow: '0 2px 8px 0 rgba(80,80,120,0.10)',
              whiteSpace: 'nowrap',
              zIndex: 3001,
            }}>
              {userName}
            </div>
          )}
          {/* Dropdown */}
          {dropdownOpen && (
            <div style={{
              position: 'fixed',
              top: 72,
              right: 32,
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: 8,
              boxShadow: '0 4px 16px 0 rgba(80,80,120,0.13)',
              minWidth: 120,
              zIndex: 3002,
              padding: '10px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              marginTop: 4,
            }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d946ef',
                  fontWeight: 700,
                  fontSize: 15,
                  padding: '8px 18px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 6,
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => {
                  setDropdownOpen(false);
                  // Add logout logic here
                  alert('Logged out!');
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#f9e6ff')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                <span>Logout</span>
                <ImExit style={{ color: '#ef4444', marginLeft: 8, fontSize: 18, verticalAlign: 'middle' }} />
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

// Footer styles (similar to navbar, but fixed bottom)
const footerStyle: React.CSSProperties = {
  width: '100%',
  position: 'fixed',
  bottom: 0,
  left: 0,
  zIndex: 900,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 1.5rem',
  background: 'linear-gradient(90deg, #fff 0px, rgba(255,255,255,0.85) 32px, rgba(255,255,255,0.0) 64px, #e0e7ff 80px, #a5b4fc 40%, #f0abfc 70%, #a5b4fc 100%)',
  boxShadow: '0 -2px 8px 0 rgba(0,0,0,0.07)',
  minHeight: '60px',
  height: '59px',
  boxSizing: 'border-box',
  gap: 0,
  overflow: 'hidden',
  fontSize: 15,
};

export function Footer() {
  // Placeholder values, replace with backend data as needed
  const companyName = "Company Name";
  const userName = "User Name";
  const database = "Database";
  const currentDate = new Date().toLocaleDateString();
  const ipAddress = "0.0.0.0";
  const lastClicked = "--:--:--";

  return (
    <footer style={footerStyle} data-footer>
      <span style={{ fontWeight: 700, color: '#4f46e5', marginRight: 24 }}>{companyName}:</span>
      <span style={{ marginRight: 18 }}><b>User name:</b> {userName}</span>
      <span style={{ marginRight: 18 }}><b>Database:</b> {database}</span>
      <span style={{ marginRight: 18 }}><b>Date:</b> {currentDate}</span>
      <span style={{ marginRight: 18 }}><b>IP Address:</b> {ipAddress}</span>
      <span><b>Last Clicked time:</b> {lastClicked}</span>
    </footer>
  );
}
