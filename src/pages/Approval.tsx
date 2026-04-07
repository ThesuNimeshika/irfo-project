import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// ========================================
// STATIC DATA AND CONFIGURATION
// ========================================

// 15 Approval cards
const moduleData = [
  { title: 'Application Confirmation', icon: '📋' },
  { title: 'Application Approval', icon: '✅' },
  { title: 'Account Confirmation', icon: '👤' },
  { title: 'Account Approval', icon: '✓️' },
  { title: 'Unit Fee Confirmation', icon: '💳' },
  { title: 'Unit Price Approval', icon: '💰' },
  { title: 'Transaction Confirmation', icon: '🔄' },
  { title: 'Transaction Approval', icon: '✔️' },
  { title: 'Certificate Approval', icon: '📜' },
  { title: 'Holder Registration Approval', icon: '📝' },
  { title: 'Cheque Clear', icon: '🧾' },
  { title: 'Dividend Confirmation', icon: '💸' },
  { title: 'Standing Instructions Approval', icon: '📋' },
  { title: 'Dividend Approval', icon: '✅' },
  { title: 'User Role Approval', icon: '🔐' },
];

const modules = moduleData.map(m => ({
  title: m.title,
  icon: m.icon,
}));

import RegistrationDetailsView from '../components/RegistrationDetailsView';

// ========================================
// MAIN APPROVAL COMPONENT
// ========================================

function Approval() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================

  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewingData, setViewingData] = useState<{ regNo: string; applicantType: 'Individual' | 'Corporate' } | null>(null);

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ========================================
  // HANDLERS
  // ========================================

  const handleModalOpen = (idx: number) => {
    setModalIdx(idx);
  };

  const handleModalClose = () => {
    setModalIdx(null);
  };

  const handleViewDetails = (regNo: string, applicantType: 'Individual' | 'Corporate') => {
    setViewingData({ regNo, applicantType });
  };

  // ========================================
  // RENDER
  // ========================================

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
            {/* Approval Cards Grid */}
            <div className="setup-modules-grid">
              {modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="setup-module-card"
                  tabIndex={0}
                  onClick={() => handleModalOpen(idx)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleModalOpen(idx);
                    }
                  }}
                >
                  <div className="setup-module-icon">{mod.icon}</div>
                  <div className="setup-module-title">{mod.title}</div>
                </div>
              ))}
            </div>

            {/* Main Modals (Application Confirmation / Approval) */}
            {modalIdx !== null && createPortal(
              <div className={`setup-modal-overlay ${isMobile ? 'mobile' : ''}`}
                onClick={handleModalClose}
              >
                <div className={`setup-modal-container ${isMobile ? 'mobile' : ''}`}
                  style={{ width: (modules[modalIdx].title === 'Application Confirmation' || modules[modalIdx].title === 'Application Approval') ? '1000px' : '600px', maxWidth: '95vw' }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="setup-modal-header">
                    <div className="setup-modal-header-content">
                      <span className="setup-modal-header-icon">{modules[modalIdx].icon}</span>
                      <span className="setup-modal-header-title">{modules[modalIdx].title}</span>
                    </div>
                    <button
                      onClick={handleModalClose}
                      className="setup-modal-close-btn"
                      aria-label="Close modal"
                    >
                      ×
                    </button>
                  </div>

                  {/* Content */}
                  <div className="setup-modal-content" style={{ padding: '20px' }}>
                    {modules[modalIdx].title === 'Application Confirmation' ? (
                      <ApplicationConfirmationModal onViewDetails={handleViewDetails} />
                    ) : modules[modalIdx].title === 'Application Approval' ? (
                      <ApplicationApprovalModal onViewDetails={handleViewDetails} />
                    ) : modules[modalIdx].title === 'User Role Approval' ? (
                      <UserRoleApprovalModal />
                    ) : (
                      <div className="empty-content">
                        <p>Content for {modules[modalIdx].title} will be implemented here.</p>
                        <p>This is a placeholder modal.</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="setup-modal-footer">
                    <p>Approval Module</p>
                  </div>
                </div>
              </div>,
              document.body
            )}

            {/* Inline Details View Modal (Portal on top of primary modal) */}
            {viewingData && createPortal(
              <div className="setup-modal-overlay"
                onClick={() => setViewingData(null)}
                style={{ zIndex: 100000000, alignItems: 'center', justifyContent: 'center', display: 'flex' }}
              >
                <div
                  className="registration-details-modal-container"
                  style={{
                    width: '700px',
                    maxWidth: '95vw',
                    height: '85vh',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: 'none'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="setup-modal-header" style={{ background: '#1e3a8a', color: '#ffffff', minHeight: '52px', padding: '0 24px' }}>
                    <div className="setup-modal-header-content">
                      <span className="setup-modal-header-icon" style={{ fontSize: '18px', color: '#ffffff' }}>👁</span>
                      <span className="setup-modal-header-title" style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff', letterSpacing: '0.05em' }}>
                        Registration Details — {viewingData.regNo}
                      </span>
                    </div>
                    <button
                      className="setup-modal-close-btn"
                      onClick={() => setViewingData(null)}
                      style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', borderRadius: '10px', width: '32px', height: '32px', padding: 0, fontSize: '16px' }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <RegistrationDetailsView
                      data={{
                        applicantType: viewingData.applicantType,
                        title: 'Mr',
                        initials: 'N.',
                        nameByInitials: viewingData.applicantType === 'Corporate' ? 'MSL Computer Services' : 'Nimeshika',
                        surname: viewingData.applicantType === 'Corporate' ? 'Software Solutions' : 'Bandara',
                        dateOfBirth: '1995-10-15',
                        nic: '199512345678',
                        mobile: '0771234567',
                        email: 'nimeshika@example.com',
                        nationality: 'Local',
                        riskCategory: 'Low',
                        correspondenceStreet: '123 Main Street',
                        correspondenceTown: 'Colombo 03',
                        correspondenceCity: 'Colombo',
                        correspondenceDistrict: 'Colombo',
                        permanentStreet: '123 Main Street',
                        permanentTown: 'Colombo 03',
                        permanentCity: 'Colombo',
                        permanentDistrict: 'Colombo',
                        investmentTypeAtRegistration: 'Direct',
                        investorCategory: viewingData.applicantType
                      }}
                    />
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

// ========================================
// APPLICATION CONFIRMATION MODAL
// ========================================

function ApplicationConfirmationModal({ onViewDetails }: { onViewDetails: (regNo: string, applicantType: 'Individual' | 'Corporate') => void }) {
  interface RowData {
    id: number;
    regNo: string;
    name: string;
    nic: string;
    applicantType: 'Individual' | 'Corporate';
    status: 'approved' | 'rejected' | null;
  }

  const [data, setData] = useState<RowData[]>([
    { id: 1, regNo: 'REG001', name: 'Nimeshika Bandara', nic: '199512345678', applicantType: 'Individual', status: null },
    { id: 2, regNo: 'REG002', name: 'Chaminda Perera', nic: '198822345678', applicantType: 'Corporate', status: 'approved' },
    { id: 3, regNo: 'REG003', name: 'Sajith Rathnayake', nic: '199232345678', applicantType: 'Individual', status: 'rejected' },
    { id: 4, regNo: 'REG004', name: 'Gayathri Wickramasinghe', nic: '199842345678', applicantType: 'Individual', status: null },
    { id: 5, regNo: 'REG005', name: 'Ruwan Kumara', nic: '198552345678', applicantType: 'Corporate', status: null },
    { id: 6, regNo: 'REG006', name: 'Ishara Madushanka', nic: '199162345678', applicantType: 'Individual', status: 'approved' },
  ]);

  const handleStatusChange = (id: number, status: 'approved' | 'rejected') => {
    setData(prev => prev.map(row => row.id === id ? { ...row, status } : row));
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: '14px 20px',
    background: '#f8fafc',
    fontWeight: 600,
    fontSize: '12px',
    color: '#475569',
    textAlign: 'center',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '12px 20px',
    fontSize: '13px',
    color: '#334155',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle',
    textAlign: 'center',
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)', backgroundColor: '#ffffff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '10%' }}>RegNo</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '20%' }}>Name</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '15%' }}>NIC</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '25%' }}>Status</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '15%' }}>Applicant Type</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '15%' }}>View</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} style={{ transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <td style={{ ...tableCellStyle, textAlign: 'center', fontWeight: 600, color: '#1e40af' }}>{row.regNo}</td>
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>{row.name}</td>
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>{row.nic}</td>
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  background: '#f1f5f9',
                  padding: '4px',
                  borderRadius: '24px',
                  gap: '4px'
                }}>
                  <button
                    onClick={() => handleStatusChange(row.id, 'approved')}
                    style={{
                      padding: '6px 18px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: row.status === 'approved' ? '#10b981' : 'transparent',
                      color: row.status === 'approved' ? '#ffffff' : '#64748b',
                      boxShadow: row.status === 'approved' ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{row.status === 'approved' ? '✓' : '○'}</span>
                    APPROVED
                  </button>
                  <button
                    onClick={() => handleStatusChange(row.id, 'rejected')}
                    style={{
                      padding: '6px 18px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: row.status === 'rejected' ? '#ef4444' : 'transparent',
                      color: row.status === 'rejected' ? '#ffffff' : '#64748b',
                      boxShadow: row.status === 'rejected' ? '0 4px 12px rgba(239, 68, 68, 0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{row.status === 'rejected' ? '✕' : '○'}</span>
                    REJECTED
                  </button>
                </div>
              </td>
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: row.applicantType === 'Individual' ? '#eff6ff' : '#f5f3ff',
                  color: row.applicantType === 'Individual' ? '#1d4ed8' : '#6d28d9',
                  border: `1px solid ${row.applicantType === 'Individual' ? '#dbeafe' : '#ede9fe'}`
                }}>
                  {row.applicantType}
                </span>
              </td>
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                <button
                  onClick={() => onViewDetails(row.regNo, row.applicantType)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.color = '#0284c7';
                    e.currentTarget.style.borderColor = '#bae6fd';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 132, 199, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                  }}
                >
                  <span style={{ fontSize: '14px', color: 'inherit' }}>👁</span>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ========================================
// APPLICATION APPROVAL MODAL
// ========================================

function ApplicationApprovalModal({ onViewDetails }: { onViewDetails: (regNo: string, applicantType: 'Individual' | 'Corporate') => void }) {
  interface RowData {
    id: number;
    regNo: string;
    name: string;
    nic: string;
    applicantType: 'Individual' | 'Corporate';
    status: 'approved' | 'rejected' | null;
  }

  const [data, setData] = useState<RowData[]>([
    { id: 1, regNo: 'REG001', name: 'Nimeshika Bandara', nic: '199512345678', applicantType: 'Individual', status: null },
    { id: 2, regNo: 'REG002', name: 'Chaminda Perera', nic: '198822345678', applicantType: 'Corporate', status: 'approved' },
    { id: 3, regNo: 'REG003', name: 'Sajith Rathnayake', nic: '199232345678', applicantType: 'Individual', status: 'rejected' },
    { id: 4, regNo: 'REG004', name: 'Gayathri Wickramasinghe', nic: '199842345678', applicantType: 'Individual', status: null },
    { id: 5, regNo: 'REG005', name: 'Ruwan Kumara', nic: '198552345678', applicantType: 'Corporate', status: null },
    { id: 6, regNo: 'REG006', name: 'Ishara Madushanka', nic: '199162345678', applicantType: 'Individual', status: 'approved' },
  ]);

  const handleStatusChange = (id: number, status: 'approved' | 'rejected') => {
    setData(prev => prev.map(row => row.id === id ? { ...row, status } : row));
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: '14px 20px',
    background: '#f8fafc',
    fontWeight: 600,
    fontSize: '12px',
    color: '#475569',
    textAlign: 'center',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '12px 20px',
    fontSize: '13px',
    color: '#334155',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle',
    textAlign: 'center',
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)', backgroundColor: '#ffffff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '10%' }}>RegNo</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '20%' }}>Name</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '15%' }}>NIC</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '25%' }}>Status</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '15%' }}>Applicant Type</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '15%' }}>View</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} style={{ transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <td style={{ ...tableCellStyle, textAlign: 'center', fontWeight: 600, color: '#1e40af' }}>{row.regNo}</td>
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>{row.name}</td>
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>{row.nic}</td>
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  background: '#f1f5f9',
                  padding: '4px',
                  borderRadius: '24px',
                  gap: '4px'
                }}>
                  <button
                    onClick={() => handleStatusChange(row.id, 'approved')}
                    style={{
                      padding: '6px 18px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: row.status === 'approved' ? '#10b981' : 'transparent',
                      color: row.status === 'approved' ? '#ffffff' : '#64748b',
                      boxShadow: row.status === 'approved' ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{row.status === 'approved' ? '✓' : '○'}</span>
                    APPROVED
                  </button>
                  <button
                    onClick={() => handleStatusChange(row.id, 'rejected')}
                    style={{
                      padding: '6px 18px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: row.status === 'rejected' ? '#ef4444' : 'transparent',
                      color: row.status === 'rejected' ? '#ffffff' : '#64748b',
                      boxShadow: row.status === 'rejected' ? '0 4px 12px rgba(239, 68, 68, 0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{row.status === 'rejected' ? '✕' : '○'}</span>
                    REJECTED
                  </button>
                </div>
              </td>
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: row.applicantType === 'Individual' ? '#eff6ff' : '#f5f3ff',
                  color: row.applicantType === 'Individual' ? '#1d4ed8' : '#6d28d9',
                  border: `1px solid ${row.applicantType === 'Individual' ? '#dbeafe' : '#ede9fe'}`
                }}>
                  {row.applicantType}
                </span>
              </td>
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                <button
                  onClick={() => onViewDetails(row.regNo, row.applicantType)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.color = '#0284c7';
                    e.currentTarget.style.borderColor = '#bae6fd';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 132, 199, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                  }}
                >
                  <span style={{ fontSize: '14px', color: 'inherit' }}>👁</span>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ========================================
// USER ROLE APPROVAL MODAL
// ========================================

function UserRoleApprovalModal() {
  interface RoleRowData {
    id: number;
    roleCode: string;
    roleName: string;
    createdBy: string;
    date: string;
    status: 'approved' | 'rejected' | null;
  }

  const [data, setData] = useState<RoleRowData[]>([
    { id: 1, roleCode: '001', roleName: 'Project Manager', createdBy: 'Admin', date: '2026-04-01', status: null },
    { id: 2, roleCode: '002', roleName: 'System Admin', createdBy: 'SuperAdmin', date: '2026-04-02', status: 'approved' },
    { id: 3, roleCode: '003', roleName: 'Developer', createdBy: 'Admin', date: '2026-04-03', status: 'rejected' },
    { id: 4, roleCode: '004', roleName: 'Accountant', createdBy: 'FinManager', date: '2026-04-04', status: null },
    { id: 5, roleCode: '005', roleName: 'Sales Rep', createdBy: 'Admin', date: '2026-04-05', status: null },
  ]);

  const [viewingRights, setViewingRights] = useState<RoleRowData | null>(null);

  const handleStatusChange = (id: number, status: 'approved' | 'rejected') => {
    setData(prev => prev.map(row => row.id === id ? { ...row, status } : row));
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: '14px 20px',
    background: '#f8fafc',
    fontWeight: 600,
    fontSize: '12px',
    color: '#475569',
    textAlign: 'center',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '12px 20px',
    fontSize: '13px',
    color: '#334155',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle',
    textAlign: 'center',
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)', backgroundColor: '#ffffff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: '15%' }}>Role Code</th>
            <th style={{ ...tableHeaderStyle, width: '25%' }}>Role Name</th>
            <th style={{ ...tableHeaderStyle, width: '30%' }}>Status</th>
            <th style={{ ...tableHeaderStyle, width: '15%' }}>Rights</th>
            <th style={{ ...tableHeaderStyle, width: '15%' }}>Created By</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} style={{ transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <td style={{ ...tableCellStyle, fontWeight: 600, color: '#1e40af' }}>{row.roleCode}</td>
              <td style={{ ...tableCellStyle, textAlign: 'left' }}>{row.roleName}</td>
              <td style={{ ...tableCellStyle }}>
                <div style={{
                  display: 'inline-flex',
                  background: '#f1f5f9',
                  padding: '4px',
                  borderRadius: '24px',
                  gap: '4px'
                }}>
                  <button
                    onClick={() => handleStatusChange(row.id, 'approved')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: row.status === 'approved' ? '#10b981' : 'transparent',
                      color: row.status === 'approved' ? '#ffffff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{row.status === 'approved' ? '✓' : '○'}</span>
                    APPROVE
                  </button>
                  <button
                    onClick={() => handleStatusChange(row.id, 'rejected')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: row.status === 'rejected' ? '#ef4444' : 'transparent',
                      color: row.status === 'rejected' ? '#ffffff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{row.status === 'rejected' ? '✕' : '○'}</span>
                    REJECT
                  </button>
                </div>
              </td>
              <td style={{ ...tableCellStyle }}>
                <button
                  onClick={() => setViewingRights(row)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#1e3a8a',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  👁 VIEW
                </button>
              </td>
              <td style={{ ...tableCellStyle, fontSize: '11px', color: '#64748b' }}>
                <div style={{ fontWeight: 600, color: '#475569' }}>{row.createdBy}</div>
                <div>{row.date}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewingRights && createPortal(
        <ViewRightsModal
          roleName={viewingRights.roleName}
          onClose={() => setViewingRights(null)}
        />,
        document.body
      )}
    </div>
  );
}

// ========================================
// VIEW RIGHTS MODAL (READ-ONLY)
// ========================================

function ViewRightsModal({ roleName, onClose }: { roleName: string; onClose: () => void }) {
  const [selectedSubMenu, setSelectedSubMenu] = useState<string | null>(null);
  const subMenus = [
    'Dashboard', 'Setup', 'Registration', 'Unit Operation', 'Approval',
    'Doc Printing', 'Reports'
  ];

  // Mock permissions
  const mockPermissions: Record<number, string[]> = {
    0: ['approve', 'save'],
    1: ['save', 'create', 'print'],
    2: ['approve', 'save', 'create', 'delete', 'print'],
    3: ['save'],
    4: ['approve', 'print']
  };

  const actionLabels = ['APPROVE', 'SAVE', 'CREATE', 'DELETE', 'PRINT'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000001, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div
        style={{ background: '#ffffff', borderRadius: '24px', width: '900px', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', padding: '12px 32px', color: '#ffffff', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🔐</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em' }}>User Rights — {roleName}</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Granular Permission Matrix (Read-Only View)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '32px', background: 'rgba(255, 255, 255, 0.2)', border: 'none', borderRadius: '10px', width: '32px', height: '32px', color: '#ffffff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '16px 32px', borderBottom: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <div>MENU CATEGORY</div>
            <div style={{ textAlign: 'center' }}>APPROVE</div>
            <div style={{ textAlign: 'center' }}>SAVE</div>
            <div style={{ textAlign: 'center' }}>CREATE</div>
            <div style={{ textAlign: 'center' }}>DELETE</div>
            <div style={{ textAlign: 'center' }}>PRINT</div>
          </div>

          {subMenus.map((menu, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 32px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', opacity: mockPermissions[idx] ? 1 : 0.5 }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}
                onClick={() => setSelectedSubMenu(menu)}
              >
                <span style={{ width: '24px', height: '24px', borderRadius: '8px', background: mockPermissions[idx] ? '#eff6ff' : '#f1f5f9', color: mockPermissions[idx] ? '#3b82f6' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>{idx + 1}</span>
                <span style={{ color: '#1e3a8a' }}>{menu}</span>
              </div>
              {actionLabels.map(label => {
                const isActive = (mockPermissions[idx] || []).includes(label.toLowerCase());
                return (
                  <div key={label} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: isActive ? '#10b981' : '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#fff' : '#cbd5e1',
                      fontSize: '12px',
                      fontWeight: 900
                    }}>
                      {isActive ? '✓' : '•'}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {selectedSubMenu && createPortal(
          <SubMenuViewRightsModal
            title={selectedSubMenu}
            onClose={() => setSelectedSubMenu(null)}
          />,
          document.body
        )}

        {/* Footer */}
        <div style={{ padding: '20px 32px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 600 }}>This is a read-only view. Rights can only be modified in Security Management.</p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// SUB-MENU VIEW (READ-ONLY)
// ========================================

function SubMenuViewRightsModal({ title, onClose }: { title: string; onClose: () => void }) {
  const getSubMenuItems = (menu: string) => {
    if (menu === 'Registration') return ['Application Entry', 'Registration Unit Holders Profiles', 'Unit Holder Accounts', 'Holder Document Handling'];
    if (menu === 'Unit Operation') return ['Unit Fees', 'Unit Creation', 'Unit Redemption', 'Unit Transfer/Switching', 'Unit Consolidation', 'Cheque Re Printing', 'Web Data Downloading', 'Standing Instruction', 'Standing Instruction Processing', 'Bank Slip Transfer', 'Reminders', 'Unit Transfer-Suspense Account', 'Change Agent for Transaction', 'Acknowledgement Printing', 'Fund Price E-Statement', 'Upload and Download Data Web-Automated', 'WHT Per Unit Entry', 'Data Upload', 'Transaction Upload'];
    if (menu === 'Approval') return ['Application Confirmation', 'Application Approval', 'Account Confirmation', 'Account Approval', 'Unit Fee Confirmation', 'Unit Price Approval', 'Transaction Confirmation', 'Transaction Approval', 'Certificate Approval', 'Holder Registration Approval', 'Cheque Clear', 'Dividend Confirmation', 'Standing Instruction Approval', 'Dividend Approval', 'User Role Approval'];
    if (menu === 'Doc Printing') return ['Certificate Print', 'Inquiry on Unit Holders', 'Audit Inquiry', 'WHT Certificate Printing'];
    if (menu === 'Reports') return ['Daily Reports', 'Monthly Reports', 'Quarterly Reports', 'Annual Reports'];
    if (menu === 'Dashboard') return ['Summary', 'Statistics', 'Recent Activities'];
    return ['Bank', 'Transaction Type', 'System calendar', 'Trustees', 'Custodian', 'Postal Area', 'Dividend Type', 'Funds', 'Company', 'Promotional Activity', 'Unit Fee Codes', 'Agency Type', 'Agency', 'Sub Agency', 'Agents', 'Territory', 'Commission Type', 'Commission Level', 'Agent Commission Definition', 'Assign Agent to Commission Definition', 'Institution Category', 'Documents Setup', 'Institution', 'Blocking Category', 'Customer Zone', 'Join Sale Agent', 'Compliance MSG Setup', 'Product Type', 'Title', 'Source of Income', 'Annual Income', 'Risk Category', 'Politically Exposed'];
  };

  const items = getSubMenuItems(title);
  const actionLabels = ['APPROVE', 'SAVE', 'CREATE', 'DELETE', 'PRINT'];

  // Mock permissions for sub-menus
  const mockSubPermissions: Record<number, string[]> = {
    0: ['approve', 'save', 'create', 'delete', 'print'],
    1: ['save', 'create'],
    2: ['approve', 'print']
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000002, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div
        style={{ background: '#ffffff', borderRadius: '24px', width: '800px', maxWidth: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', padding: '12px 28px', color: '#ffffff', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📂</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title} Sub-Menus</h3>
              <p style={{ margin: '1px 0 0 0', fontSize: '10px', opacity: 0.8 }}>Granular permissions for {title} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '12px', right: '28px', background: 'rgba(255, 255, 255, 0.2)', border: 'none', borderRadius: '8px', width: '28px', height: '28px', color: '#ffffff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>

        {/* Content Table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 28px', borderBottom: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <div>SUB-MENU ITEM</div>
            <div style={{ textAlign: 'center' }}>APPROVE</div>
            <div style={{ textAlign: 'center' }}>SAVE</div>
            <div style={{ textAlign: 'center' }}>CREATE</div>
            <div style={{ textAlign: 'center' }}>DELETE</div>
            <div style={{ textAlign: 'center' }}>PRINT</div>
          </div>

          {items.map((item, idx) => {
            const perms = mockSubPermissions[idx % 3] || [];
            return (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '10px 28px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800 }}>{idx + 1}</span>
                  {item}
                </div>
                {actionLabels.map(label => {
                  const isActive = perms.includes(label.toLowerCase());
                  return (
                    <div key={label} style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        background: isActive ? '#10b981' : '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? '#fff' : '#cbd5e1',
                        fontSize: '10px',
                        fontWeight: 900
                      }}>
                        {isActive ? '✓' : '•'}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 48px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            Back to Role Rights
          </button>
        </div>
      </div>
    </div>
  );
}

export default Approval;
