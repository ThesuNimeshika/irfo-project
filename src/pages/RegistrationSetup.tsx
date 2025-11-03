import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
 

// ========================================
// TYPE DEFINITIONS
// ========================================

interface BankAccount {
  bankCode: string;
  accountNo: string;
  accountType: string;
  bankName: string;
}

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
  // Address fields
  correspondenceStreet: string;
  correspondenceTown: string;
  correspondenceCity: string;
  correspondenceDistrict: string;
  correspondenceCountry: string;
  correspondencePostalCode: string;
  correspondencePostalArea: string;
  permanentStreet: string;
  permanentTown: string;
  permanentCity: string;
  permanentDistrict: string;
  permanentCountry: string;
  permanentPostalCode: string;
  permanentPostalArea: string;
  addressType: 'Office' | 'Lease / Rent' | 'Owner';
  otherAddress: string;
  zone: string;
  bank: string;
  accountNo: string;
  accountType: string;
  // Office/Employee details fields
  occupation: string;
  officeName: string;
  officeStreet: string;
  officeTown: string;
  officeCity: string;
  officePostalCode: string;
  officeCountry: string;
  officeTele: string;
  officeFaxNo: string;
  officeEmail: string;
  signature: string;
  // Other Details fields
  married: boolean;
  spouseName: string;
  spouseOccupation: string;
  spouseEmployer: string;
  sourceOfIncome: string;
  annualIncome: string;
  incomeCurrency: string;
  isSubsidiaryAssociate: 'Yes' | 'No';
  ownershipType: 'Subsidiary' | 'Associate';
  organizationName: string;
  contactPersonTitle: string;
  contactPersonInitials: string;
  contactPersonFirstName: string;
  contactPersonSurname: string;
  contactPersonDesignation: string;
  contactPersonAddress: string;
  contactPersonTelephone: string;
  contactPersonFax: string;
  contactPersonEmail: string;
  heardAboutUs: 'Media' | 'Promotion' | 'Referral' | 'Call Centre' | 'Other';
  promotionOther: string;
  // Company other fields - Finance Details
  annualSalesTurnoverCurrent: string;
  annualSalesTurnoverPrevious: string;
  netProfitLossCurrent: string;
  netProfitLossPrevious: string;
  paidUpCapitalAccumulatedProfitCurrent: string;
  paidUpCapitalAccumulatedProfitPrevious: string;
  financialStatementsAvailable: 'Yes' | 'No';
  // Notification fields
  statementDelivery: 'Mail' | 'E-Mail' | 'Both';
  emailNotifyEnabled: boolean;
  emailConfirmInvestment: boolean;
  emailConfirmRedemption: boolean;
  emailUnitBalance: boolean;
  emailDailyUnitPrice: boolean;
  smsNotifyEnabled: boolean;
  smsConfirmInvestment: boolean;
  smsConfirmRedemption: boolean;
  smsUnitBalance: boolean;
  smsDailyUnitPrice: boolean;
}

interface DirectorInfo {
  name: string;
  designation: string;
  nic: string;
  shares: string;
  contactNo: string;
  address: string;
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
    correspondenceStreet: '',
    correspondenceTown: '',
    correspondenceCity: '',
    correspondenceDistrict: '',
    correspondenceCountry: 'Sri Lanka',
    correspondencePostalCode: '',
    correspondencePostalArea: '',
    permanentStreet: '',
    permanentTown: '',
    permanentCity: '',
    permanentDistrict: '',
    permanentCountry: 'Sri Lanka',
    permanentPostalCode: '',
    permanentPostalArea: '',
    addressType: 'Office',
    otherAddress: '',
    zone: '',
    bank: '',
    accountNo: '',
    accountType: '',
    occupation: '',
    officeName: '',
    officeStreet: '',
    officeTown: '',
    officeCity: '',
    officePostalCode: '',
    officeCountry: 'Sri Lanka',
    officeTele: '',
    officeFaxNo: '',
    officeEmail: '',
    signature: '',
    married: false,
    spouseName: '',
    spouseOccupation: '',
    spouseEmployer: '',
    sourceOfIncome: '',
    annualIncome: '',
    incomeCurrency: 'Sri Lanka',
    isSubsidiaryAssociate: 'No',
    ownershipType: 'Subsidiary',
    organizationName: '',
    contactPersonTitle: '',
    contactPersonInitials: '',
    contactPersonFirstName: '',
    contactPersonSurname: '',
    contactPersonDesignation: '',
    contactPersonAddress: '',
    contactPersonTelephone: '',
    contactPersonFax: '',
    contactPersonEmail: '',
    heardAboutUs: 'Media',
    promotionOther: '',
    annualSalesTurnoverCurrent: '0',
    annualSalesTurnoverPrevious: '0',
    netProfitLossCurrent: '0',
    netProfitLossPrevious: '0',
    paidUpCapitalAccumulatedProfitCurrent: '0',
    paidUpCapitalAccumulatedProfitPrevious: '0',
    financialStatementsAvailable: 'No',
    statementDelivery: 'Mail',
    emailNotifyEnabled: false,
    emailConfirmInvestment: false,
    emailConfirmRedemption: false,
    emailUnitBalance: false,
    emailDailyUnitPrice: false,
    smsNotifyEnabled: false,
    smsConfirmInvestment: false,
    smsConfirmRedemption: false,
    smsUnitBalance: false,
    smsDailyUnitPrice: false,
  });

  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFormEditable, setIsFormEditable] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Personal Details');
  const [showCompanyTable, setShowCompanyTable] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [directors, setDirectors] = useState<DirectorInfo[]>([]);
  const [newDirector, setNewDirector] = useState<DirectorInfo>({
    name: '',
    designation: '',
    nic: '',
    shares: '',
    contactNo: '',
    address: ''
  });
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

  const handleCopyAddress = () => {
    setFormData(prev => ({
      ...prev,
      permanentStreet: prev.correspondenceStreet,
      permanentTown: prev.correspondenceTown,
      permanentCity: prev.correspondenceCity,
      permanentDistrict: prev.correspondenceDistrict,
      permanentCountry: prev.correspondenceCountry,
      permanentPostalCode: prev.correspondencePostalCode,
      permanentPostalArea: prev.correspondencePostalArea,
    }));
  };

  const handleAddBankAccount = () => {
    if (formData.bank && formData.accountNo) {
      const newAccount: BankAccount = {
        bankCode: formData.bankCode || '',
        accountNo: formData.accountNo,
        accountType: formData.accountType || '',
        bankName: formData.bank,
      };
      setBankAccounts(prev => [...prev, newAccount]);
      // Clear bank input fields
      handleInputChange('bank', '');
      handleInputChange('accountNo', '');
      handleInputChange('accountType', '');
    }
  };

  const handleRemoveBankAccount = (index: number) => {
    setBankAccounts(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddDirector = () => {
    if (!isFormEditable) return;
    const trimmed: DirectorInfo = {
      name: newDirector.name.trim(),
      designation: newDirector.designation.trim(),
      nic: newDirector.nic.trim(),
      shares: newDirector.shares.trim(),
      contactNo: newDirector.contactNo.trim(),
      address: newDirector.address.trim()
    };
    if (!trimmed.name) return;
    setDirectors(prev => [...prev, trimmed]);
    setNewDirector({ name: '', designation: '', nic: '', shares: '', contactNo: '', address: '' });
  };

  const handleRemoveDirector = (index: number) => {
    if (directors.length > 1) {
      setDirectors(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleNewDirectorChange = (field: keyof DirectorInfo, value: string) => {
    setNewDirector(prev => ({ ...prev, [field]: value }));
  };

  // Signature drawing handlers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isFormEditable || !signatureCanvasRef.current) return;
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isFormEditable || !signatureCanvasRef.current) return;
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const dataURL = canvas.toDataURL('image/png');
      handleInputChange('signature', dataURL);
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!signatureCanvasRef.current) return;
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleInputChange('signature', '');
    }
  };

  // Initialize canvas when signature section is shown
  useEffect(() => {
    if (signatureCanvasRef.current && activeTab === 'Office/ Employee details') {
      const canvas = signatureCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx && formData.signature) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = formData.signature;
      }
    }
  }, [activeTab, formData.signature]);

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
      correspondenceStreet: '',
      correspondenceTown: '',
      correspondenceCity: '',
      correspondenceDistrict: '',
      correspondenceCountry: 'Sri Lanka',
      correspondencePostalCode: '',
      correspondencePostalArea: '',
      permanentStreet: '',
      permanentTown: '',
      permanentCity: '',
      permanentDistrict: '',
      permanentCountry: 'Sri Lanka',
      permanentPostalCode: '',
      permanentPostalArea: '',
      addressType: 'Office',
      otherAddress: '',
      zone: '',
      bank: '',
      accountNo: '',
      accountType: '',
      occupation: '',
      officeName: '',
      officeStreet: '',
      officeTown: '',
      officeCity: '',
      officePostalCode: '',
      officeCountry: 'Sri Lanka',
      officeTele: '',
      officeFaxNo: '',
      officeEmail: '',
      signature: '',
      married: false,
      spouseName: '',
      spouseOccupation: '',
      spouseEmployer: '',
      sourceOfIncome: '',
      annualIncome: '',
      incomeCurrency: 'Sri Lanka',
      isSubsidiaryAssociate: 'No',
      ownershipType: 'Subsidiary',
      organizationName: '',
      contactPersonTitle: '',
      contactPersonInitials: '',
      contactPersonFirstName: '',
      contactPersonSurname: '',
      contactPersonDesignation: '',
      contactPersonAddress: '',
      contactPersonTelephone: '',
      contactPersonFax: '',
      contactPersonEmail: '',
      heardAboutUs: 'Media',
      promotionOther: '',
      annualSalesTurnoverCurrent: '0',
      annualSalesTurnoverPrevious: '0',
      netProfitLossCurrent: '0',
      netProfitLossPrevious: '0',
      paidUpCapitalAccumulatedProfitCurrent: '0',
      paidUpCapitalAccumulatedProfitPrevious: '0',
      financialStatementsAvailable: 'No',
      statementDelivery: 'Mail',
      emailNotifyEnabled: false,
      emailConfirmInvestment: false,
      emailConfirmRedemption: false,
      emailUnitBalance: false,
      emailDailyUnitPrice: false,
      smsNotifyEnabled: false,
      smsConfirmInvestment: false,
      smsConfirmRedemption: false,
      smsUnitBalance: false,
      smsDailyUnitPrice: false,
    });
    setBankAccounts([]);
    setDirectors([{ name: '', designation: '', nic: '', shares: '', contactNo: '', address: '' }]);
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <label className="setup-input-label" style={{ minWidth: '140px' }}>Name Denoted by Initials</label>
                        <input
                          type="text"
                          value={formData.nameByInitials}
                          onChange={(e) => handleInputChange('nameByInitials', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Enter full name"
                          style={{ color: '#000000', flex: 1 }}
                        />
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginLeft: '148px' }}>Example: Kankanamge Lakshan Chathuranga.</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Surname</label>
                        <input
                          type="text"
                          value={formData.surname}
                          onChange={(e) => handleInputChange('surname', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Enter surname"
                          style={{ color: '#000000', flex: 1 }}
                        />
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginLeft: '88px' }}>Example: Fernando.</div>
                    </div>
                  </div>
                )}
                
                {/* Company Name and Business (for Corporate) */}
                {formData.applicantType === 'Corporate' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <label className="setup-input-label" style={{ minWidth: '120px' }}>Company Name</label>
                        <input
                          type="text"
                          value={formData.nameByInitials}
                          onChange={(e) => handleInputChange('nameByInitials', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Enter company name"
                          style={{ color: '#000000', flex: 1 }}
                        />
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginLeft: '128px' }}>Example: Management System (PVT) LTD</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Business</label>
                        <input
                          type="text"
                          value={formData.surname}
                          onChange={(e) => handleInputChange('surname', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Enter business"
                          style={{ color: '#000000', flex: 1 }}
                        />
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginLeft: '88px' }}>Example: Unit Trust</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Identification and Contact Information Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Left Column - Identification */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '140px' }}>
                      {formData.applicantType === 'Corporate' ? 'Commence' : 'Date of Birth'}
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      style={{ 
                        color: '#000000',
                        cursor: isFormEditable ? 'pointer' : 'default',
                        flex: 1,
                        padding: '8px 12px'
                      }}
                      onClick={(e) => {
                        if (isFormEditable && e.currentTarget) {
                          e.currentTarget.showPicker?.();
                        }
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '140px' }}>NIC</label>
                    <input
                      type="text"
                      value={formData.nic}
                      onChange={(e) => handleInputChange('nic', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter NIC"
                      style={{ color: '#000000', flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '140px' }}>Passport</label>
                    <input
                      type="text"
                      value={formData.passport}
                      onChange={(e) => handleInputChange('passport', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter passport number"
                      style={{ color: '#000000', flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '140px' }}>Other No.</label>
                    <input
                      type="text"
                      value={formData.otherNo}
                      onChange={(e) => handleInputChange('otherNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter other number"
                      style={{ color: '#000000', flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '140px' }}>Comp Reg. No</label>
                    <input
                      type="text"
                      value={formData.compRegNo}
                      onChange={(e) => handleInputChange('compRegNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter company registration number"
                      style={{ color: '#000000', flex: 1 }}
                    />
                  </div>
                </div>

                {/* Right Column - Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>Telephone</label>
                    <select
                      className="setup-dropdown-select"
                      style={{ color: '#000000', width: '70px' }}
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
                      style={{ color: '#000000', flex: 1, minWidth: '150px' }}
                      maxLength={10}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>Fax</label>
                    <select
                      className="setup-dropdown-select"
                      style={{ color: '#000000', width: '70px' }}
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
                      style={{ color: '#000000', flex: 1, minWidth: '150px' }}
                      maxLength={10}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>Mobile</label>
                    <select
                      className="setup-dropdown-select"
                      style={{ color: '#000000', width: '70px' }}
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
                      style={{ color: '#000000', flex: 1, minWidth: '150px' }}
                      maxLength={10}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>E-mail</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter email"
                      style={{ color: '#000000', flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>Tin No.</label>
                    <input
                      type="text"
                      value={formData.tinNo}
                      onChange={(e) => handleInputChange('tinNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter TIN number"
                      style={{ color: '#000000', flex: 1 }}
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
            <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
              {/* Two Address Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', marginBottom: '24px', alignItems: 'start' }}>
                {/* Correspondence Address Card */}
                <div className="setup-ash-box" style={{ padding: '16px' }}>
                  <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px', color: '#0ea5e9' }}>
                    Correspondence Address
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Street</label>
                      <input
                        type="text"
                        value={formData.correspondenceStreet}
                        onChange={(e) => handleInputChange('correspondenceStreet', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter street"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Town</label>
                      <input
                        type="text"
                        value={formData.correspondenceTown}
                        onChange={(e) => handleInputChange('correspondenceTown', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter town"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>City</label>
                      <input
                        type="text"
                        value={formData.correspondenceCity}
                        onChange={(e) => handleInputChange('correspondenceCity', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter city"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '80px' }}>District</label>
                        <select
                          className="setup-dropdown-select"
                          style={{ color: '#000000', flex: 1 }}
                          value={formData.correspondenceDistrict}
                          onChange={e => handleInputChange('correspondenceDistrict', e.target.value)}
                          disabled={!isFormEditable}
                        >
                          <option value="">Select District</option>
                          <option value="COLOMBO">COLOMBO</option>
                          <option value="GAMPAHA">GAMPAHA</option>
                          <option value="KALUTARA">KALUTARA</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Country</label>
                        <select
                          className="setup-dropdown-select"
                          style={{ color: '#000000', flex: 1 }}
                          value={formData.correspondenceCountry}
                          onChange={e => handleInputChange('correspondenceCountry', e.target.value)}
                          disabled={!isFormEditable}
                        >
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="India">India</option>
                          <option value="UK">UK</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Postal Code</label>
                        <input
                          type="text"
                          value={formData.correspondencePostalCode}
                          onChange={(e) => handleInputChange('correspondencePostalCode', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Enter postal code"
                          style={{ color: '#000000', flex: 1 }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Postal Area</label>
                        <select
                          className="setup-dropdown-select"
                          style={{ color: '#000000', flex: 1 }}
                          value={formData.correspondencePostalArea}
                          onChange={e => handleInputChange('correspondencePostalArea', e.target.value)}
                          disabled={!isFormEditable}
                        >
                          <option value="">Select Postal Area</option>
                          <option value="Colombo">Colombo</option>
                          <option value="Kandy">Kandy</option>
                          <option value="Galle">Galle</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Copy Button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingTop: '60px' }}>
                  <button
                    onClick={handleCopyAddress}
                    disabled={!isFormEditable}
                    style={{
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: isFormEditable ? 'pointer' : 'default',
                      fontSize: '14px',
                      fontWeight: 600,
                      minWidth: '60px'
                    }}
                  >
                    ==&gt;&gt;
                  </button>
                  <div style={{ color: '#0ea5e9', fontSize: '12px', textAlign: 'center', maxWidth: '100px' }}>
                    Click If Correspondence Address And The Personal Address are the Same
                  </div>
                </div>

                {/* Personal / Permanent Address Card */}
                <div className="setup-ash-box" style={{ padding: '16px' }}>
                  <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px', color: '#0ea5e9' }}>
                    Personal / Permanent Address
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Street</label>
                      <input
                        type="text"
                        value={formData.permanentStreet}
                        onChange={(e) => handleInputChange('permanentStreet', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter street"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Town</label>
                      <input
                        type="text"
                        value={formData.permanentTown}
                        onChange={(e) => handleInputChange('permanentTown', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter town"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>City</label>
                      <input
                        type="text"
                        value={formData.permanentCity}
                        onChange={(e) => handleInputChange('permanentCity', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter city"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '80px' }}>District</label>
                        <select
                          className="setup-dropdown-select"
                          style={{ color: '#000000', flex: 1 }}
                          value={formData.permanentDistrict}
                          onChange={e => handleInputChange('permanentDistrict', e.target.value)}
                          disabled={!isFormEditable}
                        >
                          <option value="">Select District</option>
                          <option value="COLOMBO">COLOMBO</option>
                          <option value="GAMPAHA">GAMPAHA</option>
                          <option value="KALUTARA">KALUTARA</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Country</label>
                        <select
                          className="setup-dropdown-select"
                          style={{ color: '#000000', flex: 1 }}
                          value={formData.permanentCountry}
                          onChange={e => handleInputChange('permanentCountry', e.target.value)}
                          disabled={!isFormEditable}
                        >
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="India">India</option>
                          <option value="UK">UK</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Postal Code</label>
                        <input
                          type="text"
                          value={formData.permanentPostalCode}
                          onChange={(e) => handleInputChange('permanentPostalCode', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Enter postal code"
                          style={{ color: '#000000', flex: 1 }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Postal Area</label>
                        <select
                          className="setup-dropdown-select"
                          style={{ color: '#000000', flex: 1 }}
                          value={formData.permanentPostalArea}
                          onChange={e => handleInputChange('permanentPostalArea', e.target.value)}
                          disabled={!isFormEditable}
                        >
                          <option value="">Select Postal Area</option>
                          <option value="Colombo">Colombo</option>
                          <option value="Kandy">Kandy</option>
                          <option value="Galle">Galle</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left - Additional Details */}
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <label className="setup-input-label" style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                      Additional Details
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                        <input
                          type="radio"
                          name="addressType"
                          checked={formData.addressType === 'Office'}
                          onChange={() => handleInputChange('addressType', 'Office')}
                          disabled={!isFormEditable}
                          style={{
                            accentColor: '#9333ea',
                            cursor: isFormEditable ? 'pointer' : 'default'
                          }}
                        />
                        Office
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                        <input
                          type="radio"
                          name="addressType"
                          checked={formData.addressType === 'Lease / Rent'}
                          onChange={() => handleInputChange('addressType', 'Lease / Rent')}
                          disabled={!isFormEditable}
                          style={{
                            accentColor: '#9333ea',
                            cursor: isFormEditable ? 'pointer' : 'default'
                          }}
                        />
                        Lease / Rent
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                        <input
                          type="radio"
                          name="addressType"
                          checked={formData.addressType === 'Owner'}
                          onChange={() => handleInputChange('addressType', 'Owner')}
                          disabled={!isFormEditable}
                          style={{
                            accentColor: '#9333ea',
                            cursor: isFormEditable ? 'pointer' : 'default'
                          }}
                        />
                        Owner
                      </label>
                    </div>
                    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Other</label>
                      <input
                        type="text"
                        value={formData.otherAddress}
                        onChange={(e) => handleInputChange('otherAddress', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter other"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Zone</label>
                      <select
                        className="setup-dropdown-select"
                        style={{ color: '#000000', flex: 1 }}
                        value={formData.zone}
                        onChange={e => handleInputChange('zone', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="">Select Zone</option>
                        <option value="Zone 1">Zone 1</option>
                        <option value="Zone 2">Zone 2</option>
                        <option value="Zone 3">Zone 3</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right - Bank Details */}
                <div>
                  <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px' }}>
                    Bank Details
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Bank</label>
                      <select
                        className="setup-dropdown-select"
                        style={{ color: '#000000', flex: 1 }}
                        value={formData.bank}
                        onChange={e => handleInputChange('bank', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="">Select Bank</option>
                        <option value="Amana Bank Anuradhapura">Amana Bank Anuradhapura</option>
                        <option value="Commercial Bank">Commercial Bank</option>
                        <option value="People's Bank">People's Bank</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Account No</label>
                      <input
                        type="text"
                        value={formData.accountNo}
                        onChange={(e) => handleInputChange('accountNo', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter account number"
                        style={{ color: '#000000', flex: 1 }}
                      />
                      <button
                        onClick={handleAddBankAccount}
                        disabled={!isFormEditable}
                        style={{
                          backgroundColor: '#a16207',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: isFormEditable ? 'pointer' : 'default',
                          fontSize: '16px',
                          minWidth: '40px',
                          height: '38px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Add Bank Account"
                      >
                        ↓
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Account Type</label>
                      <select
                        className="setup-dropdown-select"
                        style={{ color: '#000000', flex: 1 }}
                        value={formData.accountType}
                        onChange={e => handleInputChange('accountType', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="">Select Account Type</option>
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                        <option value="Fixed Deposit">Fixed Deposit</option>
                      </select>
                    </div>
                  </div>

                  {/* Bank Accounts Table */}
                  <div style={{ marginTop: '16px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1', marginBottom: '12px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                          <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '12px', color: '#0f172a', borderRight: '1px solid #cbd5e1' }}>Bank Code</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '12px', color: '#0f172a', borderRight: '1px solid #cbd5e1' }}>Account No.</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '12px', color: '#0f172a', borderRight: '1px solid #cbd5e1' }}>Account Type</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '12px', color: '#0f172a' }}>Bank Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankAccounts.length === 0 ? (
                          <tr>
                            <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                              No bank accounts added
                            </td>
                          </tr>
                        ) : (
                          bankAccounts.map((account, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '8px 12px', fontSize: '13px', color: '#0f172a', borderRight: '1px solid #e2e8f0' }}>{account.bankCode}</td>
                              <td style={{ padding: '8px 12px', fontSize: '13px', color: '#0f172a', borderRight: '1px solid #e2e8f0' }}>{account.accountNo}</td>
                              <td style={{ padding: '8px 12px', fontSize: '13px', color: '#0f172a', borderRight: '1px solid #e2e8f0' }}>{account.accountType}</td>
                              <td style={{ padding: '8px 12px', fontSize: '13px', color: '#0f172a' }}>{account.bankName}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <button
                      onClick={() => {
                        const selectedIndex = bankAccounts.length > 0 ? bankAccounts.length - 1 : -1;
                        if (selectedIndex >= 0) {
                          handleRemoveBankAccount(selectedIndex);
                        }
                      }}
                      disabled={!isFormEditable || bankAccounts.length === 0}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#dc2626',
                        border: '1px solid #cbd5e1',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: isFormEditable && bankAccounts.length > 0 ? 'pointer' : 'default',
                        fontSize: '13px',
                        fontWeight: 500
                      }}
                    >
                      Remove From List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Office/ Employee details':
        return (
          <div className="setup-input-section">
            <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
              {/* Office Details Section */}
              <div style={{ marginBottom: '24px' }}>
                <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px', color: '#0ea5e9' }}>
                  Office Details
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Row 1: Occupation | Office Name */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Occupation</label>
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter occupation"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Office Name</label>
                      <input
                        type="text"
                        value={formData.officeName}
                        onChange={(e) => handleInputChange('officeName', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter office name"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                  </div>
                  {/* Row 2: Street | Town */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Street</label>
                      <input
                        type="text"
                        value={formData.officeStreet}
                        onChange={(e) => handleInputChange('officeStreet', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter street"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Town</label>
                      <input
                        type="text"
                        value={formData.officeTown}
                        onChange={(e) => handleInputChange('officeTown', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter town"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                  </div>
                  {/* Row 3: City | Postal Code */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>City</label>
                      <input
                        type="text"
                        value={formData.officeCity}
                        onChange={(e) => handleInputChange('officeCity', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter city"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Postal Code</label>
                      <input
                        type="text"
                        value={formData.officePostalCode}
                        onChange={(e) => handleInputChange('officePostalCode', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter postal code"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                  </div>
                  {/* Row 4: Country | Tele. */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Country</label>
                      <select
                        className="setup-dropdown-select"
                        style={{ color: '#000000', flex: 1 }}
                        value={formData.officeCountry}
                        onChange={e => handleInputChange('officeCountry', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="India">India</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Tele.</label>
                      <input
                        type="text"
                        value={formData.officeTele}
                        onChange={(e) => handleInputChange('officeTele', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter telephone"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                  </div>
                  {/* Row 5: Fax No. | E-mail */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Fax No.</label>
                      <input
                        type="text"
                        value={formData.officeFaxNo}
                        onChange={(e) => handleInputChange('officeFaxNo', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter fax number"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>E-mail</label>
                      <input
                        type="email"
                        value={formData.officeEmail}
                        onChange={(e) => handleInputChange('officeEmail', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field"
                        placeholder="Enter email"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '16px' }}>
                <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>
                  Signature
                </div>
                <div style={{ position: 'relative', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff' }}>
                  <canvas
                    ref={signatureCanvasRef}
                    width={800}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      startDrawing(e);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      draw(e);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      stopDrawing();
                    }}
                    style={{
                      width: '100%',
                      height: '200px',
                      cursor: isFormEditable ? 'crosshair' : 'default',
                      display: 'block',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={clearSignature}
                      disabled={!isFormEditable}
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: isFormEditable ? 'pointer' : 'default',
                        fontSize: '12px',
                        fontWeight: 500
                      }}
                      title="Clear Signature"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        // Handle signature upload from PC
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: Event) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file && signatureCanvasRef.current) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = signatureCanvasRef.current;
                                if (canvas) {
                                  const ctx = canvas.getContext('2d');
                                  if (ctx) {
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                    handleInputChange('signature', canvas.toDataURL('image/png'));
                                  }
                                }
                              };
                              img.src = event.target?.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      disabled={!isFormEditable}
                      style={{
                        backgroundColor: '#0ea5e9',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: isFormEditable ? 'pointer' : 'default',
                        fontSize: '16px',
                        fontWeight: 600
                      }}
                      title="Upload Signature from PC"
                    >
                      ...
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Other Details':
        return (
          <div className="setup-input-section">
            <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Personal Customer Applicant Details */}
                  {formData.applicantType === 'Individual' && (
                    <div>
                      <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>
                        If Personal Customer Applicant
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                          <input
                            type="checkbox"
                            checked={formData.married}
                            onChange={(e) => setFormData(prev => ({ ...prev, married: e.target.checked }))}
                            disabled={!isFormEditable}
                            style={{
                              accentColor: '#9333ea',
                              cursor: isFormEditable ? 'pointer' : 'default'
                            }}
                          />
                          Married
                        </label>
                        {formData.married && (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <label className="setup-input-label" style={{ minWidth: '140px' }}>Spouse's Name</label>
                              <input
                                type="text"
                                value={formData.spouseName}
                                onChange={(e) => handleInputChange('spouseName', e.target.value)}
                                disabled={!isFormEditable}
                                className="setup-input-field"
                                placeholder="Enter spouse's name"
                                style={{ color: '#000000', flex: 1 }}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <label className="setup-input-label" style={{ minWidth: '140px' }}>Spouse's Occupation</label>
                              <input
                                type="text"
                                value={formData.spouseOccupation}
                                onChange={(e) => handleInputChange('spouseOccupation', e.target.value)}
                                disabled={!isFormEditable}
                                className="setup-input-field"
                                placeholder="Enter spouse's occupation"
                                style={{ color: '#000000', flex: 1 }}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <label className="setup-input-label" style={{ minWidth: '140px' }}>Spouse's Employer</label>
                              <input
                                type="text"
                                value={formData.spouseEmployer}
                                onChange={(e) => handleInputChange('spouseEmployer', e.target.value)}
                                disabled={!isFormEditable}
                                className="setup-input-field"
                                placeholder="Enter spouse's employer"
                                style={{ color: '#000000', flex: 1 }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Income Details */}
                  <div>
                    <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>
                      Income Details
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '140px' }}>Source of Income</label>
                        <select
                          className="setup-dropdown-select"
                          style={{ color: '#000000', flex: 1 }}
                          value={formData.sourceOfIncome}
                          onChange={e => handleInputChange('sourceOfIncome', e.target.value)}
                          disabled={!isFormEditable}
                        >
                          <option value="">N/A</option>
                          <option value="Salary">Salary</option>
                          <option value="Business">Business</option>
                          <option value="Investment">Investment</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label className="setup-input-label" style={{ minWidth: '120px' }}>Annual Income</label>
                          <input
                            type="text"
                            value={formData.annualIncome}
                            onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                            disabled={!isFormEditable}
                            className="setup-input-field"
                            placeholder="N/A"
                            style={{ color: '#000000', flex: 1 }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label className="setup-input-label" style={{ minWidth: '100px' }}>Currency</label>
                          <select
                            className="setup-dropdown-select"
                            style={{ color: '#000000', flex: 1 }}
                            value={formData.incomeCurrency}
                            onChange={e => handleInputChange('incomeCurrency', e.target.value)}
                            disabled={!isFormEditable}
                          >
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* If Corporate Applicant */}
                  {formData.applicantType === 'Corporate' && (
                    <div className="setup-ash-box" style={{ padding: '16px' }}>
                      <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>
                        If Corporate Applicant
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <label className="setup-input-label" style={{ marginBottom: '8px', display: 'block' }}>
                            Are you a Subsidiary / Associate of another organization?
                          </label>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                              <input
                                type="radio"
                                name="isSubsidiaryAssociate"
                                checked={formData.isSubsidiaryAssociate === 'Yes'}
                                onChange={() => handleInputChange('isSubsidiaryAssociate', 'Yes')}
                                disabled={!isFormEditable}
                                style={{
                                  accentColor: '#9333ea',
                                  cursor: isFormEditable ? 'pointer' : 'default'
                                }}
                              />
                              Yes
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                              <input
                                type="radio"
                                name="isSubsidiaryAssociate"
                                checked={formData.isSubsidiaryAssociate === 'No'}
                                onChange={() => handleInputChange('isSubsidiaryAssociate', 'No')}
                                disabled={!isFormEditable}
                                style={{
                                  accentColor: '#9333ea',
                                  cursor: isFormEditable ? 'pointer' : 'default'
                                }}
                              />
                              No
                            </label>
                          </div>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                          <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '8px' }}>
                            Ownership
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                              <input
                                type="radio"
                                name="ownershipType"
                                checked={formData.ownershipType === 'Subsidiary'}
                                onChange={() => handleInputChange('ownershipType', 'Subsidiary')}
                                disabled={!isFormEditable}
                                style={{
                                  accentColor: '#9333ea',
                                  cursor: isFormEditable ? 'pointer' : 'default'
                                }}
                              />
                              Subsidiary
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                              <input
                                type="radio"
                                name="ownershipType"
                                checked={formData.ownershipType === 'Associate'}
                                onChange={() => handleInputChange('ownershipType', 'Associate')}
                                disabled={!isFormEditable}
                                style={{
                                  accentColor: '#9333ea',
                                  cursor: isFormEditable ? 'pointer' : 'default'
                                }}
                              />
                              Associate
                            </label>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label className="setup-input-label" style={{ minWidth: '100px' }}>Organization</label>
                            <input
                              type="text"
                              value={formData.organizationName}
                              onChange={(e) => handleInputChange('organizationName', e.target.value)}
                              disabled={!isFormEditable}
                              className="setup-input-field"
                              placeholder="Enter organization name"
                              style={{ color: '#000000', flex: 1 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div>
                  {/* Contact Person - Only for Corporate */}
                  {formData.applicantType === 'Corporate' && (
                    <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '24px' }}>
                      <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px' }}>
                        Contact Person
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Row 1: Title | Initials */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label className="setup-input-label" style={{ minWidth: '100px' }}>Title</label>
                            <select
                              className="setup-dropdown-select"
                              style={{ color: '#000000', flex: 1 }}
                              value={formData.contactPersonTitle}
                              onChange={e => handleInputChange('contactPersonTitle', e.target.value)}
                              disabled={!isFormEditable}
                            >
                              <option value="">Select Title</option>
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Miss">Miss</option>
                              <option value="Dr">Dr</option>
                            </select>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label className="setup-input-label" style={{ minWidth: '100px' }}>Initials</label>
                            <input
                              type="text"
                              value={formData.contactPersonInitials}
                              onChange={(e) => handleInputChange('contactPersonInitials', e.target.value)}
                              disabled={!isFormEditable}
                              className="setup-input-field"
                              placeholder="Enter initials"
                              style={{ color: '#000000', flex: 1 }}
                            />
                          </div>
                        </div>
                        {/* Row 2: First Name | Surname */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label className="setup-input-label" style={{ minWidth: '100px' }}>First Name</label>
                            <input
                              type="text"
                              value={formData.contactPersonFirstName}
                              onChange={(e) => handleInputChange('contactPersonFirstName', e.target.value)}
                              disabled={!isFormEditable}
                              className="setup-input-field"
                              placeholder="Enter first name"
                              style={{ color: '#000000', flex: 1 }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label className="setup-input-label" style={{ minWidth: '100px' }}>Surname</label>
                            <input
                              type="text"
                              value={formData.contactPersonSurname}
                              onChange={(e) => handleInputChange('contactPersonSurname', e.target.value)}
                              disabled={!isFormEditable}
                              className="setup-input-field"
                              placeholder="Enter surname"
                              style={{ color: '#000000', flex: 1 }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label className="setup-input-label" style={{ minWidth: '100px' }}>Designation</label>
                          <input
                            type="text"
                            value={formData.contactPersonDesignation}
                            onChange={(e) => handleInputChange('contactPersonDesignation', e.target.value)}
                            disabled={!isFormEditable}
                            className="setup-input-field"
                            placeholder="Enter designation"
                            style={{ color: '#000000', flex: 1 }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label className="setup-input-label" style={{ minWidth: '100px' }}>Address</label>
                          <input
                            type="text"
                            value={formData.contactPersonAddress}
                            onChange={(e) => handleInputChange('contactPersonAddress', e.target.value)}
                            disabled={!isFormEditable}
                            className="setup-input-field"
                            placeholder="Enter address"
                            style={{ color: '#000000', flex: 1 }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label className="setup-input-label" style={{ minWidth: '100px' }}>Telephone</label>
                          <input
                            type="text"
                            value={formData.contactPersonTelephone}
                            onChange={(e) => handleInputChange('contactPersonTelephone', e.target.value)}
                            disabled={!isFormEditable}
                            className="setup-input-field"
                            placeholder="Enter telephone"
                            style={{ color: '#000000', flex: 1 }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label className="setup-input-label" style={{ minWidth: '100px' }}>Fax</label>
                          <input
                            type="text"
                            value={formData.contactPersonFax}
                            onChange={(e) => handleInputChange('contactPersonFax', e.target.value)}
                            disabled={!isFormEditable}
                            className="setup-input-field"
                            placeholder="Enter fax"
                            style={{ color: '#000000', flex: 1 }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label className="setup-input-label" style={{ minWidth: '100px' }}>E-Mail</label>
                          <input
                            type="email"
                            value={formData.contactPersonEmail}
                            onChange={(e) => handleInputChange('contactPersonEmail', e.target.value)}
                            disabled={!isFormEditable}
                            className="setup-input-field"
                            placeholder="Enter email"
                            style={{ color: '#000000', flex: 1 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* How did you hear about us? */}
              <div style={{ marginTop: '24px', borderTop: '1px solid #cbd5e1', paddingTop: '16px' }}>
                <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>
                  How did you hear about us?
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                    <input
                      type="radio"
                      name="heardAboutUs"
                      checked={formData.heardAboutUs === 'Media'}
                      onChange={() => {
                        handleInputChange('heardAboutUs', 'Media');
                        handleInputChange('promotionOther', '');
                      }}
                      disabled={!isFormEditable}
                      style={{
                        accentColor: '#9333ea',
                        cursor: isFormEditable ? 'pointer' : 'default'
                      }}
                    />
                    Media
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                    <input
                      type="radio"
                      name="heardAboutUs"
                      checked={formData.heardAboutUs === 'Promotion'}
                      onChange={() => {
                        handleInputChange('heardAboutUs', 'Promotion');
                        // Keep previously selected promotion option (if any)
                      }}
                      disabled={!isFormEditable}
                      style={{
                        accentColor: '#9333ea',
                        cursor: isFormEditable ? 'pointer' : 'default'
                      }}
                    />
                    Promotion
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                    <input
                      type="radio"
                      name="heardAboutUs"
                      checked={formData.heardAboutUs === 'Referral'}
                      onChange={() => {
                        handleInputChange('heardAboutUs', 'Referral');
                        handleInputChange('promotionOther', '');
                      }}
                      disabled={!isFormEditable}
                      style={{
                        accentColor: '#9333ea',
                        cursor: isFormEditable ? 'pointer' : 'default'
                      }}
                    />
                    Referral
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                    <input
                      type="radio"
                      name="heardAboutUs"
                      checked={formData.heardAboutUs === 'Call Centre'}
                      onChange={() => {
                        handleInputChange('heardAboutUs', 'Call Centre');
                        handleInputChange('promotionOther', '');
                      }}
                      disabled={!isFormEditable}
                      style={{
                        accentColor: '#9333ea',
                        cursor: isFormEditable ? 'pointer' : 'default'
                      }}
                    />
                    Call Centre
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                    <input
                      type="radio"
                      name="heardAboutUs"
                      checked={formData.heardAboutUs === 'Other'}
                      onChange={() => {
                        handleInputChange('heardAboutUs', 'Other');
                        handleInputChange('promotionOther', '');
                      }}
                      disabled={!isFormEditable}
                      style={{
                        accentColor: '#9333ea',
                        cursor: isFormEditable ? 'pointer' : 'default'
                      }}
                    />
                    Other
                  </label>
                  {formData.heardAboutUs === 'Promotion' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Promotion</label>
                      <select
                        className="setup-dropdown-select"
                        style={{ color: '#000000', minWidth: '200px' }}
                        value={formData.promotionOther}
                        onChange={e => handleInputChange('promotionOther', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="">Select Promotion</option>
                        <option value="Online Campaign">Online Campaign</option>
                        <option value="Print Media">Print Media</option>
                        <option value="TV Advertisement">TV Advertisement</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'Company other':
        return (
          <div className="setup-input-section">
            <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
              {/* Finance Details Section */}
              <div style={{ marginBottom: '24px' }}>
                <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px', color: '#0ea5e9' }}>
                  Finance Details
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Header Row with Current Year and Previous Year */}
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: '12px', alignItems: 'center' }}>
                    <div></div>
                    <div className="setup-input-label" style={{ fontWeight: 600, textAlign: 'center' }}>Current Year</div>
                    <div className="setup-input-label" style={{ fontWeight: 600, textAlign: 'center' }}>Previous Year</div>
                  </div>

                  {/* Annual Sales Turnover */}
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: '12px', alignItems: 'center' }}>
                    <label className="setup-input-label" style={{ minWidth: '200px' }}>Annual Sales Turnover</label>
                    <input
                      type="text"
                      value={formData.annualSalesTurnoverCurrent}
                      onChange={(e) => handleInputChange('annualSalesTurnoverCurrent', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="0"
                      style={{ color: '#000000', textAlign: 'center' }}
                    />
                    <input
                      type="text"
                      value={formData.annualSalesTurnoverPrevious}
                      onChange={(e) => handleInputChange('annualSalesTurnoverPrevious', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="0"
                      style={{ color: '#000000', textAlign: 'center' }}
                    />
                  </div>

                  {/* Net Profit/Loss */}
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: '12px', alignItems: 'center' }}>
                    <label className="setup-input-label" style={{ minWidth: '200px' }}>Net Profit/Loss</label>
                    <input
                      type="text"
                      value={formData.netProfitLossCurrent}
                      onChange={(e) => handleInputChange('netProfitLossCurrent', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="0"
                      style={{ color: '#000000', textAlign: 'center' }}
                    />
                    <input
                      type="text"
                      value={formData.netProfitLossPrevious}
                      onChange={(e) => handleInputChange('netProfitLossPrevious', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="0"
                      style={{ color: '#000000', textAlign: 'center' }}
                    />
                  </div>

                  {/* Paid-Up Capital + Accumulated Profit */}
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: '12px', alignItems: 'center' }}>
                    <label className="setup-input-label" style={{ minWidth: '200px' }}>Paid-Up Capital + Accumulated Profit</label>
                    <input
                      type="text"
                      value={formData.paidUpCapitalAccumulatedProfitCurrent}
                      onChange={(e) => handleInputChange('paidUpCapitalAccumulatedProfitCurrent', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="0"
                      style={{ color: '#000000', textAlign: 'center' }}
                    />
                    <input
                      type="text"
                      value={formData.paidUpCapitalAccumulatedProfitPrevious}
                      onChange={(e) => handleInputChange('paidUpCapitalAccumulatedProfitPrevious', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="0"
                      style={{ color: '#000000', textAlign: 'center' }}
                    />
                  </div>

                  {/* Financial Statements Question */}
                  <div style={{ marginTop: '16px' }}>
                    <label className="setup-input-label" style={{ marginBottom: '8px', display: 'block' }}>
                      Are the Financial statements for the last two years available ?
                    </label>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                        <input
                          type="radio"
                          name="financialStatementsAvailable"
                          checked={formData.financialStatementsAvailable === 'Yes'}
                          onChange={() => handleInputChange('financialStatementsAvailable', 'Yes')}
                          disabled={!isFormEditable}
                          style={{
                            accentColor: '#9333ea',
                            cursor: isFormEditable ? 'pointer' : 'default'
                          }}
                        />
                        Yes
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                        <input
                          type="radio"
                          name="financialStatementsAvailable"
                          checked={formData.financialStatementsAvailable === 'No'}
                          onChange={() => handleInputChange('financialStatementsAvailable', 'No')}
                          disabled={!isFormEditable}
                          style={{
                            accentColor: '#9333ea',
                            cursor: isFormEditable ? 'pointer' : 'default'
                          }}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Director/Committee/Governing Body Information Section */}
              <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '16px' }}>
                <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px', color: '#0ea5e9' }}>
                  Director/Committee/Governing Body Information
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Inputs Row (first) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={newDirector.name}
                      onChange={(e) => handleNewDirectorChange('name', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Name"
                      style={{ color: '#000000' }}
                    />
                    <input
                      type="text"
                      value={newDirector.designation}
                      onChange={(e) => handleNewDirectorChange('designation', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Designation"
                      style={{ color: '#000000' }}
                    />
                    <input
                      type="text"
                      value={newDirector.nic}
                      onChange={(e) => handleNewDirectorChange('nic', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="NIC"
                      style={{ color: '#000000' }}
                    />
                    <input
                      type="text"
                      value={newDirector.shares}
                      onChange={(e) => handleNewDirectorChange('shares', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Shares"
                      style={{ color: '#000000' }}
                    />
                    <input
                      type="text"
                      value={newDirector.contactNo}
                      onChange={(e) => handleNewDirectorChange('contactNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Contact No"
                      style={{ color: '#000000' }}
                    />
                    <input
                      type="text"
                      value={newDirector.address}
                      onChange={(e) => handleNewDirectorChange('address', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Address"
                      style={{ color: '#000000' }}
                    />
                    <button
                      onClick={handleAddDirector}
                      disabled={!isFormEditable}
                      style={{
                        backgroundColor: '#fbbf24',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: isFormEditable ? 'pointer' : 'default',
                        fontSize: '16px',
                        fontWeight: 600,
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Add to list"
                    >
                      ↓
                    </button>
                  </div>

                  {/* Table (headers black) */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                          <th style={{ textAlign: 'left', padding: '8px 12px', color: '#000000' }}>Name</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', color: '#000000' }}>Designation</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', color: '#000000' }}>NIC</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', color: '#000000' }}>Shares</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', color: '#000000' }}>Contact No</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', color: '#000000' }}>Address</th>
                          <th style={{ width: '60px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {directors.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ padding: '16px', color: '#64748b', textAlign: 'center' }}>No entries added</td>
                          </tr>
                        ) : (
                          directors.map((d, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '8px 12px', color: '#0f172a' }}>{d.name}</td>
                              <td style={{ padding: '8px 12px', color: '#0f172a' }}>{d.designation}</td>
                              <td style={{ padding: '8px 12px', color: '#0f172a' }}>{d.nic}</td>
                              <td style={{ padding: '8px 12px', color: '#0f172a' }}>{d.shares}</td>
                              <td style={{ padding: '8px 12px', color: '#0f172a' }}>{d.contactNo}</td>
                              <td style={{ padding: '8px 12px', color: '#0f172a' }}>{d.address}</td>
                              <td style={{ padding: '8px 12px' }}>
                                <button
                                  onClick={() => handleRemoveDirector(i)}
                                  disabled={!isFormEditable}
                                  style={{
                                    backgroundColor: '#dc2626',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: isFormEditable ? 'pointer' : 'default',
                                    fontWeight: 600
                                  }}
                                  title="Remove"
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Notification':
        return (
          <div className="setup-input-section">
            <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
              {/* Statement Delivery */}
              <div style={{ marginBottom: '16px' }}>
                <label className="setup-input-label" style={{ fontWeight: 600, marginRight: '16px' }}>
                  How do you wish to receive Statement ?
                </label>
                <label style={{ marginRight: '18px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#000000' }}>
                  <input
                    type="radio"
                    name="statementDelivery"
                    checked={formData.statementDelivery === 'Mail'}
                    onChange={() => handleInputChange('statementDelivery', 'Mail')}
                    disabled={!isFormEditable}
                    style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }}
                  />
                  Mail
                </label>
                <label style={{ marginRight: '18px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#000000' }}>
                  <input
                    type="radio"
                    name="statementDelivery"
                    checked={formData.statementDelivery === 'E-Mail'}
                    onChange={() => handleInputChange('statementDelivery', 'E-Mail')}
                    disabled={!isFormEditable}
                    style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }}
                  />
                  E-Mail
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#000000' }}>
                  <input
                    type="radio"
                    name="statementDelivery"
                    checked={formData.statementDelivery === 'Both'}
                    onChange={() => handleInputChange('statementDelivery', 'Both')}
                    disabled={!isFormEditable}
                    style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }}
                  />
                  Both
                </label>
              </div>

              {/* Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* E-Mail Card */}
                <div className="setup-ash-box" style={{ padding: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#000000', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.emailNotifyEnabled}
                      onChange={(e) => handleInputChange('emailNotifyEnabled', e.target.checked.toString())}
                      disabled={!isFormEditable}
                      style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }}
                    />
                    Send me E-Mail on
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '18px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.emailConfirmInvestment} onChange={(e) => handleInputChange('emailConfirmInvestment', e.target.checked.toString())} disabled={!isFormEditable || !formData.emailNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Investment
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.emailConfirmRedemption} onChange={(e) => handleInputChange('emailConfirmRedemption', e.target.checked.toString())} disabled={!isFormEditable || !formData.emailNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Redemption
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.emailUnitBalance} onChange={(e) => handleInputChange('emailUnitBalance', e.target.checked.toString())} disabled={!isFormEditable || !formData.emailNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Unit Balance - Confirmation
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.emailDailyUnitPrice} onChange={(e) => handleInputChange('emailDailyUnitPrice', e.target.checked.toString())} disabled={!isFormEditable || !formData.emailNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Daily Unit Price
                    </label>
                  </div>
                </div>

                {/* SMS Card */}
                <div className="setup-ash-box" style={{ padding: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#000000', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.smsNotifyEnabled}
                      onChange={(e) => handleInputChange('smsNotifyEnabled', e.target.checked.toString())}
                      disabled={!isFormEditable}
                      style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }}
                    />
                    Send me SMS on
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '18px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.smsConfirmInvestment} onChange={(e) => handleInputChange('smsConfirmInvestment', e.target.checked.toString())} disabled={!isFormEditable || !formData.smsNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Investment
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.smsConfirmRedemption} onChange={(e) => handleInputChange('smsConfirmRedemption', e.target.checked.toString())} disabled={!isFormEditable || !formData.smsNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Redemption
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.smsUnitBalance} onChange={(e) => handleInputChange('smsUnitBalance', e.target.checked.toString())} disabled={!isFormEditable || !formData.smsNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Unit Balance - Confirmation
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.smsDailyUnitPrice} onChange={(e) => handleInputChange('smsDailyUnitPrice', e.target.checked.toString())} disabled={!isFormEditable || !formData.smsNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Daily Unit Price
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
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
                        onClick={() => {
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
                            correspondenceStreet: '',
                            correspondenceTown: '',
                            correspondenceCity: '',
                            correspondenceDistrict: '',
                            correspondenceCountry: 'Sri Lanka',
                            correspondencePostalCode: '',
                            correspondencePostalArea: '',
                            permanentStreet: '',
                            permanentTown: '',
                            permanentCity: '',
                            permanentDistrict: '',
                            permanentCountry: 'Sri Lanka',
                            permanentPostalCode: '',
                            permanentPostalArea: '',
                            addressType: 'Office',
                            otherAddress: '',
                            zone: '',
                            bank: '',
                            accountNo: '',
                            accountType: '',
                            occupation: '',
                            officeName: '',
                            officeStreet: '',
                            officeTown: '',
                            officeCity: '',
                            officePostalCode: '',
                            officeCountry: 'Sri Lanka',
                            officeTele: '',
                            officeFaxNo: '',
                            officeEmail: '',
                            signature: '',
                            married: false,
                            spouseName: '',
                            spouseOccupation: '',
                            spouseEmployer: '',
                            sourceOfIncome: '',
                            annualIncome: '',
                            incomeCurrency: 'Sri Lanka',
                            isSubsidiaryAssociate: 'No',
                            ownershipType: 'Subsidiary',
                            organizationName: '',
                            contactPersonTitle: '',
                            contactPersonInitials: '',
                            contactPersonFirstName: '',
                            contactPersonSurname: '',
                            contactPersonDesignation: '',
                            contactPersonAddress: '',
                            contactPersonTelephone: '',
                            contactPersonFax: '',
                            contactPersonEmail: '',
                            heardAboutUs: 'Media',
                            promotionOther: '',
                            annualSalesTurnoverCurrent: '0',
                            annualSalesTurnoverPrevious: '0',
                            netProfitLossCurrent: '0',
                            netProfitLossPrevious: '0',
                            paidUpCapitalAccumulatedProfitCurrent: '0',
                            paidUpCapitalAccumulatedProfitPrevious: '0',
                            financialStatementsAvailable: 'No',
                            statementDelivery: 'Mail',
                            emailNotifyEnabled: false,
                            emailConfirmInvestment: false,
                            emailConfirmRedemption: false,
                            emailUnitBalance: false,
                            emailDailyUnitPrice: false,
                            smsNotifyEnabled: false,
                            smsConfirmInvestment: false,
                            smsConfirmRedemption: false,
                            smsUnitBalance: false,
                            smsDailyUnitPrice: false,
                          });
                          setBankAccounts([]);
                          setDirectors([{ name: '', designation: '', nic: '', shares: '', contactNo: '', address: '' }]);
                        }}
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
                        {renderApplicationTabContent()}
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