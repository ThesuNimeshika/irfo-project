/**
 * HolderSearchModal.tsx  — Reusable "Holder Search" modal (MSL style)
 * Place in: src/components/HolderSearchModal.tsx
 *
 * Usage on any page:
 *   import HolderSearchModal, { HolderRecord } from '../components/HolderSearchModal';
 *   const [showHolder, setShowHolder] = useState(false);
 *
 *   <HolderSearchModal
 *     isOpen={showHolder}
 *     onClose={() => setShowHolder(false)}
 *     onSelect={(row) => {
 *       // row.holderId | row.holderName | row.description
 *       set('unitHolderNo', row.holderId);
 *     }}
 *   />
 *   <button onClick={() => setShowHolder(true)}>H</button>
 */

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// ─── Type ─────────────────────────────────────────────────────────────────────
export interface HolderRecord {
  holderId:    string;
  holderName:  string;
  description: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────
export const holderDummyData: HolderRecord[] = [
  { holderId: 'H0001', holderName: 'ALUTHGE NANDANI MRS.',                          description: 'Individual Holder – Colombo Branch' },
  { holderId: 'H0002', holderName: 'ABEYSINGHE DILUM SRI MR.',                      description: 'Individual Holder – Kandy Branch' },
  { holderId: 'H0003', holderName: 'WEERARATNE RAVEEN THEVINDU MR.',                description: 'Individual Holder – Galle Branch' },
  { holderId: 'H0004', holderName: 'WICKREMANAYAKE HIRANJAN PETER MR.',             description: 'Corporate Holder – Colombo' },
  { holderId: 'H0005', holderName: 'WICKREMANAYAKE JAYANI CHANDIMA MRS.',           description: 'Individual Holder – Negombo' },
  { holderId: 'H0006', holderName: 'FERNANDO HASHARA MADUSHANI MISS.',              description: 'Individual Holder – Colombo' },
  { holderId: 'H0007', holderName: 'FERNANDO DULINDRA THULSITH MR.',                description: 'Individual Holder – Kandy' },
  { holderId: 'H0008', holderName: 'JAYALATH JAYALATHGE RUSHANTHIE IROSHANI MRS.', description: 'Individual Holder – Colombo' },
  { holderId: 'H0009', holderName: 'PERERA CHAMINDA JAYANTHA MR.',                  description: 'Corporate Holder – Negombo' },
  { holderId: 'H0010', holderName: 'SILVA MALINI KUMARI MRS.',                      description: 'Individual Holder – Gampaha Branch' },
  { holderId: 'H0011', holderName: 'DISSANAYAKE KASUN PRADEEP MR.',                 description: 'Individual Holder – Kurunegala Branch' },
  { holderId: 'H0012', holderName: 'RANASINGHE THILAK BANDULA MR.',                 description: 'Corporate Holder – Kandy' },
  { holderId: 'H0013', holderName: 'KUMARA NIMAL BANDARA MR.',                      description: 'Individual Holder – Matara Branch' },
  { holderId: 'H0014', holderName: 'PATHIRANA SAMANTHA PRIYANTHA MR.',              description: 'Individual Holder – Galle Branch' },
  { holderId: 'H0015', holderName: 'JAYASINGHE SUMUDU DILHARA MISS.',               description: 'Individual Holder – Colombo' },
  { holderId: 'H0016', holderName: 'KARUNARATHNE BUDDHIKA ASELA MR.',               description: 'Corporate Holder – Colombo' },
  { holderId: 'H0017', holderName: 'WIJESINGHE CHAMARI ANUSHA MRS.',                description: 'Individual Holder – Kandy Branch' },
  { holderId: 'H0018', holderName: 'SENEVIRATNE MAHINDA PRASAD MR.',                description: 'Individual Holder – Ratnapura Branch' },
  { holderId: 'H0019', holderName: 'HERATH DILRUKSHI KANCHANA MRS.',                description: 'Individual Holder – Kegalle Branch' },
  { holderId: 'H0020', holderName: 'GAMAGE NUWAN CHAMITHA MR.',                     description: 'Individual Holder – Colombo' },
  { holderId: 'H0021', holderName: 'BANDARA LASANTHA PRADEEP MR.',                  description: 'Corporate Holder – Kurunegala' },
  { holderId: 'H0022', holderName: 'RAJAPAKSHA NIROSHA DILHANI MRS.',               description: 'Individual Holder – Hambantota Branch' },
  { holderId: 'H0023', holderName: 'SENANAYAKE ASANKA DILAN MR.',                   description: 'Individual Holder – Colombo' },
  { holderId: 'H0024', holderName: 'MENDIS CHATHURIKA SEWWANDI MISS.',              description: 'Individual Holder – Negombo Branch' },
  { holderId: 'H0025', holderName: 'AMARASINGHE PRIYANTHA ROHANA MR.',              description: 'Corporate Holder – Galle' },
];

// ─── Column definitions ───────────────────────────────────────────────────────
const COLUMNS: { key: keyof HolderRecord; header: string; width: string }[] = [
  { key: 'holderId',    header: 'Holder ID',    width: '18%' },
  { key: 'holderName',  header: 'Holder Name',  width: '42%' },
  { key: 'description', header: 'Description',  width: '40%' },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface HolderSearchModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  onSelect: (record: HolderRecord) => void;
  title?:   string;
  rows?:    HolderRecord[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HolderSearchModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Search Holder',
  rows = holderDummyData,
}: HolderSearchModalProps) {
  const [selected, setSelected] = useState<HolderRecord | null>(null);
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



  if (!isOpen) return null;

  const filtered = filter.trim()
    ? rows.filter(r =>
        r.holderId.toLowerCase().includes(filter.toLowerCase()) ||
        r.holderName.toLowerCase().includes(filter.toLowerCase()) ||
        r.description.toLowerCase().includes(filter.toLowerCase())
      )
    : rows;

  const handleGet = () => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  };

  // ─── All styles INLINE — avoids <style> injection bugs inside portals ────────
  const S = {
    overlay: {
      position:       'fixed'     as const,
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
      background:     '#ffffff',
      borderRadius:   '6px',
      width:          '760px',
      maxWidth:       '96vw',
      maxHeight:      '88vh',
      display:        'flex',
      flexDirection:  'column' as const,
      boxShadow:      '0 24px 64px rgba(0,0,0,0.32), 0 4px 16px rgba(0,0,0,0.18)',
      overflow:       'hidden',
      border:         '1.5px solid #7c3aed',   // purple accent — matches H button colour
    },
    header: {
      display:        'flex',
      alignItems:     'center',
      background:     'linear-gradient(90deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%)',
      minHeight:      '44px',
      flexShrink:     0,
      borderBottom:   '2px solid #7c3aed',     // purple stripe
    },
    logoLeft: {
      background:     'linear-gradient(180deg,#7c3aed 0%,#5b21b6 100%)',
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
      background:     'linear-gradient(180deg,#a78bfa 0%,#7c3aed 100%)',
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
      flex:           1,
      color:          '#ffffff',
      fontWeight:     700,
      fontSize:       '13px',
      letterSpacing:  '0.04em',
      textTransform:  'uppercase' as const,
      padding:        '0 16px',
      fontFamily:     "'Lato',system-ui,sans-serif",
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
      display:        'flex',
      alignItems:     'center',
      gap:            '10px',
      padding:        '8px 14px',
      background:     '#f5f3ff',              // light purple tint
      borderBottom:   '1px solid #e2e8f0',
      flexShrink:     0,
    },
    filterLabel: {
      fontSize:       '11px',
      fontWeight:     700,
      color:          '4b5563',
      textTransform:  'uppercase' as const,
      letterSpacing:  '0.04em',
      whiteSpace:     'nowrap' as const,
      fontFamily:     "'Lato',system-ui,sans-serif",
    },
    filterInput: {
      flex:           1,
      padding:        '5px 10px',
      fontSize:       '12px',
      border:         '1px solid #c4b5fd',
      borderRadius:   '4px',
      outline:        'none',
      fontFamily:     "'Lato',system-ui,sans-serif",
      background:     '#ffffff',
      color:          '#1f2937',
    },
    countBadge: {
      fontSize:       '11px',
      fontWeight:     700,
      color:          '#6b7280',
      whiteSpace:     'nowrap' as const,
      background:     '#ede9fe',
      borderRadius:   '10px',
      padding:        '2px 10px',
      fontFamily:     "'Lato',system-ui,sans-serif",
    },
    tableWrap: {
      flex:           1,
      overflowY:      'auto' as const,
      borderBottom:   '1px solid #e2e8f0',
      minHeight:      0,
    },
    table: {
      width:          '100%',
      borderCollapse: 'collapse' as const,
      tableLayout:    'fixed'    as const,
      fontFamily:     "'Lato',system-ui,sans-serif",
    },
    th: (): React.CSSProperties => ({
      padding:        '8px 10px',
      textAlign:      'left',
      fontSize:       '11px',
      fontWeight:     700,
      color:          '#ffffff',
      letterSpacing:  '0.04em',
      textTransform:  'uppercase',
      borderRight:    '1px solid rgba(255,255,255,0.12)',
      whiteSpace:     'nowrap',
      background:     '#7c3aed',             // purple header
      userSelect:     'none',
    }),
    tdBase: (isId: boolean, isDesc: boolean): React.CSSProperties => ({
      padding:        '7px 10px',
      fontSize:       '12px',
      color:          isId ? '#7c3aed' : isDesc ? '#4b5563' : '#1f2937',
      fontWeight:     isId ? 700 : 400,
      borderBottom:   '1px solid #e2e8f0',
      borderRight:    '1px solid #f1f5f9',
      overflow:       'hidden',
      textOverflow:   'ellipsis',
      whiteSpace:     'nowrap',
    }),
    rowBase: (isSelected: boolean, isEven: boolean): React.CSSProperties => ({
      cursor:         'pointer',
      background:     isSelected ? '#f5f3ff' : isEven ? '#ffffff' : '#f8fafc',
      outline:        isSelected ? '1.5px solid #7c3aed' : 'none',
      outlineOffset:  '-1.5px',
      transition:     'background 0.08s',
    }),
    hint: {
      fontSize:       '10px',
      color:          '#9ca3af',
      textAlign:      'center' as const,
      padding:        '3px 14px 5px',
      background:     '#f8fafc',
      fontFamily:     "'Lato',system-ui,sans-serif",
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
      fontSize:       '11px',
      color:          '#6b7280',
      fontFamily:     "'Lato',system-ui,sans-serif",
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
      letterSpacing:  '0.03em',
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
      background:     disabled ? '#9ca3af' : '#7c3aed',
      color:          '#ffffff',
      cursor:         disabled ? 'not-allowed' : 'pointer',
      letterSpacing:  '0.03em',
      boxShadow:      disabled ? 'none' : '0 2px 8px rgba(124,58,237,0.30)',
      opacity:        disabled ? 0.55 : 1,
    }),
    emptyTd: {
      padding:        '32px 16px',
      textAlign:      'center' as const,
      color:          '#9ca3af',
      fontSize:       '13px',
      fontStyle:      'italic' as const,
    },
  };

  return createPortal(
    <div
      style={S.overlay}
    >
      <div style={S.shell} role="dialog" aria-modal="true" aria-label={title}>

        {/* ══ HEADER ══ */}
        <div style={S.header}>
          <div style={S.logoLeft}>MSL</div>
          <div style={S.logoRight}>Computer<br />Services</div>
          <div style={S.headerTitle}>🔍 &nbsp;{title}</div>
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
            placeholder="Filter by Holder ID, Holder Name or Description…"
            onFocus={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.15)'; }}
            onBlur={e  => { e.currentTarget.style.borderColor = '#c4b5fd'; e.currentTarget.style.boxShadow = 'none'; }}
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
                      ...S.th(),
                      width:       col.width,
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
                  const isSelected = selected?.holderId === row.holderId;
                  return (
                    <tr
                      key={row.holderId}
                      style={S.rowBase(isSelected, i % 2 === 0)}
                      onClick={() => setSelected(row)}
                      onDoubleClick={() => { onSelect(row); onClose(); }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = '#ede9fe'; }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? '#ffffff' : '#f8fafc'; }}
                    >
                      {COLUMNS.map((col, ci) => (
                        <td
                          key={col.key}
                          style={{
                            ...S.tdBase(col.key === 'holderId', col.key === 'description'),
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
              ? <><b style={{ color: '#374151' }}>Selected:</b> {selected.holderId} — {selected.holderName}</>
              : 'No row selected · click a row first'}
          </div>

          {/* Right — Close then Get (Get is rightmost) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={S.btnGet(!selected)}
              onClick={handleGet}
              disabled={!selected}
              onMouseEnter={e => { if (selected) (e.currentTarget as HTMLButtonElement).style.background = '#6d28d9'; }}
              onMouseLeave={e => { if (selected) (e.currentTarget as HTMLButtonElement).style.background = '#7c3aed'; }}
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