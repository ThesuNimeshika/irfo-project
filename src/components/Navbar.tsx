import logo from '../assets/img/logo.png';
import React from 'react';
import { ImExit } from 'react-icons/im';

if (typeof window !== 'undefined') {
  document.body.style.paddingTop = '64px';
  document.body.style.overflowX = 'hidden';
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.width = '100%';
  document.documentElement.style.width = '100%';
}

export default function Navbar() {
  const userName = 'User Name';
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const iconRef = React.useRef<HTMLDivElement>(null);

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

        /* ─── NAVBAR SHELL ─── */
        nav[data-navbar] {
          width: 100%;
          position: fixed;
          top: 0; left: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          height: 64px;
          min-height: 64px;
          background: #ffffff;
          border-bottom: 1.5px solid #e5e7eb;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          box-sizing: border-box;
          overflow: visible;
          padding: 0;
          font-family: 'Lato', system-ui, sans-serif;
        }

        /* ─── LOGO ZONE ───
           Width MUST match sidebar (188px) for perfect alignment */
        .nb-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 188px;
          min-width: 188px;
          height: 64px;
          border-right: 1.5px solid #e5e7eb;
          padding: 4px 10px;
          box-sizing: border-box;
          background: #fff;
          flex-shrink: 0;
        }

        /* The logo image itself */
        .nb-logo img {
          height: 56px;
          width: auto;
          max-width: 168px;
          object-fit: contain;
          display: block;
        }

        /* ─── TITLE ZONE ─── */
        .nb-title {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 24px;
          min-width: 0;
          overflow: hidden;
        }

        .nb-title-main {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: clamp(0.85rem, 1.5vw, 1.30rem);
          color: #0d1117;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        .nb-title-sub {
          font-size: 10px;
          font-weight: 700;
          color: #9ca3af;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          margin-top: 2px;
          white-space: nowrap;
        }

        /* ─── USER ZONE ─── */
        .nb-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 20px;
          height: 64px;
          border-left: 1.5px solid #e5e7eb;
          flex-shrink: 0;
          box-sizing: border-box;
          position: relative;
        }

        .nb-user-info { display: flex; flex-direction: column; align-items: flex-end; }

        .nb-user-name {
          font-size: 13px;
          font-weight: 700;
          color: #1f2937;
          white-space: nowrap;
        }

        .nb-user-role {
          font-size: 10px;
          font-weight: 700;
          color: #9ca3af;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ─── AVATAR BUTTON ─── */
        .nb-avatar {
          width: 36px !important;
          height: 36px !important;
          border-radius: 8px !important;
          background: #1e3a8a !important;
          border: none !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(30,58,138,0.22) !important;
          transition: box-shadow 0.18s, transform 0.18s !important;
          padding: 0 !important;
          outline: none !important;
        }

        .nb-avatar:hover {
          box-shadow: 0 4px 14px rgba(30,58,138,0.36) !important;
          transform: translateY(-1px);
        }

        /* ─── TOOLTIP ─── */
        .nb-tip {
          position: absolute;
          top: 50px; right: 0;
          background: #1e3a8a;
          color: #fff;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(30,58,138,0.28);
          white-space: nowrap;
          z-index: 3001;
          pointer-events: none;
        }
        .nb-tip::after {
          content: '';
          position: absolute;
          top: -5px; right: 10px;
          width: 10px; height: 10px;
          background: #1e3a8a;
          transform: rotate(45deg);
          border-radius: 2px;
        }

        /* ─── DROPDOWN ─── */
        .nb-drop {
          position: fixed;
          top: 68px; right: 16px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          min-width: 186px;
          z-index: 3002;
          overflow: hidden;
        }

        .nb-drop-head {
          padding: 12px 16px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .nb-drop-name { font-size: 13px; font-weight: 700; color: #0d1117; }
        .nb-drop-role {
          font-size: 10px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px;
        }

        .nb-drop-btn {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 10px 16px !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          color: #b91c1c !important;
          background: none !important;
          border: none !important;
          width: 100% !important;
          text-align: left !important;
          cursor: pointer !important;
          transition: background 0.14s !important;
          border-radius: 0 !important;
          font-family: 'Lato', system-ui, sans-serif !important;
        }

        .nb-drop-btn:hover { background: #fef2f2 !important; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .nb-logo { width: 178px; min-width: 178px; }
        }

        @media (max-width: 900px) {
          .nb-logo { width: 168px; min-width: 168px; padding: 4px 8px; }
          .nb-logo img { height: 52px; max-width: 150px; }
          .nb-title-sub { display: none; }
          .nb-user-info { display: none; }
          .nb-user { padding: 0 14px; }
        }

        @media (max-width: 480px) {
          nav[data-navbar] { height: 52px; min-height: 52px; }
          .nb-logo { height: 52px; width: 148px; min-width: 148px; padding: 3px 6px; }
          .nb-logo img { height: 46px; max-width: 136px; }
          .nb-title-main { font-size: 0.76rem; }
          .nb-user { height: 52px; }
        }
      `}</style>

      <nav data-navbar>

        {/* Logo — width matches sidebar */}
        <div className="nb-logo">
          <img src={logo} alt="MSL Logo" />
        </div>

        {/* Title */}
        <div className="nb-title">
          <div className="nb-title-main">
            Investor Registration and Service Solution for Fund Operation
          </div>
          <div className="nb-title-sub">MSL Management Systems (Private) Ltd.</div>
        </div>

        {/* User */}
        <div className="nb-user" ref={iconRef}>
          <div className="nb-user-info">
            <div className="nb-user-name">{userName}</div>
            <div className="nb-user-role">Administrator</div>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              className="nb-avatar"
              aria-label="User menu"
              onClick={() => setDropdownOpen(v => !v)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
              </svg>
            </button>

            {hovered && !dropdownOpen && (
              <div className="nb-tip">{userName}</div>
            )}
          </div>

          {dropdownOpen && (
            <div className="nb-drop">
              <div className="nb-drop-head">
                <div className="nb-drop-name">{userName}</div>
                <div className="nb-drop-role">Administrator</div>
              </div>
              <button
                className="nb-drop-btn"
                onClick={() => { setDropdownOpen(false); alert('Logged out!'); }}
              >
                <ImExit style={{ fontSize: 15 }} />
                Logout
              </button>
            </div>
          )}
        </div>

      </nav>
    </>
  );
}

/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
export function Footer() {
  const companyName = "MSL Management Systems";
  const userName = "User Name";
  const database = "IRFO_DB";
  const currentDate = new Date().toLocaleDateString('en-GB');
  const ipAddress = "0.0.0.0";
  const lastClicked = "--:--:--";

  return (
    <>
      <style>{`
        footer[data-footer] {
          width: 100%;
          position: fixed;
          bottom: 0; left: 0;
          z-index: 800;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 16px;
          background: #ffffff;
          border-top: 1.5px solid #e5e7eb;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
          height: 34px;
          min-height: 34px;
          box-sizing: border-box;
          font-family: 'Lato', system-ui, sans-serif;
          font-size: 11px;
          color: #6b7280;
          overflow: hidden;
        }

        .ft-item {
          display: flex; align-items: center; gap: 4px;
          padding: 0 12px;
          border-right: 1px solid #e5e7eb;
          height: 100%;
          white-space: nowrap;
        }
        .ft-item:last-child { border-right: none; }
        .ft-item b { color: #374151; font-weight: 700; }
        .ft-co { color: #1e3a8a; font-weight: 900; }

        @media (max-width: 900px) { .ft-hide { display: none; } }
        @media (max-width: 600px) {
          footer[data-footer] { font-size: 10px; padding: 0 8px; }
          .ft-item { padding: 0 7px; }
        }
      `}</style>

      <footer data-footer>
        <div className="ft-item"><span className="ft-co">{companyName}</span></div>
        <div className="ft-item ft-hide"><b>User:</b>&nbsp;{userName}</div>
        <div className="ft-item ft-hide"><b>DB:</b>&nbsp;{database}</div>
        <div className="ft-item"><b>Date:</b>&nbsp;{currentDate}</div>
        <div className="ft-item ft-hide"><b>IP:</b>&nbsp;{ipAddress}</div>
        <div className="ft-item"><b>Last Click:</b>&nbsp;{lastClicked}</div>
      </footer>
    </>
  );
}