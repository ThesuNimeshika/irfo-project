import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
 

// ========================================
// TYPE DEFINITIONS
// ========================================

interface FormData {
  // Legacy placeholder fields
  bankCode: string;
  description: string;
  address: string;
  district: string;
  swiftCode: string;
  branchNo: string;
  // Application Entry fields
  applicationNo: string;
  applicationStatus: 'Pending' | 'Approved' | 'All';
  applicantType: 'Individual' | 'Corporate' | '';
  title: string;
  initials: string;
  nameByInitials: string;
  surname: string;
  dateOfBirth: string;
  nic: string;
  passport: string;
  otherNo: string;
  compRegNo: string;
  telCode: string;
  telephone: string;
  faxCode: string;
  fax: string;
  mobileCode: string;
  mobile: string;
  email: string;
  tinNo: string;
  nationality: 'Foreign' | 'Local';
  relatedPartyStatus: 'None Related' | 'Related party';
}

// ========================================
// STATIC DATA AND CONFIGURATION
// ========================================

// Four cards data instead of 30
const moduleData = [
  { title: 'Application Entry', icon: '📨' },
  { title: 'Registration Unit Holders Profiles', icon: '📝' },  
  { title: 'Unit Holders Accounts', icon: '👤' }, 
  { title: 'Holder Document Handling', icon: '📂' },   
];

// (Removed tableData; using tabs for Application Entry)

const modules = moduleData.map(m => ({
  title: m.title,
  icon: m.icon,

}));

// Company data for Corporate selection
const companyData = [
  { code: 'C001', description: 'ABC Holdings' },
  { code: 'C002', description: 'XYZ Enterprises' },
  { code: 'C003', description: 'Global Ventures' },
];

// ========================================
// CUSTOM COMPONENTS (Reused from Setup)
// ========================================

// (Table component removed; tabs used instead for Application Entry)

// ========================================
// MAIN FOUR CARDS COMPONENT
// ========================================

function FourCardsWithModal() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [formData, setFormData] = useState<FormData>({
    bankCode: '',
    description: '',
    address: '',
    district: '',
    swiftCode: 'SBLILKLX', // Read-only field
    branchNo: '',
    applicationNo: '',
    applicationStatus: 'All',
    applicantType: '',
    title: '',
    initials: '',
    nameByInitials: '',
    surname: '',
    dateOfBirth: '',
    nic: '',
    passport: '',
    otherNo: '',
    compRegNo: '',
    telCode: '+94',
    telephone: '',
    faxCode: '+94',
    fax: '',
    mobileCode: '+94',
    mobile: '',
    email: '',
    tinNo: '',
    nationality: 'Local',
    relatedPartyStatus: 'None Related',
  });

  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFormEditable, setIsFormEditable] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Personal Details');
  const [showCompanyTable, setShowCompanyTable] = useState(false);
  const applicationTabs = [
    'Personal Details',
    'Address/Bank Details',
    'Office/ Employee details',
    'Other Details',
    'Company other',
    'Notification',
    'Supporting Document Check List',
    'Office Use Details',
  ];

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleResize = () => {
    const width = window.innerWidth;
    setIsMobile(width <= 768);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNewButtonClick = () => {
    setIsFormEditable(true);
    setFormData({
      bankCode: '',
      description: '',
      address: '',
      district: '',
      swiftCode: 'SBLILKLX',
      branchNo: '',
      applicationNo: '',
      applicationStatus: 'All',
      applicantType: '',
      title: '',
      initials: '',
      nameByInitials: '',
      surname: '',
      dateOfBirth: '',
      nic: '',
      passport: '',
      otherNo: '',
      compRegNo: '',
      telCode: '+94',
      telephone: '',
      faxCode: '+94',
      fax: '',
      mobileCode: '+94',
      mobile: '',
      email: '',
      tinNo: '',
      nationality: 'Local',
      relatedPartyStatus: 'None Related',
    });
  };

  const handleModalOpen = (idx: number) => {
    setModalIdx(idx);
    setIsFormEditable(false);
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    alert('Data saved successfully!');
  };

  const handleDelete = () => {
    console.log('Deleting record');
    alert('Record deleted successfully!');
  };

  const handlePrint = () => {
    console.log('Printing data');
    window.print();
  };

  // (Removed table utility functions; tabs are used for content)

  // ========================================
  // MODAL CONTENT RENDERER
  // ========================================

  const renderModalContent = () => {
    if (modalIdx === null) return null;

    const modalTitle = modules[modalIdx].title;

    if (modalTitle === 'Application Entry') {
      return (
        <div className="setup-input-section">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Left: Application No + Search */}
            <div className="setup-ash-box" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label className="setup-input-label" style={{ minWidth: '140px' }}>Application No</label>
                <input
                  type="text"
                  value={formData.applicationNo}
                  onChange={(e) => handleInputChange('applicationNo', e.target.value)}
                  disabled={!isFormEditable}
                  className="setup-input-field"
                  placeholder="Enter application number"
                  style={{ color: '#000000', flex: 1 }}
                />
                <button
                  className="setup-btn setup-btn-new"
                  title="Search"
                  style={{ padding: '8px 12px' }}
                >
                  🔍
                </button>
              </div>

              {/* Compulsory Data Fields + Auto Number */}
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="setup-input-label" style={{ fontWeight: 600 }}>Compulsory Data Fields</div>
                <button
                  className="setup-btn setup-btn-save"
                  disabled={!isFormEditable}
                  style={{ padding: '6px 12px' }}
                >
                  Auto Number
                </button>
              </div>
            </div>

            {/* Right: Status Radio Card */}
            <div className="setup-ash-box" style={{ padding: '16px' }}>
              <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '8px' }}>Status</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                  <input
                    type="radio"
                    name="applicationStatus"
                    checked={formData.applicationStatus === 'Pending'}
                    onChange={() => handleInputChange('applicationStatus', 'Pending')}
                    disabled={!isFormEditable}
                  />
                  <span style={{ color: '#d97706' }}>Pending</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                  <input
                    type="radio"
                    name="applicationStatus"
                    checked={formData.applicationStatus === 'Approved'}
                    onChange={() => handleInputChange('applicationStatus', 'Approved')}
                    disabled={!isFormEditable}
                  />
                  <span style={{ color: '#16a34a' }}>Approved</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                  <input
                    type="radio"
                    name="applicationStatus"
                    checked={formData.applicationStatus === 'All'}
                    onChange={() => handleInputChange('applicationStatus', 'All')}
                    disabled={!isFormEditable}
                  />
                  <span style={{ color: '#334155' }}>All</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default content (kept for other modules if any)
    return (
      <div className="setup-input-section">
        <div className={`setup-input-grid ${isMobile ? 'mobile' : ''}`}>
          <div className="setup-input-group">
            <label className="setup-input-label">Bank Code</label>
            <input
              type="text"
              value={formData.bankCode}
              onChange={(e) => handleInputChange('bankCode', e.target.value)}
              disabled={!isFormEditable}
              className="setup-input-field"
              placeholder="Enter bank code"
            />
          </div>
          <div className="setup-input-group">
            <label className="setup-input-label">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={!isFormEditable}
              className="setup-input-field"
              placeholder="Enter description"
            />
          </div>
        </div>
      </div>
    );
  };

  // ========================================
  // TABS CONTENT RENDERER (Application Entry)
  // ========================================

  const renderApplicationTabContent = () => {
    switch (activeTab) {
      case 'Personal Details':
        return (
          <div className="setup-input-section">
            <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
              {/* Full Name of Applicant Section */}
              <div style={{ marginBottom: '24px' }}>
                <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Full Name of Applicant</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000000' }}>
                    <input
                      type="radio"
                      name="applicantType"
                      checked={formData.applicantType === 'Individual'}
                      onChange={() => handleInputChange('applicantType', 'Individual')}
                      disabled={!isFormEditable}
                      style={{
                        accentColor: '#9333ea',
                        cursor: isFormEditable ? 'pointer' : 'default'
                      }}
                    />
                    Individual
                  </label>
                  {formData.applicantType === 'Individual' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '60px' }}>Title</label>
                        <select
                          className="setup-dropdown-select"
                          style={{ color: '#000000', minWidth: '150px' }}
                          value={formData.title}
                          onChange={e => handleInputChange('title', e.target.value)}
                          disabled={!isFormEditable}
                        >
                          <option value="">Select Title</option>
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Miss">Miss</option>
                          <option value="Dr">Dr</option>
                          <option value="Prof">Prof</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '60px' }}>Initials</label>
                        <input
                          type="text"
                          value={formData.initials}
                          onChange={(e) => handleInputChange('initials', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Enter initials"
                          style={{ color: '#000000', minWidth: '150px' }}
                        />
                        <span style={{ color: '#64748b', fontSize: '12px' }}>Example: K. L. C.</span>
                      </div>
                    </>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000000' }}>
                      <input
                        type="radio"
                        name="applicantType"
                        checked={formData.applicantType === 'Corporate'}
                        onChange={() => handleInputChange('applicantType', 'Corporate')}
                        disabled={!isFormEditable}
                        style={{
                          accentColor: '#9333ea',
                          cursor: isFormEditable ? 'pointer' : 'default'
                        }}
                      />
                      Corporate
                    </label>
                    {formData.applicantType === 'Corporate' && (
                      <div style={{ position: 'relative', width: '100%', minWidth: '600px' }} data-company-table>
                        <div
                          onClick={() => isFormEditable && setShowCompanyTable(!showCompanyTable)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            backgroundColor: '#ffffff',
                            cursor: isFormEditable ? 'pointer' : 'default',
                            color: formData.description ? '#000000' : '#64748b',
                            minHeight: '38px',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px'
                          }}
                        >
                          {formData.description || 'Select company '}
                        </div>
                        {showCompanyTable && isFormEditable && (
                          <div
                            data-company-table
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              marginTop: '4px',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                              zIndex: 1000,
                              maxHeight: '200px',
                              overflowY: 'auto'
                            }}
                          >
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '12px', color: '#0f172a', borderRight: '1px solid #cbd5e1' }}>Code</th>
                                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '12px', color: '#0f172a' }}>Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {companyData.map((company, idx) => (
                                  <tr
                                    key={idx}
                                    onClick={() => {
                                      handleInputChange('description', `${company.code} - ${company.description}`);
                                      setShowCompanyTable(false);
                                    }}
                                    style={{
                                      cursor: 'pointer',
                                      borderBottom: '1px solid #e2e8f0',
                                      backgroundColor: formData.description === `${company.code} - ${company.description}` ? '#f3e8ff' : '#ffffff'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (formData.description !== `${company.code} - ${company.description}`) {
                                        e.currentTarget.style.backgroundColor = '#f8fafc';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (formData.description !== `${company.code} - ${company.description}`) {
                                        e.currentTarget.style.backgroundColor = '#ffffff';
                                      }
                                    }}
                                  >
                                    <td style={{ padding: '8px 12px', fontSize: '13px', color: '#0f172a', borderRight: '1px solid #e2e8f0' }}>{company.code}</td>
                                    <td style={{ padding: '8px 12px', fontSize: '13px', color: '#0f172a' }}>{company.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Name Denoted by Initials and Surname (for Individual) */}
                {formData.applicantType === 'Individual' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                    <div>
                      <label className="setup-input-label">Name Denoted by Initials</label>
                      <input
                        type="text"
                        value={formData.nameByInitials}
                        onChange={(e) => handleInputChange('nameByInitials', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter full name"
                        style={{ color: '#000000' }}
                      />
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Example: Kankanamge Lakshan Chathuranga.</div>
                    </div>
                    <div>
                      <label className="setup-input-label">Surname</label>
                      <input
                        type="text"
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter surname"
                        style={{ color: '#000000' }}
                      />
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Example: Fernando.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Identification and Contact Information Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Left Column - Identification */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="setup-input-label">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      style={{ color: '#000000' }}
                    />
                  </div>
                  <div>
                    <label className="setup-input-label">NIC</label>
                    <input
                      type="text"
                      value={formData.nic}
                      onChange={(e) => handleInputChange('nic', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter NIC"
                      style={{ color: '#000000' }}
                    />
                  </div>
                  <div>
                    <label className="setup-input-label">Passport</label>
                    <input
                      type="text"
                      value={formData.passport}
                      onChange={(e) => handleInputChange('passport', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter passport number"
                      style={{ color: '#000000' }}
                    />
                  </div>
                  <div>
                    <label className="setup-input-label">Other No.</label>
                    <input
                      type="text"
                      value={formData.otherNo}
                      onChange={(e) => handleInputChange('otherNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter other number"
                      style={{ color: '#000000' }}
                    />
                  </div>
                  <div>
                    <label className="setup-input-label">Comp Reg. No</label>
                    <input
                      type="text"
                      value={formData.compRegNo}
                      onChange={(e) => handleInputChange('compRegNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter company registration number"
                      style={{ color: '#000000' }}
                    />
                  </div>
                </div>

                {/* Right Column - Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="setup-input-label">Telephone</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        className="setup-dropdown-select"
                        style={{ color: '#000000', minWidth: '80px' }}
                        value={formData.telCode}
                        onChange={e => handleInputChange('telCode', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="+94">+94</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                      <input
                        type="text"
                        value={formData.telephone}
                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter telephone"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="setup-input-label">Fax</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        className="setup-dropdown-select"
                        style={{ color: '#000000', minWidth: '80px' }}
                        value={formData.faxCode}
                        onChange={e => handleInputChange('faxCode', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="+94">+94</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                      <input
                        type="text"
                        value={formData.fax}
                        onChange={(e) => handleInputChange('fax', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter fax"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="setup-input-label">Mobile</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        className="setup-dropdown-select"
                        style={{ color: '#000000', minWidth: '80px' }}
                        value={formData.mobileCode}
                        onChange={e => handleInputChange('mobileCode', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="+94">+94</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                      <input
                        type="text"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter mobile"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="setup-input-label">E-mail</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter email"
                      style={{ color: '#000000' }}
                    />
                  </div>
                  <div>
                    <label className="setup-input-label">Tin No.</label>
                    <input
                      type="text"
                      value={formData.tinNo}
                      onChange={(e) => handleInputChange('tinNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter TIN number"
                      style={{ color: '#000000' }}
                    />
                  </div>
                </div>
              </div>

              {/* Nationality and Related Party Status Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Nationality</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input
                        type="radio"
                        name="nationality"
                        checked={formData.nationality === 'Foreign'}
                        onChange={() => handleInputChange('nationality', 'Foreign')}
                        disabled={!isFormEditable}
                        style={{
                          accentColor: '#9333ea',
                          cursor: isFormEditable ? 'pointer' : 'default'
                        }}
                      />
                      Foreign
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input
                        type="radio"
                        name="nationality"
                        checked={formData.nationality === 'Local'}
                        onChange={() => handleInputChange('nationality', 'Local')}
                        disabled={!isFormEditable}
                        style={{
                          accentColor: '#9333ea',
                          cursor: isFormEditable ? 'pointer' : 'default'
                        }}
                      />
                      Local
                    </label>
                  </div>
                </div>
                <div>
                  <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Related Party Status</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input
                        type="radio"
                        name="relatedPartyStatus"
                        checked={formData.relatedPartyStatus === 'None Related'}
                        onChange={() => handleInputChange('relatedPartyStatus', 'None Related')}
                        disabled={!isFormEditable}
                        style={{
                          accentColor: '#9333ea',
                          cursor: isFormEditable ? 'pointer' : 'default'
                        }}
                      />
                      None Related
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input
                        type="radio"
                        name="relatedPartyStatus"
                        checked={formData.relatedPartyStatus === 'Related party'}
                        onChange={() => handleInputChange('relatedPartyStatus', 'Related party')}
                        disabled={!isFormEditable}
                        style={{
                          accentColor: '#9333ea',
                          cursor: isFormEditable ? 'pointer' : 'default'
                        }}
                      />
                      Related party
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Address/Bank Details':
        return (
          <div className="setup-input-section">
            <div className={`setup-input-grid ${isMobile ? 'mobile' : ''}`}>
              <div className="setup-input-group">
                <label className="setup-input-label">Address</label>
                <textarea className="setup-input-field" rows={3} placeholder="Enter address" disabled={!isFormEditable} />
              </div>
              <div className="setup-input-group">
                <label className="setup-input-label">Bank</label>
                <input className="setup-input-field" type="text" placeholder="Enter bank" disabled={!isFormEditable} />
              </div>
            </div>
          </div>
        );
      case 'Office/ Employee details':
    return (
          <div className="setup-input-section">
            <div className={`setup-input-grid ${isMobile ? 'mobile' : ''}`}>
              <div className="setup-input-group">
                <label className="setup-input-label">Employee No</label>
                <input className="setup-input-field" type="text" placeholder="Enter employee number" disabled={!isFormEditable} />
              </div>
            </div>
          </div>
        );
      case 'Other Details':
        return <div className="setup-input-section">Other details go here.</div>;
      case 'Company other':
        return <div className="setup-input-section">Company other details go here.</div>;
      case 'Notification':
        return <div className="setup-input-section">Notification settings go here.</div>;
      case 'Supporting Document Check List':
        return <div className="setup-input-section">Supporting documents checklist.</div>;
      case 'Office Use Details':
        return <div className="setup-input-section">Office use details.</div>;
      default:
        return null;
    }
  };

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close company table when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCompanyTable && !target.closest('[data-company-table]')) {
        setShowCompanyTable(false);
      }
    };
    
    if (showCompanyTable) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCompanyTable]);

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
            {/* Four Cards Grid */}
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
            
            {/* Modal */}
            {modalIdx !== null && createPortal(
              <div className={`setup-modal-overlay ${isMobile ? 'mobile' : ''}`}
                onClick={() => setModalIdx(null)}
              >
                <div className={`setup-modal-container ${isMobile ? 'mobile' : ''}`}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="setup-modal-header">
                    <div className="setup-modal-header-content">
                      <span className="setup-modal-header-icon">{modules[modalIdx].icon}</span>
                      <span className="setup-modal-header-title">{modules[modalIdx].title} Details</span>
                    </div>
                    <button
                      onClick={() => setModalIdx(null)}
                      className="setup-modal-close-btn"
                    >
                      ×
                    </button>
                  </div>

                  {/* Content */}
                  <div className="setup-modal-content">
                    {renderModalContent()}

                    {/* Action Buttons */}
                    <div className="setup-action-buttons">
                      <button
                        onClick={handleNewButtonClick}
                        className="setup-btn setup-btn-new"
                      >
                        <span className="setup-btn-icon">+</span>
                        New
                      </button>
                      <button
                        onClick={handleSave}
                        className="setup-btn setup-btn-save"
                        disabled={!isFormEditable}
                      >
                        <span className="setup-btn-icon">💾</span>
                        Save
                      </button>
                      <button
                        onClick={handleDelete}
                        className="setup-btn setup-btn-delete"
                        disabled={!isFormEditable}
                      >
                        <span className="setup-btn-icon">🗑️</span>
                        Delete
                      </button>
                      <button
                        onClick={handlePrint}
                        className="setup-btn setup-btn-print"
                        disabled={!isFormEditable}
                      >
                        <span className="setup-btn-icon">🖨️</span>
                        Print
                      </button>
                      <button
                        onClick={() => setFormData({
                          bankCode: '',
                          description: '',
                          address: '',
                          district: '',
                          swiftCode: 'SBLILKLX',
                          branchNo: '',
                          applicationNo: '',
                          applicationStatus: 'All',
                          applicantType: '',
                          title: '',
                          initials: '',
                          nameByInitials: '',
                          surname: '',
                          dateOfBirth: '',
                          nic: '',
                          passport: '',
                          otherNo: '',
                          compRegNo: '',
                          telCode: '+94',
                          telephone: '',
                          faxCode: '+94',
                          fax: '',
                          mobileCode: '+94',
                          mobile: '',
                          email: '',
                          tinNo: '',
                          nationality: 'Local',
                          relatedPartyStatus: 'None Related',
                        })}
                        className="setup-btn setup-btn-clear"
                        disabled={!isFormEditable}
                      >
                        <span className="setup-btn-icon">🗑️</span>
                        Clear
                      </button>
                    </div>

                    {/* Tabs Section */}
                    <div className="setup-data-table-container">
                      <div className="setup-data-table-content" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {/* Tab Headers */}
                        <div role="tablist" aria-label="Application Entry Tabs" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', marginBottom: '12px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                          {applicationTabs.map(tab => (
                            <div
                              key={tab}
                              role="tab"
                              aria-selected={activeTab === tab}
                              tabIndex={0}
                              onClick={() => setActiveTab(tab)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') setActiveTab(tab);
                              }}
                              style={{
                                padding: '10px 14px',
                                background: activeTab === tab ? '#ffffff' : '#e2e8f0',
                                color: '#0f172a',
                                border: activeTab === tab ? '2px solid #0ea5e9' : '1px solid #cbd5e1',
                                borderBottom: activeTab === tab ? '2px solid #ffffff' : '1px solid #cbd5e1',
                                borderRadius: '6px 6px 0 0',
                                cursor: 'pointer',
                                fontWeight: 600,
                                minHeight: '36px',
                                lineHeight: 1.25,
                                fontSize: '12px',
                                flex: '0 0 auto'
                              }}
                            >
                              {tab}
                            </div>
                          ))}
                        </div>

                        {/* Tab Content */}
                        <div className="setup-ash-box" style={{ padding: '16px' }}>
                          {renderApplicationTabContent()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="setup-modal-footer">
                    Double click to get the selected value
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FourCardsWithModal;