import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect } from 'react';
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
  { title: 'Unit Transfer', icon: '🔄' },
  { title: 'Unit Consolidation', icon: '🔗' },
  { title: 'Unit Switching', icon: '🔄' },
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

// ========================================
// UNIT CREATION — Shared sub-components
// ========================================

function BadgeBtn({ label, color = '#1e3a8a' }: { label: string; color?: string }) {
  return (
    <button
      type="button"
      style={{
        background: color, color: '#fff', border: 'none', borderRadius: '3px',
        width: '20px', height: '20px', fontSize: '10px', fontWeight: 700,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0, padding: 0,
      }}
    >{label}</button>
  );
}

function InputRow({
  label, labelWidth = 110, children, style,
}: {
  label: string; labelWidth?: number; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', ...style }}>
      <label style={{
        minWidth: labelWidth, fontSize: '11px', fontWeight: 700, color: '#4b5563',
        textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0, textAlign: 'right',
      }}>{label}</label>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>{children}</div>
    </div>
  );
}

function SectionBox({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', overflow: 'hidden', ...style }}>
      <div style={{
        background: 'linear-gradient(90deg,#e8edf5 0%,#f1f4f9 100%)',
        color: '#374151', padding: '5px 10px', fontWeight: 700, fontSize: '11px',
        letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0',
      }}>{title}</div>
      <div style={{ padding: '10px' }}>{children}</div>
    </div>
  );
}

function FundDropdown({ value, displayValue, onSelect }: {
  value: string; displayValue: string; onSelect: (code: string, name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          padding: '5px 9px', border: '1px solid rgba(0,0,0,0.10)', borderRadius: '4px',
          backgroundColor: '#ffffff', cursor: 'pointer',
          color: displayValue ? '#1f2937' : '#9ca3af', minHeight: '30px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '12px', userSelect: 'none',
        }}
      >
        <span>{displayValue || 'Select fund'}</span>
        <span style={{ fontSize: '10px', color: '#9ca3af' }}>▼</span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '2px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 10000,
          maxHeight: '200px', overflowY: 'auto', minWidth: '320px',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151', width: '30%' }}>Code</th>
                <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#374151' }}>Name</th>
              </tr>
            </thead>
            <tbody>
              {fundData.map((fund, i) => (
                <tr key={i}
                  onClick={() => { onSelect(fund.code, fund.name); setOpen(false); }}
                  style={{ cursor: 'pointer', backgroundColor: value === fund.code ? '#eff6ff' : '#ffffff' }}
                  onMouseEnter={e => { if (value !== fund.code) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={e => { if (value !== fund.code) e.currentTarget.style.backgroundColor = '#ffffff'; }}
                >
                  <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '12px', color: '#1e3a8a', fontWeight: 600 }}>{fund.code}</td>
                  <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '12px', color: '#1f2937' }}>{fund.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CreationButtonPalette({ onNew, onClear }: { onNew?: () => void; onClear?: () => void }) {
  return (
    <div style={{
      display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap',
      padding: '10px 14px',
      background: 'linear-gradient(90deg,#f1f4f9 0%,#e8edf5 100%)',
      borderRadius: '8px', border: '1px solid rgba(0,0,0,0.07)', flexShrink: 0,
    }}>
      <button className="setup-btn setup-btn-new" onClick={onNew}><span className="setup-btn-icon">＋</span>New</button>
      <button className="setup-btn setup-btn-save"><span className="setup-btn-icon">💾</span>Save</button>
      <button className="setup-btn setup-btn-delete"><span className="setup-btn-icon">🗑️</span>Delete</button>
      <button className="setup-btn setup-btn-print"><span className="setup-btn-icon">🖨️</span>Print</button>
      <button className="setup-btn setup-btn-clear" onClick={onClear}><span className="setup-btn-icon">✕</span>Clear</button>
      <button className="setup-btn" style={{ background: '#0369a1', boxShadow: '0 2px 8px rgba(3,105,161,0.22)' }}>
        <span className="setup-btn-icon">📤</span>UHT xn Data Upload
      </button>
    </div>
  );
}

// ========================================
// UNIT CREATION MODAL
// ========================================
function UnitCreationModal({ onClose }: { onClose: () => void }) {
  type UCTab = 'Cheque Details' | 'Credit Card' | 'Bank Transfer / Draft' | 'Unit Fee Discounting' | 'Agent Details';
  const [activeTab, setActiveTab] = useState<UCTab>('Agent Details');
  const [creationDate, setCreationDate] = useState<Date | null>(new Date());
  const [priceDate, setPriceDate] = useState<Date | null>(new Date('2007-10-19'));
  const [fundDate, setFundDate] = useState<Date | null>(new Date());
  const [chequeDate, setChequeDate] = useState<Date | null>(null);
  const [btDate, setBtDate] = useState<Date | null>(null);
  const [form, setForm] = useState({
    accNo: '', unitHolderNo: '', creationNo: '',
    fundCode: '', fundName: '',
    creationCode: '', invType: '',
    noOfUnits: '', paid: '', remark: '',
    collAcc: '', promotionalActivity: '',
    prevDayUnitPrice: '',
    unitFeeYes: true,
    payCash: true, payCheque: false, payBankTransfer: false, payCreditCard: false,
    chequeNo: '', chequeBankCode: '', chequeBankBranch: '', chequeAmount: '',
    ccNo: '', ccExpiry: '', ccHolder: '', ccAmount: '',
    btRefNo: '', btBankCode: '', btBranch: '', btAmount: '',
    ufdFeeCode: '', ufdPercentage: '', ufdAmount: '',
    agency: '', subAgency: '', agent: '',
  });

  const set = (field: string, value: string | boolean) => setForm(p => ({ ...p, [field]: value }));

  const clearForm = () => {
    setCreationDate(null); setPriceDate(null); setFundDate(null);
    setChequeDate(null); setBtDate(null);
    setForm({
      accNo: '', unitHolderNo: '', creationNo: '', fundCode: '', fundName: '',
      creationCode: '', invType: '', noOfUnits: '', paid: '', remark: '',
      collAcc: '', promotionalActivity: '', prevDayUnitPrice: '',
      unitFeeYes: true, payCash: true, payCheque: false, payBankTransfer: false, payCreditCard: false,
      chequeNo: '', chequeBankCode: '', chequeBankBranch: '', chequeAmount: '',
      ccNo: '', ccExpiry: '', ccHolder: '', ccAmount: '',
      btRefNo: '', btBankCode: '', btBranch: '', btAmount: '',
      ufdFeeCode: '', ufdPercentage: '', ufdAmount: '',
      agency: '', subAgency: '', agent: '',
    });
  };

  const tabs: UCTab[] = ['Cheque Details', 'Credit Card', 'Bank Transfer / Draft', 'Unit Fee Discounting', 'Agent Details'];

  const radioCircle = (active: boolean, color = '#1e3a8a'): React.CSSProperties => ({
    width: '14px', height: '14px', borderRadius: '50%',
    border: `2px solid ${color}`,
    background: active ? color : '#fff',
    display: 'inline-block', flexShrink: 0,
    boxShadow: active ? 'inset 0 0 0 2px #fff' : 'none',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '8px' }}>

      {/* Section 1: Transaction Identity */}
      <SectionBox title="Transaction Identity">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 20px' }}>
          {/* Col 1 */}
          <div>
            <InputRow label="Acc No" labelWidth={108}>
              <input className="setup-input-field" value={form.accNo} onChange={e => set('accNo', e.target.value)} style={{ flex: 1 }} />
              <BadgeBtn label="A" />
            </InputRow>
            <InputRow label="Unit Holder No" labelWidth={108}>
              <input className="setup-input-field" value={form.unitHolderNo} onChange={e => set('unitHolderNo', e.target.value)} style={{ flex: 1 }} />
              <BadgeBtn label="H" />
            </InputRow>
            <InputRow label="Creation No" labelWidth={108}>
              <input className="setup-input-field" value={form.creationNo} onChange={e => set('creationNo', e.target.value)} style={{ flex: 1 }} />
              <BadgeBtn label="E" />
              <button type="button" style={{ background: '#0d7f5a', color: '#fff', border: 'none', borderRadius: '3px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>AKCT NO</button>
            </InputRow>
          </div>
          {/* Col 2 */}
          <div>
            <InputRow label="Fund" labelWidth={95}>
              <FundDropdown value={form.fundCode} displayValue={form.fundName} onSelect={(c, n) => setForm(p => ({ ...p, fundCode: c, fundName: n }))} />
            </InputRow>
            <InputRow label="Creation Code" labelWidth={95}>
              <select className="setup-select-field" value={form.creationCode} onChange={e => set('creationCode', e.target.value)} style={{ flex: 1 }}>
                <option value="">Select</option>
                <option value="CC001">CC001 – Standard</option>
                <option value="CC002">CC002 – IPO</option>
                <option value="CC003">CC003 – Reinvestment</option>
              </select>
            </InputRow>
            <InputRow label="Inv Type" labelWidth={95}>
              <select className="setup-select-field" value={form.invType} onChange={e => set('invType', e.target.value)} style={{ flex: 1 }}>
                <option value="">Select</option>
                <option value="lump">Lump Sum</option>
                <option value="regular">Regular</option>
                <option value="ipo">IPO</option>
              </select>
            </InputRow>
          </div>
          {/* Col 3 */}
          <div>
            <InputRow label="Crea. Date" labelWidth={90}>
              <DatePicker selected={creationDate} onChange={d => setCreationDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" />
            </InputRow>
            <InputRow label="Price Date" labelWidth={90}>
              <DatePicker selected={priceDate} onChange={d => setPriceDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" />
            </InputRow>
            <InputRow label="Fund Date" labelWidth={90}>
              <DatePicker selected={fundDate} onChange={d => setFundDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" />
            </InputRow>
          </div>
        </div>
      </SectionBox>

      {/* Section 2: Transaction Details */}
      <SectionBox title="Transaction Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 20px', alignItems: 'start' }}>
          {/* Col 1 */}
          <div>
            <InputRow label="No of Units" labelWidth={108}>
              <input type="number" className="setup-input-field" value={form.noOfUnits} onChange={e => set('noOfUnits', e.target.value)} style={{ flex: 1 }} />
            </InputRow>
            <InputRow label="Paid" labelWidth={108}>
              <input type="number" className="setup-input-field" value={form.paid} onChange={e => set('paid', e.target.value)} style={{ flex: 1 }} />
            </InputRow>
            <InputRow label="Remark" labelWidth={108}>
              <input className="setup-input-field" value={form.remark} onChange={e => set('remark', e.target.value)} style={{ flex: 1 }} />
            </InputRow>
          </div>
          {/* Col 2 */}
          <div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
                Previous Day Unit Price — Creation
              </label>
              <input className="setup-input-field" value={form.prevDayUnitPrice} onChange={e => set('prevDayUnitPrice', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Unit Fee</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: form.unitFeeYes ? 700 : 400 }} onClick={() => set('unitFeeYes', true)}>
                  <span style={radioCircle(form.unitFeeYes)} /> Yes
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: !form.unitFeeYes ? 700 : 400 }} onClick={() => set('unitFeeYes', false)}>
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
                { key: 'payCash',         label: 'Cash',                 color: '#1e3a8a' },
                { key: 'payBankTransfer', label: 'Bank Transfer / Draft', color: '#7c3aed' },
                { key: 'payCheque',       label: 'Cheque',               color: '#b45309' },
                { key: 'payCreditCard',   label: 'Credit Card',          color: '#b91c1c' },
              ] as const).map(({ key, label, color }) => (
                <label key={key}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '12px' }}
                  onClick={() => setForm(p => ({ ...p, payCash: key === 'payCash', payCheque: key === 'payCheque', payBankTransfer: key === 'payBankTransfer', payCreditCard: key === 'payCreditCard' }))}
                >
                  <span style={radioCircle(form[key], color)} />
                  <span style={{ color, fontWeight: form[key] ? 700 : 500 }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* Coll. Acc + Promotional Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px', marginTop: '4px' }}>
          <InputRow label="Coll. Acc" labelWidth={108}>
            <select className="setup-select-field" value={form.collAcc} onChange={e => set('collAcc', e.target.value)} style={{ flex: 1 }}>
              <option value="">Select</option>
              <option value="CA001">CA001</option>
              <option value="CA002">CA002</option>
            </select>
          </InputRow>
          <InputRow label="Promotional Activity" labelWidth={148}>
            <select className="setup-select-field" value={form.promotionalActivity} onChange={e => set('promotionalActivity', e.target.value)} style={{ flex: 1 }}>
              <option value="">Select</option>
              <option value="PA001">Summer Sale – 20%</option>
              <option value="PA002">Holiday Special – 15%</option>
            </select>
          </InputRow>
        </div>
      </SectionBox>

      {/* Common Button Palette */}
      <CreationButtonPalette onNew={onClose} onClear={clearForm} />

      {/* Tabbed Bottom Section */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', flexShrink: 0, background: '#f8fafc', padding: '0 8px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
              padding: '7px 12px', background: activeTab === tab ? '#ffffff' : 'transparent',
              color: activeTab === tab ? '#1e3a8a' : '#6b7280', border: 'none',
              borderBottom: activeTab === tab ? '2px solid #1e3a8a' : '2px solid transparent',
              marginBottom: '-2px', cursor: 'pointer',
              fontWeight: activeTab === tab ? 700 : 600, fontSize: '11px',
              fontFamily: 'Lato, system-ui, sans-serif', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{tab}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>

          {activeTab === 'Agent Details' && (
            <div style={{ maxWidth: '460px' }}>
              <div style={{ display: 'inline-block', padding: '3px 10px', background: 'linear-gradient(90deg,#e8edf5,#f1f4f9)', color: '#1e3a8a', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '4px', marginBottom: '10px' }}>Agents</div>
              <InputRow label="Agency" labelWidth={90}>
                <select className="setup-select-field" value={form.agency} onChange={e => set('agency', e.target.value)} style={{ flex: 1 }}>
                  <option value="">Select</option>
                  <option value="AG001">AG001 – Main Street Agency</option>
                  <option value="AG002">AG002 – Central Agency</option>
                </select>
              </InputRow>
              <InputRow label="Sub Agency" labelWidth={90}>
                <select className="setup-select-field" value={form.subAgency} onChange={e => set('subAgency', e.target.value)} style={{ flex: 1 }}>
                  <option value="">Select</option>
                  <option value="SA001">SA001 – Downtown Branch</option>
                  <option value="SA002">SA002 – Uptown Branch</option>
                </select>
              </InputRow>
              <InputRow label="Agent" labelWidth={90}>
                <select className="setup-select-field" value={form.agent} onChange={e => set('agent', e.target.value)} style={{ flex: 1 }}>
                  <option value="">Select</option>
                  <option value="AGT001">AGT001 – John Smith</option>
                  <option value="AGT002">AGT002 – Sarah Johnson</option>
                </select>
              </InputRow>
            </div>
          )}

          {activeTab === 'Cheque Details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', maxWidth: '620px' }}>
              <InputRow label="Cheque No" labelWidth={105}><input className="setup-input-field" value={form.chequeNo} onChange={e => set('chequeNo', e.target.value)} style={{ flex: 1 }} /></InputRow>
              <InputRow label="Cheque Date" labelWidth={105}><DatePicker selected={chequeDate} onChange={d => setChequeDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" /></InputRow>
              <InputRow label="Bank Code" labelWidth={105}>
                <select className="setup-select-field" value={form.chequeBankCode} onChange={e => set('chequeBankCode', e.target.value)} style={{ flex: 1 }}>
                  <option value="">Select Bank</option>
                  <option value="B001">B001 – HSBC</option>
                  <option value="B002">B002 – Lloyds</option>
                </select>
              </InputRow>
              <InputRow label="Branch" labelWidth={105}><input className="setup-input-field" value={form.chequeBankBranch} onChange={e => set('chequeBankBranch', e.target.value)} style={{ flex: 1 }} /></InputRow>
              <InputRow label="Amount" labelWidth={105}><input type="number" className="setup-input-field" value={form.chequeAmount} onChange={e => set('chequeAmount', e.target.value)} style={{ flex: 1 }} /></InputRow>
            </div>
          )}

          {activeTab === 'Credit Card' && (
            <div style={{ maxWidth: '440px' }}>
              <InputRow label="Card No" labelWidth={105}><input className="setup-input-field" value={form.ccNo} onChange={e => set('ccNo', e.target.value)} style={{ flex: 1 }} placeholder="XXXX XXXX XXXX XXXX" /></InputRow>
              <InputRow label="Expiry" labelWidth={105}><input className="setup-input-field" value={form.ccExpiry} onChange={e => set('ccExpiry', e.target.value)} style={{ flex: 1 }} placeholder="MM/YY" /></InputRow>
              <InputRow label="Card Holder" labelWidth={105}><input className="setup-input-field" value={form.ccHolder} onChange={e => set('ccHolder', e.target.value)} style={{ flex: 1 }} /></InputRow>
              <InputRow label="Amount" labelWidth={105}><input type="number" className="setup-input-field" value={form.ccAmount} onChange={e => set('ccAmount', e.target.value)} style={{ flex: 1 }} /></InputRow>
            </div>
          )}

          {activeTab === 'Bank Transfer / Draft' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', maxWidth: '620px' }}>
              <InputRow label="Ref No" labelWidth={100}><input className="setup-input-field" value={form.btRefNo} onChange={e => set('btRefNo', e.target.value)} style={{ flex: 1 }} /></InputRow>
              <InputRow label="Transfer Date" labelWidth={100}><DatePicker selected={btDate} onChange={d => setBtDate(d)} dateFormat="dd/MMM/yyyy" className="date-picker-input" showYearDropdown showMonthDropdown dropdownMode="select" /></InputRow>
              <InputRow label="Bank Code" labelWidth={100}>
                <select className="setup-select-field" value={form.btBankCode} onChange={e => set('btBankCode', e.target.value)} style={{ flex: 1 }}>
                  <option value="">Select Bank</option>
                  <option value="B001">B001 – HSBC</option>
                  <option value="B002">B002 – Lloyds</option>
                </select>
              </InputRow>
              <InputRow label="Branch" labelWidth={100}><input className="setup-input-field" value={form.btBranch} onChange={e => set('btBranch', e.target.value)} style={{ flex: 1 }} /></InputRow>
              <InputRow label="Amount" labelWidth={100}><input type="number" className="setup-input-field" value={form.btAmount} onChange={e => set('btAmount', e.target.value)} style={{ flex: 1 }} /></InputRow>
            </div>
          )}

          {activeTab === 'Unit Fee Discounting' && (
            <div style={{ maxWidth: '440px' }}>
              <InputRow label="Fee Code" labelWidth={105}>
                <select className="setup-select-field" value={form.ufdFeeCode} onChange={e => set('ufdFeeCode', e.target.value)} style={{ flex: 1 }}>
                  <option value="">Select</option>
                  <option value="UFC001">UFC001 – Entry Fee</option>
                  <option value="UFC002">UFC002 – Exit Fee</option>
                </select>
              </InputRow>
              <InputRow label="Percentage" labelWidth={105}><input type="number" step="0.01" className="setup-input-field" value={form.ufdPercentage} onChange={e => set('ufdPercentage', e.target.value)} style={{ flex: 1 }} /></InputRow>
              <InputRow label="Amount" labelWidth={105}><input type="number" className="setup-input-field" value={form.ufdAmount} onChange={e => set('ufdAmount', e.target.value)} style={{ flex: 1 }} /></InputRow>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================
// MAIN UNIT OPERATIONS COMPONENT
// ========================================

function UnitOperations() {
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ── Unit Fees state (original) ──
  const [activeTab, setActiveTab] = useState<'Unit Price' | 'Creation Charges' | 'Redemption Charges'>('Unit Price');
  const [showFundTable, setShowFundTable] = useState(false);
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
    setCreationChargesTable(prev => [...prev].sort((a, b) => { if (a[key] < b[key]) return direction === 'asc' ? -1 : 1; if (a[key] > b[key]) return direction === 'asc' ? 1 : -1; return 0; }));
  };

  const handleRedemptionSort = (key: keyof ChargeRow) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (redemptionSortConfig?.key === key && redemptionSortConfig.direction === 'asc') direction = 'desc';
    setRedemptionSortConfig({ key, direction });
    setRedemptionChargesTable(prev => [...prev].sort((a, b) => { if (a[key] < b[key]) return direction === 'asc' ? -1 : 1; if (a[key] > b[key]) return direction === 'asc' ? 1 : -1; return 0; }));
  };

  // ── ORIGINAL Unit Fees render (pixel-perfect preserved) ──
  const renderUnitFeesModal = () => (
    <>
      <div className="setup-input-section" style={{ marginTop: '0' }}>
        <div className="setup-ash-box" style={{ padding: '8px', width: '100%' }}>
          {/* Tab headers */}
          <div role="tablist" aria-label="Unit Fees Tabs" style={{ display: 'flex', flexWrap: 'nowrap', gap: '6px', marginBottom: '6px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {(['Unit Price', 'Creation Charges', 'Redemption Charges'] as const).map(tab => (
              <div key={tab} role="tab" aria-selected={activeTab === tab} tabIndex={0}
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
                {/* Fund + Price Date */}
                <div className="setup-ash-box" style={{ padding: '8px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '50%', flex: '1 1 50%' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px', fontSize: '12px' }}>Fund</label>
                      <div style={{ position: 'relative', flex: 1 }} data-table="fund">
                        <div onClick={() => setShowFundTable(!showFundTable)}
                          style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: 'pointer', color: unitFeesFormData.fundName ? '#0f172a' : '#64748b', minHeight: '30px', display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                          {unitFeesFormData.fundName || 'Select fund'}
                        </div>
                        {showFundTable && (
                          <div data-table="fund" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                  <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Code</th>
                                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#000000' }}>Name</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fundData.map((fund, i) => (
                                  <tr key={i}
                                    onClick={() => { setUnitFeesFormData(prev => ({ ...prev, fund: fund.code, fundCode: fund.code, fundName: fund.name })); setShowFundTable(false); }}
                                    style={{ cursor: 'pointer', backgroundColor: unitFeesFormData.fundCode === fund.code ? '#f3e8ff' : '#ffffff' }}
                                    onMouseEnter={e => { if (unitFeesFormData.fundCode !== fund.code) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                    onMouseLeave={e => { if (unitFeesFormData.fundCode !== fund.code) e.currentTarget.style.backgroundColor = '#ffffff'; }}
                                  >
                                    <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{fund.code}</td>
                                    <td style={{ padding: '8px 12px', color: '#000000' }}>{fund.name}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '50%', flex: '1 1 50%' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px', fontSize: '12px' }}>Price Date</label>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <DatePicker selected={priceDate} onChange={(date: Date | null) => setPriceDate(date)} dateFormat="dd/MMM/yyyy" className="date-picker-input" placeholderText="Select date" showYearDropdown showMonthDropdown dropdownMode="select" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button Palette */}
                <div className="setup-action-buttons" style={{ marginBottom: '6px', marginTop: '4px', gap: '6px' }}>
                  <button className="setup-btn setup-btn-new" onClick={handleModalClose}><span className="setup-btn-icon">+</span>New</button>
                  <button className="setup-btn setup-btn-save"><span className="setup-btn-icon">💾</span>Save</button>
                  <button className="setup-btn setup-btn-delete"><span className="setup-btn-icon">🗑️</span>Delete</button>
                  <button className="setup-btn setup-btn-print"><span className="setup-btn-icon">🖨️</span>Print</button>
                  <button className="setup-btn setup-btn-clear" onClick={() => {
                    setPriceDate(null);
                    setUnitFeesFormData({ fund: '', fundCode: '', fundName: '', beforeBrokerageNAV: '', beforeBrokerageNAVAmount: '0.00', afterBrokerageNAV: '', afterBrokerageNAVAmount: '0.00', whtRate: '0.00', creationPriceWithoutFee: '0.000000', creationPriceWithFee: '0.000000', redeemPriceWithoutFee: '0.000000', redeemPriceWithFee: '0.000000', fundDetails: '', creationCharges: '', redemptionCharges: '', totalUnits: '', totalHolders: '' });
                  }}><span className="setup-btn-icon">🗑️</span>Clear</button>
                </div>

                {/* Before / After Brokerage */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '8px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', width: '100%' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '8px', fontWeight: 600, fontSize: '11px' }}>Before Brokerage</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '8px' }}>
                      <div className="setup-input-group">
                        <label className="setup-input-label" style={{ fontSize: '11px' }}>NAV</label>
                        <input type="number" className="setup-input-field" value={unitFeesFormData.beforeBrokerageNAV} onChange={e => handleInputChange('beforeBrokerageNAV', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                      </div>
                      <div className="setup-input-group">
                        <label className="setup-input-label" style={{ fontSize: '11px' }}>NAV Amount</label>
                        <input type="number" step="0.01" className="setup-input-field" value={unitFeesFormData.beforeBrokerageNAVAmount} onChange={e => handleInputChange('beforeBrokerageNAVAmount', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', width: '100%' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '8px', fontWeight: 600, fontSize: '11px' }}>After Brokerage</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '8px' }}>
                      <div className="setup-input-group">
                        <label className="setup-input-label" style={{ fontSize: '11px' }}>NAV</label>
                        <input type="number" className="setup-input-field" value={unitFeesFormData.afterBrokerageNAV} onChange={e => handleInputChange('afterBrokerageNAV', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                      </div>
                      <div className="setup-input-group">
                        <label className="setup-input-label" style={{ fontSize: '11px' }}>NAV Amount</label>
                        <input type="number" step="0.01" className="setup-input-field" value={unitFeesFormData.afterBrokerageNAVAmount} onChange={e => handleInputChange('afterBrokerageNAVAmount', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* WHT + Creation + Redeem + Fund Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', width: '100%' }}>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px', fontWeight: 'bold', fontSize: '11px' }}>WHT Rate per Unit</div>
                    <div className="setup-input-group">
                      <label className="setup-input-label" style={{ fontSize: '11px' }}>WHT</label>
                      <input type="number" step="0.01" className="setup-input-field" value={unitFeesFormData.whtRate} onChange={e => handleInputChange('whtRate', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px', fontWeight: 'bold', fontSize: '11px' }}>Creation Price</div>
                    <div className="setup-input-group" style={{ marginBottom: '6px' }}>
                      <label className="setup-input-label" style={{ fontSize: '11px' }}>Without Front End Fee</label>
                      <input type="number" step="0.000001" className="setup-input-field" value={unitFeesFormData.creationPriceWithoutFee} onChange={e => handleInputChange('creationPriceWithoutFee', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                    </div>
                    <div className="setup-input-group">
                      <label className="setup-input-label" style={{ fontSize: '11px' }}>With Front End Fee</label>
                      <input type="number" step="0.000001" className="setup-input-field" value={unitFeesFormData.creationPriceWithFee} onChange={e => handleInputChange('creationPriceWithFee', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px', fontWeight: 'bold', fontSize: '11px' }}>Redeem Price</div>
                    <div className="setup-input-group" style={{ marginBottom: '6px' }}>
                      <label className="setup-input-label" style={{ fontSize: '11px' }}>Without Exit Fee</label>
                      <input type="number" step="0.000001" className="setup-input-field" value={unitFeesFormData.redeemPriceWithoutFee} onChange={e => handleInputChange('redeemPriceWithoutFee', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                    </div>
                    <div className="setup-input-group">
                      <label className="setup-input-label" style={{ fontSize: '11px' }}>With Exit Fee</label>
                      <input type="number" step="0.000001" className="setup-input-field" value={unitFeesFormData.redeemPriceWithFee} onChange={e => handleInputChange('redeemPriceWithFee', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', gridColumn: '4 / 5', height: '100%' }}>
                    <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px', fontWeight: 'bold', fontSize: '11px' }}>Fund Details</div>
                    <div className="setup-input-group" style={{ marginBottom: '6px' }}>
                      <label className="setup-input-label" style={{ fontSize: '11px' }}>Total No of Units</label>
                      <input type="number" className="setup-input-field" value={unitFeesFormData.totalUnits} onChange={e => handleInputChange('totalUnits', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                    </div>
                    <div className="setup-input-group">
                      <label className="setup-input-label" style={{ fontSize: '11px' }}>Total No of Holders</label>
                      <input type="number" className="setup-input-field" value={unitFeesFormData.totalHolders} onChange={e => handleInputChange('totalHolders', e.target.value)} style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Creation Charges' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#000000' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      {(['feeCode', 'description', 'percentage', 'amount'] as const).map(col => (
                        <th key={col} onClick={() => handleSort(col)} style={{ padding: '8px', border: '1px solid #e5e7eb', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}>
                          {col === 'feeCode' && 'Fee Code'}{col === 'description' && 'Description'}{col === 'percentage' && 'Percentage (%)'}{col === 'amount' && 'Amount'}
                          {sortConfig?.key === col && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {creationChargesTable.map((row, index) => (
                      <tr key={index}>
                        <td style={cellStyle}>{row.feeCode}</td>
                        <td style={cellStyle}>{row.description}</td>
                        <td style={cellStyle}>{row.percentage}</td>
                        <td style={cellStyle}>{row.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Redemption Charges' && (
              <div style={{ overflowX: 'auto', color: '#000000' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      {(['feeCode', 'description', 'percentage', 'amount'] as const).map(col => (
                        <th key={col} onClick={() => handleRedemptionSort(col)} style={{ padding: '8px', border: '1px solid #e5e7eb', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}>
                          {col === 'feeCode' && 'Fee Code'}{col === 'description' && 'Description'}{col === 'percentage' && 'Percentage (%)'}{col === 'amount' && 'Amount'}
                          {redemptionSortConfig?.key === col && (redemptionSortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {redemptionChargesTable.map((row, index) => (
                      <tr key={index}>
                        <td style={cellStyle}>{row.feeCode}</td>
                        <td style={cellStyle}>{row.description}</td>
                        <td style={cellStyle}>{row.percentage}</td>
                        <td style={cellStyle}>{row.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Button Palette for Creation/Redemption Charges tabs */}
          {activeTab !== 'Unit Price' && (
            <div className="setup-action-buttons" style={{ marginTop: '6px', gap: '6px' }}>
              <button className="setup-btn setup-btn-new" onClick={handleModalClose}><span className="setup-btn-icon">+</span>New</button>
              <button className="setup-btn setup-btn-save"><span className="setup-btn-icon">💾</span>Save</button>
              <button className="setup-btn setup-btn-delete"><span className="setup-btn-icon">🗑️</span>Delete</button>
              <button className="setup-btn setup-btn-print"><span className="setup-btn-icon">🖨️</span>Print</button>
              <button className="setup-btn setup-btn-clear" onClick={() => {
                setPriceDate(null);
                setUnitFeesFormData({ fund: '', fundCode: '', fundName: '', beforeBrokerageNAV: '', beforeBrokerageNAVAmount: '0.00', afterBrokerageNAV: '', afterBrokerageNAVAmount: '0.00', whtRate: '0.00', creationPriceWithoutFee: '0.000000', creationPriceWithFee: '0.000000', redeemPriceWithoutFee: '0.000000', redeemPriceWithFee: '0.000000', fundDetails: '', creationCharges: '', redemptionCharges: '', totalHolders: '', totalUnits: '' });
              }}><span className="setup-btn-icon">🗑️</span>Clear</button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // ========================================
  // RENDER
  // ========================================
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

                  {/* Header */}
                  <div className="setup-modal-header">
                    <div className="setup-modal-header-content">
                      <span className="setup-modal-header-icon">{modules[modalIdx].icon}</span>
                      <span className="setup-modal-header-title">{modules[modalIdx].title}</span>
                    </div>
                    <button onClick={handleModalClose} className="setup-modal-close-btn" aria-label="Close modal">×</button>
                  </div>

                  {/* Content */}
                  <div className="setup-modal-content" style={{ overflow: 'auto', padding: '8px' }}>
                    {modalIdx === 0 && modules[modalIdx].title === 'Unit Fees'
                      ? renderUnitFeesModal()
                      : modalIdx === 1 && modules[modalIdx].title === 'Unit Creation'
                      ? <UnitCreationModal onClose={handleModalClose} />
                      : (
                        <div className="empty-content">
                          <p>Content for <strong>{modules[modalIdx].title}</strong> will be implemented here.</p>
                          <p>This is a placeholder modal.</p>
                        </div>
                      )
                    }
                  </div>

                  {/* Footer for placeholder modals only */}
                  {!(modalIdx === 0 && modules[modalIdx].title === 'Unit Fees') &&
                   !(modalIdx === 1 && modules[modalIdx].title === 'Unit Creation') && (
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