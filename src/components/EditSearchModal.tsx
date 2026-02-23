/**
 * EditSearchModal.tsx  — Reusable "Edit / Browse" modal (MSL style)
 * Place in: src/components/EditSearchModal.tsx
 *
 * Usage on any page:
 *   import EditSearchModal, { EditRecord } from '../components/EditSearchModal';
 *   const [showEdit, setShowEdit] = useState(false);
 *
 *   <EditSearchModal
 *     isOpen={showEdit}
 *     onClose={() => setShowEdit(false)}
 *     title="Edit — Select Creation Record"
 *     onSelect={(row) => {
 *       // row.accNo | row.name | row.unit | row.price
 *       // row.amount | row.fundName | row.transactionNo
 *     }}
 *   />
 *   <button onClick={() => setShowEdit(true)}>E</button>
 */

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// ─── Type ────────────────────────────────────────────────────────────────────
export interface EditRecord {
  accNo:         string;
  name:          string;
  unit:          string;
  price:         string;
  amount:        string;
  fundName:      string;
  transactionNo: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────
export const editDummyData: EditRecord[] = [
  { accNo: '6008560124121901', name: 'ALUTHGE NANDANI MRS.',                          unit: '105.96',   price: '12.50',  amount: '1,324.50',   fundName: 'Ceylon Money Market Fund', transactionNo: 'TXN-001-2024' },
  { accNo: '6910405351211901', name: 'ABEYSINGHE DILUM SRI MR.',                      unit: '1059.56',  price: '14.75',  amount: '15,628.51',  fundName: 'Equity Growth Fund',       transactionNo: 'TXN-002-2024' },
  { accNo: '0305412590121901', name: 'WEERARATNE RAVEEN THEVINDU MR.',                unit: '10.00',    price: '10.00',  amount: '100.00',     fundName: 'Bond Income Fund',         transactionNo: 'TXN-003-2024' },
  { accNo: '2015220016011901', name: 'WICKREMANAYAKE HIRANJAN PETER MR.',             unit: '9.99',     price: '11.20',  amount: '111.89',     fundName: 'Balanced Fund',            transactionNo: 'TXN-004-2024' },
  { accNo: '1991120292011901', name: 'WICKREMANAYAKE JAYANI CHANDIMA MRS.',           unit: '10.00',    price: '13.00',  amount: '130.00',     fundName: 'Ceylon Money Market Fund', transactionNo: 'TXN-005-2024' },
  { accNo: '6910405351211901', name: 'ABEYSINGHE DILUM SRI MR.',                      unit: '34.09',    price: '14.75',  amount: '502.83',     fundName: 'Equity Growth Fund',       transactionNo: 'TXN-006-2024' },
  { accNo: '9756127241211901', name: 'FERNANDO HASHARA MADUSHANI MISS.',              unit: '10.00',    price: '12.50',  amount: '125.00',     fundName: 'Ceylon Money Market Fund', transactionNo: 'TXN-007-2024' },
  { accNo: '1999120033011901', name: 'FERNANDO DULINDRA THULSITH MR.',                unit: '10.00',    price: '12.50',  amount: '125.00',     fundName: 'Bond Income Fund',         transactionNo: 'TXN-008-2024' },
  { accNo: '7770601682121901', name: 'JAYALATH JAYALATHGE RUSHANTHIE IROSHANI MRS.', unit: '10.00',    price: '11.80',  amount: '118.00',     fundName: 'Equity Growth Fund',       transactionNo: 'TXN-009-2024' },
  { accNo: '9756127241211901', name: 'FERNANDO HASHARA MADUSHANI MISS.',              unit: '3491.87',  price: '14.20',  amount: '49,584.54',  fundName: 'Equity Growth Fund',       transactionNo: 'TXN-010-2024' },
  { accNo: '1999120033011901', name: 'FERNANDO DULINDRA THULSITH MR.',                unit: '3491.86',  price: '12.50',  amount: '43,648.25',  fundName: 'Bond Income Fund',         transactionNo: 'TXN-011-2024' },
  { accNo: '4422810095121901', name: 'PERERA CHAMINDA JAYANTHA MR.',                  unit: '250.00',   price: '15.00',  amount: '3,750.00',   fundName: 'Balanced Fund',            transactionNo: 'TXN-012-2024' },
  { accNo: '3301229847011901', name: 'SILVA MALINI KUMARI MRS.',                      unit: '500.00',   price: '13.75',  amount: '6,875.00',   fundName: 'Ceylon Money Market Fund', transactionNo: 'TXN-013-2024' },
  { accNo: '8812340056191901', name: 'DISSANAYAKE KASUN PRADEEP MR.',                 unit: '75.50',    price: '10.90',  amount: '822.95',     fundName: 'Bond Income Fund',         transactionNo: 'TXN-014-2024' },
  { accNo: '5590341287221901', name: 'RANASINGHE THILAK BANDULA MR.',                 unit: '120.00',   price: '11.50',  amount: '1,380.00',   fundName: 'Equity Growth Fund',       transactionNo: 'TXN-015-2024' },
  { accNo: '2234560981341901', name: 'KUMARA NIMAL BANDARA MR.',                      unit: '800.00',   price: '16.00',  amount: '12,800.00',  fundName: 'Balanced Fund',            transactionNo: 'TXN-016-2024' },
  { accNo: '6671230045561901', name: 'PATHIRANA SAMANTHA PRIYANTHA MR.',              unit: '45.00',    price: '12.00',  amount: '540.00',     fundName: 'Bond Income Fund',         transactionNo: 'TXN-017-2024' },
  { accNo: '9982341678901901', name: 'JAYASINGHE SUMUDU DILHARA MISS.',               unit: '330.00',   price: '13.30',  amount: '4,389.00',   fundName: 'Ceylon Money Market Fund', transactionNo: 'TXN-018-2024' },
];

// ─── Column definitions ───────────────────────────────────────────────────────
const COLUMNS: { key: keyof EditRecord; header: string; width: string; numeric?: boolean }[] = [
  { key: 'accNo',         header: 'Acc No',         width: '18%' },
  { key: 'name',          header: 'Name',           width: '24%' },
  { key: 'unit',          header: 'Unit',           width: '8%',  numeric: true },
  { key: 'price',         header: 'Price',          width: '7%',  numeric: true },
  { key: 'amount',        header: 'Amount',         width: '10%', numeric: true },
  { key: 'fundName',      header: 'Fund Name',      width: '18%' },
  { key: 'transactionNo', header: 'Transaction No', width: '15%' },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface EditSearchModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  onSelect: (record: EditRecord) => void;
  title?:   string;
  rows?:    EditRecord[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function EditSearchModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Edit',
  rows = editDummyData,
}: EditSearchModalProps) {
  const [selected, setSelected] = useState<EditRecord | null>(null);
  const [filter,   setFilter]   = useState('');
  const filterRef               = useRef<HTMLInputElement>(null);

  // Reset & focus when opened
  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      setFilter('');
      const t = setTimeout(() => filterRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Escape key closes
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = filter.trim()
    ? rows.filter(r => Object.values(r).some(v => v.toLowerCase().includes(filter.toLowerCase())))
    : rows;

  const handleGet = () => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  };

  // ─── All styles are INLINE — avoids <style> injection bugs inside portals ──
  const S = {
    // Overlay — full-screen backdrop
    overlay: {
      position:        'fixed' as const,
      inset:           0,
      background:      'rgba(0,0,0,0.55)',
      zIndex:          2147483646,
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         '16px',
      backdropFilter:  'blur(2px)',
    },
    // Modal shell
    shell: {
      background:      '#ffffff',
      borderRadius:    '6px',
      width:           '920px',
      maxWidth:        '96vw',
      maxHeight:       '88vh',
      display:         'flex',
      flexDirection:   'column' as const,
      boxShadow:       '0 24px 64px rgba(0,0,0,0.32), 0 4px 16px rgba(0,0,0,0.18)',
      overflow:        'hidden',
      border:          '1.5px solid #1e3a8a',
    },
    // Header bar — dark gradient mimicking MSL legacy UI
    header: {
      display:         'flex',
      alignItems:      'center',
      background:      'linear-gradient(90deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%)',
      minHeight:       '44px',
      flexShrink:      0,
      borderBottom:    '2px solid #b45309',
    },
    // "MSL" block — amber-red
    logoLeft: {
      background:      'linear-gradient(180deg,#b45309 0%,#92400e 100%)',
      color:           '#ffffff',
      fontWeight:      900,
      letterSpacing:   '0.06em',
      padding:         '0 12px',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      minWidth:        '48px',
      height:          '44px',
      borderRight:     '2px solid rgba(255,255,255,0.18)',
      fontFamily:      "'Lato',system-ui,sans-serif",
      flexShrink:      0,
    },
    // "Computer Services" block — gold
    logoRight: {
      background:      'linear-gradient(180deg,#c9a227 0%,#a07820 100%)',
      color:           '#ffffff',
      fontWeight:      700,
      fontSize:        '9px',
      letterSpacing:   '0.05em',
      lineHeight:      1.35,
      padding:         '0 10px',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      height:          '44px',
      borderRight:     '2px solid rgba(255,255,255,0.14)',
      fontFamily:      "'Lato',system-ui,sans-serif",
      flexShrink:      0,
      textAlign:       'center' as const,
    },
    headerTitle: {
      flex:            1,
      color:           '#ffffff',
      fontWeight:      700,
      fontSize:        '13px',
      letterSpacing:   '0.04em',
      textTransform:   'uppercase' as const,
      padding:         '0 16px',
      fontFamily:      "'Lato',system-ui,sans-serif",
    },
    closeBtn: {
      background:      'rgba(255,255,255,0.10)',
      border:          'none',
      color:           '#ffffff',
      fontSize:        '22px',
      fontWeight:      700,
      cursor:          'pointer',
      width:           '44px',
      height:          '44px',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      flexShrink:      0,
      padding:         0,
      fontFamily:      'inherit',
      lineHeight:      1,
      transition:      'background 0.15s',
    },
    // Filter bar
    filterBar: {
      display:         'flex',
      alignItems:      'center',
      gap:             '10px',
      padding:         '8px 14px',
      background:      '#f1f5f9',
      borderBottom:    '1px solid #e2e8f0',
      flexShrink:      0,
    },
    filterLabel: {
      fontSize:        '11px',
      fontWeight:      700,
      color:           '#4b5563',
      textTransform:   'uppercase' as const,
      letterSpacing:   '0.04em',
      whiteSpace:      'nowrap' as const,
      fontFamily:      "'Lato',system-ui,sans-serif",
    },
    filterInput: {
      flex:            1,
      padding:         '5px 10px',
      border:          '1px solid #cbd5e1',
      borderRadius:    '4px',
      outline:         'none',
      fontFamily:      "'Lato',system-ui,sans-serif",
      background:      '#ffffff',
      color:           '#1f2937',
    },
    countBadge: {
      fontSize:        '11px',
      fontWeight:      700,
      color:           '#6b7280',
      whiteSpace:      'nowrap' as const,
      background:      '#e2e8f0',
      borderRadius:    '10px',
      padding:         '2px 10px',
      fontFamily:      "'Lato',system-ui,sans-serif",
    },
    // Table wrapper
    tableWrap: {
      flex:            1,
      overflowY:       'auto' as const,
      borderBottom:    '1px solid #e2e8f0',
      minHeight:       0,
    },
    table: {
      width:           '100%',
      borderCollapse:  'collapse' as const,
      tableLayout:     'fixed' as const,
      fontFamily:      "'Lato',system-ui,sans-serif",
    },
    th: (numeric?: boolean): React.CSSProperties => ({
      padding:         '8px 10px',
      textAlign:       numeric ? 'right' : 'left',
      fontSize:        '11px',
      fontWeight:      700,
      color:           '#ffffff',
      letterSpacing:   '0.04em',
      textTransform:   'uppercase',
      borderRight:     '1px solid rgba(255,255,255,0.12)',
      whiteSpace:      'nowrap',
      background:      '#1e3a8a',
      userSelect:      'none',
    }),
    tdBase: (numeric?: boolean, first?: boolean, isAmt?: boolean, isTxn?: boolean): React.CSSProperties => ({
      padding:         '7px 10px',
      color:           first ? '#1e3a8a' : isAmt ? '#0d7f5a' : isTxn ? '#6b7280' : '#1f2937',
      fontWeight:      first ? 700 : isAmt ? 700 : 400,
      borderBottom:    '1px solid #e2e8f0',
      borderRight:     '1px solid #f1f5f9',
      textAlign:       numeric ? 'right' : 'left',
      overflow:        'hidden',
      textOverflow:    'ellipsis',
      whiteSpace:      'nowrap',
      fontVariantNumeric: numeric ? 'tabular-nums' : 'normal',
      fontSize:        isTxn ? '11px' : '12px',
    }),
    rowBase: (isSelected: boolean, isEven: boolean): React.CSSProperties => ({
      cursor:          'pointer',
      background:      isSelected ? '#eff6ff' : isEven ? '#ffffff' : '#f8fafc',
      outline:         isSelected ? '1.5px solid #1e3a8a' : 'none',
      outlineOffset:   '-1.5px',
      transition:      'background 0.08s',
    }),
    // Hint strip
    hint: {
      fontSize:        '10px',
      color:           '#9ca3af',
      textAlign:       'center' as const,
      padding:         '3px 14px 5px',
      background:      '#f8fafc',
      fontFamily:      "'Lato',system-ui,sans-serif",
    },
    // Footer
    footer: {
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'space-between',
      padding:         '10px 14px',
      background:      '#f8fafc',
      borderTop:       '1px solid #e2e8f0',
      flexShrink:      0,
      gap:             '8px',
    },
    footerInfo: {
      fontSize:        '11px',
      color:           '#6b7280',
      fontFamily:      "'Lato',system-ui,sans-serif",
    },
    btnClose: {
      display:         'inline-flex',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         '6px 18px',
      fontSize:        '12px',
      fontWeight:      700,
      fontFamily:      "'Lato',system-ui,sans-serif",
      borderRadius:    '4px',
      border:          '1px solid #cbd5e1',
      background:      '#f1f5f9',
      color:           '#374151',
      cursor:          'pointer',
      letterSpacing:   '0.03em',
    },
    btnGet: (disabled: boolean): React.CSSProperties => ({
      display:         'inline-flex',
      alignItems:      'center',
      justifyContent:  'center',
      gap:             '5px',
      padding:         '6px 22px',
      fontSize:        '12px',
      fontWeight:      700,
      fontFamily:      "'Lato',system-ui,sans-serif",
      borderRadius:    '4px',
      border:          'none',
      background:      disabled ? '#9ca3af' : '#1e3a8a',
      color:           '#ffffff',
      cursor:          disabled ? 'not-allowed' : 'pointer',
      letterSpacing:   '0.03em',
      boxShadow:       disabled ? 'none' : '0 2px 8px rgba(30,58,138,0.28)',
      opacity:         disabled ? 0.55 : 1,
    }),
    emptyTd: {
      padding:         '32px 16px',
      textAlign:       'center' as const,
      color:           '#9ca3af',
      fontSize:        '13px',
      fontStyle:       'italic' as const,
    },
  };

  return createPortal(
    <div
      style={S.overlay}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={S.shell} role="dialog" aria-modal="true" aria-label={title}>

        {/* ══ HEADER ══ */}
        <div style={S.header}>
          <div style={S.logoLeft}>MSL</div>
          <div style={S.logoRight}>Computer<br />Services</div>
          <div style={S.headerTitle}>✏️ &nbsp;{title}</div>
          <button
            style={S.closeBtn}
            onClick={onClose}
            aria-label="Close"
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
            placeholder="Filter by Acc No, Name, Fund Name, Transaction No…"
            onFocus={e => { e.currentTarget.style.borderColor = '#1e3a8a'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(30,58,138,0.12)'; }}
            onBlur={e  => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <span style={S.countBadge}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* ══ TABLE ══ */}
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                {COLUMNS.map((col, ci) => (
                  <th
                    key={col.key}
                    style={{
                      ...S.th(col.numeric),
                      width: col.width,
                      borderRight: ci === COLUMNS.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={S.emptyTd}>
                    No records found{filter ? ` matching "${filter}"` : ''}
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => {
                  const isSelected = selected?.accNo === row.accNo && selected?.transactionNo === row.transactionNo;
                  return (
                    <tr
                      key={`${row.transactionNo}-${i}`}
                      style={S.rowBase(isSelected, i % 2 === 0)}
                      onClick={() => setSelected(row)}
                      onDoubleClick={() => { onSelect(row); onClose(); }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = '#dbeafe'; }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? '#ffffff' : '#f8fafc'; }}
                    >
                      {COLUMNS.map((col, ci) => (
                        <td
                          key={col.key}
                          style={{
                            ...S.tdBase(
                              col.numeric,
                              ci === 0,
                              col.key === 'amount',
                              col.key === 'transactionNo',
                            ),
                            borderRight: ci === COLUMNS.length - 1 ? 'none' : '1px solid #f1f5f9',
                          }}
                        >
                          {row[col.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ══ HINT ══ */}
        <div style={S.hint}>
          Click to select &nbsp;·&nbsp; Double-click to select &amp; close &nbsp;·&nbsp; Esc to dismiss
        </div>

        {/* ══ FOOTER ══ */}
        <div style={S.footer}>
          {/* Left — selected info */}
          <div style={S.footerInfo}>
            {selected
              ? <><b style={{ color: '#374151' }}>Selected:</b> {selected.accNo} — {selected.name}</>
              : 'No row selected · click a row first'}
          </div>

          {/* Right — Close then Get (Get is rightmost) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={S.btnClose} onClick={onClose}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#e2e8f0')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9')}
            >
              Close
            </button>
            <button
              style={S.btnGet(!selected)}
              onClick={handleGet}
              disabled={!selected}
              onMouseEnter={e => { if (selected) (e.currentTarget as HTMLButtonElement).style.background = '#2e4fad'; }}
              onMouseLeave={e => { if (selected) (e.currentTarget as HTMLButtonElement).style.background = '#1e3a8a'; }}
            >
              ✓ &nbsp;Get
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}