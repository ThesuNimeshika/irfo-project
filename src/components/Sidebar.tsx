import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────
   NAV ITEMS
───────────────────────────────────────────── */
const navItems = [
  { label: 'Dashboard', icon: '🏠', link: '/', shortcut: 'D' },
  { label: 'Setup', icon: '⚙️', link: '/setup', shortcut: 'S' },
  { label: 'Registration', icon: '📝', link: '/registrationsetup', shortcut: 'R' },
  { label: 'Unit Operations', icon: '🔢', link: '/unit-operations', shortcut: 'U' },
  { label: 'Approval', icon: '✅', link: '/approval', shortcut: 'A' },
  { label: 'Doc Printing', icon: '🖨️', link: '/document-printing', shortcut: 'P' },
  { label: 'Process', icon: '🔄', link: '/process', shortcut: 'Z' },
  { label: 'Security', icon: '🔒', link: '/security', shortcut: 'X' },
  {
    label: 'Report', icon: '📊', shortcut: 'R',
    children: [
      { label: 'User Login Details', link: '/report' },
      { label: 'MIS', link: '/report' },
      { label: 'Dividend Reports', link: '/report' },
      { label: 'Other Reports', link: '/report' },
    ],

  },
];

/* ─────────────────────────────────────────────
   SIDEBAR WIDTH
───────────────────────────────────────────── */
const getSidebarWidth = () => {
  if (typeof window === 'undefined') return 188;
  if (window.innerWidth <= 480) return 148;
  if (window.innerWidth <= 768) return 168;
  if (window.innerWidth <= 1024) return 178;
  return 188;
};

/* ─────────────────────────────────────────────
   SIDEBAR NAV (inner)
───────────────────────────────────────────── */
function SidebarNav({ onNavigate }: { onNavigate?: (link: string) => void }) {
  const location = useLocation();
  const [reportOpen, setReportOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(getSidebarWidth());
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const reportBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Sync sidebar width on resize ── */
  useEffect(() => {
    const onResize = () => setSidebarWidth(getSidebarWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Close report dropdown on outside click ── */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (
        reportOpen &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        reportBtnRef.current && !reportBtnRef.current.contains(e.target as Node)
      ) setReportOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [reportOpen]);

  /* ── Route-aware active detection ── */
  const isActive = (link?: string) => {
    if (!link) return false;
    if (link === '/') return location.pathname === '/';
    return location.pathname.toLowerCase().startsWith(link.toLowerCase());
  };

  const isReportActive = navItems
    .find(i => i.label === 'Report')
    ?.children?.some(c => location.pathname.toLowerCase().startsWith(c.link.toLowerCase())) ?? false;

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const iconSize = isMobile ? 12 : 14;

  return (
    <>
      {/* ══════════════════════════════════════
          SCOPED CSS
          ══════════════════════════════════════ */}
      <style>{`
        /* ── Shell ── */
        .sb-shell {
          background    : #ffffff;
          border-right  : 1.5px solid #f0f0f0;
          box-shadow    : 0 4px 20px rgba(0,0,0,0.03);
        }

        /* ── Pill base ── */
        .sb-pill {
          position    : relative;
          display     : flex;
          flex-direction: column;
          align-items : center;
          justify-content: center;
          width       : calc(100% - 24px);
          margin      : 2px 12px;
          padding     : 6px 4px;
          border-radius: 12px;
          border      : 1px solid transparent;
          background  : transparent;
          cursor      : pointer;
          font-family : 'Inter', 'Lato', system-ui, sans-serif;
          font-weight : 600;
          color       : #64748b;
          text-align  : center;
          box-sizing  : border-box;
          gap         : 4px;
          transition  : all 0.2s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Hover state ── */
        .sb-pill:hover {
          background   : #f8fafc !important;
          color        : #6366f1 !important;
          transform    : translateY(-1px);
        }
        .sb-pill:hover .sb-icon-wrap { 
          transform: scale(1.05); 
          background: #eef2ff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
        }

        /* ── Active state ── */
        .sb-pill.is-active {
          background   : #ffffff !important;
          border-color : #e2e8f0 !important;
          box-shadow   : 0 4px 12px rgba(0,0,0,0.05) !important;
          color        : #6366f1 !important;
          transform    : translateY(-1px);
        }

        /* Active accent bar */
        .sb-pill.is-active::after {
          content      : '';
          position     : absolute;
          left         : -4px;
          top          : 20%;
          bottom       : 20%;
          width        : 4px;
          background   : linear-gradient(180deg, #6366f1 0%, #a855f7 100%);
          border-radius: 0 4px 4px 0;
          box-shadow: 2px 0 8px rgba(99, 102, 241, 0.4);
        }

        .sb-icon-wrap {
          display    : flex;
          align-items: center;
          justify-content: center;
          width      : 24px;
          height     : 24px;
          border-radius: 6px;
          background : #f1f5f9;
          border     : 1px solid #e2e8f0;
          transition : all 0.2s;
          font-size  : var(--sb-icon-size, 18px);
          line-height: 1;
        }
        .sb-pill.is-active .sb-icon-wrap {
          background : linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
          border-color: #c7d2fe;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
        }

        .sb-label {
          font-size  : 10px;
          font-weight: 700;
          color      : inherit;
          line-height: 1.2;
          max-width  : 96%;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sb-report-pill {
          flex-direction : row !important;
          justify-content: space-between !important;
          align-items    : center !important;
          padding        : 6px 12px 6px 8px !important;
          gap            : 0 !important;
        }
        .sb-report-left {
          display    : flex;
          align-items: center;
          gap        : 10px;
        }
        .sb-report-pill .sb-label { font-size: 11px; }

        .sb-chevron {
          font-size : 8px;
          transition: transform 0.25s;
          opacity: 0.6;
        }
        .sb-pill.chevron-open .sb-chevron { transform: rotate(180deg); }

        .sb-dropdown {
          background    : rgba(255,255,255,0.98);
          backdrop-filter: blur(12px);
          border        : 1px solid #e2e8f0;
          border-radius : 14px;
          box-shadow    : 0 10px 30px rgba(0,0,0,0.12);
          overflow      : hidden;
          animation     : sbFadeIn 0.2s ease-out;
        }

        @keyframes sbFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: none; }
        }

        .sb-child-btn {
          display    : block;
          width      : 100%;
          padding    : 10px 16px;
          background : none;
          border     : none;
          border-bottom: 1px solid #f1f5f9;
          color      : #64748b;
          font-size  : 12px;
          font-weight: 600;
          text-align : left;
          cursor     : pointer;
          transition : all 0.15s;
        }
        .sb-child-btn:last-child { border-bottom: none; }
        .sb-child-btn:hover {
          background   : #f8fafc;
          color        : #6366f1;
          padding-left : 20px;
        }

        /* ── Divider ── */
        .sb-divider {
          width     : calc(100% - 32px);
          height    : 1.5px;
          background: #f1f5f9;
          border    : none;
          margin    : 8px 16px;
          display   : block;
        }

        /* ── Scrollbar inside sidebar — hidden ── */
        .sb-shell { scrollbar-width: none; }
        .sb-shell::-webkit-scrollbar { display: none; width: 0; }
      `}</style>

      {/* ══════════════════════════════════════
          NAV SHELL
          ══════════════════════════════════════ */}
      <nav
        className="sb-shell"
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          maxWidth: sidebarWidth,
          height: 'calc(100vh - 84px)',
          position: 'fixed',
          top: 54, left: 0,
          zIndex: 800,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          paddingTop: 24,
          paddingBottom: 50,
          overflowY: 'auto',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          transition: 'width 0.25s ease',
        }}
      >
        {/* NAV ITEMS */}
        {navItems.map((item) => (
          <div key={item.label} style={{ width: '100%', boxSizing: 'border-box' }}>

            {item.label === 'Report' && <hr className="sb-divider" />}

            {item.label === 'Report' ? (
              <>
                {/* ── Report pill ── */}
                <button
                  ref={reportBtnRef}
                  type="button"
                  className={[
                    'sb-pill sb-report-pill',
                    isReportActive || reportOpen ? 'is-active' : '',
                    reportOpen ? 'chevron-open' : '',
                  ].join(' ')}
                  onClick={() => {
                    if (!reportOpen && reportBtnRef.current) {
                      const rect = reportBtnRef.current.getBoundingClientRect();
                      setDropdownPos({
                        top: rect.top,      // anchor to top of button; popup will go above
                        left: rect.left,
                        width: rect.width,
                      });
                    }
                    setReportOpen(v => !v);
                  }}
                  aria-haspopup="true"
                  aria-expanded={reportOpen}
                  style={{ '--sb-icon-size': `${iconSize}px` } as React.CSSProperties}
                >
                  <span className="sb-report-left">
                    <span className="sb-icon-wrap">{item.icon}</span>
                    <span className="sb-label">{item.label}</span>
                  </span>
                  <span className="sb-chevron">▲</span>
                </button>

                {/* ── Dropdown — portalled above the button ── */}
                {reportOpen && dropdownPos && createPortal(
                  <div
                    ref={dropdownRef}
                    className="sb-dropdown sb-dropdown-portal"
                    style={{
                      position: 'fixed',
                      left: dropdownPos.left,
                      width: dropdownPos.width,
                      // Place bottom of dropdown at top of button minus a small gap
                      bottom: `calc(100vh - ${dropdownPos.top}px + 6px)`,
                      top: 'auto',
                      zIndex: 9999,
                    }}
                  >
                    {item.children?.map(child => (
                      <button
                        key={child.label}
                        className="sb-child-btn"
                        onClick={() => {
                          setReportOpen(false);
                          onNavigate?.(child.link);
                        }}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>,
                  document.body
                )}
              </>
            ) : (
              /* ── Regular pill ── */
              <button
                className={`sb-pill${isActive(item.link) ? ' is-active' : ''}`}
                onClick={() => { onNavigate?.(item.link!); }}
                style={{ '--sb-icon-size': `${iconSize}px` } as React.CSSProperties}
              >
                <span className="sb-icon-wrap">{item.icon}</span>
                <span className="sb-label">{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR (exported default)
───────────────────────────────────────────── */
export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 480);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* Desktop */}
      <div className="sidebar-desktop">
        <SidebarNav onNavigate={(link) => navigate(link)} />
      </div>

      {/* Mobile FAB */}
      <button
        className="sidebar-fab"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24, right: 24,
          zIndex: 1300,
          width: 50, height: 50,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          color: '#1e3a8a',
          border: '1.5px solid rgba(200,213,255,0.70)',
          boxShadow: '0 4px 20px rgba(30,58,138,0.14), inset 0 1px 0 rgba(255,255,255,0.90)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          cursor: 'pointer',
          transition: 'box-shadow 0.18s, background 0.18s',
        }}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.18)',
            zIndex: 1390,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Mobile drawer */}
      {open && (
        <div
          className="sidebar-drawer"
          style={{
            position: 'fixed',
            top: 0, right: 0,
            width: isMobile ? 220 : 260,
            height: '100vh',
            background: 'rgba(248,250,253,0.92)',
            backdropFilter: 'blur(32px) saturate(200%)',
            WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            borderLeft: '1px solid rgba(200,213,255,0.60)',
            zIndex: 1400,
            boxShadow: '-6px 0 40px rgba(30,58,138,0.10)',
            animation: 'sbSlideIn 0.26s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            style={{
              alignSelf: 'flex-end',
              margin: 12,
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(200,213,255,0.50)',
              borderRadius: 8,
              width: 30, height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              color: '#6b7280',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(30,58,138,0.08)',
            }}
            aria-label="Close menu"
          >
            ×
          </button>
          <SidebarNav onNavigate={(link) => { navigate(link); setOpen(false); }} />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-fab     { display: flex !important; }
        }
        @media (min-width: 769px) {
          .sidebar-desktop { display: block !important; }
          .sidebar-fab     { display: none  !important; }
        }
        @keyframes sbSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: none;             opacity: 1; }
        }
      `}</style>
    </>
  );
}