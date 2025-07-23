import logo from '../assets/img/logo.jpg';

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
  minHeight: '48px',
  height: '48px',
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
