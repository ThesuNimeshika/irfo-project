import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect, forwardRef, useRef } from 'react';
import { createPortal } from 'react-dom';
import UserSearchModal from '../components/UserSearchModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const moduleData = [
  { title: 'Create User', icon: '👤' },
  { title: 'Password Changer', icon: '🛡️' },
  { title: 'User Rights', icon: '🛡️' },
  { title: 'Assign User Role', icon: '🔑' },
  { title: 'Back Up', icon: '💽' },
  { title: 'Day End', icon: '🔄' },
  { title: 'User login Details', icon: '📝' },
  { title: 'Mobile Excel File Upload', icon: '📊' },
];

const modules = moduleData.map(m => ({ title: m.title, icon: m.icon }));

const UserRightsModal = ({ isMobile }: { isMobile: boolean }) => {
  const [activeMenu, setActiveMenu] = useState('Member Master Set Up');

  const topCardStyle = {
    flex: 1,
    padding: '30px 24px',
    borderRadius: '16px',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f9fbff 100%)',
    boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    position: 'relative' as const
  };

  const topLegendStyle = {
    color: 'var(--accent, #1e3a8a)',
    fontSize: '11px',
    fontWeight: '800',
    padding: '4px 12px',
    borderRadius: '20px',
    background: '#eff6ff',
    border: '1px solid #dbeafe',
    display: 'flex' as const,
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginLeft: '15px',
    boxShadow: '0 2px 4px rgba(30, 58, 138, 0.05)'
  };

  const buttonStyle = {
    height: '40px',
    padding: '0 28px',
    borderRadius: '10px',
    border: 'none',
    color: '#ffffff',
    background: 'linear-gradient(135deg, var(--accent, #1e3a8a) 0%, #2563eb 100%)',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '110px',
    boxSizing: 'border-box' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
  };
  const inputElStyle = {
    height: '40px',
    padding: '0 16px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    outline: 'none',
    background: '#ffffff',
    fontSize: '13px',
    color: '#0f172a',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box' as const,
    margin: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  };

  const menuItems = [
    { title: 'Member Master Set Up', total: 14, active: 0 },
    { title: 'Member Master Uploads', total: 2, active: 0 },
    { title: 'EFMS User Manage', total: 5, active: 0 },
    { title: 'Common Set Up', total: 2, active: 0 },
    { title: 'Loan Set Up', total: 5, active: 0 },
    { title: 'Insurance Set Up', total: 2, active: 0 },
    { title: 'EFMS Checking', total: 2, active: 0 },
    { title: 'EFMS Approvals', total: 2, active: 0 },
  ];

  const subMenus = [
    'Company', 'Employer', 'Department', 'Designation', 'PayRoll Category',
    'Emp Grade', 'Pay Unit', 'Cost Center', 'Location', 'PayRoll Sub Category',
    'Staff Type', 'Sub Company', 'Sub Cost Center', 'Nominee'
  ];

  const [enabledRows, setEnabledRows] = useState<number[]>([]);
  const [rowPermissions, setRowPermissions] = useState<Record<number, string[]>>({});

  const toggleRow = (idx: number) => {
    setEnabledRows(prev => {
      const isEnabling = !prev.includes(idx);
      if (!isEnabling) {
        setRowPermissions(inner => {
          const next = { ...inner };
          delete next[idx];
          return next;
        });
      }
      return isEnabling ? [...prev, idx] : prev.filter(i => i !== idx);
    });
  };

  const togglePermission = (rowIdx: number, perm: string) => {
    if (!enabledRows.includes(rowIdx)) return;
    setRowPermissions(prev => {
      const current = prev[rowIdx] || [];
      const updated = current.includes(perm)
        ? current.filter(p => p !== perm)
        : [...current, perm];
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: isMobile ? '12px' : '24px', background: '#fdfbfa', minHeight: '600px', borderRadius: '8px', fontFamily: 'var(--font-body, system-ui, sans-serif)' }}>


      {/* Top Cards Row */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', marginBottom: '10px' }}>


        <fieldset style={topCardStyle}>
          <legend style={topLegendStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create User Roll
          </legend>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <input type="text" placeholder="Enter Role" style={{ ...inputElStyle, width: '180px', textAlign: 'center' }} />
            <button style={buttonStyle}>Create</button>
          </div>
        </fieldset>

        <fieldset style={topCardStyle}>
          <legend style={topLegendStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Give Rights
          </legend>
          <div style={{ display: 'flex', gap: '32px', marginTop: '0', justifyContent: 'center', width: '100%' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', cursor: 'pointer', fontWeight: '600' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent, #1e3a8a)', cursor: 'pointer' }} /> Select User Roll
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', cursor: 'pointer', fontWeight: '600' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent, #1e3a8a)', cursor: 'pointer' }} /> Select User
            </label>
          </div>
        </fieldset>
      </div>

      {/* Main Bottom Section */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', marginTop: '10px' }}>

        {/* Left Sidebar */}
        <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(30,58,138,0.2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>User Rights Manager</h3>
              <p style={{ fontSize: '11px', color: 'var(--accent, #1e3a8a)', margin: '2px 0 0 0', fontWeight: 'bold' }}>0/34 • 0%</p>
            </div>
          </div>

          <button style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '13px', fontWeight: 'bold', color: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>☰ Member Master Set Up</span>
            <span style={{ color: '#94a3b8' }}>▼</span>
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
            {menuItems.map((item, idx) => (
              <div key={idx} onClick={() => setActiveMenu(item.title)} style={{ padding: '12px 16px', borderRadius: '12px', border: activeMenu === item.title ? '1px solid var(--accent, #1e3a8a)' : '1px solid transparent', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: activeMenu === item.title ? '0 4px 12px rgba(30,58,138,0.1)' : '0 2px 6px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: activeMenu === item.title ? '2px solid var(--accent, #1e3a8a)' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: activeMenu === item.title ? '#fff' : 'transparent', border: activeMenu === item.title ? '2px solid var(--accent, #1e3a8a)' : 'none' }}></div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: activeMenu === item.title ? 'var(--accent, #1e3a8a)' : '#334155', margin: 0 }}>{item.title}</h4>
                    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>{item.active}/{item.total} sub-menus</p>
                  </div>
                </div>
                {activeMenu === item.title && <span style={{ color: 'var(--accent, #1e3a8a)', fontWeight: 'bold' }}>›</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Table */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>👁️ Load</button>
            <button style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'var(--accent, #1e3a8a)', color: '#fff', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(30,58,138,0.3)' }}>+ Create</button>
            <button style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--accent, #1e3a8a)', background: '#fff', color: 'var(--accent, #1e3a8a)', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>📝 Update</button>
          </div>

          <div style={{ borderRadius: '12px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>

            {/* Table Header Wrapper */}
            <div style={{ background: 'var(--accent, #1e3a8a)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Member Master Set Up</h3>
                <p style={{ fontSize: '11px', margin: 0, opacity: 0.8 }}>0 of 14 sub-menus active</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, fontSize: '12px' }}>🔍</span>
                  <input type="text" placeholder="Filter..." style={{ padding: '6px 12px 6px 30px', borderRadius: '20px', border: 'none', outline: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px', width: '140px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                  Select All <Toggle active={false} />
                </div>
              </div>
            </div>

            {/* Table Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <div>SUB MENU</div>
              <div style={{ textAlign: 'center' }}>ENABLE</div>
              <div style={{ textAlign: 'center' }}>APPROVE</div>
              <div style={{ textAlign: 'center' }}>SAVE</div>
              <div style={{ textAlign: 'center' }}>CREATE</div>
              <div style={{ textAlign: 'center' }}>DELETE</div>
              <div style={{ textAlign: 'center' }}>PRINT</div>
            </div>

            {/* Table Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {subMenus.map((menu, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#475569', fontWeight: 500 }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{idx + 1}</span>
                    {menu}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Toggle active={enabledRows.includes(idx)} onClick={() => toggleRow(idx)} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      className={`rights-action-btn btn-approve ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('approve') ? 'active' : ''}`}
                      onClick={() => togglePermission(idx, 'approve')}
                    >
                      Approve
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      className={`rights-action-btn btn-save ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('save') ? 'active' : ''}`}
                      onClick={() => togglePermission(idx, 'save')}
                    >
                      Save
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      className={`rights-action-btn btn-create ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('create') ? 'active' : ''}`}
                      onClick={() => togglePermission(idx, 'create')}
                    >
                      Create
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      className={`rights-action-btn btn-delete ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('delete') ? 'active' : ''}`}
                      onClick={() => togglePermission(idx, 'delete')}
                    >
                      Delete
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      className={`rights-action-btn btn-print ${!enabledRows.includes(idx) ? 'disabled' : ''} ${(rowPermissions[idx] || []).includes('print') ? 'active' : ''}`}
                      onClick={() => togglePermission(idx, 'print')}
                    >
                      Print
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 20px', background: '#f8fafc', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', fontWeight: 'bold' }}>
              14 of 14 sub-menus
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

const inputStyle = { padding: '12px 14px 12px 44px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', width: '100%', boxSizing: 'border-box' as const, outline: 'none', color: '#334155', minHeight: '42px', fontFamily: 'inherit' };
const textareaStyle = { padding: '12px 14px 12px 44px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', width: '100%', boxSizing: 'border-box' as const, outline: 'none', color: '#334155', minHeight: '80px', resize: 'vertical' as const, fontFamily: 'inherit' };

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
  <span style={{ position: 'absolute', left: '14px', top: top, transform: top === '50%' ? 'translateY(-50%)' : 'none', color: '#94a3b8', pointerEvents: 'none', fontSize: '14px', zIndex: 1 }}>
    {children}
  </span>
);

const CustomDateInput = forwardRef(({ value, onClick, placeholder }: any, ref: any) => (
  <input
    onClick={onClick}
    value={value}
    placeholder={placeholder}
    ref={ref}
    style={{ ...inputStyle, width: '100%' }}
    className="setup-input-field"
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
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', padding: isMobile ? '12px' : '24px', background: '#fdfbfa', minHeight: '600px', borderRadius: '8px', fontFamily: 'var(--font-body, system-ui, sans-serif)', flexWrap: 'wrap', position: 'relative' }}>

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
              <IconWrapper>👤</IconWrapper>
              <input type="text" placeholder="User Name *" style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} />
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
                <IconWrapper>👤</IconWrapper>
                <input type="text" placeholder="Full Name *" style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>📛</IconWrapper>
                <input type="text" placeholder="Employee No" style={inputStyle} value={empNo} onChange={e => setEmpNo(e.target.value)} />
              </div>
            </div>
            {/* Designation & DOB */}
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>💼</IconWrapper>
                <input type="text" placeholder="Designation" style={inputStyle} value={designation} onChange={e => setDesignation(e.target.value)} />
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>🎂</IconWrapper>
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
                  <IconWrapper>📞</IconWrapper>
                  <input type="text" placeholder="Mobile Number" style={{ ...inputStyle, borderColor: errors.mobile ? '#ef4444' : '#e2e8f0' }} value={mobile} onChange={e => setMobile(e.target.value)} />
                </div>
                {errors.mobile && <p style={{ color: '#ef4444', fontSize: '10px', margin: '4px 0 0 14px' }}>{errors.mobile}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ position: 'relative' }}>
                  <IconWrapper>✉️</IconWrapper>
                  <input type="text" placeholder="Email Address" style={{ ...inputStyle, borderColor: errors.email ? '#ef4444' : '#e2e8f0' }} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                {errors.email && <p style={{ color: '#ef4444', fontSize: '10px', margin: '4px 0 0 14px' }}>{errors.email}</p>}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <IconWrapper top="14px">📍</IconWrapper>
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
              <IconWrapper>🏢</IconWrapper>
              <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }} value={employer} onChange={e => setEmployer(e.target.value)}>
                <option value="">Employer</option>
                <option value="irfo">IRFO (Internal)</option>
                <option value="management_systems">Management Systems (Pvt) Ltd</option>
                <option value="external_contractor">External Contractor</option>
              </select>
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: '10px' }}>▼</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <IconWrapper>🏛️</IconWrapper>
              <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }} value={department} onChange={e => setDepartment(e.target.value)}>
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
                <IconWrapper>🔒</IconWrapper>
                <input type="password" placeholder="Password" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} />
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', zIndex: 1 }}>👁️</span>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>🔒</IconWrapper>
                <input type="password" placeholder="Confirm Password" style={inputStyle} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', zIndex: 1 }}>👁️</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>📱</IconWrapper>
                <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }} value={otpMethod} onChange={e => setOtpMethod(e.target.value)}>
                  <option value="">OTP Method</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS Text Message</option>
                  <option value="authenticator">Authenticator App</option>
                </select>
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: '10px' }}>▼</span>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>⭐</IconWrapper>
                <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }} value={userType} onChange={e => setUserType(e.target.value)}>
                  <option value="">User Type</option>
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

const FUND_DATA: Record<string, string> = {
  'C001': 'Ceylon Provident Fund',
  'C002': 'Ceylon Retirement Benefit Fund',
  'C003': 'National Provident Fund',
  'C004': 'Employees Trust Fund',
  'C005': 'Widows & Orphans Pension Scheme',
};

const ROLES = ['R001', 'R002', 'R003', 'R004', 'R005'];

const AssignUserRoleModal = ({ isMobile }: { isMobile: boolean }) => {
  const [searchUser, setSearchUser] = useState('');
  const [selectedFundCode, setSelectedFundCode] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null);

  const [assignmentsList, setAssignmentsList] = useState([
    { id: 1, name: 'Anushka Perera', fundCode: 'C001', fundDesc: FUND_DATA['C001'], role: 'R003', avatar: 'A', color: '#3b82f6' },
    { id: 2, name: 'Anushka Perera', fundCode: 'C002', fundDesc: FUND_DATA['C002'], role: 'R003', avatar: 'A', color: '#10b981' },
    { id: 3, name: 'Basuru Silva', fundCode: 'C001', fundDesc: FUND_DATA['C001'], role: 'R004', avatar: 'B', color: '#8b5cf6' },
    { id: 4, name: 'Tharindu Perera', fundCode: 'C003', fundDesc: FUND_DATA['C003'], role: 'R005', avatar: 'T', color: '#f43f5e' },
    { id: 5, name: 'Thilina Fernando', fundCode: 'C002', fundDesc: FUND_DATA['C002'], role: 'R001', avatar: 'T', color: '#f59e0b' },
    { id: 6, name: 'Thilina Fernando', fundCode: 'C001', fundDesc: FUND_DATA['C001'], role: 'R003', avatar: 'T', color: '#06b6d4' },
    { id: 7, name: 'Thushara Kumara', fundCode: 'C004', fundDesc: FUND_DATA['C004'], role: 'R002', avatar: 'T', color: '#6366f1' },
    { id: 8, name: 'Nimasha Sanduni', fundCode: 'C005', fundDesc: FUND_DATA['C005'], role: 'R004', avatar: 'N', color: '#ec4899' },
    { id: 9, name: 'Ravindu Madhawa', fundCode: 'C003', fundDesc: FUND_DATA['C003'], role: 'R003', avatar: 'R', color: '#14b8a6' },
  ]);

  const showToast = (msg: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fundDescription = selectedFundCode ? FUND_DATA[selectedFundCode] : '';

  const handleCreate = () => {
    if (!searchUser.trim()) {
      showToast('Please enter or load a user name.', 'error');
      return;
    }
    if (!selectedFundCode) {
      showToast('Please select a fund.', 'error');
      return;
    }
    if (!selectedRole) {
      showToast('Please select a user role.', 'error');
      return;
    }

    const newAssignment = {
      id: Math.max(0, ...assignmentsList.map(a => a.id)) + 1,
      name: searchUser,
      fundCode: selectedFundCode,
      fundDesc: FUND_DATA[selectedFundCode],
      role: selectedRole,
      avatar: searchUser.charAt(0).toUpperCase(),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };

    setAssignmentsList([newAssignment, ...assignmentsList]);
    showToast(`Role assigned successfully to ${searchUser}!`, 'success');

    // Clear inputs
    setSearchUser('');
    setSelectedFundCode('');
    setSelectedRole('');
  };

  const handleLoad = () => setIsSearchOpen(true);

  const onUserSelect = (user: any) => {
    setSearchUser(user.fullName || '');
    setIsSearchOpen(false);
  };

  const assignments = assignmentsList.filter(a => {
    const matchesUser = !searchUser || a.name.toLowerCase().includes(searchUser.toLowerCase());
    const matchesFund = !selectedFundCode || a.fundCode === selectedFundCode;
    const matchesRole = !selectedRole || a.role === selectedRole;
    const matchesTable = !tableSearch || [
      a.name, a.fundCode, a.fundDesc, a.role
    ].some(val => val.toLowerCase().includes(tableSearch.toLowerCase()));
    return matchesUser && matchesFund && matchesRole && matchesTable;
  });

  const uniqueFunds = Object.keys(FUND_DATA).length;
  const uniqueUsers = [...new Set(assignmentsList.map(a => a.name))].length;
  const uniqueRoles = [...new Set(assignmentsList.map(a => a.role))].length;

  const stats = [
    { label: 'Total Records', value: assignments.length, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Users', value: uniqueUsers, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Funds', value: uniqueFunds, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Roles', value: uniqueRoles, color: '#f59e0b', bg: '#fffbeb' },
  ];

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: isMobile ? '12px' : '20px', background: '#fdfbfa', borderRadius: '12px' }}>

      {/* Filters Row */}
      <div style={topCardStyle}>
        {/* Search */}
        <div style={{ flex: 2, minWidth: '160px' }}>
          <input
            type="text"
            placeholder="User name"
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
            style={{
              ...selStyle,
              width: '100%',
              paddingLeft: '54px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '12px center',
              backgroundSize: '16px',
            }}
          />
        </div>

        {/* Fund Code */}
        <div style={{ flex: 1, minWidth: '120px' }}>
          <select value={selectedFundCode} onChange={e => setSelectedFundCode(e.target.value)} style={{ ...selStyle, width: '100%' }}>
            <option value="">Fund Code</option>
            {Object.keys(FUND_DATA).map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        {/* Fund Description — linked to Fund Code */}
        <div style={{ flex: 2, minWidth: '180px' }}>
          <select value={selectedFundCode} onChange={e => setSelectedFundCode(e.target.value)} style={{ ...selStyle, width: '100%', color: fundDescription ? '#1e293b' : '#94a3b8' }}>
            <option value="">Fund Description</option>
            {Object.entries(FUND_DATA).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        {/* User Role */}
        <div style={{ flex: 1, minWidth: '120px' }}>
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} style={{ ...selStyle, width: '100%' }}>
            <option value="">User Role</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <button onClick={handleCreate} style={btnPrimary}>Create</button>
        <button onClick={handleLoad} style={{ ...btnPrimary, background: '#fff', color: '#1e3a8a', border: '1.5px solid #dbeafe', boxShadow: 'none' }}>Load</button>
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, padding: '14px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#fff', maxWidth: '320px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️'}</span>
          {toast.msg}
        </div>
      )}

      <UserSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelect={onUserSelect} />

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', background: s.bg, border: `1px solid ${s.color}20` }}>
            <span style={{ fontWeight: '800', color: s.color, fontSize: '15px' }}>{s.value}</span>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ background: 'var(--accent, #1e3a8a)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👥</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>User Role Assignments</h3>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>{assignments.length} records found</span>
            </div>
          </div>
          {/* Table Search */}
          <div style={{ position: 'relative', minWidth: '200px', flex: '0 1 240px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7, fontSize: '13px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search table..."
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              style={{ width: '100%', height: '34px', borderRadius: '20px', border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', paddingLeft: '54px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' as const }}
            />
            {tableSearch && (
              <span onClick={() => setTableSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.7, fontSize: '13px' }}>✕</span>
            )}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['#', 'USER NAME', 'FUND CODE', 'FUND DESCRIPTION', 'ROLE'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 18px', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No records found matching your filter.</td></tr>
              ) : assignments.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i === assignments.length - 1 ? 'none' : '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fcfdfe' }}>
                  <td style={{ padding: '14px 18px', fontSize: '13px', color: '#94a3b8' }}>{a.id}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: a.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>{a.avatar}</div>
                      <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ padding: '4px 10px', background: '#fffbeb', color: '#b45309', borderRadius: '6px', fontSize: '11px', fontWeight: '700', border: '1px solid #fef3c7' }}>{a.fundCode}</span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '13px', color: '#475569', maxWidth: '200px' }}>{a.fundDesc}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ padding: '4px 10px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', fontSize: '11px', fontWeight: '700', border: '1px solid #dbeafe' }}>{a.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
          <div>Showing {assignments.length} of {assignmentsList.length} records</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>{'<'}</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'var(--accent, #1e3a8a)', color: '#fff', cursor: 'pointer' }}>1</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>{'>'}</button>
          </div>
        </div>
      </div>

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', position: 'relative' }}>
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

    if (title === 'User Rights') {
      return <UserRightsModal isMobile={isMobile} />;
    }

    if (title === 'Assign User Role') {
      return <AssignUserRoleModal isMobile={isMobile} />;
    }

    if (title === 'Create User') {
      return <UserCreationModal isMobile={isMobile} />;
    }

    if (title === 'Password Changer') {
      return <PasswordChangerModal />;
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

      <div className="setup-main-layout">
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
