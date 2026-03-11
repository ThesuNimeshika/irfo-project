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
  { title: 'User Rights Approval', icon: '🔐' },
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
  const [viewingRegNo, setViewingRegNo] = useState<string | null>(null);

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

  const handleViewDetails = (regNo: string) => {
    setViewingRegNo(regNo);
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
            {viewingRegNo && createPortal(
              <div className="setup-modal-overlay"
                onClick={() => setViewingRegNo(null)}
                style={{ zIndex: 10001 }} // Higher than main modal
              >
                <div className="setup-modal-container"
                  style={{ width: '1200px', maxWidth: '98vw', height: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="setup-modal-header">
                    <div className="setup-modal-header-content">
                      <span className="setup-modal-header-icon">👁</span>
                      <span className="setup-modal-header-title">Registration Details - {viewingRegNo}</span>
                    </div>
                    <button onClick={() => setViewingRegNo(null)} className="setup-modal-close-btn">×</button>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <RegistrationDetailsView
                      data={{
                        applicantType: 'Individual',
                        title: 'Mr',
                        initials: 'N.',
                        nameByInitials: 'Nimeshika',
                        surname: 'Bandara',
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
                        investorCategory: 'Individual'
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

function ApplicationConfirmationModal({ onViewDetails }: { onViewDetails: (regNo: string) => void }) {
  interface RowData {
    id: number;
    regNo: string;
    name: string;
    nic: string;
    status: 'approved' | 'rejected' | null;
  }

  const [data, setData] = useState<RowData[]>([
    { id: 1, regNo: 'REG001', name: 'Nimeshika Bandara', nic: '199512345678', status: null },
    { id: 2, regNo: 'REG002', name: 'Chaminda Perera', nic: '198822345678', status: 'approved' },
    { id: 3, regNo: 'REG003', name: 'Sajith Rathnayake', nic: '199232345678', status: 'rejected' },
    { id: 4, regNo: 'REG004', name: 'Gayathri Wickramasinghe', nic: '199842345678', status: null },
    { id: 5, regNo: 'REG005', name: 'Ruwan Kumara', nic: '198552345678', status: null },
    { id: 6, regNo: 'REG006', name: 'Ishara Madushanka', nic: '199162345678', status: 'approved' },
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
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '15%' }}>RegNo</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '25%' }}>Name</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '20%' }}>NIC</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '25%' }}>Status</th>
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
                <button
                  onClick={() => onViewDetails(row.regNo)}
                  style={{
                    padding: '8px 16px',
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
                    gap: '6px'
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

function ApplicationApprovalModal({ onViewDetails }: { onViewDetails: (regNo: string) => void }) {
  interface RowData {
    id: number;
    regNo: string;
    name: string;
    nic: string;
    status: 'approved' | 'rejected' | null;
  }

  const [data, setData] = useState<RowData[]>([
    { id: 1, regNo: 'REG001', name: 'Nimeshika Bandara', nic: '199512345678', status: null },
    { id: 2, regNo: 'REG002', name: 'Chaminda Perera', nic: '198822345678', status: 'approved' },
    { id: 3, regNo: 'REG003', name: 'Sajith Rathnayake', nic: '199232345678', status: 'rejected' },
    { id: 4, regNo: 'REG004', name: 'Gayathri Wickramasinghe', nic: '199842345678', status: null },
    { id: 5, regNo: 'REG005', name: 'Ruwan Kumara', nic: '198552345678', status: null },
    { id: 6, regNo: 'REG006', name: 'Ishara Madushanka', nic: '199162345678', status: 'approved' },
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
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '15%' }}>RegNo</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '25%' }}>Name</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '20%' }}>NIC</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '25%' }}>Status</th>
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
                <button
                  onClick={() => onViewDetails(row.regNo)}
                  style={{
                    padding: '8px 16px',
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
                    gap: '6px'
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

export default Approval;
