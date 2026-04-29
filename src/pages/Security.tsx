import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect, forwardRef, useRef } from 'react';
import { createPortal } from 'react-dom';

interface UserRole {
  code: string;
  name: string;
  enabledRows: number[];
  rowPermissions: Record<number, string[]>;
  createdBy?: string;
}
import UserSearchModal from '../components/UserSearchModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BackupModalContent from '../components/BackupModalContent';
import DayEndModalContent from '../components/DayEndModalContent';

const moduleData = [
  { title: 'Create User', icon: '👤' },
  { title: 'Password Changer', icon: '🛡️' },
  { title: 'Assign User Role', icon: '🔑' },
  { title: 'Back Up', icon: '💽' },
  { title: 'Day End', icon: '🔄' },
  { title: 'Mobile Excel File Upload', icon: '📊' },
];

const modules = moduleData.map(m => ({ title: m.title, icon: m.icon }));

const SETUP_SUB_MENU_ITEMS = [
  'Bank', 'Transaction Type', 'System calendar', 'Trustees', 'Custodian',
  'Postal Area', 'Dividend Type', 'Funds', 'Company', 'Promotional Activity',
  'Unit Fee Codes', 'Agency Type', 'Agency', 'Sub Agency', 'Agents',
  'Territory', 'Commission Type', 'Commission Level', 'Agent Commission Definition',
  'Assign Agent to Commission Definition', 'Institution Category', 'Documents Setup',
  'Institution', 'Blocking Category', 'Customer Zone', 'Join Sale Agent',
  'Compliance MSG Setup', 'Product Type', 'Title', 'Source of Income',
  'Annual Income', 'Risk Category', 'Politically Exposed'
];

const REGISTRATION_SUB_MENU_ITEMS = [
  'Application Entry', 'Registration Unit Holders Profiles',
  'Unit Holder Accounts', 'Holder Document Handling'
];

const UNIT_OPERATION_SUB_MENU_ITEMS = [
  'Unit Fees', 'Unit Creation', 'Unit Redemption', 'Unit Transfer/Switching',
  'Unit Consolidation', 'Cheque Re Printing', 'Web Data Downloading',
  'Standing Instruction', 'Standing Instruction Processing', 'Bank Slip Transfer',
  'Reminders', 'Unit Transfer-Suspense Account', 'Change Agent for Transaction',
  'Acknowledgement Printing', 'Fund Price E-Statement', 'Upload and Download Data Web-Automated',
  'WHT Per Unit Entry', 'Data Upload', 'Transaction Upload'
];

const APPROVAL_SUB_MENU_ITEMS = [
  'Application Conformation', 'Application Approval', 'Account Confirmation',
  'Account Approval', 'Unit Fee Confirmation', 'Unit Price Approval',
  'Transaction Conformation', 'Transaction Approval', 'Certificate Approval',
  'Holder Registration Approval', 'Cheque Clear', 'Dividend Confirmation',
  'Standing Instruction Approval', 'Dividend Approval'
];

const DOC_PRINTING_SUB_MENU_ITEMS = [
  'Certificate Print', 'Inquiry on Unit Holders', 'Audit Inquiry',
  'WHT Certificate Printing'
];

const REPORTS_SUB_MENU_ITEMS = [
  'MIS', 'Dividend Reports', 'Other Reports'
];

const SECURITY_SUB_MENU_ITEMS = [
  'Create User', 'Password Changer', 'Assign User Role'
];

const getSubMenuItems = (menu: string) => {
  if (menu === 'Registration') return REGISTRATION_SUB_MENU_ITEMS;
  if (menu === 'Unit Operation') return UNIT_OPERATION_SUB_MENU_ITEMS;
  if (menu === 'Approval') return APPROVAL_SUB_MENU_ITEMS;
  if (menu === 'Doc Printing') return DOC_PRINTING_SUB_MENU_ITEMS;
  if (menu === 'Security') return SECURITY_SUB_MENU_ITEMS;
  if (menu === 'Reports') return REPORTS_SUB_MENU_ITEMS;
  return SETUP_SUB_MENU_ITEMS;
};

function SubMenuRightsModal({
  isOpen,
  onClose,
  title,
  items,
  enabledRows = [],
  setEnabledRows,
  rowPermissions = {},
  setRowPermissions,
  onAddSubMenu
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  enabledRows: number[];
  setEnabledRows: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;
  rowPermissions: Record<number, string[]>;
  setRowPermissions: React.Dispatch<React.SetStateAction<Record<string, Record<number, string[]>>>>;
  onAddSubMenu?: (newSubMenu: string) => void;
}) {
  const [newSubMenuName, setNewSubMenuName] = useState('');

  if (!isOpen) return null;

  const handleAddSubMenu = () => {
    if (newSubMenuName.trim() && onAddSubMenu) {
      onAddSubMenu(newSubMenuName.trim());
      setNewSubMenuName('');
    }
  };

  const toggleRow = (idx: number) => {
    setEnabledRows(prev => {
      const currentRows = prev[title] || [];
      const isEnabling = !currentRows.includes(idx);
      setRowPermissions(inner => {
        const next = { ...inner };
        const currentPerms = { ...(next[title] || {}) };
        if (isEnabling) {
          currentPerms[idx] = ['approve', 'save', 'edit', 'delete', 'print'];
        } else {
          delete currentPerms[idx];
        }
        next[title] = currentPerms;
        return next;
      });
      return {
        ...prev,
        [title]: isEnabling ? [...currentRows, idx] : currentRows.filter(i => i !== idx)
      };
    });
  };

  const toggleAllRows = () => {
    const currentRows = enabledRows || [];
    if (currentRows.length === items.length) {
      setEnabledRows(prev => ({ ...prev, [title]: [] }));
      setRowPermissions(prev => ({ ...prev, [title]: {} }));
    } else {
      setEnabledRows(prev => ({ ...prev, [title]: items.map((_, i) => i) }));
      setRowPermissions(prev => ({
        ...prev,
        [title]: items.reduce((acc, _, i) => {
          acc[i] = ['approve', 'save', 'edit', 'delete', 'print'];
          return acc;
        }, {} as Record<number, string[]>)
      }));
    }
  };

  const togglePermission = (rowIdx: number, perm: string) => {
    if (!enabledRows.includes(rowIdx)) return;
    setRowPermissions(prev => {
      const next = { ...prev };
      const currentPerms = { ...(next[title] || {}) };
      const current = currentPerms[rowIdx] || [];
      const updated = current.includes(perm)
        ? current.filter(p => p !== perm)
        : [...current, perm];
      currentPerms[rowIdx] = updated;
      next[title] = currentPerms;
      return next;
    });
  };

  const Toggle = ({ active, onClick }: { active?: boolean; onClick?: () => void }) => (
    <div
      onClick={onClick}
      style={{ width: '36px', height: '20px', borderRadius: '10px', background: active ? 'var(--accent, #1e3a8a)' : '#e2e8f0', position: 'relative', cursor: 'pointer', transition: 'all 0.2s', alignSelf: 'center', boxShadow: active ? 'inset 0 1px 3px rgba(0,0,0,0.2)' : 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
    >
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: active ? '18px' : '2px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '12px', width: '900px', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ background: 'var(--accent, #1e3a8a)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff' }}>{title} Sub-Menus</h3>
            <p style={{ fontSize: '11px', margin: 0, opacity: 0.8 }}>{enabledRows.length} of {items.length} sub-menus active</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }} onClick={toggleAllRows}>
              Select All <Toggle active={enabledRows.length === items.length && items.length > 0} onClick={toggleAllRows} />
            </div>
            <button title="Close" onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>&times;</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <div>SUB MENU</div>
          <div style={{ textAlign: 'center' }}>ENABLE</div>
          <div style={{ textAlign: 'center' }}>APPROVE</div>
          <div style={{ textAlign: 'center' }}>SAVE</div>
          <div style={{ textAlign: 'center' }}>EDIT</div>
          <div style={{ textAlign: 'center' }}>DELETE</div>
          <div style={{ textAlign: 'center' }}>PRINT</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {items.map((menu, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#475569', fontWeight: 500 }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{idx + 1}</span>
                {menu}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Toggle active={enabledRows.includes(idx)} onClick={() => toggleRow(idx)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={`rights-action-btn rights-btn-approve ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('approve') ? 'active' : ''}`} onClick={() => togglePermission(idx, 'approve')} disabled={!enabledRows.includes(idx)}>
                  {(rowPermissions[idx] || []).includes('approve') ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : 'Approve'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={`rights-action-btn rights-btn-save ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('save') ? 'active' : ''}`} onClick={() => togglePermission(idx, 'save')} disabled={!enabledRows.includes(idx)}>
                  {(rowPermissions[idx] || []).includes('save') ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : 'Save'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={`rights-action-btn rights-btn-edit ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('edit') ? 'active' : ''}`} onClick={() => togglePermission(idx, 'edit')} disabled={!enabledRows.includes(idx)}>
                  {(rowPermissions[idx] || []).includes('edit') ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : 'Edit'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={`rights-action-btn rights-btn-delete ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('delete') ? 'active' : ''}`} onClick={() => togglePermission(idx, 'delete')} disabled={!enabledRows.includes(idx)}>
                  {(rowPermissions[idx] || []).includes('delete') ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : 'Delete'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={`rights-action-btn rights-btn-print ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('print') ? 'active' : ''}`} onClick={() => togglePermission(idx, 'print')} disabled={!enabledRows.includes(idx)}>
                  {(rowPermissions[idx] || []).includes('print') ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : 'Print'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {onAddSubMenu && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="New Sub-Menu Title"
              value={newSubMenuName}
              onChange={e => setNewSubMenuName(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
            <button
              onClick={handleAddSubMenu}
              style={{ background: 'var(--accent, #1e3a8a)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              + Add Sub-Menu
            </button>
          </div>
        )}

        <div style={{ padding: '12px 20px', background: '#f8fafc', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', fontWeight: 'bold' }}>
          {items.length} of {items.length} sub-menus
        </div>
      </div>
    </div>
  );
}


const inputStyle: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', width: '100%', boxSizing: 'border-box', outline: 'none', color: '#334155', height: '42px', fontFamily: 'inherit', background: '#fff' };
const textareaStyle: React.CSSProperties = { padding: '12px 14px 12px 44px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', width: '100%', boxSizing: 'border-box', outline: 'none', color: '#334155', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit', background: '#fff' };

const secInputClass = "sec-input-override";

const Section = ({ title, icon, children }: any) => (
  <div style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <div style={{ background: 'var(--accent, #1e3a8a)', color: '#fff', padding: '12px 16px', borderRadius: '8px 8px 0 0', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      <span>{icon}</span> {title}
    </div>
    <div style={{ padding: '20px', border: '1px solid #f1f5f9', borderTop: 'none', borderRadius: '0 0 8px 8px', background: '#fff' }}>
      {children}
    </div>
  </div>
);

const IconWrapper = ({ children, top = '50%' }: any) => (
  <span style={{ position: 'absolute', left: '12px', top: top, transform: top === '50%' ? 'translateY(-50%)' : 'none', color: '#94a3b8', pointerEvents: 'none', zIndex: 1, display: 'flex', alignItems: 'center' }}>
    {children}
  </span>
);

// SVG icons — 16x16, predictable width, no emoji rendering issues
const IcoUser = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const IcoBadge = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const IcoBriefcase = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const IcoCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const IcoPhone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.14 18a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2 4.11 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
const IcoMail = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const IcoMapPin = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const IcoBuilding = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const IcoOffice = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>;
const IcoLock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const IcoDevice = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
const IcoStar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;

const CustomDateInput = forwardRef(({ value, onClick, placeholder }: any, ref: any) => (
  <input
    onClick={onClick}
    value={value}
    placeholder={placeholder}
    ref={ref}
    style={{ ...inputStyle, cursor: 'pointer', backgroundColor: '#fff' }}
    readOnly
    className={`setup-input-field ${secInputClass}`}
  />
));

const UserCreationModal = ({ isMobile }: { isMobile: boolean }) => {
  const [isActive, setIsActive] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Form States
  const [fullName, setFullName] = useState('');
  const [empNo, setEmpNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [employer, setEmployer] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpMethod, setOtpMethod] = useState('');
  const [userType, setUserType] = useState('');
  const [designation, setDesignation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUserSelect = (user: any) => {
    setFullName(user.fullName || '');
    setEmpNo(user.empNo || '');
    setMobile(user.mobile || '');
    setEmail(user.email || '');
    setAddress(user.address || '');
    setIsActive(user.isActive ?? true);
    setEmployer(user.employer || '');
    setDepartment(user.department || '');
    setOtpMethod(user.otpMethod || '');
    setUserType(user.userType || '');
    setDesignation(user.designation || '');
    setDateOfBirth(user.dateOfBirth ? new Date(user.dateOfBirth) : null);
    setStartDate(null);
    setEndDate(null);
    setIsUpdating(true);
  };

  const clearForm = () => {
    setFullName('');
    setEmpNo('');
    setMobile('');
    setEmail('');
    setAddress('');
    setIsActive(true);
    setEmployer('');
    setDepartment('');
    setOtpMethod('');
    setUserType('');
    setPassword('');
    setConfirmPassword('');
    setDesignation('');
    setDateOfBirth(null);
    setStartDate(null);
    setEndDate(null);
    setIsUpdating(false);
    setAvatarImage(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (mobile && !/^\d{10,12}$/.test(mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Mobile must be 10-12 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      showToast(`User "${fullName}" ${isUpdating ? 'updated' : 'created'} successfully!`, 'success');
      if (!isUpdating) clearForm();
    } else {
      showToast('Please fix the errors before saving.', 'error');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB', 'warn');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    if (!fullName) {
      showToast('Please select or load a user first.', 'warn');
      return;
    }
    setDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setDeleteConfirm(false);
    clearForm();
    showToast(`User "${fullName}" deleted successfully.`, 'success');
  };

  const handleSuspend = () => {
    if (!fullName) {
      showToast('Please select or load a user first.', 'warn');
      return;
    }
    if (!startDate || !endDate) {
      showToast('Please select both start and end dates for suspension.', 'warn');
      return;
    }
    setIsActive(false);
    showToast(`User "${fullName}" suspended until ${endDate.toLocaleDateString()}.`, 'success');
  };


  return (
    <div id="sec-user-modal" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', padding: isMobile ? '12px' : '24px', background: '#fdfbfa', minHeight: '600px', borderRadius: '8px', fontFamily: 'var(--font-body, system-ui, sans-serif)', flexWrap: 'wrap', position: 'relative' }}>
      <style>{`
        #sec-user-modal input[type="text"],
        #sec-user-modal input[type="password"],
        #sec-user-modal input[type="email"],
        #sec-user-modal input[type="tel"],
        #sec-user-modal select,
        #sec-user-modal textarea,
        #sec-user-modal .setup-input-field {
          padding-left: 44px !important;
          padding-right: 14px !important;
          height: 42px !important;
        }
        #sec-user-modal textarea {
          min-height: 80px !important;
          height: auto !important;
        }
        #sec-user-modal .react-datepicker-wrapper,
        #sec-user-modal .date-picker-wrapper {
          width: 100%;
          display: block;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          padding: '14px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
          color: '#fff', maxWidth: '320px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#f59e0b',
          display: 'flex', alignItems: 'center', gap: '10px',
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{ fontSize: '16px' }}>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️'}</span>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px 32px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Delete User</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#64748b' }}>Are you sure you want to delete <strong>"{fullName}"</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(false)} style={{ padding: '10px 24px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <UserSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={handleUserSelect}
      />

      {/* Left Panel */}
      <div style={{ flex: '1 1 280px', maxWidth: isMobile ? '100%' : '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--accent, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>IRFO User Management</h2>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>Create, update or remove system users</p>
          </div>
        </div>

        <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div
            onClick={triggerFileInput}
            style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eff6ff', border: '2px solid var(--accent, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
          >
            {avatarImage ? (
              <img src={avatarImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <span style={{ fontSize: '32px', color: 'var(--accent, #1e3a8a)', fontWeight: 'bold' }}>{fullName ? fullName.charAt(0) : '?'}</span>
                <button
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.85)', border: '1px solid #e2e8f0', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--accent, #1e3a8a)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 2 }}
                >
                  📷
                </button>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#1e293b' }}>{fullName || 'New User'}</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>{userType ? userType.replace('_', ' ').toUpperCase() : 'No role assigned'}</p>
          {isActive ? (
            <div style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 16px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
              Active
            </div>
          ) : (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '6px 16px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
              Inactive
            </div>
          )}
        </div>

        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={clearForm} style={{ background: 'linear-gradient(135deg, var(--accent, #1e3a8a) 0%, var(--accent-mid, #2563eb) 100%)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.2)' }}>+ Create User</button>
            <button onClick={() => setIsSearchModalOpen(true)} style={{ background: '#fff', color: 'var(--accent, #1e3a8a)', border: '1px solid var(--accent, #1e3a8a)', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>📝 Update User</button>
            <button onClick={handleDelete} style={{ background: '#fff', color: '#ef4444', border: '1px solid #fca5a5', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>🗑️ Delete User</button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <Section title="User Lookup" icon="👤">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ flex: 1, position: 'relative', width: '100%' }}>
              <IconWrapper><IcoUser /></IconWrapper>
              <input type="text" placeholder="User Name *" style={inputStyle} className={secInputClass} value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <button onClick={() => setIsSearchModalOpen(true)} style={{ background: 'var(--accent, #1e3a8a)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
              📥 Load
            </button>
          </div>
        </Section>

        <Section title="Personal Information" icon="👤">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper><IcoUser /></IconWrapper>
                <input type="text" placeholder="Full Name *" style={inputStyle} className={secInputClass} value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper><IcoBadge /></IconWrapper>
                <input type="text" placeholder="Employee No" style={inputStyle} className={secInputClass} value={empNo} onChange={e => setEmpNo(e.target.value)} />
              </div>
            </div>
            {/* Designation & DOB */}
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper><IcoBriefcase /></IconWrapper>
                <input type="text" placeholder="Designation" style={inputStyle} className={secInputClass} value={designation} onChange={e => setDesignation(e.target.value)} />
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper><IcoCalendar /></IconWrapper>
                <DatePicker
                  selected={dateOfBirth}
                  onChange={(date) => setDateOfBirth(date)}
                  placeholderText="Date of Birth"
                  customInput={<CustomDateInput />}
                  wrapperClassName="date-picker-wrapper"
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1 }}>
                <div style={{ position: 'relative' }}>
                  <IconWrapper><IcoPhone /></IconWrapper>
                  <input type="text" placeholder="Mobile Number" style={{ ...inputStyle, borderColor: errors.mobile ? '#ef4444' : '#e2e8f0' }} className={secInputClass} value={mobile} onChange={e => setMobile(e.target.value)} />
                </div>
                {errors.mobile && <p style={{ color: '#ef4444', fontSize: '10px', margin: '4px 0 0 14px' }}>{errors.mobile}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ position: 'relative' }}>
                  <IconWrapper><IcoMail /></IconWrapper>
                  <input type="text" placeholder="Email Address" style={{ ...inputStyle, borderColor: errors.email ? '#ef4444' : '#e2e8f0' }} className={secInputClass} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                {errors.email && <p style={{ color: '#ef4444', fontSize: '10px', margin: '4px 0 0 14px' }}>{errors.email}</p>}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <IconWrapper top="14px"><IcoMapPin /></IconWrapper>
              <textarea placeholder="Address" style={textareaStyle} value={address} onChange={e => setAddress(e.target.value)} />
            </div>

            <div style={{ marginTop: '8px' }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', margin: 0 }}>Account Status</p>
              <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsActive(true)} style={{ flex: 1, padding: '12px', background: isActive ? '#22c55e' : '#f8fafc', color: isActive ? '#fff' : '#64748b', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? '#fff' : '#cbd5e1' }} /> Active</button>
                <button type="button" onClick={() => setIsActive(false)} style={{ flex: 1, padding: '12px', background: !isActive ? '#ef4444' : '#f8fafc', color: !isActive ? '#fff' : '#64748b', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: !isActive ? '#fff' : '#cbd5e1' }} /> Inactive</button>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Organisation" icon="🏢">
          <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <IconWrapper><IcoBuilding /></IconWrapper>
              <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }} className={secInputClass} value={employer} onChange={e => setEmployer(e.target.value)}>
                <option value="">Employer</option>
                <option value="irfo">IRFO (Internal)</option>
                <option value="management_systems">Management Systems (Pvt) Ltd</option>
                <option value="external_contractor">External Contractor</option>
              </select>
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: '10px' }}>▼</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <IconWrapper><IcoOffice /></IconWrapper>
              <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }} className={secInputClass} value={department} onChange={e => setDepartment(e.target.value)}>
                <option value="">Department</option>
                <option value="it">Information Technology (IT)</option>
                <option value="hr">Human Resources</option>
                <option value="finance">Finance</option>
                <option value="operations">Operations</option>
                <option value="security">Security</option>
              </select>
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: '10px' }}>▼</span>
            </div>
          </div>
        </Section>

        <Section title="Security & Access" icon="🔒">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper><IcoLock /></IconWrapper>
                <input type="password" placeholder="Password" style={inputStyle} className={secInputClass} value={password} onChange={e => setPassword(e.target.value)} />
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', zIndex: 1 }}>👁️</span>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper><IcoLock /></IconWrapper>
                <input type="password" placeholder="Confirm Password" style={inputStyle} className={secInputClass} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', zIndex: 1 }}>👁️</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper><IcoDevice /></IconWrapper>
                <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }} className={secInputClass} value={otpMethod} onChange={e => setOtpMethod(e.target.value)}>
                  <option value="">OTP Method</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS Text Message</option>
                  <option value="authenticator">Authenticator App</option>
                </select>
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: '10px' }}>▼</span>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper><IcoStar /></IconWrapper>
                <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }} value={userType} onChange={e => setUserType(e.target.value)}>
                  <option value="">User Role</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="system_admin">System Admin</option>
                  <option value="standard">Standard User</option>
                  <option value="read_only">Read-only User</option>
                </select>
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: '10px' }}>▼</span>
              </div>
            </div>
          </div>
        </Section>

        {isUpdating && (
          <Section title="Suspension Period" icon="⏳">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <IconWrapper>📅</IconWrapper>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Start Date"
                    customInput={<CustomDateInput />}
                    wrapperClassName="date-picker-wrapper"
                  />
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <IconWrapper>📅</IconWrapper>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="End Date"
                    customInput={<CustomDateInput />}
                    wrapperClassName="date-picker-wrapper"
                  />
                </div>
              </div>
              <button
                onClick={handleSuspend}
                style={{
                  background: (startDate && endDate) ? '#f59e0b' : '#f1f5f9',
                  color: (startDate && endDate) ? '#fff' : '#94a3b8',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: (startDate && endDate) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: (startDate && endDate) ? '0 4px 10px rgba(245, 158, 11, 0.2)' : 'none'
                }}
              >
                🔒 Suspend User for Selected Period
              </button>
            </div>
          </Section>
        )}

        {/* Global Save Button */}
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            {isUpdating ? 'Update User Details' : 'Save New User'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UpdateUserRoleModal = ({ isOpen, onClose, onSelect, roles }: { isOpen: boolean; onClose: () => void; onSelect: (role: UserRole) => void; roles: UserRole[] }) => {
  if (!isOpen) return null;


  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
        <div style={{ background: 'var(--accent, #1e3a8a)', padding: '8px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>Select Existing User Role</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', lineHeight: 1, padding: '0' }}>&times;</button>
        </div>
        <div style={{ padding: '20px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Code</th>
                <th style={{ padding: '12px' }}>Role Name</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{role.code}</td>
                  <td style={{ padding: '12px' }}>{role.name}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => onSelect(role)} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: 'var(--accent, #1e3a8a)', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AssignUserRoleModal = ({ isMobile }: { isMobile: boolean }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [roles, setRoles] = useState<UserRole[]>([
    { code: '001', name: 'Project Manager', enabledRows: [0, 1, 6], rowPermissions: { 0: ['approve', 'save'], 1: ['save', 'edit'], 6: ['print'] }, createdBy: 'Admin' },
    { code: '002', name: 'System Admin', enabledRows: [0, 1, 2, 3, 4, 5, 6], rowPermissions: { 0: ['approve', 'save', 'edit', 'delete', 'print'], 1: ['approve', 'save', 'edit', 'delete', 'print'], 6: ['approve', 'save', 'edit', 'delete', 'print'] }, createdBy: 'Director' },
    { code: '003', name: 'Developer', enabledRows: [1, 2, 3], rowPermissions: { 1: ['save', 'edit'], 2: ['save'], 3: ['save'] }, createdBy: 'Lead Dev' },
  ] as UserRole[]);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);

  const [enabledRows, setEnabledRows] = useState<number[]>([]);
  const [rowPermissions, setRowPermissions] = useState<Record<number, string[]>>({});
  const [selectedSubMenu, setSelectedSubMenu] = useState<{ title: string, items: string[] } | null>(null);

  const [subMenuEnabledRows, setSubMenuEnabledRows] = useState<Record<string, number[]>>({});
  const [subMenuRowPermissions, setSubMenuRowPermissions] = useState<Record<string, Record<number, string[]>>>({});

  const showToast = (msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [dynamicMenus, setDynamicMenus] = useState<Record<string, string[]>>({
    'Dashboard': [],
    'Setup': SETUP_SUB_MENU_ITEMS,
    'Registration': REGISTRATION_SUB_MENU_ITEMS,
    'Unit Operation': UNIT_OPERATION_SUB_MENU_ITEMS,
    'Approval': APPROVAL_SUB_MENU_ITEMS,
    'Doc Printing': DOC_PRINTING_SUB_MENU_ITEMS,
    'Reports': REPORTS_SUB_MENU_ITEMS
  });
  const subMenus = Object.keys(dynamicMenus);

  const [newMenuName, setNewMenuName] = useState('');

  const handleAddMenu = () => {
    if (newMenuName.trim() && !dynamicMenus[newMenuName.trim()]) {
      setDynamicMenus(prev => ({ ...prev, [newMenuName.trim()]: [] }));
      setNewMenuName('');
      showToast(`Added new menu column: "${newMenuName.trim()}"`, 'success');
    }
  };

  const handleCreate = () => {
    if (!selectedRole) {
      showToast('Please enter a User Role Code.', 'error');
      return;
    }
    if (!roleDescription) {
      showToast('Please enter a User Role.', 'error');
      return;
    }
    if (enabledRows.length === 0) {
      showToast('Please select at least one menu right.', 'error');
      return;
    }
    const newRole = {
      code: selectedRole,
      name: roleDescription,
      enabledRows,
      rowPermissions,
      createdBy
    };
    setRoles(prev => [...prev, newRole]);
    showToast(`Role "${selectedRole}" created and added to selection list successfully!`, 'success');

    // Clear form after creation
    setSelectedRole('');
    setRoleDescription('');
    setCreatedBy('');
    setEnabledRows([]);
    setRowPermissions({});
    setSubMenuEnabledRows({});
    setSubMenuRowPermissions({});
  };

  const toggleRow = (idx: number) => {
    setEnabledRows(prev => {
      const isEnabling = !prev.includes(idx);
      const menuTitle = subMenus[idx];
      // Automatically enable all permissions when a row is enabled
      setRowPermissions(inner => {
        const next = { ...inner };
        if (isEnabling) {
          next[idx] = ['approve', 'save', 'edit', 'delete', 'print'];
        } else {
          delete next[idx];
        }
        return next;
      });

      // Automatically enable all sub-menu items when a main menu is enabled
      if (isEnabling) {
        const subItems = dynamicMenus[menuTitle] || [];
        setSubMenuEnabledRows(prev => ({
          ...prev,
          [menuTitle]: subItems.map((_, i) => i)
        }));
        setSubMenuRowPermissions(prev => ({
          ...prev,
          [menuTitle]: subItems.reduce((acc, _, i) => {
            acc[i] = ['approve', 'save', 'edit', 'delete', 'print'];
            return acc;
          }, {} as Record<number, string[]>)
        }));
      } else {
        setSubMenuEnabledRows(prev => {
          const next = { ...prev };
          delete next[menuTitle];
          return next;
        });
        setSubMenuRowPermissions(prev => {
          const next = { ...prev };
          delete next[menuTitle];
          return next;
        });
      }

      return isEnabling ? [...prev, idx] : prev.filter(i => i !== idx);
    });
  };

  const toggleAllRows = () => {
    if (enabledRows.length === subMenus.length) {
      setEnabledRows([]);
      setRowPermissions({});
      setSubMenuEnabledRows({});
      setSubMenuRowPermissions({});
    } else {
      setEnabledRows(subMenus.map((_, i) => i));
      const newRowPermissions: Record<number, string[]> = {};
      const newSubMenuEnabledRows: Record<string, number[]> = {};
      const newSubMenuRowPermissions: Record<string, Record<number, string[]>> = {};

      subMenus.forEach((menu, i) => {
        newRowPermissions[i] = ['approve', 'save', 'edit', 'delete', 'print'];
        const subItems = dynamicMenus[menu] || [];
        newSubMenuEnabledRows[menu] = subItems.map((_, si) => si);
        newSubMenuRowPermissions[menu] = subItems.reduce((acc, _, si) => {
          acc[si] = ['approve', 'save', 'edit', 'delete', 'print'];
          return acc;
        }, {} as Record<number, string[]>);
      });

      setRowPermissions(newRowPermissions);
      setSubMenuEnabledRows(newSubMenuEnabledRows);
      setSubMenuRowPermissions(newSubMenuRowPermissions);
    }
  };

  const togglePermission = (rowIdx: number, perm: string) => {
    if (!enabledRows.includes(rowIdx)) return;
    const menuTitle = subMenus[rowIdx];
    const subItems = dynamicMenus[menuTitle] || [];

    setRowPermissions(prev => {
      const current = prev[rowIdx] || [];
      const updated = current.includes(perm)
        ? current.filter(p => p !== perm)
        : [...current, perm];

      // Sync to all sub-menu items for this menu
      setSubMenuRowPermissions(subPrev => {
        const nextSubPerms = { ...subPrev };
        const menuSubPerms = { ...(nextSubPerms[menuTitle] || {}) };

        subItems.forEach((_, i) => {
          menuSubPerms[i] = updated;
        });

        nextSubPerms[menuTitle] = menuSubPerms;
        return nextSubPerms;
      });

      return { ...prev, [rowIdx]: updated };
    });
  };

  const Toggle = ({ active, onClick }: { active?: boolean; onClick?: () => void }) => (
    <div
      onClick={onClick}
      style={{ width: '36px', height: '20px', borderRadius: '10px', background: active ? 'var(--accent, #1e3a8a)' : '#e2e8f0', position: 'relative', cursor: 'pointer', transition: 'all 0.2s', alignSelf: 'center', boxShadow: active ? 'inset 0 1px 3px rgba(0,0,0,0.2)' : 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
    >
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: active ? '18px' : '2px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </div>
  );

  const topCardStyle = {
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f9fbff 100%)',
    boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.04)',
    display: 'flex',
    flexDirection: (isMobile ? 'column' : 'row') as any,
    alignItems: isMobile ? 'stretch' : 'center',
    gap: '16px',
    width: '100%',
    boxSizing: 'border-box' as const,
    flexWrap: 'wrap' as const,
  };

  const selStyle: React.CSSProperties = {
    height: '40px',
    padding: '0 16px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    outline: 'none',
    background: '#ffffff',
    fontSize: '13px',
    color: '#1e293b',
    cursor: 'pointer',
  };

  const btnPrimary: React.CSSProperties = {
    height: '40px',
    padding: '0 24px',
    borderRadius: '10px',
    border: 'none',
    color: '#fff',
    background: 'linear-gradient(135deg, var(--accent, #1e3a8a) 0%, #2563eb 100%)',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
    whiteSpace: 'nowrap' as const,
  };

  return (
    <div id="sec-assign-modal" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: isMobile ? '12px' : '20px', background: '#fdfbfa', borderRadius: '12px' }}>
      {/* Filters Row */}
      <div style={topCardStyle}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <input
            type="text"
            placeholder="User Role Code"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            style={{ ...selStyle, width: '100%' }}
          />
        </div>
        <div style={{ flex: 1.5, minWidth: '160px' }}>
          <input
            type="text"
            placeholder="User Role"
            value={roleDescription}
            onChange={e => setRoleDescription(e.target.value)}
            style={{ ...selStyle, width: '100%' }}
          />
        </div>
        <div style={{ flex: 1.5, minWidth: '120px' }}>
          <input
            type="text"
            placeholder="Created By"
            value={createdBy}
            onChange={e => setCreatedBy(e.target.value)}
            style={{ ...selStyle, width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsUpdateModalOpen(true)} style={{ ...btnPrimary, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.2)' }}>
            Load Role
          </button>
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  if (enabledRows.length === 0) {
                    showToast('Please select at least one menu right.', 'error');
                    return;
                  }
                  setRoles(prev => prev.map(r => r.code === selectedRole ? { ...r, name: roleDescription, createdBy, enabledRows, rowPermissions } : r));
                  showToast(`Rights for "${selectedRole}" successfully updated!`, 'success');
                }}
                style={{ ...btnPrimary, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
              >
                Update Rights
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedRole('');
                  setRoleDescription('');
                  setCreatedBy('');
                  setEnabledRows([]);
                  setRowPermissions({});
                  setSubMenuEnabledRows({});
                  setSubMenuRowPermissions({});
                }}
                style={{ ...btnPrimary, background: '#64748b', boxShadow: '0 4px 12px rgba(100, 116, 139, 0.2)' }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button onClick={handleCreate} style={btnPrimary}>Create</button>
          )}
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, padding: '14px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#fff', maxWidth: '320px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️'}</span>
          {toast.msg}
        </div>
      )}

      <div style={{ borderRadius: '12px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <div style={{ background: 'var(--accent, #1e3a8a)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff' }}>Member Master Set Up</h3>
            <p style={{ fontSize: '11px', margin: 0, opacity: 0.8 }}>{enabledRows.length} of {subMenus.length} menus active</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }} onClick={toggleAllRows}>
            Select All <Toggle active={enabledRows.length === subMenus.length && subMenus.length > 0} onClick={toggleAllRows} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', overflowX: 'auto' }}>
          <div>MENU</div>
          <div style={{ textAlign: 'center' }}>ENABLE</div>
          <div style={{ textAlign: 'center' }}>APPROVE</div>
          <div style={{ textAlign: 'center' }}>SAVE</div>
          <div style={{ textAlign: 'center' }}>EDIT</div>
          <div style={{ textAlign: 'center' }}>DELETE</div>
          <div style={{ textAlign: 'center' }}>PRINT</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
          {subMenus.map((menu, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', minWidth: '600px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#475569', fontWeight: 500, cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSubMenu({ title: menu, items: dynamicMenus[menu] || [] });
                }}
              >
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{idx + 1}</span>
                <span style={{ color: 'var(--accent, #1e3a8a)' }}>{menu}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Toggle active={enabledRows.includes(idx)} onClick={() => toggleRow(idx)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={`rights-action-btn rights-btn-approve ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('approve') ? 'active' : ''}`} onClick={() => togglePermission(idx, 'approve')} disabled={!enabledRows.includes(idx)}>
                  {(rowPermissions[idx] || []).includes('approve') ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : 'Approve'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={`rights-action-btn rights-btn-save ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('save') ? 'active' : ''}`} onClick={() => togglePermission(idx, 'save')} disabled={!enabledRows.includes(idx)}>
                  {(rowPermissions[idx] || []).includes('save') ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : 'Save'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={`rights-action-btn rights-btn-edit ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('edit') ? 'active' : ''}`} onClick={() => togglePermission(idx, 'edit')} disabled={!enabledRows.includes(idx)}>
                  {(rowPermissions[idx] || []).includes('edit') ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : 'Edit'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={`rights-action-btn rights-btn-delete ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('delete') ? 'active' : ''}`} onClick={() => togglePermission(idx, 'delete')} disabled={!enabledRows.includes(idx)}>
                  {(rowPermissions[idx] || []).includes('delete') ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : 'Delete'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={`rights-action-btn rights-btn-print ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('print') ? 'active' : ''}`} onClick={() => togglePermission(idx, 'print')} disabled={!enabledRows.includes(idx)}>
                  {(rowPermissions[idx] || []).includes('print') ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : 'Print'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Menu Row */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px', alignItems: 'center', background: '#f8fafc' }}>
          <input
            type="text"
            placeholder="New Main Menu Title"
            value={newMenuName}
            onChange={e => setNewMenuName(e.target.value)}
            style={{ flex: 1, maxWidth: '300px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
          />
          <button
            onClick={handleAddMenu}
            style={{ background: 'var(--accent, #1e3a8a)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            + Add Menu Column
          </button>
        </div>
      </div>

      {selectedSubMenu && (
        <SubMenuRightsModal
          isOpen={!!selectedSubMenu}
          onClose={() => setSelectedSubMenu(null)}
          title={selectedSubMenu.title}
          items={selectedSubMenu.items}
          enabledRows={subMenuEnabledRows[selectedSubMenu.title] || []}
          setEnabledRows={setSubMenuEnabledRows}
          rowPermissions={subMenuRowPermissions[selectedSubMenu.title] || {}}
          setRowPermissions={setSubMenuRowPermissions}
          onAddSubMenu={(newSub) => {
            setDynamicMenus(prev => {
              const updated = { ...prev, [selectedSubMenu.title]: [...(prev[selectedSubMenu.title] || []), newSub] };
              setSelectedSubMenu(curr => curr ? { ...curr, items: updated[selectedSubMenu.title] } : null);
              return updated;
            });
            showToast(`Added sub-menu: "${newSub}"`, 'success');
          }}
        />
      )}

      <UpdateUserRoleModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        roles={roles}
        onSelect={(role) => {
          setSelectedRole(role.code);
          setRoleDescription(role.name);
          setCreatedBy(role.createdBy || '');
          setEnabledRows(role.enabledRows);
          setRowPermissions(role.rowPermissions);

          // Simple automation for sub-menus based on main selection
          const newSubEnabled: Record<string, number[]> = {};
          const newSubPerms: Record<string, Record<number, string[]>> = {};

          role.enabledRows.forEach((idx: number) => {
            const menuTitle = subMenus[idx];
            const subItems = dynamicMenus[menuTitle] || [];
            newSubEnabled[menuTitle] = subItems.map((_, i) => i);
            newSubPerms[menuTitle] = subItems.reduce((acc, _, i) => {
              acc[i] = role.rowPermissions[idx] || [];
              return acc;
            }, {} as Record<number, string[]>);
          });

          setSubMenuEnabledRows(newSubEnabled);
          setSubMenuRowPermissions(newSubPerms);
          setIsEditing(true); // Enable editing mode
          setIsUpdateModalOpen(false);
          showToast(`Role "${role.name}" loaded for editing.`, 'success');
        }}
      />
    </div>
  );
};

const PasswordChangerModal = () => {
  const [searchUser, setSearchUser] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  const strength = getStrength(newPwd);

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!searchUser.trim()) e.searchUser = 'Please enter a user name.';
    if (!currentPwd) e.currentPwd = 'Current password is required.';
    if (!newPwd) e.newPwd = 'New password is required.';
    else if (newPwd.length < 8) e.newPwd = 'Password must be at least 8 characters.';
    else if (strength < 2) e.newPwd = 'Password is too weak. Add uppercase, numbers, or symbols.';
    if (!confirmPwd) e.confirmPwd = 'Please confirm your new password.';
    else if (newPwd !== confirmPwd) e.confirmPwd = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = () => {
    if (validate()) {
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      setErrors({});
      showToast(`Password changed successfully for "${searchUser}"!`, 'success');
    } else {
      showToast('Please fix the errors before saving.', 'error');
    }
  };

  const fieldStyle: React.CSSProperties = { paddingLeft: '44px', height: '44px', borderRadius: '8px', fontSize: '13px', width: '100%', boxSizing: 'border-box', outline: 'none', paddingRight: '40px', border: '1.5px solid #e2e8f0', color: '#334155', fontFamily: 'inherit' };

  return (
    <div id="sec-pwd-modal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', position: 'relative' }}>
      <style>{`
        #sec-pwd-modal input[type="text"],
        #sec-pwd-modal input[type="password"] {
          padding-left: 44px !important;
          padding-right: 40px !important;
          height: 44px !important;
        }
      `}</style>
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, padding: '14px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#fff', maxWidth: '320px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️'}</span>
          {toast.msg}
        </div>
      )}

      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-700)', marginBottom: '24px', letterSpacing: '0.02em', fontFamily: 'var(--font-body)' }}>Change Password</h2>

      <div className="setup-input-section" style={{ maxWidth: '450px', width: '100%', padding: '28px', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--r-md)', background: 'var(--white)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* User Search */}
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔍</span>
                <input type="text" value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="User name" style={{ ...fieldStyle, borderColor: errors.searchUser ? '#ef4444' : '#e2e8f0' }} />
              </div>
              <button className="setup-btn" style={{ height: '44px', minWidth: '85px', justifyContent: 'center', borderRadius: '8px', background: 'var(--white)', color: 'var(--text-700)', border: '1px solid var(--border-mid)', boxShadow: 'var(--shadow-xs)', fontWeight: 'bold', cursor: 'pointer' }}>Load</button>
            </div>
            {errors.searchUser && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 4px' }}>{errors.searchUser}</p>}
          </div>

          {/* Current Password */}
          <div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔒</span>
              <input type={showCurrent ? 'text' : 'password'} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Current Password" style={{ ...fieldStyle, borderColor: errors.currentPwd ? '#ef4444' : '#e2e8f0' }} />
              <span onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.5, fontSize: '15px' }}>{showCurrent ? '🙈' : '👁️'}</span>
            </div>
            {errors.currentPwd && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 4px' }}>{errors.currentPwd}</p>}
          </div>

          {/* New Password */}
          <div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔐</span>
              <input type={showNew ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="New Password" style={{ ...fieldStyle, borderColor: errors.newPwd ? '#ef4444' : '#e2e8f0' }} />
              <span onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.5, fontSize: '15px' }}>{showNew ? '🙈' : '👁️'}</span>
            </div>
            {newPwd && (
              <div style={{ marginTop: '6px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ flex: 1, height: '4px', borderRadius: '4px', background: i <= strength ? strengthColor[strength] : '#e2e8f0', transition: 'background 0.3s' }} />
                ))}
                <span style={{ fontSize: '11px', fontWeight: '600', color: strengthColor[strength], marginLeft: '6px', minWidth: '36px' }}>{strengthLabel[strength]}</span>
              </div>
            )}
            {errors.newPwd && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 4px' }}>{errors.newPwd}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>✅</span>
              <input type={showConfirm ? 'text' : 'password'} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Confirm New Password" style={{ ...fieldStyle, borderColor: errors.confirmPwd ? '#ef4444' : (confirmPwd && confirmPwd === newPwd) ? '#10b981' : '#e2e8f0' }} />
              <span onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.5, fontSize: '15px' }}>{showConfirm ? '🙈' : '👁️'}</span>
            </div>
            {confirmPwd && confirmPwd === newPwd && <p style={{ color: '#10b981', fontSize: '11px', margin: '4px 0 0 4px' }}>✓ Passwords match</p>}
            {errors.confirmPwd && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 4px' }}>{errors.confirmPwd}</p>}
          </div>
        </div>

        <div className="setup-action-buttons" style={{ marginTop: '28px' }}>
          <button onClick={handleChange} className="setup-btn" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-mid) 100%)', padding: '12px 48px', borderRadius: 'var(--r-lg)', fontSize: '14px', boxShadow: '0 4px 12px rgba(30,58,138,0.25)', border: 'none', color: 'white', cursor: 'pointer' }}>
            Change Password
          </button>
        </div>
      </div>

      <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-500)', fontWeight: 500 }}>
        © 2026 Management Systems (Pvt) Ltd | All rights reserved
      </div>
    </div>
  );
};

function Security() {
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleModalOpen = (index: number) => setModalIdx(index);
  const handleModalClose = () => setModalIdx(null);

  const renderActiveModal = () => {
    if (modalIdx === null) return null;
    const title = modules[modalIdx].title;


    if (title === 'Assign User Role') {
      return <AssignUserRoleModal isMobile={isMobile} />;
    }

    if (title === 'Create User') {
      return <UserCreationModal isMobile={isMobile} />;
    }

    if (title === 'Password Changer') {
      return <PasswordChangerModal />;
    }

    if (title === 'Back Up') {
      return <BackupModalContent />;
    }

    if (title === 'Day End') {
      return <DayEndModalContent />;
    }


    return (
      <div className="empty-content" style={{ padding: '20px', textAlign: 'center' }}>
        <p>Content for <strong>{title}</strong> will be implemented here.</p>
        <p>This is a placeholder modal for the Security Dashboard.</p>
      </div>
    );
  };

  return (
    <>
      <div className="navbar-fixed-wrapper">
        <Navbar />
      </div>

      <div className="setup-main-layout" style={{ minHeight: 'calc(100vh - 70px)' }}>
        <div className="home-sidebar-container">
          <Sidebar />
        </div>

        <div className="setup-main-content">
          <div className="setup-main-card magical-bg animated-bg">

            <div className="setup-modules-grid">
              {modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="setup-module-card"
                  tabIndex={0}
                  onClick={() => handleModalOpen(idx)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleModalOpen(idx); }}
                >
                  <div className="setup-module-icon">{mod.icon}</div>
                  <div className="setup-module-title">{mod.title}</div>
                </div>
              ))}
            </div>

            {/* Modal Portal matching UnitOperations.tsx */}
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

                  <div className="setup-modal-footer">
                    <p>Security Dashboard Module</p>
                  </div>

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

export default Security;
