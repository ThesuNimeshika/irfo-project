import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────
   NAV ITEMS
───────────────────────────────────────────── */
const navItems = [
  { label: 'Dashboard',        icon: '🏠',  link: '/',                  shortcut: 'D' },
  { label: 'Setup',            icon: '⚙️',  link: '/setup',             shortcut: 'S' },
  { label: 'Registration',     icon: '📝',  link: '/registrationsetup', shortcut: 'R' },
  { label: 'Unit Operations',  icon: '🔢',  link: '/unit-operations',   shortcut: 'U' },
  { label: 'Approval',         icon: '✅',  link: '/approval',          shortcut: 'A' },
  { label: 'Doc Printing',     icon: '🖨️',  link: '/document-printing', shortcut: 'P' },
  { label: 'Security',         icon: '🔒',  link: '/security',          shortcut: 'X' },
  {
    label: 'Report', icon: '📊', shortcut: 'R',
    children: [
      { label: 'MIS',              link: '/report/mis' },
      { label: 'Dividend Reports', link: '/report/dividend' },
      { label: 'Other Reports',    link: '/report/other' },
    ],
  },
];

/* ─────────────────────────────────────────────
   SIDEBAR WIDTH
───────────────────────────────────────────── */
const getSidebarWidth = () => {
  if (typeof window === 'undefined') return 188;
  if (window.innerWidth <= 480)  return 148;
  if (window.innerWidth <= 768)  return 168;
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
  const reportBtnRef  = useRef<HTMLButtonElement>(null);
  const dropdownRef   = useRef<HTMLDivElement>(null);

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
  const iconSize  = isMobile ? 20 : 23;

  return (
    <>
      {/* ══════════════════════════════════════
          SCOPED CSS
          ══════════════════════════════════════ */}
      <style>{`
        /* ── Shell ── */
        .sb-shell {
          background    : rgba(255,255,255,0.78);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border-right  : 1px solid rgba(255,255,255,0.92);
          box-shadow    : 2px 0 24px rgba(30,58,138,0.07), 1px 0 0 rgba(0,0,0,0.04);
        }

        /* ── Pill base ── */
        .sb-pill {
          position    : relative;
          display     : flex;
          flex-direction: column;
          align-items : center;
          justify-content: center;
          width       : calc(100% - 20px);
          margin      : 1px 10px;
          padding     : 9px 4px 7px;
          border-radius: 10px;
          border      : 1px solid transparent;
          background  : transparent;
          cursor      : pointer;
          font-family : 'Lato', system-ui, sans-serif;
          font-weight : 700;
          color       : #6b7280;
          text-align  : center;
          box-sizing  : border-box;
          gap         : 4px;
          transition  :
            background   0.18s cubic-bezier(0.4,0,0.2,1),
            border-color 0.18s cubic-bezier(0.4,0,0.2,1),
            box-shadow   0.18s cubic-bezier(0.4,0,0.2,1),
            color        0.18s cubic-bezier(0.4,0,0.2,1),
            transform    0.18s cubic-bezier(0.4,0,0.2,1);
        }

        /* Glass shimmer on pill */
        .sb-pill::before {
          content      : '';
          position     : absolute;
          inset        : 0;
          border-radius: 10px;
          background   : linear-gradient(150deg,
            rgba(255,255,255,0.70) 0%,
            rgba(255,255,255,0.20) 60%,
            rgba(255,255,255,0.02) 100%);
          opacity      : 0;
          transition   : opacity 0.18s;
          pointer-events: none;
        }

        /* ── Hover state ── */
        .sb-pill:hover {
          background   : rgba(255,255,255,0.82) !important;
          border-color : rgba(200,213,255,0.60) !important;
          box-shadow   :
            0 2px 14px rgba(30,58,138,0.08),
            0 1px 3px  rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.90) !important;
          color        : #1e3a8a !important;
          transform    : translateY(-1px);
        }
        .sb-pill:hover::before { opacity: 1; }
        .sb-pill:hover .sb-icon-wrap { transform: scale(1.08) translateY(-1px); }

        /* ── Active state ── */
        .sb-pill.is-active {
          background   : rgba(255,255,255,0.94) !important;
          border-color : rgba(147,176,255,0.55) !important;
          box-shadow   :
            0 3px 18px rgba(30,58,138,0.11),
            0 1px 5px  rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.95) !important;
          color        : #1e3a8a !important;
          transform    : translateY(-1px);
        }
        .sb-pill.is-active::before { opacity: 1; }
        .sb-pill.is-active .sb-icon-wrap { transform: scale(1.08) translateY(-1px); }

        /* Active left accent stripe */
        .sb-pill.is-active::after {
          content      : '';
          position     : absolute;
          left         : 0;
          top          : 22%;
          bottom       : 22%;
          width        : 3px;
          background   : linear-gradient(180deg, #1d4ed8 0%, #60a5fa 100%);
          border-radius: 0 3px 3px 0;
        }

        /* ── Icon wrapper ── */
        .sb-icon-wrap {
          display    : flex;
          align-items: center;
          justify-content: center;
          width      : 36px;
          height     : 36px;
          border-radius: 9px;
          background : rgba(241,245,255,0.70);
          border     : 1px solid rgba(200,213,255,0.30);
          margin-bottom: 2px;
          transition : transform 0.18s cubic-bezier(0.4,0,0.2,1),
                       background 0.18s, border-color 0.18s, box-shadow 0.18s;
          font-size  : var(--sb-icon-size, 20px);
          line-height: 1;
          box-shadow : 0 1px 3px rgba(30,58,138,0.06), inset 0 1px 0 rgba(255,255,255,0.90);
        }
        .sb-pill:hover   .sb-icon-wrap {
          background   : rgba(219,229,255,0.70);
          border-color : rgba(147,176,255,0.50);
          box-shadow   : 0 2px 8px rgba(30,58,138,0.10), inset 0 1px 0 rgba(255,255,255,0.95);
        }
        .sb-pill.is-active .sb-icon-wrap {
          background : rgba(219,229,255,0.90);
          border-color: rgba(99,141,255,0.55);
          box-shadow : 0 2px 10px rgba(30,58,138,0.14), inset 0 1px 0 rgba(255,255,255,0.95);
        }

        /* ── Label ── */
        .sb-label {
          font-size  : 10.5px;
          font-weight: 700;
          color      : inherit;
          line-height: 1.2;
          max-width  : 96%;
          white-space: nowrap;
          overflow   : hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.01em;
        }

        /* ── Report pill (horizontal) ── */
        .sb-report-pill {
          flex-direction : row !important;
          justify-content: space-between !important;
          align-items    : center !important;
          padding        : 9px 10px 9px 8px !important;
          gap            : 0 !important;
        }
        .sb-report-left {
          display    : flex;
          align-items: center;
          gap        : 8px;
        }
        .sb-report-pill .sb-label { font-size: 12px; white-space: nowrap; }
        .sb-report-pill .sb-icon-wrap { margin-bottom: 0; }

        .sb-chevron {
          font-size : 9px;
          color     : inherit;
          opacity   : 0.45;
          transition: transform 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.18s;
          flex-shrink: 0;
          margin-left: 2px;
        }
        .sb-pill:hover   .sb-chevron { opacity: 0.85; }
        .sb-pill.is-active .sb-chevron { opacity: 0.85; }
        .sb-pill.chevron-open .sb-chevron { transform: rotate(180deg); opacity: 0.85; }

        /* ── Dropdown panel ── */
        .sb-dropdown {
          background    : rgba(255,255,255,0.96);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border        : 1px solid rgba(200,213,255,0.60);
          border-radius : 12px;
          box-shadow    :
            0 -4px 24px rgba(30,58,138,0.12),
            0 -1px 8px  rgba(30,58,138,0.06),
            inset 0 -1px 0 rgba(255,255,255,0.90);
          overflow      : hidden;
          animation     : sbFadeUp 0.18s cubic-bezier(0.4,0,0.2,1);
          box-sizing    : border-box;
        }

        /* Portal dropdown overrides (position is set inline) */
        .sb-dropdown-portal {
          width: auto !important;
          margin: 0 !important;
        }

        @keyframes sbFadeUp {
          from { opacity: 0; transform: translateY(8px) scaleY(0.96); transform-origin: bottom; }
          to   { opacity: 1; transform: none; }
        }
        .sb-child-btn {
          display    : block;
          width      : 100%;
          padding    : 8px 14px 8px 16px;
          background : none;
          border     : none;
          border-bottom: 1px solid rgba(30,58,138,0.05);
          color      : #6b7280;
          font-size  : 11.5px;
          font-weight: 600;
          font-family: 'Lato', system-ui, sans-serif;
          text-align : left;
          cursor     : pointer;
          transition : background 0.14s, color 0.14s, padding-left 0.14s;
          box-sizing : border-box;
        }
        .sb-child-btn:last-child { border-bottom: none; }
        .sb-child-btn:hover {
          background   : rgba(30,58,138,0.06);
          color        : #1e3a8a;
          padding-left : 20px;
        }

        /* ── Divider ── */
        .sb-divider {
          width     : calc(100% - 32px);
          height    : 1px;
          background: linear-gradient(90deg, transparent, rgba(30,58,138,0.10) 40%, rgba(30,58,138,0.10) 60%, transparent);
          border    : none;
          margin    : 5px 16px;
          display   : block;
        }

        /* ── Scrollbar inside sidebar ── */
        .sb-shell::-webkit-scrollbar { width: 3px; }
        .sb-shell::-webkit-scrollbar-track { background: transparent; }
        .sb-shell::-webkit-scrollbar-thumb {
          background   : rgba(30,58,138,0.12);
          border-radius: 4px;
        }
      `}</style>

      {/* ══════════════════════════════════════
          NAV SHELL
          ══════════════════════════════════════ */}
      <nav
        className="sb-shell"
        style={{
          width        : sidebarWidth,
          minWidth     : sidebarWidth,
          maxWidth     : sidebarWidth,
          height       : '100vh',
          position     : 'fixed',
          top: 0, left: 0,
          zIndex       : 2000,
          display      : 'flex',
          flexDirection: 'column',
          alignItems   : 'stretch',
          paddingTop   : 68,
          paddingBottom: 20,
          overflowY    : 'auto',
          overflowX    : 'hidden',
          boxSizing    : 'border-box',
          transition   : 'width 0.25s ease',
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
                        top  : rect.top,      // anchor to top of button; popup will go above
                        left : rect.left,
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
                      position : 'fixed',
                      left     : dropdownPos.left,
                      width    : dropdownPos.width,
                      // Place bottom of dropdown at top of button minus a small gap
                      bottom   : `calc(100vh - ${dropdownPos.top}px + 6px)`,
                      top      : 'auto',
                      zIndex   : 9999,
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
  const [open, setOpen]       = useState(false);
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
          position       : 'fixed',
          bottom: 24, right: 24,
          zIndex         : 1300,
          width          : 50, height: 50,
          borderRadius   : '50%',
          background     : 'rgba(255,255,255,0.90)',
          backdropFilter : 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          color          : '#1e3a8a',
          border         : '1.5px solid rgba(200,213,255,0.70)',
          boxShadow      : '0 4px 20px rgba(30,58,138,0.14), inset 0 1px 0 rgba(255,255,255,0.90)',
          display        : 'none',
          alignItems     : 'center',
          justifyContent : 'center',
          fontSize       : 24,
          cursor         : 'pointer',
          transition     : 'box-shadow 0.18s, background 0.18s',
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
            position  : 'fixed',
            inset     : 0,
            background: 'rgba(0,0,0,0.18)',
            zIndex    : 1390,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Mobile drawer */}
      {open && (
        <div
          className="sidebar-drawer"
          style={{
            position      : 'fixed',
            top: 0, right: 0,
            width         : isMobile ? 220 : 260,
            height        : '100vh',
            background    : 'rgba(248,250,253,0.92)',
            backdropFilter: 'blur(32px) saturate(200%)',
            WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            borderLeft    : '1px solid rgba(200,213,255,0.60)',
            zIndex        : 1400,
            boxShadow     : '-6px 0 40px rgba(30,58,138,0.10)',
            animation     : 'sbSlideIn 0.26s cubic-bezier(0.4,0,0.2,1)',
            display       : 'flex',
            flexDirection : 'column',
            alignItems    : 'stretch',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            style={{
              alignSelf   : 'flex-end',
              margin      : 12,
              background  : 'rgba(255,255,255,0.75)',
              border      : '1px solid rgba(200,213,255,0.50)',
              borderRadius: 8,
              width: 30, height: 30,
              display     : 'flex',
              alignItems  : 'center',
              justifyContent: 'center',
              fontSize    : 16,
              color       : '#6b7280',
              cursor      : 'pointer',
              boxShadow   : '0 1px 4px rgba(30,58,138,0.08)',
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