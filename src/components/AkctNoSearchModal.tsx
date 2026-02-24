/**
 * AkctNoSearchModal.tsx  — Reusable "AKCT NO" browse modal (MSL style)
 * Place in: src/components/AkctNoSearchModal.tsx
 *
 * Usage:
 *   import AkctNoSearchModal, { AkctRecord } from '../components/AkctNoSearchModal';
 *   const [showAkct, setShowAkct] = useState(false);
 *
 *   <AkctNoSearchModal
 *     isOpen={showAkct}
 *     onClose={() => setShowAkct(false)}
 *     onSelect={(row) => {
 *       // row.akctNo | row.accountNo | row.name | row.date | row.payMode | row.status
 *     }}
 *   />
 *   <button onClick={() => setShowAkct(true)}>AKCT NO</button>
 *
 * Features:
 *   - Live filter across all columns
 *   - Status column is editable per row (Approved / Rejected / Pending)
 *   - Get button on the right
 *   - MSL header (green accent — matches AKCT NO button colour)
 *   - 100% inline styles — no <style> injection issues
 */

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// ─── Types ────────────────────────────────────────────────────────────────────
export type AkctStatus = 'Approved' | 'Rejected' | 'Pending';

export interface AkctRecord {
  akctNo:    string;
  accountNo: string;
  name:      string;
  date:      string;
  payMode:   string;
  status:    AkctStatus;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────
const initialDummyData: AkctRecord[] = [
  { akctNo: 'ACT001', accountNo: '6008560124121901', name: 'ALUTHGE NANDANI MRS.',                          date: '15/Jan/2024', payMode: 'Cash',          status: 'Approved'  },
  { akctNo: 'ACT002', accountNo: '6910405351211901', name: 'ABEYSINGHE DILUM SRI MR.',                      date: '18/Jan/2024', payMode: 'Cheque',        status: 'Approved'  },
  { akctNo: 'ACT003', accountNo: '0305412590121901', name: 'WEERARATNE RAVEEN THEVINDU MR.',                date: '20/Jan/2024', payMode: 'Bank Transfer', status: 'Pending'   },
  { akctNo: 'ACT004', accountNo: '2015220016011901', name: 'WICKREMANAYAKE HIRANJAN PETER MR.',             date: '22/Jan/2024', payMode: 'Credit Card',   status: 'Rejected'  },
  { akctNo: 'ACT005', accountNo: '1991120292011901', name: 'WICKREMANAYAKE JAYANI CHANDIMA MRS.',           date: '25/Jan/2024', payMode: 'Cash',          status: 'Pending'   },
  { akctNo: 'ACT006', accountNo: '6910405351211901', name: 'ABEYSINGHE DILUM SRI MR.',                      date: '28/Jan/2024', payMode: 'Cheque',        status: 'Approved'  },
  { akctNo: 'ACT007', accountNo: '9756127241211901', name: 'FERNANDO HASHARA MADUSHANI MISS.',              date: '01/Feb/2024', payMode: 'Cash',          status: 'Approved'  },
  { akctNo: 'ACT008', accountNo: '1999120033011901', name: 'FERNANDO DULINDRA THULSITH MR.',                date: '03/Feb/2024', payMode: 'Bank Transfer', status: 'Pending'   },
  { akctNo: 'ACT009', accountNo: '7770601682121901', name: 'JAYALATH JAYALATHGE RUSHANTHIE IROSHANI MRS.', date: '05/Feb/2024', payMode: 'Cheque',        status: 'Approved'  },
  { akctNo: 'ACT010', accountNo: '4422810095121901', name: 'PERERA CHAMINDA JAYANTHA MR.',                  date: '07/Feb/2024', payMode: 'Credit Card',   status: 'Rejected'  },
  { akctNo: 'ACT011', accountNo: '3301229847011901', name: 'SILVA MALINI KUMARI MRS.',                      date: '10/Feb/2024', payMode: 'Cash',          status: 'Approved'  },
  { akctNo: 'ACT012', accountNo: '8812340056191901', name: 'DISSANAYAKE KASUN PRADEEP MR.',                 date: '12/Feb/2024', payMode: 'Bank Transfer', status: 'Pending'   },
  { akctNo: 'ACT013', accountNo: '5590341287221901', name: 'RANASINGHE THILAK BANDULA MR.',                 date: '14/Feb/2024', payMode: 'Cheque',        status: 'Approved'  },
  { akctNo: 'ACT014', accountNo: '2234560981341901', name: 'KUMARA NIMAL BANDARA MR.',                      date: '16/Feb/2024', payMode: 'Cash',          status: 'Rejected'  },
  { akctNo: 'ACT015', accountNo: '6671230045561901', name: 'PATHIRANA SAMANTHA PRIYANTHA MR.',              date: '18/Feb/2024', payMode: 'Credit Card',   status: 'Approved'  },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface AkctNoSearchModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  onSelect: (record: AkctRecord) => void;
  title?:   string;
  rows?:    AkctRecord[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AkctNoSearchModal({
  isOpen,
  onClose,
  onSelect,
  title = 'AKCT NO — Select Record',
  rows,
}: AkctNoSearchModalProps) {
  // Local copy of rows so Status edits are local to this modal session
  const [data,     setData]     = useState<AkctRecord[]>([]);
  const [selected, setSelected] = useState<AkctRecord | null>(null);
  const [filter,   setFilter]   = useState('');
  const filterRef               = useRef<HTMLInputElement>(null);

  // Initialise/reset local data when modal opens
  useEffect(() => {
    if (isOpen) {
      setData(rows ? [...rows] : initialDummyData.map(r => ({ ...r })));
      setSelected(null);
      setFilter('');
      const t = setTimeout(() => filterRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen, rows]);

  // Escape closes
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Update status for a single row
  const handleStatusChange = (akctNo: string, newStatus: AkctStatus) => {
    setData(prev => prev.map(r => r.akctNo === akctNo ? { ...r, status: newStatus } : r));
    // Keep selected in sync
    setSelected(prev => prev?.akctNo === akctNo ? { ...prev, status: newStatus } : prev);
  };

  const filtered = filter.trim()
    ? data.filter(r =>
        r.akctNo.toLowerCase().includes(filter.toLowerCase())    ||
        r.accountNo.toLowerCase().includes(filter.toLowerCase()) ||
        r.name.toLowerCase().includes(filter.toLowerCase())      ||
        r.date.toLowerCase().includes(filter.toLowerCase())      ||
        r.payMode.toLowerCase().includes(filter.toLowerCase())   ||
        r.status.toLowerCase().includes(filter.toLowerCase())
      )
    : data;

  const handleGet = () => {
    if (!selected) return;
    // Return the latest status from data (may have been edited)
    const latest = data.find(r => r.akctNo === selected.akctNo) ?? selected;
    onSelect(latest);
    onClose();
  };

  // ─── Status badge style ────────────────────────────────────────────────────
  const statusColor = (s: AkctStatus) => {
    if (s === 'Approved') return { bg: '#dcfce7', color: '#166534', border: '#86efac' };
    if (s === 'Rejected') return { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' };
    return                       { bg: '#fef9c3', color: '#854d0e', border: '#fde047' };
  };

  // ─── Inline styles ────────────────────────────────────────────────────────
  const S = {
    overlay: {
      position:       'fixed'    as const,
      inset:          0,
      background:     'rgba(0,0,0,0.55)',
      zIndex:         2147483646,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '16px',
      backdropFilter: 'blur(2px)',
    },
    shell: {
      background:    '#ffffff',
      borderRadius:  '6px',
      width:         '980px',
      maxWidth:      '97vw',
      maxHeight:     '88vh',
      display:       'flex',
      flexDirection: 'column' as const,
      boxShadow:     '0 24px 64px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.16)',
      overflow:      'hidden',
      border:        '1.5px solid #0d7f5a',
    },
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
    filterBar: {
      display:      'flex',
      alignItems:   'center',
      gap:          '10px',
      padding:      '8px 14px',
      background:   '#f0fdf4',
      borderBottom: '1px solid #e2e8f0',
      flexShrink:   0,
    },
    filterLabel: {
      fontSize:      '11px',
      fontWeight:    700,
      color:         '#374151',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.04em',
      whiteSpace:    'nowrap' as const,
      fontFamily:    "'Lato',system-ui,sans-serif",
    },
    filterInput: {
      flex:       1,
      padding:    '5px 10px',
      fontSize:   '12px',
      border:     '1px solid #6ee7b7',
      borderRadius: '4px',
      outline:    'none',
      fontFamily: "'Lato',system-ui,sans-serif",
      background: '#ffffff',
      color:      '#1f2937',
    },
    countBadge: {
      fontSize:   '11px',
      fontWeight: 700,
      color:      '#374151',
      whiteSpace: 'nowrap' as const,
      background: '#d1fae5',
      borderRadius: '10px',
      padding:    '2px 10px',
      fontFamily: "'Lato',system-ui,sans-serif",
    },
    tableWrap: {
      flex:         1,
      overflowY:    'auto' as const,
      borderBottom: '1px solid #e2e8f0',
      minHeight:    0,
    },
    table: {
      width:          '100%',
      borderCollapse: 'collapse' as const,
      tableLayout:    'fixed'    as const,
      fontFamily:     "'Lato',system-ui,sans-serif",
    },
    th: (): React.CSSProperties => ({
      padding:       '8px 10px',
      textAlign:     'left',
      fontSize:      '11px',
      fontWeight:    700,
      color:         '#ffffff',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      borderRight:   '1px solid rgba(255,255,255,0.12)',
      whiteSpace:    'nowrap',
      background:    '#0d7f5a',
      userSelect:    'none',
      position:      'sticky',
      top:           0,
      zIndex:        1,
    }),
    hint: {
      fontSize:   '10px',
      color:      '#9ca3af',
      textAlign:  'center' as const,
      padding:    '3px 14px 5px',
      background: '#f8fafc',
      fontFamily: "'Lato',system-ui,sans-serif",
    },
    footer: {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '10px 14px',
      background:     '#f8fafc',
      borderTop:      '1px solid #e2e8f0',
      flexShrink:     0,
      gap:            '8px',
    },
    footerInfo: {
      fontSize:   '11px',
      color:      '#6b7280',
      fontFamily: "'Lato',system-ui,sans-serif",
    },
    btnClose: {
      display:        'inline-flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '6px 18px',
      fontSize:       '12px',
      fontWeight:     700,
      fontFamily:     "'Lato',system-ui,sans-serif",
      borderRadius:   '4px',
      border:         '1px solid #cbd5e1',
      background:     '#f1f5f9',
      color:          '#374151',
      cursor:         'pointer',
    },
    btnGet: (disabled: boolean): React.CSSProperties => ({
      display:        'inline-flex',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '5px',
      padding:        '6px 22px',
      fontSize:       '12px',
      fontWeight:     700,
      fontFamily:     "'Lato',system-ui,sans-serif",
      borderRadius:   '4px',
      border:         'none',
      background:     disabled ? '#9ca3af' : '#0d7f5a',
      color:          '#ffffff',
      cursor:         disabled ? 'not-allowed' : 'pointer',
      boxShadow:      disabled ? 'none' : '0 2px 8px rgba(13,127,90,0.30)',
      opacity:        disabled ? 0.55 : 1,
    }),
  };

  // Column widths
  const COL_WIDTHS = ['10%', '18%', '28%', '12%', '14%', '18%'];
  const COL_HEADERS = ['Akct No', 'Account No', 'Name', 'Date', 'Pay Mode', 'Status'];

  return createPortal(
    <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={S.shell} role="dialog" aria-modal="true">

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

        {/* ══ FILTER BAR ══ */}
        <div style={S.filterBar}>
          <span style={S.filterLabel}>🔍 Search</span>
          <input
            ref={filterRef}
            style={S.filterInput}
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter by Akct No, Account No, Name, Pay Mode or Status…"
            onFocus={e => { e.currentTarget.style.borderColor = '#0d7f5a'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(13,127,90,0.15)'; }}
            onBlur={e  => { e.currentTarget.style.borderColor = '#6ee7b7'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <span style={S.countBadge}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* ══ TABLE ══ */}
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                {COL_HEADERS.map((h, ci) => (
                  <th key={h} style={{ ...S.th(), width: COL_WIDTHS[ci], borderRight: ci === COL_HEADERS.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.12)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>
                    No records found{filter ? ` matching "${filter}"` : ''}
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => {
                  const isSel   = selected?.akctNo === row.akctNo;
                  const sc      = statusColor(row.status);
                  const rowBg   = isSel ? '#f0fdf4' : i % 2 === 0 ? '#ffffff' : '#f8fafc';

                  return (
                    <tr
                      key={row.akctNo}
                      onClick={() => setSelected(row)}
                      onDoubleClick={() => { onSelect({ ...data.find(r => r.akctNo === row.akctNo)! }); onClose(); }}
                      onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLTableRowElement).style.background = '#ecfdf5'; }}
                      onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLTableRowElement).style.background = rowBg; }}
                      style={{
                        cursor:      'pointer',
                        background:  rowBg,
                        outline:     isSel ? '1.5px solid #0d7f5a' : 'none',
                        outlineOffset: '-1.5px',
                        transition:  'background 0.08s',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      {/* Akct No */}
                      <td style={{ padding: '7px 10px', fontSize: '12px', fontWeight: 700, color: '#0d7f5a', borderRight: '1px solid #f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.akctNo}
                      </td>
                      {/* Account No */}
                      <td style={{ padding: '7px 10px', fontSize: '11px', color: '#1e3a8a', fontWeight: 600, borderRight: '1px solid #f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.accountNo}
                      </td>
                      {/* Name */}
                      <td style={{ padding: '7px 10px', fontSize: '12px', color: '#1f2937', borderRight: '1px solid #f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.name}
                      </td>
                      {/* Date */}
                      <td style={{ padding: '7px 10px', fontSize: '12px', color: '#4b5563', borderRight: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>
                        {row.date}
                      </td>
                      {/* Pay Mode */}
                      <td style={{ padding: '7px 10px', fontSize: '12px', color: '#374151', borderRight: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>
                        {row.payMode}
                      </td>
                      {/* Status — editable dropdown */}
                      <td style={{ padding: '5px 8px' }} onClick={e => e.stopPropagation()}>
                        <select
                          value={row.status}
                          onChange={e => handleStatusChange(row.akctNo, e.target.value as AkctStatus)}
                          style={{
                            width:          '100%',
                            padding:        '3px 6px',
                            fontSize:       '11px',
                            fontWeight:     700,
                            fontFamily:     "'Lato',system-ui,sans-serif",
                            borderRadius:   '4px',
                            border:         `1px solid ${sc.border}`,
                            background:     sc.bg,
                            color:          sc.color,
                            cursor:         'pointer',
                            outline:        'none',
                            appearance:     'auto',
                          }}
                        >
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ══ HINT ══ */}
        <div style={S.hint}>
          Click to select &nbsp;·&nbsp; Double-click to select &amp; close &nbsp;·&nbsp; Change Status dropdown per row &nbsp;·&nbsp; Esc to dismiss
        </div>

        {/* ══ FOOTER ══ */}
        <div style={S.footer}>
          <div style={S.footerInfo}>
            {selected
              ? <><b style={{ color: '#374151' }}>Selected:</b> {selected.akctNo} — {selected.name}</>
              : 'No row selected · click a row first'}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={S.btnGet(!selected)} onClick={handleGet} disabled={!selected}
              onMouseEnter={e => { if (selected) (e.currentTarget as HTMLButtonElement).style.background = '#065f46'; }}
              onMouseLeave={e => { if (selected) (e.currentTarget as HTMLButtonElement).style.background = '#0d7f5a'; }}
            >✓ &nbsp;Get</button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}