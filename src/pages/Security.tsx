import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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

  const Toggle = ({ active }: { active?: boolean }) => (
    <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: active ? 'var(--accent, #1e3a8a)' : '#e2e8f0', position: 'relative', cursor: 'pointer', transition: 'all 0.2s', alignSelf: 'center', boxShadow: active ? 'inset 0 1px 3px rgba(0,0,0,0.2)' : 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: active ? '18px' : '2px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: isMobile ? '12px' : '24px', background: '#fdfbfa', minHeight: '600px', borderRadius: '8px', fontFamily: 'var(--font-body, system-ui, sans-serif)' }}>


      {/* Top Cards Row */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', marginBottom: '10px' }}>
        <fieldset style={topCardStyle}>
          <legend style={topLegendStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Select Fund
          </legend>
          <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '200px' }}>
              <select style={{ ...inputElStyle, width: '100%', cursor: 'pointer', appearance: 'none' }}>
                <option>Select a Fund</option>
              </select>
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: '10px' }}>▼</span>
            </div>
            <button style={buttonStyle}>Confirm</button>
          </div>
        </fieldset>

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
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <div>SUB MENU</div>
              <div style={{ textAlign: 'center' }}>ENABLE</div>
              <div style={{ textAlign: 'center' }}>CREATE</div>
              <div style={{ textAlign: 'center' }}>DELETE</div>
              <div style={{ textAlign: 'center' }}>PRINT</div>
            </div>

            {/* Table Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {subMenus.map((menu, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#475569', fontWeight: 500 }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{idx + 1}</span>
                    {menu}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Toggle active={false} />
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', cursor: 'not-allowed' }}>Create</div>
                  <div style={{ color: '#cbd5e1', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', cursor: 'not-allowed' }}>Delete</div>
                  <div style={{ color: '#cbd5e1', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', cursor: 'not-allowed' }}>Print</div>
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

const UserCreationModal = ({ isMobile }: { isMobile: boolean }) => {
  const [isActive, setIsActive] = useState(true);

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

  const inputStyle = { padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', width: '100%', boxSizing: 'border-box' as const, outline: 'none', color: '#334155', minHeight: '42px', fontFamily: 'inherit', textIndent: '26px' };
  const textareaStyle = { padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', width: '100%', boxSizing: 'border-box' as const, outline: 'none', color: '#334155', minHeight: '80px', resize: 'vertical' as const, fontFamily: 'inherit', textIndent: '26px' };

  const IconWrapper = ({ children, top = '50%' }: any) => (
    <span style={{ position: 'absolute', left: '14px', top: top, transform: top === '50%' ? 'translateY(-50%)' : 'none', color: '#94a3b8', pointerEvents: 'none', fontSize: '14px', zIndex: 1 }}>
      {children}
    </span>
  );

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', padding: isMobile ? '12px' : '24px', background: '#fdfbfa', minHeight: '600px', borderRadius: '8px', fontFamily: 'var(--font-body, system-ui, sans-serif)', flexWrap: 'wrap' }}>
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
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eff6ff', border: '2px solid var(--accent, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
            <span style={{ fontSize: '32px', color: 'var(--accent, #1e3a8a)', fontWeight: 'bold' }}>?</span>
            <button style={{ position: 'absolute', bottom: 0, right: -4, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--accent, #1e3a8a)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>📷</button>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#1e293b' }}>New User</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>No role assigned</p>
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
            <button style={{ background: 'linear-gradient(135deg, var(--accent, #1e3a8a) 0%, var(--accent-mid, #2563eb) 100%)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.2)' }}>+ Create User</button>
            <button style={{ background: '#fff', color: 'var(--accent, #1e3a8a)', border: '1px solid var(--accent, #1e3a8a)', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>📝 Update User</button>
            <button style={{ background: '#fff', color: '#ef4444', border: '1px solid #fca5a5', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>🗑️ Delete User</button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <Section title="User Lookup" icon="👤">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ flex: 1, position: 'relative', width: '100%' }}>
              <IconWrapper>👤</IconWrapper>
              <input type="text" placeholder="User Name *" style={inputStyle} />
            </div>
            <button style={{ background: 'var(--accent, #1e3a8a)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
              📥 Load
            </button>
          </div>
        </Section>

        <Section title="Personal Information" icon="👤">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>👤</IconWrapper>
                <input type="text" placeholder="Full Name *" style={inputStyle} />
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>📛</IconWrapper>
                <input type="text" placeholder="Employee No" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>📞</IconWrapper>
                <input type="text" placeholder="Mobile Number" style={inputStyle} />
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>✉️</IconWrapper>
                <input type="text" placeholder="Email Address" style={inputStyle} />
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <IconWrapper top="14px">📍</IconWrapper>
              <textarea placeholder="Address" style={textareaStyle} />
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
              <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }}>
                <option value="">Employer</option>
                <option value="irfo">IRFO (Internal)</option>
                <option value="management_systems">Management Systems (Pvt) Ltd</option>
                <option value="external_contractor">External Contractor</option>
              </select>
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: '10px' }}>▼</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <IconWrapper>🏛️</IconWrapper>
              <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }}>
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
                <input type="password" placeholder="Password" style={inputStyle} />
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', zIndex: 1 }}>👁️</span>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>🔒</IconWrapper>
                <input type="password" placeholder="Confirm Password" style={inputStyle} />
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', zIndex: 1 }}>👁️</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>📱</IconWrapper>
                <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }}>
                  <option value="">OTP Method</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS Text Message</option>
                  <option value="authenticator">Authenticator App</option>
                </select>
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: '10px' }}>▼</span>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <IconWrapper>⭐</IconWrapper>
                <select style={{ ...inputStyle, appearance: 'none', backgroundColor: '#fff' }}>
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

      </div>
    </div>
  );
};

const AssignUserRoleModal = ({ isMobile }: { isMobile: boolean }) => {

  const stats = [
    { label: 'Total Records', value: 7, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Users', value: 5, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Funds', value: 2, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Roles', value: 4, color: '#f59e0b', bg: '#fffbeb' },
  ];

  const assignments = [
    { id: 1, name: 'Anushka', fund: 'C001', type: 'CM001', role: 'R003', avatar: 'A', color: '#3b82f6' },
    { id: 2, name: 'Anushka', fund: 'C002', type: 'CM003', role: 'R003', avatar: 'A', color: '#10b981' },
    { id: 3, name: 'Basuru', fund: 'C001', type: 'CM001', role: 'R004', avatar: 'B', color: '#8b5cf6' },
    { id: 4, name: 'Tharindu', fund: 'C001', type: 'CM001', role: 'R005', avatar: 'T', color: '#f43f5e' },
    { id: 5, name: 'Thilina', fund: 'C002', type: 'CM003', role: '-', avatar: 'T', color: '#f59e0b' },
    { id: 6, name: 'Thilina', fund: 'C001', type: 'CM001', role: 'R003', avatar: 'T', color: '#06b6d4' },
    { id: 7, name: 'thushara', fund: 'C002', type: 'CM003', role: 'R003', avatar: 'T', color: '#6366f1' },
  ];

  const topCardStyle = {
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f9fbff 100%)',
    boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.04)',
    display: 'flex',
    flexDirection: (isMobile ? 'column' : 'row') as any,
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    boxSizing: 'border-box' as const
  };

  const inputStyle = {
    height: '40px',
    padding: '0 16px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    outline: 'none',
    background: '#ffffff',
    fontSize: '13px',
    color: '#1e293b'
  };

  const btnPrimary = {
    height: '40px',
    padding: '0 24px',
    borderRadius: '10px',
    border: 'none',
    color: '#fff',
    background: 'linear-gradient(135deg, var(--accent, #1e3a8a) 0%, #2563eb 100%)',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: isMobile ? '12px' : '20px', background: '#fdfbfa', borderRadius: '12px' }}>


      {/* Filters Row */}
      <div style={topCardStyle}>
        <div style={{ position: 'relative', flex: 2 }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          <input type="text" placeholder="Search User Name" style={{ ...inputStyle, width: '100%', paddingLeft: '36px' }} />
        </div>
        <select style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}><option>Select a Fund</option></select>
        <select style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}><option>Member Type</option></select>
        <select style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}><option>Select User Role</option></select>
        <button style={btnPrimary}>Create</button>
        <button style={{ ...btnPrimary, background: '#fff', color: '#1e3a8a', border: '1.5px solid #dbeafe' }}>Load</button>
      </div>

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
        <div style={{ background: 'var(--accent, #1e3a8a)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👥</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>User Role Assignments</h3>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>7 records found</span>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Search..." style={{ height: '32px', padding: '0 12px 0 32px', borderRadius: '16px', border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px', outline: 'none' }} />
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.8, fontSize: '12px' }}>🔍</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['#', 'USER NAME', 'FUND', 'FUND TYPE', 'ROLE'].map((h, i) => (
                  <th key={i} style={{ padding: '16px 20px', fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, i) => (
                <tr key={i} style={{ borderBottom: i === assignments.length - 1 ? 'none' : '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fcfdfe' }}>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#94a3b8' }}>{a.id}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: a.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>{a.avatar}</div>
                      <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}><span style={{ padding: '4px 8px', background: '#fffbeb', color: '#b45309', borderRadius: '6px', fontSize: '11px', fontWeight: '700', border: '1px solid #fef3c7' }}>{a.fund}</span></td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b' }}>{a.type}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#94a3b8' }}>👤</span>
                      <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>{a.role}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
          <div>Rows per page: 10 ▼</div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span>1-7 of 7</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>{'<'}</button>
              <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'var(--accent, #1e3a8a)', color: '#fff', cursor: 'pointer' }}>1</button>
              <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>{'>'}</button>
            </div>
          </div>
        </div>
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
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-700)', marginBottom: '24px', letterSpacing: '0.02em', fontFamily: 'var(--font-body)' }}>Change Password</h2>

          <div className="setup-input-section" style={{ maxWidth: '450px', width: '100%', padding: '28px', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--r-md)', background: 'var(--white)' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Search Row */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="setup-input-group" style={{ flex: 1, margin: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔍</span>
                    <input type="text" className="setup-input-field" placeholder="Search User Name" style={{ textIndent: '26px', height: '40px', borderRadius: 'var(--r-sm)', fontSize: '13px' }} />
                  </div>
                </div>
                <button className="setup-btn" style={{ height: '40px', minWidth: '85px', justifyContent: 'center', borderRadius: 'var(--r-sm)', background: 'var(--white)', color: 'var(--text-700)', border: '1px solid var(--border-mid)', boxShadow: 'var(--shadow-xs)', fontWeight: 'bold' }}>Load</button>
              </div>

              {/* Current Password */}
              <div className="setup-input-group" style={{ margin: 0 }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔒</span>
                  <input type="password" className="setup-input-field" placeholder="Current Password" style={{ textIndent: '26px', height: '40px', borderRadius: 'var(--r-sm)', fontSize: '13px' }} />
                </div>
              </div>

              {/* New Password */}
              <div className="setup-input-group" style={{ margin: 0 }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔒</span>
                  <input type="password" className="setup-input-field" placeholder="New Password" style={{ textIndent: '26px', height: '40px', borderRadius: 'var(--r-sm)', fontSize: '13px' }} />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="setup-input-group" style={{ margin: 0 }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '15px' }}>🔒</span>
                  <input type="password" className="setup-input-field" placeholder="Confirm Password" style={{ textIndent: '26px', height: '40px', borderRadius: 'var(--r-sm)', fontSize: '13px' }} />
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="setup-action-buttons" style={{ marginTop: '32px' }}>
              <button className="setup-btn" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-mid) 100%)', padding: '12px 48px', borderRadius: 'var(--r-lg)', fontSize: '14px', boxShadow: '0 4px 12px rgba(30,58,138,0.25)', border: 'none', color: 'white' }}>
                Change Password
              </button>
            </div>

          </div>

          <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-500)', fontWeight: 500 }}>
            © 2026 Management Systems (Pvt) Ltd | All rights reserved
          </div>
        </div >
      );
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
