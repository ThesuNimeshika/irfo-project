/**
 * RequestAckModal.tsx  — "Request Acknowledgement No" prompt modal (MSL style)
 * Place in: src/components/RequestAckModal.tsx
 *
 * Usage:
 *   import RequestAckModal from '../components/RequestAckModal';
 *   const [showReqAck, setShowReqAck] = useState(false);
 *
 *   <RequestAckModal
 *     isOpen={showReqAck}
 *     onClose={() => setShowReqAck(false)}
 *     onConfirm={(ackNo) => {
 *       // do something with ackNo string
 *       console.log('Ack No:', ackNo);
 *     }}
 *   />
 *   <button onClick={() => setShowReqAck(true)}>AKCT NO</button>
 *
 * Features:
 *   - Compact prompt-style modal
 *   - Input auto-focused when opened
 *   - Enter key confirms
 *   - Esc key closes
 *   - 100% inline styles — no <style> injection issues
 */

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// ─── Props ────────────────────────────────────────────────────────────────────
interface RequestAckModalProps {
  isOpen:     boolean;
  onClose:    () => void;
  onConfirm:  (ackNo: string) => void;
  title?:     string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RequestAckModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Request Acknowledgement',
}: RequestAckModalProps) {
  const [ackNo,  setAckNo]  = useState('');
  const [error,  setError]  = useState('');
  const inputRef            = useRef<HTMLInputElement>(null);

  // Reset & focus when opened
  useEffect(() => {
    if (isOpen) {
      setAckNo('');
      setError('');
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Escape closes
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!ackNo.trim()) {
      setError('Please enter an Acknowledgement No.');
      inputRef.current?.focus();
      return;
    }
    onConfirm(ackNo.trim());
    onClose();
  };

  // ─── Inline styles ─────────────────────────────────────────────────────────
  const S = {
    overlay: {
      position:       'fixed'    as const,
      inset:          0,
      background:     'rgba(0,0,0,0.55)',
      zIndex:         2147483647,          // above AkctNoSearchModal too
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '16px',
      backdropFilter: 'blur(3px)',
    },
    shell: {
      background:    '#ffffff',
      borderRadius:  '8px',
      width:         '400px',
      maxWidth:      '94vw',
      display:       'flex',
      flexDirection: 'column' as const,
      boxShadow:     '0 24px 64px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.14)',
      overflow:      'hidden',
      border:        '1.5px solid #0d7f5a',
    },
    // ── Header ──
    header: {
      display:      'flex',
      alignItems:   'center',
      background:   'linear-gradient(90deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%)',
      minHeight:    '44px',
      flexShrink:   0,
      borderBottom: '2px solid #0d7f5a',
    },
    logoLeft: {
      background:     'linear-gradient(180deg,#0d7f5a 0%,#065f46 100%)',
      color:          '#ffffff',
      fontWeight:     900,
      fontSize:       '12px',
      letterSpacing:  '0.06em',
      padding:        '0 12px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      minWidth:       '48px',
      height:         '44px',
      borderRight:    '2px solid rgba(255,255,255,0.18)',
      fontFamily:     "'Lato',system-ui,sans-serif",
      flexShrink:     0,
    },
    logoRight: {
      background:     'linear-gradient(180deg,#34d399 0%,#0d7f5a 100%)',
      color:          '#ffffff',
      fontWeight:     700,
      fontSize:       '9px',
      letterSpacing:  '0.05em',
      lineHeight:     1.35,
      padding:        '0 10px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      height:         '44px',
      borderRight:    '2px solid rgba(255,255,255,0.14)',
      fontFamily:     "'Lato',system-ui,sans-serif",
      flexShrink:     0,
      textAlign:      'center' as const,
    },
    headerTitle: {
      flex:          1,
      color:         '#ffffff',
      fontWeight:    700,
      fontSize:      '13px',
      letterSpacing: '0.04em',
      textTransform: 'uppercase' as const,
      padding:       '0 16px',
      fontFamily:    "'Lato',system-ui,sans-serif",
    },
    closeBtn: {
      background:     'rgba(255,255,255,0.10)',
      border:         'none',
      color:          '#ffffff',
      fontSize:       '22px',
      fontWeight:     700,
      cursor:         'pointer',
      width:          '44px',
      height:         '44px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      flexShrink:     0,
      padding:        0,
      fontFamily:     'inherit',
      lineHeight:     1,
    },
    // ── Body ──
    body: {
      padding:    '28px 28px 20px',
      display:    'flex',
      flexDirection: 'column' as const,
      gap:        '16px',
      background: '#ffffff',
    },
    questionRow: {
      display:    'flex',
      alignItems: 'center',
      gap:        '10px',
    },
    questionIcon: {
      width:          '36px',
      height:         '36px',
      borderRadius:   '50%',
      background:     'linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%)',
      border:         '1.5px solid #6ee7b7',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '18px',
      flexShrink:     0,
    },
    questionText: {
      fontSize:   '14px',
      fontWeight: 700,
      color:      '#1f2937',
      fontFamily: "'Lato',system-ui,sans-serif",
      lineHeight: 1.4,
    },
    inputGroup: {
      display:       'flex',
      flexDirection: 'column' as const,
      gap:           '6px',
    },
    label: {
      fontSize:      '11px',
      fontWeight:    700,
      color:         '#374151',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      fontFamily:    "'Lato',system-ui,sans-serif",
    },
    input: {
      padding:      '9px 12px',
      fontSize:     '13px',
      fontWeight:   600,
      fontFamily:   "'Lato',system-ui,sans-serif",
      border:       '1.5px solid #6ee7b7',
      borderRadius: '5px',
      outline:      'none',
      background:   '#f0fdf4',
      color:        '#1f2937',
      transition:   'border-color 0.15s, box-shadow 0.15s',
      width:        '100%',
      boxSizing:    'border-box' as const,
    },
    errorMsg: {
      fontSize:   '11px',
      color:      '#dc2626',
      fontWeight: 600,
      fontFamily: "'Lato',system-ui,sans-serif",
      marginTop:  '-8px',
    },
    // ── Footer ──
    footer: {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'flex-end',
      padding:        '12px 20px',
      background:     '#f8fafc',
      borderTop:      '1px solid #e2e8f0',
      gap:            '8px',
    },
    btnCancel: {
      display:      'inline-flex',
      alignItems:   'center',
      padding:      '7px 20px',
      fontSize:     '12px',
      fontWeight:   700,
      fontFamily:   "'Lato',system-ui,sans-serif",
      borderRadius: '5px',
      border:       '1px solid #cbd5e1',
      background:   '#f1f5f9',
      color:        '#374151',
      cursor:       'pointer',
    },
    btnOk: {
      display:      'inline-flex',
      alignItems:   'center',
      justifyContent: 'center',
      gap:          '6px',
      padding:      '7px 28px',
      fontSize:     '13px',
      fontWeight:   700,
      fontFamily:   "'Lato',system-ui,sans-serif",
      borderRadius: '5px',
      border:       'none',
      background:   'linear-gradient(135deg,#0d7f5a 0%,#065f46 100%)',
      color:        '#ffffff',
      cursor:       'pointer',
      boxShadow:    '0 2px 10px rgba(13,127,90,0.32)',
      letterSpacing: '0.03em',
    },
  };

  return createPortal(
    <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={S.shell} role="dialog" aria-modal="true" aria-label={title}>

        {/* ══ HEADER ══ */}
        <div style={S.header}>
          <div style={S.logoLeft}>MSL</div>
          <div style={S.logoRight}>Computer<br />Services</div>
          <div style={S.headerTitle}>📋 &nbsp;{title}</div>
          <button style={S.closeBtn} onClick={onClose} aria-label="Close"
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(185,28,28,0.65)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)')}
          >×</button>
        </div>

        {/* ══ BODY ══ */}
        <div style={S.body}>

          {/* Question row */}
          <div style={S.questionRow}>
            <div style={S.questionIcon}>📋</div>
            <div style={S.questionText}>
              Request Acknowledgement No?
            </div>
          </div>

          {/* Input */}
          <div style={S.inputGroup}>
            <label style={S.label}>Acknowledgement No.</label>
            <input
              ref={inputRef}
              style={S.input}
              value={ackNo}
              onChange={e => { setAckNo(e.target.value); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); }}
              placeholder="Enter acknowledgement number…"
              onFocus={e => {
                e.currentTarget.style.borderColor  = '#0d7f5a';
                e.currentTarget.style.boxShadow    = '0 0 0 3px rgba(13,127,90,0.15)';
                e.currentTarget.style.background   = '#ffffff';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor  = '#6ee7b7';
                e.currentTarget.style.boxShadow    = 'none';
                e.currentTarget.style.background   = '#f0fdf4';
              }}
            />
            {error && <div style={S.errorMsg}>⚠ {error}</div>}
          </div>

        </div>

        {/* ══ FOOTER ══ */}
        <div style={S.footer}>
          <button style={S.btnCancel} onClick={onClose}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#e2e8f0')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9')}
          >Cancel</button>
          <button style={S.btnOk} onClick={handleConfirm}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg,#0a6b4c 0%,#044a35 100%)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg,#0d7f5a 0%,#065f46 100%)')}
          >✓ &nbsp;OK</button>
        </div>

      </div>
    </div>,
    document.body
  );
}