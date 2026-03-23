import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AccountSearchModal from '../components/AccountSearchModal';
import HolderSearchModal from '../components/HolderSearchModal';
import type { HolderRecord } from '../components/HolderSearchModal';
import EditSearchModal from '../components/EditSearchModal';
import AkctNoSearchModal from '../components/AkctNoSearchModal';
import RequestAckModal from '../components/RequestAckModal';
import AccountSelectionPopup from '../components/AccountSelectionPopup';
import '../App.css';
import '../Setup.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ========================================
// STATIC DATA AND CONFIGURATION
// ========================================

const moduleData = [
  { title: 'Unit Fees', icon: '💳' },
  { title: 'Unit Creation', icon: '✨' },
  { title: 'Unit Redemption', icon: '💸' },
  { title: 'Unit Transfer/Switching', icon: '🔄' },
  { title: 'Unit Consolidation', icon: '🔗' },
  { title: 'Unit Blocking', icon: '🚫' },
  { title: 'Dividend Issues', icon: '💰' },
  { title: 'Redemption Cheque Printing', icon: '🧾' },
  { title: 'Cheque Re Printing', icon: '🖨️' },
  { title: 'Web Data Downloading', icon: '⬇️' },
  { title: 'Standing Instructions', icon: '📋' },
  { title: 'Standing Instructions Processing', icon: '⚙️' },
  { title: 'Bank Slip Transfer', icon: '🏦' },
  { title: 'Reminders', icon: '🔔' },
  { title: 'Unit Transfer - Suspense Account', icon: '📊' },
  { title: 'Change Agent for Transaction', icon: '👤' },
  { title: 'Acknowledgement Printing', icon: '📄' },
  { title: 'Fund Price E-statement', icon: '📈' },
  { title: 'Upload and Download Data Web-Automated', icon: '🌐' },
  { title: 'WHT Per Unit Entry', icon: '📝' },
  { title: 'Data Upload', icon: '📤' },
  { title: 'Transaction Upload', icon: '📥' },
];

const modules = moduleData.map(m => ({ title: m.title, icon: m.icon }));

const fundData = [
  { code: 'F001', name: 'Equity Fund' },
  { code: 'F002', name: 'Bond Fund' },
  { code: 'F003', name: 'Mixed Fund' },
  { code: 'F004', name: 'Growth Fund' },
  { code: 'F005', name: 'Income Fund' },
];

// ── Table dropdown data ──
const creationCodeData: Record<string, string>[] = [
  { code: 'CC001', name: 'Standard Creation' },
  { code: 'CC002', name: 'IPO Creation' },
  { code: 'CC003', name: 'Reinvestment' },
  { code: 'CC004', name: 'Bonus Units' },
  { code: 'CC005', name: 'Transfer In' },
  { code: 'CC006', name: 'Rights Issue' },
  { code: 'CC007', name: 'Dividend Reinvestment' },
  { code: 'CC008', name: 'Corporate Action' },
  { code: 'CC009', name: 'Conversion' },
  { code: 'CC010', name: 'Regular Savings Plan' },
];

const invTypeData: Record<string, string>[] = [
  { type: 'LUMP', description: 'Lump Sum Investment', agent: 'All Agents' },
  { type: 'REG', description: 'Regular / Monthly SIP', agent: 'Registered Agents' },
  { type: 'IPO', description: 'IPO Subscription', agent: 'IPO Agents' },
  { type: 'DIV', description: 'Dividend Reinvestment', agent: 'Fund Manager' },
  { type: 'BONUS', description: 'Bonus Unit Allocation', agent: 'Fund Manager' },
  { type: 'CORP', description: 'Corporate Investment', agent: 'Corporate Agents' },
  { type: 'RSP', description: 'Regular Savings Plan', agent: 'All Agents' },
  { type: 'RTS', description: 'Rights Issue Subscription', agent: 'Registered Agents' },
  { type: 'CONV', description: 'Fund Conversion', agent: 'All Agents' },
  { type: 'XFER', description: 'Transfer Investment', agent: 'Transfer Agents' },
];

const collAccData: Record<string, string>[] = [
  { code: 'CA001', name: 'Main Collection Account', bankAccNo: '0012345678' },
  { code: 'CA002', name: 'Secondary Collection Account', bankAccNo: '0098765432' },
  { code: 'CA003', name: 'IPO Collection Account', bankAccNo: '0011223344' },
  { code: 'CA004', name: 'Dividend Collection Account', bankAccNo: '0055667788' },
  { code: 'CA005', name: 'Bond Fund Collection', bankAccNo: '0099887766' },
  { code: 'CA006', name: 'Equity Fund Collection', bankAccNo: '0033445566' },
  { code: 'CA007', name: 'Corporate Client Account', bankAccNo: '0077889900' },
  { code: 'CA008', name: 'Suspense Account', bankAccNo: '0044556677' },
];

const promotionalData: Record<string, string>[] = [
  { promoCode: 'PA001', promoDesc: 'Summer Sale', description: '20% fee waiver on new investments' },
  { promoCode: 'PA002', promoDesc: 'Holiday Special', description: '15% fee waiver during festive season' },
  { promoCode: 'PA003', promoDesc: 'New Year Offer', description: '10% discount on entry fee for Jan' },
  { promoCode: 'PA004', promoDesc: 'Loyalty Reward', description: 'Extra 5% units for existing holders' },
  { promoCode: 'PA005', promoDesc: 'Referral Bonus', description: '2% bonus units for referrals' },
  { promoCode: 'PA006', promoDesc: 'Corporate Package', description: 'Zero entry fee for corporate clients' },
  { promoCode: 'PA007', promoDesc: 'Early Bird', description: '25% discount for first-week investors' },
  { promoCode: 'PA008', promoDesc: 'SIP Incentive', description: 'Free units after 12 months of SIP' },
];

// ── Agent table dropdown data ──
const agencyData: Record<string, string>[] = [
  { code: 'AG001', name: 'Main Street Agency' },
  { code: 'AG002', name: 'Central Agency' },
];

const subAgencyData: Record<string, string>[] = [
  { code: 'SA001', name: 'Downtown Branch' },
  { code: 'SA002', name: 'Uptown Branch' },
];

const agentData: Record<string, string>[] = [
  { code: 'AGT001', description: 'John Smith' },
  { code: 'AGT002', description: 'Sarah Johnson' },
];

// ── Redemption Code table dropdown data ──
const redemptionCodeData: Record<string, string>[] = [
  { transCode: 'RC001', name: 'Standard Redemption' },
  { transCode: 'RC002', name: 'Partial Redemption' },
  { transCode: 'RC003', name: 'Full Redemption' },
  { transCode: 'RC004', name: 'Forced Redemption' },
  { transCode: 'RC005', name: 'Dividend Payout Redemption' },
  { transCode: 'RC006', name: 'Maturity Redemption' },
  { transCode: 'RC007', name: 'Early Redemption' },
  { transCode: 'RC008', name: 'SIP Redemption' },
  { transCode: 'RC009', name: 'Corporate Action Redemption' },
  { transCode: 'RC010', name: 'Switch-Out Redemption' },
];

// ── Agent / Bank table dropdown data ──
const agentBankData: Record<string, string>[] = [
  { agentCode: 'AB001', agentDescription: 'First National Bank' },
  { agentCode: 'AB002', agentDescription: 'City Commercial Bank' },
  { agentCode: 'AB003', agentDescription: 'Standard Chartered' },
  { agentCode: 'AB004', agentDescription: 'Peoples Bank' },
  { agentCode: 'AB005', agentDescription: 'Bank of Ceylon' },
  { agentCode: 'AB006', agentDescription: 'Commercial Bank Ltd' },
  { agentCode: 'AB007', agentDescription: 'HNB Investments' },
  { agentCode: 'AB008', agentDescription: 'DFCC Bank' },
  { agentCode: 'AB009', agentDescription: 'Sampath Bank' },
  { agentCode: 'AB010', agentDescription: 'NSB Fund Agents' },
];

// ── Payment Type table dropdown data ──
const paymentTypeData: Record<string, string>[] = [
  { code: 'CHEQUE', name: 'Cheque' },
  { code: 'BANK_TRANSFER', name: 'Bank Transfer' },
  { code: 'CASH', name: 'Cash' },
  { code: 'ONLINE', name: 'Online Payment' },
  { code: 'DRAFT', name: 'Demand Draft' },
];

// ── Agency table dropdown data (extended) ──
const agencyTableData: Record<string, string>[] = [
  { agency_code: 'AG001', agency_name: 'Main Street Agency' },
  { agency_code: 'AG002', agency_name: 'Central Agency' },
  { agency_code: 'AG003', agency_name: 'North Branch Agency' },
  { agency_code: 'AG004', agency_name: 'South Branch Agency' },
];

// ── Sub-Agency table dropdown data (extended) ──
const subAgencyTableData: Record<string, string>[] = [
  { subagent_code: 'SA001', subagent_name: 'Downtown Branch' },
  { subagent_code: 'SA002', subagent_name: 'Uptown Branch' },
  { subagent_code: 'SA003', subagent_name: 'Midtown Branch' },
  { subagent_code: 'SA004', subagent_name: 'Westside Branch' },
];

// ── Agent table dropdown data (extended with 4 columns) ──
const agentTableData: Record<string, string>[] = [
  { agent_code: 'AGT001', agent_name: 'John Smith', agency_code: 'AG001', sub_agency_code: 'SA001' },
  { agent_code: 'AGT002', agent_name: 'Sarah Johnson', agency_code: 'AG001', sub_agency_code: 'SA002' },
  { agent_code: 'AGT003', agent_name: 'Michael Brown', agency_code: 'AG002', sub_agency_code: 'SA001' },
  { agent_code: 'AGT004', agent_name: 'Emily Davis', agency_code: 'AG002', sub_agency_code: 'SA003' },
  { agent_code: 'AGT005', agent_name: 'David Wilson', agency_code: 'AG003', sub_agency_code: 'SA002' },
  { agent_code: 'AGT006', agent_name: 'Jennifer Martinez', agency_code: 'AG003', sub_agency_code: 'SA004' },
  { agent_code: 'AGT007', agent_name: 'Robert Garcia', agency_code: 'AG004', sub_agency_code: 'SA001' },
  { agent_code: 'AGT008', agent_name: 'Lisa Anderson', agency_code: 'AG004', sub_agency_code: 'SA003' },
];

// ── Unit Fee Code table dropdown data ──
const unitFeeCodeData: Record<string, string>[] = [
  { code: 'UFC001', description: 'Entry Load Fee' },
  { code: 'UFC002', description: 'Exit Load Fee' },
  { code: 'UFC003', description: 'Management Fee' },
  { code: 'UFC004', description: 'Performance Fee' },
  { code: 'UFC005', description: 'Redemption Fee' },
  { code: 'UFC006', description: 'Switching Fee' },
  { code: 'UFC007', description: 'Registration Fee' },
  { code: 'UFC008', description: 'Front End Load' },
  { code: 'UFC009', description: 'Back End Load' },
  { code: 'UFC010', description: 'Switching Fee' },
];

const blockingCategoryData: Record<string, string>[] = [
  { BC_Code: 'BC001', Active: 'Yes', Description: 'Lien Marking' },
  { BC_Code: 'BC002', Active: 'Yes', Description: 'Court Order' },
  { BC_Code: 'BC003', Active: 'Yes', Description: 'Internal Block' },
  { BC_Code: 'BC004', Active: 'No', Description: 'Legacy Block' },
];

const institutionData: Record<string, string>[] = [
  { INS_Code: 'INS001', Description: 'Bank of Ceylon', active: 'Yes', INS_Category: 'Bank', Address1: 'No 1', Address2: 'York Street', Address3: 'Colombo 01', Cont_person: 'Mr. Perera', Cont_no: '0112345678' },
  { INS_Code: 'INS002', Description: 'Commercial Bank', active: 'Yes', INS_Category: 'Bank', Address1: 'No 21', Address2: 'Sir Chittampalam A Gardiner Mawatha', Address3: 'Colombo 02', Cont_person: 'Ms. Silva', Cont_no: '0112233445' },
];

// ========================================
// UNIT CREATION — Shared sub-components
// ========================================

function InputRow({
  label, labelWidth = 110, children, style,
}: {
  label: string; labelWidth?: number; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div
      className="setup-inline-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '6px',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      <label
        className="setup-inline-row-label"
        style={{
          minWidth: labelWidth,
          fontSize: '11px',
          fontWeight: 700,
          color: '#4b5563',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          flexShrink: 0,
          textAlign: 'right',
        }}
      >
        {label}
      </label>
      <div
        className="setup-inline-row-body"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SectionBox({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', overflow: 'visible', ...style }}>
      <div style={{
        background: 'linear-gradient(90deg,#e8edf5 0%,#f1f4f9 100%)',
        color: '#374151', padding: '5px 10px', fontWeight: 700, fontSize: '11px',
        letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0',
        borderRadius: '6px 6px 0 0',
      }}>{title}</div>
      <div style={{ padding: '10px' }}>{children}</div>
    </div>
  );
}

function FundDropdown({ value, displayValue, onSelect, disabled = false }: {
  value: string; displayValue: string; onSelect: (code: string, name: string) => void; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [popStyle, setPopStyle] = useState<React.CSSProperties>({});
  const trigRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const openIt = () => {
    if (!trigRef.current) return;
    const rect = trigRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const popH = 220;
    setPopStyle({
      position: 'fixed',
      top: spaceBelow >= popH ? rect.bottom + 3 : rect.top - popH - 3,
      left: rect.left,
      width: Math.max(rect.width, 320),
      zIndex: 2147483647,  // max z-index, always above modal
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node) &&
        trigRef.current && !trigRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const popup = open ? createPortal(
    <div ref={popRef} style={{
      ...popStyle,
      backgroundColor: '#ffffff', border: '1px solid #cbd5e1',
      borderRadius: '6px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      maxHeight: '220px', overflowY: 'auto',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1e3a8a' }}>
            <th style={{ padding: '7px 10px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#fff', width: '30%', borderRight: '1px solid rgba(255,255,255,0.15)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Code</th>
            <th style={{ padding: '7px 10px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name</th>
          </tr>
        </thead>
        <tbody>
          {fundData.map((fund, i) => (
            <tr key={i}
              onClick={() => { onSelect(fund.code, fund.name); setOpen(false); }}
              style={{ cursor: 'pointer', backgroundColor: value === fund.code ? '#eff6ff' : i % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
              onMouseEnter={e => { if (value !== fund.code) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#dbeafe'; }}
              onMouseLeave={e => { if (value !== fund.code) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#f8fafc'; }}
            >
              <td style={{ padding: '7px 10px', borderRight: '1px solid #e2e8f0', fontSize: '12px', color: '#1e3a8a', fontWeight: 700 }}>{fund.code}</td>
              <td style={{ padding: '7px 10px', fontSize: '12px', color: '#1f2937' }}>{fund.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={trigRef} style={{ position: 'relative', flex: 1 }}>
      <div
        onClick={() => { if (disabled) return; open ? setOpen(false) : openIt(); }}
        style={{
          padding: '5px 9px', border: `1px solid ${open ? '#1e3a8a' : 'rgba(0,0,0,0.10)'}`,
          borderRadius: '4px', backgroundColor: disabled ? '#f1f5f9' : '#ffffff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: displayValue ? '#1f2937' : '#9ca3af', minHeight: '30px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '12px', userSelect: 'none',
          boxShadow: open ? '0 0 0 2px rgba(30,58,138,0.15)' : 'none',
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayValue || 'Select fund'}</span>
        <span style={{ fontSize: '10px', color: open ? '#1e3a8a' : '#9ca3af', flexShrink: 0, marginLeft: '4px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▼</span>
      </div>
      {popup}
    </div>
  );
}

// ========================================
// REUSABLE TABLE DROPDOWN — portal-based
// ========================================

interface TableDropdownCol { key: string; header: string; width?: string; }
interface TableDropdownProps {
  value: string;
  displayValue: string;
  placeholder?: string;
  columns: TableDropdownCol[];
  rows: Record<string, string>[];
  valueKey: string;
  onSelect: (row: Record<string, string>) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  dropdownWidth?: number;
}

function TableDropdown({ value, displayValue, placeholder = 'Select', columns, rows, valueKey, onSelect, style, disabled = false, dropdownWidth }: TableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const openDropdown = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const popupH = 260;
    const width = dropdownWidth || Math.max(rect.width, 380);

    // Ensure it doesn't go off-screen horizontally
    let left = rect.left;
    if (left + width > window.innerWidth) {
      left = window.innerWidth - width - 15;
    }
    if (left < 15) left = 15;

    // Use fixed positioning so it escapes any scroll/overflow container
    const top = spaceBelow >= popupH
      ? rect.bottom + 3
      : rect.top - popupH - 3;

    setPopupStyle({
      position: 'fixed',
      top,
      left,
      width,
      zIndex: 2147483647,  // max z-index, always above modal
    });
    setOpen(true);
  }, [dropdownWidth]);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (
        popupRef.current && !popupRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setFilter('');
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const filtered = filter
    ? rows.filter(r => Object.values(r).some(v => v.toLowerCase().includes(filter.toLowerCase())))
    : rows;

  const popup = open ? createPortal(
    <div ref={popupRef} style={{
      ...popupStyle,
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '6px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
      display: 'flex', flexDirection: 'column',
      maxHeight: '260px', overflow: 'hidden',
    }}>
      <div style={{ padding: '7px 8px', borderBottom: '2px solid #e2e8f0', flexShrink: 0, background: '#f8fafc' }}>
        <input
          autoFocus
          value={filter}
          onChange={e => setFilter(e.target.value)}
          onKeyDown={e => e.key === 'Escape' && (setOpen(false), setFilter(''))}
          placeholder="🔍  Search..."
          style={{
            width: '100%', padding: '5px 10px', fontSize: '12px',
            border: '1px solid #cbd5e1', borderRadius: '4px',
            outline: 'none', boxSizing: 'border-box',
            background: '#ffffff', color: '#1f2937',
          }}
        />
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: '#1e3a8a' }}>
              {columns.map((col, ci) => (
                <th key={col.key} style={{
                  padding: '7px 10px', textAlign: 'left', fontSize: '11px',
                  fontWeight: 700, color: '#ffffff', width: col.width,
                  borderRight: ci < columns.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={columns.length} style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No results found</td></tr>
              : filtered.map((row, i) => {
                const isSelected = row[valueKey] === value;
                return (
                  <tr key={i}
                    onClick={() => { onSelect(row); setOpen(false); setFilter(''); }}
                    style={{ cursor: 'pointer', background: isSelected ? '#eff6ff' : i % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = '#dbeafe'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? '#ffffff' : '#f8fafc'; }}
                  >
                    {columns.map((col, ci) => (
                      <td key={col.key} style={{
                        padding: '7px 10px', fontSize: '12px',
                        borderRight: ci < columns.length - 1 ? '1px solid #e2e8f0' : 'none',
                        color: ci === 0 ? '#1e3a8a' : '#374151',
                        fontWeight: ci === 0 ? 700 : 400,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{row[col.key]}</td>
                    ))}
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
      <div style={{ padding: '4px 10px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', fontSize: '10px', color: '#6b7280', flexShrink: 0, display: 'flex', justifyContent: 'space-between' }}>
        <span>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        <span>Click row to select · Esc to close</span>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={triggerRef} style={{ position: 'relative', flex: 1, ...style }}>
      <div
        onClick={() => { if (disabled) return; open ? (setOpen(false), setFilter('')) : openDropdown(); }}
        style={{
          padding: '5px 9px', border: `1px solid ${open ? '#1e3a8a' : 'rgba(0,0,0,0.10)'}`,
          borderRadius: '4px', backgroundColor: disabled ? '#f1f5f9' : '#ffffff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: displayValue ? '#1f2937' : '#9ca3af', minHeight: '30px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '12px', userSelect: 'none',
          boxShadow: open ? '0 0 0 2px rgba(30,58,138,0.15)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayValue || placeholder}</span>
        <span style={{ fontSize: '10px', color: open ? '#1e3a8a' : '#9ca3af', flexShrink: 0, marginLeft: '4px', transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </div>
      {popup}
    </div>
  );
}

function CreationButtonPalette({ onNew, onClear, onProcess, onUpdate, isEnabled = true, children }: { onNew?: () => void; onClear?: () => void; onProcess?: () => void; onUpdate?: () => void; isEnabled?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap',
      padding: '10px 14px',
      background: 'linear-gradient(90deg,#f1f4f9 0%,#e8edf5 100%)',
      borderRadius: '8px', border: '1px solid rgba(0,0,0,0.07)', flexShrink: 0,
    }}>
      <button className="setup-btn setup-btn-new" onClick={onNew}><span className="setup-btn-icon">＋</span>New</button>
      {onProcess && (
        <button
          className="setup-btn setup-btn-process"
          style={{
            background: isEnabled ? '#10b981' : '#cbd5e1',
            color: '#ffffff',
            boxShadow: isEnabled ? '0 2px 8px rgba(16,185,129,0.3)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={onProcess}
          disabled={!isEnabled}
        >
          <span className="setup-btn-icon">▶</span>Process
        </button>
      )}
      <button className="setup-btn setup-btn-save"><span className="setup-btn-icon">💾</span>Save</button>
      <button className="setup-btn setup-btn-delete"><span className="setup-btn-icon">🗑️</span>Delete</button>
      <button className="setup-btn setup-btn-print"><span className="setup-btn-icon">🖨️</span>Print</button>
      <button className="setup-btn setup-btn-clear" onClick={onClear}><span className="setup-btn-icon">✕</span>Clear</button>
      {onUpdate && (
        <button
          className="setup-btn setup-btn-update"
          style={{
            background: '#1e40af',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(30,64,175,0.22)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={onUpdate}
          disabled={!isEnabled}
        >
          <span className="setup-btn-icon">💾</span>Update
        </button>
      )}
      {children}
    </div>
  );
}


const StableLBL: React.CSSProperties = {
  fontSize: '10px', fontWeight: 700, color: '#5a6a85',
  textTransform: 'uppercase' as const, letterSpacing: '0.06em',
  whiteSpace: 'nowrap' as const,
};

const StableField = ({ label, children, style }: {
  label: string; children: React.ReactNode; style?: React.CSSProperties;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', ...style }}>
    <span style={StableLBL}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{children}</div>
  </div>
);

// ========================================
// UNIT REDEMPTION MODAL
// ========================================
function UnitRedemptionModal({ onClose: _onClose }: { onClose: () => void }) {
  type URTab = 'Redemption' | 'Unit Fee Discounting' | 'Payout Details' | 'Agent Details';

  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<URTab>('Redemption');
  const [redeemDate, setRedeemDate] = useState<Date | null>(null);
  const [priceDate, setPriceDate] = useState<Date | null>(null);
  const [fundDate, setFundDate] = useState<Date | null>(null);

  const [showAccountSearch, setShowAccountSearch] = useState(false);
  const [showHolderSearch, setShowHolderSearch] = useState(false);
  const [showEditSearch, setShowEditSearch] = useState(false);
  const [showAkctSearch, setShowAkctSearch] = useState(false);
  const [showRequestAck, setShowRequestAck] = useState(false);

  const [gridRows, setGridRows] = useState<{ certificateNo: string; availableUnits: string; unitsToRedeem: string; balanceUnits: string; amount: string; blockedUnits: string }[]>([]);
  const [fullRedeem, setFullRedeem] = useState(false);
  const [ufdRecords, setUfdRecords] = useState<{ feeCode: string; description: string; amount: string; pct: string; newAmount: string }[]>([]);

  const [form, setForm] = useState({
    accNo: '',
    unitHolderNo: '',
    unitHolderName: '',
    fundCode: '',
    fundName: '',
    redemptionCode: '',
    txnNo: '',
    invType: '',
    unitPrice: '',
    noOfUnits: '',
    unitsToRedeem: '',
    value: '',
    agentBank: '',
    unitFeeMode: 'YES' as 'YES' | 'NO' | 'PRICE_DIFF',
    remark: '',
    reasonToEdit: '',
    unitsToAutoRedeem: '',
    autoRedeemAmount: '',
    payoutPaymentType: '',
    payoutPayee: '',
    agency: '',
    subAgency: '',
    agent: '',
    ufdFeeCode: '',
    ufdDescription: '',
    ufdAmount: '',
    ufdPct: '',
    ufdNewAmount: '',
    redCertificateNo: '',
    redAvailableUnits: '',
    redUnitsToRedeem: '',
    redBalanceUnits: '',
    redAmount: '',
    redBlockedUnits: '',
    accountSearchLocked: false,
  });

  const set = (field: string, value: string | boolean | 'YES' | 'NO' | 'PRICE_DIFF') =>
    setForm(prev => ({ ...prev, [field]: value }));

  const tabs: URTab[] = ['Redemption', 'Unit Fee Discounting', 'Payout Details', 'Agent Details'];


  const tableHeaderStyle: React.CSSProperties = {
    padding: '6px 10px',
    background: '#f1f5f9',
    fontWeight: 700,
    fontSize: '11px',
    color: '#374151',
    textAlign: 'left',
    borderBottom: '2px solid #cbd5e1',
    borderRight: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
  };
  const tableCellStyle: React.CSSProperties = {
    padding: '5px 10px',
    fontSize: '12px',
    color: '#1f2937',
    borderBottom: '1px solid #e2e8f0',
    borderRight: '1px solid #e2e8f0',
  };

  const clearForm = () => {
    setIsEnabled(false);
    setRedeemDate(null);
    setPriceDate(null);
    setFundDate(null);
    setFullRedeem(false);
    setUfdRecords([]);
    setGridRows([]);
    setForm({
      accNo: '',
      unitHolderNo: '',
      unitHolderName: '',
      fundCode: '',
      fundName: '',
      redemptionCode: '',
      txnNo: '',
      invType: '',
      unitPrice: '',
      noOfUnits: '',
      unitsToRedeem: '',
      value: '',
      agentBank: '',
      unitFeeMode: 'YES',
      remark: '',
      reasonToEdit: '',
      unitsToAutoRedeem: '',
      autoRedeemAmount: '',
      payoutPaymentType: '',
      payoutPayee: '',
      agency: '',
      subAgency: '',
      agent: '',
      ufdFeeCode: '',
      ufdDescription: '',
      ufdAmount: '',
      ufdPct: '',
      ufdNewAmount: '',
      redCertificateNo: '',
      redAvailableUnits: '',
      redUnitsToRedeem: '',
      redBalanceUnits: '',
      redAmount: '',
      redBlockedUnits: '',
      accountSearchLocked: false,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
      {/* ── Sub-modals ── */}
      <AccountSearchModal
        isOpen={showAccountSearch}
        onClose={() => setShowAccountSearch(false)}
        onGet={r => {
          setForm(prev => ({
            ...prev,
            accNo: r.accountNo || '',
            unitHolderNo: r.holderId || '',
            unitHolderName: r.holderName || '',
            fundName: r.fund || '',
            accountSearchLocked: true
          }));
        }}
        onSelect={r => {
          setForm(prev => ({
            ...prev,
            accNo: r.accountNo || '',
            unitHolderNo: r.holderId || '',
            unitHolderName: r.holderName || '',
            fundName: r.fund || '',
            accountSearchLocked: true
          }));
        }}
        title="Search Account"
      />
      <HolderSearchModal
        isOpen={showHolderSearch}
        onClose={() => setShowHolderSearch(false)}
        onSelect={(r: HolderRecord) => {
          set('unitHolderNo', r.holderId);
          set('unitHolderName', r.holderName);
        }}
      />
      <EditSearchModal
        isOpen={showEditSearch}
        onClose={() => setShowEditSearch(false)}
        title="Edit — Select Redemption Record"
        onSelect={r => {
          set('txnNo', (r as any).transactionNo || (r as any).akctNo || '');
          if ((r as any).accNo) set('accNo', (r as any).accNo);
        }}
      />
      <AkctNoSearchModal
        isOpen={showAkctSearch}
        onClose={() => setShowAkctSearch(false)}
        onSelect={r => set('txnNo', (r as any).akctNo || '')}
      />
      <RequestAckModal
        isOpen={showRequestAck}
        onClose={() => setShowRequestAck(false)}
        onConfirm={ackNo => set('txnNo', ackNo)}
      />

      {/* ════════════════════════════════════════════════════════
          SHARED STYLE HELPERS  (defined once, used in both boxes)
          ════════════════════════════════════════════════════════ */}
      {(() => {
        /* ── primitives ── */
        const fieldH = 28;
        const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
          height: fieldH, padding: '0 8px', fontSize: '12px',
          border: '1px solid #cfd8e3', borderRadius: '5px',
          background: isEnabled ? '#ffffff' : '#f0f4f8',
          color: '#1e293b', outline: 'none', width: '100%',
          boxSizing: 'border-box' as const,
          cursor: isEnabled ? 'text' : 'not-allowed',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
          ...extra,
        });
        const LBL = StableLBL;
        const iconBtn = (bg: string): React.CSSProperties => ({
          height: fieldH, minWidth: 26, padding: '0 4px', flexShrink: 0,
          background: isEnabled ? bg : '#b0bec5',
          color: '#fff', border: 'none', borderRadius: '5px',
          fontSize: '10px', fontWeight: 800,
          cursor: isEnabled ? 'pointer' : 'not-allowed',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isEnabled ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
        });
        const txtBtn = (bg: string): React.CSSProperties => ({
          height: fieldH, padding: '0 10px', flexShrink: 0,
          background: isEnabled ? bg : '#b0bec5',
          color: '#fff', border: 'none', borderRadius: '5px',
          fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' as const,
          cursor: isEnabled ? 'pointer' : 'not-allowed',
          boxShadow: isEnabled ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
        });

        /* ── row wrapper: label + field side-by-side ── */
        const Field = StableField;

        return (
          <>
            {/* ══════════════════════════════════════════
                BOX 1 — Unit Holder info  (2 rows)
                ══════════════════════════════════════════ */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #bdd5f0',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '8px',
              boxShadow: '0 1px 6px rgba(59,130,246,0.07)',
            }}>
              {/* Row 1 (Formerly Row 2) */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 32px 1fr', gap: '0 8px', marginBottom: '8px', alignItems: 'end' }}>
                <Field label="Unit Holder No">
                  <input className="setup-input-field" value={form.unitHolderNo} onChange={e => set('unitHolderNo', e.target.value)} style={inp()} disabled={!isEnabled || form.accountSearchLocked} />
                </Field>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
                  <button type="button" onClick={() => isEnabled && !form.accountSearchLocked && setShowHolderSearch(true)} disabled={!isEnabled || form.accountSearchLocked} style={iconBtn('#7c3aed')}>H</button>
                </div>
                <Field label="Unit Holder Name">
                  <input className="setup-input-field" value={form.unitHolderName} onChange={e => set('unitHolderName', e.target.value)} placeholder="Unit holder name" style={inp()} disabled={!isEnabled || form.accountSearchLocked} />
                </Field>
              </div>
              {/* Row 2 (Formerly Row 1) */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 32px 1fr', gap: '0 8px', alignItems: 'end' }}>
                <Field label="Unit Holder Acc No">
                  <input className="setup-input-field" value={form.accNo} onChange={e => set('accNo', e.target.value)} style={inp()} disabled={!isEnabled || form.accountSearchLocked} />
                </Field>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
                  <button type="button" onClick={() => isEnabled && setShowAccountSearch(true)} disabled={!isEnabled} style={iconBtn('#1e3a8a')}>A</button>
                </div>
                <Field label="Fund">
                  <FundDropdown value={form.fundCode} displayValue={form.fundName} onSelect={(c, n) => setForm(p => ({ ...p, fundCode: c, fundName: n }))} disabled={!isEnabled || form.accountSearchLocked} />
                </Field>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                BOX 2 — Redemption Details  (rows 3-7)
                ══════════════════════════════════════════ */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #bdd5f0',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '8px',
              boxShadow: '0 1px 6px rgba(59,130,246,0.07)',
            }}>

              {/* Row 3 — 3 cols: Redemption Code | Txn No [E] + Redeem Date | Price Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
                <Field label="Redemption Code">
                  <TableDropdown
                    value={form.redemptionCode}
                    displayValue={form.redemptionCode ? `${form.redemptionCode} – ${redemptionCodeData.find(r => r.transCode === form.redemptionCode)?.name || ''}` : ''}
                    placeholder="Select Redemption Code"
                    columns={[{ key: 'transCode', header: 'TRANS_CODE', width: '35%' }, { key: 'name', header: 'NAME', width: '65%' }]}
                    rows={redemptionCodeData} valueKey="transCode"
                    onSelect={row => set('redemptionCode', row.transCode)}
                    disabled={!isEnabled}
                  />
                </Field>
                {/* middle col: Txn No [E] + Redeem Date side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', alignItems: 'end' }}>
                  <Field label="Txn No">
                    <input className="setup-input-field" value={form.txnNo} onChange={e => set('txnNo', e.target.value)} style={inp({ flex: 1 })} disabled={!isEnabled} />
                    <button type="button" onClick={() => isEnabled && setShowEditSearch(true)} disabled={!isEnabled} style={iconBtn('#b45309')}>E</button>
                  </Field>
                  <Field label="Redeem Date">
                    <DatePicker selected={redeemDate} onChange={d => setRedeemDate(d)} dateFormat="dd/MMM/yyyy" placeholderText="DD/MMM/YYYY" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
                  </Field>
                </div>
                <Field label="Price Date">
                  <DatePicker selected={priceDate} onChange={d => setPriceDate(d)} dateFormat="dd/MMM/yyyy" placeholderText="DD/MMM/YYYY" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
                </Field>
              </div>

              {/* Row 4 — 3 cols: Investment Type [AKCT][?] | Unit Price Redemption + No of Units | Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
                <Field label="Investment Type">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown
                        value={form.invType}
                        displayValue={form.invType || ''}
                        placeholder="Select"
                        columns={[{ key: 'type', header: 'Type', width: '22%' }, { key: 'description', header: 'Description', width: '45%' }, { key: 'agent', header: 'Agent', width: '33%' }]}
                        rows={invTypeData as Record<string, string>[]} valueKey="type"
                        onSelect={row => set('invType', row.type)}
                        disabled={!isEnabled}
                      />
                    </div>
                    <button type="button" onClick={() => isEnabled && setShowAkctSearch(true)} disabled={!isEnabled} style={txtBtn('#0d7f5a')}>AKCT NO</button>
                    <button type="button" onClick={() => isEnabled && setShowRequestAck(true)} disabled={!isEnabled} style={iconBtn('#065f46')}>?</button>
                  </div>
                </Field>
                {/* middle col: Unit Price + No of Units side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', alignItems: 'end' }}>
                  <Field label="Unit Price Redemption">
                    <input type="number" className="setup-input-field" value={form.unitPrice} onChange={e => set('unitPrice', e.target.value)} style={inp()} disabled={!isEnabled} />
                  </Field>
                  <Field label="No of Units">
                    <input type="number" className="setup-input-field" value={form.noOfUnits} onChange={e => set('noOfUnits', e.target.value)} style={inp()} disabled={!isEnabled} />
                  </Field>
                </div>
                <Field label="Value">
                  <input type="number" className="setup-input-field" value={form.value} onChange={e => set('value', e.target.value)} style={inp()} disabled={!isEnabled} />
                </Field>
              </div>

              {/* Row 5 — Agent/Bank | Fund Date | Unit Fee glass pill | Remark (all one row) */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto 1fr', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
                <Field label="Agent / Bank">
                  <TableDropdown
                    value={form.agentBank}
                    displayValue={form.agentBank ? `${form.agentBank} – ${agentBankData.find(r => r.agentCode === form.agentBank)?.agentDescription || ''}` : ''}
                    placeholder="Select Agent / Bank"
                    columns={[{ key: 'agentCode', header: 'Agent Code', width: '35%' }, { key: 'agentDescription', header: 'Agent Description', width: '65%' }]}
                    rows={agentBankData} valueKey="agentCode"
                    onSelect={row => set('agentBank', row.agentCode)}
                    disabled={!isEnabled}
                  />
                </Field>
                <Field label="Fund Date">
                  <DatePicker selected={fundDate} onChange={d => setFundDate(d)} dateFormat="dd/MMM/yyyy" placeholderText="DD/MMM/YYYY" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
                </Field>

                {/* Unit Fee — white glass pill */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={LBL}>Unit Fee</span>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '2px',
                    background: 'rgba(255,255,255,0.72)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px', padding: '0 8px 0 0',
                    height: fieldH, boxSizing: 'border-box',
                    boxShadow: '0 2px 10px rgba(100,120,160,0.13), inset 0 1px 2px rgba(255,255,255,0.8)',
                    opacity: isEnabled ? 1 : 0.55,
                  }}>
                    {(['YES', 'NO', 'PRICE_DIFF'] as const).map((mode, i) => {
                      const active = form.unitFeeMode === mode;
                      return (
                        <label key={mode} onClick={() => isEnabled && set('unitFeeMode', mode)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          cursor: isEnabled ? 'pointer' : 'not-allowed',
                          padding: '3px 10px', borderRadius: '6px',
                          background: active ? 'rgba(37,99,235,0.12)' : 'transparent',
                          transition: 'background 0.15s',
                        }}>
                          <span style={{
                            width: 13, height: 13, borderRadius: '50%', flexShrink: 0,
                            border: `2px solid ${active ? '#2563eb' : '#94a3b8'}`,
                            background: active ? '#2563eb' : 'transparent',
                            boxShadow: active ? 'inset 0 0 0 2.5px #fff' : 'none',
                            display: 'inline-block',
                            transition: 'all 0.15s',
                          }} />
                          <span style={{ fontSize: '12px', fontWeight: active ? 700 : 500, color: active ? '#1d4ed8' : '#475569', whiteSpace: 'nowrap' }}>
                            {i === 0 ? 'Yes' : i === 1 ? 'No' : 'Price Diff'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <Field label="Remark">
                  <input className="setup-input-field" value={form.remark} onChange={e => set('remark', e.target.value)} style={inp()} disabled={!isEnabled} />
                </Field>
              </div>

              {/* Row 6 — Reason to Edit (full width) */}
              <div style={{ marginBottom: '8px' }}>
                <Field label="Reason to Edit">
                  <input className="setup-input-field" value={form.reasonToEdit} onChange={e => set('reasonToEdit', e.target.value)} style={inp()} disabled={!isEnabled} />
                </Field>
              </div>

              {/* Row 7 — Amount | Units to Auto Redeem */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', alignItems: 'end' }}>
                <Field label="Amount">
                  <input className="setup-input-field" value={form.autoRedeemAmount} onChange={e => {
                    const val = e.target.value;
                    const amount = parseFloat(val) || 0;
                    const price = parseFloat(form.unitPrice) || 10;
                    const unitsToRedeem = val ? (amount / price).toFixed(2) : '';
                    const availableUnits = 1000;
                    const balance = val ? (availableUnits - (amount / price)).toFixed(2) : '';

                    setForm(prev => ({
                      ...prev,
                      autoRedeemAmount: val,
                      redAmount: val,
                      redCertificateNo: val ? `CERT-${Math.floor(Math.random() * 10000)}` : '',
                      redAvailableUnits: val ? '1000' : '',
                      redUnitsToRedeem: unitsToRedeem,
                      redBalanceUnits: balance,
                      redBlockedUnits: val ? '0' : '',
                    }));
                  }} style={inp()} disabled={!isEnabled} />
                </Field>
                <Field label="Units to Auto Redeem">
                  <input className="setup-input-field" value={form.unitsToAutoRedeem} onChange={e => set('unitsToAutoRedeem', e.target.value)} style={inp()} disabled={!isEnabled} />
                </Field>
              </div>

            </div>
          </>
        );
      })()}

      {/* ── Button Palette ── */}
      <CreationButtonPalette onNew={() => setIsEnabled(true)} onClear={clearForm} />

      {/* ── Bottom: Tabbed Section ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          minHeight: '200px',
          flexShrink: 0,
        }}
      >
        {/* Full Redeem toggle bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 10px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0,
            justifyContent: 'flex-end',
          }}
        >
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#1e3a8a',
              whiteSpace: 'nowrap',
            }}
          >
            <input
              type="checkbox"
              checked={fullRedeem}
              onChange={e => setFullRedeem(e.target.checked)}
              disabled={!isEnabled}
              style={{ width: '14px', height: '14px' }}
            />
            Full Redeem
          </label>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #e2e8f0',
            flexShrink: 0,
            background: '#f8fafc',
            padding: '0 8px',
            overflowX: 'auto',
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '7px 12px',
                background: activeTab === tab ? '#ffffff' : 'transparent',
                color: activeTab === tab ? '#1e3a8a' : '#6b7280',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #1e3a8a' : '2px solid transparent',
                marginBottom: '-2px',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 700 : 600,
                fontSize: '11px',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: '10px', overflowY: 'auto', minHeight: '120px' }}>
          {activeTab === 'Redemption' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr)) 36px', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                <input
                  className="setup-input-field"
                  value={form.redCertificateNo}
                  onChange={e => set('redCertificateNo', e.target.value)}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                  placeholder="Certificate No"
                />
                <input
                  type="number"
                  className="setup-input-field"
                  value={form.redAvailableUnits}
                  onChange={e => set('redAvailableUnits', e.target.value)}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                  placeholder="Available Units"
                />
                <input
                  type="number"
                  className="setup-input-field"
                  value={form.redUnitsToRedeem}
                  onChange={e => {
                    set('redUnitsToRedeem', e.target.value);
                    // Auto-calculate balance units
                    const available = parseFloat(form.redAvailableUnits) || 0;
                    const toRedeem = parseFloat(e.target.value) || 0;
                    set('redBalanceUnits', (available - toRedeem).toString());
                  }}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                  placeholder="Units to Redeem"
                />
                <input
                  type="number"
                  className="setup-input-field"
                  value={form.redBalanceUnits}
                  onChange={e => set('redBalanceUnits', e.target.value)}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                  placeholder="Balance Units"
                />
                <input
                  type="number"
                  className="setup-input-field"
                  value={form.redAmount}
                  onChange={e => set('redAmount', e.target.value)}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                  placeholder="Amount"
                />
                <input
                  type="number"
                  className="setup-input-field"
                  value={form.redBlockedUnits}
                  onChange={e => set('redBlockedUnits', e.target.value)}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                  placeholder="Blocked Units"
                />
                <button
                  onClick={() => {
                    if (!isEnabled || !form.redCertificateNo) return;
                    setGridRows(p => [...p, {
                      certificateNo: form.redCertificateNo,
                      availableUnits: form.redAvailableUnits,
                      unitsToRedeem: form.redUnitsToRedeem,
                      balanceUnits: form.redBalanceUnits,
                      amount: form.redAmount,
                      blockedUnits: form.redBlockedUnits,
                    }]);
                    setForm(p => ({ ...p, redCertificateNo: '', redAvailableUnits: '', redUnitsToRedeem: '', redBalanceUnits: '', redAmount: '', redBlockedUnits: '' }));
                  }}
                  disabled={!isEnabled || !form.redCertificateNo}
                  style={{
                    background: isEnabled && form.redCertificateNo ? '#b45309' : '#9ca3af',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    width: '36px',
                    height: '28px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: isEnabled && form.redCertificateNo ? 'pointer' : 'not-allowed',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                  title="Add"
                >
                  ▼
                </button>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Certificate No</th>
                      <th style={tableHeaderStyle}>Available Units</th>
                      <th style={tableHeaderStyle}>Units to Redeem</th>
                      <th style={tableHeaderStyle}>Balance Units</th>
                      <th style={tableHeaderStyle}>Amount</th>
                      <th style={{ ...tableHeaderStyle, borderRight: 'none' }}>Blocked Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            padding: '18px',
                            textAlign: 'center',
                            color: '#9ca3af',
                            fontSize: '12px',
                            fontStyle: 'italic',
                          }}
                        >
                          No records
                        </td>
                      </tr>
                    ) : (
                      gridRows.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                          <td style={tableCellStyle}>{r.certificateNo}</td>
                          <td style={tableCellStyle}>{r.availableUnits}</td>
                          <td style={tableCellStyle}>{r.unitsToRedeem}</td>
                          <td style={tableCellStyle}>{r.balanceUnits}</td>
                          <td style={tableCellStyle}>{r.amount}</td>
                          <td style={{ ...tableCellStyle, borderRight: 'none' }}>{r.blockedUnits}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '11px',
                  color: '#6b7280',
                  fontStyle: 'italic',
                }}
              >
                Single click to partially redeem · Double click to full redeem.
              </div>
            </div>
          )}

          {activeTab === 'Unit Fee Discounting' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 36px', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                <select
                  className="setup-select-field"
                  value={form.ufdFeeCode}
                  onChange={e => {
                    const selected = unitFeeCodeData.find(f => f.code === e.target.value);
                    set('ufdFeeCode', e.target.value);
                    if (selected) set('ufdDescription', selected.description);
                  }}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                >
                  <option value="">Fee Code</option>
                  {unitFeeCodeData.map(f => (
                    <option key={f.code} value={f.code}>{f.code}</option>
                  ))}
                </select>
                <input
                  className="setup-input-field"
                  value={form.ufdDescription}
                  onChange={e => set('ufdDescription', e.target.value)}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                  placeholder="Description"
                />
                <input
                  type="number"
                  className="setup-input-field"
                  value={form.ufdAmount}
                  onChange={e => set('ufdAmount', e.target.value)}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                  placeholder="Amount"
                />
                <input
                  type="number"
                  className="setup-input-field"
                  value={form.ufdPct}
                  onChange={e => set('ufdPct', e.target.value)}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                  placeholder="%"
                />
                <input
                  type="number"
                  className="setup-input-field"
                  value={form.ufdNewAmount}
                  onChange={e => set('ufdNewAmount', e.target.value)}
                  style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                  disabled={!isEnabled}
                  placeholder="New Amount"
                />
                <button
                  onClick={() => {
                    if (!isEnabled || !form.ufdFeeCode) return;
                    setUfdRecords(p => [...p, { feeCode: form.ufdFeeCode, description: form.ufdDescription, amount: form.ufdAmount, pct: form.ufdPct, newAmount: form.ufdNewAmount }]);
                    setForm(p => ({ ...p, ufdFeeCode: '', ufdDescription: '', ufdAmount: '', ufdPct: '', ufdNewAmount: '' }));
                  }}
                  disabled={!isEnabled || !form.ufdFeeCode}
                  style={{
                    background: isEnabled && form.ufdFeeCode ? '#b45309' : '#9ca3af',
                    color: '#fff', border: 'none', borderRadius: '3px',
                    width: '36px', height: '28px', fontSize: '14px', fontWeight: 700,
                    cursor: isEnabled && form.ufdFeeCode ? 'pointer' : 'not-allowed',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                  title="Add"
                >▼</button>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Fee Code</th>
                      <th style={tableHeaderStyle}>Description</th>
                      <th style={tableHeaderStyle}>Amount</th>
                      <th style={tableHeaderStyle}>%</th>
                      <th style={{ ...tableHeaderStyle, borderRight: 'none' }}>New Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ufdRecords.length === 0
                      ? <tr><td colSpan={5} style={{ padding: '18px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No records</td></tr>
                      : ufdRecords.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                          <td style={tableCellStyle}>{r.feeCode}</td>
                          <td style={tableCellStyle}>{r.description}</td>
                          <td style={tableCellStyle}>{r.amount}</td>
                          <td style={tableCellStyle}>{r.pct}</td>
                          <td style={{ ...tableCellStyle, borderRight: 'none' }}>{r.newAmount}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Payout Details' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  marginBottom: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ minWidth: '220px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#4b5563',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '4px',
                    }}
                  >
                    Payment Type
                  </label>
                  <TableDropdown
                    value={form.payoutPaymentType}
                    displayValue={
                      form.payoutPaymentType
                        ? `${form.payoutPaymentType} – ${paymentTypeData.find(r => r.code === form.payoutPaymentType)?.name || ''}`
                        : ''
                    }
                    placeholder="Select Payment Type"
                    columns={[
                      { key: 'code', header: 'CODE', width: '40%' },
                      { key: 'name', header: 'NAME', width: '60%' },
                    ]}
                    rows={paymentTypeData}
                    valueKey="code"
                    onSelect={row => set('payoutPaymentType', row.code)}
                    style={{ minWidth: '180px' }}
                    disabled={!isEnabled}
                  />
                </div>

                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>Bank Code</th>
                          <th style={tableHeaderStyle}>Account No.</th>
                          <th style={{ ...tableHeaderStyle, borderRight: 'none' }}>Account Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            colSpan={3}
                            style={{
                              padding: '18px',
                              textAlign: 'center',
                              color: '#9ca3af',
                              fontSize: '12px',
                              fontStyle: 'italic',
                            }}
                          >
                            No accounts configured
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#4b5563',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '4px',
                  }}
                >
                  Payee
                </label>
                <input
                  className="setup-input-field"
                  value={form.payoutPayee}
                  onChange={e => set('payoutPayee', e.target.value)}
                  style={{ width: '100%', maxWidth: '560px', background: isEnabled ? '#fff' : '#f1f5f9', cursor: isEnabled ? 'auto' : 'not-allowed' }}
                  disabled={!isEnabled}
                />
              </div>
            </div>
          )}

          {activeTab === 'Agent Details' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: '8px', alignItems: 'end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#5a6a85', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Agency</span>
                  <TableDropdown
                    value={form.agency}
                    displayValue={form.agency ? `${form.agency} – ${agencyTableData.find(r => r.agency_code === form.agency)?.agency_name || ''}` : ''}
                    placeholder="Select Agency"
                    columns={[{ key: 'agency_code', header: 'Agency Code', width: '40%' }, { key: 'agency_name', header: 'Agency Name', width: '60%' }]}
                    rows={agencyTableData} valueKey="agency_code"
                    onSelect={row => set('agency', row.agency_code)}
                    style={{ flex: 1 }}
                    disabled={!isEnabled}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#5a6a85', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sub Agency</span>
                  <TableDropdown
                    value={form.subAgency}
                    displayValue={form.subAgency ? `${form.subAgency} – ${subAgencyTableData.find(r => r.subagent_code === form.subAgency)?.subagent_name || ''}` : ''}
                    placeholder="Select Sub Agency"
                    columns={[{ key: 'subagent_code', header: 'Subagent Code', width: '40%' }, { key: 'subagent_name', header: 'Subagent Name', width: '60%' }]}
                    rows={subAgencyTableData} valueKey="subagent_code"
                    onSelect={row => set('subAgency', row.subagent_code)}
                    style={{ flex: 1 }}
                    disabled={!isEnabled}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#5a6a85', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Agent</span>
                  <TableDropdown
                    value={form.agent}
                    displayValue={form.agent ? `${form.agent} – ${agentTableData.find(r => r.agent_code === form.agent)?.agent_name || ''}` : ''}
                    placeholder="Select Agent"
                    columns={[{ key: 'agent_code', header: 'Agent Code', width: '25%' }, { key: 'agent_name', header: 'Agent Name', width: '35%' }, { key: 'agency_code', header: 'Agency Code', width: '20%' }, { key: 'sub_agency_code', header: 'Sub Agency Code', width: '20%' }]}
                    rows={agentTableData} valueKey="agent_code"
                    onSelect={row => set('agent', row.agent_code)}
                    style={{ flex: 1 }}
                    disabled={!isEnabled}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ========================================
// UNIT CREATION MODAL
// ========================================
function UnitCreationModal({ onClose: _onClose }: { onClose: () => void }) {
  type UCTab = 'Unit Fee Discounting' | 'Credit Card' | 'Bank Transfer / Draft' | 'Cheque Details' | 'Agent Details' | 'Notification';

  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<UCTab>('Unit Fee Discounting');
  const [creationDate, setCreationDate] = useState<Date | null>(null);
  const [priceDate, setPriceDate] = useState<Date | null>(null);
  const [fundDate, setFundDate] = useState<Date | null>(null);
  const [chequeDate, setChequeDate] = useState<Date | null>(null);
  const [btValueDate, setBtValueDate] = useState<Date | null>(null);
  const [ccExpiryDate, setCcExpiryDate] = useState<Date | null>(null);

  const [showAccountSearch, setShowAccountSearch] = useState(false);
  const [showHolderSearch, setShowHolderSearch] = useState(false);
  const [showCreationSearch, setShowCreationSearch] = useState(false);
  const [showAkctSearch, setShowAkctSearch] = useState(false);
  const [showRequestAck, setShowRequestAck] = useState(false);

  const [chequeRecords, setChequeRecords] = useState<{ chequeNo: string; bankBranch: string; date: string; amount: string }[]>([]);
  const [ccRecords, setCcRecords] = useState<{ holderName: string; cardNo: string; expiry: string; cvc: string }[]>([]);
  const [btRecords, setBtRecords] = useState<{ bankBranch: string; draftNo: string; date: string; amount: string; swiftCode: string; creditAccNo: string; creditAccName: string }[]>([]);
  const [ufdRecords, setUfdRecords] = useState<{ feeCode: string; description: string; amount: string; pct: string; newAmount: string }[]>([]);

  const [form, setForm] = useState({
    accNo: '', unitHolderNo: '', creationNo: '',
    fundCode: '', fundName: '',
    creationCode: '', invType: '',
    noOfUnits: '1', paid: '', remark: '',
    collAcc: '', promotionalActivity: '',
    prevDayUnitPrice: '',
    unitFeeYes: true,
    payCash: true, payCreditCard: false, payBankTransfer: false, payCheque: false,
    chequeNo: '', chequeBankBranch: '', chequeAmount: '',
    ccHolder: '', ccNo: '', ccExpiry: '', ccValue: '',
    btBankBranch: '', btDescription: '', btValue: '',
    btSwiftCode: '', btCreditAccNo: '', btCreditAccName: '',
    ufdFeeCode: '', ufdDescription: '', ufdAmount: '', ufdPct: '', ufdNewAmount: '',
    agency: '', subAgency: '', agent: '',
    reasonToEdit: '',
  });

  const set = (field: string, value: string | boolean) => setForm(p => ({ ...p, [field]: value }));

  const selectPayment = (method: 'payCash' | 'payCreditCard' | 'payBankTransfer' | 'payCheque') => {
    const tabMap: Record<string, UCTab> = {
      payCash: 'Unit Fee Discounting',
      payCreditCard: 'Credit Card',
      payBankTransfer: 'Bank Transfer / Draft',
      payCheque: 'Cheque Details',
    };
    setForm(p => ({ ...p, payCash: false, payCreditCard: false, payBankTransfer: false, payCheque: false, [method]: true }));
    setActiveTab(tabMap[method]);
  };

  const clearForm = () => {
    setIsEnabled(false);
    setCreationDate(null); setPriceDate(null); setFundDate(null);
    setChequeDate(null); setBtValueDate(null); setCcExpiryDate(null);
    setChequeRecords([]); setCcRecords([]); setBtRecords([]); setUfdRecords([]);
    setForm({
      accNo: '', unitHolderNo: '', creationNo: '', fundCode: '', fundName: '',
      creationCode: '', invType: '', noOfUnits: '1', paid: '', remark: '',
      collAcc: '', promotionalActivity: '', prevDayUnitPrice: '',
      unitFeeYes: true, payCash: true, payCreditCard: false, payBankTransfer: false, payCheque: false,
      chequeNo: '', chequeBankBranch: '', chequeAmount: '',
      ccHolder: '', ccNo: '', ccExpiry: '', ccValue: '',
      btBankBranch: '', btDescription: '', btValue: '',
      btSwiftCode: '', btCreditAccNo: '', btCreditAccName: '',
      ufdFeeCode: '', ufdDescription: '', ufdAmount: '', ufdPct: '', ufdNewAmount: '',
      agency: '', subAgency: '', agent: '',
      reasonToEdit: '',
    });
    setActiveTab('Unit Fee Discounting');
  };

  const tabs: UCTab[] = ['Unit Fee Discounting', 'Credit Card', 'Bank Transfer / Draft', 'Cheque Details', 'Agent Details', 'Notification'];
  const tabLabel = (t: UCTab) => t === 'Unit Fee Discounting' ? 'Cash' : t;

  const radioCircle = (active: boolean, color = '#1e3a8a'): React.CSSProperties => ({
    width: '14px', height: '14px', borderRadius: '50%',
    border: `2px solid ${color}`,
    background: active ? color : '#fff',
    display: 'inline-block', flexShrink: 0,
    boxShadow: active ? 'inset 0 0 0 2px #fff' : 'none',
  });

  const tableHeaderStyle: React.CSSProperties = {
    padding: '6px 10px', background: '#f1f5f9', fontWeight: 700, fontSize: '11px',
    color: '#374151', textAlign: 'left', borderBottom: '2px solid #cbd5e1',
    borderRight: '1px solid #e2e8f0', whiteSpace: 'nowrap',
  };
  const tableCellStyle: React.CSSProperties = {
    padding: '5px 10px', fontSize: '12px', color: '#1f2937',
    borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0',
  };
  const addBtnStyle: React.CSSProperties = {
    background: '#b45309', color: '#fff', border: 'none', borderRadius: '3px',
    width: '24px', height: '24px', fontSize: '14px', fontWeight: 700,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>

      {/* ── Sub-modals ── */}
      <AccountSearchModal
        isOpen={showAccountSearch}
        onClose={() => setShowAccountSearch(false)}
        onGet={r => set('accNo', r.accountNo || '')}
        onSelect={r => set('accNo', r.accountNo || '')}
        title="Search Account"
      />
      <HolderSearchModal
        isOpen={showHolderSearch}
        onClose={() => setShowHolderSearch(false)}
        onSelect={(r: HolderRecord) => set('unitHolderNo', r.holderId)}
      />
      <EditSearchModal
        isOpen={showCreationSearch}
        onClose={() => setShowCreationSearch(false)}
        title="Edit — Select Creation Record"
        onSelect={r => {
          set('creationNo', r.transactionNo);
          set('accNo', r.accNo);
        }}
      />
      <AkctNoSearchModal
        isOpen={showAkctSearch}
        onClose={() => setShowAkctSearch(false)}
        onSelect={r => set('creationNo', r.akctNo)}
      />
      <RequestAckModal
        isOpen={showRequestAck}
        onClose={() => setShowRequestAck(false)}
        onConfirm={(ackNo) => set('creationNo', ackNo)}
      />

      {/* ── Section 1: Transaction Identity ── */}
      <SectionBox title="Transaction Identity">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 20px' }}>
          {/* Col 1 */}
          <div>
            <InputRow label="Acc No" labelWidth={108}>
              <input className="setup-input-field" value={form.accNo} onChange={e => set('accNo', e.target.value)} style={{ flex: 1, background: isEnabled ? '#fff' : '#f1f5f9', cursor: isEnabled ? 'auto' : 'not-allowed' }} disabled={!isEnabled} />
              <button type="button" onClick={() => isEnabled && setShowAccountSearch(true)} disabled={!isEnabled}
                style={{ background: isEnabled ? '#1e3a8a' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '3px', width: '20px', height: '20px', fontSize: '10px', fontWeight: 700, cursor: isEnabled ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>A</button>
            </InputRow>
            <InputRow label="Unit Holder No" labelWidth={108}>
              <input className="setup-input-field" value={form.unitHolderNo} onChange={e => set('unitHolderNo', e.target.value)} style={{ flex: 1, background: isEnabled ? '#fff' : '#f1f5f9', cursor: isEnabled ? 'auto' : 'not-allowed' }} disabled={!isEnabled} />
              <button type="button" onClick={() => isEnabled && setShowHolderSearch(true)} disabled={!isEnabled}
                style={{ background: isEnabled ? '#7c3aed' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '3px', width: '20px', height: '20px', fontSize: '10px', fontWeight: 700, cursor: isEnabled ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>H</button>
            </InputRow>
            <InputRow label="Creation No" labelWidth={108}>
              <input className="setup-input-field" value={form.creationNo} onChange={e => set('creationNo', e.target.value)} style={{ flex: 1, background: isEnabled ? '#fff' : '#f1f5f9', cursor: isEnabled ? 'auto' : 'not-allowed' }} disabled={!isEnabled} />
              <button type="button" onClick={() => isEnabled && setShowCreationSearch(true)} disabled={!isEnabled}
                style={{ background: isEnabled ? '#b45309' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '3px', width: '20px', height: '20px', fontSize: '10px', fontWeight: 700, cursor: isEnabled ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>E</button>
              <button type="button" onClick={() => isEnabled && setShowAkctSearch(true)} disabled={!isEnabled}
                style={{ background: isEnabled ? '#0d7f5a' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '3px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, cursor: isEnabled ? 'pointer' : 'not-allowed', flexShrink: 0 }}>AKCT NO</button>
              <button type="button" onClick={() => isEnabled && setShowRequestAck(true)} disabled={!isEnabled}
                style={{ background: isEnabled ? '#065f46' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '3px', padding: '2px 5px', fontSize: '10px', fontWeight: 700, cursor: isEnabled ? 'pointer' : 'not-allowed', flexShrink: 0, lineHeight: 1 }}>?</button>
            </InputRow>
          </div>
          {/* Col 2 — Fund + Creation Code (TableDropdown) + Inv Type (TableDropdown) */}
          <div>
            <InputRow label="Fund" labelWidth={95}>
              <FundDropdown value={form.fundCode} displayValue={form.fundName} onSelect={(c, n) => setForm(p => ({ ...p, fundCode: c, fundName: n }))} disabled={!isEnabled} />
            </InputRow>
            <InputRow label="Creation Code" labelWidth={95}>
              <TableDropdown
                value={form.creationCode}
                displayValue={form.creationCode ? `${form.creationCode} – ${creationCodeData.find(r => r.code === form.creationCode)?.name || ''}` : ''}
                placeholder="Select"
                columns={[
                  { key: 'code', header: 'Transaction Code', width: '38%' },
                  { key: 'name', header: 'Name', width: '62%' },
                ]}
                rows={creationCodeData as Record<string, string>[]}
                valueKey="code"
                onSelect={row => set('creationCode', row.code)}
                disabled={!isEnabled}
              />
            </InputRow>
            <InputRow label="Inv Type" labelWidth={95}>
              <TableDropdown
                value={form.invType}
                displayValue={form.invType ? `${form.invType} – ${invTypeData.find(r => r.type === form.invType)?.description || ''}` : ''}
                placeholder="Select"
                columns={[
                  { key: 'type', header: 'Type', width: '22%' },
                  { key: 'description', header: 'Description', width: '45%' },
                  { key: 'agent', header: 'Agent', width: '33%' },
                ]}
                rows={invTypeData as Record<string, string>[]}
                valueKey="type"
                onSelect={row => set('invType', row.type)}
                disabled={!isEnabled}
              />
            </InputRow>
          </div>
          {/* Col 3 — Dates */}
          <div>
            <InputRow label="Crea. Date" labelWidth={90}>
              <DatePicker selected={creationDate} onChange={d => setCreationDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
            </InputRow>
            <InputRow label="Price Date" labelWidth={90}>
              <DatePicker selected={priceDate} onChange={d => setPriceDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
            </InputRow>
            <InputRow label="Fund Date" labelWidth={90}>
              <DatePicker selected={fundDate} onChange={d => setFundDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
            </InputRow>
          </div>
        </div>
      </SectionBox>

      {/* ── Section 2: Transaction Details ── */}
      <SectionBox title="Transaction Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 20px', alignItems: 'start' }}>
          {/* Col 1 */}
          <div>
            <InputRow label="No of Units" labelWidth={108}>
              <input type="number" className="setup-input-field" value={form.noOfUnits} onChange={e => set('noOfUnits', e.target.value)} style={{ flex: 1, background: isEnabled ? '#fff' : '#f1f5f9', cursor: isEnabled ? 'auto' : 'not-allowed' }} disabled={!isEnabled} />
            </InputRow>
            <InputRow label="Paid" labelWidth={108}>
              <input type="number" className="setup-input-field" value={form.paid} onChange={e => set('paid', e.target.value)} style={{ flex: 1, background: isEnabled ? '#fff' : '#f1f5f9', cursor: isEnabled ? 'auto' : 'not-allowed' }} disabled={!isEnabled} />
            </InputRow>
            <InputRow label="Remark" labelWidth={108}>
              <input className="setup-input-field" value={form.remark} onChange={e => set('remark', e.target.value)} style={{ flex: 1, background: isEnabled ? '#fff' : '#f1f5f9', cursor: isEnabled ? 'auto' : 'not-allowed' }} disabled={!isEnabled} />
            </InputRow>
          </div>
          {/* Col 2 */}
          <div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
                Previous Day Unit Price — Creation
              </label>
              <input className="setup-input-field" value={form.prevDayUnitPrice} onChange={e => set('prevDayUnitPrice', e.target.value)} style={{ width: '100%', background: isEnabled ? '#fff' : '#f1f5f9', cursor: isEnabled ? 'auto' : 'not-allowed' }} disabled={!isEnabled} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Unit Fee</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: isEnabled ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: form.unitFeeYes ? 700 : 400, opacity: isEnabled ? 1 : 0.6 }} onClick={() => isEnabled && set('unitFeeYes', true)}>
                  <span style={radioCircle(form.unitFeeYes)} /> Yes
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: isEnabled ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: !form.unitFeeYes ? 700 : 400, opacity: isEnabled ? 1 : 0.6 }} onClick={() => isEnabled && set('unitFeeYes', false)}>
                  <span style={radioCircle(!form.unitFeeYes)} /> No
                </label>
              </div>
            </div>
          </div>
          {/* Col 3 — Payment Method */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>Payment Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
              {([
                { key: 'payCash', label: 'Cash', color: '#1e3a8a' },
                { key: 'payCreditCard', label: 'Credit Card', color: '#b91c1c' },
                { key: 'payBankTransfer', label: 'Bank Transfer / Draft', color: '#7c3aed' },
                { key: 'payCheque', label: 'Cheque', color: '#b45309' },
              ] as const).map(({ key, label, color }) => (
                <label key={key}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: isEnabled ? 'pointer' : 'not-allowed', fontSize: '12px', opacity: isEnabled ? 1 : 0.6 }}
                  onClick={() => isEnabled && selectPayment(key)}
                >
                  <span style={radioCircle(form[key], color)} />
                  <span style={{ color, fontWeight: form[key] ? 700 : 500 }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Coll. Acc + Promotional Activity — with TableDropdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px', marginTop: '6px' }}>
          <InputRow label="Coll. Acc" labelWidth={108}>
            <TableDropdown
              value={form.collAcc}
              displayValue={form.collAcc
                ? `${form.collAcc} – ${collAccData.find(r => r.code === form.collAcc)?.name || ''}`
                : ''}
              placeholder="Select"
              columns={[
                { key: 'code', header: 'Code', width: '22%' },
                { key: 'name', header: 'Name', width: '45%' },
                { key: 'bankAccNo', header: 'Bank Acc No', width: '33%' },
              ]}
              rows={collAccData as Record<string, string>[]}
              valueKey="code"
              onSelect={row => set('collAcc', row.code)}
              disabled={!isEnabled}
            />
          </InputRow>
          <InputRow label="Promotional Activity" labelWidth={148}>
            <TableDropdown
              value={form.promotionalActivity}
              displayValue={form.promotionalActivity
                ? `${form.promotionalActivity} – ${promotionalData.find(r => r.promoCode === form.promotionalActivity)?.promoDesc || ''}`
                : ''}
              placeholder="Select"
              columns={[
                { key: 'promoCode', header: 'Promo Code', width: '22%' },
                { key: 'promoDesc', header: 'Promo Description', width: '30%' },
                { key: 'description', header: 'Description', width: '48%' },
              ]}
              rows={promotionalData as Record<string, string>[]}
              valueKey="promoCode"
              onSelect={row => set('promotionalActivity', row.promoCode)}
              disabled={!isEnabled}
            />
          </InputRow>
        </div>
      </SectionBox>

      {/* ── Button Palette ── */}
      <CreationButtonPalette onNew={() => setIsEnabled(true)} onClear={clearForm} />

      {/* ── Tabbed Bottom Section ── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0',
        overflow: 'hidden', minHeight: '200px', flexShrink: 0,
      }}>
        {/* Reason to Edit bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Reason to Edit</span>
          <input className="setup-input-field" value={form.reasonToEdit} onChange={e => set('reasonToEdit', e.target.value)} style={{ flex: 1, background: isEnabled ? '#fff' : '#f1f5f9', cursor: isEnabled ? 'auto' : 'not-allowed' }} disabled={!isEnabled} />
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', flexShrink: 0, background: '#f8fafc', padding: '0 8px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
              padding: '7px 12px',
              background: activeTab === tab ? '#ffffff' : 'transparent',
              color: activeTab === tab ? '#1e3a8a' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #1e3a8a' : '2px solid transparent',
              marginBottom: '-2px', cursor: 'pointer',
              fontWeight: activeTab === tab ? 700 : 600, fontSize: '11px',
              fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{tabLabel(tab)}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: '10px', overflowY: 'auto', minHeight: '120px' }}>

          {/* ── CASH / Unit Fee Discounting ── */}
          {activeTab === 'Unit Fee Discounting' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Fee Code</label>
                  <select className="setup-select-field" value={form.ufdFeeCode} onChange={e => set('ufdFeeCode', e.target.value)} style={{ minWidth: '110px' }}>
                    <option value=""></option>
                    <option value="UFC001">UFC001</option>
                    <option value="UFC002">UFC002</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '140px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Description</label>
                  <input className="setup-input-field" value={form.ufdDescription} onChange={e => set('ufdDescription', e.target.value)} style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Amount</label>
                  <input type="number" className="setup-input-field" value={form.ufdAmount} onChange={e => set('ufdAmount', e.target.value)} style={{ width: '80px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>%</label>
                  <input type="number" className="setup-input-field" value={form.ufdPct} onChange={e => set('ufdPct', e.target.value)} style={{ width: '60px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>New Amount</label>
                  <input type="number" className="setup-input-field" value={form.ufdNewAmount} onChange={e => set('ufdNewAmount', e.target.value)} style={{ width: '80px' }} />
                </div>
                <button style={addBtnStyle} onClick={() => {
                  if (!form.ufdFeeCode) return;
                  setUfdRecords(p => [...p, { feeCode: form.ufdFeeCode, description: form.ufdDescription, amount: form.ufdAmount, pct: form.ufdPct, newAmount: form.ufdNewAmount }]);
                  setForm(p => ({ ...p, ufdFeeCode: '', ufdDescription: '', ufdAmount: '', ufdPct: '', ufdNewAmount: '' }));
                }} title="Add">▼</button>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Fee Code</th>
                      <th style={tableHeaderStyle}>Description</th>
                      <th style={tableHeaderStyle}>Amount</th>
                      <th style={tableHeaderStyle}>%</th>
                      <th style={{ ...tableHeaderStyle, borderRight: 'none' }}>New Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ufdRecords.length === 0
                      ? <tr><td colSpan={5} style={{ padding: '18px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No records</td></tr>
                      : ufdRecords.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                          <td style={tableCellStyle}>{r.feeCode}</td>
                          <td style={tableCellStyle}>{r.description}</td>
                          <td style={tableCellStyle}>{r.amount}</td>
                          <td style={tableCellStyle}>{r.pct}</td>
                          <td style={{ ...tableCellStyle, borderRight: 'none' }}>{r.newAmount}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CREDIT CARD ── */}
          {activeTab === 'Credit Card' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '140px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Card Holder Name</label>
                  <input className="setup-input-field" value={form.ccHolder} onChange={e => set('ccHolder', e.target.value)} style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '120px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Card No</label>
                  <input
                    className="setup-input-field"
                    value={form.ccNo}
                    onChange={e => {
                      // Format as XXXX XXXX XXXX XXXX
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                      set('ccNo', formatted);
                    }}
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength={19}
                    style={{ flex: 1, letterSpacing: '0.08em' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Date of Expiry</label>
                  <DatePicker
                    selected={ccExpiryDate}
                    onChange={d => setCcExpiryDate(d)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    className="date-picker-input"
                    placeholderText="MM/YYYY"
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>CVC</label>
                  <input
                    type="password"
                    className="setup-input-field"
                    value={form.ccValue}
                    onChange={e => set('ccValue', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    maxLength={4}
                    style={{ width: '64px', letterSpacing: '0.12em' }}
                  />
                </div>
                <button style={{ ...addBtnStyle, background: '#b91c1c' }} onClick={() => {
                  if (!form.ccNo) return;
                  const expiryStr = ccExpiryDate
                    ? ccExpiryDate.toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' }).replace('/', '/')
                    : '';
                  setCcRecords(p => [...p, { holderName: form.ccHolder, cardNo: form.ccNo, expiry: expiryStr, cvc: '•'.repeat(form.ccValue.length) }]);
                  setForm(p => ({ ...p, ccHolder: '', ccNo: '', ccValue: '' }));
                  setCcExpiryDate(null);
                }} title="Add">▼</button>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Card Holder Name</th>
                      <th style={tableHeaderStyle}>Card No</th>
                      <th style={tableHeaderStyle}>Date of Expiry</th>
                      <th style={{ ...tableHeaderStyle, borderRight: 'none' }}>CVC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ccRecords.length === 0
                      ? <tr><td colSpan={4} style={{ padding: '18px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No records</td></tr>
                      : ccRecords.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                          <td style={tableCellStyle}>{r.holderName}</td>
                          <td style={{ ...tableCellStyle, fontFamily: 'monospace', letterSpacing: '0.06em' }}>{r.cardNo}</td>
                          <td style={tableCellStyle}>{r.expiry}</td>
                          <td style={{ ...tableCellStyle, borderRight: 'none', letterSpacing: '0.1em' }}>{r.cvc}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── BANK TRANSFER / DRAFT ── */}
          {activeTab === 'Bank Transfer / Draft' && (
            <div>
              {/* Row 1: Bank-Branch | Description | Value Date | Value | Add */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Bank–Branch</label>
                  <select className="setup-select-field" value={form.btBankBranch} onChange={e => set('btBankBranch', e.target.value)} style={{ minWidth: '140px' }}>
                    <option value=""></option>
                    <option value="BOC-COL">BOC – Colombo</option>
                    <option value="HNB-KDY">HNB – Kandy</option>
                    <option value="COM-GLL">Commercial – Galle</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '120px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Description</label>
                  <input className="setup-input-field" value={form.btDescription} onChange={e => set('btDescription', e.target.value)} style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Value Date</label>
                  <DatePicker selected={btValueDate} onChange={d => setBtValueDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Value</label>
                  <input type="number" className="setup-input-field" value={form.btValue} onChange={e => set('btValue', e.target.value)} style={{ width: '90px' }} />
                </div>
                {/* Add button — collects ALL 7 fields */}
                <button style={{ ...addBtnStyle, background: '#7c3aed' }} onClick={() => {
                  if (!form.btBankBranch) return;
                  setBtRecords(p => [...p, {
                    bankBranch: form.btBankBranch,
                    draftNo: form.btDescription,
                    date: btValueDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) || '',
                    amount: form.btValue,
                    swiftCode: form.btSwiftCode,
                    creditAccNo: form.btCreditAccNo,
                    creditAccName: form.btCreditAccName,
                  }]);
                  setForm(p => ({ ...p, btBankBranch: '', btDescription: '', btValue: '', btSwiftCode: '', btCreditAccNo: '', btCreditAccName: '' }));
                  setBtValueDate(null);
                }} title="Add">▼</button>
              </div>
              {/* Row 2: SWIFT Code | Credit Acc Number | Credit Acc Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>SWIFT Code</label>
                  <input className="setup-input-field" value={form.btSwiftCode} onChange={e => set('btSwiftCode', e.target.value)} style={{ width: '100px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '130px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Credit Acc Number</label>
                  <input className="setup-input-field" value={form.btCreditAccNo} onChange={e => set('btCreditAccNo', e.target.value)} style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '130px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Credit Acc Name</label>
                  <input className="setup-input-field" value={form.btCreditAccName} onChange={e => set('btCreditAccName', e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              {/* Table — all 7 columns, Value field stored as Amount */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Bank/Branch</th>
                      <th style={tableHeaderStyle}>Transfer / Draft No</th>
                      <th style={tableHeaderStyle}>Date</th>
                      <th style={tableHeaderStyle}>SWIFT Code</th>
                      <th style={tableHeaderStyle}>Credit Acc No</th>
                      <th style={tableHeaderStyle}>Credit Acc Name</th>
                      <th style={{ ...tableHeaderStyle, borderRight: 'none' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {btRecords.length === 0
                      ? <tr><td colSpan={7} style={{ padding: '18px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No records</td></tr>
                      : btRecords.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                          <td style={tableCellStyle}>{r.bankBranch}</td>
                          <td style={tableCellStyle}>{r.draftNo}</td>
                          <td style={tableCellStyle}>{r.date}</td>
                          <td style={tableCellStyle}>{r.swiftCode}</td>
                          <td style={tableCellStyle}>{r.creditAccNo}</td>
                          <td style={tableCellStyle}>{r.creditAccName}</td>
                          <td style={{ ...tableCellStyle, borderRight: 'none', fontWeight: 700, color: '#7c3aed' }}>{r.amount}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CHEQUE DETAILS ── */}
          {activeTab === 'Cheque Details' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '130px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Cheque No</label>
                  <input className="setup-input-field" value={form.chequeNo} onChange={e => set('chequeNo', e.target.value)} style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Bank/Branch</label>
                  <select className="setup-select-field" value={form.chequeBankBranch} onChange={e => set('chequeBankBranch', e.target.value)} style={{ minWidth: '130px' }}>
                    <option value=""></option>
                    <option value="BOC-COL">BOC – Colombo</option>
                    <option value="HNB-KDY">HNB – Kandy</option>
                    <option value="COM-GLL">Commercial – Galle</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Date</label>
                  <DatePicker selected={chequeDate} onChange={d => setChequeDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Amount</label>
                  <input type="number" className="setup-input-field" value={form.chequeAmount} onChange={e => set('chequeAmount', e.target.value)} style={{ width: '90px' }} />
                </div>
                <button style={addBtnStyle} onClick={() => {
                  if (!form.chequeNo) return;
                  setChequeRecords(p => [...p, { chequeNo: form.chequeNo, bankBranch: form.chequeBankBranch, date: chequeDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) || '', amount: form.chequeAmount }]);
                  setForm(p => ({ ...p, chequeNo: '', chequeBankBranch: '', chequeAmount: '' }));
                  setChequeDate(null);
                }} title="Add">▼</button>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Cheque No</th>
                      <th style={tableHeaderStyle}>Bank/Branch</th>
                      <th style={tableHeaderStyle}>Date</th>
                      <th style={{ ...tableHeaderStyle, borderRight: 'none' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chequeRecords.length === 0
                      ? <tr><td colSpan={4} style={{ padding: '18px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No records</td></tr>
                      : chequeRecords.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                          <td style={tableCellStyle}>{r.chequeNo}</td>
                          <td style={tableCellStyle}>{r.bankBranch}</td>
                          <td style={tableCellStyle}>{r.date}</td>
                          <td style={{ ...tableCellStyle, borderRight: 'none' }}>{r.amount}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── AGENT DETAILS ── */}
          {activeTab === 'Agent Details' && (
            <div>
              <div style={{ display: 'inline-block', padding: '3px 10px', background: 'linear-gradient(90deg,#e8edf5,#f1f4f9)', color: '#1e3a8a', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '4px', marginBottom: '10px' }}>Agents</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap' }}>
                {/* Agency */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Agency</label>
                  <TableDropdown
                    value={form.agency}
                    displayValue={
                      form.agency
                        ? `${form.agency} – ${agencyData.find(r => r.code === form.agency)?.name || ''}`
                        : ''
                    }
                    placeholder="Select"
                    columns={[
                      { key: 'code', header: 'Agency Code', width: '32%' },
                      { key: 'name', header: 'Agency Name', width: '68%' },
                    ]}
                    rows={agencyData as Record<string, string>[]}
                    valueKey="code"
                    onSelect={row => set('agency', row.code)}
                    disabled={!isEnabled}
                    style={{ flex: 1 }}
                  />
                </div>
                {/* Sub Agency */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Sub Agency</label>
                  <TableDropdown
                    value={form.subAgency}
                    displayValue={
                      form.subAgency
                        ? `${form.subAgency} – ${subAgencyData.find(r => r.code === form.subAgency)?.name || ''}`
                        : ''
                    }
                    placeholder="Select"
                    columns={[
                      { key: 'code', header: 'Sub Agency Code', width: '32%' },
                      { key: 'name', header: 'Sub Agency Name', width: '68%' },
                    ]}
                    rows={subAgencyData as Record<string, string>[]}
                    valueKey="code"
                    onSelect={row => set('subAgency', row.code)}
                    disabled={!isEnabled}
                    style={{ flex: 1 }}
                  />
                </div>
                {/* Agent */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Agent</label>
                  <TableDropdown
                    value={form.agent}
                    displayValue={
                      form.agent
                        ? `${form.agent} – ${agentData.find(r => r.code === form.agent)?.description || ''}`
                        : ''
                    }
                    placeholder="Select"
                    columns={[
                      { key: 'code', header: 'Agent Code', width: '30%' },
                      { key: 'description', header: 'Description', width: '70%' },
                    ]}
                    rows={agentData as Record<string, string>[]}
                    valueKey="code"
                    onSelect={row => set('agent', row.code)}
                    disabled={!isEnabled}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATION ── */}
          {activeTab === 'Notification' && (
            <div>
              <style>{`
                .notif-row {
                  display: flex; align-items: flex-start; gap: 12px;
                  padding: 10px 12px; border-radius: 6px; margin-bottom: 6px;
                  border: 1px solid transparent; transition: background 0.15s;
                  background: #fff;
                }
                .notif-row:hover { background: #f8fafc; border-color: #e2e8f0; }
                .notif-icon-wrap {
                  width: 32px; height: 32px; border-radius: 50%;
                  display: flex; align-items: center; justify-content: center;
                  font-size: 15px; flex-shrink: 0; margin-top: 1px;
                }
                .notif-icon-wrap.info    { background: #eff6ff; border: 1.5px solid #bfdbfe; }
                .notif-icon-wrap.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; }
                .notif-icon-wrap.warning { background: #fffbeb; border: 1.5px solid #fde68a; }
                .notif-icon-wrap.error   { background: #fef2f2; border: 1.5px solid #fecaca; }
                .notif-title {
                  font-size: 12px; font-weight: 700; color: #1f2937;
                  margin-bottom: 2px; line-height: 1.3;
                }
                .notif-msg { font-size: 11px; color: #6b7280; line-height: 1.45; }
                .notif-time {
                  font-size: 10px; color: #9ca3af; white-space: nowrap;
                  margin-left: auto; padding-left: 10px; padding-top: 2px;
                }
                .notif-badge {
                  display: inline-block; padding: 1px 7px; border-radius: 10px;
                  font-size: 9px; font-weight: 700; letter-spacing: 0.05em;
                  text-transform: uppercase; margin-left: 6px; vertical-align: middle;
                }
                .notif-badge.info    { background: #dbeafe; color: #1d4ed8; }
                .notif-badge.success { background: #dcfce7; color: #15803d; }
                .notif-badge.warning { background: #fef9c3; color: #b45309; }
                .notif-badge.error   { background: #fee2e2; color: #b91c1c; }
              `}</style>

              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ padding: '3px 10px', background: 'linear-gradient(90deg,#e8edf5,#f1f4f9)', color: '#1e3a8a', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '4px' }}>
                    🔔 Notifications
                  </div>
                  <span style={{ background: '#b91c1c', color: '#fff', borderRadius: '10px', fontSize: '10px', fontWeight: 700, padding: '1px 7px' }}>3 new</span>
                </div>
                <button style={{ background: 'none', border: 'none', fontSize: '11px', color: '#1e3a8a', fontWeight: 700, cursor: 'pointer', padding: '3px 8px', borderRadius: '4px', textDecoration: 'underline' }}
                  onClick={() => { }}>Mark all as read</button>
              </div>

              {/* Notification list */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                {/* New / unread */}
                <div style={{ background: '#f1f5f9', padding: '4px 12px', fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #e2e8f0' }}>
                  New
                </div>

                <div className="notif-row" style={{ borderBottom: '1px solid #f1f5f9', borderLeft: '3px solid #2563eb' }}>
                  <div className="notif-icon-wrap info">🔔</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="notif-title">
                      Transaction Pending Approval
                      <span className="notif-badge info">Info</span>
                    </div>
                    <div className="notif-msg">Unit Creation No. UC-2026-0142 is awaiting Level 2 approval from the fund manager before processing.</div>
                  </div>
                  <div className="notif-time">2 min ago</div>
                </div>

                <div className="notif-row" style={{ borderBottom: '1px solid #f1f5f9', borderLeft: '3px solid #d97706' }}>
                  <div className="notif-icon-wrap warning">⚠️</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="notif-title">
                      Price Date Mismatch
                      <span className="notif-badge warning">Warning</span>
                    </div>
                    <div className="notif-msg">The selected Price Date (19/Oct/2007) does not match the current Fund NAV date. Please verify before saving.</div>
                  </div>
                  <div className="notif-time">15 min ago</div>
                </div>

                <div className="notif-row" style={{ borderBottom: '1px solid #f1f5f9', borderLeft: '3px solid #dc2626' }}>
                  <div className="notif-icon-wrap error">❌</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="notif-title">
                      Payment Validation Failed
                      <span className="notif-badge error">Error</span>
                    </div>
                    <div className="notif-msg">Credit card ending in 4242 was declined. Please verify card details or select an alternative payment method.</div>
                  </div>
                  <div className="notif-time">1 hr ago</div>
                </div>

                {/* Earlier */}
                <div style={{ background: '#f1f5f9', padding: '4px 12px', fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                  Earlier
                </div>

                <div className="notif-row" style={{ borderBottom: '1px solid #f1f5f9', borderLeft: '3px solid #16a34a', opacity: 0.7 }}>
                  <div className="notif-icon-wrap success">✅</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="notif-title">
                      Transaction Approved
                      <span className="notif-badge success">Success</span>
                    </div>
                    <div className="notif-msg">Unit Creation No. UC-2026-0138 has been approved and processed successfully. Units have been allocated.</div>
                  </div>
                  <div className="notif-time">Yesterday</div>
                </div>

                <div className="notif-row" style={{ borderLeft: '3px solid #16a34a', opacity: 0.7 }}>
                  <div className="notif-icon-wrap success">💰</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="notif-title">
                      Payment Received
                      <span className="notif-badge success">Success</span>
                    </div>
                    <div className="notif-msg">Cheque No. CHQ-00923 (BOC – Colombo) has been cleared and credited to the Main Collection Account.</div>
                  </div>
                  <div className="notif-time">2 days ago</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <button style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', color: '#374151', fontWeight: 600, cursor: 'pointer', padding: '4px 16px' }}>View all notifications</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ========================================
// UNIT SWITCHING MODAL
// ========================================
function UnitSwitchingModal({ onClose: _onClose }: { onClose: () => void }) {
  type USWTab = '[From]' | '[To]' | 'Agent Details';

  const [isEnabled, setIsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<USWTab>('[From]');
  const [switchDate, setSwitchDate] = useState<Date | null>(new Date());
  const [priceDate, setPriceDate] = useState<Date | null>(new Date('2007-10-19'));

  // Search modal visibility
  const [showFromAccSearch, setShowFromAccSearch] = useState(false);
  const [showFromHldSearch, setShowFromHldSearch] = useState(false);
  const [showToAccSearch, setShowToAccSearch] = useState(false);
  const [showToHldSearch, setShowToHldSearch] = useState(false);
  const [showEditSearch, setShowEditSearchSW] = useState(false);
  const [showAkctSearch, setShowAkctSearchSW] = useState(false);

  // Certificates grid rows
  const [certRows, setCertRows] = useState<{
    certificateNo: string; availableUnits: string; switchUnits: string;
    balanceUnits: string; amount: string; blockedUnits: string;
  }[]>([]);

  // Unit Fee Discounting Out rows
  const [ufdOutRows, setUfdOutRows] = useState<{
    feeCode: string; description: string; amount: string; pct: string; newAmount: string;
  }[]>([]);

  // Unit Fee Discounting In rows
  const [ufdInRows, setUfdInRows] = useState<{
    feeCode: string; description: string; amount: string; pct: string; newAmount: string;
  }[]>([]);

  const emptyForm = {
    // Header
    switchCode: '', switchNo: '', invType: '', remark: '', reasonToEdit: '',
    // [From] tab
    fromAccNo: '', fromFund: '', fromFundName: '', fromFundDate: '',
    fromHolderNo: '', fromHolderName: '', fromNoOfUnits: '', fromValue: '', fromAgent: '',
    unitFeeApply: 'No' as 'Yes' | 'No',
    unitPriceRedemptionFrom: '',
    policyNoFrom: '',
    unitToAutoRedeemFrom: '',
    amountFrom: '',
    // [To] tab
    toAccNo: '', toFund: '', toFundName: '', toFundDate: '',
    toHolderNo: '', toHolderName: '', toNoOfUnits: '', toValue: '', toAgent: '',
    unitFeeApplyTo: 'No' as 'Yes' | 'No',
    unitPriceCreationTo: '',
    policyNoTo: '',
    unitToAutoRedeemTo: '',
    amountTo: '',
    // Cert row input
    certNo: '', availableUnits: '', switchUnits: '', balanceUnits: '', certAmount: '', blockedUnits: '',
    // UFD row inputs
    ufdOutFeeCode: '', ufdOutDescription: '', ufdOutAmount: '', ufdOutPct: '', ufdOutNewAmount: '',
    ufdInFeeCode: '', ufdInDescription: '', ufdInAmount: '', ufdInPct: '', ufdInNewAmount: '',
    // Agent Details
    agency: '', subAgency: '', agent: '',
    toAgency: '', toSubAgency: '',
  };

  const [form, setForm] = useState(emptyForm);
  const set = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const clearForm = () => {
    setIsEnabled(false);
    setSwitchDate(new Date());
    setPriceDate(new Date('2007-10-19'));
    setCertRows([]); setUfdOutRows([]); setUfdInRows([]);
    setForm(emptyForm);
    setActiveTab('[From]');
  };

  const switchCodeData: Record<string, string>[] = [
    { code: 'SW001', name: 'Fund Switch' },
    { code: 'SW002', name: 'Partial Switch' },
    { code: 'SW003', name: 'Full Switch' },
    { code: 'SW004', name: 'Growth to Income' },
    { code: 'SW005', name: 'Income to Growth' },
    { code: 'SW006', name: 'Equity to Bond' },
    { code: 'SW007', name: 'Bond to Equity' },
  ];

  const tabs: USWTab[] = ['[From]', '[To]', 'Agent Details'];

  // Bottom sub-tabs (Certificates / Unit Fee Discounting Out / Unit Fee Discounting In)
  type BottomTab = 'Certificates' | 'Unit Fee Discounting Out' | 'Unit Fee Discounting In';
  const [bottomTab, setBottomTab] = useState<BottomTab>('Certificates');
  const bottomTabs: BottomTab[] = ['Certificates', 'Unit Fee Discounting Out', 'Unit Fee Discounting In'];

  /* ── shared style helpers ── */
  const FH = 28;
  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: FH, padding: '0 8px', fontSize: '12px',
    border: '1px solid #cfd8e3', borderRadius: '5px',
    background: isEnabled ? '#ffffff' : '#f0f4f8',
    color: '#1e293b', outline: 'none', width: '100%',
    boxSizing: 'border-box' as const,
    cursor: isEnabled ? 'text' : 'not-allowed',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    ...extra,
  });
  const LBL: React.CSSProperties = {
    fontSize: '10px', fontWeight: 700, color: '#5a6a85',
    textTransform: 'uppercase' as const, letterSpacing: '0.06em',
    whiteSpace: 'nowrap' as const,
  };
  const iconBtn = (bg: string): React.CSSProperties => ({
    height: FH, minWidth: 26, padding: '0 5px', flexShrink: 0,
    background: isEnabled ? bg : '#b0bec5',
    color: '#fff', border: 'none', borderRadius: '5px',
    fontSize: '10px', fontWeight: 800,
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: isEnabled ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
  });
  const txtBtn = (bg: string): React.CSSProperties => ({
    height: FH, padding: '0 10px', flexShrink: 0,
    background: isEnabled ? bg : '#b0bec5',
    color: '#fff', border: 'none', borderRadius: '5px',
    fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' as const,
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    boxShadow: isEnabled ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
  });
  const Field = ({ label, children, style }: {
    label: string; children: React.ReactNode; style?: React.CSSProperties;
  }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', ...style }}>
      <span style={LBL}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{children}</div>
    </div>
  );
  const thSt: React.CSSProperties = {
    padding: '6px 10px', background: '#f1f5f9', fontWeight: 700, fontSize: '11px',
    color: '#374151', textAlign: 'left', borderBottom: '2px solid #cbd5e1',
    borderRight: '1px solid #e2e8f0', whiteSpace: 'nowrap',
  };
  const tdSt: React.CSSProperties = {
    padding: '5px 10px', fontSize: '12px', color: '#1f2937',
    borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0',
  };
  const addBtn = (active: boolean): React.CSSProperties => ({
    background: active ? '#b45309' : '#9ca3af', color: '#fff', border: 'none',
    borderRadius: '3px', width: '36px', height: '28px', fontSize: '14px', fontWeight: 700,
    cursor: active ? 'pointer' : 'not-allowed',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  });

  // Segmented control helper for Yes/No toggles
  const SegmentedControl = ({ label, value, options, onChange, style }: {
    label: string, value: string, options: { label: string, value: string }[], onChange: (val: string) => void, style?: React.CSSProperties
  }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', ...style }}>
      <span style={LBL}>{label}</span>
      <div style={{
        display: 'inline-flex', background: '#f1f5f9', borderRadius: '6px', padding: '2px', border: '1px solid #cfd8e3',
        height: FH, boxSizing: 'border-box', overflow: 'hidden', minWidth: '100px'
      }}>
        {options.map(opt => {
          const active = value === opt.value;
          return (
            <button key={opt.value} onClick={() => isEnabled && onChange(opt.value)} disabled={!isEnabled}
              style={{
                flex: 1, border: 'none', borderRadius: '4px', padding: '0 10px', fontSize: '11px', fontWeight: active ? 700 : 600,
                cursor: isEnabled ? 'pointer' : 'not-allowed', background: active ? '#1e3a8a' : 'transparent',
                color: active ? '#ffffff' : '#64748b', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? '0 1px 3px rgba(30,58,138,0.25)' : 'none'
              }}>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>

      {/* ── Sub-modals ── */}
      <AccountSearchModal isOpen={showFromAccSearch} onClose={() => setShowFromAccSearch(false)} onGet={r => set('fromAccNo', r.accountNo || '')} onSelect={r => set('fromAccNo', r.accountNo || '')} title="Search Account [From]" />
      <AccountSearchModal isOpen={showToAccSearch} onClose={() => setShowToAccSearch(false)} onGet={r => set('toAccNo', r.accountNo || '')} onSelect={r => set('toAccNo', r.accountNo || '')} title="Search Account [To]" />
      <HolderSearchModal isOpen={showFromHldSearch} onClose={() => setShowFromHldSearch(false)} onSelect={(r: HolderRecord) => { set('fromHolderNo', r.holderId); set('fromHolderName', r.holderName); }} />
      <HolderSearchModal isOpen={showToHldSearch} onClose={() => setShowToHldSearch(false)} onSelect={(r: HolderRecord) => { set('toHolderNo', r.holderId); set('toHolderName', r.holderName); }} />
      <EditSearchModal isOpen={showEditSearch} onClose={() => setShowEditSearchSW(false)} title="Edit — Select Switch Record" onSelect={r => set('switchNo', (r as any).transactionNo || '')} />
      <AkctNoSearchModal isOpen={showAkctSearch} onClose={() => setShowAkctSearchSW(false)} onSelect={r => set('switchNo', (r as any).akctNo || '')} />

      {/* ══════════════════════════════════════════════════
          BOX 1 — Header: Switch Code / No / Dates / Inv Type / Remark
          ══════════════════════════════════════════════════ */}
      <div style={{ background: '#ffffff', border: '1.5px solid #bdd5f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 1px 6px rgba(59,130,246,0.07)' }}>

        {/* Row 1: Switch Code | Switch No [E][AKCT NO] | Switch Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 190px', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
          <Field label="Switch Code">
            <TableDropdown
              value={form.switchCode}
              displayValue={form.switchCode ? `${form.switchCode} – ${switchCodeData.find(r => r.code === form.switchCode)?.name || ''}` : ''}
              placeholder="Select"
              columns={[{ key: 'code', header: 'CODE', width: '35%' }, { key: 'name', header: 'NAME', width: '65%' }]}
              rows={switchCodeData} valueKey="code"
              onSelect={row => set('switchCode', row.code)}
              disabled={!isEnabled}
            />
          </Field>
          <Field label="Switch No.">
            <input style={inp({ flex: 1 })} value={form.switchNo} onChange={e => set('switchNo', e.target.value)} disabled={!isEnabled} />
            <button style={iconBtn('#b45309')} onClick={() => isEnabled && setShowEditSearchSW(true)} disabled={!isEnabled}>E</button>
            <button style={txtBtn('#0d7f5a')} onClick={() => isEnabled && setShowAkctSearchSW(true)} disabled={!isEnabled}>AKCT NO</button>
          </Field>
          <Field label="Switch Date">
            <DatePicker selected={switchDate} onChange={d => setSwitchDate(d)} dateFormat="dd/MMM/yyyy" placeholderText="DD/MMM/YYYY" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
          </Field>
        </div>

        {/* Row 2: Investment Type | (spacer) | Price Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 190px', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
          <Field label="Investment Type">
            <TableDropdown
              value={form.invType}
              displayValue={form.invType || ''}
              placeholder="Select"
              columns={[{ key: 'type', header: 'Type', width: '22%' }, { key: 'description', header: 'Description', width: '45%' }, { key: 'agent', header: 'Agent', width: '33%' }]}
              rows={invTypeData as Record<string, string>[]} valueKey="type"
              onSelect={row => set('invType', row.type)}
              disabled={!isEnabled}
            />
          </Field>
          <div />
          <Field label="Price Date">
            <DatePicker selected={priceDate} onChange={d => setPriceDate(d)} dateFormat="dd/MMM/yyyy" placeholderText="DD/MMM/YYYY" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
          </Field>
        </div>

        {/* Row 3: Remark (full width) */}
        <div style={{ marginBottom: '6px' }}>
          <Field label="Remark">
            <input style={inp()} value={form.remark} onChange={e => set('remark', e.target.value)} disabled={!isEnabled} />
          </Field>
        </div>

        {/* Row 4: Reason to Edit (full width) */}
        <div>
          <Field label="Reason to Edit">
            <input style={inp()} value={form.reasonToEdit} onChange={e => set('reasonToEdit', e.target.value)} disabled={!isEnabled} />
          </Field>
        </div>
      </div>

      {/* ── Button Palette ── */}
      <CreationButtonPalette onNew={() => setIsEnabled(true)} onClear={clearForm} />

      {/* ══════════════════════════════════════════════════
          TABBED SECTION — [From] / [To] / Agent Details
          ══════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'visible', flexShrink: 0 }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', background: '#f8fafc', padding: '0 8px', overflowX: 'auto', flexShrink: 0 }}>
          {tabs.map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
              padding: '7px 16px', background: activeTab === tab ? '#ffffff' : 'transparent',
              color: activeTab === tab ? '#1e3a8a' : '#6b7280', border: 'none',
              borderBottom: activeTab === tab ? '2px solid #1e3a8a' : '2px solid transparent',
              marginBottom: '-2px', cursor: 'pointer',
              fontWeight: activeTab === tab ? 700 : 600, fontSize: '12px',
              fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{tab}</button>
          ))}
        </div>

        <div style={{ padding: '14px', overflow: 'visible' }}>

          {/* ══ [From] Tab ══ */}
          {activeTab === '[From]' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* Row 1: Acc No [From] [A] | Fund [From] dropdown + date */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 32px 1fr', gap: '0 8px', alignItems: 'end' }}>
                <Field label="Acc No [From]">
                  <input style={inp()} value={form.fromAccNo} onChange={e => set('fromAccNo', e.target.value)} disabled={!isEnabled} />
                </Field>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
                  <button style={iconBtn('#1e3a8a')} onClick={() => isEnabled && setShowFromAccSearch(true)} disabled={!isEnabled}>A</button>
                </div>
                {/* Fund [From] is read-only display — populated from account selection */}
                <Field label="Fund [From]">
                  <FundDropdown value={form.fromFund} displayValue={form.fromFundName} onSelect={(c, n) => setForm(p => ({ ...p, fromFund: c, fromFundName: n }))} disabled={!isEnabled} />
                  <DatePicker selected={form.fromFundDate ? new Date(form.fromFundDate) : null} onChange={d => set('fromFundDate', d ? d.toISOString() : '')} dateFormat="dd/MMM/yyyy" placeholderText="DD/MMM/YYYY" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
                </Field>
              </div>

              {/* Row 2: Unit Holder [From] [H] [Holder Name] */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 32px 1fr', gap: '0 8px', alignItems: 'end' }}>
                <Field label="Unit Holder [From]">
                  <input style={inp()} value={form.fromHolderNo} onChange={e => set('fromHolderNo', e.target.value)} disabled={!isEnabled} />
                </Field>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
                  <button style={iconBtn('#7c3aed')} onClick={() => isEnabled && setShowFromHldSearch(true)} disabled={!isEnabled}>H</button>
                </div>
                <div style={{ flex: 1 }}>
                  <input style={inp({ background: '#f8fafc', color: '#1e3a8a', fontWeight: 600, borderColor: '#cbd5e1' })} value={form.fromHolderName} disabled readOnly />
                </div>
              </div>

              {/* Row 3: No of Unit [From] | Value [From] | Unit Fee Apply | Unit Price Redemption [From] */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 12px', alignItems: 'end' }}>
                <Field label="No of Unit [From]">
                  <input type="number" style={inp()} value={form.fromNoOfUnits} onChange={e => set('fromNoOfUnits', e.target.value)} disabled={!isEnabled} />
                </Field>
                <Field label="Value [From]">
                  <input type="number" style={inp()} value={form.fromValue} onChange={e => set('fromValue', e.target.value)} disabled={!isEnabled} />
                </Field>

                <SegmentedControl
                  label="Unit Fee Apply"
                  value={form.unitFeeApply}
                  options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
                  onChange={val => set('unitFeeApply', val)}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#000' }}>Unit Price</span>
                  <Field label="Redemption [From]">
                    <input type="number" style={inp()} value={form.unitPriceRedemptionFrom} onChange={e => set('unitPriceRedemptionFrom', e.target.value)} disabled={!isEnabled} />
                  </Field>
                </div>
              </div>

              {/* Row 4: Agent From | Unit Linked Details — Policy No | Unit to Auto Redeem | Amount */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 12px', alignItems: 'end' }}>
                <Field label="Agent From">
                  <TableDropdown
                    value={form.fromAgent}
                    displayValue={form.fromAgent ? `${form.fromAgent} – ${agentTableData.find(r => r.agent_code === form.fromAgent)?.agent_name || ''}` : ''}
                    placeholder="Select Agent"
                    columns={[{ key: 'agent_code', header: 'Code', width: '28%' }, { key: 'agent_name', header: 'Name', width: '40%' }, { key: 'agency_code', header: 'Agency', width: '32%' }]}
                    rows={agentTableData} valueKey="agent_code"
                    onSelect={row => set('fromAgent', row.agent_code)}
                    disabled={!isEnabled}
                  />
                </Field>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ ...LBL, color: '#374151' }}>Unit Linked Details</span>
                  <Field label="Policy No :">
                    <input style={inp()} value={form.policyNoFrom} onChange={e => set('policyNoFrom', e.target.value)} disabled={!isEnabled} />
                  </Field>
                </div>
                <Field label="Unit to Auto Redeem">
                  <input type="number" style={inp()} value={form.unitToAutoRedeemFrom} onChange={e => set('unitToAutoRedeemFrom', e.target.value)} disabled={!isEnabled} />
                  <button style={addBtn(isEnabled && !!form.unitToAutoRedeemFrom)} onClick={() => { }} disabled={!isEnabled || !form.unitToAutoRedeemFrom} title="Add">▼</button>
                </Field>
                <Field label="Amount">
                  <input type="number" style={inp()} value={form.amountFrom} onChange={e => set('amountFrom', e.target.value)} disabled={!isEnabled} />
                  <button style={addBtn(isEnabled && !!form.amountFrom)} onClick={() => { }} disabled={!isEnabled || !form.amountFrom} title="Add">▼</button>
                </Field>
              </div>
            </div>
          )}

          {/* ══ [To] Tab ══ */}
          {activeTab === '[To]' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* Row 1: Acc No [To] [A] | Fund [To] + date */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 32px 1fr', gap: '0 8px', alignItems: 'end' }}>
                <Field label="Acc No [To]">
                  <input style={inp()} value={form.toAccNo} onChange={e => set('toAccNo', e.target.value)} disabled={!isEnabled} />
                </Field>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
                  <button style={iconBtn('#1e3a8a')} onClick={() => isEnabled && setShowToAccSearch(true)} disabled={!isEnabled}>A</button>
                </div>
                <Field label="Fund [To]">
                  <FundDropdown value={form.toFund} displayValue={form.toFundName} onSelect={(c, n) => setForm(p => ({ ...p, toFund: c, toFundName: n }))} disabled={!isEnabled} />
                  <DatePicker selected={form.toFundDate ? new Date(form.toFundDate) : null} onChange={d => set('toFundDate', d ? d.toISOString() : '')} dateFormat="dd/MMM/yyyy" placeholderText="DD/MMM/YYYY" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
                </Field>
              </div>

              {/* Row 2: Unit Holder No [To] [H] [Holder Name] */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 32px 1fr', gap: '0 8px', alignItems: 'end' }}>
                <Field label="Unit Holder No [To]">
                  <input style={inp()} value={form.toHolderNo} onChange={e => set('toHolderNo', e.target.value)} disabled={!isEnabled} />
                </Field>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
                  <button style={iconBtn('#7c3aed')} onClick={() => isEnabled && setShowToHldSearch(true)} disabled={!isEnabled}>H</button>
                </div>
                <div style={{ flex: 1 }}>
                  <input style={inp({ background: '#f8fafc', color: '#1e3a8a', fontWeight: 600, borderColor: '#cbd5e1' })} value={form.toHolderName} disabled readOnly />
                </div>
              </div>

              {/* Row 3: No of Unit [To] | Value [To] | Unit Fee Apply | Unit Price Creation [To] */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 12px', alignItems: 'end' }}>
                <Field label="No of Unit [To]">
                  <input type="number" style={inp()} value={form.toNoOfUnits} onChange={e => set('toNoOfUnits', e.target.value)} disabled={!isEnabled} />
                </Field>
                <Field label="Value [To]">
                  <input type="number" style={inp()} value={form.toValue} onChange={e => set('toValue', e.target.value)} disabled={!isEnabled} />
                </Field>

                <SegmentedControl
                  label="Unit Fee Apply"
                  value={form.unitFeeApplyTo}
                  options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
                  onChange={val => set('unitFeeApplyTo', val)}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#000' }}>Unit Price</span>
                  <Field label="Creation [To]">
                    <input type="number" style={inp()} value={form.unitPriceCreationTo} onChange={e => set('unitPriceCreationTo', e.target.value)} disabled={!isEnabled} />
                  </Field>
                </div>
              </div>

              {/* Row 4: Agent To | Unit Linked Details — Policy No | Unit to Auto Redeem | Amount */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 12px', alignItems: 'end' }}>
                <Field label="Agent To">
                  <TableDropdown
                    value={form.toAgent}
                    displayValue={form.toAgent ? `${form.toAgent} – ${agentTableData.find(r => r.agent_code === form.toAgent)?.agent_name || ''}` : ''}
                    placeholder="Select Agent"
                    columns={[{ key: 'agent_code', header: 'Code', width: '28%' }, { key: 'agent_name', header: 'Name', width: '40%' }, { key: 'agency_code', header: 'Agency', width: '32%' }]}
                    rows={agentTableData} valueKey="agent_code"
                    onSelect={row => set('toAgent', row.agent_code)}
                    disabled={!isEnabled}
                  />
                </Field>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ ...LBL, color: '#374151' }}>Unit Linked Details</span>
                  <Field label="Policy No :">
                    <input style={inp()} value={form.policyNoTo} onChange={e => set('policyNoTo', e.target.value)} disabled={!isEnabled} />
                  </Field>
                </div>
                <Field label="Unit to Auto Redeem">
                  <input type="number" style={inp()} value={form.unitToAutoRedeemTo} onChange={e => set('unitToAutoRedeemTo', e.target.value)} disabled={!isEnabled} />
                  <button style={addBtn(isEnabled && !!form.unitToAutoRedeemTo)} onClick={() => { }} disabled={!isEnabled || !form.unitToAutoRedeemTo} title="Add">▼</button>
                </Field>
                <Field label="Amount">
                  <input type="number" style={inp()} value={form.amountTo} onChange={e => set('amountTo', e.target.value)} disabled={!isEnabled} />
                  <button style={addBtn(isEnabled && !!form.amountTo)} onClick={() => { }} disabled={!isEnabled || !form.amountTo} title="Add">▼</button>
                </Field>
              </div>

              <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe', fontSize: '12px', color: '#1d4ed8' }}>
                <span style={{ fontWeight: 700 }}>ℹ️ Note:</span> The [To] fund will receive the switched units. Ensure the target fund is active and accepts new investments before proceeding.
              </div>
            </div>
          )}

          {/* ══ Agent Details Tab ══ */}
          {activeTab === 'Agent Details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {/* Agents From */}
              <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0 }}>
                <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Agents From</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown
                        value={form.agency}
                        displayValue={form.agency ? `${form.agency} – ${agencyTableData.find(r => r.agency_code === form.agency)?.agency_name || ''}` : ''}
                        placeholder=""
                        columns={[{ key: 'agency_code', header: 'Agency Code', width: '40%' }, { key: 'agency_name', header: 'Agency Name', width: '60%' }]}
                        rows={agencyTableData} valueKey="agency_code"
                        onSelect={row => set('agency', row.agency_code)}
                        disabled={!isEnabled}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Sub Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown
                        value={form.subAgency}
                        displayValue={form.subAgency ? `${form.subAgency} – ${subAgencyTableData.find(r => r.subagent_code === form.subAgency)?.subagent_name || ''}` : ''}
                        placeholder=""
                        columns={[{ key: 'subagent_code', header: 'Sub Agency Code', width: '40%' }, { key: 'subagent_name', header: 'Sub Agency Name', width: '60%' }]}
                        rows={subAgencyTableData} valueKey="subagent_code"
                        onSelect={row => set('subAgency', row.subagent_code)}
                        disabled={!isEnabled}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agent</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown
                        value={form.agent}
                        displayValue={form.agent ? `${form.agent} – ${agentTableData.find(r => r.agent_code === form.agent)?.agent_name || ''}` : ''}
                        placeholder=""
                        columns={[{ key: 'agent_code', header: 'Agent Code', width: '25%' }, { key: 'agent_name', header: 'Agent Name', width: '35%' }, { key: 'agency_code', header: 'Agency', width: '20%' }, { key: 'sub_agency_code', header: 'Sub Agency', width: '20%' }]}
                        rows={agentTableData} valueKey="agent_code"
                        onSelect={row => set('agent', row.agent_code)}
                        disabled={!isEnabled}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Agents To */}
              <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0 }}>
                <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Agents To</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown
                        value={form.toAgency}
                        displayValue={form.toAgency ? `${form.toAgency} – ${agencyTableData.find(r => r.agency_code === form.toAgency)?.agency_name || ''}` : ''}
                        placeholder=""
                        columns={[{ key: 'agency_code', header: 'Agency Code', width: '40%' }, { key: 'agency_name', header: 'Agency Name', width: '60%' }]}
                        rows={agencyTableData} valueKey="agency_code"
                        onSelect={row => set('toAgency', row.agency_code)}
                        disabled={!isEnabled}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Sub Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown
                        value={form.toSubAgency}
                        displayValue={form.toSubAgency ? `${form.toSubAgency} – ${subAgencyTableData.find(r => r.subagent_code === form.toSubAgency)?.subagent_name || ''}` : ''}
                        placeholder=""
                        columns={[{ key: 'subagent_code', header: 'Sub Agency Code', width: '40%' }, { key: 'subagent_name', header: 'Sub Agency Name', width: '60%' }]}
                        rows={subAgencyTableData} valueKey="subagent_code"
                        onSelect={row => set('toSubAgency', row.subagent_code)}
                        disabled={!isEnabled}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agent</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown
                        value={form.toAgent}
                        displayValue={form.toAgent ? `${form.toAgent} – ${agentTableData.find(r => r.agent_code === form.toAgent)?.agent_name || ''}` : ''}
                        placeholder=""
                        columns={[{ key: 'agent_code', header: 'Agent Code', width: '25%' }, { key: 'agent_name', header: 'Agent Name', width: '35%' }, { key: 'agency_code', header: 'Agency', width: '20%' }, { key: 'sub_agency_code', header: 'Sub Agency', width: '20%' }]}
                        rows={agentTableData} valueKey="agent_code"
                        onSelect={row => set('toAgent', row.agent_code)}
                        disabled={!isEnabled}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          )}

          {/* ── Bottom sub-tabs: Certificates / UFD Out / UFD In ── */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', marginTop: '12px' }}>
            {/* Sub-tab bar */}
            <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
              {bottomTabs.map(bt => (
                <button key={bt} type="button" onClick={() => setBottomTab(bt)} style={{
                  padding: '6px 14px', background: bottomTab === bt ? '#fff' : 'transparent',
                  color: bottomTab === bt ? '#1e3a8a' : '#6b7280', border: 'none',
                  borderBottom: bottomTab === bt ? '2px solid #1e3a8a' : '2px solid transparent',
                  cursor: 'pointer', fontWeight: bottomTab === bt ? 700 : 600,
                  fontSize: '11px', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}>{bt}</button>
              ))}
            </div>

            <div style={{ padding: '10px' }}>

              {/* ── Certificates ── */}
              {bottomTab === 'Certificates' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr)) 36px', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                    {(['certNo', 'availableUnits', 'switchUnits', 'balanceUnits', 'certAmount', 'blockedUnits'] as const).map((f, i) => (
                      <input key={f} className="setup-input-field" type={i > 0 ? 'number' : 'text'}
                        value={(form as any)[f]}
                        onChange={e => {
                          set(f, e.target.value);
                          if (f === 'switchUnits') {
                            const avail = parseFloat(form.availableUnits) || 0;
                            set('balanceUnits', (avail - (parseFloat(e.target.value) || 0)).toString());
                          }
                        }}
                        style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                        disabled={!isEnabled}
                        placeholder={['Certificate No', 'Available Units', 'Switch Units', 'Balance Units', 'Amount', 'Blocked Units'][i]}
                      />
                    ))}
                    <button
                      onClick={() => {
                        if (!isEnabled || !form.certNo) return;
                        setCertRows(p => [...p, { certificateNo: form.certNo, availableUnits: form.availableUnits, switchUnits: form.switchUnits, balanceUnits: form.balanceUnits, amount: form.certAmount, blockedUnits: form.blockedUnits }]);
                        setForm(p => ({ ...p, certNo: '', availableUnits: '', switchUnits: '', balanceUnits: '', certAmount: '', blockedUnits: '' }));
                      }}
                      disabled={!isEnabled || !form.certNo}
                      style={addBtn(isEnabled && !!form.certNo)} title="Add"
                    >▼</button>
                  </div>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr>
                          {['Certificate No', 'Available Units', 'Switch Units', 'Balance Units', 'Amount', 'Blocked Units'].map((h, i, arr) => (
                            <th key={h} style={{ ...thSt, borderRight: i < arr.length - 1 ? '1px solid #e2e8f0' : 'none' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {certRows.length === 0
                          ? <tr><td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No records</td></tr>
                          : certRows.map((r, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                              <td style={tdSt}>{r.certificateNo}</td>
                              <td style={tdSt}>{r.availableUnits}</td>
                              <td style={tdSt}>{r.switchUnits}</td>
                              <td style={tdSt}>{r.balanceUnits}</td>
                              <td style={tdSt}>{r.amount}</td>
                              <td style={{ ...tdSt, borderRight: 'none' }}>{r.blockedUnits}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Unit Fee Discounting Out ── */}
              {bottomTab === 'Unit Fee Discounting Out' && (
                <div>
                  {/* Headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,3.5fr) minmax(0,1fr) 40px minmax(0,1.2fr) 26px', gap: '6px', marginBottom: '2px' }}>
                    <div style={{ border: '1px solid #475569', textAlign: 'center', fontSize: '11px', padding: '1px 0', background: '#fff', color: '#000' }}>Fee Code</div>
                    <div style={{ border: '1px solid #475569', textAlign: 'center', fontSize: '11px', padding: '1px 0', background: '#fff', color: '#000' }}>Description</div>
                    <div style={{ border: '1px solid #475569', textAlign: 'center', fontSize: '11px', padding: '1px 0', background: '#fff', color: '#000' }}>Amount</div>
                    <div style={{ border: '1px solid #475569', textAlign: 'center', fontSize: '11px', padding: '1px 0', background: '#fff', color: '#000' }}>%</div>
                    <div style={{ border: '1px solid #475569', textAlign: 'center', fontSize: '11px', padding: '1px 0', background: '#fff', color: '#000' }}>New Amount</div>
                    <div />
                  </div>

                  {/* Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,3.5fr) minmax(0,1fr) 40px minmax(0,1.2fr) 26px', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                    <select value={form.ufdOutFeeCode}
                      onChange={e => {
                        const sel = unitFeeCodeData.find(f => f.code === e.target.value);
                        set('ufdOutFeeCode', e.target.value);
                        if (sel) set('ufdOutDescription', sel.description);
                      }}
                      style={{ width: '100%', height: '20px', background: '#e2e8f0', border: 'none', outline: 'none', fontSize: '11px', padding: '0 4px', boxSizing: 'border-box' }} disabled={!isEnabled}>
                      <option value=""></option>
                      {unitFeeCodeData.map(f => <option key={f.code} value={f.code}>{f.code}</option>)}
                    </select>
                    <input value={form.ufdOutDescription} onChange={e => set('ufdOutDescription', e.target.value)} style={{ width: '100%', height: '20px', background: '#e2e8f0', border: 'none', outline: 'none', fontSize: '11px', padding: '0 4px', boxSizing: 'border-box' }} disabled={!isEnabled} />
                    <input type="number" value={form.ufdOutAmount} onChange={e => set('ufdOutAmount', e.target.value)} style={{ width: '100%', height: '20px', background: '#e2e8f0', border: 'none', outline: 'none', fontSize: '11px', padding: '0 4px', boxSizing: 'border-box' }} disabled={!isEnabled} />
                    <input type="number" value={form.ufdOutPct} onChange={e => set('ufdOutPct', e.target.value)} style={{ width: '100%', height: '20px', background: '#e2e8f0', border: 'none', outline: 'none', fontSize: '11px', padding: '0 4px', boxSizing: 'border-box' }} disabled={!isEnabled} />
                    <input type="number" value={form.ufdOutNewAmount} onChange={e => set('ufdOutNewAmount', e.target.value)} style={{ width: '100%', height: '20px', background: '#e2e8f0', border: 'none', outline: 'none', fontSize: '11px', padding: '0 4px', boxSizing: 'border-box' }} disabled={!isEnabled} />
                    <button onClick={() => {
                      if (!isEnabled || !form.ufdOutFeeCode) return;
                      setUfdOutRows(p => [...p, { feeCode: form.ufdOutFeeCode, description: form.ufdOutDescription, amount: form.ufdOutAmount, pct: form.ufdOutPct, newAmount: form.ufdOutNewAmount }]);
                      setForm(p => ({ ...p, ufdOutFeeCode: '', ufdOutDescription: '', ufdOutAmount: '', ufdOutPct: '', ufdOutNewAmount: '' }));
                    }} disabled={!isEnabled || !form.ufdOutFeeCode}
                      style={{ height: '20px', width: '100%', background: 'linear-gradient(to bottom, #fde047, #eab308)', border: '1px solid #ca8a04', borderRadius: '3px', color: '#000', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isEnabled && !!form.ufdOutFeeCode ? 'pointer' : 'not-allowed', padding: 0 }} title="Add">▼</button>
                  </div>

                  {/* Display Table/Box */}
                  <div style={{ background: '#f1f5f9', border: '1px solid #94a3b8', minHeight: '120px', width: '100%', boxSizing: 'border-box' }}>
                    {ufdOutRows.length > 0 && (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <tbody>
                          {ufdOutRows.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #cbd5e1' }}>
                              <td style={{ padding: '4px', width: '18%' }}>{r.feeCode}</td>
                              <td style={{ padding: '4px', width: '40%' }}>{r.description}</td>
                              <td style={{ padding: '4px', width: '15%' }}>{r.amount}</td>
                              <td style={{ padding: '4px', width: '8%' }}>{r.pct}</td>
                              <td style={{ padding: '4px', width: '15%' }}>{r.newAmount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* ── Unit Fee Discounting In ── */}
              {bottomTab === 'Unit Fee Discounting In' && (
                <div>
                  {/* Headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,3.5fr) minmax(0,1fr) 40px minmax(0,1.2fr) 26px', gap: '6px', marginBottom: '2px' }}>
                    <div style={{ border: '1px solid #475569', textAlign: 'center', fontSize: '11px', padding: '1px 0', background: '#fff', color: '#000' }}>Fee Code</div>
                    <div style={{ border: '1px solid #475569', textAlign: 'center', fontSize: '11px', padding: '1px 0', background: '#fff', color: '#000' }}>Description</div>
                    <div style={{ border: '1px solid #475569', textAlign: 'center', fontSize: '11px', padding: '1px 0', background: '#fff', color: '#000' }}>Amount</div>
                    <div style={{ border: '1px solid #475569', textAlign: 'center', fontSize: '11px', padding: '1px 0', background: '#fff', color: '#000' }}>%</div>
                    <div style={{ border: '1px solid #475569', textAlign: 'center', fontSize: '11px', padding: '1px 0', background: '#fff', color: '#000' }}>New Amount</div>
                    <div />
                  </div>

                  {/* Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,3.5fr) minmax(0,1fr) 40px minmax(0,1.2fr) 26px', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                    <select value={form.ufdInFeeCode}
                      onChange={e => {
                        const sel = unitFeeCodeData.find(f => f.code === e.target.value);
                        set('ufdInFeeCode', e.target.value);
                        if (sel) set('ufdInDescription', sel.description);
                      }}
                      style={{ width: '100%', height: '20px', background: '#e2e8f0', border: 'none', outline: 'none', fontSize: '11px', padding: '0 4px', boxSizing: 'border-box' }} disabled={!isEnabled}>
                      <option value=""></option>
                      {unitFeeCodeData.map(f => <option key={f.code} value={f.code}>{f.code}</option>)}
                    </select>
                    <input value={form.ufdInDescription} onChange={e => set('ufdInDescription', e.target.value)} style={{ width: '100%', height: '20px', background: '#e2e8f0', border: 'none', outline: 'none', fontSize: '11px', padding: '0 4px', boxSizing: 'border-box' }} disabled={!isEnabled} />
                    <input type="number" value={form.ufdInAmount} onChange={e => set('ufdInAmount', e.target.value)} style={{ width: '100%', height: '20px', background: '#e2e8f0', border: 'none', outline: 'none', fontSize: '11px', padding: '0 4px', boxSizing: 'border-box' }} disabled={!isEnabled} />
                    <input type="number" value={form.ufdInPct} onChange={e => set('ufdInPct', e.target.value)} style={{ width: '100%', height: '20px', background: '#e2e8f0', border: 'none', outline: 'none', fontSize: '11px', padding: '0 4px', boxSizing: 'border-box' }} disabled={!isEnabled} />
                    <input type="number" value={form.ufdInNewAmount} onChange={e => set('ufdInNewAmount', e.target.value)} style={{ width: '100%', height: '20px', background: '#e2e8f0', border: 'none', outline: 'none', fontSize: '11px', padding: '0 4px', boxSizing: 'border-box' }} disabled={!isEnabled} />
                    <button onClick={() => {
                      if (!isEnabled || !form.ufdInFeeCode) return;
                      setUfdInRows(p => [...p, { feeCode: form.ufdInFeeCode, description: form.ufdInDescription, amount: form.ufdInAmount, pct: form.ufdInPct, newAmount: form.ufdInNewAmount }]);
                      setForm(p => ({ ...p, ufdInFeeCode: '', ufdInDescription: '', ufdInAmount: '', ufdInPct: '', ufdInNewAmount: '' }));
                    }} disabled={!isEnabled || !form.ufdInFeeCode}
                      style={{ height: '20px', width: '100%', background: 'linear-gradient(to bottom, #fde047, #eab308)', border: '1px solid #ca8a04', borderRadius: '3px', color: '#000', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isEnabled && !!form.ufdInFeeCode ? 'pointer' : 'not-allowed', padding: 0 }} title="Add">▼</button>
                  </div>

                  {/* Display Table/Box */}
                  <div style={{ background: '#f1f5f9', border: '1px solid #94a3b8', minHeight: '120px', width: '100%', boxSizing: 'border-box' }}>
                    {ufdInRows.length > 0 && (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <tbody>
                          {ufdInRows.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #cbd5e1' }}>
                              <td style={{ padding: '4px', width: '18%' }}>{r.feeCode}</td>
                              <td style={{ padding: '4px', width: '40%' }}>{r.description}</td>
                              <td style={{ padding: '4px', width: '15%' }}>{r.amount}</td>
                              <td style={{ padding: '4px', width: '8%' }}>{r.pct}</td>
                              <td style={{ padding: '4px', width: '15%' }}>{r.newAmount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div >
  );
}

// ========================================
// UNIT TRANSFER/SWITCHING MODAL (COMBINED)
// ========================================
function UnitTransferSwitchingModal({ onClose }: { onClose: () => void }) {
  const [activeType, setActiveType] = useState<'Transfer' | 'Switching'>('Transfer');

  const radioBtnContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '15px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '12px',
    marginBottom: '15px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  };

  const radioOptionStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: active ? '#ffffff' : 'transparent',
    border: active ? '2px solid #3b82f6' : '2px solid transparent',
    boxShadow: active ? '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)' : 'none',
    transform: active ? 'translateY(-2px)' : 'none',
  });

  const radioCircleStyle = (active: boolean): React.CSSProperties => ({
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: `2px solid ${active ? '#3b82f6' : '#94a3b8'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    background: '#fff',
  });

  const radioInnerStyle = (active: boolean): React.CSSProperties => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#3b82f6',
    transform: `scale(${active ? 1 : 0})`,
    transition: 'transform 0.2s ease-in-out',
  });

  const radioLabelStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '14px',
    fontWeight: 700,
    color: active ? '#1e3a8a' : '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={radioBtnContainerStyle}>
        <div
          style={radioOptionStyle(activeType === 'Transfer')}
          onClick={() => setActiveType('Transfer')}
        >
          <div style={radioCircleStyle(activeType === 'Transfer')}>
            <div style={radioInnerStyle(activeType === 'Transfer')} />
          </div>
          <span style={radioLabelStyle(activeType === 'Transfer')}>Unit Transfer</span>
        </div>

        <div
          style={radioOptionStyle(activeType === 'Switching')}
          onClick={() => setActiveType('Switching')}
        >
          <div style={radioCircleStyle(activeType === 'Switching')}>
            <div style={radioInnerStyle(activeType === 'Switching')} />
          </div>
          <span style={radioLabelStyle(activeType === 'Switching')}>Unit Switching</span>
        </div>
      </div>

      <div style={{ transition: 'all 0.3s ease' }}>
        {activeType === 'Transfer' ? (
          <UnitTransferModal onClose={onClose} />
        ) : (
          <UnitSwitchingModal onClose={onClose} />
        )}
      </div>
    </div>
  );
}

// ========================================
// UNIT CONSOLIDATION MODAL
// ========================================
function UnitConsolidationModal({ onClose: _onClose }: { onClose: () => void }) {
  type UCONTab = 'Consolidator [From]' | 'Consolidated [To]' | 'Agent Details';

  const [isEnabled, setIsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<UCONTab>('Consolidator [From]');
  const [consolidationDate, setConsolidationDate] = useState<Date | null>(null);

  const [showFromAccSearch, setShowFromAccSearch] = useState(false);
  const [showFromHldSearch, setShowFromHldSearch] = useState(false);
  const [showToAccSearch, setShowToAccSearch] = useState(false);
  const [showToHldSearch, setShowToHldSearch] = useState(false);
  const [showEditSearch, setShowEditSearch2] = useState(false);
  const [showAkctSearch, setShowAkctSearch2] = useState(false);

  const [certRows, setCertRows] = useState<{
    certificateNo: string; availableUnits: string; consolidateUnits: string;
    balanceUnits: string; amount: string; blockedUnits: string;
  }[]>([]);

  const emptyConsolidationForm = {
    fundCode: '', fundName: '',
    consolidationCode: '', consolidationNo: '',
    invType: '', agentBank: '',
    unitPrice: '', redemption: '',
    remark: '', reasonToEdit: '',
    fromAccNo: '', fromHolderNo: '', fromHolderName: '', fromNoOfUnits: '', fromValue: '',
    toAccNo: '', toHolderNo: '', toHolderName: '', toNoOfUnits: '', toValue: '',
    certNo: '', availableUnits: '', consolidateUnits: '', balanceUnits: '', certAmount: '', blockedUnits: '',
    agency: '', subAgency: '', agent: '',
    toAgency: '', toSubAgency: '', toAgent: '',
  };

  const [consolidationForm, setConsolidationForm] = useState(emptyConsolidationForm);
  const setC = (field: string, value: string) => setConsolidationForm(p => ({ ...p, [field]: value }));

  const clearConsolidationForm = () => {
    setIsEnabled(false);
    setConsolidationDate(null);
    setCertRows([]);
    setConsolidationForm(emptyConsolidationForm);
    setActiveTab('Consolidator [From]');
  };

  const consolidationCodeData: Record<string, string>[] = [
    { code: 'CON001', name: 'Full Consolidation' },
    { code: 'CON002', name: 'Partial Consolidation' },
    { code: 'CON003', name: 'Joint Account Merge' },
    { code: 'CON004', name: 'Estate Consolidation' },
    { code: 'CON005', name: 'Corporate Consolidation' },
    { code: 'CON006', name: 'Family Account Merge' },
  ];

  const tabs: UCONTab[] = ['Consolidator [From]', 'Consolidated [To]', 'Agent Details'];

  const fieldH2 = 28;
  const inp2 = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: fieldH2, padding: '0 8px', fontSize: '12px',
    border: '1px solid #cfd8e3', borderRadius: '5px',
    background: isEnabled ? '#ffffff' : '#f0f4f8',
    color: '#1e293b', outline: 'none', width: '100%',
    boxSizing: 'border-box' as const,
    cursor: isEnabled ? 'text' : 'not-allowed',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    ...extra,
  });
  const LBL2: React.CSSProperties = {
    fontSize: '10px', fontWeight: 700, color: '#5a6a85',
    textTransform: 'uppercase' as const, letterSpacing: '0.06em',
    whiteSpace: 'nowrap' as const,
  };
  const iconBtn2 = (bg: string): React.CSSProperties => ({
    height: fieldH2, minWidth: 26, padding: '0 4px', flexShrink: 0,
    background: isEnabled ? bg : '#b0bec5',
    color: '#fff', border: 'none', borderRadius: '5px',
    fontSize: '10px', fontWeight: 800,
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: isEnabled ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
  });
  const txtBtn2 = (bg: string): React.CSSProperties => ({
    height: fieldH2, padding: '0 10px', flexShrink: 0,
    background: isEnabled ? bg : '#b0bec5',
    color: '#fff', border: 'none', borderRadius: '5px',
    fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' as const,
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    boxShadow: isEnabled ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
  });
  const Field2 = ({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', ...style }}>
      <span style={LBL2}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{children}</div>
    </div>
  );
  const thStyle2: React.CSSProperties = {
    padding: '6px 10px', background: '#f1f5f9', fontWeight: 700, fontSize: '11px',
    color: '#374151', textAlign: 'left', borderBottom: '2px solid #cbd5e1',
    borderRight: '1px solid #e2e8f0', whiteSpace: 'nowrap',
  };
  const tdStyle2: React.CSSProperties = {
    padding: '5px 10px', fontSize: '12px', color: '#1f2937',
    borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0',
  };

  const ConHolderPanel = ({ side }: { side: 'from' | 'to' }) => {
    const accKey = side === 'from' ? 'fromAccNo' : 'toAccNo';
    const hldKey = side === 'from' ? 'fromHolderNo' : 'toHolderNo';
    const unitsKey = side === 'from' ? 'fromNoOfUnits' : 'toNoOfUnits';
    const valKey = side === 'from' ? 'fromValue' : 'toValue';
    const label = side === 'from' ? 'From' : 'To';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '25% 25% 49%', gap: '0 8px', alignItems: 'end' }}>
          <Field2 label={`Acc No [ ${label} ]`}>
            <input style={inp2()} value={(consolidationForm as any)[accKey]} onChange={e => setC(accKey, e.target.value)} disabled={!isEnabled} />
            <button style={iconBtn2('#1e3a8a')} onClick={() => isEnabled && (side === 'from' ? setShowFromAccSearch(true) : setShowToAccSearch(true))} disabled={!isEnabled}>A</button>
          </Field2>
          <Field2 label={`Holder No. [ ${label} ]`}>
            <input style={inp2()} value={(consolidationForm as any)[hldKey]} onChange={e => setC(hldKey, e.target.value)} disabled={!isEnabled} />
            <button style={iconBtn2('#7c3aed')} onClick={() => isEnabled && (side === 'from' ? setShowFromHldSearch(true) : setShowToHldSearch(true))} disabled={!isEnabled}>H</button>
          </Field2>
          <Field2 label={`Holder Name [ ${label} ]`}>
            <input style={inp2({ background: '#f8fafc', color: '#1e3a8a', fontWeight: 600, borderColor: '#cbd5e1' })} value={(consolidationForm as any)[side === 'from' ? 'fromHolderName' : 'toHolderName']} disabled readOnly />
          </Field2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', alignItems: 'end' }}>
          <Field2 label={`No of Unit [ ${label} ]`}>
            <input type="number" style={inp2()} value={(consolidationForm as any)[unitsKey]} onChange={e => setC(unitsKey, e.target.value)} disabled={!isEnabled} />
          </Field2>
          <Field2 label={`Value  [ ${label} ]`}>
            <input type="number" style={inp2()} value={(consolidationForm as any)[valKey]} onChange={e => setC(valKey, e.target.value)} disabled={!isEnabled} />
          </Field2>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>

      <AccountSearchModal isOpen={showFromAccSearch} onClose={() => setShowFromAccSearch(false)} onGet={r => setC('fromAccNo', r.accountNo || '')} onSelect={r => setC('fromAccNo', r.accountNo || '')} title="Search Account [From]" />
      <AccountSearchModal isOpen={showToAccSearch} onClose={() => setShowToAccSearch(false)} onGet={r => setC('toAccNo', r.accountNo || '')} onSelect={r => setC('toAccNo', r.accountNo || '')} title="Search Account [To]" />
      <HolderSearchModal isOpen={showFromHldSearch} onClose={() => setShowFromHldSearch(false)} onSelect={(r: HolderRecord) => { setC('fromHolderNo', r.holderId); setC('fromHolderName', r.holderName); }} />
      <HolderSearchModal isOpen={showToHldSearch} onClose={() => setShowToHldSearch(false)} onSelect={(r: HolderRecord) => { setC('toHolderNo', r.holderId); setC('toHolderName', r.holderName); }} />
      <EditSearchModal isOpen={showEditSearch} onClose={() => setShowEditSearch2(false)} title="Edit — Select Consolidation Record" onSelect={r => setC('consolidationNo', (r as any).transactionNo || '')} />
      <AkctNoSearchModal isOpen={showAkctSearch} onClose={() => setShowAkctSearch2(false)} onSelect={r => setC('consolidationNo', (r as any).akctNo || '')} />

      {/* Header fields */}
      <div style={{ background: '#ffffff', border: '1.5px solid #bdd5f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 1px 6px rgba(59,130,246,0.07)' }}>

        {/* Row 1: Fund + AKCT NO + Consolidation Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 200px', gap: '0 10px', marginBottom: '8px', alignItems: 'end' }}>
          <Field2 label="Fund">
            <FundDropdown value={consolidationForm.fundCode} displayValue={consolidationForm.fundName} onSelect={(c, n) => setConsolidationForm(p => ({ ...p, fundCode: c, fundName: n }))} disabled={!isEnabled} />
          </Field2>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
            <button style={txtBtn2('#0d7f5a')} onClick={() => isEnabled && setShowAkctSearch2(true)} disabled={!isEnabled}>AKCT NO</button>
          </div>
          <Field2 label="Consolidation Date">
            <DatePicker selected={consolidationDate} onChange={d => setConsolidationDate(d)} dateFormat="dd/MMM/yyyy" placeholderText="DD/MMM/YYYY" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
          </Field2>
        </div>

        {/* Row 2: Consolidation Code | Consolidation No [E] | Unit Price + Redemption */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
          <Field2 label="Consolidation Code">
            <TableDropdown value={consolidationForm.consolidationCode} displayValue={consolidationForm.consolidationCode ? `${consolidationForm.consolidationCode} – ${consolidationCodeData.find(r => r.code === consolidationForm.consolidationCode)?.name || ''}` : ''} placeholder="Select Consolidation Code" columns={[{ key: 'code', header: 'CODE', width: '35%' }, { key: 'name', header: 'NAME', width: '65%' }]} rows={consolidationCodeData} valueKey="code" onSelect={row => setC('consolidationCode', row.code)} disabled={!isEnabled} />
          </Field2>
          <Field2 label="Consolidation No.">
            <input style={inp2({ flex: 1 })} value={consolidationForm.consolidationNo} onChange={e => setC('consolidationNo', e.target.value)} disabled={!isEnabled} />
            <button style={iconBtn2('#b45309')} onClick={() => isEnabled && setShowEditSearch2(true)} disabled={!isEnabled}>E</button>
          </Field2>
          {/* Unit Price block */}
          <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0, height: '100%', boxSizing: 'border-box' }}>
            <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Unit Price</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: '#1d4ed8' }}>Redemption</span>
              <input type="number" style={inp2()} value={consolidationForm.redemption} onChange={e => setC('redemption', e.target.value)} disabled={!isEnabled} />
            </div>
          </fieldset>
        </div>

        {/* Row 3: Investment Type | Agent/Bank */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
          <Field2 label="Investment Type">
            <TableDropdown value={consolidationForm.invType} displayValue={consolidationForm.invType || ''} placeholder="Select" columns={[{ key: 'type', header: 'Type', width: '22%' }, { key: 'description', header: 'Description', width: '45%' }, { key: 'agent', header: 'Agent', width: '33%' }]} rows={invTypeData as Record<string, string>[]} valueKey="type" onSelect={row => setC('invType', row.type)} disabled={!isEnabled} />
          </Field2>
          <Field2 label="Agent / Bank">
            <TableDropdown value={consolidationForm.agentBank} displayValue={consolidationForm.agentBank ? `${consolidationForm.agentBank} – ${agentBankData.find(r => r.agentCode === consolidationForm.agentBank)?.agentDescription || ''}` : ''} placeholder="Select Agent / Bank" columns={[{ key: 'agentCode', header: 'Agent Code', width: '35%' }, { key: 'agentDescription', header: 'Agent Description', width: '65%' }]} rows={agentBankData} valueKey="agentCode" onSelect={row => setC('agentBank', row.agentCode)} disabled={!isEnabled} />
          </Field2>
        </div>

        {/* Row 4: Remark */}
        <div style={{ marginBottom: '6px' }}>
          <Field2 label="Remark">
            <input style={inp2()} value={consolidationForm.remark} onChange={e => setC('remark', e.target.value)} disabled={!isEnabled} />
          </Field2>
        </div>

        {/* Row 5: Reason to Edit */}
        <div>
          <Field2 label="Reason to Edit">
            <input style={inp2()} value={consolidationForm.reasonToEdit} onChange={e => setC('reasonToEdit', e.target.value)} disabled={!isEnabled} />
          </Field2>
        </div>
      </div>

      {/* Button Palette */}
      <CreationButtonPalette onNew={() => setIsEnabled(true)} onClear={clearConsolidationForm} />

      {/* Tabbed Bottom Section */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', minHeight: '280px', flexShrink: 0 }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', flexShrink: 0, background: '#f8fafc', padding: '0 8px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
              padding: '7px 14px',
              background: activeTab === tab ? '#ffffff' : 'transparent',
              color: activeTab === tab ? '#1e3a8a' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #1e3a8a' : '2px solid transparent',
              marginBottom: '-2px', cursor: 'pointer',
              fontWeight: activeTab === tab ? 700 : 600, fontSize: '12px',
              fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{tab}</button>
          ))}
        </div>

        <div style={{ padding: '14px', overflowY: 'auto', minHeight: '200px' }}>

          {/* Consolidator [From] */}
          {activeTab === 'Consolidator [From]' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <ConHolderPanel side="from" />
            </div>
          )}

          {/* Consolidated [To] */}
          {activeTab === 'Consolidated [To]' && (
            <div>
              <ConHolderPanel side="to" />
              <div style={{ marginTop: '12px', padding: '10px', background: '#fefce8', borderRadius: '6px', border: '1px solid #fde68a', fontSize: '12px', color: '#92400e' }}>
                <span style={{ fontWeight: 700 }}>ℹ️ Note:</span> The Consolidated (To) account will receive all units being merged from the Consolidator (From) account. Ensure both accounts belong to the same unit holder before proceeding.
              </div>
            </div>
          )}

          {/* Agent Details */}
          {activeTab === 'Agent Details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0 }}>
                <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Agents From</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={consolidationForm.agency} displayValue={consolidationForm.agency ? `${consolidationForm.agency} – ${agencyTableData.find(r => r.agency_code === consolidationForm.agency)?.agency_name || ''}` : ''} placeholder="" columns={[{ key: 'agency_code', header: 'Agency Code', width: '40%' }, { key: 'agency_name', header: 'Agency Name', width: '60%' }]} rows={agencyTableData} valueKey="agency_code" onSelect={row => setC('agency', row.agency_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Sub Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={consolidationForm.subAgency} displayValue={consolidationForm.subAgency ? `${consolidationForm.subAgency} – ${subAgencyTableData.find(r => r.subagent_code === consolidationForm.subAgency)?.subagent_name || ''}` : ''} placeholder="" columns={[{ key: 'subagent_code', header: 'Sub Agency Code', width: '40%' }, { key: 'subagent_name', header: 'Sub Agency Name', width: '60%' }]} rows={subAgencyTableData} valueKey="subagent_code" onSelect={row => setC('subAgency', row.subagent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agent</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={consolidationForm.agent} displayValue={consolidationForm.agent ? `${consolidationForm.agent} – ${agentTableData.find(r => r.agent_code === consolidationForm.agent)?.agent_name || ''}` : ''} placeholder="" columns={[{ key: 'agent_code', header: 'Agent Code', width: '25%' }, { key: 'agent_name', header: 'Agent Name', width: '35%' }, { key: 'agency_code', header: 'Agency', width: '20%' }, { key: 'sub_agency_code', header: 'Sub Agency', width: '20%' }]} rows={agentTableData} valueKey="agent_code" onSelect={row => setC('agent', row.agent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0 }}>
                <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Agents To</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={consolidationForm.toAgency} displayValue={consolidationForm.toAgency ? `${consolidationForm.toAgency} – ${agencyTableData.find(r => r.agency_code === consolidationForm.toAgency)?.agency_name || ''}` : ''} placeholder="" columns={[{ key: 'agency_code', header: 'Agency Code', width: '40%' }, { key: 'agency_name', header: 'Agency Name', width: '60%' }]} rows={agencyTableData} valueKey="agency_code" onSelect={row => setC('toAgency', row.agency_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Sub Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={consolidationForm.toSubAgency} displayValue={consolidationForm.toSubAgency ? `${consolidationForm.toSubAgency} – ${subAgencyTableData.find(r => r.subagent_code === consolidationForm.toSubAgency)?.subagent_name || ''}` : ''} placeholder="" columns={[{ key: 'subagent_code', header: 'Sub Agency Code', width: '40%' }, { key: 'subagent_name', header: 'Sub Agency Name', width: '60%' }]} rows={subAgencyTableData} valueKey="subagent_code" onSelect={row => setC('toSubAgency', row.subagent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agent</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={consolidationForm.toAgent} displayValue={consolidationForm.toAgent ? `${consolidationForm.toAgent} – ${agentTableData.find(r => r.agent_code === consolidationForm.toAgent)?.agent_name || ''}` : ''} placeholder="" columns={[{ key: 'agent_code', header: 'Agent Code', width: '25%' }, { key: 'agent_name', header: 'Agent Name', width: '35%' }, { key: 'agency_code', header: 'Agency', width: '20%' }, { key: 'sub_agency_code', header: 'Sub Agency', width: '20%' }]} rows={agentTableData} valueKey="agent_code" onSelect={row => setC('toAgent', row.agent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          )}

        </div>

        {/* ── Certificates Section (Common for all tabs) ── */}
        <div style={{ padding: '0 14px 14px 14px', borderTop: '1px solid #e2e8f0', background: '#ffffff', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '11px', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', padding: '6px 10px', background: 'linear-gradient(90deg,#e8edf5,#f1f4f9)', borderRadius: '4px' }}>Certificates</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr)) 36px', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
            {(['certNo', 'availableUnits', 'consolidateUnits', 'balanceUnits', 'certAmount', 'blockedUnits'] as const).map((f, i) => (
              <input key={f} className="setup-input-field" type={i > 0 ? 'number' : 'text'}
                value={(consolidationForm as any)[f]}
                onChange={e => {
                  setC(f, e.target.value);
                  if (f === 'consolidateUnits') {
                    const avail = parseFloat(consolidationForm.availableUnits) || 0;
                    setC('balanceUnits', (avail - (parseFloat(e.target.value) || 0)).toString());
                  }
                }}
                style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                disabled={!isEnabled}
                placeholder={['Certificate No', 'Available Units', 'Consolidate Units', 'Balance Units', 'Amount', 'Blocked Units'][i]}
              />
            ))}
            <button
              onClick={() => {
                if (!isEnabled || !consolidationForm.certNo) return;
                setCertRows(p => [...p, { certificateNo: consolidationForm.certNo, availableUnits: consolidationForm.availableUnits, consolidateUnits: consolidationForm.consolidateUnits, balanceUnits: consolidationForm.balanceUnits, amount: consolidationForm.certAmount, blockedUnits: consolidationForm.blockedUnits }]);
                setConsolidationForm(p => ({ ...p, certNo: '', availableUnits: '', consolidateUnits: '', balanceUnits: '', certAmount: '', blockedUnits: '' }));
              }}
              disabled={!isEnabled || !consolidationForm.certNo}
              style={{ background: isEnabled && consolidationForm.certNo ? '#b45309' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '3px', width: '36px', height: '28px', fontSize: '14px', fontWeight: 700, cursor: isEnabled && consolidationForm.certNo ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              title="Add"
            >▼</button>
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Certificate No', 'Available Units', 'Consolidate Units', 'Balance Units', 'Amount', 'Blocked Units'].map((h, i, arr) => (
                    <th key={h} style={{ ...thStyle2, borderRight: i < arr.length - 1 ? '1px solid #e2e8f0' : 'none' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certRows.length === 0
                  ? <tr><td colSpan={6} style={{ padding: '18px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No records</td></tr>
                  : certRows.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={tdStyle2}>{r.certificateNo}</td>
                      <td style={tdStyle2}>{r.availableUnits}</td>
                      <td style={tdStyle2}>{r.consolidateUnits}</td>
                      <td style={tdStyle2}>{r.balanceUnits}</td>
                      <td style={tdStyle2}>{r.amount}</td>
                      <td style={{ ...tdStyle2, borderRight: 'none' }}>{r.blockedUnits}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '5px', fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Single click to select · Double click to full consolidate.</div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// UNIT TRANSFER MODAL
// ========================================
function UnitTransferModal({ onClose: _onClose }: { onClose: () => void }) {
  type UTTab = 'Transferor [From]' | 'Transferee [To]' | 'Agent Details';

  const [isEnabled, setIsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<UTTab>('Transferor [From]');
  const [transferDate, setTransferDate] = useState<Date | null>(null);

  const [showFromAccSearch, setShowFromAccSearch] = useState(false);
  const [showFromHldSearch, setShowFromHldSearch] = useState(false);
  const [showToAccSearch, setShowToAccSearch] = useState(false);
  const [showToHldSearch, setShowToHldSearch] = useState(false);
  const [showEditSearch, setShowEditSearch] = useState(false);
  const [showAkctSearch, setShowAkctSearch] = useState(false);

  const [certRows, setCertRows] = useState<{
    certificateNo: string; availableUnits: string; transferUnits: string;
    balanceUnits: string; amount: string; blockedUnits: string;
  }[]>([]);

  const emptyForm = {
    fundCode: '', fundName: '',
    transferCode: '', transferNo: '',
    invType: '', agentBank: '',
    unitPrice: '', redemption: '',
    remark: '', reasonToEdit: '',
    // Transferor [From]
    fromAccNo: '', fromHolderNo: '', fromHolderName: '', fromNoOfUnits: '', fromValue: '',
    // Transferee [To]
    toAccNo: '', toHolderNo: '', toHolderName: '', toNoOfUnits: '', toValue: '',
    // Certificates row input
    certNo: '', availableUnits: '', transferUnits: '', balanceUnits: '', certAmount: '', blockedUnits: '',
    // Agent Details
    agency: '', subAgency: '', agent: '',
    toAgency: '', toSubAgency: '', toAgent: '',
  };

  const [form, setForm] = useState(emptyForm);
  const set = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const clearForm = () => {
    setIsEnabled(false);
    setTransferDate(null);
    setCertRows([]);
    setForm(emptyForm);
    setActiveTab('Transferor [From]');
  };

  // ── Transfer-code table data ──
  const transferCodeData: Record<string, string>[] = [
    { code: 'TC001', name: 'Internal Transfer' },
    { code: 'TC002', name: 'External Transfer' },
    { code: 'TC003', name: 'Joint to Single' },
    { code: 'TC004', name: 'Single to Joint' },
    { code: 'TC005', name: 'Estate Transfer' },
    { code: 'TC006', name: 'Gift Transfer' },
  ];

  const tabs: UTTab[] = ['Transferor [From]', 'Transferee [To]', 'Agent Details'];

  /* ── shared style helpers ── */
  const fieldH = 28;
  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: fieldH, padding: '0 8px', fontSize: '12px',
    border: '1px solid #cfd8e3', borderRadius: '5px',
    background: isEnabled ? '#ffffff' : '#f0f4f8',
    color: '#1e293b', outline: 'none', width: '100%',
    boxSizing: 'border-box' as const,
    cursor: isEnabled ? 'text' : 'not-allowed',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    ...extra,
  });
  const LBL: React.CSSProperties = {
    fontSize: '10px', fontWeight: 700, color: '#5a6a85',
    textTransform: 'uppercase' as const, letterSpacing: '0.06em',
    whiteSpace: 'nowrap' as const,
  };
  const iconBtn = (bg: string): React.CSSProperties => ({
    height: fieldH, minWidth: 26, padding: '0 4px', flexShrink: 0,
    background: isEnabled ? bg : '#b0bec5',
    color: '#fff', border: 'none', borderRadius: '5px',
    fontSize: '10px', fontWeight: 800,
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: isEnabled ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
  });
  const txtBtn = (bg: string): React.CSSProperties => ({
    height: fieldH, padding: '0 10px', flexShrink: 0,
    background: isEnabled ? bg : '#b0bec5',
    color: '#fff', border: 'none', borderRadius: '5px',
    fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' as const,
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    boxShadow: isEnabled ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
  });
  const Field = ({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', ...style }}>
      <span style={LBL}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{children}</div>
    </div>
  );
  const tableHeaderStyle: React.CSSProperties = {
    padding: '6px 10px', background: '#f1f5f9', fontWeight: 700, fontSize: '11px',
    color: '#374151', textAlign: 'left', borderBottom: '2px solid #cbd5e1',
    borderRight: '1px solid #e2e8f0', whiteSpace: 'nowrap',
  };
  const tableCellStyle: React.CSSProperties = {
    padding: '5px 10px', fontSize: '12px', color: '#1f2937',
    borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0',
  };

  /* ── Holder/From/To tab panels (reusable structure) ── */
  const HolderPanel = ({ side }: { side: 'from' | 'to' }) => {
    const accKey = side === 'from' ? 'fromAccNo' : 'toAccNo';
    const hldKey = side === 'from' ? 'fromHolderNo' : 'toHolderNo';
    const unitsKey = side === 'from' ? 'fromNoOfUnits' : 'toNoOfUnits';
    const valKey = side === 'from' ? 'fromValue' : 'toValue';
    const accBg = side === 'from' ? '#1e3a8a' : '#1e3a8a';
    const hldBg = side === 'from' ? '#7c3aed' : '#7c3aed';
    const label = side === 'from' ? 'From' : 'To';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '25% 25% 49%', gap: '0 8px', alignItems: 'end' }}>
          <Field label={`Acc No [ ${label} ]`}>
            <input style={inp()} value={(form as any)[accKey]} onChange={e => set(accKey, e.target.value)} disabled={!isEnabled} />
            <button style={iconBtn(accBg)} onClick={() => isEnabled && (side === 'from' ? setShowFromAccSearch(true) : setShowToAccSearch(true))} disabled={!isEnabled}>A</button>
          </Field>
          <Field label={`Holder No. [ ${label} ]`}>
            <input style={inp()} value={(form as any)[hldKey]} onChange={e => set(hldKey, e.target.value)} disabled={!isEnabled} />
            <button style={iconBtn(hldBg)} onClick={() => isEnabled && (side === 'from' ? setShowFromHldSearch(true) : setShowToHldSearch(true))} disabled={!isEnabled}>H</button>
          </Field>
          <Field label={`Holder Name [ ${label} ]`}>
            <input style={inp({ background: '#f8fafc', color: '#1e3a8a', fontWeight: 600, borderColor: '#cbd5e1' })} value={(form as any)[side === 'from' ? 'fromHolderName' : 'toHolderName']} disabled readOnly />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', alignItems: 'end' }}>
          <Field label={`No of Unit [ ${label} ]`}>
            <input type="number" style={inp()} value={(form as any)[unitsKey]} onChange={e => set(unitsKey, e.target.value)} disabled={!isEnabled} />
          </Field>
          <Field label={`Value  [ ${label} ]`}>
            <input type="number" style={inp()} value={(form as any)[valKey]} onChange={e => set(valKey, e.target.value)} disabled={!isEnabled} />
          </Field>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>

      {/* ── Sub-modals ── */}
      <AccountSearchModal isOpen={showFromAccSearch} onClose={() => setShowFromAccSearch(false)} onGet={r => set('fromAccNo', r.accountNo || '')} onSelect={r => set('fromAccNo', r.accountNo || '')} title="Search Account [From]" />
      <AccountSearchModal isOpen={showToAccSearch} onClose={() => setShowToAccSearch(false)} onGet={r => set('toAccNo', r.accountNo || '')} onSelect={r => set('toAccNo', r.accountNo || '')} title="Search Account [To]" />
      <HolderSearchModal isOpen={showFromHldSearch} onClose={() => setShowFromHldSearch(false)} onSelect={(r: HolderRecord) => { set('fromHolderNo', r.holderId); set('fromHolderName', r.holderName); }} />
      <HolderSearchModal isOpen={showToHldSearch} onClose={() => setShowToHldSearch(false)} onSelect={(r: HolderRecord) => { set('toHolderNo', r.holderId); set('toHolderName', r.holderName); }} />
      <EditSearchModal isOpen={showEditSearch} onClose={() => setShowEditSearch(false)} title="Edit — Select Transfer Record" onSelect={r => set('transferNo', (r as any).transactionNo || '')} />
      <AkctNoSearchModal isOpen={showAkctSearch} onClose={() => setShowAkctSearch(false)} onSelect={r => set('transferNo', (r as any).akctNo || '')} />

      {/* ════════════════════ BOX 1 — Top header row ════════════════════ */}
      <div style={{ background: '#ffffff', border: '1.5px solid #bdd5f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 1px 6px rgba(59,130,246,0.07)' }}>
        {/* Row 1: Fund [wide] + AKCT NO btn + Transfer Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 200px', gap: '0 10px', marginBottom: '8px', alignItems: 'end' }}>
          <Field label="Fund">
            <FundDropdown value={form.fundCode} displayValue={form.fundName} onSelect={(c, n) => setForm(p => ({ ...p, fundCode: c, fundName: n }))} disabled={!isEnabled} />
          </Field>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
            <button style={txtBtn('#0d7f5a')} onClick={() => isEnabled && setShowAkctSearch(true)} disabled={!isEnabled}>AKCT NO</button>
          </div>
          <Field label="Transfer Date">
            <DatePicker selected={transferDate} onChange={d => setTransferDate(d)} dateFormat="dd/MMM/yyyy" placeholderText="DD/MMM/YYYY" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
          </Field>
        </div>

        {/* Row 2: Transfer Code | Transfer No [E] | Unit Price label + Redemption value */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
          <Field label="Transfer Code">
            <TableDropdown
              value={form.transferCode}
              displayValue={form.transferCode ? `${form.transferCode} – ${transferCodeData.find(r => r.code === form.transferCode)?.name || ''}` : ''}
              placeholder="Select Transfer Code"
              columns={[{ key: 'code', header: 'CODE', width: '35%' }, { key: 'name', header: 'NAME', width: '65%' }]}
              rows={transferCodeData} valueKey="code"
              onSelect={row => set('transferCode', row.code)}
              disabled={!isEnabled}
            />
          </Field>
          <Field label="Transfer No.">
            <input style={inp({ flex: 1 })} value={form.transferNo} onChange={e => set('transferNo', e.target.value)} disabled={!isEnabled} />
            <button style={iconBtn('#b45309')} onClick={() => isEnabled && setShowEditSearch(true)} disabled={!isEnabled}>E</button>
          </Field>
          {/* Unit Price / Redemption block */}
          <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0, height: '100%', boxSizing: 'border-box' }}>
            <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Unit Price</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: '#1d4ed8' }}>Redemption</span>
              <input type="number" style={inp()} value={form.redemption} onChange={e => set('redemption', e.target.value)} disabled={!isEnabled} />
            </div>
          </fieldset>
        </div>

        {/* Row 3: Investment Type | Agent/Bank */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
          <Field label="Investment Type">
            <TableDropdown
              value={form.invType}
              displayValue={form.invType || ''}
              placeholder="Select"
              columns={[{ key: 'type', header: 'Type', width: '22%' }, { key: 'description', header: 'Description', width: '45%' }, { key: 'agent', header: 'Agent', width: '33%' }]}
              rows={invTypeData as Record<string, string>[]} valueKey="type"
              onSelect={row => set('invType', row.type)}
              disabled={!isEnabled}
            />
          </Field>
          <Field label="Agent / Bank">
            <TableDropdown
              value={form.agentBank}
              displayValue={form.agentBank ? `${form.agentBank} – ${agentBankData.find(r => r.agentCode === form.agentBank)?.agentDescription || ''}` : ''}
              placeholder="Select Agent / Bank"
              columns={[{ key: 'agentCode', header: 'Agent Code', width: '35%' }, { key: 'agentDescription', header: 'Agent Description', width: '65%' }]}
              rows={agentBankData} valueKey="agentCode"
              onSelect={row => set('agentBank', row.agentCode)}
              disabled={!isEnabled}
            />
          </Field>
        </div>

        {/* Row 4: Remark */}
        <div style={{ marginBottom: '6px' }}>
          <Field label="Remark">
            <input style={inp()} value={form.remark} onChange={e => set('remark', e.target.value)} disabled={!isEnabled} />
          </Field>
        </div>

        {/* Row 5: Reason to Edit */}
        <div>
          <Field label="Reason to Edit">
            <input style={inp()} value={form.reasonToEdit} onChange={e => set('reasonToEdit', e.target.value)} disabled={!isEnabled} />
          </Field>
        </div>
      </div>

      {/* ── Button Palette ── */}
      <CreationButtonPalette onNew={() => setIsEnabled(true)} onClear={clearForm} />

      {/* ════════════════════ TABBED BOTTOM SECTION ════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', minHeight: '280px', flexShrink: 0 }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', flexShrink: 0, background: '#f8fafc', padding: '0 8px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
              padding: '7px 14px',
              background: activeTab === tab ? '#ffffff' : 'transparent',
              color: activeTab === tab ? '#1e3a8a' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #1e3a8a' : '2px solid transparent',
              marginBottom: '-2px', cursor: 'pointer',
              fontWeight: activeTab === tab ? 700 : 600, fontSize: '12px',
              fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{tab}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: '14px', overflowY: 'auto', minHeight: '200px' }}>

          {/* ── Transferor [From] ── */}
          {activeTab === 'Transferor [From]' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <HolderPanel side="from" />
            </div>
          )}

          {/* ── Transferee [To] ── */}
          {activeTab === 'Transferee [To]' && (
            <div>
              <HolderPanel side="to" />
              <div style={{ marginTop: '12px', padding: '10px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '12px', color: '#15803d' }}>
                <span style={{ fontWeight: 700 }}>ℹ️ Note:</span> The Transferee (To) account will receive the units being transferred from the Transferor (From) account.
              </div>
            </div>
          )}

          {/* ── Agent Details ── */}
          {activeTab === 'Agent Details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0 }}>
                <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Agents From</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.agency} displayValue={form.agency ? `${form.agency} – ${agencyTableData.find(r => r.agency_code === form.agency)?.agency_name || ''}` : ''} placeholder="" columns={[{ key: 'agency_code', header: 'Agency Code', width: '40%' }, { key: 'agency_name', header: 'Agency Name', width: '60%' }]} rows={agencyTableData} valueKey="agency_code" onSelect={row => set('agency', row.agency_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Sub Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.subAgency} displayValue={form.subAgency ? `${form.subAgency} – ${subAgencyTableData.find(r => r.subagent_code === form.subAgency)?.subagent_name || ''}` : ''} placeholder="" columns={[{ key: 'subagent_code', header: 'Sub Agency Code', width: '40%' }, { key: 'subagent_name', header: 'Sub Agency Name', width: '60%' }]} rows={subAgencyTableData} valueKey="subagent_code" onSelect={row => set('subAgency', row.subagent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agent</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.agent} displayValue={form.agent ? `${form.agent} – ${agentTableData.find(r => r.agent_code === form.agent)?.agent_name || ''}` : ''} placeholder="" columns={[{ key: 'agent_code', header: 'Agent Code', width: '25%' }, { key: 'agent_name', header: 'Agent Name', width: '35%' }, { key: 'agency_code', header: 'Agency', width: '20%' }, { key: 'sub_agency_code', header: 'Sub Agency', width: '20%' }]} rows={agentTableData} valueKey="agent_code" onSelect={row => set('agent', row.agent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0 }}>
                <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Agents To</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.toAgency} displayValue={form.toAgency ? `${form.toAgency} – ${agencyTableData.find(r => r.agency_code === form.toAgency)?.agency_name || ''}` : ''} placeholder="" columns={[{ key: 'agency_code', header: 'Agency Code', width: '40%' }, { key: 'agency_name', header: 'Agency Name', width: '60%' }]} rows={agencyTableData} valueKey="agency_code" onSelect={row => set('toAgency', row.agency_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Sub Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.toSubAgency} displayValue={form.toSubAgency ? `${form.toSubAgency} – ${subAgencyTableData.find(r => r.subagent_code === form.toSubAgency)?.subagent_name || ''}` : ''} placeholder="" columns={[{ key: 'subagent_code', header: 'Sub Agency Code', width: '40%' }, { key: 'subagent_name', header: 'Sub Agency Name', width: '60%' }]} rows={subAgencyTableData} valueKey="subagent_code" onSelect={row => set('toSubAgency', row.subagent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agent</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.toAgent} displayValue={form.toAgent ? `${form.toAgent} – ${agentTableData.find(r => r.agent_code === form.toAgent)?.agent_name || ''}` : ''} placeholder="" columns={[{ key: 'agent_code', header: 'Agent Code', width: '25%' }, { key: 'agent_name', header: 'Agent Name', width: '35%' }, { key: 'agency_code', header: 'Agency', width: '20%' }, { key: 'sub_agency_code', header: 'Sub Agency', width: '20%' }]} rows={agentTableData} valueKey="agent_code" onSelect={row => set('toAgent', row.agent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          )}

        </div>

        {/* ── Certificates Section (Common for all tabs) ── */}
        <div style={{ padding: '0 14px 14px 14px', borderTop: '1px solid #e2e8f0', background: '#ffffff', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '11px', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', padding: '6px 10px', background: 'linear-gradient(90deg,#e8edf5,#f1f4f9)', borderRadius: '4px' }}>Certificates</div>
          {/* Input row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr)) 36px', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
            {(['certNo', 'availableUnits', 'transferUnits', 'balanceUnits', 'certAmount', 'blockedUnits'] as const).map((f, i) => (
              <input key={f} className="setup-input-field" type={i > 0 ? 'number' : 'text'} value={(form as any)[f]} onChange={e => {
                set(f, e.target.value);
                if (f === 'transferUnits') {
                  const avail = parseFloat(form.availableUnits) || 0;
                  set('balanceUnits', (avail - (parseFloat(e.target.value) || 0)).toString());
                }
              }} style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }} disabled={!isEnabled}
                placeholder={['Certificate No', 'Available Units', 'Transfer Units', 'Balance Units', 'Amount', 'Blocked Units'][i]} />
            ))}
            <button onClick={() => {
              if (!isEnabled || !form.certNo) return;
              setCertRows(p => [...p, { certificateNo: form.certNo, availableUnits: form.availableUnits, transferUnits: form.transferUnits, balanceUnits: form.balanceUnits, amount: form.certAmount, blockedUnits: form.blockedUnits }]);
              setForm(p => ({ ...p, certNo: '', availableUnits: '', transferUnits: '', balanceUnits: '', certAmount: '', blockedUnits: '' }));
            }} disabled={!isEnabled || !form.certNo}
              style={{ background: isEnabled && form.certNo ? '#b45309' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '3px', width: '36px', height: '28px', fontSize: '14px', fontWeight: 700, cursor: isEnabled && form.certNo ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} title="Add">▼</button>
          </div>
          {/* Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Certificate No', 'Available Units', 'Transfer Units', 'Balance Units', 'Amount', 'Blocked Units'].map((h, i, arr) => (
                    <th key={h} style={{ ...tableHeaderStyle, borderRight: i < arr.length - 1 ? '1px solid #e2e8f0' : 'none' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certRows.length === 0
                  ? <tr><td colSpan={6} style={{ padding: '18px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No records</td></tr>
                  : certRows.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={tableCellStyle}>{r.certificateNo}</td>
                      <td style={tableCellStyle}>{r.availableUnits}</td>
                      <td style={tableCellStyle}>{r.transferUnits}</td>
                      <td style={tableCellStyle}>{r.balanceUnits}</td>
                      <td style={tableCellStyle}>{r.amount}</td>
                      <td style={{ ...tableCellStyle, borderRight: 'none' }}>{r.blockedUnits}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '5px', fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Single click to select · Double click to full transfer.</div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// UNIT TRANSFER - SUSPENSE ACCOUNT MODAL
// ========================================
function UnitTransferSuspenseAccountModal({ onClose: _onClose }: { onClose: () => void }) {
  type UTTab = 'Transferor [From]' | 'Transferee [To]' | 'Agent Details';

  const [isEnabled, setIsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<UTTab>('Transferor [From]');
  const [transferDate, setTransferDate] = useState<Date | null>(null);

  const [showFromAccSearch, setShowFromAccSearch] = useState(false);
  const [showFromHldSearch, setShowFromHldSearch] = useState(false);
  const [showToAccSearch, setShowToAccSearch] = useState(false);
  const [showToHldSearch, setShowToHldSearch] = useState(false);
  const [showEditSearch, setShowEditSearch] = useState(false);
  const [showAkctSearch, setShowAkctSearch] = useState(false);

  const [certRows, setCertRows] = useState<{
    certificateNo: string; availableUnits: string; transferUnits: string;
    balanceUnits: string; amount: string; blockedUnits: string;
  }[]>([]);

  const emptyForm = {
    fundCode: '', fundName: '',
    transferCode: '', transferNo: '',
    invType: '', agentBank: '',
    unitPrice: '', redemption: '',
    remark: '', reasonToEdit: '',
    // Transferor [From]
    fromAccNo: '', fromHolderNo: '', fromHolderName: '', fromNoOfUnits: '', fromValue: '',
    // Transferee [To]
    toAccNo: '', toHolderNo: '', toHolderName: '', toNoOfUnits: '', toValue: '',
    // Certificates row input
    certNo: '', availableUnits: '', transferUnits: '', balanceUnits: '', certAmount: '', blockedUnits: '',
    // Agent Details
    agency: '', subAgency: '', agent: '',
    toAgency: '', toSubAgency: '', toAgent: '',
  };

  const [form, setForm] = useState(emptyForm);
  const set = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const clearForm = () => {
    setIsEnabled(false);
    setTransferDate(null);
    setCertRows([]);
    setForm(emptyForm);
    setActiveTab('Transferor [From]');
  };

  // ── Transfer-code table data ──
  const transferCodeData: Record<string, string>[] = [
    { code: 'TC001', name: 'Internal Transfer' },
    { code: 'TC002', name: 'External Transfer' },
    { code: 'TC003', name: 'Joint to Single' },
    { code: 'TC004', name: 'Single to Joint' },
    { code: 'TC005', name: 'Estate Transfer' },
    { code: 'TC006', name: 'Gift Transfer' },
  ];

  const tabs: UTTab[] = ['Transferor [From]', 'Transferee [To]', 'Agent Details'];

  /* ── shared style helpers ── */
  const fieldH = 28;
  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: fieldH, padding: '0 8px', fontSize: '12px',
    border: '1px solid #cfd8e3', borderRadius: '5px',
    background: isEnabled ? '#ffffff' : '#f0f4f8',
    color: '#1e293b', outline: 'none', width: '100%',
    boxSizing: 'border-box' as const,
    cursor: isEnabled ? 'text' : 'not-allowed',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    ...extra,
  });
  const LBL: React.CSSProperties = {
    fontSize: '10px', fontWeight: 700, color: '#5a6a85',
    textTransform: 'uppercase' as const, letterSpacing: '0.06em',
    whiteSpace: 'nowrap' as const,
  };
  const iconBtn = (bg: string): React.CSSProperties => ({
    height: fieldH, minWidth: 26, padding: '0 4px', flexShrink: 0,
    background: isEnabled ? bg : '#b0bec5',
    color: '#fff', border: 'none', borderRadius: '5px',
    fontSize: '10px', fontWeight: 800,
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: isEnabled ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
  });
  const txtBtn = (bg: string): React.CSSProperties => ({
    height: fieldH, padding: '0 10px', flexShrink: 0,
    background: isEnabled ? bg : '#b0bec5',
    color: '#fff', border: 'none', borderRadius: '5px',
    fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' as const,
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    boxShadow: isEnabled ? '0 1px 3px rgba(0,0,0,0.18)' : 'none',
  });
  const Field = ({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', ...style }}>
      <span style={LBL}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{children}</div>
    </div>
  );
  const tableHeaderStyle: React.CSSProperties = {
    padding: '6px 10px', background: '#f1f5f9', fontWeight: 700, fontSize: '11px',
    color: '#374151', textAlign: 'left', borderBottom: '2px solid #cbd5e1',
    borderRight: '1px solid #e2e8f0', whiteSpace: 'nowrap',
  };
  const tableCellStyle: React.CSSProperties = {
    padding: '5px 10px', fontSize: '12px', color: '#1f2937',
    borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0',
  };

  /* ── Holder/From/To tab panels (reusable structure) ── */
  const HolderPanel = ({ side }: { side: 'from' | 'to' }) => {
    const accKey = side === 'from' ? 'fromAccNo' : 'toAccNo';
    const hldKey = side === 'from' ? 'fromHolderNo' : 'toHolderNo';
    const unitsKey = side === 'from' ? 'fromNoOfUnits' : 'toNoOfUnits';
    const valKey = side === 'from' ? 'fromValue' : 'toValue';
    const accBg = side === 'from' ? '#1e3a8a' : '#1e3a8a';
    const hldBg = side === 'from' ? '#7c3aed' : '#7c3aed';
    const label = side === 'from' ? 'From' : 'To';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '25% 25% 49%', gap: '0 8px', alignItems: 'end' }}>
          <Field label={`Acc No [ ${label} ]`}>
            <input style={inp()} value={(form as any)[accKey]} onChange={e => set(accKey, e.target.value)} disabled={!isEnabled} />
            <button style={iconBtn(accBg)} onClick={() => isEnabled && (side === 'from' ? setShowFromAccSearch(true) : setShowToAccSearch(true))} disabled={!isEnabled}>A</button>
          </Field>
          <Field label={`Holder No. [ ${label} ]`}>
            <input style={inp()} value={(form as any)[hldKey]} onChange={e => set(hldKey, e.target.value)} disabled={!isEnabled} />
            <button style={iconBtn(hldBg)} onClick={() => isEnabled && (side === 'from' ? setShowFromHldSearch(true) : setShowToHldSearch(true))} disabled={!isEnabled}>H</button>
          </Field>
          <Field label={`Holder Name [ ${label} ]`}>
            <input style={inp({ background: '#f8fafc', color: '#1e3a8a', fontWeight: 600, borderColor: '#cbd5e1' })} value={(form as any)[side === 'from' ? 'fromHolderName' : 'toHolderName']} disabled readOnly />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', alignItems: 'end' }}>
          <Field label={`No of Unit [ ${label} ]`}>
            <input type="number" style={inp()} value={(form as any)[unitsKey]} onChange={e => set(unitsKey, e.target.value)} disabled={!isEnabled} />
          </Field>
          <Field label={`Value  [ ${label} ]`}>
            <input type="number" style={inp()} value={(form as any)[valKey]} onChange={e => set(valKey, e.target.value)} disabled={!isEnabled} />
          </Field>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>

      {/* ── Sub-modals ── */}
      <AccountSearchModal isOpen={showFromAccSearch} onClose={() => setShowFromAccSearch(false)} onGet={r => set('fromAccNo', r.accountNo || '')} onSelect={r => set('fromAccNo', r.accountNo || '')} title="Search Account [From]" />
      <AccountSearchModal isOpen={showToAccSearch} onClose={() => setShowToAccSearch(false)} onGet={r => set('toAccNo', r.accountNo || '')} onSelect={r => set('toAccNo', r.accountNo || '')} title="Search Account [To]" />
      <HolderSearchModal isOpen={showFromHldSearch} onClose={() => setShowFromHldSearch(false)} onSelect={(r: HolderRecord) => { set('fromHolderNo', r.holderId); set('fromHolderName', r.holderName); }} />
      <HolderSearchModal isOpen={showToHldSearch} onClose={() => setShowToHldSearch(false)} onSelect={(r: HolderRecord) => { set('toHolderNo', r.holderId); set('toHolderName', r.holderName); }} />
      <EditSearchModal isOpen={showEditSearch} onClose={() => setShowEditSearch(false)} title="Edit — Select Transfer Record" onSelect={r => set('transferNo', (r as any).transactionNo || '')} />
      <AkctNoSearchModal isOpen={showAkctSearch} onClose={() => setShowAkctSearch(false)} onSelect={r => set('transferNo', (r as any).akctNo || '')} />

      {/* ════════════════════ BOX 1 — Top header row ════════════════════ */}
      <div style={{ background: '#ffffff', border: '1.5px solid #bdd5f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 1px 6px rgba(59,130,246,0.07)' }}>
        {/* Row 1: Fund [wide] + AKCT NO btn + Transfer Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 200px', gap: '0 10px', marginBottom: '8px', alignItems: 'end' }}>
          <Field label="Fund">
            <FundDropdown value={form.fundCode} displayValue={form.fundName} onSelect={(c, n) => setForm(p => ({ ...p, fundCode: c, fundName: n }))} disabled={!isEnabled} />
          </Field>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
            <button style={txtBtn('#0d7f5a')} onClick={() => isEnabled && setShowAkctSearch(true)} disabled={!isEnabled}>AKCT NO</button>
          </div>
          <Field label="Transfer Date">
            <DatePicker selected={transferDate} onChange={d => setTransferDate(d)} dateFormat="dd/MMM/yyyy" placeholderText="DD/MMM/YYYY" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" disabled={!isEnabled} />
          </Field>
        </div>

        {/* Row 2: Transfer Code | Transfer No [E] | Unit Price label + Redemption value */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
          <Field label="Transfer Code">
            <TableDropdown
              value={form.transferCode}
              displayValue={form.transferCode ? `${form.transferCode} – ${transferCodeData.find(r => r.code === form.transferCode)?.name || ''}` : ''}
              placeholder="Select Transfer Code"
              columns={[{ key: 'code', header: 'CODE', width: '35%' }, { key: 'name', header: 'NAME', width: '65%' }]}
              rows={transferCodeData} valueKey="code"
              onSelect={row => set('transferCode', row.code)}
              disabled={!isEnabled}
            />
          </Field>
          <Field label="Transfer No.">
            <input style={inp({ flex: 1 })} value={form.transferNo} onChange={e => set('transferNo', e.target.value)} disabled={!isEnabled} />
            <button style={iconBtn('#b45309')} onClick={() => isEnabled && setShowEditSearch(true)} disabled={!isEnabled}>E</button>
          </Field>
          {/* Unit Price / Redemption block */}
          <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0, height: '100%', boxSizing: 'border-box' }}>
            <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Unit Price</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: '#1d4ed8' }}>Redemption</span>
              <input type="number" style={inp()} value={form.redemption} onChange={e => set('redemption', e.target.value)} disabled={!isEnabled} />
            </div>
          </fieldset>
        </div>

        {/* Row 3: Investment Type | Agent/Bank */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', marginBottom: '8px', alignItems: 'end' }}>
          <Field label="Investment Type">
            <TableDropdown
              value={form.invType}
              displayValue={form.invType || ''}
              placeholder="Select"
              columns={[{ key: 'type', header: 'Type', width: '22%' }, { key: 'description', header: 'Description', width: '45%' }, { key: 'agent', header: 'Agent', width: '33%' }]}
              rows={invTypeData as Record<string, string>[]} valueKey="type"
              onSelect={row => set('invType', row.type)}
              disabled={!isEnabled}
            />
          </Field>
          <Field label="Agent / Bank">
            <TableDropdown
              value={form.agentBank}
              displayValue={form.agentBank ? `${form.agentBank} – ${agentBankData.find(r => r.agentCode === form.agentBank)?.agentDescription || ''}` : ''}
              placeholder="Select Agent / Bank"
              columns={[{ key: 'agentCode', header: 'Agent Code', width: '35%' }, { key: 'agentDescription', header: 'Agent Description', width: '65%' }]}
              rows={agentBankData} valueKey="agentCode"
              onSelect={row => set('agentBank', row.agentCode)}
              disabled={!isEnabled}
            />
          </Field>
        </div>

        {/* Row 4: Remark */}
        <div style={{ marginBottom: '6px' }}>
          <Field label="Remark">
            <input style={inp()} value={form.remark} onChange={e => set('remark', e.target.value)} disabled={!isEnabled} />
          </Field>
        </div>

        {/* Row 5: Reason to Edit */}
        <div>
          <Field label="Reason to Edit">
            <input style={inp()} value={form.reasonToEdit} onChange={e => set('reasonToEdit', e.target.value)} disabled={!isEnabled} />
          </Field>
        </div>
      </div>

      {/* ── Button Palette ── */}
      <CreationButtonPalette onNew={() => setIsEnabled(true)} onClear={clearForm} />

      {/* ════════════════════ TABBED BOTTOM SECTION ════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', minHeight: '280px', flexShrink: 0 }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', flexShrink: 0, background: '#f8fafc', padding: '0 8px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
              padding: '7px 14px',
              background: activeTab === tab ? '#ffffff' : 'transparent',
              color: activeTab === tab ? '#1e3a8a' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #1e3a8a' : '2px solid transparent',
              marginBottom: '-2px', cursor: 'pointer',
              fontWeight: activeTab === tab ? 700 : 600, fontSize: '12px',
              fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{tab}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: '14px', overflowY: 'auto', minHeight: '200px' }}>

          {/* ── Transferor [From] ── */}
          {activeTab === 'Transferor [From]' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <HolderPanel side="from" />
            </div>
          )}

          {/* ── Transferee [To] ── */}
          {activeTab === 'Transferee [To]' && (
            <div>
              <HolderPanel side="to" />
              <div style={{ marginTop: '12px', padding: '10px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '12px', color: '#15803d' }}>
                <span style={{ fontWeight: 700 }}>ℹ️ Note:</span> The Transferee (To) account will receive the units being transferred from the Transferor (From) account.
              </div>
            </div>
          )}

          {/* ── Agent Details ── */}
          {activeTab === 'Agent Details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0 }}>
                <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Agents From</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.agency} displayValue={form.agency ? `${form.agency} – ${agencyTableData.find(r => r.agency_code === form.agency)?.agency_name || ''}` : ''} placeholder="" columns={[{ key: 'agency_code', header: 'Agency Code', width: '40%' }, { key: 'agency_name', header: 'Agency Name', width: '60%' }]} rows={agencyTableData} valueKey="agency_code" onSelect={row => set('agency', row.agency_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Sub Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.subAgency} displayValue={form.subAgency ? `${form.subAgency} – ${subAgencyTableData.find(r => r.subagent_code === form.subAgency)?.subagent_name || ''}` : ''} placeholder="" columns={[{ key: 'subagent_code', header: 'Sub Agency Code', width: '40%' }, { key: 'subagent_name', header: 'Sub Agency Name', width: '60%' }]} rows={subAgencyTableData} valueKey="subagent_code" onSelect={row => set('subAgency', row.subagent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agent</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.agent} displayValue={form.agent ? `${form.agent} – ${agentTableData.find(r => r.agent_code === form.agent)?.agent_name || ''}` : ''} placeholder="" columns={[{ key: 'agent_code', header: 'Agent Code', width: '25%' }, { key: 'agent_name', header: 'Agent Name', width: '35%' }, { key: 'agency_code', header: 'Agency', width: '20%' }, { key: 'sub_agency_code', header: 'Sub Agency', width: '20%' }]} rows={agentTableData} valueKey="agent_code" onSelect={row => set('agent', row.agent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '6px 12px 14px', margin: 0, background: '#ffffff', minWidth: 0 }}>
                <legend style={{ color: '#1d4ed8', fontSize: '11px', padding: '0 4px', background: '#ffffff' }}>Agents To</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.toAgency} displayValue={form.toAgency ? `${form.toAgency} – ${agencyTableData.find(r => r.agency_code === form.toAgency)?.agency_name || ''}` : ''} placeholder="" columns={[{ key: 'agency_code', header: 'Agency Code', width: '40%' }, { key: 'agency_name', header: 'Agency Name', width: '60%' }]} rows={agencyTableData} valueKey="agency_code" onSelect={row => set('toAgency', row.agency_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Sub Agency</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.toSubAgency} displayValue={form.toSubAgency ? `${form.toSubAgency} – ${subAgencyTableData.find(r => r.subagent_code === form.toSubAgency)?.subagent_name || ''}` : ''} placeholder="" columns={[{ key: 'subagent_code', header: 'Sub Agency Code', width: '40%' }, { key: 'subagent_name', header: 'Sub Agency Name', width: '60%' }]} rows={subAgencyTableData} valueKey="subagent_code" onSelect={row => set('toSubAgency', row.subagent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '80px', fontSize: '11px', color: '#1d4ed8' }}>Agent</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TableDropdown value={form.toAgent} displayValue={form.toAgent ? `${form.toAgent} – ${agentTableData.find(r => r.agent_code === form.toAgent)?.agent_name || ''}` : ''} placeholder="" columns={[{ key: 'agent_code', header: 'Agent Code', width: '25%' }, { key: 'agent_name', header: 'Agent Name', width: '35%' }, { key: 'agency_code', header: 'Agency', width: '20%' }, { key: 'sub_agency_code', header: 'Sub Agency', width: '20%' }]} rows={agentTableData} valueKey="agent_code" onSelect={row => set('toAgent', row.agent_code)} disabled={!isEnabled} />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          )}

        </div>

        {/* ── Certificates Section (Common for all tabs) ── */}
        <div style={{ padding: '0 14px 14px 14px', borderTop: '1px solid #e2e8f0', background: '#ffffff', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '11px', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', padding: '6px 10px', background: 'linear-gradient(90deg,#e8edf5,#f1f4f9)', borderRadius: '4px' }}>Certificates</div>
          {/* Input row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr)) 36px', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
            {(['certNo', 'availableUnits', 'transferUnits', 'balanceUnits', 'certAmount', 'blockedUnits'] as const).map((f, i) => (
              <input key={f} className="setup-input-field" type={i > 0 ? 'number' : 'text'} value={(form as any)[f]} onChange={e => {
                set(f, e.target.value);
                if (f === 'transferUnits') {
                  const avail = parseFloat(form.availableUnits) || 0;
                  set('balanceUnits', (avail - (parseFloat(e.target.value) || 0)).toString());
                }
              }} style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }} disabled={!isEnabled}
                placeholder={['Certificate No', 'Available Units', 'Transfer Units', 'Balance Units', 'Amount', 'Blocked Units'][i]} />
            ))}
            <button onClick={() => {
              if (!isEnabled || !form.certNo) return;
              setCertRows(p => [...p, { certificateNo: form.certNo, availableUnits: form.availableUnits, transferUnits: form.transferUnits, balanceUnits: form.balanceUnits, amount: form.certAmount, blockedUnits: form.blockedUnits }]);
              setForm(p => ({ ...p, certNo: '', availableUnits: '', transferUnits: '', balanceUnits: '', certAmount: '', blockedUnits: '' }));
            }} disabled={!isEnabled || !form.certNo}
              style={{ background: isEnabled && form.certNo ? '#b45309' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '3px', width: '36px', height: '28px', fontSize: '14px', fontWeight: 700, cursor: isEnabled && form.certNo ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} title="Add">▼</button>
          </div>
          {/* Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Certificate No', 'Available Units', 'Transfer Units', 'Balance Units', 'Amount', 'Blocked Units'].map((h, i, arr) => (
                    <th key={h} style={{ ...tableHeaderStyle, borderRight: i < arr.length - 1 ? '1px solid #e2e8f0' : 'none' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certRows.length === 0
                  ? <tr><td colSpan={6} style={{ padding: '18px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No records</td></tr>
                  : certRows.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={tableCellStyle}>{r.certificateNo}</td>
                      <td style={tableCellStyle}>{r.availableUnits}</td>
                      <td style={tableCellStyle}>{r.transferUnits}</td>
                      <td style={tableCellStyle}>{r.balanceUnits}</td>
                      <td style={tableCellStyle}>{r.amount}</td>
                      <td style={{ ...tableCellStyle, borderRight: 'none' }}>{r.blockedUnits}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '5px', fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Single click to select · Double click to full transfer.</div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// UNIT BLOCKING MODAL
// ========================================
function UnitBlockingModal({ onClose: _onClose }: { onClose: () => void }) {
  type UBTab = 'Blocking' | 'Releasing';

  const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState<'Block' | 'Release'>('Block');
  const [activeTab, setActiveTab] = useState<UBTab>('Blocking');
  const [blockedDate, setBlockedDate] = useState<Date | null>(new Date());

  const [showAccountSearch, setShowAccountSearch] = useState(false);
  const [showHolderSearch, setShowHolderSearch] = useState(false);

  const emptyForm = {
    holderAccNo: '', holderNo: '', holderName: '',
    fundCode: '', fundName: '',
    noOfUnits: '', totalAmount: '',
    refDoc: '', reason: '',
    blockingCategory: '', institution: '',
    redemption: '', unitsToAuto: '', amount: '',
    // Cert row
    certNo: '', availUnits: '', unitsToBR: '', balanceUnits: '', certAmount: '', certBlockedUnits: ''
  };

  const [form, setForm] = useState(emptyForm);
  const [gridRows, setGridRows] = useState<any[]>([]);
  const [releaseGridRows, setReleaseGridRows] = useState<any[]>([]);

  const tabs: UBTab[] = ['Blocking', 'Releasing'];

  const tableHeaderStyle: React.CSSProperties = {
    padding: '6px 10px',
    background: '#f1f5f9',
    fontWeight: 700,
    fontSize: '11px',
    color: '#374151',
    textAlign: 'left',
    borderBottom: '2px solid #cbd5e1',
    borderRight: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
  };
  const tableCellStyle: React.CSSProperties = {
    padding: '5px 10px',
    fontSize: '12px',
    color: '#1f2937',
    borderBottom: '1px solid #e2e8f0',
    borderRight: '1px solid #e2e8f0',
  };

  const fieldH = 28;
  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: fieldH, padding: '0 8px', fontSize: '12px',
    border: '1px solid #cfd8e3', borderRadius: '5px',
    background: isEnabled ? '#ffffff' : '#f0f4f8',
    color: '#1e293b', outline: 'none', width: '100%',
    boxSizing: 'border-box' as const,
    cursor: isEnabled ? 'text' : 'not-allowed',
    ...extra,
  });

  const LBL: React.CSSProperties = { fontSize: '11px', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' };

  const Field = ({ label, children, labelWidth = 100 }: { label: string; children: React.ReactNode; labelWidth?: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ ...LBL, width: labelWidth, flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* ── Sub-modals ── */}
      <AccountSearchModal
        isOpen={showAccountSearch}
        onClose={() => setShowAccountSearch(false)}
        onGet={r => setForm(p => ({ ...p, holderAccNo: r.accountNo || '' }))}
        onSelect={r => setForm(p => ({ ...p, holderAccNo: r.accountNo || '' }))}
        title="Search Account"
      />
      <HolderSearchModal
        isOpen={showHolderSearch}
        onClose={() => setShowHolderSearch(false)}
        onSelect={(r: HolderRecord) => {
          setForm(p => ({ ...p, holderNo: r.holderId, holderName: r.holderName }));
        }}
      />
      {/* Top Radio Row */}
      <div style={{ background: '#bfdbfe', padding: '6px 12px', borderRadius: '4px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, color: '#1e3a8a' }}>
          <input type="radio" checked={mode === 'Block'} onChange={() => { setMode('Block'); setActiveTab('Blocking'); }} disabled={!isEnabled} /> Block
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, color: '#1e3a8a' }}>
          <input type="radio" checked={mode === 'Release'} onChange={() => { setMode('Release'); setActiveTab('Releasing'); }} disabled={!isEnabled} /> Release
        </label>
      </div>

      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Field label="Unit Holder Acc No.">
            <input style={inp()} value={form.holderAccNo} onChange={e => setForm({ ...form, holderAccNo: e.target.value })} disabled={!isEnabled} />
            <button
              onClick={() => isEnabled && setShowAccountSearch(true)}
              style={{ height: 28, width: 28, background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '4px', cursor: isEnabled ? 'pointer' : 'not-allowed' }}
              disabled={!isEnabled}
            >
              A
            </button>
          </Field>
          <Field label="Unit Holder No.">
            <input style={inp()} value={form.holderNo} onChange={e => setForm({ ...form, holderNo: e.target.value })} disabled={!isEnabled} />
            <button
              onClick={() => isEnabled && setShowHolderSearch(true)}
              style={{ height: 28, width: 28, background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', cursor: isEnabled ? 'pointer' : 'not-allowed' }}
              disabled={!isEnabled}
            >
              H
            </button>
          </Field>
          <Field label="No of Unit"><input style={inp()} type="number" value={form.noOfUnits} onChange={e => setForm({ ...form, noOfUnits: e.target.value })} disabled={!isEnabled} /></Field>
          <Field label="Total Amount"><input style={inp()} type="number" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} disabled={!isEnabled} /></Field>
          <Field label="Reference Document"><input style={inp()} value={form.refDoc} onChange={e => setForm({ ...form, refDoc: e.target.value })} disabled={!isEnabled} /></Field>
        </div>

        {/* Right Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Field label="Fund">
            <FundDropdown value={form.fundCode} displayValue={form.fundName} onSelect={(c, n) => setForm({ ...form, fundCode: c, fundName: n })} disabled={!isEnabled} />
          </Field>
          <div style={{ display: 'flex', alignItems: 'center', height: fieldH }}>
            <input style={inp()} value={form.holderName} onChange={e => setForm({ ...form, holderName: e.target.value })} placeholder="Unit holder name" disabled={!isEnabled} />
          </div>
          <Field label="Blocking Category">
            <TableDropdown
              value={form.blockingCategory}
              displayValue={form.blockingCategory}
              columns={[{ key: 'BC_Code', header: 'BC Code' }, { key: 'Active', header: 'Active' }, { key: 'Description', header: 'Description' }]}
              rows={blockingCategoryData} valueKey="BC_Code" onSelect={r => setForm({ ...form, blockingCategory: r.BC_Code })} disabled={!isEnabled}
            />
          </Field>
          <Field label="Blocked Date">
            <DatePicker selected={blockedDate} onChange={d => setBlockedDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" disabled={!isEnabled} />
          </Field>
          <Field label="Institution">
            <TableDropdown
              value={form.institution}
              displayValue={form.institution}
              dropdownWidth={1100}
              columns={[
                { key: 'INS_Code', header: 'INS_Code', width: '80px' }, { key: 'Description', header: 'Description', width: '200px' }, { key: 'active', header: 'active', width: '70px' },
                { key: 'INS_Category', header: 'INS_Categpory', width: '100px' }, { key: 'Address1', header: 'Address 1', width: '120px' }, { key: 'Address2', header: 'address2', width: '120px' },
                { key: 'Address3', header: 'address 3', width: '120px' }, { key: 'Cont_person', header: 'Cont_person', width: '120px' }, { key: 'Cont_no', header: 'Cont_no', width: '120px' }
              ]}
              rows={institutionData} valueKey="INS_Code" onSelect={r => setForm({ ...form, institution: r.INS_Code })} disabled={!isEnabled}
            />
          </Field>
        </div>

        {/* Full width row for Reason */}
        <div style={{ gridColumn: 'span 2' }}>
          <Field label="Reason to Block / Release" labelWidth={140}>
            <input style={inp()} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} disabled={!isEnabled} />
          </Field>
        </div>
      </div>

      {/* Unit Price Fieldset */}
      <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px', background: '#fff' }}>
        <legend style={{ fontSize: '11px', fontWeight: 700, color: '#1e3a8a', padding: '0 5px' }}>Unit Price</legend>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '15px' }}>
          <Field label="Redemption"><input style={inp()} value={form.redemption} onChange={e => setForm({ ...form, redemption: e.target.value })} disabled={!isEnabled} /></Field>
          <Field label={`Units to Auto ${mode}`} labelWidth={130}>
            <input style={inp()} value={form.unitsToAuto} onChange={e => setForm({ ...form, unitsToAuto: e.target.value })} disabled={!isEnabled} />
            <button style={{ height: 28, background: '#b45309', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: isEnabled ? 'pointer' : 'not-allowed' }} disabled={!isEnabled}>▼</button>
          </Field>
          <Field label="Amount" labelWidth={60}>
            <input style={inp()} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} disabled={!isEnabled} />
            <button style={{ height: 28, background: '#b45309', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: isEnabled ? 'pointer' : 'not-allowed' }} disabled={!isEnabled}>▼</button>
          </Field>
        </div>
      </fieldset>

      {/* ── Button Palette ── */}
      <CreationButtonPalette onNew={() => setIsEnabled(true)} onClear={() => { setIsEnabled(false); setForm(emptyForm); }} />

      {/* Tabbed Grid Bottom */}
      <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', minHeight: '200px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', background: '#f8fafc', padding: '0 8px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); setMode(tab === 'Blocking' ? 'Block' : 'Release'); }}
              style={{
                padding: '7px 12px',
                background: activeTab === tab ? '#ffffff' : 'transparent',
                color: activeTab === tab ? '#1e3a8a' : '#6b7280',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #1e3a8a' : '2px solid transparent',
                marginBottom: '-2px',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 700 : 600,
                fontSize: '11px',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: '8px', overflowY: 'auto' }}>
          {activeTab === 'Blocking' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr)) 36px', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                <input className="setup-input-field" value={form.certNo} onChange={e => setForm({ ...form, certNo: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Certificate No" />
                <input className="setup-input-field" value={form.availUnits} onChange={e => setForm({ ...form, availUnits: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Available Units" />
                <input className="setup-input-field" value={form.unitsToBR} onChange={e => setForm({ ...form, unitsToBR: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Units to Block" />
                <input className="setup-input-field" value={form.balanceUnits} onChange={e => setForm({ ...form, balanceUnits: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Balance Units" />
                <input className="setup-input-field" value={form.certAmount} onChange={e => setForm({ ...form, certAmount: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Amount" />
                <input className="setup-input-field" value={form.certBlockedUnits} onChange={e => setForm({ ...form, certBlockedUnits: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Blocked Units" />
                <button
                  onClick={() => {
                    if (!isEnabled || !form.certNo) return;
                    setGridRows(p => [...p, { ...form }]);
                    setForm(p => ({ ...p, certNo: '', availUnits: '', unitsToBR: '', balanceUnits: '', certAmount: '', certBlockedUnits: '' }));
                  }}
                  disabled={!isEnabled || !form.certNo}
                  style={{
                    background: isEnabled && form.certNo ? '#b45309' : '#9ca3af',
                    color: '#fff', border: 'none', borderRadius: '3px',
                    width: '36px', height: '28px', fontSize: '14px', fontWeight: 700,
                    cursor: isEnabled && form.certNo ? 'pointer' : 'not-allowed',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  ▼
                </button>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>CERTIFICATE NO</th>
                      <th style={tableHeaderStyle}>AVAILABLE UNITS</th>
                      <th style={tableHeaderStyle}>BLOCK UNITS</th>
                      <th style={tableHeaderStyle}>BALANCE UNITS</th>
                      <th style={tableHeaderStyle}>AMOUNT</th>
                      <th style={{ ...tableHeaderStyle, borderRight: 'none' }}>BLOCKED UNITS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '18px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>
                          No records
                        </td>
                      </tr>
                    ) : (
                      gridRows.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                          <td style={tableCellStyle}>{r.certNo}</td>
                          <td style={tableCellStyle}>{r.availUnits}</td>
                          <td style={tableCellStyle}>{r.unitsToBR}</td>
                          <td style={tableCellStyle}>{r.balanceUnits}</td>
                          <td style={tableCellStyle}>{r.certAmount}</td>
                          <td style={{ ...tableCellStyle, borderRight: 'none' }}>{r.certBlockedUnits}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '5px', fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Single click to select · Double click to full block.</div>
            </div>
          )}
          {activeTab === 'Releasing' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr)) 36px', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                <input className="setup-input-field" value={form.certNo} onChange={e => setForm({ ...form, certNo: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Certificate No" />
                <input className="setup-input-field" value={form.availUnits} onChange={e => setForm({ ...form, availUnits: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Available Units" />
                <input className="setup-input-field" value={form.unitsToBR} onChange={e => setForm({ ...form, unitsToBR: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Units to Release" />
                <input className="setup-input-field" value={form.balanceUnits} onChange={e => setForm({ ...form, balanceUnits: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Balance Units" />
                <input className="setup-input-field" value={form.certAmount} onChange={e => setForm({ ...form, certAmount: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Amount" />
                <input className="setup-input-field" value={form.certBlockedUnits} onChange={e => setForm({ ...form, certBlockedUnits: e.target.value })} style={{ width: '100%' }} disabled={!isEnabled} placeholder="Released Units" />
                <button
                  onClick={() => {
                    if (!isEnabled || !form.certNo) return;
                    setReleaseGridRows(p => [...p, { ...form }]);
                    setForm(p => ({ ...p, certNo: '', availUnits: '', unitsToBR: '', balanceUnits: '', certAmount: '', certBlockedUnits: '' }));
                  }}
                  disabled={!isEnabled || !form.certNo}
                  style={{
                    background: isEnabled && form.certNo ? '#b45309' : '#9ca3af',
                    color: '#fff', border: 'none', borderRadius: '3px',
                    width: '36px', height: '28px', fontSize: '14px', fontWeight: 700,
                    cursor: isEnabled && form.certNo ? 'pointer' : 'not-allowed',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  ▼
                </button>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>CERTIFICATE NO</th>
                      <th style={tableHeaderStyle}>AVAILABLE UNITS</th>
                      <th style={tableHeaderStyle}>RELEASE UNITS</th>
                      <th style={tableHeaderStyle}>BALANCE UNITS</th>
                      <th style={tableHeaderStyle}>AMOUNT</th>
                      <th style={{ ...tableHeaderStyle, borderRight: 'none' }}>RELEASED UNITS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {releaseGridRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '18px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>
                          No records
                        </td>
                      </tr>
                    ) : (
                      releaseGridRows.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                          <td style={tableCellStyle}>{r.certNo}</td>
                          <td style={tableCellStyle}>{r.availUnits}</td>
                          <td style={tableCellStyle}>{r.unitsToBR}</td>
                          <td style={tableCellStyle}>{r.balanceUnits}</td>
                          <td style={tableCellStyle}>{r.certAmount}</td>
                          <td style={{ ...tableCellStyle, borderRight: 'none' }}>{r.certBlockedUnits}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '5px', fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Single click to select · Double click to full release.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================
// DIVIDEND ISSUES MODAL
// ========================================
function DividendIssuesModal({ onClose: _onClose }: { onClose: () => void }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [form, setForm] = useState({
    fundCode: '', fundName: '',
    unitBalanceAsAt: null as Date | null,
    dividendPayDate: null as Date | null,
    dividendAmountPerUnit: '',
    dividendReinvestmentPriceDate: null as Date | null,
    dividendExDate: null as Date | null,
    periodEndDate: null as Date | null,
    noOfUnitsUnitBalance: '',
    declareAmount: '',
    dividendReinvestmentPrice: '',
    noOfHolders: '',
    amountMode: 'Truncate', amountPositions: '2',
    unitsMode: 'Truncate', unitsPositions: '2',
  });

  const fieldH = 28;

  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: fieldH,
    padding: '0 8px',
    fontSize: '12px',
    border: '1px solid #cfd8e3',
    borderRadius: '5px',
    background: isEnabled ? '#ffffff' : '#f0f4f8',
    color: '#1e293b',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    cursor: isEnabled ? 'text' : 'not-allowed',
    ...extra,
  });

  const LBL: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#475569',
    whiteSpace: 'nowrap',
  };

  const sectionCard: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '14px 16px',
  };

  const Row = ({ label, labelW = 200, children }: { label: string; labelW?: number; children: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: fieldH }}>
      <span style={{ ...LBL, width: labelW, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>{children}</div>
    </div>
  );

  const readOnlyInp: React.CSSProperties = {
    ...inp({ background: '#eff6ff', color: '#1e40af', fontWeight: 600, border: '1px solid #bfdbfe' }),
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* ── Header / Fund Row ─────────────────────────────── */}
      <div style={{ ...sectionCard, display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <span style={{ ...LBL, fontSize: '12px', width: 90, flexShrink: 0 }}>Fund Name</span>
          <div style={{ flex: 1 }}>
            <FundDropdown
              value={form.fundCode}
              displayValue={form.fundName}
              onSelect={(c, n) => setForm({ ...form, fundCode: c, fundName: n })}
              disabled={!isEnabled}
            />
          </div>
        </div>
        <button
          style={{
            height: 28, padding: '0 14px', fontSize: '12px', fontWeight: 600,
            background: isEnabled ? '#ffffff' : '#1e3a8a',
            color: isEnabled ? '#1e293b' : '#ffffff',
            border: `1px solid ${isEnabled ? '#cbd5e1' : '#1e3a8a'}`,
            borderRadius: '5px', cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            flexShrink: 0,
          }}
          onClick={() => setIsEnabled(v => !v)}
        >
          Developer
        </button>
      </div>

      {/* ── Main Two-Column Form ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

        {/* Left Section */}
        <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px 16px', background: '#fff', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <legend style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', padding: '0 6px' }}>
            Dividend Details
          </legend>

          {/* Unit Balance as at + Load Units */}
          <Row label="Unit Balance as at" labelW={200}>
            <div style={{ flex: 1 }}>
              <DatePicker
                selected={form.unitBalanceAsAt}
                onChange={d => setForm({ ...form, unitBalanceAsAt: d })}
                dateFormat="dd/MMM/yyyy"
                placeholderText="dd/MMM/yyyy"
                className="date-picker-input"
                disabled={!isEnabled}
              />
            </div>
            <button
              style={{ height: fieldH, padding: '0 10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', color: '#334155', cursor: isEnabled ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', flexShrink: 0 }}
              disabled={!isEnabled}
            >
              Load Units
            </button>
          </Row>

          <Row label="Dividend Pay (Reinvest) Date" labelW={200}>
            <div style={{ flex: 1 }}>
              <DatePicker
                selected={form.dividendPayDate}
                onChange={d => setForm({ ...form, dividendPayDate: d })}
                dateFormat="dd/MMM/yyyy"
                placeholderText="dd/MMM/yyyy"
                className="date-picker-input"
                disabled={!isEnabled}
              />
            </div>
          </Row>

          <Row label="Dividend Amount Per Unit" labelW={200}>
            <input style={inp()} type="number" value={form.dividendAmountPerUnit} onChange={e => setForm({ ...form, dividendAmountPerUnit: e.target.value })} disabled={!isEnabled} />
          </Row>

          {/* Reinvestment Price Date + Reinvest Price btn */}
          <Row label="Dividend Reinvestment Price Date" labelW={200}>
            <div style={{ flex: 1 }}>
              <DatePicker
                selected={form.dividendReinvestmentPriceDate}
                onChange={d => setForm({ ...form, dividendReinvestmentPriceDate: d })}
                dateFormat="dd/MMM/yyyy"
                placeholderText="dd/MMM/yyyy"
                className="date-picker-input"
                disabled={!isEnabled}
              />
            </div>
            <button
              style={{ height: fieldH, padding: '0 10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', color: '#334155', cursor: isEnabled ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', flexShrink: 0 }}
              disabled={!isEnabled}
            >
              Reinvest Price
            </button>
          </Row>

          <Row label="Dividend Reinvestment Price" labelW={200}>
            <input style={inp()} type="number" value={form.dividendReinvestmentPrice} onChange={e => setForm({ ...form, dividendReinvestmentPrice: e.target.value })} disabled={!isEnabled} />
          </Row>

          <Row label="Dividend (Ex) Date" labelW={200}>
            <div style={{ flex: 1 }}>
              <DatePicker
                selected={form.dividendExDate}
                onChange={d => setForm({ ...form, dividendExDate: d })}
                dateFormat="dd/MMM/yyyy"
                placeholderText="dd/MMM/yyyy"
                className="date-picker-input"
                disabled={!isEnabled}
              />
            </div>
          </Row>
        </fieldset>

        {/* Right Section */}
        <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px 16px', background: '#fff', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <legend style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', padding: '0 6px' }}>
            Computed Values
          </legend>

          <Row label="Period End Date" labelW={200}>
            <div style={{ flex: 1 }}>
              <DatePicker
                selected={form.periodEndDate}
                onChange={d => setForm({ ...form, periodEndDate: d })}
                dateFormat="dd/MMM/yyyy"
                placeholderText="dd/MMM/yyyy"
                className="date-picker-input"
                disabled={!isEnabled}
              />
            </div>
          </Row>

          <Row label="No of Units (Unit Balance)" labelW={200}>
            <input style={readOnlyInp} value={form.noOfUnitsUnitBalance} readOnly placeholder="—" />
          </Row>

          <Row label="Declare Amount" labelW={200}>
            <input style={readOnlyInp} value={form.declareAmount} readOnly placeholder="—" />
          </Row>

          {/* No of Holders highlight badge */}
          <div style={{ marginTop: '8px', padding: '10px 14px', background: 'linear-gradient(135deg,#dbeafe,#eff6ff)', border: '1px solid #bfdbfe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af' }}>No of Holders</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#1e3a8a', letterSpacing: '0.02em' }}>{form.noOfHolders || '0'}</span>
          </div>
        </fieldset>
      </div>

      {/* ── Computation Method ────────────────────────────── */}
      <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 16px', background: '#fff', margin: 0 }}>
        <legend style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', padding: '0 6px' }}>
          Computation Method — Dividend Amount &amp; Reinvested Units
        </legend>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* Amount */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...LBL, width: 55, flexShrink: 0 }}>Amount</span>
            <select
              style={{ height: fieldH, fontSize: '12px', border: '1px solid #cfd8e3', borderRadius: '5px', padding: '0 6px', background: isEnabled ? '#fff' : '#f0f4f8', cursor: isEnabled ? 'pointer' : 'not-allowed', flex: 1 }}
              value={form.amountMode}
              onChange={e => setForm({ ...form, amountMode: e.target.value })}
              disabled={!isEnabled}
            >
              <option value="Truncate">Truncate</option>
              <option value="Round">Round</option>
            </select>
            <span style={{ ...LBL, flexShrink: 0 }}>Positions</span>
            <input
              style={{ ...inp({ width: 48, textAlign: 'center' }) }}
              value={form.amountPositions}
              onChange={e => setForm({ ...form, amountPositions: e.target.value })}
              disabled={!isEnabled}
            />
          </div>
          {/* Units */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...LBL, width: 55, flexShrink: 0 }}>Units</span>
            <select
              style={{ height: fieldH, fontSize: '12px', border: '1px solid #3b82f6', borderRadius: '5px', padding: '0 6px', background: isEnabled ? '#fff' : '#f0f4f8', cursor: isEnabled ? 'pointer' : 'not-allowed', flex: 1 }}
              value={form.unitsMode}
              onChange={e => setForm({ ...form, unitsMode: e.target.value })}
              disabled={!isEnabled}
            >
              <option value="Truncate">Truncate</option>
              <option value="Round">Round</option>
            </select>
            <span style={{ ...LBL, flexShrink: 0 }}>Positions</span>
            <input
              style={{ ...inp({ width: 48, textAlign: 'center' }) }}
              value={form.unitsPositions}
              onChange={e => setForm({ ...form, unitsPositions: e.target.value })}
              disabled={!isEnabled}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Button Palette ────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap',
        padding: '10px 14px',
        background: 'linear-gradient(90deg,#f1f4f9 0%,#e8edf5 100%)',
        borderRadius: '8px', border: '1px solid rgba(0,0,0,0.07)', flexShrink: 0,
      }}>
        <button className="setup-btn setup-btn-new" onClick={() => setIsEnabled(true)}><span className="setup-btn-icon">＋</span>New</button>
        <button className="setup-btn setup-btn-save" disabled={!isEnabled}><span className="setup-btn-icon">💾</span>Save</button>
        <button className="setup-btn setup-btn-delete" disabled={!isEnabled}><span className="setup-btn-icon">🗑️</span>Delete</button>
        <button className="setup-btn setup-btn-print"><span className="setup-btn-icon">🖨️</span>Print</button>
        <button className="setup-btn setup-btn-clear" onClick={() => { setIsEnabled(false); setForm({ fundCode: '', fundName: '', unitBalanceAsAt: null, dividendPayDate: null, dividendAmountPerUnit: '', dividendReinvestmentPriceDate: null, dividendExDate: null, periodEndDate: null, noOfUnitsUnitBalance: '', declareAmount: '', dividendReinvestmentPrice: '', noOfHolders: '', amountMode: 'Truncate', amountPositions: '2', unitsMode: 'Truncate', unitsPositions: '2' }); }}><span className="setup-btn-icon">✕</span>Clear</button>
        <button className="setup-btn" style={{ background: '#0369a1', boxShadow: '0 2px 8px rgba(3,105,161,0.22)' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f97316')}
          onMouseLeave={e => (e.currentTarget.style.background = '#0369a1')}
        ><span className="setup-btn-icon">📤</span>UHT xn Data Upload</button>
        {/* Dividend-specific extras */}
        <button className="setup-btn" disabled={!isEnabled}
          style={{ background: isEnabled ? '#0c4a6e' : undefined, boxShadow: isEnabled ? '0 2px 8px rgba(12,74,110,0.22)' : undefined }}
        ><span className="setup-btn-icon">⚙️</span>Compute</button>
        <button className="setup-btn" disabled={!isEnabled}
          style={{ background: isEnabled ? '#0c4a6e' : undefined, boxShadow: isEnabled ? '0 2px 8px rgba(12,74,110,0.22)' : undefined }}
        ><span className="setup-btn-icon">🖨️</span>Status Print</button>

      </div>

    </div >
  );
}

// ========================================
// REDEMPTION CHEQUE UPDATE MODAL
// ========================================
function RedemptionChequeUpdateModal() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(new Date('2025-05-17'));
  const [toDate, setToDate] = useState<Date | null>(new Date('2025-05-24'));
  const [form, setForm] = useState({
    fundCode: 'F005',
    fundName: 'Ceylon Income Fund',
    account: '',
    uhRegNo: '',
    transCode: '',
    chequeNo: '',
  });

  const fieldH = 28;
  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: fieldH, padding: '0 8px', fontSize: '12px',
    border: '1px solid #cfd8e3', borderRadius: '4px',
    background: isEnabled ? '#ffffff' : '#f8f9fa',
    color: '#1e293b', outline: 'none', width: '100%',
    boxSizing: 'border-box',
    cursor: isEnabled ? 'text' : 'not-allowed',
    ...extra,
  });

  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: '#1e3a8a',
    textTransform: 'uppercase', whiteSpace: 'nowrap',
    minWidth: '80px', textAlign: 'right',
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: '6px 10px', background: '#f8fafc', fontWeight: 700,
    fontSize: '11px', color: '#1e3a8a', textAlign: 'left',
    borderBottom: '2px solid #cbd5e1', borderRight: '1px solid #e2e8f0',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', minHeight: 0, border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>


      <div style={{ padding: '12px', background: '#e2f3e8' }}>
        {/* Top Selection Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Fund Selection */}
          <div style={{ border: '1px solid #99ccaa', padding: '10px', borderRadius: '2px', background: '#ccebd6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={labelStyle}>Fund</span>
              <FundDropdown
                value={form.fundCode}
                displayValue={form.fundName}
                onSelect={(code, name) => setForm(f => ({ ...f, fundCode: code, fundName: name }))}
                disabled={!isEnabled}
              />
            </div>
          </div>

          {/* Transaction Date range */}
          <div style={{ border: '1px solid #99ccaa', padding: '4px 10px 10px', borderRadius: '2px', background: '#ccebd6', position: 'relative' }}>
            <span style={{
              position: 'absolute', top: '-10px', left: '10px', background: '#ccebd6',
              padding: '0 5px', fontSize: '11px', fontWeight: 700, color: '#1e3a8a'
            }}>Transaction Date</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <span style={labelStyle}>From</span>
              <DatePicker selected={fromDate} onChange={d => setFromDate(d)} className="date-picker-input" dateFormat="dd/MM/yyyy" />
              <span style={labelStyle}>To</span>
              <DatePicker selected={toDate} onChange={d => setToDate(d)} className="date-picker-input" dateFormat="dd/MM/yyyy" />
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div style={{ marginTop: '12px', height: '200px', background: '#fff', border: '1px solid #99ccaa', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th style={tableHeaderStyle}>Acc No</th>
                <th style={tableHeaderStyle}>Re-Cheque ...</th>
                <th style={tableHeaderStyle}>Transaction ...</th>
                <th style={tableHeaderStyle}>Price</th>
                <th style={tableHeaderStyle}>Units</th>
                <th style={tableHeaderStyle}>Amount</th>
                <th style={tableHeaderStyle}>Transaction</th>
                <th style={tableHeaderStyle}>Tr No</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty rows to mimic screenshot */}
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} style={{ height: '24px' }}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} style={{ border: '1px solid #eee' }}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Input Area */}
        <div style={{ marginTop: '12px', background: '#f0f0f0', padding: '10px', border: '1px solid #ccc' }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                style={inp({ width: '120px' })}
                value={form.account}
                onChange={e => setForm(f => ({ ...f, account: e.target.value }))}
                disabled={!isEnabled}
                placeholder="ACCOUNT"
                readOnly={!!form.account && isEnabled}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                style={inp({ width: '100px' })}
                value={form.uhRegNo}
                onChange={e => setForm(f => ({ ...f, uhRegNo: e.target.value }))}
                disabled={!isEnabled}
                placeholder="UH.REG.NO"
                readOnly={!!form.uhRegNo && isEnabled}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                style={inp({ width: '100px' })}
                value={form.transCode}
                onChange={e => setForm(f => ({ ...f, transCode: e.target.value }))}
                disabled={!isEnabled}
                placeholder="TRANS CODE"
                readOnly={!!form.transCode && isEnabled}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                style={inp({ width: '120px' })}
                value={form.chequeNo}
                onChange={e => setForm(f => ({ ...f, chequeNo: e.target.value }))}
                disabled={!isEnabled}
                placeholder="CHEQUE NO"
                readOnly={!!form.chequeNo && isEnabled}
              />
            </div>
            <input style={inp({ width: '100px' })} disabled={!isEnabled} placeholder="TOTAL" />
          </div>
        </div>

        <CreationButtonPalette
          onNew={() => setIsEnabled(true)}
          onClear={() => {
            setIsEnabled(false);
            setForm({
              fundCode: 'F005',
              fundName: 'Ceylon Income Fund',
              account: '',
              uhRegNo: '',
              transCode: '',
              chequeNo: '',
            });
          }}
        />
      </div>
    </div>
  );
}


// ========================================
// CHEQUE RE PRINTING MODAL
// ========================================
function ChequeRePrintingModal({ onClose: _onClose }: { onClose: () => void }) {
  const [divDate, setDivDate] = useState<Date | null>(new Date('2025-05-07'));
  const [fund, setFund] = useState({ code: 'F001', name: 'Ceylon Tourism Fund' });
  const [isEnabled, setIsEnabled] = useState(false);

  // Table columns
  const columns = [
    { key: 'fund', label: 'Fund' },
    { key: 'accNo', label: 'Account No' },
    { key: 'warrantNo', label: 'Warrant No' },
    { key: 'chqDate', label: 'CHQ. Date' },
    { key: 'bankCode', label: 'Bank Code' },
    { key: 'chqNo', label: 'Cheque No' },
    { key: 'amount', label: 'Amount' },
    { key: 'paidTo', label: 'Paid To' },
  ];

  const tableHeaderStyle: React.CSSProperties = {
    background: '#ffffff',
    padding: '6px 8px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#4b5563',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    borderRight: '1px solid #f3f4f6',
    whiteSpace: 'nowrap',
  };

  const tableRowStyle: React.CSSProperties = {
    borderBottom: '1px solid #f3f4f6',
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '6px 8px',
    fontSize: '11px',
    color: '#1f2937',
    borderRight: '1px solid #f3f4f6',
  };

  const renderTable = () => (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      background: '#fff',
    }}>
      <div style={{ maxHeight: '180px', overflowY: 'auto', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ position: 'sticky', top: 0, zIndex: 1, background: '#fff' }}>
              {columns.map(col => (
                <th key={col.key} style={tableHeaderStyle}>{col.label}</th>
              ))}
              <th style={tableHeaderStyle}></th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <tr key={i} style={tableRowStyle}>
                {columns.map(col => (
                  <td key={col.key} style={tableCellStyle}>&nbsp;</td>
                ))}
                <td style={tableCellStyle}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      background: '#f3f4f6',
      borderRadius: '8px',
      padding: '0 0 12px 0',
      overflow: 'visible'
    }}>

      <div style={{ padding: '12px 15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Selection Area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          justifyContent: 'center',
          background: '#fff',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>Fund</span>
            <div style={{ width: '300px' }}>
              <FundDropdown
                value={fund.code}
                displayValue={fund.name}
                onSelect={(code, name) => setFund({ code, name })}
                disabled={!isEnabled}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>Dividend Date</span>
            <DatePicker
              selected={divDate}
              onChange={date => setDivDate(date)}
              dateFormat="dd/MMM/yyyy"
              disabled={!isEnabled}
              className="setup-datepicker-input"
              customInput={
                <div style={{
                  padding: '5px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  background: isEnabled ? '#fff' : '#f9fafb',
                  cursor: isEnabled ? 'pointer' : 'not-allowed',
                  opacity: isEnabled ? 1 : 0.7
                }}>
                  {divDate ? divDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '/') : 'Select Date'}
                  <span style={{ marginLeft: '8px', color: '#9ca3af' }}>📅</span>
                </div>
              }
            />
          </div>

          <button
            disabled={!isEnabled}
            style={{
              background: isEnabled ? '#fff' : '#f3f4f6',
              border: `1px solid ${isEnabled ? '#3b82f6' : '#d1d5db'}`,
              color: isEnabled ? '#3b82f6' : '#9ca3af',
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isEnabled ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              opacity: isEnabled ? 1 : 0.7
            }}
            onMouseEnter={e => { if (isEnabled) e.currentTarget.style.background = '#eff6ff'; }}
            onMouseLeave={e => { if (isEnabled) e.currentTarget.style.background = isEnabled ? '#fff' : '#f3f4f6'; }}
          >
            Load Cheques
          </button>
        </div>

        {/* Tables Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: '#2563eb', fontSize: '12px', fontWeight: 700 }}>
            Double click to Update the Cheque number
          </div>

          {renderTable()}

          <CreationButtonPalette
            onNew={() => setIsEnabled(true)}
            onClear={() => {
              setIsEnabled(false);
              setDivDate(new Date('2025-05-07'));
              setFund({ code: 'F001', name: 'Ceylon Tourism Fund' });
            }}
          />

          {/* Filtering row between tables */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr) 28px',
            gap: '4px',
            background: '#e5e7eb',
            padding: '4px',
            borderRadius: '4px'
          }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <input key={i} style={{
                height: '24px',
                border: '1px solid #d1d5db',
                borderRadius: '2px',
                padding: '0 4px',
                fontSize: '11px'
              }} />
            ))}
            <button style={{
              background: '#ea580c',
              border: 'none',
              borderRadius: '2px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              ▼
            </button>
          </div>

          {renderTable()}
        </div>
      </div>
    </div>
  );
}


// ========================================
// WEB DATA DOWNLOADING MODAL
// ========================================
function WebDataDownloadingModal({ onClose }: { onClose: () => void }) {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [status, setStatus] = useState('Ready to download');
  const [isDownloading, setIsDownloading] = useState(false);

  const mockData = [
    { code: '11', name: 'test1', date: '2025/05/25', balance: '2,204,674.86' },
    { code: '12', name: 'Ceylon Income Fund', date: '2025/05/23', balance: '96,321,744.65' },
    { code: '13', name: 'Ceylon Tourism Fund', date: '2025/05/23', balance: '2,733,504.71' },
    { code: '14', name: 'Ceylon Financial Sector Fund', date: '2025/05/24', balance: '7,150,433.92' },
    { code: '15', name: 'Ceylon IPO Fund', date: '2025/05/23', balance: '3,404,630.87' },
    { code: '16', name: 'Ceylon Gilt Edged Fund', date: '2019/09/24', balance: '0' },
  ];

  const handleDownload = () => {
    setIsDownloading(true);
    setStatus('Initializing download...');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setDownloadProgress(progress);
      if (progress >= 30) setStatus('Downloading fund data...');
      if (progress >= 70) setStatus('Calculating unit balances...');
      if (progress >= 100) {
        clearInterval(interval);
        setIsDownloading(false);
        setStatus('Download Complete');
      }
    }, 100);
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: '10px 12px',
    background: '#f8fafc',
    color: '#475569',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'left',
    borderBottom: '2px solid #e2e8f0',
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '10px 12px',
    fontSize: '12px',
    color: '#1e293b',
    borderBottom: '1px solid #f1f5f9',
  };

  return (
    <div style={{ padding: '4px', display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* Main Table Container */}
      <div style={{ flex: 1, background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th style={tableHeaderStyle}>Fund Code</th>
                <th style={tableHeaderStyle}>Fund Name</th>
                <th style={tableHeaderStyle}>Fund Date</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Unit Balance</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={tableCellStyle}>{row.code}</td>
                  <td style={{ ...tableCellStyle, fontWeight: 600 }}>{row.name}</td>
                  <td style={tableCellStyle}>{row.date}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold', color: '#0f172a' }}>{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress and Actions Container */}
      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Progress Bar Label Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Processing: <span style={{ color: '#2563eb' }}>{status}</span></div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>{downloadProgress}%</div>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
            <div style={{ height: '100%', width: `${downloadProgress}%`, background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)', transition: 'width 0.3s ease', borderRadius: '10px' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Output Path:</div>
              <div style={{ fontSize: '12px', color: '#1e293b', fontWeight: 'bold', fontFamily: 'monospace' }}>C:\IRNFO_Downloads\ID_09032026.csv</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                full-width="false"
                onClick={handleDownload}
                disabled={isDownloading}
                style={{
                  padding: '8px 25px',
                  background: isDownloading ? '#94a3b8' : '#059669',
                  color: isDownloading ? '#fff' : '#fbbf24',
                  border: isDownloading ? 'none' : '2px solid #059669',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: isDownloading ? 'not-allowed' : 'pointer',
                  boxShadow: isDownloading ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase',
                }}
              >
                {isDownloading ? '⏳ Downloading...' : 'Download Data'}
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 25px',
                  background: '#059669',
                  color: '#fff',
                  border: '2px solid #059669',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// STANDING INSTRUCTIONS PROCESSING MODAL
// ========================================
function StandingInstructionsProcessingModal({ onClose: _onClose }: { onClose: () => void }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [form, setForm] = useState({
    fundCode: '',
    fundName: '',
    instructionType: 'SIP', // SIP or RW
    accNo: '',
  });
  const [processDate, setProcessDate] = useState<Date | null>(new Date('2026-03-10'));

  const fieldH = 32;

  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: fieldH, padding: '0 10px', fontSize: '12px',
    border: '1px solid #cbd5e1', borderRadius: '5px',
    background: isEnabled ? '#ffffff' : '#f8fafc',
    color: '#1e293b', outline: 'none', width: '100%',
    boxSizing: 'border-box',
    cursor: isEnabled ? 'text' : 'not-allowed',
    transition: 'border-color 0.2s',
    ...extra,
  });

  const LBL: React.CSSProperties = {
    fontSize: '10px', fontWeight: 700, color: '#64748b',
    display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  const TH: React.CSSProperties = {
    padding: '7px 10px', background: '#f1f5f9', fontWeight: 700,
    fontSize: '10px', color: '#475569', textAlign: 'left',
    borderBottom: '2px solid #cbd5e1', borderRight: '1px solid #e2e8f0',
    whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.03em',
  };
  const TD: React.CSSProperties = {
    padding: '7px 10px', fontSize: '12px', color: '#1e293b',
    borderBottom: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9',
    whiteSpace: 'nowrap',
  };

  const columns = [
    'Fund Code', 'Account No', 'Holder Name', 'Instruct Type',
    'Instruction', 'Date', 'Frequency', 'Date Gap',
    'Amount', 'Last Processed', 'Date From', 'Date To',
  ];

  const sideBtn = (extra?: React.CSSProperties): React.CSSProperties => ({
    width: '100%', padding: '6px 0', fontSize: '11px', fontWeight: 700,
    border: '1px solid #cbd5e1', borderRadius: '5px',
    background: '#ffffff', color: isEnabled ? '#334155' : '#94a3b8',
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    transition: 'all 0.15s', textAlign: 'center' as const,
    textTransform: 'uppercase',
    ...extra,
  });

  const renderTable = (height: string = '160px') => (
    <div style={{
      flex: 1, background: '#ffffff', border: '1px solid #dde3ec',
      borderRadius: '7px', overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: height }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f1f5f9' }}>
            <tr>{columns.map((c, i) => <th key={i} style={TH}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}
                style={{ background: i % 2 === 0 ? '#fff' : '#fafbfc', transition: 'background 0.12s' }}
                onMouseEnter={e => isEnabled && (e.currentTarget.style.background = '#eff6ff')}
                onMouseLeave={e => isEnabled && (e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafbfc')}
              >
                {columns.map((_, j) => <td key={j} style={TD}>&nbsp;</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0, padding: '4px' }}>

      {/* ── Top Controls ── */}
      <div style={{
        background: '#ffffff', border: '1px solid #e2e8f0',
        borderRadius: '8px', padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>

          {/* Fund Name */}
          <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={LBL}>Fund Name</span>
            <FundDropdown
              value={form.fundCode}
              displayValue={form.fundName}
              onSelect={(code, name) => setForm(prev => ({ ...prev, fundCode: code, fundName: name }))}
              disabled={!isEnabled}
            />
          </div>

          {/* Instruction Type */}
          <div style={{ flex: '1.5 1 350px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={LBL}>Instruction Type</span>
            <div style={{
              display: 'flex', gap: '15px', alignItems: 'center',
              height: fieldH, padding: '0 12px',
              background: isEnabled ? '#ffffff' : '#f8fafc',
              border: `1px solid ${isEnabled ? '#cbd5e1' : '#e2e8f0'}`,
              borderRadius: '5px',
            }}>
              {[
                { val: 'SIP', label: 'Systematic Investment Plan (SIP)' },
                { val: 'RW', label: 'Regular Withdrawal (RW)' },
              ].map(opt => (
                <label key={opt.val} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '11px', fontWeight: 600, color: '#334155',
                  cursor: isEnabled ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap',
                }}>
                  <input
                    type="radio" name="sipType" value={opt.val}
                    checked={form.instructionType === opt.val}
                    onChange={() => isEnabled && setForm(prev => ({ ...prev, instructionType: opt.val }))}
                    disabled={!isEnabled}
                    style={{ width: '14px', height: '14px', accentColor: '#2563eb' }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Process Date */}
          <div style={{ flex: '0 0 140px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={LBL}>Process Date</span>
            <DatePicker
              selected={processDate}
              onChange={(d: Date | null) => isEnabled && setProcessDate(d)}
              dateFormat="dd/MMM/yyyy"
              disabled={!isEnabled}
              customInput={
                <div style={{
                  ...inp(), display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', cursor: isEnabled ? 'pointer' : 'not-allowed',
                }}>
                  <span style={{ fontSize: '12px', color: processDate ? '#1e293b' : '#94a3b8' }}>
                    {processDate ? processDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '/') : 'Select date'}
                  </span>
                  <span>📅</span>
                </div>
              }
            />
          </div>

          {/* Acc No */}
          <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={LBL}>Account Number</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                style={{ ...inp(), flex: 1 }}
                value={form.accNo}
                placeholder="Acc No."
                onChange={e => setForm(prev => ({ ...prev, accNo: e.target.value }))}
                disabled={!isEnabled}
              />
              <button
                style={{
                  width: '30px', height: fieldH, background: '#1e3a8a', color: '#fff',
                  border: 'none', borderRadius: '4px', cursor: isEnabled ? 'pointer' : 'not-allowed',
                  fontSize: '12px', fontWeight: 800, opacity: isEnabled ? 1 : 0.6
                }}
                disabled={!isEnabled}
              >A</button>
              <button
                style={{
                  height: fieldH, padding: '0 12px', background: '#1e3a8a', color: '#fff',
                  border: 'none', borderRadius: '4px', cursor: isEnabled ? 'pointer' : 'not-allowed',
                  fontSize: '11px', fontWeight: 700, opacity: isEnabled ? 1 : 0.6,
                  display: 'flex', alignItems: 'center', gap: '5px'
                }}
                disabled={!isEnabled}
              >
                <span>🔍</span> Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid Areas ── */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {renderTable('180px')}
          {renderTable('180px')}
        </div>

        <div style={{ width: '100px', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '40px' }}>
          <button style={sideBtn()} disabled={!isEnabled}>Create</button>
          <button style={sideBtn()} disabled={!isEnabled}>Suppress</button>
          <div style={{ height: '140px' }}></div>
          <button style={sideBtn()} disabled={!isEnabled}>↑ Up</button>
        </div>
      </div>

      {/* ── Footer Palette ── */}
      <CreationButtonPalette
        onNew={() => setIsEnabled(true)}
        onProcess={() => console.log('Processing...')}
        onClear={() => {
          setIsEnabled(false);
          setForm({ fundCode: '', fundName: '', instructionType: 'SIP', accNo: '' });
          setProcessDate(new Date('2026-03-10'));
        }}
        onUpdate={() => console.log('Updating...')}
        isEnabled={isEnabled}
      />
    </div>
  );
}

// ========================================
// STANDING INSTRUCTIONS MODAL
// ========================================
function StandingInstructionsModal() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showAccountSearch, setShowAccountSearch] = useState(false);
  const [form, setForm] = useState({
    accNo: '',
    holderNo: '',
    fundCode: '',
    fundName: '',
    instructionType: 'SIP', // SIP, RWCA, RWTP
    instructionNo: '',
    frequency: 'Monthly',
    description: '',
    applyFrom: new Date(),
    applyTo: new Date(),
    active: true,
    effectDate: new Date(),
    lastProcessedOn: new Date(),
    returnBasis: false,
    amount: '',
    bankCode: '',
    bankAccount: '',
    bankAccountName: '',
    remark: '',
    holderName: '',
    printReq: false,
    activeOnly: false,
    allTypes: false,
    frequencyDDD: '0',
  });

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const fieldH = 28;
  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: fieldH, padding: '0 8px', fontSize: '12px',
    border: '1px solid #cfd8e3', borderRadius: '5px',
    background: isEnabled ? '#ffffff' : '#f0f4f8',
    color: '#1e293b', outline: 'none', width: '100%',
    boxSizing: 'border-box',
    cursor: isEnabled ? 'text' : 'not-allowed',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    ...extra,
  });

  const LBL: React.CSSProperties = {
    fontSize: '10px', fontWeight: 700, color: '#5a6a85',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    whiteSpace: 'nowrap', minWidth: '110px', textAlign: 'right'
  };

  const RadioGroup = ({ label, options, value, onChange, name, redSelection = false, useFieldset = false }: {
    label: string, options: { label: string, value: string }[], value: string, onChange: (v: string) => void, name: string, redSelection?: boolean, useFieldset?: boolean
  }) => {
    const content = (
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', padding: useFieldset ? '8px 4px 4px 4px' : '0' }}>
        {options.map(opt => (
          <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#374151', cursor: isEnabled ? 'pointer' : 'not-allowed' }}>
            <input
              type="radio"
              name={name}
              checked={value === opt.value}
              onChange={() => isEnabled && onChange(opt.value)}
              disabled={!isEnabled}
              style={{
                accentColor: redSelection && value === opt.value ? '#ef4444' : '#1e3a8a',
                width: '14px', height: '14px'
              }}
            />
            <span style={{ color: redSelection && value === opt.value ? '#ef4444' : '#374151', transition: 'color 0.2s' }}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    );

    if (useFieldset) {
      return (
        <fieldset style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px 10px 12px', margin: 0 }}>
          <legend style={{ fontSize: '10px', fontWeight: 700, color: '#1e3a8a', padding: '0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</legend>
          {content}
        </fieldset>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
        <span style={LBL}>{label}</span>
        {content}
      </div>
    );
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: '8px 10px', background: '#f1f5f9', fontWeight: 700,
    fontSize: '10px', color: '#475569', textAlign: 'left',
    borderBottom: '2px solid #cbd5e1', borderRight: '1px solid #e2e8f0',
    textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap'
  };

  return (
    <>
      <AccountSearchModal
        isOpen={showAccountSearch}
        onClose={() => setShowAccountSearch(false)}
        onGet={r => {
          setForm(prev => ({
            ...prev,
            accNo: r.accountNo || '',
            holderNo: r.holderId || '',
            holderName: r.name || r.holderName || '',
            fundCode: r.fundCode || '',
            fundName: r.fund || ''
          }));
          setShowAccountSearch(false);
        }}
        onSelect={r => {
          setForm(prev => ({
            ...prev,
            accNo: r.accountNo || '',
            holderNo: r.holderId || '',
            holderName: r.name || r.holderName || '',
            fundCode: r.fundCode || '',
            fundName: r.fund || ''
          }));
          setShowAccountSearch(false);
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
        {/* ── Top Section: Holder & Fund ─────────────────────── */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(300px, 2fr)', gap: '12px 20px' }}>
            {/* Row 1 - Col 1: Acc No */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ ...LBL, textAlign: 'left', minWidth: 'auto' }}>Unit Holder Acc No</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input style={inp()} value={form.accNo} onChange={e => set('accNo', e.target.value)} disabled={!isEnabled} />
                <button type="button" onClick={() => isEnabled && setShowAccountSearch(true)} disabled={!isEnabled} style={{ height: 28, width: 28, background: isEnabled ? '#1e3a8a' : '#94a3b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: isEnabled ? 'pointer' : 'not-allowed', fontWeight: 800, flexShrink: 0 }}>A</button>
              </div>
            </div>
            {/* Row 1 - Col 2: Fund */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ ...LBL, textAlign: 'left', minWidth: 'auto' }}>Fund</span>
              <FundDropdown
                value={form.fundCode}
                displayValue={form.fundName}
                onSelect={(c, n) => { set('fundCode', c); set('fundName', n); }}
                disabled={!isEnabled}
              />
            </div>
            {/* Row 2 - Col 1: Holder No */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ ...LBL, textAlign: 'left', minWidth: 'auto' }}>Unit Holder No</span>
              <input style={inp({ background: '#f8fafc' })} value={form.holderNo} disabled={true} />
            </div>
            {/* Row 2 - Col 2: Holder Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ height: '15px' }}></div> {/* Spacer to align with the other column's label height */}
              <input style={inp({ background: '#f8fafc' })} value={form.holderName} onChange={e => set('holderName', e.target.value)} disabled={true} placeholder="Unit holder name" />
            </div>
          </div>
        </div>

        {/* ── Instruction Type ─────────────────────────────────── */}
        <div style={{ background: '#fff' }}>
          <RadioGroup
            label="Instruction Type"
            redSelection={true}
            name="instructionType"
            useFieldset={true}
            value={form.instructionType}
            onChange={v => set('instructionType', v)}
            options={[
              { label: 'Systemic Investment Plan (SIP)', value: 'SIP' },
              { label: 'Regular Withdrawal - Customer Account', value: 'RWCA' },
              { label: 'Regular Withdrawal - Third Party', value: 'RWTP' },
            ]}
          />
        </div>

        {/* ── Main Details Section ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={LBL}>Instruction No</span>
              <input style={inp()} value={form.instructionNo} onChange={e => set('instructionNo', e.target.value)} disabled={!isEnabled} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={LBL}>Description</span>
              <input style={inp()} value={form.description} onChange={e => set('description', e.target.value)} disabled={!isEnabled} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={LBL}>From</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <DatePicker selected={form.applyFrom} onChange={d => set('applyFrom', d)} className="date-picker-input" disabled={!isEnabled} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#5a6a85', padding: '0 4px', textTransform: 'uppercase' }}>To</span>
                <DatePicker selected={form.applyTo} onChange={d => set('applyTo', d)} className="date-picker-input" disabled={!isEnabled} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={LBL}>Effect Date</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <DatePicker selected={form.effectDate} onChange={d => set('effectDate', d)} className="date-picker-input" disabled={!isEnabled} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#475569', marginLeft: 'auto', cursor: isEnabled ? 'pointer' : 'not-allowed' }}>
                  <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} disabled={!isEnabled} />
                  Active
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={LBL}>Last Processed</span>
              <DatePicker selected={form.lastProcessedOn} onChange={d => set('lastProcessedOn', d)} className="date-picker-input" disabled={!isEnabled} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#5a6a85', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: '110px', justifyContent: 'flex-end', cursor: isEnabled ? 'pointer' : 'not-allowed' }}>
                <input type="checkbox" checked={form.returnBasis} onChange={e => set('returnBasis', e.target.checked)} disabled={!isEnabled} style={{ cursor: isEnabled ? 'pointer' : 'not-allowed' }} />
                Return Basis
              </label>
              <span style={{ ...LBL, minWidth: 'auto', textAlign: 'left', marginLeft: '4px' }}>Amount</span>
              <input style={inp({ fontWeight: 700, color: '#1e3a8a' })} value={form.amount} onChange={e => set('amount', e.target.value)} disabled={!isEnabled} />
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ background: '#fff' }}>
              <RadioGroup
                label="Frequency"
                name="frequency"
                useFieldset={true}
                value={form.frequency}
                onChange={v => set('frequency', v)}
                options={[
                  { label: 'Monthly', value: 'Monthly' },
                  { label: 'Quarterly', value: 'Quarterly' },
                  { label: 'Half-Yearly', value: 'Half-Yearly' },
                  { label: 'Yearly', value: 'Yearly' },
                ]}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginTop: '-4px' }}>
              <span style={{ ...LBL, color: '#94a3b8', minWidth: 'auto' }}>Frequency (DDD)</span>
              <input style={inp({ width: '60px', textAlign: 'right', background: '#cbd5e1', color: '#64748b', cursor: 'not-allowed' })} value={form.frequencyDDD} onChange={e => set('frequencyDDD', e.target.value)} disabled={true} />
            </div>
            <div style={{ background: '#fefefe', border: '1px dotted #cbd5e1', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={LBL}>Bank Code</span>
                <TableDropdown
                  value={form.bankCode}
                  displayValue={form.bankCode ? `${form.bankCode} - ${agentBankData.find(b => b.agentCode === form.bankCode)?.agentDescription}` : ''}
                  columns={[{ key: 'agentCode', header: 'Code', width: '30%' }, { key: 'agentDescription', header: 'Name' }]}
                  rows={agentBankData}
                  valueKey="agentCode"
                  onSelect={r => set('bankCode', r.agentCode)}
                  disabled={!isEnabled}
                  placeholder="Select Bank"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={LBL}>Bank Account</span>
                <input style={inp()} value={form.bankAccount} onChange={e => set('bankAccount', e.target.value)} disabled={!isEnabled} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={LBL}>Account Name</span>
                <input style={inp()} value={form.bankAccountName} onChange={e => set('bankAccountName', e.target.value)} disabled={!isEnabled} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                <span style={LBL}>Remark</span>
                <input style={inp()} value={form.remark} onChange={e => set('remark', e.target.value)} disabled={!isEnabled} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Buttons ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="setup-btn setup-btn-new" onClick={() => setIsEnabled(true)}><span className="setup-btn-icon">+</span>New</button>
            <button className="setup-btn setup-btn-save"><span className="setup-btn-icon">💾</span>Save</button>
            <button className="setup-btn setup-btn-delete"><span className="setup-btn-icon">🗑️</span>Delete</button>
            <button className="setup-btn setup-btn-print"><span className="setup-btn-icon">🖨️</span>Print</button>
            <button className="setup-btn setup-btn-clear" onClick={() => setIsEnabled(false)}><span className="setup-btn-icon">✕</span>Cancel</button>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginLeft: '10px', paddingLeft: '15px', borderLeft: '1px solid #cbd5e1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.printReq} onChange={e => set('printReq', e.target.checked)} />
              Print
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.activeOnly} onChange={e => set('activeOnly', e.target.checked)} />
              Active Only
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.allTypes} onChange={e => set('allTypes', e.target.checked)} />
              All Types
            </label>
          </div>
        </div>

        {/* ── Bottom Table ────────────────────────────────────── */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fff', flex: 1, minHeight: '150px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', maxHeight: '400px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f8fafc' }}>
                <tr>
                  <th style={tableHeaderStyle}>Instruct No</th>
                  <th style={tableHeaderStyle}>Instruct Type</th>
                  <th style={tableHeaderStyle}>Account No</th>
                  <th style={tableHeaderStyle}>Approved</th>
                  <th style={tableHeaderStyle}>Active</th>
                  <th style={tableHeaderStyle}>Process Date</th>
                  <th style={tableHeaderStyle}>Last Process Date</th>
                  <th style={tableHeaderStyle}>Frequency</th>
                  <th style={tableHeaderStyle}>Amount</th>
                  <th style={tableHeaderStyle}>Bank</th>
                  <th style={tableHeaderStyle}>Account</th>
                  <th style={tableHeaderStyle}>Remark</th>
                  <th style={tableHeaderStyle}>Fund</th>
                  <th style={tableHeaderStyle}>Date From</th>
                  <th style={tableHeaderStyle}>Date To</th>
                  <th style={tableHeaderStyle}>Holder No</th>
                  <th style={tableHeaderStyle}>Account Name</th>
                </tr>
              </thead>
              <tbody>
                {/* Placeholder rows */}
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} style={{ height: '28px', borderBottom: '1px solid #f1f5f9' }}>
                    {Array.from({ length: 17 }).map((_, j) => <td key={j} style={{ padding: '6px 10px', fontSize: '11px', borderRight: '1px solid #f1f5f9' }}>&nbsp;</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ color: '#2563eb', fontSize: '11px', fontWeight: 700, padding: '2px 8px' }}>
          Double click to get the selected value
        </div>
      </div>
    </>
  );
}

// ========================================
// BANK SLIP TRANSFER MODAL
// ========================================
function BankSlipTransferModal() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [trDate, setTrDate] = useState<Date | null>(new Date());
  const [valueDate, setValueDate] = useState<Date | null>(new Date());
  const [transferType, setTransferType] = useState('Dividend'); // Dividend, Redeemed
  const [form, setForm] = useState({
    fundCode: '',
    fundName: '',
    batchNo: '1',
    amount: '',
    outputPath1: 'C:\\Bank TransferOutput\\',
    outputPath2: 'Batch_Number_1.txt',
    printed: '',
    numberOfRecords: '',
    printedBy: '',
    printedDate: '',
  });

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const fieldH = 28;
  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: fieldH, padding: '0 8px', fontSize: '12px',
    border: '1px solid #cfd8e3', borderRadius: '5px',
    background: isEnabled ? '#ffffff' : '#f0f4f8',
    color: '#1e293b', outline: 'none', width: '100%',
    boxSizing: 'border-box',
    cursor: isEnabled ? 'text' : 'not-allowed',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    ...extra,
  });

  const LBL: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: '#475569',
    whiteSpace: 'nowrap', width: '110px', textAlign: 'right'
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: '8px 10px', background: '#f1f5f9', fontWeight: 700,
    fontSize: '10px', color: '#475569', textAlign: 'left',
    borderBottom: '2px solid #cbd5e1', borderRight: '1px solid #e2e8f0',
    textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
      {/* ── Top Control Bar ───────────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>TR Date :</span>
            <DatePicker selected={trDate} onChange={d => setTrDate(d)} className="date-picker-input" disabled={!isEnabled} />
          </div>

          <div style={{ display: 'flex', gap: '25px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: transferType === 'Dividend' ? '#2563eb' : '#475569', cursor: isEnabled ? 'pointer' : 'default', transition: 'color 0.2s' }}>
              <input type="radio" name="trType" checked={transferType === 'Dividend'} onChange={() => isEnabled && setTransferType('Dividend')} disabled={!isEnabled} style={{ accentColor: '#2563eb' }} />
              Fund Transfer Dividend
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: transferType === 'Redeemed' ? '#2563eb' : '#475569', cursor: isEnabled ? 'pointer' : 'default', transition: 'color 0.2s' }}>
              <input type="radio" name="trType" checked={transferType === 'Redeemed'} onChange={() => isEnabled && setTransferType('Redeemed')} disabled={!isEnabled} style={{ accentColor: '#2563eb' }} />
              Fund Transfer Redeemed
            </label>
          </div>

          <button style={{
            height: 30, padding: '0 20px', background: '#1e3a8a',
            color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 700, fontSize: '12px', transition: 'all 0.2s'
          }} className="load-data-btn">Load Data</button>
        </div>
      </div>

      {/* ── Main Form Section ─────────────────────────────── */}
      {/* ── Main Form Section ─────────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Row 1: All Inputs (Horizontal) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px 25px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...LBL, width: 'auto' }}>Fund</span>
            <div style={{ width: '220px' }}>
              <FundDropdown value={form.fundCode} displayValue={form.fundName} onSelect={(c, n) => { set('fundCode', c); set('fundName', n); }} disabled={!isEnabled} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...LBL, width: 'auto' }}>Batch No</span>
            <input style={{ ...inp(), width: '80px' }} value={form.batchNo} onChange={e => set('batchNo', e.target.value)} disabled={!isEnabled} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...LBL, width: 'auto' }}>Amount</span>
            <input style={{ ...inp({ fontWeight: 700, color: '#1e3a8a' }), width: '130px' }} value={form.amount} onChange={e => set('amount', e.target.value)} disabled={!isEnabled} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...LBL, width: 'auto' }}>Value Date</span>
            <div style={{ width: '120px' }}>
              <DatePicker selected={valueDate} onChange={d => setValueDate(d)} className="date-picker-input" disabled={!isEnabled} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '300px' }}>
            <span style={{ ...LBL, width: 'auto' }}>Output File Name</span>
            <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
              <input style={inp({ background: '#f8fafc' })} value={form.outputPath1} disabled />
              <input style={inp({ background: '#f8fafc' })} value={form.outputPath2} disabled />
            </div>
          </div>
        </div>

        {/* Row 2: All Status Fields (Horizontal Banner) */}
        <div style={{ background: '#f8fafc', padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...LBL, width: 'auto' }}>Printed</span>
            <input style={{ ...inp(), width: '100px' }} value={form.printed} onChange={e => set('printed', e.target.value)} disabled={!isEnabled} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...LBL, width: 'auto' }}>Number of Records</span>
            <input style={{ ...inp(), width: '100px' }} value={form.numberOfRecords} onChange={e => set('numberOfRecords', e.target.value)} disabled={!isEnabled} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...LBL, width: 'auto' }}>Printed By</span>
            <input style={{ ...inp(), width: '120px' }} value={form.printedBy} onChange={e => set('printedBy', e.target.value)} disabled={!isEnabled} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...LBL, width: 'auto' }}>Printed Date</span>
            <input style={{ ...inp(), width: '120px' }} value={form.printedDate} onChange={e => set('printedDate', e.target.value)} disabled={!isEnabled} />
          </div>
        </div>
      </div>

      {/* ── Action Palette ────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="setup-btn setup-btn-new" onClick={() => setIsEnabled(true)}><span className="setup-btn-icon">+</span>New</button>
          <button className="setup-btn setup-btn-save"><span className="setup-btn-icon">💾</span>Save</button>
          <button className="setup-btn setup-btn-delete"><span className="setup-btn-icon">🗑️</span>Delete</button>
          <button className="setup-btn setup-btn-print"><span className="setup-btn-icon">🖨️</span>Print</button>
          <button className="setup-btn setup-btn-clear" onClick={() => setIsEnabled(false)}><span className="setup-btn-icon">✕</span>Cancel</button>
        </div>
      </div>

      {/* ── Tables ────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minHeight: 0 }}>
        {/* Top Table */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fff', flex: 1, minHeight: '140px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f8fafc' }}>
                <tr>
                  {['Batch No', 'Fund Code', 'Batch Date', 'Batch Amount', 'Batch Printed', 'Tr Type', 'Tr Date', 'Value Date', 'Printed By', 'Print'].map(h => (
                    <th key={h} style={tableHeaderStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map(i => (
                  <tr key={i} style={{ height: '28px', borderBottom: '1px solid #f1f5f9' }}>
                    {Array.from({ length: 10 }).map((_, j) => <td key={j} style={{ padding: '6px 10px', fontSize: '11px', borderRight: '1px solid #f1f5f9' }}>&nbsp;</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ color: '#2563eb', fontSize: '11px', fontWeight: 700, padding: '2px 0' }}>Double click to Edit the selected value</div>

        {/* Bottom Table */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fff', flex: 1, minHeight: '140px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f8fafc' }}>
                <tr>
                  {['Fund Code', 'Fund Name', 'Tr Date', 'Account No', 'Amount', 'To Bank Code', 'To Bank Account', 'Holder Name', 'From Bank Code'].map(h => (
                    <th key={h} style={tableHeaderStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map(i => (
                  <tr key={i} style={{ height: '28px', borderBottom: '1px solid #f1f5f9' }}>
                    {Array.from({ length: 9 }).map((_, j) => <td key={j} style={{ padding: '6px 10px', fontSize: '11px', borderRight: '1px solid #f1f5f9' }}>&nbsp;</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// REMINDERS MODAL
// ========================================
function RemindersModal({ onClose: _onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'Suspend Account Details' | 'Minor Accounts'>('Suspend Account Details');
  const [isEnabled, setIsEnabled] = useState(false);

  const tableHeaderStyle: React.CSSProperties = {
    padding: '10px 12px',
    background: '#1e3a8a',
    fontWeight: 700,
    fontSize: '11px',
    color: '#ffffff',
    textAlign: 'left',
    borderRight: '1px solid rgba(255,255,255,0.15)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '12px',
    color: '#1f2937',
    borderBottom: '1px solid #e2e8f0',
    borderRight: '1px solid #e2e8f0',
  };

  const suspendColumns = [
    'Certificate No', 'Certificate Date', 'No of Units', 'Issued By', 'Issued Date', 'Investment No'
  ];

  const minorColumns = [
    'Fund Code', 'Account No.', 'Holder Reg. No.', 'Holder Name', 'Age', 'Unit Balance'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '520px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #e2e8f0', padding: '0 4px' }}>
        {(['Suspend Account Details', 'Minor Accounts'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === tab ? '#1e3a8a' : 'transparent',
              color: activeTab === tab ? '#ffffff' : '#64748b',
              borderRadius: '6px 6px 0 0',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              marginBottom: '-2px',
              borderBottom: activeTab === tab ? '2px solid #1e3a8a' : 'none',
              boxShadow: activeTab === tab ? '0 -2px 10px rgba(30,58,138,0.1)' : 'none',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div style={{
        flex: 1,
        background: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '350px'
      }}>
        <div style={{ overflow: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {(activeTab === 'Suspend Account Details' ? suspendColumns : minorColumns).map((col, i) => (
                  <th key={i} style={tableHeaderStyle}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Placeholder rows with some semi-realistic sample data look */}
              {Array.from({ length: 15 }).map((_, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f8fafc', transition: 'background 0.1s' }}>
                  {(activeTab === 'Suspend Account Details' ? suspendColumns : minorColumns).map((_, j) => (
                    <td key={j} style={tableCellStyle}>
                      {j === 0 && i < 5 ? (activeTab === 'Suspend Account Details' ? `PB995000000${112 + i}` : `FC00${i + 1}`) : '\u00A0'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common Button Palette Integration */}
      <div style={{ marginTop: 'auto' }}>
        <CreationButtonPalette
          onNew={() => setIsEnabled(true)}
          onClear={() => setIsEnabled(false)}
          isEnabled={isEnabled}
        />
      </div>
    </div>
  );
}

// ========================================
// CHANGE AGENT FOR TRANSACTION MODAL
// ========================================
function ChangeAgentForTransactionModal() {
  type SearchMode = 'By Profile' | 'By Transaction';
  const [searchMode, setSearchMode] = useState<SearchMode>('By Profile');

  // By-Profile fields
  const [registrationNo, setRegistrationNo] = useState('200612003701');
  const [profileAgentCode, setProfileAgentCode] = useState('102');
  const [updateProfile, setUpdateProfile] = useState(true);
  const [updateTransactions, setUpdateTransactions] = useState(true);

  // By-Transaction fields
  const [transactionType, setTransactionType] = useState('Subscription');
  const [transRange, setTransRange] = useState<'From' | 'To'>('From');
  const [transNo, setTransNo] = useState('');

  // Agent fields
  const [prevAgency, setPrevAgency] = useState('');
  const [prevSubAgent, setPrevSubAgent] = useState('');
  const [prevAgent, setPrevAgent] = useState('');
  const [newAgency, setNewAgency] = useState('');
  const [newSubAgent, setNewSubAgent] = useState('');
  const [newAgent, setNewAgent] = useState('');

  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  const transactionTypes = ['Subscription', 'Redemption', 'Transfer', 'Switching', 'Dividend', 'Consolidation'];

  const sampleRows = [
    { transCode: 'CR001', transNo: '291', sqNo: '0', holderAccNo: '200612003711101', transDate: '29/12/2006', agencyCode: '', subAgencyCode: '', agentCode: '100', agentCodeAlt: '99' },
  ];

  const tableColumns = ['TRANS_CODE', 'TRANS_NO', 'SQ_NO', 'HOLDER_ACCOUNT_NO', 'TRANSACTION_DATE', 'AGENCY_CODE', 'SUB_AGENCY_CODE', 'AGENT_CODE', 'ALT'];

  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: 28, padding: '0 8px', fontSize: '12px',
    border: '1px solid #cbd5e1', borderRadius: '6px',
    background: isEnabled ? '#ffffff' : '#f1f5f9',
    color: '#1e293b', outline: 'none',
    boxSizing: 'border-box' as const,
    cursor: isEnabled ? 'text' : 'not-allowed',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    ...extra,
  });

  const sel = (extra?: React.CSSProperties): React.CSSProperties => ({
    height: 28, padding: '0 6px', fontSize: '12px',
    border: '1px solid #cbd5e1', borderRadius: '6px',
    background: isEnabled ? '#ffffff' : '#f1f5f9',
    color: '#1e293b', outline: 'none',
    boxSizing: 'border-box' as const,
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    ...extra,
  });

  const LBL: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: '#475569',
    whiteSpace: 'nowrap', minWidth: '80px',
  };

  const thStyle: React.CSSProperties = {
    padding: '8px 10px', background: '#1e3a8a', fontWeight: 700,
    fontSize: '10px', color: '#ffffff', textAlign: 'left',
    borderRight: '1px solid rgba(255,255,255,0.15)',
    textTransform: 'uppercase', letterSpacing: '0.04em',
    whiteSpace: 'nowrap', position: 'sticky', top: 0, zIndex: 1,
  };

  const tdStyle = (rowIdx: number): React.CSSProperties => ({
    padding: '7px 10px', fontSize: '11px', color: '#1f2937',
    borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0',
    background: selectedRow === rowIdx ? '#dbeafe' : rowIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
    cursor: 'pointer',
    transition: 'background 0.15s',
  });

  const agentPanelField = (
    label: string,
    value: string,
    onSelect: (row: Record<string, string>) => void,
    type: 'Agency' | 'SubAgent' | 'Agent'
  ) => {
    let rows: Record<string, string>[] = [];
    let columns: TableDropdownCol[] = [];
    let valueKey = '';
    let displayValue = value;

    if (type === 'Agency') {
      rows = agencyTableData;
      columns = [
        { key: 'agency_code', header: 'Code', width: '30%' },
        { key: 'agency_name', header: 'Name' }
      ];
      valueKey = 'agency_code';
      const found = agencyTableData.find(a => a.agency_code === value);
      if (found) displayValue = `${found.agency_code} - ${found.agency_name}`;
    } else if (type === 'SubAgent') {
      rows = subAgencyTableData;
      columns = [
        { key: 'subagent_code', header: 'Code', width: '30%' },
        { key: 'subagent_name', header: 'Name' }
      ];
      valueKey = 'subagent_code';
      const found = subAgencyTableData.find(s => s.subagent_code === value);
      if (found) displayValue = `${found.subagent_code} - ${found.subagent_name}`;
    } else {
      rows = agentTableData;
      columns = [
        { key: 'agent_code', header: 'Code', width: '30%' },
        { key: 'agent_name', header: 'Name' }
      ];
      valueKey = 'agent_code';
      const found = agentTableData.find(a => a.agent_code === value);
      if (found) displayValue = `${found.agent_code} - ${found.agent_name}`;
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ ...LBL, minWidth: '72px' }}>{label}</span>
        <TableDropdown
          value={value}
          displayValue={displayValue}
          columns={columns}
          rows={rows}
          valueKey={valueKey}
          onSelect={onSelect}
          disabled={!isEnabled}
          placeholder={`Select ${label}`}
        />
      </div>
    );
  };

  const [showHolderSearch, setShowHolderSearch] = useState(false);

  const addBtnStyle: React.CSSProperties = {
    background: '#b45309', color: '#fff', border: 'none', borderRadius: '4px',
    width: '30px', height: '28px', fontSize: '10px',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '10px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      minHeight: 0,
    }}>
      <HolderSearchModal
        isOpen={showHolderSearch}
        onClose={() => setShowHolderSearch(false)}
        onSelect={(r: HolderRecord) => setRegistrationNo(r.holderId)}
      />

      {/* ── Mode Toggle + Search Section ─────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        border: '1px solid #e2e8f0', borderRadius: '10px',
        padding: '12px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        {/* Radio mode selector */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
          {(['By Profile', 'By Transaction'] as SearchMode[]).map(mode => (
            <label key={mode} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              cursor: 'pointer', fontSize: '12px', fontWeight: 700,
              color: searchMode === mode ? '#1e40af' : '#64748b',
              transition: 'color 0.2s',
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                border: `2px solid ${searchMode === mode ? '#2563eb' : '#94a3b8'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fff', flexShrink: 0,
                boxShadow: searchMode === mode ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none',
                transition: 'all 0.2s',
              }}>
                {searchMode === mode && (
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#2563eb', display: 'block',
                  }} />
                )}
              </span>
              <input
                type="radio" name="cagMode"
                style={{ display: 'none' }}
                checked={searchMode === mode}
                onChange={() => setSearchMode(mode)}
              />
              {mode}
            </label>
          ))}
        </div>

        {/* Search controls */}
        {searchMode === 'By Profile' ? (
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0',
            borderRadius: '8px', padding: '10px 14px',
            display: 'flex', flexWrap: 'wrap', gap: '10px 24px',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ ...LBL, minWidth: '95px' }}>Registration No</span>
              <input
                style={{ ...inp(), width: '140px' }}
                value={registrationNo}
                onChange={e => setRegistrationNo(e.target.value)}
              />
              <button style={addBtnStyle} onClick={() => setShowHolderSearch(true)}>
                <span style={{ fontSize: '12px' }}>▼</span>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ ...LBL, minWidth: '105px' }}>Profile Agent Code</span>
              <input
                style={{ ...inp(), width: '80px' }}
                value={profileAgentCode}
                onChange={e => setProfileAgentCode(e.target.value)}
              />
            </div>
            <button style={{
              height: 28, padding: '0 20px', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 700, fontSize: '12px', boxShadow: '0 2px 6px rgba(37,99,235,0.35)',
              transition: 'all 0.2s', letterSpacing: '0.02em',
            }}>Load</button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
              {[{ label: 'Update Profile', val: updateProfile, set: setUpdateProfile },
              { label: 'Update Transactions', val: updateTransactions, set: setUpdateTransactions }].map(({ label, val, set }) => (
                <label key={label} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '11px', fontWeight: 700, color: '#475569', cursor: 'pointer',
                }}>
                  <input
                    type="checkbox" checked={val}
                    onChange={e => set(e.target.checked)}
                    style={{ accentColor: '#2563eb', width: 14, height: 14 }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0',
            borderRadius: '8px', padding: '10px 14px',
            display: 'flex', flexWrap: 'wrap', gap: '10px 24px',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ ...LBL, minWidth: '105px' }}>Transaction Type</span>
              <select
                style={{ ...sel(), width: '150px' }}
                value={transactionType}
                onChange={e => setTransactionType(e.target.value)}
              >
                {transactionTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {(['From', 'To'] as const).map(opt => (
                <label key={opt} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  cursor: 'pointer', fontSize: '11px', fontWeight: 700,
                  color: transRange === opt ? '#1e40af' : '#64748b',
                }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: '50%',
                    border: `2px solid ${transRange === opt ? '#2563eb' : '#94a3b8'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fff', flexShrink: 0,
                  }}>
                    {transRange === opt && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb', display: 'block' }} />}
                  </span>
                  <input type="radio" name="transRange" style={{ display: 'none' }} checked={transRange === opt} onChange={() => setTransRange(opt)} />
                  {opt}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ ...LBL, minWidth: '60px' }}>Trans No</span>
              <input
                style={{ ...inp(), width: '110px' }}
                value={transNo}
                onChange={e => setTransNo(e.target.value)}
              />
            </div>
            <button style={{
              height: 28, padding: '0 20px', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 700, fontSize: '12px', boxShadow: '0 2px 6px rgba(37,99,235,0.35)',
              transition: 'all 0.2s',
            }}>Load</button>
          </div>
        )}
      </div>

      {/* ── Transactions Table ───────────────────────────────── */}
      <div style={{
        background: '#ffffff', border: '1px solid #e2e8f0',
        borderRadius: '10px', overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        minHeight: '160px', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ overflow: 'auto', flex: 1, maxHeight: '200px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {tableColumns.map(col => (
                  <th key={col} style={thStyle}>{col.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRows.map((row, i) => (
                <tr key={i} onClick={() => setSelectedRow(i)} style={{ cursor: 'pointer' }}>
                  <td style={tdStyle(i)}>{row.transCode}</td>
                  <td style={tdStyle(i)}>{row.transNo}</td>
                  <td style={tdStyle(i)}>{row.sqNo}</td>
                  <td style={tdStyle(i)}>{row.holderAccNo}</td>
                  <td style={tdStyle(i)}>{row.transDate}</td>
                  <td style={tdStyle(i)}>{row.agencyCode}</td>
                  <td style={tdStyle(i)}>{row.subAgencyCode}</td>
                  <td style={tdStyle(i)}>{row.agentCode}</td>
                  <td style={tdStyle(i)}>{row.agentCodeAlt}</td>
                </tr>
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  {tableColumns.map((_, j) => (
                    <td key={j} style={{ ...tdStyle(i + 1), background: (i + 1) % 2 === 0 ? '#ffffff' : '#f8fafc' }}>&nbsp;</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Previous Agent + New Agent panels ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Previous Agent */}
        <div style={{
          background: 'linear-gradient(135deg, #fefefe, #f8fafc)',
          border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            fontSize: '11px', fontWeight: 800, color: '#1e3a8a',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: '10px', paddingBottom: '6px',
            borderBottom: '2px solid #dbeafe',
          }}>Previous Agent</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {agentPanelField('Agency', prevAgency, r => setPrevAgency(r.agency_code), 'Agency')}
            {agentPanelField('Sub Agent', prevSubAgent, r => setPrevSubAgent(r.subagent_code), 'SubAgent')}
            {agentPanelField('Agent', prevAgent, r => setPrevAgent(r.agent_code), 'Agent')}
          </div>
        </div>

        {/* New Agent */}
        <div style={{
          background: 'linear-gradient(135deg, #fefefe, #f8fafc)',
          border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            fontSize: '11px', fontWeight: 800, color: '#059669',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: '10px', paddingBottom: '6px',
            borderBottom: '2px solid #d1fae5',
          }}>New Agent</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {agentPanelField('Agency', newAgency, r => setNewAgency(r.agency_code), 'Agency')}
            {agentPanelField('Sub Agent', newSubAgent, r => setNewSubAgent(r.subagent_code), 'SubAgent')}
            {agentPanelField('Agent', newAgent, r => setNewAgent(r.agent_code), 'Agent')}
          </div>
        </div>
      </div>

      {/* ── Action Buttons ───────────────────────────────────── */}
      <CreationButtonPalette
        onNew={() => setIsEnabled(true)}
        onClear={() => {
          setIsEnabled(false);
          setPrevAgency(''); setPrevSubAgent(''); setPrevAgent('');
          setNewAgency(''); setNewSubAgent(''); setNewAgent('');
        }}
        isEnabled={isEnabled}
      >
        <button style={{
          height: 30, padding: '0 18px',
          background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
          color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer',
          fontWeight: 700, fontSize: '12px',
          boxShadow: '0 2px 6px rgba(20,184,166,0.4)',
          transition: 'all 0.2s', letterSpacing: '0.02em',
        }}>📊 Agent Update Excel</button>
      </CreationButtonPalette>
    </div>
  );
}

// ========================================
// ACKNOWLEDGEMENT PRINTING MODAL
// ========================================
function AcknowledgementPrintingModal() {
  const [activeSubModal, setActiveSubModal] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [investDate, setInvestDate] = useState<Date | null>(new Date());
  const [chqDate, setChqDate] = useState<Date | null>(new Date());
  const [isEnabled, setIsEnabled] = useState(false);

  const [form, setForm] = useState({
    holderNo: '200712010501',
    fundCode: '',
    fundName: '',
    accountNo: '',
    paymentType: '',
    paymentTypeName: '',
    amount: '0.00',
    chqNo: '',
    ackNo: '0',
    lastNo: '',
    bankBranchCode: '',
    bankBranchName: '',
    pending: true,
    reportFilter: false,
    doNotCheck: false
  });

  const updateForm = (updates: Partial<typeof form>) => setForm(f => ({ ...f, ...updates }));

  const [showAccountSearch, setShowAccountSearch] = useState(false);
  const [showHolderSearch, setShowHolderSearch] = useState(false);

  const funds = [
    { code: 'F001', name: 'Ceylon Financial Sector Fund' },
    { code: 'F002', name: 'Growth Equity Fund' },
    { code: 'F003', name: 'Balanced Income Fund' }
  ];
  const paymentTypes = [
    { code: 'CHQ', name: 'Cheque' },
    { code: 'DRAFT', name: 'Draft' },
    { code: 'CASH', name: 'Cash' },
    { code: 'BANK', name: 'Bank Transfer' }
  ];
  const bankBranches = [
    { code: 'B001', name: 'Colombo Main' },
    { code: 'B002', name: 'Kandy Central' },
    { code: 'B003', name: 'Galle Fort' }
  ];

  const inp = (): React.CSSProperties => ({
    height: '28px', padding: '0 8px', fontSize: '12px',
    border: '1px solid #cfd8e3', borderRadius: '5px',
    background: '#ffffff',
    color: '#1e293b', outline: 'none', width: '100%',
    boxSizing: 'border-box' as const,
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
  });

  const LBL: React.CSSProperties = {
    fontSize: '10px', fontWeight: 700, color: '#5a6a85',
    textTransform: 'uppercase' as const, letterSpacing: '0.06em',
    whiteSpace: 'nowrap' as const,
  };

  const Field = ({ label, children, style }: {
    label: string; children: React.ReactNode; style?: React.CSSProperties;
  }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', ...style }}>
      <span style={LBL}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{children}</div>
    </div>
  );

  const iconBtn = (bg: string): React.CSSProperties => ({
    height: '28px', minWidth: '26px', padding: '0 4px', flexShrink: 0,
    background: bg, color: '#fff', border: 'none', borderRadius: '5px',
    fontSize: '10px', fontWeight: 800, cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
  });

  const txtBtn = (bg: string): React.CSSProperties => ({
    height: '28px', padding: '0 12px', flexShrink: 0,
    background: bg, color: '#fff', border: 'none', borderRadius: '5px',
    fontSize: '11px', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f1f5f9', minHeight: '520px' }}>
      <style>{`
        .dp-input { height: 28px; padding: 0 8px; font-size: 12px; border: 1px solid #cfd8e3; border-radius: 5px; width: 100%; box-sizing: border-box; }
        .ack-btn { min-width: 80px; height: 28px; padding: 0 12px; font-size: 11px; font-weight: 700; border-radius: 5px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
        .ack-btn-new, .ack-btn-new:hover { background: #3b82f6; color: #fff; }
        .ack-btn-save, .ack-btn-save:hover { background: #10b981; color: #fff; }
        .ack-btn-print, .ack-btn-print:hover { background: #0d7f5a; color: #fff; }
        .ack-btn-clear, .ack-btn-clear:hover { background: #64748b; color: #fff; }
        .ack-btn-close, .ack-btn-close:hover { background: #f1f5f9; color: #374151; border: 1px solid #cbd5e1; }
        .ack-btn:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>

      {/* HOLDER INFO BOX */}
      <div style={{ background: '#ffffff', border: '1.5px solid #bdd5f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 1px 6px rgba(59,130,246,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) 30px minmax(200px, 1.5fr) 60px', gap: '8px', marginBottom: '8px' }}>
          <Field label="Holder No">
            <input style={{ ...inp(), background: '#f8fafc' }} value={form.holderNo} readOnly />
          </Field>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
            <button style={iconBtn('#7c3aed')} onClick={() => setShowHolderSearch(true)}>H</button>
          </div>
          <Field label="Holder Name">
            <input style={{ ...inp(), background: '#f8fafc' }} value="MRS. Mabula Marappeuma Arachchige Chinta Hemakanthi Abayawan" readOnly />
          </Field>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
            <button style={txtBtn('#0ea5e9')} onClick={() => { }}>Add</button>
          </div>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px', background: '#fcfdfe' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Holder Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', fontSize: '11px' }}><span style={{ width: '100px', fontWeight: 600 }}>NIC Number:</span> <span>495191931V</span></div>
              <div style={{ display: 'flex', fontSize: '11px' }}><span style={{ width: '100px', fontWeight: 600 }}>Name in Full:</span> <span>MRS. Mabula Marapperuma Arachchige Chinta Hemakanthi Abayawardana</span></div>
              <div style={{ display: 'flex', fontSize: '11px' }}><span style={{ width: '100px', fontWeight: 600 }}>Address:</span> <span>370/1, Ahugammana, Demalagama</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', fontSize: '11px' }}><span style={{ width: '100px', fontWeight: 600 }}>Land Number:</span> <span>0112402518</span></div>
              <div style={{ display: 'flex', fontSize: '11px' }}><span style={{ width: '100px', fontWeight: 600 }}>Mobile Number:</span> <span>0777656133</span></div>
              <div style={{ display: 'flex', fontSize: '11px' }}><span style={{ width: '100px', fontWeight: 600 }}>E Mail:</span> <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Provided</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* PARAMETERS BOX */}
      <div style={{ background: '#ffffff', border: '1.5px solid #bdd5f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 1px 6px rgba(59,130,246,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <Field label="Fund Name">
            <TableDropdown
              value={form.fundCode} displayValue={form.fundName}
              rows={funds} valueKey="code" placeholder="Select Fund"
              columns={[{ key: 'code', header: 'CODE', width: '30%' }, { key: 'name', header: 'NAME' }]}
              onSelect={r => updateForm({ fundCode: r.code, fundName: r.name })}
            />
          </Field>
          <Field label="Account No">
            <div style={{ display: 'flex', width: '100%', gap: '4px' }}>
              <input style={{ ...inp(), flex: 1 }} value={form.accountNo} onChange={e => updateForm({ accountNo: e.target.value })} placeholder="Enter or search..." />
              <button style={iconBtn('#1e3a8a')} onClick={() => setShowAccountSearch(true)}>A</button>
            </div>
          </Field>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
            <input type="checkbox" checked={form.reportFilter} onChange={e => updateForm({ reportFilter: e.target.checked })} />
            REPORT FILTER
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: form.reportFilter ? 1 : 0.5, pointerEvents: form.reportFilter ? 'auto' : 'none' }}>
            <div style={{ width: '120px' }}><DatePicker selected={fromDate} onChange={d => setFromDate(d)} className="dp-input" dateFormat="dd/MM/yyyy" /></div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>TO</span>
            <div style={{ width: '120px' }}><DatePicker selected={toDate} onChange={d => setToDate(d)} className="dp-input" dateFormat="dd/MM/yyyy" /></div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 3-COLUMN INTEGRATED LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.2fr) 200px', gap: '10px', alignItems: 'stretch' }}>
        {/* INVESTMENT BOX */}
        <div style={{ background: '#ffffff', border: '1.5px solid #bdd5f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 1px 6px rgba(59,130,246,0.07)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#3b82f6', marginBottom: '2px', textTransform: 'uppercase' }}>Investment Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Field label="Investment Date">
              <DatePicker selected={investDate} onChange={d => setInvestDate(d)} className="dp-input" dateFormat="dd/MM/yyyy" />
            </Field>
            <Field label="Payment Type">
              <TableDropdown
                value={form.paymentType} displayValue={form.paymentTypeName}
                rows={paymentTypes} valueKey="code" placeholder="Select Type"
                columns={[{ key: 'code', header: 'CODE', width: '30%' }, { key: 'name', header: 'NAME' }]}
                onSelect={r => updateForm({ paymentType: r.code, paymentTypeName: r.name })}
              />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '8px' }}>
            <Field label="Investment Amount">
              <input style={{ ...inp(), textAlign: 'right' }} value={form.amount} onChange={e => updateForm({ amount: e.target.value })} />
            </Field>
            <Field label="Cheque/Draft/Acc/Ref/Card No">
              <input style={inp()} value={form.chqNo} onChange={e => updateForm({ chqNo: e.target.value })} />
            </Field>
          </div>
        </div>

        {/* ACKNOWLEDGEMENT BOX */}
        <div style={{ background: '#ffffff', border: '1.5px solid #bdd5f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 1px 6px rgba(59,130,246,0.07)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#3b82f6', marginBottom: '2px', textTransform: 'uppercase' }}>Acknowledgement Setup</div>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '8px' }}>
            <Field label="Acknowledgement No">
              <input style={inp()} value={form.ackNo} readOnly />
            </Field>
            <Field label="Last No">
              <input style={inp()} value={form.lastNo} placeholder="Last No" readOnly />
            </Field>
          </div>
          <Field label="Bank Branch Code">
            <TableDropdown
              value={form.bankBranchCode} displayValue={form.bankBranchName}
              rows={bankBranches} valueKey="code" placeholder="Select Branch"
              columns={[{ key: 'code', header: 'CODE', width: '30%' }, { key: 'name', header: 'NAME' }]}
              onSelect={r => updateForm({ bankBranchCode: r.code, bankBranchName: r.name })}
            />
          </Field>
          <Field label="Chq/Ref/Exp Date">
            <DatePicker selected={chqDate} onChange={d => setChqDate(d)} className="dp-input" dateFormat="dd/MM/yyyy" />
          </Field>
        </div>

        {/* OPERATIONS & VERIFICATION PANEL */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '10px',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          border: '1.5px solid #93c5fd', borderRadius: '10px',
          padding: '12px', boxShadow: '0 4px 10px rgba(59,130,246,0.12)',
        }}>
          {/* Signature Area */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ ...LBL, color: '#1e40af' }}>Digital Signature / ID</span>
            <div style={{
              width: '100%', height: '70px', border: '1px dashed #94a3b8',
              borderRadius: '6px', background: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#94a3b8',
              fontSize: '10px', fontWeight: 600, textTransform: 'uppercase'
            }}>
              Signature Image
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#475569' }}>
              <input type="checkbox" checked={form.doNotCheck} onChange={e => updateForm({ doNotCheck: e.target.checked })} />
              DO NOT CHECK
            </label>
          </div>

          <div style={{ height: '1px', background: '#e2e8f0', margin: '2px 0' }} />

          {/* Create Account Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ ...LBL, color: '#1e40af', textAlign: 'center' }}>Create Account For</span>
            <button className="ack-btn" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', width: '100%' }} onClick={() => setActiveSubModal('Creations')}>Creations</button>
            <button className="ack-btn" style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', width: '100%' }} onClick={() => setActiveSubModal('Switches')}>Switches</button>
            <button className="ack-btn" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fef3c7', width: '100%' }} onClick={() => setActiveSubModal('Transfers')}>Transfers</button>
          </div>
        </div>
      </div>

      {/* STANDARD ACTION BUTTON PALETTE */}
      <CreationButtonPalette
        onNew={() => setIsEnabled(true)}
        onClear={() => {
          setIsEnabled(false);
          setForm({
            holderNo: '',
            fundCode: '',
            fundName: '',
            accountNo: '',
            paymentType: '',
            paymentTypeName: '',
            amount: '0.00',
            chqNo: '',
            ackNo: '0',
            lastNo: '',
            bankBranchCode: '',
            bankBranchName: '',
            pending: false,
            reportFilter: true,
            doNotCheck: false
          });
          setFromDate(new Date());
          setToDate(new Date());
          setInvestDate(new Date());
          setChqDate(new Date());
        }}
        isEnabled={isEnabled}
      >
        <button className="ack-btn ack-btn-print" style={{ width: 'auto', padding: '0 16px' }}><span>🖨️</span>Print Acknowledgement</button>
        <button className="ack-btn ack-btn-print" style={{ background: '#1e40af', width: 'auto', padding: '0 16px' }}><span>📊</span>Print List</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#475569', marginLeft: '6px' }}>
          <input type="checkbox" checked={form.pending} onChange={e => updateForm({ pending: e.target.checked })} />
          Pending
        </label>
      </CreationButtonPalette>

      <AccountSelectionPopup
        isOpen={!!activeSubModal}
        onClose={() => setActiveSubModal(null)}
        title={`Edit — Account Selection: ${activeSubModal}`}
        onSelect={r => { updateForm({ accountNo: r.actNo }); setActiveSubModal(null); }}
      />
      <AccountSearchModal
        isOpen={showAccountSearch}
        onClose={() => setShowAccountSearch(false)}
        onSelect={r => updateForm({ accountNo: r.accountNo || '' })}
        title="Search Account"
      />
      <HolderSearchModal
        isOpen={showHolderSearch}
        onClose={() => setShowHolderSearch(false)}
        onSelect={(r: HolderRecord) => updateForm({ holderNo: r.holderId })}
      />
    </div>
  );
}

// ========================================
// FUND PRICE E-STATEMENT MODAL
// ========================================
function FundPriceEStatementModal() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showHolderSearch, setShowHolderSearch] = useState(false);
  const [form, setForm] = useState({
    holderNo: '',
    holderName: '',
    fromAddress: 'ops@ceylonam.com',
    toAddress: '',
    ccAddress: '',
    subject: 'Type Subject Here',
    body: 'Type Text Body Here <br><br><br><br>For general enquiries <br>Please contact us via - +94 11 7394000 <br><br>Thank you <br>Ceylon Asset Management Co. Ltd.',
    filePath: '',
    otherAttachments: '',
    includingZeroBalance: false,
    ignoreAlreadySent: false,
    emailingOption: 'Other', // 'Unit Price' or 'Other'
    eStatementReport: true,
    allAttachments: false,
  });

  const updateForm = (updates: Partial<typeof form>) => setForm(prev => ({ ...prev, ...updates }));

  const LBL: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: '#444',
    display: 'inline-block', minWidth: '85px'
  };

  const inpSt: React.CSSProperties = {
    flex: 1, height: '28px', padding: '0 8px', fontSize: '12px',
    border: '1px solid #ccc', borderRadius: '2px', outline: 'none',
    background: isEnabled ? '#fff' : '#f0f0f0'
  };

  const btnSt: React.CSSProperties = {
    height: '28px', padding: '0 12px', fontSize: '11px', fontWeight: 600,
    border: '1px solid #ccc', borderRadius: '3px', background: '#f5f5f5',
    cursor: isEnabled ? 'pointer' : 'not-allowed', color: '#444'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>

      {/* Holder Row */}
      <div style={{ background: '#e8e8e8', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#333', minWidth: '50px' }}>Holder</span>
        <input style={{ ...inpSt, maxWidth: '150px' }} value={form.holderNo} onChange={e => updateForm({ holderNo: e.target.value })} disabled={!isEnabled} />
        <button style={{ ...btnSt, width: '30px', padding: 0 }} onClick={() => isEnabled && setShowHolderSearch(true)} disabled={!isEnabled}>🔍</button>
        <input style={{ ...inpSt, background: '#e0e0e0' }} value={form.holderName} readOnly />
      </div>

      {/* Email Composition */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={LBL}>From Address</span>
          <input style={inpSt} value={form.fromAddress} onChange={e => updateForm({ fromAddress: e.target.value })} disabled={!isEnabled} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={LBL}>To Address</span>
          <input style={inpSt} value={form.toAddress} onChange={e => updateForm({ toAddress: e.target.value })} disabled={!isEnabled} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#444' }}>CC Address</span>
          <input style={inpSt} value={form.ccAddress} onChange={e => updateForm({ ccAddress: e.target.value })} disabled={!isEnabled} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={LBL}>Subject</span>
          <input style={inpSt} value={form.subject} onChange={e => updateForm({ subject: e.target.value })} disabled={!isEnabled} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={LBL}>Text Body</span>
          <textarea
            style={{ ...inpSt, height: '180px', padding: '8px', resize: 'none' }}
            value={form.body}
            onChange={e => updateForm({ body: e.target.value })}
            disabled={!isEnabled}
          />
        </div>
      </div>

      {/* Attachments Group */}
      <fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
        <legend style={{ fontSize: '11px', fontWeight: 700, color: '#666' }}>Attachments</legend>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <button style={btnSt} disabled={!isEnabled}>Brows #...</button>
          <button style={btnSt} disabled={!isEnabled}>Add to List</button>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}>
            <input type="checkbox" checked={form.allAttachments} onChange={e => updateForm({ allAttachments: e.target.checked })} disabled={!isEnabled} />
            All
          </label>
          <button style={{ ...btnSt, color: '#c00', border: '1px solid #faa' }} disabled={!isEnabled}>Remove From List</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, minWidth: '60px' }}>File Path</span>
          <input style={inpSt} value={form.filePath} onChange={e => updateForm({ filePath: e.target.value })} disabled={!isEnabled} />
        </div>
        <textarea
          style={{ ...inpSt, height: '60px', width: '100%', resize: 'none' }}
          placeholder="Other Attachment Files"
          value={form.otherAttachments}
          onChange={e => updateForm({ otherAttachments: e.target.value })}
          disabled={!isEnabled}
        />
      </fieldset>

      {/* Processing Options */}
      <div style={{ display: 'flex', gap: '20px', padding: '0 5px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#333' }}>
          <input type="checkbox" checked={form.includingZeroBalance} onChange={e => updateForm({ includingZeroBalance: e.target.checked })} disabled={!isEnabled} />
          Including Zero Balance Accounts
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#333' }}>
          <input type="checkbox" checked={form.ignoreAlreadySent} onChange={e => updateForm({ ignoreAlreadySent: e.target.checked })} disabled={!isEnabled} />
          Ignore Already Sent E-Mails(Bulk)
        </label>
      </div>

      {/* Emailing Options Group */}
      <fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', alignSelf: 'center', minWidth: '350px' }}>
        <legend style={{ fontSize: '11px', fontWeight: 700, color: '#666' }}>Emailing Options</legend>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700 }}>
            <input type="radio" name="emailOpt" checked={form.emailingOption === 'Unit Price'} onChange={() => updateForm({ emailingOption: 'Unit Price' })} disabled={!isEnabled} />
            Unit Price
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700 }}>
            <input type="radio" name="emailOpt" checked={form.emailingOption === 'Other'} onChange={() => updateForm({ emailingOption: 'Other' })} disabled={!isEnabled} />
            Other
          </label>
        </div>
      </fieldset>

      {/* Action Buttons */}
      <CreationButtonPalette
        onNew={() => setIsEnabled(true)}
        onClear={() => {
          setIsEnabled(false);
          setForm({
            holderNo: '', holderName: '', fromAddress: 'ops@ceylonam.com', toAddress: '', ccAddress: '',
            subject: 'Type Subject Here', body: 'Type Text Body Here <br><br><br><br>For general enquiries <br>Please contact us via - +94 11 7394000 <br><br>Thank you <br>Ceylon Asset Management Co. Ltd.', filePath: '', otherAttachments: '',
            includingZeroBalance: false, ignoreAlreadySent: false, emailingOption: 'Other',
            eStatementReport: true, allAttachments: false
          });
        }}
        isEnabled={isEnabled}
      >
        <button
          className="setup-btn"
          style={{ background: isEnabled ? '#1e40af' : '#94a3b8', color: '#fff' }}
          disabled={!isEnabled}
        >
          <span className="setup-btn-icon">📧</span>Send email
        </button>
        <button
          className="setup-btn"
          style={{ background: isEnabled ? '#0369a1' : '#94a3b8', color: '#fff' }}
          disabled={!isEnabled}
        >
          <span className="setup-btn-icon">⚡</span>Bulk Email
        </button>
      </CreationButtonPalette>

      <HolderSearchModal
        isOpen={showHolderSearch}
        onClose={() => setShowHolderSearch(false)}
        onSelect={(r: HolderRecord) => {
          updateForm({ holderNo: r.holderId, holderName: r.holderName });
          setShowHolderSearch(false);
        }}
      />
    </div>
  );
}


// ========================================
// WHT PER UNIT ENTRY MODAL
// ========================================
function WHTPerUnitEntryModal() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [form, setForm] = useState({
    fundCode: '',
    fundName: '',
    whtPerUnit: '0.000000',
  });

  const [records] = useState([
    { fundCode: 'F001', date: '19/Oct/2007', wht: '0.005000' },
    { fundCode: 'F002', date: '20/Oct/2007', wht: '0.004500' },
    { fundCode: 'F003', date: '21/Oct/2007', wht: '0.006000' },
  ]);

  const updateForm = (updates: Partial<typeof form>) => setForm(prev => ({ ...prev, ...updates }));

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: '10px 12px',
    background: '#1e3a8a',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'left',
    borderRight: '1px solid rgba(255,255,255,0.1)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px' }}>

      {/* FORM SECTION */}
      <div style={cardStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>

          <InputRow label="Fund Code" labelWidth={100}>
            <TableDropdown
              value={form.fundCode}
              displayValue={form.fundName ? `${form.fundCode} - ${form.fundName}` : ''}
              placeholder="Select Fund"
              columns={[
                { key: 'code', header: 'Code', width: '30%' },
                { key: 'name', header: 'Name' }
              ]}
              rows={fundData}
              valueKey="code"
              onSelect={r => updateForm({ fundCode: r.code, fundName: r.name })}
              disabled={!isEnabled}
            />
          </InputRow>

          <InputRow label="Date" labelWidth={100}>
            <div style={{ flex: 1 }}>
              <DatePicker
                selected={selectedDate}
                onChange={d => setSelectedDate(d)}
                dateFormat="dd/MMM/yyyy"
                className="date-picker-input"
                disabled={!isEnabled}
              />
            </div>
          </InputRow>

          <InputRow label="WHT Per Unit" labelWidth={100}>
            <input
              type="text"
              style={{
                height: '30px', padding: '0 10px', fontSize: '13px',
                border: '1px solid #cfd8e3', borderRadius: '6px',
                background: isEnabled ? '#fff' : '#f8fafc',
                width: '100%', outline: 'none'
              }}
              value={form.whtPerUnit}
              onChange={e => updateForm({ whtPerUnit: e.target.value })}
              disabled={!isEnabled}
            />
          </InputRow>

        </div>
      </div>

      {/* ACTION PALETTE */}
      <CreationButtonPalette
        onNew={() => setIsEnabled(true)}
        onClear={() => {
          setIsEnabled(false);
          setForm({ fundCode: '', fundName: '', whtPerUnit: '0.000000' });
          setSelectedDate(new Date());
        }}
        isEnabled={isEnabled}
      />

      {/* DATA VIEW TABLE */}
      <div style={{ ...cardStyle, padding: '0', overflow: 'hidden' }}>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Fund Code</th>
                <th style={tableHeaderStyle}>Date</th>
                <th style={{ ...tableHeaderStyle, borderRight: 'none' }}>WHT Per Unit</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr
                  key={i}
                  onDoubleClick={() => {
                    if (!isEnabled) setIsEnabled(true);
                    const fund = fundData.find(f => f.code === r.fundCode);
                    updateForm({ fundCode: r.fundCode, fundName: fund?.name || '', whtPerUnit: r.wht });
                  }}
                  style={{
                    cursor: 'pointer',
                    borderBottom: '1px solid #f1f5f9',
                    background: i % 2 === 0 ? '#ffffff' : '#fbfcfe',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#ffffff' : '#fbfcfe'}
                >
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: '#1e3a8a', fontWeight: 700 }}>{r.fundCode}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: '#334155' }}>{r.date}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: '#0f766e', fontWeight: 600 }}>{r.wht}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '8px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
          Double click to get the selected value
        </div>
      </div>

    </div>
  );
}


// ========================================
// TRANSACTION UPLOAD MODAL
// ========================================
function TransactionUploadModal() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [txnDate, setTxnDate] = useState<Date | null>(new Date());
  const [sourceFile, setSourceFile] = useState('');

  const [previewData] = useState([
    { accNo: '10002345', amount: '25,000.00', mode: 'Cheque', ref: 'CHQ-88291' },
    { accNo: '10005567', amount: '12,500.00', mode: 'Bank Transfer', ref: 'BT-11029' },
    { accNo: '10003312', amount: '50,000.00', mode: 'Cash', ref: 'CASH-991' },
  ]);

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
  };

  const headerAlertStyle: React.CSSProperties = {
    background: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#0369a1',
    fontWeight: 600,
    fontSize: '13px'
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: '12px',
    background: '#f8fafc',
    color: '#475569',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'left',
    borderBottom: '2px solid #e2e8f0'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px' }}>

      {/* HEADER INFO */}
      <div style={headerAlertStyle}>
        <span style={{ fontSize: '18px' }}>ℹ️</span>
        File Date Format - "YYYY-MM-DD"
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="setup-btn" style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }} disabled={!isEnabled}>
              UnitCorrectionADD
            </button>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <InputRow label="Transaction Date" labelWidth={130} style={{ flex: '0 0 auto', marginBottom: 0 }}>
              <div style={{ width: '150px' }}>
                <DatePicker
                  selected={txnDate}
                  onChange={d => setTxnDate(d)}
                  dateFormat="dd/MMM/yyyy"
                  className="date-picker-input"
                  disabled={!isEnabled}
                />
              </div>
            </InputRow>

            <InputRow label="Source File" labelWidth={100} style={{ flex: 1, marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                <input
                  type="text"
                  style={{
                    height: '32px', padding: '0 12px', fontSize: '13px',
                    border: '1px solid #cbd5e1', borderRadius: '6px',
                    background: isEnabled ? '#fff' : '#f8fafc', flex: 1, outline: 'none'
                  }}
                  value={sourceFile}
                  onChange={e => setSourceFile(e.target.value)}
                  placeholder="Choose transaction data file..."
                  disabled={!isEnabled}
                />
                <button
                  className="setup-btn"
                  style={{ background: '#2563eb', color: '#fff', border: 'none', minWidth: '100px', justifyContent: 'center' }}
                  disabled={!isEnabled}
                >
                  Browse
                </button>
              </div>
            </InputRow>
          </div>

        </div>
      </div>

      {/* ACTION PALETTE */}
      <CreationButtonPalette
        onNew={() => setIsEnabled(true)}
        onClear={() => {
          setIsEnabled(false);
          setTxnDate(new Date());
          setSourceFile('');
        }}
        isEnabled={isEnabled}
      >
        <button
          className="setup-btn no-hover"
          style={{
            background: isEnabled ? '#ef4444' : '#94a3b8',
            color: '#fff',
            padding: '0 24px',
            fontSize: '13px',
            fontWeight: 700
          }}
          disabled={!isEnabled}
        >
          Upload
        </button>
      </CreationButtonPalette>

      {/* PREVIEW TABLE */}
      <div style={{ ...cardStyle, padding: '0', overflow: 'hidden' }}>
        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Account Number</th>
                <th style={tableHeaderStyle}>Amount</th>
                <th style={tableHeaderStyle}>Payment Mode</th>
                <th style={tableHeaderStyle}>Reference No</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fbfcfe' }}>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#1e3a8a', fontWeight: 600 }}>{row.accNo}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#334155', textAlign: 'right' }}>{row.amount}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}>{row.mode}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>{row.ref}</td>
                </tr>
              ))}
              {isEnabled && Array(3).fill(0).map((_, i) => (
                <tr key={`empty-${i}`} style={{ borderBottom: '1px solid #f1f5f9', height: '40px' }}>
                  <td colSpan={4} style={{ background: '#fff' }}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}


// ========================================
// UPLOAD AND DOWNLOAD DATA WEB-AUTOMATED MODAL
// ========================================
function UploadDownloadWebAutomatedModal() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [sqlOptions, setSqlOptions] = useState({ testDb: false });
  const [actionOptions, setActionOptions] = useState({ withReturnValues: false, sqlDbReturnTransferOnly: false });
  const [selectedSqlTable, setSelectedSqlTable] = useState('Profiles');
  const [selectedMslTable, setSelectedMslTable] = useState('Returns');

  const sqlTables = ['Profiles', 'Account', 'Price', 'Trans', 'Balance', 'Returns', 'Count'];
  const mslTables = ['Returns', 'Count'];

  const LBL: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: '#475569',
    textTransform: 'uppercase', letterSpacing: '0.04em'
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const radioLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#334155',
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'background 0.2s'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '16px' }}>

        {/* LEFT COLUMN: OPTIONS & TABLES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* SQL DATABASE CONNECTION */}
          <div style={cardStyle}>
            <div style={{ ...LBL, marginBottom: '12px', color: '#1e40af', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>SQL DataBase</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="setup-btn"
                style={{
                  background: isEnabled ? '#2563eb' : '#94a3b8',
                  color: '#fff',
                  width: '100%',
                  justifyContent: 'center'
                }}
                disabled={!isEnabled}
              >
                <span className="setup-btn-icon">🔌</span>Connect
              </button>
              <label style={{ ...radioLabelStyle, opacity: isEnabled ? 1 : 0.6 }}>
                <input
                  type="checkbox"
                  checked={sqlOptions.testDb}
                  onChange={e => setSqlOptions({ testDb: e.target.checked })}
                  disabled={!isEnabled}
                />
                Test DB
              </label>
            </div>
          </div>

          {/* SQL TABLES SELECTION */}
          <div style={cardStyle}>
            <div style={{ ...LBL, marginBottom: '12px', color: '#1e40af', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>SQL Tables</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {sqlTables.map(t => (
                <label key={t} style={{
                  ...radioLabelStyle,
                  background: selectedSqlTable === t ? '#eff6ff' : 'transparent',
                  fontWeight: selectedSqlTable === t ? 600 : 400
                }}>
                  <input
                    type="radio"
                    name="sqlTable"
                    checked={selectedSqlTable === t}
                    onChange={() => setSelectedSqlTable(t)}
                    disabled={!isEnabled}
                  />
                  {t}
                </label>
              ))}
            </div>
            <button
              className="setup-btn"
              style={{ background: isEnabled ? '#f8fafc' : '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', width: '100%', marginTop: '12px', justifyContent: 'center' }}
              disabled={!isEnabled}
            >
              Show
            </button>
          </div>

          {/* MSL TABLES SELECTION */}
          <div style={cardStyle}>
            <div style={{ ...LBL, marginBottom: '12px', color: '#1e40af', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>MSL Tables</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {mslTables.map(t => (
                <label key={t} style={{
                  ...radioLabelStyle,
                  background: selectedMslTable === t ? '#eff6ff' : 'transparent',
                  fontWeight: selectedMslTable === t ? 600 : 400
                }}>
                  <input
                    type="radio"
                    name="mslTable"
                    checked={selectedMslTable === t}
                    onChange={() => setSelectedMslTable(t)}
                    disabled={!isEnabled}
                  />
                  {t}
                </label>
              ))}
            </div>
            <button
              className="setup-btn"
              style={{ background: isEnabled ? '#f8fafc' : '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', width: '100%', marginTop: '12px', justifyContent: 'center' }}
              disabled={!isEnabled}
            >
              Show
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTIONS & STATUS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ACTION BAR */}
          <div style={{ ...cardStyle, background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <button
                className="setup-btn no-hover"
                style={{ background: isEnabled ? '#1d4ed8' : '#94a3b8', color: '#fff', padding: '8px 20px' }}
                disabled={!isEnabled}
              >
                <span className="setup-btn-icon">⬇️</span>Download
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
                <label style={{ ...radioLabelStyle, opacity: isEnabled ? 1 : 0.6 }}>
                  <input
                    type="checkbox"
                    checked={actionOptions.withReturnValues}
                    onChange={e => setActionOptions(prev => ({ ...prev, withReturnValues: e.target.checked }))}
                    disabled={!isEnabled}
                  />
                  With Return Values
                </label>

                <button
                  className="setup-btn no-hover"
                  style={{ background: isEnabled ? '#ffffff' : '#f1f5f9', color: '#1e40af', border: '1px solid #1e40af' }}
                  disabled={!isEnabled}
                >
                  <span className="setup-btn-icon">📤</span>Upload
                </button>

                <label style={{ ...radioLabelStyle, opacity: isEnabled ? 1 : 0.6 }}>
                  <input
                    type="checkbox"
                    checked={actionOptions.sqlDbReturnTransferOnly}
                    onChange={e => setActionOptions(prev => ({ ...prev, sqlDbReturnTransferOnly: e.target.checked }))}
                    disabled={!isEnabled}
                  />
                  Sql DB Return Transfer Only
                </label>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                <button
                  className="setup-btn"
                  style={{ background: isEnabled ? '#0891b2' : '#94a3b8', color: '#fff' }}
                  disabled={!isEnabled}
                >
                  Compute Returns
                </button>
                <button
                  className="setup-btn"
                  style={{ background: isEnabled ? '#0f766e' : '#94a3b8', color: '#fff' }}
                  disabled={!isEnabled}
                >
                  Export Return Values
                </button>
              </div>
            </div>
          </div>

          {/* STATUS CONSOLE / LOG AREA */}
          <div style={{
            ...cardStyle,
            flex: 1,
            background: '#1e293b',
            color: '#34d399',
            fontFamily: "'Fira Code', 'Courier New', monospace",
            fontSize: '13px',
            minHeight: '400px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              background: '#334155',
              color: '#f8fafc',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
              margin: '-16px -16px 16px -16px'
            }}>
              <span>CONNECTION LOG / STATUS</span>
              <span style={{ opacity: 0.7 }}>Ready</span>
            </div>
            <div style={{ flex: 1 }}>
              {isEnabled ? (
                <>
                  <div>[SYSTEM] Local automated services initialized...</div>
                  <div style={{ color: '#94a3b8' }}>Waiting for database connection...</div>
                </>
              ) : (
                <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontStyle: 'italic' }}>
                  System in standby mode. Click 'New' to initialize session.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER PALETTE */}
      <CreationButtonPalette
        onNew={() => setIsEnabled(true)}
        onClear={() => {
          setIsEnabled(false);
          setSqlOptions({ testDb: false });
          setActionOptions({ withReturnValues: false, sqlDbReturnTransferOnly: false });
          setSelectedSqlTable('Profiles');
          setSelectedMslTable('Returns');
        }}
        isEnabled={isEnabled}
      />

    </div>
  );
}


// ========================================
// MAIN UNIT OPERATIONS COMPONENT
// ========================================

function UnitOperations() {
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [activeTab, setActiveTab] = useState<'Unit Price' | 'Creation Charges' | 'Redemption Charges'>('Unit Price');
  const [showFundTable, setShowFundTable] = useState(false);
  const [fundTablePos, setFundTablePos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 400 });
  const unitFeesFundRef = useRef<HTMLDivElement>(null);
  const [priceDate, setPriceDate] = useState<Date | null>(null);
  const [unitFeesFormData, setUnitFeesFormData] = useState({
    fund: '', fundCode: '', fundName: '',
    beforeBrokerageNAV: '', beforeBrokerageNAVAmount: '0.00',
    afterBrokerageNAV: '', afterBrokerageNAVAmount: '0.00',
    whtRate: '0.00',
    creationPriceWithoutFee: '0.000000', creationPriceWithFee: '0.000000',
    redeemPriceWithoutFee: '0.000000', redeemPriceWithFee: '0.000000',
    fundDetails: '', creationCharges: '', redemptionCharges: '',
    totalUnits: '', totalHolders: '',
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showFundTable && !target.closest('[data-table="fund"]')) setShowFundTable(false);
    };
    if (showFundTable) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFundTable]);

  const handleModalOpen = (idx: number) => setModalIdx(idx);

  const handleModalClose = () => {
    setModalIdx(null);
    setActiveTab('Unit Price');
    setPriceDate(null);
    setUnitFeesFormData({
      fund: '', fundCode: '', fundName: '',
      beforeBrokerageNAV: '', beforeBrokerageNAVAmount: '0.00',
      afterBrokerageNAV: '', afterBrokerageNAVAmount: '0.00',
      whtRate: '0.00',
      creationPriceWithoutFee: '0.000000', creationPriceWithFee: '0.000000',
      redeemPriceWithoutFee: '0.000000', redeemPriceWithFee: '0.000000',
      fundDetails: '', creationCharges: '', redemptionCharges: '',
      totalHolders: '', totalUnits: '',
    });
  };

  const handleInputChange = (field: string, value: string) =>
    setUnitFeesFormData(prev => ({ ...prev, [field]: value }));

  type CreationChargeRow = { feeCode: string; description: string; percentage: number; amount: number };
  type ChargeRow = { feeCode: string; description: string; percentage: number; amount: number };

  const [creationChargesTable, setCreationChargesTable] = useState<CreationChargeRow[]>([
    { feeCode: 'FC001', description: 'Initial Setup Fee', percentage: 2.5, amount: 15000 },
    { feeCode: 'FC002', description: 'Admin Charges', percentage: 1.2, amount: 8000 },
  ]);
  const [redemptionChargesTable, setRedemptionChargesTable] = useState<ChargeRow[]>([
    { feeCode: 'RC001', description: 'Early Redemption Fee', percentage: 1.5, amount: 5000 },
    { feeCode: 'RC002', description: 'Processing Fee', percentage: 0.8, amount: 3000 },
  ]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CreationChargeRow; direction: 'asc' | 'desc' } | null>(null);
  const [redemptionSortConfig, setRedemptionSortConfig] = useState<{ key: keyof ChargeRow; direction: 'asc' | 'desc' } | null>(null);

  const cellStyle: React.CSSProperties = { padding: '6px 8px', border: '1px solid #e5e7eb' };

  const handleSort = (key: keyof CreationChargeRow) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCreationChargesTable(prev => [...prev].sort((a, b) => a[key] < b[key] ? (direction === 'asc' ? -1 : 1) : a[key] > b[key] ? (direction === 'asc' ? 1 : -1) : 0));
  };

  const handleRedemptionSort = (key: keyof ChargeRow) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (redemptionSortConfig?.key === key && redemptionSortConfig.direction === 'asc') direction = 'desc';
    setRedemptionSortConfig({ key, direction });
    setRedemptionChargesTable(prev => [...prev].sort((a, b) => a[key] < b[key] ? (direction === 'asc' ? -1 : 1) : a[key] > b[key] ? (direction === 'asc' ? 1 : -1) : 0));
  };

  const renderUnitFeesModal = () => (
    <>
      <div className="setup-input-section" style={{ marginTop: '0' }}>
        <div className="setup-ash-box" style={{ padding: '8px', width: '100%' }}>
          {/* Tab headers */}
          <div role="tablist" style={{ display: 'flex', flexWrap: 'nowrap', gap: '6px', marginBottom: '6px', overflowX: 'auto' }}>
            {(['Unit Price', 'Creation Charges', 'Redemption Charges'] as const).map(tab => (
              <div key={tab} role="tab" tabIndex={0}
                onClick={() => setActiveTab(tab)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(tab); }}
                style={{
                  padding: '6px 10px',
                  background: activeTab === tab ? '#ffffff' : '#e2e8f0',
                  color: '#0f172a',
                  border: activeTab === tab ? '2px solid #0ea5e9' : '1px solid #cbd5e1',
                  borderBottom: activeTab === tab ? '2px solid #ffffff' : '1px solid #cbd5e1',
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer', fontWeight: 600, minHeight: '28px',
                  lineHeight: 1.25, fontSize: '11px', flex: '0 0 auto',
                }}
              >{tab}</div>
            ))}
          </div>

          <div>
            {activeTab === 'Unit Price' && (
              <>
                <div className="setup-ash-box" style={{ padding: '8px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 50%' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px', fontSize: '12px' }}>Fund</label>
                      <div style={{ position: 'relative', flex: 1 }} data-table="fund">
                        <div ref={unitFeesFundRef} onClick={() => {
                          if (!showFundTable && unitFeesFundRef.current) {
                            const rect = unitFeesFundRef.current.getBoundingClientRect();
                            setFundTablePos({ top: rect.bottom + 3, left: rect.left, width: Math.max(rect.width, 400) });
                          }
                          setShowFundTable(v => !v);
                        }}
                          style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: 'pointer', color: unitFeesFormData.fundName ? '#0f172a' : '#64748b', minHeight: '30px', display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                          {unitFeesFormData.fundName || 'Select fund'}
                        </div>
                        {showFundTable && createPortal(
                          <div data-table="fund" style={{ position: 'fixed', top: fundTablePos.top, left: fundTablePos.left, width: fundTablePos.width, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', boxShadow: '0 12px 32px rgba(0,0,0,0.18)', zIndex: 2147483647, maxHeight: '220px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ background: '#1e3a8a' }}>
                                  <th style={{ padding: '7px 10px', textAlign: 'left', color: '#fff', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', width: '30%' }}>Code</th>
                                  <th style={{ padding: '7px 10px', textAlign: 'left', color: '#fff', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fundData.map((fund, i) => (
                                  <tr key={i}
                                    onClick={() => { setUnitFeesFormData(prev => ({ ...prev, fund: fund.code, fundCode: fund.code, fundName: fund.name })); setShowFundTable(false); }}
                                    style={{ cursor: 'pointer', background: unitFeesFormData.fundCode === fund.code ? '#eff6ff' : i % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
                                    onMouseEnter={e => { if (unitFeesFormData.fundCode !== fund.code) (e.currentTarget as HTMLTableRowElement).style.background = '#dbeafe'; }}
                                    onMouseLeave={e => { if (unitFeesFormData.fundCode !== fund.code) (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? '#ffffff' : '#f8fafc'; }}
                                  >
                                    <td style={{ padding: '7px 10px', color: '#1e3a8a', fontWeight: 700, fontSize: '12px', width: '30%' }}>{fund.code}</td>
                                    <td style={{ padding: '7px 10px', color: '#1f2937', fontSize: '12px' }}>{fund.name}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>,
                          document.body
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 50%' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px', fontSize: '12px' }}>Price Date</label>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <DatePicker selected={priceDate} onChange={(d: Date | null) => setPriceDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" placeholderText="Select date" showYearDropdown showMonthDropdown dropdownMode="select" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="setup-action-buttons" style={{ marginBottom: '6px', marginTop: '4px', gap: '6px' }}>
                  <button className="setup-btn setup-btn-new" onClick={handleModalClose}><span className="setup-btn-icon">+</span>New</button>
                  <button className="setup-btn setup-btn-save"><span className="setup-btn-icon">💾</span>Save</button>
                  <button className="setup-btn setup-btn-delete"><span className="setup-btn-icon">🗑️</span>Delete</button>
                  <button className="setup-btn setup-btn-print"><span className="setup-btn-icon">🖨️</span>Print</button>
                  <button className="setup-btn setup-btn-clear" onClick={() => { setPriceDate(null); setUnitFeesFormData({ fund: '', fundCode: '', fundName: '', beforeBrokerageNAV: '', beforeBrokerageNAVAmount: '0.00', afterBrokerageNAV: '', afterBrokerageNAVAmount: '0.00', whtRate: '0.00', creationPriceWithoutFee: '0.000000', creationPriceWithFee: '0.000000', redeemPriceWithoutFee: '0.000000', redeemPriceWithFee: '0.000000', fundDetails: '', creationCharges: '', redemptionCharges: '', totalUnits: '', totalHolders: '' }); }}><span className="setup-btn-icon">🗑️</span>Clear</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '8px', fontWeight: 600, fontSize: '11px' }}>Before Brokerage</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div className="setup-input-group"><label className="setup-input-label" style={{ fontSize: '11px' }}>NAV</label><input type="number" className="setup-input-field" value={unitFeesFormData.beforeBrokerageNAV} onChange={e => handleInputChange('beforeBrokerageNAV', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                      <div className="setup-input-group"><label className="setup-input-label" style={{ fontSize: '11px' }}>NAV Amount</label><input type="number" step="0.01" className="setup-input-field" value={unitFeesFormData.beforeBrokerageNAVAmount} onChange={e => handleInputChange('beforeBrokerageNAVAmount', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '8px', fontWeight: 600, fontSize: '11px' }}>After Brokerage</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div className="setup-input-group"><label className="setup-input-label" style={{ fontSize: '11px' }}>NAV</label><input type="number" className="setup-input-field" value={unitFeesFormData.afterBrokerageNAV} onChange={e => handleInputChange('afterBrokerageNAV', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                      <div className="setup-input-group"><label className="setup-input-label" style={{ fontSize: '11px' }}>NAV Amount</label><input type="number" step="0.01" className="setup-input-field" value={unitFeesFormData.afterBrokerageNAVAmount} onChange={e => handleInputChange('afterBrokerageNAVAmount', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px', fontWeight: 700, fontSize: '11px' }}>WHT Rate per Unit</div>
                    <div className="setup-input-group"><label className="setup-input-label" style={{ fontSize: '11px' }}>WHT</label><input type="number" step="0.01" className="setup-input-field" value={unitFeesFormData.whtRate} onChange={e => handleInputChange('whtRate', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px', fontWeight: 700, fontSize: '11px' }}>Creation Price</div>
                    <div className="setup-input-group" style={{ marginBottom: '6px' }}><label className="setup-input-label" style={{ fontSize: '11px' }}>Without Front End Fee</label><input type="number" step="0.000001" className="setup-input-field" value={unitFeesFormData.creationPriceWithoutFee} onChange={e => handleInputChange('creationPriceWithoutFee', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                    <div className="setup-input-group"><label className="setup-input-label" style={{ fontSize: '11px' }}>With Front End Fee</label><input type="number" step="0.000001" className="setup-input-field" value={unitFeesFormData.creationPriceWithFee} onChange={e => handleInputChange('creationPriceWithFee', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px', fontWeight: 700, fontSize: '11px' }}>Redeem Price</div>
                    <div className="setup-input-group" style={{ marginBottom: '6px' }}><label className="setup-input-label" style={{ fontSize: '11px' }}>Without Exit Fee</label><input type="number" step="0.000001" className="setup-input-field" value={unitFeesFormData.redeemPriceWithoutFee} onChange={e => handleInputChange('redeemPriceWithoutFee', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                    <div className="setup-input-group"><label className="setup-input-label" style={{ fontSize: '11px' }}>With Exit Fee</label><input type="number" step="0.000001" className="setup-input-field" value={unitFeesFormData.redeemPriceWithFee} onChange={e => handleInputChange('redeemPriceWithFee', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px', fontWeight: 700, fontSize: '11px' }}>Fund Details</div>
                    <div className="setup-input-group" style={{ marginBottom: '6px' }}><label className="setup-input-label" style={{ fontSize: '11px' }}>Total No of Units</label><input type="number" className="setup-input-field" value={unitFeesFormData.totalUnits} onChange={e => handleInputChange('totalUnits', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                    <div className="setup-input-group"><label className="setup-input-label" style={{ fontSize: '11px' }}>Total No of Holders</label><input type="number" className="setup-input-field" value={unitFeesFormData.totalHolders} onChange={e => handleInputChange('totalHolders', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} /></div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Creation Charges' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#000' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      {(['feeCode', 'description', 'percentage', 'amount'] as const).map(col => (
                        <th key={col} onClick={() => handleSort(col)} style={{ padding: '8px', border: '1px solid #e5e7eb', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}>
                          {col === 'feeCode' ? 'Fee Code' : col === 'description' ? 'Description' : col === 'percentage' ? 'Percentage (%)' : 'Amount'}
                          {sortConfig?.key === col && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {creationChargesTable.map((row, i) => (
                      <tr key={i}><td style={cellStyle}>{row.feeCode}</td><td style={cellStyle}>{row.description}</td><td style={cellStyle}>{row.percentage}</td><td style={cellStyle}>{row.amount.toLocaleString()}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Redemption Charges' && (
              <div style={{ overflowX: 'auto', color: '#000' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      {(['feeCode', 'description', 'percentage', 'amount'] as const).map(col => (
                        <th key={col} onClick={() => handleRedemptionSort(col)} style={{ padding: '8px', border: '1px solid #e5e7eb', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}>
                          {col === 'feeCode' ? 'Fee Code' : col === 'description' ? 'Description' : col === 'percentage' ? 'Percentage (%)' : 'Amount'}
                          {redemptionSortConfig?.key === col && (redemptionSortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {redemptionChargesTable.map((row, i) => (
                      <tr key={i}><td style={cellStyle}>{row.feeCode}</td><td style={cellStyle}>{row.description}</td><td style={cellStyle}>{row.percentage}</td><td style={cellStyle}>{row.amount.toLocaleString()}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {activeTab !== 'Unit Price' && (
            <div className="setup-action-buttons" style={{ marginTop: '6px', gap: '6px' }}>
              <button className="setup-btn setup-btn-new" onClick={handleModalClose}><span className="setup-btn-icon">+</span>New</button>
              <button className="setup-btn setup-btn-save"><span className="setup-btn-icon">💾</span>Save</button>
              <button className="setup-btn setup-btn-delete"><span className="setup-btn-icon">🗑️</span>Delete</button>
              <button className="setup-btn setup-btn-print"><span className="setup-btn-icon">🖨️</span>Print</button>
              <button className="setup-btn setup-btn-clear" onClick={() => { setPriceDate(null); setUnitFeesFormData({ fund: '', fundCode: '', fundName: '', beforeBrokerageNAV: '', beforeBrokerageNAVAmount: '0.00', afterBrokerageNAV: '', afterBrokerageNAVAmount: '0.00', whtRate: '0.00', creationPriceWithoutFee: '0.000000', creationPriceWithFee: '0.000000', redeemPriceWithoutFee: '0.000000', redeemPriceWithFee: '0.000000', fundDetails: '', creationCharges: '', redemptionCharges: '', totalHolders: '', totalUnits: '' }); }}><span className="setup-btn-icon">🗑️</span>Clear</button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderActiveModal = () => {
    if (modalIdx === null) return null;
    const title = modules[modalIdx].title;
    switch (title) {
      case 'Unit Fees': return renderUnitFeesModal();
      case 'Unit Creation': return <UnitCreationModal onClose={handleModalClose} />;
      case 'Unit Redemption': return <UnitRedemptionModal onClose={handleModalClose} />;
      case 'Unit Transfer/Switching': return <UnitTransferSwitchingModal onClose={handleModalClose} />;
      case 'Unit Consolidation': return <UnitConsolidationModal onClose={handleModalClose} />;
      case 'Unit Blocking': return <UnitBlockingModal onClose={handleModalClose} />;
      case 'Dividend Issues': return <DividendIssuesModal onClose={handleModalClose} />;
      case 'Redemption Cheque Printing': return <RedemptionChequeUpdateModal />;
      case 'Cheque Re Printing': return <ChequeRePrintingModal onClose={handleModalClose} />;
      case 'Web Data Downloading': return <WebDataDownloadingModal onClose={handleModalClose} />;
      case 'Standing Instructions': return <StandingInstructionsModal />;
      case 'Standing Instructions Processing': return <StandingInstructionsProcessingModal onClose={handleModalClose} />;
      case 'Bank Slip Transfer': return <BankSlipTransferModal />;
      case 'Reminders': return <RemindersModal onClose={handleModalClose} />;
      case 'Unit Transfer - Suspense Account': return <UnitTransferSuspenseAccountModal onClose={handleModalClose} />;
      case 'Change Agent for Transaction': return <ChangeAgentForTransactionModal />;
      case 'Acknowledgement Printing': return <AcknowledgementPrintingModal />;
      case 'Fund Price E-statement': return <FundPriceEStatementModal />;
      case 'Upload and Download Data Web-Automated': return <UploadDownloadWebAutomatedModal />;
      case 'WHT Per Unit Entry': return <WHTPerUnitEntryModal />;
      case 'Transaction Upload': return <TransactionUploadModal />;
      default:
        return (
          <div className="empty-content">
            <p>Content for <strong>{title}</strong> will be implemented here.</p>
            <p>This is a placeholder modal.</p>
          </div>
        );
    }
  };

  const footerNotNeeded = modalIdx !== null && [
    'Unit Fees', 'Unit Creation', 'Unit Redemption', 'Unit Transfer/Switching',
    'Unit Consolidation', 'Unit Blocking', 'Dividend Issues', 'Redemption Cheque Printing',
    'Cheque Re Printing', 'Web Data Downloading', 'Standing Instructions',
    'Standing Instructions Processing', 'Bank Slip Transfer', 'Reminders',
    'Unit Transfer - Suspense Account', 'Change Agent for Transaction', 'Acknowledgement Printing',
    'Fund Price E-statement', 'Upload and Download Data Web-Automated', 'WHT Per Unit Entry', 'Transaction Upload'
  ].includes(modules[modalIdx].title);

  return (
    <>
      <div className="navbar-fixed-wrapper"><Navbar /></div>
      <div className="setup-main-layout">
        <div className="home-sidebar-container"><Sidebar /></div>
        <div className="setup-main-content">
          <div className="setup-main-card magical-bg animated-bg">

            <div className="setup-modules-grid">
              {modules.map((mod, idx) => (
                <div key={idx} className="setup-module-card" tabIndex={0}
                  onClick={() => handleModalOpen(idx)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleModalOpen(idx); }}
                >
                  <div className="setup-module-icon">{mod.icon}</div>
                  <div className="setup-module-title">{mod.title}</div>
                </div>
              ))}
            </div>

            {modalIdx !== null && createPortal(
              <div className={`setup-modal-overlay ${isMobile ? 'mobile' : ''}`} onClick={handleModalClose}>
                <div className={`setup-modal-container ${isMobile ? 'mobile' : ''}`} onClick={e => e.stopPropagation()}>

                  <div className="setup-modal-header">
                    <div className="setup-modal-header-content">
                      <span className="setup-modal-header-icon">{modules[modalIdx].icon}</span>
                      <span className="setup-modal-header-title">{modules[modalIdx].title}</span>
                    </div>
                    <button onClick={handleModalClose} className="setup-modal-close-btn" aria-label="Close modal">×</button>
                  </div>

                  <div className="setup-modal-content" style={{ overflow: 'auto', padding: '8px', isolation: 'auto' }}>
                    {renderActiveModal()}
                  </div>

                  {!footerNotNeeded && (
                    <div className="setup-modal-footer"><p>Unit Operations Module</p></div>
                  )}
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UnitOperations;
