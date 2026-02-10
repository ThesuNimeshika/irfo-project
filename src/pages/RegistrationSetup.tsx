import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UserSearchModal from '../components/UserSearchModal';
import AccountSearchModal from '../components/AccountSearchModal';
import '../App.css';
import '../Setup.css';
import '../RegistrationSetup.css';
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
  webRegistration: string;
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
  // Office Use Details
  investmentTypeAtRegistration: string;
  officeAgency: string; // display string "code - name"
  officeSubAgency: string;
  officeAgent: string;
  investorCategory: string;
  verifyingOfficer: string;
  inputOfficer: string;
  authorizedOfficer: string;
  // Unit Holders Accounts (top card)
  ackNo: string;
  // Unit Holders Accounts Details tab
  fund: string;
  lastInvestmentNo: string;
  accountNo: string;
  isActive: boolean;
  holderId: string;
  accCreatedOn: string;
  accountHolderType: 'Individual' | 'Joint' | 'Guardian';
  individualInput: string;
  jointHolderInput: string;
  guardianInput: string;
  rightInput: string;
  accountOperate: 'Either Party' | 'Jointly' | '';
  reinvestPayout: 'Reinvest' | 'Payout';
  reinvestToDifferentAccount: boolean;
  reinvestFund: string;
  reinvestAccountNo: string;
  paymentType: string;
  payoutBank: string;
  payoutAccountNo: string;
  payee: string;
  nomineeInput: string;
  nomineeRightInput: string;
  // Unit Holders Accounts Bank Details tab
  bankDetailsPaymentType: string;
  bankDetailsBank: string;
  bankDetailsAccountNo: string;
  bankDetailsAccountName: string;
  bankDetailsPayee: string;
  // Holder Document Handling
  documentCode: string;
  document: string;
  documentInput: string;
  documentType: string;
}

interface DirectorInfo {
  name: string;
  designation: string;
  nic: string;
  shares: string;
  contactNo: string;
  address: string;
}

interface SupportingDoc {
  code: string;
  name: string;
  selected: boolean;
  receiveDate: string; // ISO yyyy-mm-dd
  user: string;
}

interface HolderInfo {
  holderNo: string;
  holderName: string;
  selected?: boolean;
}

interface ExistingAccount {
  accountNo: string;
  fundName: string;
  productType: string;
  accType: string;
  active: string;
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
const branchData = [
  { code: 'BR001', description: 'Colombo Main Branch' },
  { code: 'BR002', description: 'Kandy Branch' },
  { code: 'BR003', description: 'Galle Branch' }
];
// Company data for Corporate selection
const companyData = [
  { code: 'C001', description: 'ABC Holdings' },
  { code: 'C002', description: 'XYZ Enterprises' },
  { code: 'C003', description: 'Global Ventures' },
];

// Fund data for dropdowns
const fundData = [
  { code: 'F001', name: 'Equity Fund' },
  { code: 'F002', name: 'Bond Fund' },
  { code: 'F003', name: 'Mixed Fund' },
];

// Payment Type data
const paymentTypeData = [
  { code: 'PT001', name: 'Bank Transfer' },
  { code: 'PT002', name: 'Cheque' },
  { code: 'PT003', name: 'Cash' },
];

// Bank data for payout
const bankData = [
  { code: 'B001', name: 'Bank of Ceylon', district: 'Colombo' },
  { code: 'B002', name: 'Sampath Bank', district: 'Colombo' },
  { code: 'B003', name: 'Commercial Bank', district: 'Kandy' },
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
    accountNo: '', // For bank accounts
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
    webRegistration: '',
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
    investmentTypeAtRegistration: '',
    officeAgency: '',
    officeSubAgency: '',
    officeAgent: '',
    investorCategory: '',
    verifyingOfficer: '',
    inputOfficer: '',
    authorizedOfficer: '',
    ackNo: '',
    // Unit Holders Accounts Details tab
    fund: '',
    lastInvestmentNo: '',
    // accountNo is already defined above for bank accounts, reused here
    isActive: true,
    holderId: '',
    accCreatedOn: '',
    accountHolderType: 'Individual',
    individualInput: '',
    jointHolderInput: '',
    guardianInput: '',
    rightInput: '',
    accountOperate: '',
    reinvestPayout: 'Reinvest',
    reinvestToDifferentAccount: false,
    reinvestFund: '',
    reinvestAccountNo: '',
    paymentType: '',
    payoutBank: '',
    payoutAccountNo: '',
    payee: '',
    nomineeInput: '',
    nomineeRightInput: '',
    // Unit Holders Accounts Bank Details tab
    bankDetailsPaymentType: '',
    bankDetailsBank: '',
    bankDetailsAccountNo: '',
    bankDetailsAccountName: '',
    bankDetailsPayee: '',
    // Holder Document Handling
    documentCode: '',
    document: '',
    documentInput: '',
    documentType: '',
  });
  const [showBranchTable, setShowBranchTable] = useState(false);
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

  const defaultSupportingDocs: SupportingDoc[] = [
    { code: '20', name: 'A copy of Business registration certificate', selected: false, receiveDate: '', user: '' },
    { code: '21', name: 'Address Verification', selected: false, receiveDate: '', user: '' },
    { code: '22', name: 'Letter of Authorized Signatory', selected: false, receiveDate: '', user: '' },
    { code: '23', name: 'Board Resolution', selected: false, receiveDate: '', user: '' },
    { code: '24', name: 'Directors NIC copies', selected: false, receiveDate: '', user: '' },
  ];
  const [supportingDocs, setSupportingDocs] = useState<SupportingDoc[]>(defaultSupportingDocs);

  // Office Use Details - sample data and UI state
  const agencyData = [
    { code: 'A01', name: 'Thilina Withanage' },
    { code: 'A02', name: 'Dinesh Perera' },
  ];
  const subAgencyData = [
    { code: 'S01', name: 'Colombo Branch' },
    { code: 'S02', name: 'Kandy Branch' },
  ];
  const agentData = [
    { code: 'AG01', name: 'Kasun Priyantha' },
    { code: 'AG02', name: 'Nimali Fernando' },
  ];
  const [showAgencyTable, setShowAgencyTable] = useState(false);
  const [showSubAgencyTable, setShowSubAgencyTable] = useState(false);
  const [showAgentTable, setShowAgentTable] = useState(false);
  const [accountsActiveTab, setAccountsActiveTab] = useState<string>('Details');
  const [accountHolderDetailsTab, setAccountHolderDetailsTab] = useState<string>('Joint Account Details');
  const [jointHolders, setJointHolders] = useState<HolderInfo[]>([]);
  const [nomineeHolders, setNomineeHolders] = useState<HolderInfo[]>([]);
  const [showFundTable, setShowFundTable] = useState(false);
  const [showReinvestFundTable, setShowReinvestFundTable] = useState(false);
  const [showPaymentTypeTable, setShowPaymentTypeTable] = useState(false);
  const [showPayoutBankTable, setShowPayoutBankTable] = useState(false);
  const [showBankDetailsPaymentTypeTable, setShowBankDetailsPaymentTypeTable] = useState(false);
  const [showBankDetailsBankTable, setShowBankDetailsBankTable] = useState(false);
  const [bankDetailsAccounts, setBankDetailsAccounts] = useState<BankAccount[]>([]);
  const [existingAccounts, setExistingAccounts] = useState<ExistingAccount[]>([]);
  const [documentZoomLevel, setDocumentZoomLevel] = useState<string>('100%');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isUnitHoldersSearchModalOpen, setIsUnitHoldersSearchModalOpen] = useState<boolean>(false);
  const [isNomineeSearchModalOpen, setIsNomineeSearchModalOpen] = useState<boolean>(false);
  const [isJointHolderSearchModalOpen, setIsJointHolderSearchModalOpen] = useState<boolean>(false);
  const [isGuardianSearchModalOpen, setIsGuardianSearchModalOpen] = useState<boolean>(false);
  const [isRegistrationProfilesSearchModalOpen, setIsRegistrationProfilesSearchModalOpen] = useState<boolean>(false);
  const [isAccountSearchModalOpen, setIsAccountSearchModalOpen] = useState<boolean>(false);
  const [isReinvestAccountSearchModalOpen, setIsReinvestAccountSearchModalOpen] = useState<boolean>(false);
  const [showApplicationNoTable, setShowApplicationNoTable] = useState<boolean>(false);
  
  // Sorting state for all dropdown tables
  const [tableSorting, setTableSorting] = useState<Record<string, { column: string; direction: 'asc' | 'desc' }>>({});
  
  // Helper function to handle table sorting
  const handleTableSort = (tableName: string, column: string) => {
    const currentSort = tableSorting[tableName];
    const direction = currentSort?.column === column && currentSort?.direction === 'asc' ? 'desc' : 'asc';
    
    setTableSorting(prev => ({
      ...prev,
      [tableName]: { column, direction }
    }));
  };
  
  // Helper function to get sorted data
  const getSortedData = <T extends Record<string, unknown>>(tableName: string, data: T[]): T[] => {
    const sort = tableSorting[tableName];
    if (!sort) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sort.column] || '';
      const bVal = b[sort.column] || '';
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: 'base' });
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  };
  
  // Helper function to render sort indicator
  const renderSortIndicator = (tableName: string, column: string) => {
    const sort = tableSorting[tableName];
    if (sort?.column !== column) return ' ↕️';
    return sort.direction === 'asc' ? ' ↑' : ' ↓';
  };
  
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

  const handleInputChange = (field: string, value: string | boolean) => {
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
      webRegistration: '',
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
      investmentTypeAtRegistration: '',
      officeAgency: '',
      officeSubAgency: '',
      officeAgent: '',
      investorCategory: '',
      verifyingOfficer: '',
      inputOfficer: '',
      authorizedOfficer: '',
      ackNo: '',
      // Unit Holders Accounts Details tab
      fund: '',
      lastInvestmentNo: '',
      accountNo: '',
      isActive: true,
      holderId: '',
      accCreatedOn: '',
      accountHolderType: 'Individual',
      individualInput: '',
      jointHolderInput: '',
      guardianInput: '',
      rightInput: '',
      accountOperate: '',
      reinvestPayout: 'Reinvest',
      reinvestToDifferentAccount: false,
      reinvestFund: '',
      reinvestAccountNo: '',
      paymentType: '',
      payoutBank: '',
      payoutAccountNo: '',
      payee: '',
      nomineeInput: '',
      nomineeRightInput: '',
      // Unit Holders Accounts Bank Details tab
      bankDetailsPaymentType: '',
      bankDetailsBank: '',
      bankDetailsAccountNo: '',
      bankDetailsAccountName: '',
      bankDetailsPayee: '',
      // Holder Document Handling
      documentCode: '',
      document: '',
      documentInput: '',
      documentType: '',
    });
    setBankAccounts([]);
    setDirectors([{ name: '', designation: '', nic: '', shares: '', contactNo: '', address: '' }]);
    setSupportingDocs(defaultSupportingDocs);
    setBankDetailsAccounts([]);
    setExistingAccounts([]);
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
          <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: '16px', alignItems: 'start' }}>
            {/* Left: Application No Card (70%) */}
            <div className="setup-ash-box" style={{ padding: '16px' }}>
              {/* One row: Application No + input + button | Compulsory Data Fields | Auto Number */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', alignItems: 'center' }}>
                {/* Column 1: Application No + Input + Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="setup-input-label" style={{ minWidth: '120px' }}>Application No</label>
                <input
                  type="text"
                  value={formData.applicationNo}
                  onChange={(e) => handleInputChange('applicationNo', e.target.value)}
                  disabled={!isFormEditable}
                  className="setup-input-field"
                  placeholder="Enter application number"
                    style={{ color: '#000000', width: '33%', minWidth: '140px' }}
                />
                <div style={{ position: 'relative' }}>
                  <button
                    className="setup-btn setup-btn-new"
                    title="Select Application"
                    style={{ padding: '8px 12px' }}
                    onClick={() => isFormEditable && setShowApplicationNoTable(!showApplicationNoTable)}
                    disabled={!isFormEditable}
                  >
                    +
                  </button>
                  {showApplicationNoTable && isFormEditable && (
                    <div 
                      data-table="applicationNo"
                      style={{ 
                        position: 'absolute', 
                        top: '100%', 
                          left: 0,
                        right: 0,
                        backgroundColor: '#ffffff', 
                        border: '1px solid #cbd5e1', 
                        borderRadius: '4px', 
                        marginTop: '4px', 
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                        zIndex: 1000, 
                        maxHeight: '400px',
                        height: '400px',
                        overflowY: 'auto', 
                          overflowX: 'auto',
                          minWidth: '50vw',
                          width: '50vw',
                          maxWidth: '50vw'
                      }}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', zIndex: 10 }}>
                          <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                              <th 
                                style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => handleTableSort('applicationNo', 'appNo')}
                              >
                                Application No{renderSortIndicator('applicationNo', 'appNo')}
                              </th>
                              <th 
                                style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => handleTableSort('applicationNo', 'approved')}
                              >
                                Approved{renderSortIndicator('applicationNo', 'approved')}
                              </th>
                              <th 
                                style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => handleTableSort('applicationNo', 'name')}
                              >
                                Name{renderSortIndicator('applicationNo', 'name')}
                              </th>
                              <th 
                                style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => handleTableSort('applicationNo', 'regNo')}
                              >
                                Registration_No{renderSortIndicator('applicationNo', 'regNo')}
                              </th>
                              <th 
                                style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => handleTableSort('applicationNo', 'street')}
                              >
                                Street{renderSortIndicator('applicationNo', 'street')}
                              </th>
                              <th 
                                style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => handleTableSort('applicationNo', 'town')}
                              >
                                Town{renderSortIndicator('applicationNo', 'town')}
                              </th>
                              <th 
                                style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => handleTableSort('applicationNo', 'city')}
                              >
                                City{renderSortIndicator('applicationNo', 'city')}
                              </th>
                              <th 
                                style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => handleTableSort('applicationNo', 'status')}
                              >
                                Status{renderSortIndicator('applicationNo', 'status')}
                              </th>
                          </tr>
                        </thead>
                        <tbody>
                            {getSortedData('applicationNo', Array.from({ length: 50 }).map((_, i) => ({
                            appNo: `APP${String(i + 1).padStart(3, '0')}`,
                            approved: i % 2 === 0 ? 'Yes' : 'No',
                            name: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'][i % 5],
                            regNo: `REG${String(i + 1).padStart(3, '0')}`,
                            street: ['Main Street', 'Park Avenue', 'Ocean Drive', 'First Street', 'Second Street'][i % 5],
                            town: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'][i % 5],
                            city: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'][i % 5],
                            status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive',
                            }))).map((item, idx) => (
                            <tr
                              key={idx}
                              onClick={() => {
                                handleInputChange('applicationNo', item.appNo);
                                setShowApplicationNoTable(false);
                              }}
                              style={{
                                cursor: 'pointer',
                                borderBottom: '1px solid #e2e8f0',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                              }}
                            >
                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{item.appNo}</td>
                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{item.approved}</td>
                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{item.name}</td>
                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{item.regNo}</td>
                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{item.street}</td>
                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{item.town}</td>
                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{item.city}</td>
                              <td style={{ padding: '8px 12px', color: '#000000' }}>{item.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

                {/* Column 2: Compulsory Data Fields */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="registration-setup-compulsory-data-fields-note">Compulsory Data Fields</div>
                </div>

                {/* Column 3: Auto Number Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <button
                  className="setup-btn setup-btn-save"
                  disabled={!isFormEditable}
                    style={{ padding: '6px 12px', whiteSpace: 'nowrap' }}
                >
                  Auto Number
                </button>
                </div>
              </div>
            </div>

            {/* Right: Status Radio Card (30%) */}
            <div className="setup-ash-box" style={{ padding: '16px' }}>
              {/* Status title and radios in same row with gap */}
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div className="setup-input-label" style={{ fontWeight: 600, margin: 0 }}>Status</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000000' }}>
                  <input
                    type="radio"
                    name="applicationStatus"
                    checked={formData.applicationStatus === 'Pending'}
                    onChange={() => handleInputChange('applicationStatus', 'Pending')}
                    disabled={!isFormEditable}
                  />
                  <span style={{ color: '#d97706' }}>Pending</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000000' }}>
                  <input
                    type="radio"
                    name="applicationStatus"
                    checked={formData.applicationStatus === 'Approved'}
                    onChange={() => handleInputChange('applicationStatus', 'Approved')}
                    disabled={!isFormEditable}
                  />
                  <span style={{ color: '#16a34a' }}>Approved</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000000' }}>
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
    
    if (modalTitle === 'Registration Unit Holders Profiles') {
      return (
        <div className="setup-input-section">
          {/* Top: Registration No + Search + Compulsory Data Fields remark */}
          <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label className="setup-input-label" style={{ minWidth: '140px' }}>Registration No</label>
              <input
                type="text"
                value={formData.applicationNo}
                onChange={(e) => handleInputChange('applicationNo', e.target.value)}
                disabled={!isFormEditable}
                className="setup-input-field"
                placeholder="Enter registration number"
                style={{ color: '#000000', flex: 0.375 }}
              />
              <button 
                className="setup-btn setup-btn-new" 
                title="Search" 
                style={{ padding: '8px 12px' }}
                onClick={() => setIsRegistrationProfilesSearchModalOpen(true)}
                disabled={!isFormEditable}
              >🔍</button>
              <span className="registration-setup-compulsory-data-fields-note" style={{ marginLeft: '12px' }}>
                Compulsory Data Fields
              </span>
            </div>
          </div>

          {/* Search Modal for Registration Unit Holders Profiles */}
          <UserSearchModal
            isOpen={isRegistrationProfilesSearchModalOpen}
            onClose={() => setIsRegistrationProfilesSearchModalOpen(false)}
            onGet={(result) => {
              if (result.holderId) {
                handleInputChange('applicationNo', result.holderId);
              }
              setIsRegistrationProfilesSearchModalOpen(false);
            }}
            title="Search Registration"
          />
        </div>
      );
    }

    if (modalTitle === 'Unit Holders Accounts') {
      return (
        <div className="setup-input-section">
          {/* Top card: Registration No + Search + ACKNO - Fixed */}
          <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '2px', position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              {/* Left Column: Reduced width - Registration No label + input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: 'auto', flex: '0 0 auto' }}>
              <label className="setup-input-label" style={{ minWidth: '120px' }}>Registration No</label>
              <input
                type="text"
                value={formData.applicationNo}
                onChange={(e) => handleInputChange('applicationNo', e.target.value)}
                disabled={!isFormEditable}
                className="setup-input-field"
                placeholder="Enter registration number"
                style={{ color: '#000000', width: '200px', minWidth: '200px' }}
              />
              </div>
              {/* Right Column: Reduced width - Search button + ACKNO label + input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: 'auto', flex: '0 0 auto' }}>
                <button 
                  className="setup-btn setup-btn-new" 
                  title="Search" 
                  style={{ padding: '8px 16px', minWidth: '50px', width: 'auto' }}
                  onClick={() => setIsUnitHoldersSearchModalOpen(true)}
                  disabled={!isFormEditable}
                >🔍</button>
                <label className="setup-input-label" style={{ minWidth: '70px' }}>ACKNO</label>
              <input
                type="text"
                value={formData.ackNo}
                onChange={(e) => handleInputChange('ackNo', e.target.value)}
                disabled={!isFormEditable}
                className="setup-input-field"
                placeholder="ACKNO"
                  style={{ color: '#000000', width: '220px', minWidth: '220px' }}
              />
            </div>
          </div>
          </div>

          {/* Search Modals for Unit Holders Accounts */}
          <UserSearchModal
            isOpen={isUnitHoldersSearchModalOpen}
            onClose={() => setIsUnitHoldersSearchModalOpen(false)}
            onGet={(result) => {
              if (result.holderId) {
                handleInputChange('applicationNo', result.holderId);
              }
              setIsUnitHoldersSearchModalOpen(false);
            }}
            title="Search Registration"
          />
          <UserSearchModal
            isOpen={isNomineeSearchModalOpen}
            onClose={() => setIsNomineeSearchModalOpen(false)}
            onGet={(result) => {
              if (result.holderId || result.holderName) {
                handleInputChange('nomineeInput', result.holderName || result.holderId || '');
              }
              setIsNomineeSearchModalOpen(false);
            }}
            title="Search Nominee"
          />
          <UserSearchModal
            isOpen={isJointHolderSearchModalOpen}
            onClose={() => setIsJointHolderSearchModalOpen(false)}
            onGet={(result) => {
              if (result.holderId || result.holderName) {
                handleInputChange('jointHolderInput', result.holderName || result.holderId || '');
              }
              setIsJointHolderSearchModalOpen(false);
            }}
            title="Search Joint Holder"
          />
          <UserSearchModal
            isOpen={isGuardianSearchModalOpen}
            onClose={() => setIsGuardianSearchModalOpen(false)}
            onGet={(result) => {
              if (result.holderId || result.holderName) {
                handleInputChange('guardianInput', result.holderName || result.holderId || '');
              }
              setIsGuardianSearchModalOpen(false);
            }}
            title="Search Guardian"
          />
          <AccountSearchModal
            isOpen={isAccountSearchModalOpen}
            onClose={() => setIsAccountSearchModalOpen(false)}
            onGet={(result) => {
              if (result.accountNo) {
                handleInputChange('reinvestAccountNo', result.accountNo);
              }
              setIsAccountSearchModalOpen(false);
            }}
            title="Search Account"
          />
          <UserSearchModal
            isOpen={isReinvestAccountSearchModalOpen}
            onClose={() => setIsReinvestAccountSearchModalOpen(false)}
            onGet={(result) => {
              if (result.holderId) {
                handleInputChange('reinvestAccountNo', result.holderId);
              }
              setIsReinvestAccountSearchModalOpen(false);
            }}
            title="Search Registration"
          />
        </div>
      );
    }

    if (modalTitle === 'Holder Document Handling') {
      return (
        <div className="setup-input-section" style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', boxShadow: 'none', padding: 0 }}>
          {/* White Background Wrapper - Contains all content */}
          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
            {/* Top Control Bar */}
            <div className="setup-ash-box" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                {/* Column 1: Registration No */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                  <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>Registration No</label>
                  <input
                    type="text"
                    value={formData.applicationNo}
                    onChange={(e) => handleInputChange('applicationNo', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter registration number"
                    style={{ color: '#000000', flex: 1 }}
                  />
                </div>
                {/* Column 2: Search button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                  <button
                    className="setup-btn"
                    title="Search"
                    onClick={() => setIsSearchModalOpen(true)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      cursor: isFormEditable ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '40px'
                    }}
                    disabled={!isFormEditable}
                  >
                    <span style={{ color: '#000000', fontSize: '16px' }}>🔍</span>
                  </button>
                </div>
                {/* Column 3: Another input field */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                  <input
                    type="text"
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder=""
                    style={{ color: '#000000', flex: 1 }}
                  />
                </div>
                {/* Column 4: Zoom Level */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                  <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>Zoom Level</label>
                  <select
                    value={documentZoomLevel}
                    onChange={(e) => setDocumentZoomLevel(e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-dropdown-select"
                    style={{ color: '#000000', flex: 1 }}
                  >
                    <option value="50%">50%</option>
                    <option value="75%">75%</option>
                    <option value="100%">100%</option>
                    <option value="125%">125%</option>
                    <option value="150%">150%</option>
                    <option value="200%">200%</option>
                  </select>
                </div>
              </div>
            </div>
            {/* End of Top Control Bar ash-box */}

            {/* Button Palette */}
            <div className="setup-action-buttons" style={{ marginBottom: '12px' }}>
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
                  webRegistration: '',
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
                  investmentTypeAtRegistration: '',
                  officeAgency: '',
                  officeSubAgency: '',
                  officeAgent: '',
                  investorCategory: '',
                  verifyingOfficer: '',
                  inputOfficer: '',
                  authorizedOfficer: '',
                  ackNo: '',
                  // Unit Holders Accounts Details tab
                  fund: '',
                  lastInvestmentNo: '',
                  accountNo: '',
                  isActive: true,
                  holderId: '',
                  accCreatedOn: '',
                  accountHolderType: 'Individual',
                  individualInput: '',
                  jointHolderInput: '',
                  guardianInput: '',
                  rightInput: '',
                  accountOperate: '',
                  reinvestPayout: 'Reinvest',
                  reinvestToDifferentAccount: false,
                  reinvestFund: '',
                  reinvestAccountNo: '',
                  paymentType: '',
                  payoutBank: '',
                  payoutAccountNo: '',
                  payee: '',
                  nomineeInput: '',
                  nomineeRightInput: '',
                  // Unit Holders Accounts Bank Details tab
                  bankDetailsPaymentType: '',
                  bankDetailsBank: '',
                  bankDetailsAccountNo: '',
                  bankDetailsAccountName: '',
                  bankDetailsPayee: '',
                  // Holder Document Handling
                  documentCode: '',
                  document: '',
                  documentInput: '',
                  documentType: '',
                });
                setBankAccounts([]);
                setDirectors([{ name: '', designation: '', nic: '', shares: '', contactNo: '', address: '' }]);
                setSupportingDocs(defaultSupportingDocs);
                setBankDetailsAccounts([]);
                setExistingAccounts([]);
              }}
              className="setup-btn setup-btn-clear"
              disabled={!isFormEditable}
            >
              <span className="setup-btn-icon">🗑️</span>
              Clear
            </button>
          </div>

          {/* Bottom Card: Main Content Area (Left Panel + Right Panel) + Input Rows */}
          <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '12px' }}>
            {/* Main Content Area: Left Panel + Right Panel */}
            <div style={{ display: 'flex', gap: '12px', flex: 1, minHeight: '500px', height: '100%', marginBottom: '12px' }}>
              {/* Left Panel (List/Preview Area) */}
              <div style={{
                width: '33.33%',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '0',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0'
              }}>
                {/* Horizontal lines to simulate list/preview */}
                {Array.from({ length: 20 }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      height: '28px',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px 8px',
                      color: '#64748b'
                    }}
                  >
                    {/* Empty row - can be filled with document list items */}
                  </div>
                ))}
              </div>

              {/* Right Panel (Content Display Area) */}
              <div style={{
                width: '66.67%',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: '14px'
              }}>
                {/* Empty content area for displaying documents */}
              </div>
            </div>

            {/* Input Rows Inside Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* First Row: 4 columns - Document Code | Document | Browse button | Document Type */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                {/* Column 1: Document Code */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                  <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>Document Code</label>
                  <input
                    type="text"
                    value={formData.documentCode}
                    onChange={(e) => handleInputChange('documentCode', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter document code"
                    style={{ color: '#000000', flex: 1 }}
                  />
                </div>
                {/* Column 2: Document */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                  <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>Document</label>
                  <input
                    type="text"
                    value={formData.document}
                    onChange={(e) => handleInputChange('document', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter document"
                    style={{ color: '#000000', flex: 1 }}
                  />
                </div>
                {/* Column 3: Browse button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                  <button
                    className="setup-btn setup-btn-new"
                    disabled={!isFormEditable}
                    style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
                  >
                    Browse
                  </button>
                </div>
                {/* Column 4: Document Type */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                  <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>Document Type</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-dropdown-select"
                    style={{ color: '#000000', flex: 1 }}
                  >
                    <option value="">Select document type</option>
                    <option value="Image">Image</option>
                    <option value="PDF">PDF</option>
                  </select>
                </div>
              </div>

              {/* Second Row: 4 columns - documentInput | Empty | Empty | Empty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                {/* Column 1: documentInput */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                  <input
                    type="text"
                    value={formData.documentInput}
                    onChange={(e) => handleInputChange('documentInput', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter document"
                    style={{ color: '#000000', flex: 1 }}
                  />
                </div>
                {/* Column 2: Empty */}
                <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                {/* Column 3: Empty */}
                <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                {/* Column 4: Empty */}
                <div style={{ width: '25%', flex: '1 1 25%' }}></div>
              </div>
            </div>
          </div>
          </div>
          {/* End of White Background Wrapper */}

          {/* Search Modal */}
          <UserSearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            onGet={(result) => {
              if (result.holderId) {
                handleInputChange('applicationNo', result.holderId);
              }
              setIsSearchModalOpen(false);
            }}
            title="Search Registration"
          />
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
            <div style={{ width: '100%', gridColumn: '1 / -1' }}>
              {/* Full Name of Applicant Section */}
              <div style={{ marginBottom: '24px' }}>
                <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Full Name of Applicant</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {(formData.applicantType !== 'Corporate') && (
                  <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  )}
                  {formData.applicantType === 'Individual' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '60px' }}>Title</label>
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
                        <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '60px' }}>Initials</label>
                        <input
                          type="text"
                          value={formData.initials}
                          onChange={(e) => handleInputChange('initials', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="K. L. C."
                          style={{ color: '#000000', minWidth: '150px' }}
                        />
                      </div>
                    </>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {(formData.applicantType !== 'Individual') && (
                  <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  )}
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
                                  <th 
                                    style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '12px', color: '#0f172a', borderRight: '1px solid #cbd5e1', cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => handleTableSort('company', 'code')}
                                  >
                                    Code{renderSortIndicator('company', 'code')}
                                  </th>
                                  <th 
                                    style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '12px', color: '#0f172a', cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => handleTableSort('company', 'description')}
                                  >
                                    Description{renderSortIndicator('company', 'description')}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {getSortedData('company', companyData).map((company, idx) => (
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
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '16px', marginTop: '16px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                        <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '140px' }}>Name Denoted by Initials</label>
                        <input
                          type="text"
                          value={formData.nameByInitials}
                          onChange={(e) => handleInputChange('nameByInitials', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Kankanamge Lakshan Chathuranga."
                          style={{ color: '#000000', flex: 1, minWidth: '400px' }}
                        />
                      </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                        <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '140px' }}>Surname</label>
                        <input
                          type="text"
                          value={formData.surname}
                          onChange={(e) => handleInputChange('surname', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Fernando."
                        style={{ color: '#000000', flex: 0.5 }}
                        />
                    </div>
                  </div>
                )}
                
                {/* Company Name and Business (for Corporate) */}
                {formData.applicantType === 'Corporate' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '24px', marginTop: '16px', width: '100%' }}>
                    <div style={{ gridColumn: '1 / 3', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '120px' }}>Company Name</label>
                        <input
                          type="text"
                          value={formData.nameByInitials}
                          onChange={(e) => handleInputChange('nameByInitials', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Management System (PVT) LTD"
                          style={{ color: '#000000', flex: 1 }}
                        />
                    </div>
                    <div style={{ gridColumn: '3 / 4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="setup-input-label" style={{ minWidth: '140px' }}>Business</label>
                        <input
                          type="text"
                          value={formData.surname}
                          onChange={(e) => handleInputChange('surname', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field"
                          placeholder="Unit Trust"
                        style={{ color: '#000000', flex: 1 }}
                        />
                    </div>
                  </div>
                )}
              </div>

              {/* Identification and Contact Information Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Column 1 - Identification */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: '1 / 2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '140px' }}>
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
                    <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '140px' }}>NIC</label>
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
                </div>

                {/* Column 2 - Contact */}
                <div style={{ gridColumn: '2 / 3', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                </div>

                {/* Column 3 - Other No., Comp Reg. No., and Nationality */}
                <div style={{ gridColumn: '3 / 4', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '140px' }}>Comp Reg. No</label>
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
                  <div style={{ marginTop: '8px' }}>
                    <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '4px' }}>Nationality</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        name="nationality"
                          checked={formData.nationality === 'Local'}
                          onChange={() => handleInputChange('nationality', 'Local')}
                        disabled={!isFormEditable}
                      />
                        Local
                    </label>
                      <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        name="nationality"
                          checked={formData.nationality === 'Foreign'}
                          onChange={() => handleInputChange('nationality', 'Foreign')}
                        disabled={!isFormEditable}
                      />
                        Foreign
                    </label>
                  </div>
                </div>
                </div>

                {/* Column 4 - E-mail, Tin No., and Related Party Status */}
                <div style={{ gridColumn: '4 / 5', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  <div style={{ marginTop: '8px' }}>
                    <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '4px' }}>Related Party Status</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        name="relatedPartyStatus"
                        checked={formData.relatedPartyStatus === 'None Related'}
                        onChange={() => handleInputChange('relatedPartyStatus', 'None Related')}
                        disabled={!isFormEditable}
                      />
                      None Related
                    </label>
                      <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        name="relatedPartyStatus"
                        checked={formData.relatedPartyStatus === 'Related party'}
                        onChange={() => handleInputChange('relatedPartyStatus', 'Related party')}
                        disabled={!isFormEditable}
                      />
                      Related party
                    </label>
                  </div>
                </div>
              </div>

            </div>
                </div>

          </div>
        );
      case 'Address/Bank Details':
        return (
          <div>
            <div style={{ padding: '16px', width: '100%' }}>
              {/* Two Address Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', marginBottom: '24px', alignItems: 'start' }}>
                {/* Correspondence Address Card */}
                <div className="setup-ash-box" style={{ padding: '16px' }}>
                  <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '16px' }}>
                    Correspondence Address
              </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Row 1: Street and Town */}
                    <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', gap: '12px', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    </div>
                    {/* Row 2: City and District */}
                    <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', gap: '12px', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    </div>
                    {/* Row 3: Country, Postal Code, and Postal Area */}
                    <div style={{ display: 'grid', gridTemplateColumns: '33.33% 33.33% 33.33%', gap: '12px', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                        <label className="setup-input-label" style={{ minWidth: '60px' }}>Country</label>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                        <label className="setup-input-label" style={{ minWidth: '60px' }}>Postal Code</label>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                        <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '60px' }}>Postal Area</label>
                        <select
                          className="setup-dropdown-select"
                          style={{ color: '#000000', flex: 1 }}
                          value={formData.correspondencePostalArea}
                          onChange={e => handleInputChange('correspondencePostalArea', e.target.value)}
                          disabled={!isFormEditable}
                        >
                          <option value="">Postal Area</option>
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
                  <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '16px' }}>
                    Personal / Permanent Address
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Row 1: Street and Town */}
                    <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', gap: '12px', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    </div>
                    {/* Row 2: City and District */}
                    <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', gap: '12px', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    </div>
                    {/* Row 3: Country, Postal Code, and Postal Area */}
                    <div style={{ display: 'grid', gridTemplateColumns: '33.33% 33.33% 33.33%', gap: '12px', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                        <label className="setup-input-label" style={{ minWidth: '60px' }}>Country</label>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                        <label className="setup-input-label" style={{ minWidth: '60px' }}>Postal Code</label>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                        <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '60px' }}>Postal Area</label>
                        <select
                          className="setup-dropdown-select"
                          style={{ color: '#000000', flex: 1 }}
                          value={formData.permanentPostalArea}
                          onChange={e => handleInputChange('permanentPostalArea', e.target.value)}
                          disabled={!isFormEditable}
                        >
                          <option value="">Postal Area</option>
                          <option value="Colombo">Colombo</option>
                          <option value="Kandy">Kandy</option>
                          <option value="Galle">Galle</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Section - 3 Column 2 Row Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '32% 32% 32%', gap: '24px', width: '100%', marginBottom: '24px' }}>
                {/* Column 1: Radio Buttons and Other */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Row 1: 3 Radio Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap' }}>
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
                  {/* Row 2: Other */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                </div>

                {/* Column 2: Bank and Branch */}
                {/* Row 1: Bank */}
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '60px' }}>
    Bank
  </label>

  <select
    className="setup-dropdown-select"
    style={{ flex: 1, color: '#000000' }}
    value={formData.bank}
    onChange={e => handleInputChange('bank', e.target.value)}
    disabled={!isFormEditable}
  >
    <option value="">Select Bank</option>
    <option value="BOC">Bank of Ceylon</option>
    <option value="PB">People’s Bank</option>
    <option value="HNB">Hatton National Bank</option>
  </select>
</div>
{/* Row 2: Branch */}
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <label className="setup-input-label" style={{ minWidth: '60px' }}>
    Branch
  </label>

  <div style={{ position: 'relative', flex: 1 }} data-branch-table>
    {/* Click Field */}
    <div
      onClick={() => isFormEditable && setShowBranchTable(!showBranchTable)}
      style={{
        padding: '8px 12px',
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        backgroundColor: '#ffffff',
        cursor: isFormEditable ? 'pointer' : 'default',
        color: '#000000',
        minHeight: '38px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px'
      }}
    >
{formData.branchNo || 'Select Branch'}
    </div>

    {/* Dropdown Table */}
    {showBranchTable && isFormEditable && (
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '4px',
          marginTop: '4px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRight: '1px solid #cbd5e1'
                }}
                onClick={() => handleTableSort('branch', 'code')}
              >
                Code {renderSortIndicator('branch', 'code')}
              </th>
              <th
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => handleTableSort('branch', 'description')}
              >
                Description {renderSortIndicator('branch', 'description')}
              </th>
            </tr>
          </thead>

          <tbody>
            {getSortedData('branch', branchData).map((branch, idx) => {
              const value = `${branch.code} - ${branch.description}`;
              return (
                <tr
                  key={idx}
                  onClick={() => {
                    handleInputChange('branch', value);
                    setShowBranchTable(false);
                  }}
                  style={{
                    cursor: 'pointer',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor:
                      formData.branchNo === value ? '#f3e8ff' : '#ffffff'
                  }}
                >
                  <td style={{ padding: '8px 12px', fontSize: '13px' }}>
                    {branch.code}
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: '13px' }}>
                    {branch.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>


                  {/* Row 2: Account Type */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '100px' }}>Account Type</label>
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
                  </div>                  {/* Row 1: Account No + Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '100px' }}>Account No</label>
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

                    </div>
                  </div>

              {/* Bank Accounts Table - Full Width */}
              <div style={{ width: '100%', marginTop: '16px' }}>
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

        );
      case 'Office/ Employee details':
    return (
          <div className="setup-input-section">
            <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
              {/* Office Details Section */}
              <div style={{ marginBottom: '24px' }}>
                <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '16px' }}>
                  Office Details
              </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Row 1: Occupation, Office Name, Street, Town */}
                  <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                  {/* Row 2: City, Postal Code, Country, Tele. */}
                  <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                  {/* Row 3: Fax No., E-mail, Web Registration? */}
                  <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '100px' }}>Web Registerd?</label>
                      <select
                        className="setup-dropdown-select"
                        style={{ color: '#000000', flex: 1 }}
                        value={formData.webRegistration || ''}
                        onChange={e => handleInputChange('webRegistration', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
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
                  {formData.applicantType === 'Individual' && (
              <div className="setup-ash-box" style={{ padding: '16px' }}>
                {/* Row 1: 4 Columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%', marginBottom: '16px' }}>
                  {/* Column 1: If Personal Customer Applicant label + checkbox */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '4px' }}>
                        If Personal Customer Applicant
                    </label>
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
                  </div>
                  {/* Column 2: Spouse's Name + input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label" style={{ minWidth: '120px' }}>Spouse's Name</label>
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
                  {/* Column 3: Spouse's Occupation + input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label" style={{ minWidth: '120px' }}>Spouse's Occupation</label>
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
                  {/* Column 4: Spouse's Employer + input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label" style={{ minWidth: '120px' }}>Spouse's Employer</label>
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
                      </div>
                {/* Row 2: 4 Columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                  {/* Column 1: Currency + selection dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                  {/* Column 2: Annual Income + selection dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                          <label className="setup-input-label" style={{ minWidth: '120px' }}>Annual Income</label>
                    <select
                      className="setup-dropdown-select"
                      style={{ color: '#000000', flex: 1 }}
                            value={formData.annualIncome}
                      onChange={e => handleInputChange('annualIncome', e.target.value)}
                            disabled={!isFormEditable}
                    >
                      <option value="">N/A</option>
                      <option value="0-100000">0-100,000</option>
                      <option value="100001-500000">100,001-500,000</option>
                      <option value="500001-1000000">500,001-1,000,000</option>
                      <option value="1000001+">1,000,001+</option>
                    </select>
                        </div>
                  {/* Column 3: Source of Income + selection dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label" style={{ minWidth: '120px' }}>Source of Income</label>
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
                      </div>
                    </div>
            )}

                  {/* If Corporate Applicant */}
                  {formData.applicantType === 'Corporate' && (
              <div className="setup-ash-box" style={{ padding: '16px', marginTop: '24px' }}>
                      <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '12px' }}>
                        If Corporate Applicant
                      </div>
                <div style={{ display: 'grid', gridTemplateColumns: '38% 28% 30%', gap: '12px', width: '100%' }}>
                  {/* Column 1: Are you a Subsidiary / Associate + Yes/No radios */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
                    <label className="setup-input-label" style={{ margin: 0 }}>
                            Are you a Subsidiary / Associate of another organization?
                          </label>
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
                  {/* Column 2: Ownership + radio buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
                    <div className="setup-input-label" style={{ fontWeight: 600, margin: 0 }}>
                            Ownership
                          </div>
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
                  {/* Column 3: Organization + input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                  )}

                  {/* Contact Person - Only for Corporate */}
                  {formData.applicantType === 'Corporate' && (
              <div className="setup-ash-box" style={{ padding: '16px', marginTop: '24px' }}>
                      <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '16px' }}>
                        Contact Person
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Row 1: Title, Initials, First Name, Surname */}
                  <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Title</label>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Initials</label>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>First Name</label>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Surname</label>
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
                  {/* Row 2: Designation, Address, Telephone, Fax */}
                  <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Designation</label>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Address</label>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Telephone</label>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Fax</label>
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
                  </div>
                  {/* Row 3: E-Mail */}
                  <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>E-Mail</label>
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
                </div>
            )}

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
        );
      case 'Company other':
        return (
          <div className="setup-input-section">
            <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
              {/* Finance Details Section */}
              <div style={{ marginBottom: '24px' }}>
                {/* Header Row: Finance Details, Current Year, Previous Year */}
                <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%', marginBottom: '12px' }}>
                  <div className="setup-input-label" style={{ fontWeight: 400, color: '#000000', margin: 0 }}>
                  Finance Details
                </div>
                  <div className="setup-input-label" style={{ fontWeight: 600, textAlign: 'center', margin: 0 }}>
                    Current Year
                  </div>
                  <div className="setup-input-label" style={{ fontWeight: 600, textAlign: 'center', margin: 0 }}>
                    Previous Year
                  </div>
                    <div></div>
                  </div>
                <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                  {/* Column 1: Labels */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label className="setup-input-label" style={{ minWidth: 'auto' }}>Annual Sales Turnover</label>
                    <label className="setup-input-label" style={{ minWidth: 'auto' }}>Net Profit/Loss</label>
                    <label className="setup-input-label" style={{ minWidth: 'auto' }}>Paid-Up Capital + Accumulated Profit</label>
                  </div>
                  {/* Column 2: Current Year Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                      value={formData.netProfitLossCurrent}
                      onChange={(e) => handleInputChange('netProfitLossCurrent', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="0"
                      style={{ color: '#000000', textAlign: 'center' }}
                    />
                    <input
                      type="text"
                      value={formData.paidUpCapitalAccumulatedProfitCurrent}
                      onChange={(e) => handleInputChange('paidUpCapitalAccumulatedProfitCurrent', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="0"
                      style={{ color: '#000000', textAlign: 'center' }}
                    />
                  </div>
                  {/* Column 3: Previous Year Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="text"
                      value={formData.annualSalesTurnoverPrevious}
                      onChange={(e) => handleInputChange('annualSalesTurnoverPrevious', e.target.value)}
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
                  {/* Column 4: Financial Statements Question */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label className="setup-input-label" style={{ marginBottom: '4px' }}>
                      Are the Financial statements for the last two years available ?
                    </label>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
                <div className="setup-input-label" style={{ fontWeight: 400, marginBottom: '16px', color: '#000000' }}>
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
          <div>
            <div style={{ padding: '16px', width: '100%' }}>
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

              {/* Cards - 2 cards side by side, 50% each */}
              <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', gap: '24px', width: '100%' }}>
                {/* E-Mail Card */}
                <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#000000', marginBottom: '12px' }}>
                    <input
                      type="checkbox"
                      checked={formData.emailNotifyEnabled}
                      onChange={(e) => handleInputChange('emailNotifyEnabled', e.target.checked.toString())}
                      disabled={!isFormEditable}
                      style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }}
                    />
                    Send me E-Mail on
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', gap: '12px', width: '100%' }}>
                    {/* Column 1: Confirmation of Investment, Confirmation of Redemption */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.emailConfirmInvestment} onChange={(e) => handleInputChange('emailConfirmInvestment', e.target.checked.toString())} disabled={!isFormEditable || !formData.emailNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Investment
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.emailConfirmRedemption} onChange={(e) => handleInputChange('emailConfirmRedemption', e.target.checked.toString())} disabled={!isFormEditable || !formData.emailNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Redemption
                    </label>
                    </div>
                    {/* Column 2: Unit Balance, Daily Unit Price */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
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
                </div>

                {/* SMS Card */}
                <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#000000', marginBottom: '12px' }}>
                    <input
                      type="checkbox"
                      checked={formData.smsNotifyEnabled}
                      onChange={(e) => handleInputChange('smsNotifyEnabled', e.target.checked.toString())}
                      disabled={!isFormEditable}
                      style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }}
                    />
                    Send me SMS on
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', gap: '12px', width: '100%' }}>
                    {/* Column 1: Confirmation of Investment, Confirmation of Redemption */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.smsConfirmInvestment} onChange={(e) => handleInputChange('smsConfirmInvestment', e.target.checked.toString())} disabled={!isFormEditable || !formData.smsNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Investment
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.smsConfirmRedemption} onChange={(e) => handleInputChange('smsConfirmRedemption', e.target.checked.toString())} disabled={!isFormEditable || !formData.smsNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Redemption
                    </label>
                    </div>
                    {/* Column 2: Unit Balance, Daily Unit Price */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
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
          </div>
        );
      case 'Supporting Document Check List':
        return (
          <div className="setup-input-section">
            <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                      <th style={{ width: '40px' }}></th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', color: '#000000' }}>Document Code</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', color: '#000000' }}>Document</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', color: '#000000' }}>Receive Date</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', color: '#000000' }}>User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportingDocs.map((doc, idx) => (
                      <tr key={doc.code} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 8px' }}>
                          <input
                            type="checkbox"
                            checked={doc.selected}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSupportingDocs(prev => prev.map((d, i) => i === idx ? { ...d, selected: checked } : d));
                            }}
                            disabled={!isFormEditable}
                            style={{ accentColor: '#9333ea' }}
                          />
                        </td>
                        <td style={{ padding: '8px 12px', color: '#0f172a' }}>{doc.code}</td>
                        <td style={{ padding: '8px 12px', color: '#0f172a' }}>{doc.name}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <input
                            type="date"
                            value={doc.receiveDate}
                            onChange={(e) => setSupportingDocs(prev => prev.map((d, i) => i === idx ? { ...d, receiveDate: e.target.value } : d))}
                            onClick={(e) => {
                              const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                              if (typeof input.showPicker === 'function') {
                                input.showPicker();
                              }
                            }}
                            onFocus={(e) => {
                              const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                              if (typeof input.showPicker === 'function') {
                                input.showPicker();
                              }
                            }}
                            disabled={!isFormEditable || !doc.selected}
                            className="setup-input-field"
                            style={{ color: '#000000', minWidth: '160px' }}
                          />
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          <input
                            type="text"
                            value={doc.user}
                            onChange={(e) => setSupportingDocs(prev => prev.map((d, i) => i === idx ? { ...d, user: e.target.value } : d))}
                            disabled={!isFormEditable || !doc.selected}
                            className="setup-input-field"
                            placeholder=""
                            style={{ color: '#000000' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Select All */}
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={supportingDocs.every(d => d.selected)}
                  ref={el => {
                    if (!el) return;
                    const some = supportingDocs.some(d => d.selected);
                    const all = supportingDocs.every(d => d.selected);
                    el.indeterminate = some && !all;
                  }}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSupportingDocs(prev => prev.map(d => ({ ...d, selected: checked })));
                  }}
                  disabled={!isFormEditable}
                  style={{ accentColor: '#9333ea' }}
                />
                <span className="setup-input-label" style={{ color: '#000000' }}>Select All</span>
              </div>
            </div>
          </div>
        );
      case 'Office Use Details':
        return (
          <div>
            <div style={{ width: '100%' }}>
              {/* First Row: Investment Type and Investor Category - 2 columns 50% each */}
              <div style={{ display: 'grid', gridTemplateColumns: '46% 46%', gap: '24px', width: '100%', marginBottom: '24px' }}>
                {/* Left Column: Investment Type at Registration */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '220px' }}>Investment Type at Registration</label>
                    <select
                      className="setup-dropdown-select"
                      style={{ color: '#000000', flex: 1 }}
                      value={formData.investmentTypeAtRegistration}
                      onChange={e => handleInputChange('investmentTypeAtRegistration', e.target.value)}
                      disabled={!isFormEditable}
                    >
                      <option value="">Agent</option>
                      <option value="Direct">Direct</option>
                    </select>
                </div>
                {/* Right Column: Investor Category */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                  <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '160px' }}>Investor Category</label>
                  <select className="setup-dropdown-select" style={{ color: '#000000', flex: 1 }} value={formData.investorCategory} onChange={e => handleInputChange('investorCategory', e.target.value)} disabled={!isFormEditable}>
                    <option value="">Corporate</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>
                  </div>

              {/* Second Row: Agents Card (left) and Officers Card (right) - 2 columns 50% each */}
              <div style={{ display: 'grid', gridTemplateColumns: '48% 48%', gap: '24px', width: '100%' }}>
                {/* Left: Agents Card - 3 columns */}
                <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
                    <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Agents</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '32% 32% 32%', gap: '12px', width: '100%' }}>
                    {/* Column 1: Agency */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: 'auto', marginBottom: '4px' }}>Agency</label>
                      <div style={{ position: 'relative', width: '100%' }} data-table="agency">
                        <div onClick={() => isFormEditable && setShowAgencyTable(!showAgencyTable)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: isFormEditable ? 'pointer' : 'default', color: formData.officeAgency ? '#0f172a' : '#64748b', minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '12px', width: '100%' }}>
                          {formData.officeAgency || 'Select agency'}
                          </div>
                          {showAgencyTable && isFormEditable && (
                            <div data-table="agency" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                  <th 
                                    style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => handleTableSort('agency', 'code')}
                                  >
                                    Code{renderSortIndicator('agency', 'code')}
                                  </th>
                                  <th 
                                    style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => handleTableSort('agency', 'name')}
                                  >
                                    Name{renderSortIndicator('agency', 'name')}
                                  </th>
                                  </tr>
                                </thead>
                                <tbody>
                                {getSortedData('agency', agencyData).map((a, i) => (
                                    <tr key={i} onClick={() => { handleInputChange('officeAgency', `${a.code} - ${a.name}`); setShowAgencyTable(false); }} style={{ cursor: 'pointer', backgroundColor: formData.officeAgency === `${a.code} - ${a.name}` ? '#f3e8ff' : '#ffffff' }} onMouseEnter={e => { if (formData.officeAgency !== `${a.code} - ${a.name}`) e.currentTarget.style.backgroundColor = '#f8fafc'; }} onMouseLeave={e => { if (formData.officeAgency !== `${a.code} - ${a.name}`) e.currentTarget.style.backgroundColor = '#ffffff'; }}>
                                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{a.code}</td>
                                      <td style={{ padding: '8px 12px', color: '#000000' }}>{a.name}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    {/* Column 2: Sub Agency */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: 'auto', marginBottom: '4px' }}>Sub Agency</label>
                      <div style={{ position: 'relative', width: '100%' }} data-table="subagency">
                          <div
                            onClick={() => isFormEditable && setShowSubAgencyTable(!showSubAgencyTable)}
                            style={{
                              padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff',
                              cursor: isFormEditable ? 'pointer' : 'default', color: formData.officeSubAgency ? '#0f172a' : '#64748b',
                            minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '12px', width: '100%'
                            }}
                          >
                          {formData.officeSubAgency || 'Select sub agency'}
                          </div>
                          {showSubAgencyTable && isFormEditable && (
                            <div data-table="subagency" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                  <th 
                                    style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => handleTableSort('subAgency', 'code')}
                                  >
                                    Code{renderSortIndicator('subAgency', 'code')}
                                  </th>
                                  <th 
                                    style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => handleTableSort('subAgency', 'name')}
                                  >
                                    Name{renderSortIndicator('subAgency', 'name')}
                                  </th>
                                  </tr>
                                </thead>
                                <tbody>
                                {getSortedData('subAgency', subAgencyData).map((a, i) => (
                                    <tr key={i} onClick={() => { handleInputChange('officeSubAgency', `${a.code} - ${a.name}`); setShowSubAgencyTable(false); }} style={{ cursor: 'pointer', backgroundColor: formData.officeSubAgency === `${a.code} - ${a.name}` ? '#f3e8ff' : '#ffffff' }} onMouseEnter={e => { if (formData.officeSubAgency !== `${a.code} - ${a.name}`) e.currentTarget.style.backgroundColor = '#f8fafc'; }} onMouseLeave={e => { if (formData.officeSubAgency !== `${a.code} - ${a.name}`) e.currentTarget.style.backgroundColor = '#ffffff'; }}>
                                       <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{a.code}</td>
                                       <td style={{ padding: '8px 12px', color: '#000000' }}>{a.name}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    {/* Column 3: Agent */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: 'auto', marginBottom: '4px' }}>Agent</label>
                      <div style={{ position: 'relative', width: '100%' }} data-table="agent">
                          <div
                            onClick={() => isFormEditable && setShowAgentTable(!showAgentTable)}
                          style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: isFormEditable ? 'pointer' : 'default', color: formData.officeAgent ? '#0f172a' : '#64748b', minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '12px', width: '100%' }}
                          >
                          {formData.officeAgent || 'Select agent'}
                          </div>
                          {showAgentTable && isFormEditable && (
                            <div data-table="agent" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                    <th 
                                      style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                      onClick={() => handleTableSort('agent', 'code')}
                                    >
                                      Code{renderSortIndicator('agent', 'code')}
                                    </th>
                                    <th 
                                      style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                      onClick={() => handleTableSort('agent', 'name')}
                                    >
                                      Name{renderSortIndicator('agent', 'name')}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getSortedData('agent', agentData).map((a, i) => (
                                    <tr key={i} onClick={() => { handleInputChange('officeAgent', `${a.code} - ${a.name}`); setShowAgentTable(false); }} style={{ cursor: 'pointer', backgroundColor: formData.officeAgent === `${a.code} - ${a.name}` ? '#f3e8ff' : '#ffffff' }} onMouseEnter={e => { if (formData.officeAgent !== `${a.code} - ${a.name}`) e.currentTarget.style.backgroundColor = '#f8fafc'; }} onMouseLeave={e => { if (formData.officeAgent !== `${a.code} - ${a.name}`) e.currentTarget.style.backgroundColor = '#ffffff'; }}>
                                       <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{a.code}</td>
                                       <td style={{ padding: '8px 12px', color: '#000000' }}>{a.name}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Right: Officers Card - 3 columns */}
                <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '32% 32% 32%', gap: '12px', width: '100%' }}>
                    {/* Column 1: Verifying officer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: 'auto', marginBottom: '4px' }}>Verifying officer</label>
                      <input type="text" value={formData.verifyingOfficer} onChange={e => handleInputChange('verifyingOfficer', e.target.value)} disabled={!isFormEditable} className="setup-input-field" style={{ color: '#000000', width: '100%' }} />
                  </div>
                    {/* Column 2: Input Officer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: 'auto', marginBottom: '4px' }}>Input Officer</label>
                      <input type="text" value={formData.inputOfficer} onChange={e => handleInputChange('inputOfficer', e.target.value)} disabled={!isFormEditable} className="setup-input-field" style={{ color: '#000000', width: '100%' }} />
                </div>
                    {/* Column 3: Authorized Officer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: 'auto', marginBottom: '4px' }}>Authorized Officer</label>
                      <input type="text" value={formData.authorizedOfficer} onChange={e => handleInputChange('authorizedOfficer', e.target.value)} disabled={!isFormEditable} className="setup-input-field" style={{ color: '#000000', width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
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

  // Close dropdown tables when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCompanyTable && !target.closest('[data-company-table]')) {
        setShowCompanyTable(false);
      }
      if (showAgencyTable && !target.closest('[data-table="agency"]')) setShowAgencyTable(false);
      if (showSubAgencyTable && !target.closest('[data-table="subagency"]')) setShowSubAgencyTable(false);
      if (showAgentTable && !target.closest('[data-table="agent"]')) setShowAgentTable(false);
      if (showFundTable && !target.closest('[data-table="fund"]')) setShowFundTable(false);
      if (showReinvestFundTable && !target.closest('[data-table="reinvestFund"]')) setShowReinvestFundTable(false);
      if (showPaymentTypeTable && !target.closest('[data-table="paymentType"]')) setShowPaymentTypeTable(false);
      if (showPayoutBankTable && !target.closest('[data-table="payoutBank"]')) setShowPayoutBankTable(false);
      if (showBankDetailsPaymentTypeTable && !target.closest('[data-table="bankDetailsPaymentType"]')) setShowBankDetailsPaymentTypeTable(false);
      if (showBankDetailsBankTable && !target.closest('[data-table="bankDetailsBank"]')) setShowBankDetailsBankTable(false);
      if (showApplicationNoTable && !target.closest('[data-table="applicationNo"]')) setShowApplicationNoTable(false);
    };
    
    if (showCompanyTable || showAgencyTable || showSubAgencyTable || showAgentTable || showFundTable || showReinvestFundTable || showPaymentTypeTable || showPayoutBankTable || showBankDetailsPaymentTypeTable || showBankDetailsBankTable || showApplicationNoTable) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCompanyTable, showAgencyTable, showSubAgencyTable, showAgentTable, showFundTable, showReinvestFundTable, showPaymentTypeTable, showPayoutBankTable, showBankDetailsPaymentTypeTable, showBankDetailsBankTable, showApplicationNoTable]);

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

                    {/* Action Buttons - Only show for non-Holder Document Handling modals */}
                    {modules[modalIdx]?.title !== 'Holder Document Handling' && (
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
                            webRegistration: '',
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
                            investmentTypeAtRegistration: '',
                            officeAgency: '',
                            officeSubAgency: '',
                            officeAgent: '',
                            investorCategory: '',
                            verifyingOfficer: '',
                            inputOfficer: '',
                            authorizedOfficer: '',
                            ackNo: '',
                              // Unit Holders Accounts Details tab
                              fund: '',
                              lastInvestmentNo: '',
                              accountNo: '',
                              isActive: true,
                              holderId: '',
                              accCreatedOn: '',
                              accountHolderType: 'Individual',
                              individualInput: '',
                              jointHolderInput: '',
                              guardianInput: '',
                              rightInput: '',
                              accountOperate: '',
                              reinvestPayout: 'Reinvest',
                              reinvestToDifferentAccount: false,
                              reinvestFund: '',
                              reinvestAccountNo: '',
                              paymentType: '',
                              payoutBank: '',
                              payoutAccountNo: '',
                              payee: '',
                              nomineeInput: '',
                              nomineeRightInput: '',
                              // Unit Holders Accounts Bank Details tab
                              bankDetailsPaymentType: '',
                              bankDetailsBank: '',
                              bankDetailsAccountNo: '',
                              bankDetailsAccountName: '',
                              bankDetailsPayee: '',
                              // Holder Document Handling
                              documentCode: '',
                              document: '',
                              documentInput: '',
                              documentType: '',
                                });
                                setBankAccounts([]);
                                setDirectors([{ name: '', designation: '', nic: '', shares: '', contactNo: '', address: '' }]);
                                setSupportingDocs(defaultSupportingDocs);
                                  setBankDetailsAccounts([]);
                                  setExistingAccounts([]);
                              }}
                        className="setup-btn setup-btn-clear"
                        disabled={!isFormEditable}
                      >
                        <span className="setup-btn-icon">🗑️</span>
                        Clear
                      </button>
                      
                      {/* Conditional buttons based on modal title */}
                      {modules[modalIdx]?.title === 'Application Entry' && (
                        <>
                          <button
                            onClick={() => {
                              // Handle CSV Upload
                              console.log('CSV Upload clicked');
                            }}
                            className="setup-btn setup-btn-new"
                            disabled={!isFormEditable}
                          >
                            <span className="setup-btn-icon">📄</span>
                            CSV Upload
                          </button>
                          <button
                            onClick={() => {
                              // Handle Pension Fund Upload
                              console.log('Pension Fund Upload clicked');
                            }}
                            className="setup-btn setup-btn-new"
                            disabled={!isFormEditable}
                          >
                            <span className="setup-btn-icon">💼</span>
                            Pension Fund Upload
                          </button>
                        </>
                      )}
                      
                      {modules[modalIdx]?.title === 'Registration Unit Holders Profiles' && (
                        <button
                          onClick={() => {
                            // Handle Uniformize Name
                            console.log('Uniformize Name clicked');
                          }}
                          className="setup-btn setup-btn-new"
                          disabled={!isFormEditable}
                        >
                          <span className="setup-btn-icon">✏️</span>
                          Uniformize Name
                        </button>
                      )}
                      
                      {modules[modalIdx]?.title === 'Unit Holders Accounts' && (
                        <>
                          <button
                            onClick={() => {
                              // Handle Check Digit
                              console.log('Check Digit clicked');
                            }}
                            className="setup-btn setup-btn-new"
                            disabled={!isFormEditable}
                          >
                            <span className="setup-btn-icon">✓</span>
                            Check Digit
                          </button>
                          <button
                            onClick={() => {
                              // Handle UHAData Upload
                              console.log('UHAData Upload clicked');
                            }}
                            className="setup-btn setup-btn-new"
                            disabled={!isFormEditable}
                          >
                            <span className="setup-btn-icon">📤</span>
                            UHAData Upload
                          </button>
                        </>
                      )}
                    </div>
                    )}

                    {/* Tabs Section - Only for Application Entry and Registration Unit Holders Profiles */}
                    {modules[modalIdx].title !== 'Unit Holders Accounts' && modules[modalIdx].title !== 'Holder Document Handling' && (
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
                    )}

                    {/* Unit Holders Accounts: bottom full-width 3 tabs card */}
                    {modules[modalIdx].title === 'Unit Holders Accounts' && (
                      <div className="setup-input-section" style={{ marginTop: '12px', height: '100%', overflowY: 'auto' }}>
                        <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
                          {/* Tab headers */}
                          <div role="tablist" aria-label="Unit Holders Accounts Tabs" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', marginBottom: '12px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                            {['Details', 'Bank Details', 'Existing Accounts'].map(tab => (
                              <div
                                key={tab}
                                role="tab"
                                aria-selected={accountsActiveTab === tab}
                                tabIndex={0}
                                onClick={() => setAccountsActiveTab(tab)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setAccountsActiveTab(tab); }}
                                style={{
                                  padding: '10px 14px',
                                  background: accountsActiveTab === tab ? '#ffffff' : '#e2e8f0',
                                  color: '#0f172a',
                                  border: accountsActiveTab === tab ? '2px solid #0ea5e9' : '1px solid #cbd5e1',
                                  borderBottom: accountsActiveTab === tab ? '2px solid #ffffff' : '1px solid #cbd5e1',
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

                          {/* Tab content */}
                          <div>
                            {accountsActiveTab === 'Details' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#000000' }}>
                                {/* First Row: Fund + Last Investment No + Account No + Active checkbox (4 columns) */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                  {/* Column 1: Fund */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px' }}>Fund</label>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                      <div onClick={() => isFormEditable && setShowFundTable(!showFundTable)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: isFormEditable ? 'pointer' : 'default', color: formData.fund ? '#000000' : '#64748b', minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                        {formData.fund || 'Select fund (Name - Code)'}
                                </div>
                                      {showFundTable && isFormEditable && (
                                        <div data-table="fund" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                                <th 
                                                  style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                  onClick={() => handleTableSort('fund', 'name')}
                                                >
                                                  Name{renderSortIndicator('fund', 'name')}
                                                </th>
                                                <th 
                                                  style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                  onClick={() => handleTableSort('fund', 'code')}
                                                >
                                                  Code{renderSortIndicator('fund', 'code')}
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {getSortedData('fund', fundData).map((fund, idx) => (
                                                <tr
                                                  key={idx}
                                                  onClick={() => {
                                                    handleInputChange('fund', `${fund.name} - ${fund.code}`);
                                                    setShowFundTable(false);
                                                  }}
                                                  style={{ cursor: 'pointer', borderBottom: '1px solid #e2e8f0' }}
                                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                  <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{fund.name}</td>
                                                  <td style={{ padding: '8px 12px', color: '#000000' }}>{fund.code}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* Column 2: Last Investment No */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px' }}>Last Investment No</label>
                                    <input
                                      type="text"
                                      value={formData.lastInvestmentNo}
                                      onChange={(e) => handleInputChange('lastInvestmentNo', e.target.value)}
                                      disabled={!isFormEditable}
                                      className="setup-input-field"
                                      placeholder="Enter last investment number"
                                      style={{ color: '#000000', flex: 1 }}
                                    />
                                  </div>
                                  {/* Column 3: Account No */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px' }}>Account No</label>
                                    <input
                                      type="text"
                                      value={formData.accountNo}
                                      onChange={(e) => handleInputChange('accountNo', e.target.value)}
                                      disabled={!isFormEditable}
                                      className="setup-input-field"
                                      placeholder="Enter account number"
                                      style={{ color: '#000000', flex: 1 }}
                                    />
                                  </div>
                                  {/* Column 4: Active checkbox */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                      <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                        disabled={!isFormEditable}
                                      />
                                      <span style={{ fontSize: '14px', color: '#000000' }}>Active</span>
                                    </label>
                                  </div>
                                </div>

                                {/* Second Row: Holder ID + Acc. Created On + Empty + Empty (4 columns) */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                  {/* Column 1: Holder ID */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px' }}>HolderID</label>
                                    <input
                                      type="text"
                                      value={formData.holderId}
                                      onChange={(e) => handleInputChange('holderId', e.target.value)}
                                      disabled={!isFormEditable}
                                      className="setup-input-field"
                                      placeholder="Enter holder ID"
                                      style={{ color: '#000000', width: '150px', maxWidth: '150px' }}
                                    />
                                  </div>
                                  {/* Column 2: Acc. Created On */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px' }}>Acc. Created On:</label>
                                    <div style={{ position: 'relative' }}>
                                      <input
                                        type="date"
                                        value={formData.accCreatedOn}
                                        onChange={(e) => handleInputChange('accCreatedOn', e.target.value)}
                                        disabled={!isFormEditable}
                                        className="setup-input-field"
                                        style={{ 
                                          color: '#000000', 
                                          width: '150px',
                                          maxWidth: '150px',
                                          cursor: isFormEditable ? 'pointer' : 'default',
                                          WebkitAppearance: 'none',
                                          MozAppearance: 'textfield'
                                        }}
                                        onClick={(e) => {
                                          if (isFormEditable) {
                                            e.currentTarget.showPicker?.();
                                          }
                                        }}
                                        onFocus={(e) => {
                                          if (isFormEditable) {
                                            e.currentTarget.showPicker?.();
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                  {/* Column 3: Empty */}
                                  <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                  {/* Column 4: Empty */}
                                  <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                </div>

                                {/* Card with 2 tabs: Joint Account Details and Nominee Details */}
                                <div className="setup-ash-box" style={{ padding: '16px', marginTop: '12px' }}>
                                  {/* Tab headers */}
                                  <div role="tablist" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                    {['Joint Account Details', 'Nominee Details'].map(tab => (
                                      <div
                                        key={tab}
                                        role="tab"
                                        aria-selected={accountHolderDetailsTab === tab}
                                        tabIndex={0}
                                        onClick={() => setAccountHolderDetailsTab(tab)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setAccountHolderDetailsTab(tab); }}
                                        style={{
                                          padding: '10px 14px',
                                          background: accountHolderDetailsTab === tab ? '#ffffff' : '#e2e8f0',
                                          color: '#000000',
                                          border: accountHolderDetailsTab === tab ? '2px solid #0ea5e9' : '1px solid #cbd5e1',
                                          borderRadius: '6px 6px 0 0',
                                          cursor: 'pointer',
                                          fontWeight: 600,
                                          fontSize: '12px',
                                        }}
                                      >
                                        {tab}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Tab content */}
                                  {accountHolderDetailsTab === 'Joint Account Details' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                      {/* Account Holder Type card */}
                                      <div className="setup-ash-box" style={{ padding: '16px', background: '#f1f5f9' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#000000' }}>Account Holder Type</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                          {/* Column 1: Radio buttons */}
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '33.33%' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                              <input
                                                type="radio"
                                                name="accountHolderType"
                                                value="Individual"
                                                checked={formData.accountHolderType === 'Individual'}
                                                onChange={(e) => handleInputChange('accountHolderType', e.target.value as 'Individual' | 'Joint' | 'Guardian')}
                                                disabled={!isFormEditable}
                                                style={{ accentColor: formData.accountHolderType === 'Individual' ? '#9333ea' : undefined }}
                                              />
                                              <span style={{ color: '#000000' }}>Individual</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                              <input
                                                type="radio"
                                                name="accountHolderType"
                                                value="Joint"
                                                checked={formData.accountHolderType === 'Joint'}
                                                onChange={(e) => handleInputChange('accountHolderType', e.target.value as 'Individual' | 'Joint' | 'Guardian')}
                                                disabled={!isFormEditable}
                                                style={{ accentColor: formData.accountHolderType === 'Joint' ? '#9333ea' : undefined }}
                                              />
                                              <span style={{ color: '#000000' }}>Joint</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                              <input
                                                type="radio"
                                                name="accountHolderType"
                                                value="Guardian"
                                                checked={formData.accountHolderType === 'Guardian'}
                                                onChange={(e) => handleInputChange('accountHolderType', e.target.value as 'Individual' | 'Joint' | 'Guardian')}
                                                disabled={!isFormEditable}
                                                style={{ accentColor: formData.accountHolderType === 'Guardian' ? '#9333ea' : undefined }}
                                              />
                                              <span style={{ color: '#000000' }}>Guardian</span>
                                            </label>
                                          </div>
                                          {/* Column 2: Middle input + search (conditional) */}
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '33.33%', visibility: formData.accountHolderType === 'Individual' ? 'hidden' : 'visible' }}>
                                            <label className="setup-input-label" style={{ minWidth: formData.accountHolderType === 'Joint' ? '100px' : '90px' }}>
                                              {formData.accountHolderType === 'Joint' ? 'Joint Holder' : formData.accountHolderType === 'Guardian' ? 'Guardian' : ''}
                                            </label>
                                            <input
                                              type="text"
                                              value={formData.accountHolderType === 'Joint' ? formData.jointHolderInput : formData.guardianInput}
                                              onChange={(e) => handleInputChange(formData.accountHolderType === 'Joint' ? 'jointHolderInput' : 'guardianInput', e.target.value)}
                                              disabled={!isFormEditable}
                                              className="setup-input-field"
                                              placeholder="Enter Holder ID"
                                              style={{ color: '#000000', flex: 1 }}
                                            />
                                            <button 
                                              className="setup-btn setup-btn-new" 
                                              title="Search" 
                                              style={{ padding: '8px 12px' }}
                                              onClick={() => {
                                                if (formData.accountHolderType === 'Joint') {
                                                  setIsJointHolderSearchModalOpen(true);
                                                } else if (formData.accountHolderType === 'Guardian') {
                                                  setIsGuardianSearchModalOpen(true);
                                                }
                                              }}
                                              disabled={!isFormEditable}
                                            >🔍</button>
                                          </div>
                                          {/* Column 3: Right input + add button */}
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '33.33%' }}>
                                            <input
                                              type="text"
                                              value={formData.rightInput}
                                              onChange={(e) => handleInputChange('rightInput', e.target.value)}
                                              disabled={!isFormEditable}
                                              className="setup-input-field"
                                              placeholder="Enter Name"
                                              style={{ color: '#000000', flex: 1 }}
                                            />
                                            <button 
                                              className="setup-btn setup-btn-new" 
                                              title="Add to table" 
                                              style={{ padding: '8px 12px' }}
                                              onClick={() => {
                                                if (formData.rightInput.trim()) {
                                                  const newHolder: HolderInfo = {
                                                    holderNo: String(jointHolders.length + 1),
                                                    holderName: formData.rightInput.trim(),
                                                    selected: false,
                                                  };
                                                  setJointHolders([...jointHolders, newHolder]);
                                                  handleInputChange('rightInput', '');
                                                }
                                              }}
                                              disabled={!isFormEditable || !formData.rightInput.trim()}
                                            >▼</button>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Account Operate card (visible for all account holder types) */}
                                      <div className="setup-ash-box" style={{ padding: '16px', background: '#f1f5f9' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#000000' }}>Account Operate</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                          {/* Either Party and Jointly radio buttons only visible when Joint is selected */}
                                          {formData.accountHolderType === 'Joint' && (
                                            <>
                                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                                <input
                                                  type="radio"
                                                  name="accountOperate"
                                                  value="Either Party"
                                                  checked={formData.accountOperate === 'Either Party'}
                                                  onChange={(e) => handleInputChange('accountOperate', e.target.value as 'Either Party' | 'Jointly')}
                                                  disabled={!isFormEditable}
                                                  style={{ accentColor: formData.accountOperate === 'Either Party' ? '#9333ea' : undefined }}
                                                />
                                                <span style={{ color: '#000000' }}>Either Party</span>
                                              </label>
                                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                                <input
                                                  type="radio"
                                                  name="accountOperate"
                                                  value="Jointly"
                                                  checked={formData.accountOperate === 'Jointly'}
                                                  onChange={(e) => handleInputChange('accountOperate', e.target.value as 'Either Party' | 'Jointly')}
                                                  disabled={!isFormEditable}
                                                  style={{ accentColor: formData.accountOperate === 'Jointly' ? '#9333ea' : undefined }}
                                                />
                                                <span style={{ color: '#000000' }}>Jointly</span>
                                              </label>
                                            </>
                                          )}
                                        </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                            <div style={{ flex: 1 }}>
                                              <table className="setup-data-table" style={{ width: '100%' }}>
                                                <thead>
                                                  <tr>
                                                    <th>Holder No</th>
                                                    <th>Holder Name</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {jointHolders.length === 0 ? (
                                                    <tr>
                                                      <td colSpan={2} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No holders added</td>
                                                    </tr>
                                                  ) : (
                                                    jointHolders.map((holder, idx) => (
                                                      <tr key={idx}>
                                                        <td>{holder.holderNo}</td>
                                                        <td>{holder.holderName}</td>
                                                      </tr>
                                                    ))
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>
                                            <button
                                              className="setup-btn"
                                              style={{ background: '#dc2626', color: '#ffffff', padding: '8px 16px', marginLeft: '12px' }}
                                              onClick={() => {
                                                setJointHolders(jointHolders.filter((_, idx) => !jointHolders[idx].selected));
                                              }}
 >
                                              Remove selected Item
                                            </button>
                                          </div>
                                        </div>
                                    </div>
                                  )}

                                  {accountHolderDetailsTab === 'Nominee Details' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                      {/* First row: 4 columns */}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                        {/* Column 1: Nominee label + input + search */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                          <label className="setup-input-label" style={{ minWidth: '80px' }}>Nominee</label>
                                          <input
                                            type="text"
                                            value={formData.nomineeInput}
                                            onChange={(e) => handleInputChange('nomineeInput', e.target.value)}
                                            disabled={!isFormEditable}
                                            className="setup-input-field"
                                            placeholder="Enter Holder ID"
                                            style={{ color: '#000000', flex: 1 }}
                                          />
                                          <button 
                                            className="setup-btn setup-btn-new" 
                                            title="Search" 
                                            style={{ padding: '8px 12px' }}
                                            onClick={() => setIsNomineeSearchModalOpen(true)}
                                            disabled={!isFormEditable}
                                          >🔍</button>
                                        </div>
                                        {/* Column 3: Input + add button */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '25%', flex: '1 1 25%' }}>
                                          <input
                                            type="text"
                                            value={formData.nomineeRightInput}
                                            onChange={(e) => handleInputChange('nomineeRightInput', e.target.value)}
                                            disabled={!isFormEditable}
                                            className="setup-input-field"
                                            placeholder="Enter Name"
                                            style={{ color: '#000000', flex: 1 }}
                                          />
                                          <button 
                                            className="setup-btn setup-btn-new" 
                                            title="Add to table" 
                                            style={{ padding: '8px 12px' }}
                                            onClick={() => {
                                              if (formData.nomineeRightInput.trim()) {
                                                const newNominee: HolderInfo = {
                                                  holderNo: String(nomineeHolders.length + 1),
                                                  holderName: formData.nomineeRightInput.trim(),
                                                  selected: false,
                                                };
                                                setNomineeHolders([...nomineeHolders, newNominee]);
                                                handleInputChange('nomineeRightInput', '');
                                              }
                                            }}
                                            disabled={!isFormEditable || !formData.nomineeRightInput.trim()}
                                          >▼</button>
                                        </div>
                                        {/* Column 4: Empty */}
                                        <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                      </div>
                                      {/* Table: Holder No and Holder Name */}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ flex: 1 }}>
                                          <table className="setup-data-table" style={{ width: '100%' }}>
                                            <thead>
                                              <tr>
                                                <th>Holder No</th>
                                                <th>Holder Name</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {nomineeHolders.length === 0 ? (
                                                <tr>
                                                  <td colSpan={2} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No nominees added</td>
                                                </tr>
                                              ) : (
                                                nomineeHolders.map((holder, idx) => (
                                                  <tr key={idx}>
                                                    <td>{holder.holderNo}</td>
                                                    <td>{holder.holderName}</td>
                                                  </tr>
                                                ))
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                        <button
                                          className="setup-btn"
                                          style={{ background: '#dc2626', color: '#ffffff', padding: '8px 16px', marginLeft: '12px' }}
                                          onClick={() => {
                                            setNomineeHolders(nomineeHolders.filter((_, idx) => !nomineeHolders[idx].selected));
                                          }}
                                        
                                        >
                                          Remove selected Item
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Reinvest/Payout radio buttons */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <input
                                      type="radio"
                                      name="reinvestPayout"
                                      value="Reinvest"
                                      checked={formData.reinvestPayout === 'Reinvest'}
                                      onChange={(e) => handleInputChange('reinvestPayout', e.target.value as 'Reinvest' | 'Payout')}
                                      disabled={!isFormEditable}
                                      style={{ accentColor: formData.reinvestPayout === 'Reinvest' ? '#9333ea' : undefined }}
                                    />
                                    <span style={{ color: '#000000' }}>Reinvest</span>
                                  </label>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <input
                                      type="radio"
                                      name="reinvestPayout"
                                      value="Payout"
                                      checked={formData.reinvestPayout === 'Payout'}
                                      onChange={(e) => handleInputChange('reinvestPayout', e.target.value as 'Reinvest' | 'Payout')}
                                      disabled={!isFormEditable}
                                      style={{ accentColor: formData.reinvestPayout === 'Payout' ? '#9333ea' : undefined }}
                                    />
                                    <span style={{ color: '#000000' }}>Payout</span>
                                  </label>
                                </div>

                                {/* Reinvest card */}
                                {formData.reinvestPayout === 'Reinvest' && (
                                  <div className="setup-ash-box" style={{ padding: '16px', marginTop: '12px' }}>
                                    {/* One row: Title + Checkbox | Fund | Account No + Search | Empty (4 columns) */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                      {/* Column 1: Title + Checkbox */}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '25%', flex: '1 1 25%' }}>
                                        <div style={{ fontWeight: 'bold', color: '#000000' }}>Reinvest to Diffrent Account(tick)</div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                          <input
                                            type="checkbox"
                                            checked={formData.reinvestToDifferentAccount}
                                            onChange={(e) => handleInputChange('reinvestToDifferentAccount', e.target.checked)}
                                            disabled={!isFormEditable}
                                          />
                                          <span style={{ color: '#000000' }}>Yes</span>
                                        </label>
                                      </div>
                                      {/* Column 2: Fund */}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Fund</label>
                                      <div style={{ position: 'relative', flex: 1 }}>
                                        <div onClick={() => isFormEditable && setShowReinvestFundTable(!showReinvestFundTable)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: isFormEditable ? 'pointer' : 'default', color: formData.reinvestFund ? '#000000' : '#64748b', minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                          {formData.reinvestFund || 'Select fund (Name - Code)'}
                                        </div>
                                        {showReinvestFundTable && isFormEditable && (
                                          <div data-table="reinvestFund" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                              <thead>
                                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                                    <th 
                                                      style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                      onClick={() => handleTableSort('reinvestFund', 'name')}
                                                    >
                                                      Name{renderSortIndicator('reinvestFund', 'name')}
                                                    </th>
                                                    <th 
                                                      style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                      onClick={() => handleTableSort('reinvestFund', 'code')}
                                                    >
                                                      Code{renderSortIndicator('reinvestFund', 'code')}
                                                    </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                  {getSortedData('reinvestFund', fundData).map((fund, idx) => (
                                                  <tr
                                                    key={idx}
                                                    onClick={() => {
                                                      handleInputChange('reinvestFund', `${fund.name} - ${fund.code}`);
                                                      setShowReinvestFundTable(false);
                                                    }}
                                                    style={{ cursor: 'pointer', borderBottom: '1px solid #e2e8f0' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                  >
                                                    <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{fund.name}</td>
                                                    <td style={{ padding: '8px 12px', color: '#000000' }}>{fund.code}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                      {/* Column 3: Account No + Search */}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Account No</label>
                                      <input
                                        type="text"
                                        value={formData.reinvestAccountNo}
                                        onChange={(e) => handleInputChange('reinvestAccountNo', e.target.value)}
                                        disabled={!isFormEditable}
                                        className="setup-input-field"
                                        placeholder="Enter account number"
                                        style={{ color: '#000000', flex: 1 }}
                                      />
                                      <button 
                                        className="setup-btn setup-btn-new" 
                                        title="Search" 
                                        style={{ padding: '8px 12px' }}
                                          onClick={() => setIsReinvestAccountSearchModalOpen(true)}
                                        disabled={!isFormEditable}
                                      >🔍</button>
                                      </div>
                                      {/* Column 4: Empty */}
                                      <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                    </div>
                                  </div>
                                )}

                                {/* Payout card */}
                                {formData.reinvestPayout === 'Payout' && (
                                  <div className="setup-ash-box" style={{ padding: '16px', marginTop: '12px' }}>
                                    {/* One row: Payment Type | Bank | Account No | Empty (4 columns) */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                      {/* Column 1: Payment Type */}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Payment Type</label>
                                      <div style={{ position: 'relative', flex: 1 }}>
                                        <div onClick={() => isFormEditable && setShowPaymentTypeTable(!showPaymentTypeTable)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: isFormEditable ? 'pointer' : 'default', color: formData.paymentType ? '#000000' : '#64748b', minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                          {formData.paymentType || 'Select payment type (Code - Name)'}
                                        </div>
                                        {showPaymentTypeTable && isFormEditable && (
                                          <div data-table="paymentType" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                              <thead>
                                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                                    <th 
                                                      style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                      onClick={() => handleTableSort('paymentType', 'code')}
                                                    >
                                                      Code{renderSortIndicator('paymentType', 'code')}
                                                    </th>
                                                    <th 
                                                      style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                      onClick={() => handleTableSort('paymentType', 'name')}
                                                    >
                                                      Name{renderSortIndicator('paymentType', 'name')}
                                                    </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                  {getSortedData('paymentType', paymentTypeData).map((pt, idx) => (
                                                  <tr
                                                    key={idx}
                                                    onClick={() => {
                                                      handleInputChange('paymentType', `${pt.name} - ${pt.code}`);
                                                      setShowPaymentTypeTable(false);
                                                    }}
                                                    style={{ cursor: 'pointer', borderBottom: '1px solid #e2e8f0' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                  >
                                                    <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{pt.code}</td>
                                                    <td style={{ padding: '8px 12px', color: '#000000' }}>{pt.name}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                      {/* Column 2: Bank */}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Bank</label>
                                      <div style={{ position: 'relative', flex: 1 }}>
                                        <div onClick={() => isFormEditable && setShowPayoutBankTable(!showPayoutBankTable)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: isFormEditable ? 'pointer' : 'default', color: formData.payoutBank ? '#000000' : '#64748b', minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                          {formData.payoutBank || 'Select bank (Name - Code)'}
                                        </div>
                                        {showPayoutBankTable && isFormEditable && (
                                          <div data-table="payoutBank" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                              <thead>
                                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                                    <th 
                                                      style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                      onClick={() => handleTableSort('payoutBank', 'name')}
                                                    >
                                                      Name{renderSortIndicator('payoutBank', 'name')}
                                                    </th>
                                                    <th 
                                                      style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                      onClick={() => handleTableSort('payoutBank', 'code')}
                                                    >
                                                      Code{renderSortIndicator('payoutBank', 'code')}
                                                    </th>
                                                    <th 
                                                      style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                      onClick={() => handleTableSort('payoutBank', 'district')}
                                                    >
                                                      District{renderSortIndicator('payoutBank', 'district')}
                                                    </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                  {getSortedData('payoutBank', bankData).map((bank, idx) => (
                                                  <tr
                                                    key={idx}
                                                    onClick={() => {
                                                      handleInputChange('payoutBank', `${bank.name} - ${bank.code}`);
                                                      setShowPayoutBankTable(false);
                                                    }}
                                                    style={{ cursor: 'pointer', borderBottom: '1px solid #e2e8f0' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                  >
                                                    <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{bank.name}</td>
                                                    <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{bank.code}</td>
                                                    <td style={{ padding: '8px 12px', color: '#000000' }}>{bank.district}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                      {/* Column 3: Account No */}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Account No</label>
                                      <input
                                        type="text"
                                        value={formData.payoutAccountNo}
                                        onChange={(e) => handleInputChange('payoutAccountNo', e.target.value)}
                                        disabled={!isFormEditable}
                                        className="setup-input-field"
                                        placeholder="Enter account number"
                                        style={{ color: '#000000', flex: 1 }}
                                      />
                                      </div>
                                      {/* Column 4: Empty */}
                                      <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                    </div>
                                  </div>
                                )}

                                {/* Payee input - 4 columns */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', width: '100%' }}>
                                  {/* Column 1: Payee label + input */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px' }}>Payee</label>
                                  <input
                                    type="text"
                                    value={formData.payee}
                                    onChange={(e) => handleInputChange('payee', e.target.value)}
                                    disabled={!isFormEditable}
                                    className="setup-input-field"
                                    placeholder="Enter payee"
                                      style={{ color: '#000000', flex: 1 }}
                                    />
                                  </div>
                                  {/* Column 2: Empty */}
                                  <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                  {/* Column 3: Empty */}
                                  <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                  {/* Column 4: Empty */}
                                  <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                </div>
                              </div>
                            )}

                            {accountsActiveTab === 'Bank Details' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#000000' }}>
                                {/* First Row: Payment Type | Bank | Account No | Account Name (4 columns) */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                  {/* Column 1: Payment Type */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>Payment Type</label>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                      <div onClick={() => isFormEditable && setShowBankDetailsPaymentTypeTable(!showBankDetailsPaymentTypeTable)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: isFormEditable ? 'pointer' : 'default', color: formData.bankDetailsPaymentType ? '#000000' : '#64748b', minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                        {formData.bankDetailsPaymentType || 'Select payment type (Code - Name)'}
                                      </div>
                                      {showBankDetailsPaymentTypeTable && isFormEditable && (
                                        <div data-table="bankDetailsPaymentType" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                                <th 
                                                  style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                  onClick={() => handleTableSort('bankDetailsPaymentType', 'code')}
                                                >
                                                  Code{renderSortIndicator('bankDetailsPaymentType', 'code')}
                                                </th>
                                                <th 
                                                  style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                  onClick={() => handleTableSort('bankDetailsPaymentType', 'name')}
                                                >
                                                  Name{renderSortIndicator('bankDetailsPaymentType', 'name')}
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {getSortedData('bankDetailsPaymentType', paymentTypeData).map((pt, idx) => (
                                                <tr
                                                  key={idx}
                                                  onClick={() => {
                                                    handleInputChange('bankDetailsPaymentType', `${pt.name} - ${pt.code}`);
                                                    setShowBankDetailsPaymentTypeTable(false);
                                                  }}
                                                  style={{ cursor: 'pointer', borderBottom: '1px solid #e2e8f0' }}
                                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                  <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{pt.code}</td>
                                                  <td style={{ padding: '8px 12px', color: '#000000' }}>{pt.name}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* Column 2: Bank */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>Bank</label>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                      <div onClick={() => isFormEditable && setShowBankDetailsBankTable(!showBankDetailsBankTable)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: isFormEditable ? 'pointer' : 'default', color: formData.bankDetailsBank ? '#000000' : '#64748b', minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                        {formData.bankDetailsBank || 'Select bank (Name - Code)'}
                                      </div>
                                      {showBankDetailsBankTable && isFormEditable && (
                                        <div data-table="bankDetailsBank" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                                <th 
                                                  style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                  onClick={() => handleTableSort('bankDetailsBank', 'name')}
                                                >
                                                  Name{renderSortIndicator('bankDetailsBank', 'name')}
                                                </th>
                                                <th 
                                                  style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                  onClick={() => handleTableSort('bankDetailsBank', 'code')}
                                                >
                                                  Code{renderSortIndicator('bankDetailsBank', 'code')}
                                                </th>
                                                <th 
                                                  style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none' }}
                                                  onClick={() => handleTableSort('bankDetailsBank', 'district')}
                                                >
                                                  District{renderSortIndicator('bankDetailsBank', 'district')}
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {getSortedData('bankDetailsBank', bankData).map((bank, idx) => (
                                                <tr
                                                  key={idx}
                                                  onClick={() => {
                                                    handleInputChange('bankDetailsBank', `${bank.name} - ${bank.code}`);
                                                    setShowBankDetailsBankTable(false);
                                                  }}
                                                  style={{ cursor: 'pointer', borderBottom: '1px solid #e2e8f0' }}
                                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                  <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{bank.name}</td>
                                                  <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{bank.code}</td>
                                                  <td style={{ padding: '8px 12px', color: '#000000' }}>{bank.district}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* Column 3: Account No */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>Account No</label>
                                    <input
                                      type="text"
                                      value={formData.bankDetailsAccountNo}
                                      onChange={(e) => handleInputChange('bankDetailsAccountNo', e.target.value)}
                                      disabled={!isFormEditable}
                                      className="setup-input-field"
                                      placeholder="Enter account number"
                                      style={{ color: '#000000', flex: 1 }}
                                    />
                                  </div>
                                  {/* Column 4: Account Name */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>Account Name</label>
                                    <input
                                      type="text"
                                      value={formData.bankDetailsAccountName}
                                      onChange={(e) => handleInputChange('bankDetailsAccountName', e.target.value)}
                                      disabled={!isFormEditable}
                                      className="setup-input-field"
                                      placeholder="Enter account name"
                                      style={{ color: '#000000', flex: 1 }}
                                    />
                                  </div>
                                </div>

                                {/* Second Row: Payee | Empty | Empty | Empty (4 columns) */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                  {/* Column 1: Payee */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%', flex: '1 1 25%' }}>
                                    <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>Payee</label>
                                    <input
                                      type="text"
                                      value={formData.bankDetailsPayee}
                                      onChange={(e) => handleInputChange('bankDetailsPayee', e.target.value)}
                                      disabled={!isFormEditable}
                                      className="setup-input-field"
                                      placeholder="Enter payee"
                                      style={{ color: '#000000', flex: 1 }}
                                    />
                                  </div>
                                  {/* Column 2: Empty */}
                                  <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                  {/* Column 3: Empty */}
                                  <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                  {/* Column 4: Empty */}
                                  <div style={{ width: '25%', flex: '1 1 25%' }}></div>
                                </div>

                                {/* Bank Accounts Table */}
                                <div style={{ marginTop: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f9fafb' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', fontWeight: 600 }}>Bank Code</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', fontWeight: 600 }}>Account No.</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', fontWeight: 600 }}>Account Type</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Bank Name</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {bankDetailsAccounts.length === 0 ? (
                                        <tr>
                                          <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No bank accounts added</td>
                                        </tr>
                                      ) : (
                                        bankDetailsAccounts.map((account, idx) => (
                                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{account.bankCode}</td>
                                            <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{account.accountNo}</td>
                                            <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{account.accountType}</td>
                                            <td style={{ padding: '8px 12px', color: '#000000' }}>{account.bankName}</td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {accountsActiveTab === 'Existing Accounts' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#000000' }}>
                                {/* Existing Accounts Table */}
                                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', fontWeight: 600 }}>Account No</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', fontWeight: 600 }}>Fund Name</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', fontWeight: 600 }}>Product Type</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000', fontWeight: 600 }}>Acc. Type</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Active</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {existingAccounts.length === 0 ? (
                                        // Show empty rows when no data
                                        Array.from({ length: 12 }).map((_, idx) => (
                                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000', minHeight: '40px' }}></td>
                                            <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}></td>
                                            <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}></td>
                                            <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}></td>
                                            <td style={{ padding: '8px 12px', color: '#000000' }}></td>
                                          </tr>
                                        ))
                                      ) : (
                                        <>
                                          {existingAccounts.map((account, idx) => (
                                            <tr 
                                              key={idx} 
                                              style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}
                                              onDoubleClick={() => {
                                                // Handle double click to edit
                                                if (isFormEditable) {
                                                  // Populate form fields with selected account data
                                                  handleInputChange('accountNo', account.accountNo);
                                                  handleInputChange('fund', account.fundName);
                                                  // Switch to Details tab to show the data
                                                  setAccountsActiveTab('Details');
                                                }
                                              }}
                                            >
                                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{account.accountNo}</td>
                                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{account.fundName}</td>
                                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{account.productType}</td>
                                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{account.accType}</td>
                                              <td style={{ padding: '8px 12px', color: '#000000' }}>{account.active}</td>
                                            </tr>
                                          ))}
                                          {/* Fill remaining rows if needed */}
                                          {existingAccounts.length < 12 && Array.from({ length: 12 - existingAccounts.length }).map((_, idx) => (
                                            <tr key={`empty-${idx}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000', minHeight: '40px' }}></td>
                                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}></td>
                                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}></td>
                                              <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}></td>
                                              <td style={{ padding: '8px 12px', color: '#000000' }}></td>
                                            </tr>
                                          ))}
                                        </>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                                
                                {/* Instruction text */}
                                <div style={{ marginTop: '8px', color: '#2563eb', fontSize: '14px', fontWeight: 500 }}>
                                  Double click to Edit the selected value
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
