import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UserSearchModal from '../components/UserSearchModal';
import AccountSearchModal from '../components/AccountSearchModal';
import '../App.css';
import '../Setup.css';
import '../RegistrationSetup.css';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';


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
  cdsNo: string;
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
  pepStatus: 'Yes' | 'No' | '';
  fatcaRegistered: 'Yes' | 'No' | '';
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
  riskCategory: string;
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
  agencyCode: string;
  subAgencyCode: string;
  investorCategory: string;
  verifyingOfficer: string;
  inputOfficer: string;
  authorizedOfficer: string;
  // Unit Holders Accounts (top card)
  ackNo: string;
  registrationHolderName: string;
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

// Annual Income data
const annualIncomeData = [
  { code: 'AI001', description: 'N/A' },
  { code: 'AI002', description: '0 - 100,000' },
  { code: 'AI003', description: '100,001 - 500,000' },
  { code: 'AI004', description: '500,001 - 1,000,000' },
  { code: 'AI005', description: '1,000,001 - 5,000,000' },
  { code: 'AI006', description: '5,000,001+' },
];

// Source of Income data
const sourceOfIncomeData = [
  { code: 'SI001', description: 'N/A' },
  { code: 'SI002', description: 'Salary' },
  { code: 'SI003', description: 'Business' },
  { code: 'SI004', description: 'Investment' },
  { code: 'SI005', description: 'Rental Income' },
  { code: 'SI006', description: 'Pension' },
  { code: 'SI007', description: 'Other' },
];

// Currency data
const currencyData = [
  { code: 'LKR', description: 'Sri Lankan Rupee' },
  { code: 'USD', description: 'US Dollar' },
  { code: 'EUR', description: 'Euro' },
  { code: 'GBP', description: 'British Pound' },
  { code: 'AUD', description: 'Australian Dollar' },
  { code: 'JPY', description: 'Japanese Yen' },
  { code: 'CAD', description: 'Canadian Dollar' },
];

// Promotion data
const promotionData = [
  { promotionCode: 'PR001', promotionDescription: 'Online Campaign', description: 'Digital marketing campaign via social media and web ads' },
  { promotionCode: 'PR002', promotionDescription: 'Print Media', description: 'Newspaper and magazine advertisements' },
  { promotionCode: 'PR003', promotionDescription: 'TV Advertisement', description: 'Television commercials and sponsorships' },
  { promotionCode: 'PR004', promotionDescription: 'Radio Campaign', description: 'Radio broadcast promotions and jingles' },
  { promotionCode: 'PR005', promotionDescription: 'Branch Promotion', description: 'In-branch promotional events and offers' },
  { promotionCode: 'PR006', promotionDescription: 'Email Campaign', description: 'Targeted email marketing to existing customers' },
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
  const location = useLocation();

  useEffect(() => {
    if (location.state && typeof location.state.initialModalIdx === 'number') {
      setModalIdx(location.state.initialModalIdx);
      setIsFormEditable(false);
    }
  }, [location.state]);

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
    cdsNo: '',
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
    pepStatus: '',
    fatcaRegistered: '',
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
    riskCategory: '',
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
    agencyCode: '',
    subAgencyCode: '',
    investorCategory: '',
    verifyingOfficer: '',
    inputOfficer: '',
    authorizedOfficer: '',
    ackNo: '',
    registrationHolderName: '',
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
  const appNoBtnRef = useRef<HTMLDivElement>(null);
  const [appNoTablePos, setAppNoTablePos] = useState<{ top: number; left: number } | null>(null);
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
  const [showAnnualIncomeTable, setShowAnnualIncomeTable] = useState(false);
  const [showSourceOfIncomeTable, setShowSourceOfIncomeTable] = useState(false);
  const [showCurrencyTable, setShowCurrencyTable] = useState(false);
  const [showPromotionTable, setShowPromotionTable] = useState(false);
  // ── Custom address combobox state ──────────────────────────────────────
  // Each field tracks: open panel, typed filter value
  const [addrDropdown, setAddrDropdown] = useState<{
    corrStreet: boolean; corrTown: boolean; corrCity: boolean;
    permStreet: boolean; permTown: boolean; permCity: boolean;
    offStreet: boolean; offTown: boolean; offCity: boolean;
  }>({
    corrStreet: false, corrTown: false, corrCity: false,
    permStreet: false, permTown: false, permCity: false,
    offStreet: false, offTown: false, offCity: false,
  });

  const toggleAddrDropdown = (key: keyof typeof addrDropdown) => {
    setAddrDropdown(prev => {
      const allClosed = Object.fromEntries(Object.keys(prev).map(k => [k, false])) as typeof prev;
      return { ...allClosed, [key]: !prev[key] };
    });
  };
  const closeAllAddrDropdowns = () =>
    setAddrDropdown({
      corrStreet: false, corrTown: false, corrCity: false,
      permStreet: false, permTown: false, permCity: false,
      offStreet: false, offTown: false, offCity: false
    });

  // Shared address suggestion data
  const streetOptions = [
    'Galle Road', 'Duplication Road', 'High Level Road', 'Kandy Road',
    'Main Street', 'Park Avenue', 'Flower Road', 'Hospital Road',
    'Sea Street', 'Baseline Road', 'Temple Road', 'Lake Road',
    'Green Path', 'Union Place', 'Bauddhaloka Mawatha',
  ];
  const townOptions = [
    'Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Matara',
    'Kurunegala', 'Ratnapura', 'Badulla', 'Anuradhapura', 'Trincomalee',
    'Batticaloa', 'Polonnaruwa', 'Nuwara Eliya', 'Hambantota',
  ];
  const cityOptions = [
    'Colombo 01', 'Colombo 02', 'Colombo 03', 'Colombo 04', 'Colombo 05',
    'Colombo 06', 'Colombo 07', 'Colombo 10', 'Kandy', 'Galle',
    'Negombo', 'Jaffna', 'Matara', 'Kurunegala', 'Ratnapura',
  ];

  // Helper: render a custom combobox (typed input + dark dropdown panel)
  const renderAddrCombobox = (
    dropKey: keyof typeof addrDropdown,
    field: string,
    value: string,
    options: string[],
    placeholder: string,
    minWidth?: string,
  ) => {
    const isOpen = addrDropdown[dropKey];
    const filtered = options.filter(o => o.toLowerCase().includes(value.toLowerCase()));
    return (
      <div className="reg-addr-combo-wrapper" style={{ minWidth: minWidth || '0' }} data-addr-combo>
        {/* Input + chevron button */}
        <div className="reg-addr-input-container">
          <input
            type="text"
            value={value}
            onChange={e => { handleInputChange(field, e.target.value); if (!isOpen) toggleAddrDropdown(dropKey); }}
            onFocus={() => { if (!isOpen) toggleAddrDropdown(dropKey); }}
            disabled={!isFormEditable}
            placeholder={placeholder}
            className="reg-addr-input"
          />
          <button
            type="button"
            onClick={() => isFormEditable && toggleAddrDropdown(dropKey)}
            disabled={!isFormEditable}
            className="reg-addr-chevron"
          >▼</button>
        </div>
        {/* Dropdown panel */}
        {isOpen && (
          <div className="reg-addr-dropdown-panel">
            {filtered.length === 0 ? (
              <div className="reg-addr-no-matches">No matches</div>
            ) : filtered.map((opt, i) => (
              <div
                key={i}
                onMouseDown={e => { e.preventDefault(); handleInputChange(field, opt); closeAllAddrDropdowns(); }}
                className={`reg-addr-option ${opt === value ? 'active' : ''}`}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  // ── end custom address combobox ────────────────────────────────────────

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

  // Close address dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-addr-combo]')) {
        closeAllAddrDropdowns();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
      cdsNo: '',
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
      pepStatus: '',
      fatcaRegistered: '',
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
      riskCategory: '',
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
      agencyCode: '',
      subAgencyCode: '',
      investorCategory: '',
      verifyingOfficer: '',
      inputOfficer: '',
      authorizedOfficer: '',
      ackNo: '',
      registrationHolderName: '',
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
          <div className="reg-flex-center-gap16">
            {/* Single unified card: Application No + Compulsory + Auto Number + STATUS all in one row */}
            <div className="setup-ash-box reg-ash-box-padded">
              <div className="reg-flex-nowrap-gap16">
                {/* Application No + Input + Button */}
                <div className="reg-app-no-wrapper">
                  <label className="setup-input-label reg-app-no-label">Application No</label>
                  <input
                    type="text"
                    value={formData.applicationNo}
                    onChange={(e) => handleInputChange('applicationNo', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field reg-app-no-input"
                    placeholder="Enter application number"
                  />
                  <div className="reg-relative" ref={appNoBtnRef}>
                    <button
                      className="setup-btn setup-btn-new reg-btn-padded"
                      title="Select Application"
                      onClick={() => {
                        if (!isFormEditable) return;
                        if (!showApplicationNoTable && appNoBtnRef.current) {
                          const rect = appNoBtnRef.current.getBoundingClientRect();
                          setAppNoTablePos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
                        }
                        setShowApplicationNoTable(!showApplicationNoTable);
                      }}
                      disabled={!isFormEditable}
                    >
                      +
                    </button>
                    {showApplicationNoTable && isFormEditable && appNoTablePos && createPortal(
                      <div
                        data-table="applicationNo"
                        className="reg-portal-table-container"
                        style={{
                          top: appNoTablePos.top,
                          left: appNoTablePos.left,
                        }}
                      >
                        <table className="reg-portal-table">
                          <thead className="reg-portal-thead">
                            <tr className="reg-portal-tr-header">
                              <th
                                className="reg-portal-th"
                                onClick={() => handleTableSort('applicationNo', 'appNo')}
                              >
                                Application No{renderSortIndicator('applicationNo', 'appNo')}
                              </th>
                              <th
                                className="reg-portal-th"
                                onClick={() => handleTableSort('applicationNo', 'approved')}
                              >
                                Approved{renderSortIndicator('applicationNo', 'approved')}
                              </th>
                              <th
                                className="reg-portal-th"
                                onClick={() => handleTableSort('applicationNo', 'name')}
                              >
                                Name{renderSortIndicator('applicationNo', 'name')}
                              </th>
                              <th
                                className="reg-portal-th"
                                onClick={() => handleTableSort('applicationNo', 'regNo')}
                              >
                                Registration_No{renderSortIndicator('applicationNo', 'regNo')}
                              </th>
                              <th
                                className="reg-portal-th"
                                onClick={() => handleTableSort('applicationNo', 'street')}
                              >
                                Street{renderSortIndicator('applicationNo', 'street')}
                              </th>
                              <th
                                className="reg-portal-th"
                                onClick={() => handleTableSort('applicationNo', 'town')}
                              >
                                Town{renderSortIndicator('applicationNo', 'town')}
                              </th>
                              <th
                                className="reg-portal-th"
                                onClick={() => handleTableSort('applicationNo', 'city')}
                              >
                                City{renderSortIndicator('applicationNo', 'city')}
                              </th>
                              <th
                                className="reg-portal-th-last"
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
                                className="reg-portal-tr-row"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#f8fafc';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                }}
                              >
                                <td className="reg-portal-td">{item.appNo}</td>
                                <td className="reg-portal-td">{item.approved}</td>
                                <td className="reg-portal-td">{item.name}</td>
                                <td className="reg-portal-td">{item.regNo}</td>
                                <td className="reg-portal-td">{item.street}</td>
                                <td className="reg-portal-td">{item.town}</td>
                                <td className="reg-portal-td">{item.city}</td>
                                <td className="reg-portal-td-last">{item.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>,
                      document.body
                    )}
                  </div>
                </div>

                {/* Compulsory Data Fields */}
                <div className="reg-flex-shrink0">
                  <div className="registration-setup-compulsory-data-fields-note">Compulsory Data Fields</div>
                </div>

                {/* Auto Number Button */}
                <div className="reg-flex-shrink0">
                  <button
                    className="setup-btn setup-btn-save reg-btn-padded"
                    disabled={!isFormEditable}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Auto Number
                  </button>
                </div>

                {/* Divider */}
                <div className="reg-divider-vertical" />

                {/* STATUS — inline on the right */}
                <div className="reg-flex-shrink0-gap14">
                  <span className="setup-input-label reg-status-radio-text">STATUS</span>
                  <label className="reg-status-radio-label">
                    <input
                      type="radio"
                      name="applicationStatus"
                      checked={formData.applicationStatus === 'Pending'}
                      onChange={() => handleInputChange('applicationStatus', 'Pending')}
                      disabled={!isFormEditable}
                      style={{ accentColor: '#d97706' }}
                    />
                    <span style={{ color: '#d97706' }} className="reg-status-radio-text">Pending</span>
                  </label>
                  <label className="reg-status-radio-label">
                    <input
                      type="radio"
                      name="applicationStatus"
                      checked={formData.applicationStatus === 'Approved'}
                      onChange={() => handleInputChange('applicationStatus', 'Approved')}
                      disabled={!isFormEditable}
                      style={{ accentColor: '#16a34a' }}
                    />
                    <span style={{ color: '#16a34a' }} className="reg-status-radio-text">Approved</span>
                  </label>
                  <label className="reg-status-radio-label">
                    <input
                      type="radio"
                      name="applicationStatus"
                      checked={formData.applicationStatus === 'All'}
                      onChange={() => handleInputChange('applicationStatus', 'All')}
                      disabled={!isFormEditable}
                      style={{ accentColor: '#1e3a8a' }}
                    />
                    <span style={{ color: '#334155' }} className="reg-status-radio-text">All</span>
                  </label>
                </div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="setup-input-label" style={{ minWidth: '100px' }}>CDS No.</label>
                <input
                  type="text"
                  value={formData.cdsNo}
                  onChange={(e) => handleInputChange('cdsNo', e.target.value)}
                  disabled={!isFormEditable}
                  className="setup-input-field"
                  placeholder="Enter CDS number"
                  style={{ color: '#000000', flex: 1 }}
                />
              </div>
              <span className="registration-setup-compulsory-data-fields-note" style={{ marginLeft: '12px' }}>
                Compulsory Data Fields
              </span>
            </div>
          </div>

          {/* Search Modal for Registration Unit Holders Profiles */}
          <UserSearchModal
            isOpen={isRegistrationProfilesSearchModalOpen}
            onClose={() => setIsRegistrationProfilesSearchModalOpen(false)}
            onSelect={(result) => {
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
          {/* Top card: Registration No + Search + Name + ACKNO - Fixed */}
          <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '2px', position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              {/* Left Column: Registration No label + input + Search button + Name field */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto' }}>
                <label className="setup-input-label" style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>Registration No</label>
                <input
                  type="text"
                  value={formData.applicationNo}
                  onChange={(e) => handleInputChange('applicationNo', e.target.value)}
                  disabled={!isFormEditable}
                  className="uha-text-input"
                  placeholder="Enter registration number"
                  style={{ width: '180px' }}
                />
                <button
                  className="uha-icon-btn uha-icon-btn-search"
                  title="Search"
                  onClick={() => setIsUnitHoldersSearchModalOpen(true)}
                  disabled={!isFormEditable}
                >🔍</button>
                <input
                  type="text"
                  value={formData.registrationHolderName}
                  onChange={(e) => handleInputChange('registrationHolderName', e.target.value)}
                  disabled={!isFormEditable}
                  readOnly
                  className="uha-text-input"
                  placeholder="Holder Name"
                  style={{ flex: 1 }}
                />
              </div>
              {/* Right Column: ACKNO right corner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <label className="setup-input-label" style={{ minWidth: '70px', textAlign: 'right' }}>ACKNO</label>
                <input
                  type="text"
                  value={formData.ackNo}
                  onChange={(e) => handleInputChange('ackNo', e.target.value)}
                  disabled={!isFormEditable}
                  className="uha-text-input"
                  placeholder="ACKNO"
                  style={{ width: '180px' }}
                />
              </div>
            </div>
          </div>

          {/* Search Modals for Unit Holders Accounts */}
          <UserSearchModal
            isOpen={isUnitHoldersSearchModalOpen}
            onClose={() => setIsUnitHoldersSearchModalOpen(false)}
            onSelect={(result) => {
              if (result.holderId) {
                handleInputChange('applicationNo', result.holderId);
              }
              if (result.holderName || result.fullName) {
                handleInputChange('registrationHolderName', result.holderName || result.fullName || '');
              }
              setIsUnitHoldersSearchModalOpen(false);
            }}
            title="Search Registration"
          />
          <UserSearchModal
            isOpen={isNomineeSearchModalOpen}
            onClose={() => setIsNomineeSearchModalOpen(false)}
            onSelect={(result) => {
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
            onSelect={(result) => {
              if (result.holderId || result.holderName || result.fullName) {
                handleInputChange('jointHolderInput', result.holderId || '');
                handleInputChange('rightInput', result.holderName || result.fullName || '');
              }
              setIsJointHolderSearchModalOpen(false);
            }}
            title="Search Joint Holder"
          />
          <UserSearchModal
            isOpen={isGuardianSearchModalOpen}
            onClose={() => setIsGuardianSearchModalOpen(false)}
            onSelect={(result) => {
              if (result.holderId || result.holderName || result.fullName) {
                handleInputChange('guardianInput', result.holderId || '');
                handleInputChange('rightInput', result.holderName || result.fullName || '');
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
            onSelect={(result) => {
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
        <div className="setup-input-section reg-height100-flex-col">
          {/* White Background Wrapper - Contains all content */}
          <div className="reg-white-card">
            {/* Top Control Bar */}
            <div className="setup-ash-box reg-margin-bottom12">
              <div className="reg-flex-width100">
                {/* Column 1: Registration No */}
                <div className="reg-grid-col1-2 reg-flex-shrink0">
                  <label className="setup-input-label reg-label-black-600">Registration No</label>
                  <input
                    type="text"
                    value={formData.applicationNo}
                    onChange={(e) => handleInputChange('applicationNo', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field reg-flex1"
                    placeholder="Enter registration number"
                  />
                </div>
                {/* Column 2: Search button */}
                <div className="reg-grid-col1-2 reg-flex-shrink0">
                  <button
                    className="setup-btn reg-btn-search-outline"
                    title="Search"
                    onClick={() => setIsSearchModalOpen(true)}
                    disabled={!isFormEditable}
                  >
                    <span className="reg-search-icon-text">🔍</span>
                  </button>
                </div>
                {/* Column 3: Another input field */}
                <div className="reg-grid-col1-2 reg-flex-shrink0">
                  <input
                    type="text"
                    disabled={!isFormEditable}
                    className="setup-input-field reg-flex1"
                    placeholder=""
                  />
                </div>
                {/* Column 4: Zoom Level */}
                <div className="reg-grid-col1-2 reg-flex-shrink0">
                  <label className="setup-input-label reg-label-black-600">Zoom Level</label>
                  <select
                    value={documentZoomLevel}
                    onChange={(e) => setDocumentZoomLevel(e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-select-field reg-flex1"
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
            <div className="setup-action-buttons reg-margin-bottom12">
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
                    cdsNo: '',
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
                    pepStatus: '',
                    fatcaRegistered: '',
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
                    riskCategory: '',
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
                    agencyCode: '',
                    subAgencyCode: '',
                    investorCategory: '',
                    verifyingOfficer: '',
                    inputOfficer: '',
                    authorizedOfficer: '',
                    ackNo: '',
                    registrationHolderName: '',
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
            <div className="setup-ash-box reg-ash-box-padded reg-margin-bottom12">
              {/* Main Content Area: Left Panel + Right Panel */}
              <div className="reg-main-content-area">
                {/* Left Panel (List/Preview Area) */}
                <div className="reg-panel-left">
                  {/* Horizontal lines to simulate list/preview */}
                  {Array.from({ length: 20 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="reg-list-item-sim"
                    >
                      {/* Empty row - can be filled with document list items */}
                    </div>
                  ))}
                </div>

                {/* Right Panel (Content Display Area) */}
                <div className="reg-panel-right">
                  {/* Empty content area for displaying documents */}
                </div>
              </div>

              {/* Input Rows Inside Card */}
              <div className="reg-flex-col-gap12">
                {/* First Row: 4 columns - Document Code | Document | Browse button | Document Type */}
                <div className="reg-flex-width100">
                  {/* Column 1: Document Code */}
                  <div className="reg-grid-col1-2 reg-flex-shrink0">
                    <label className="setup-input-label reg-label-black-600">Document Code</label>
                    <input
                      type="text"
                      value={formData.documentCode}
                      onChange={(e) => handleInputChange('documentCode', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-flex1"
                      placeholder="Enter document code"
                    />
                  </div>
                  {/* Column 2: Document */}
                  <div className="reg-grid-col1-2 reg-flex-shrink0">
                    <label className="setup-input-label reg-label-black-600">Document</label>
                    <input
                      type="text"
                      value={formData.document}
                      onChange={(e) => handleInputChange('document', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-flex1"
                      placeholder="Enter document"
                    />
                  </div>
                  {/* Column 3: Browse button */}
                  <div className="reg-grid-col1-2 reg-flex-shrink0">
                    <button
                      className="setup-btn setup-btn-new reg-btn-padded"
                      disabled={!isFormEditable}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Browse
                    </button>
                  </div>
                  <div className="reg-grid-col1-2 reg-flex-shrink0">
                    <label className="setup-input-label reg-label-black-600" style={{ minWidth: '100px' }}>Document Type</label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => handleInputChange('documentType', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-select-field reg-flex1"
                    >
                      <option value="">Select document type</option>
                      <option value="Image">Image</option>
                      <option value="PDF">PDF</option>
                    </select>
                  </div>
                </div>

                {/* Second Row: 4 columns - documentInput | Empty | Empty | Empty */}
                <div className="reg-flex-width100">
                  {/* Column 1: documentInput */}
                  <div className="reg-grid-col1-2 reg-flex-shrink0">
                    <input
                      type="text"
                      value={formData.documentInput}
                      onChange={(e) => handleInputChange('documentInput', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-flex1"
                      placeholder="Enter document"
                    />
                  </div>
                  {/* Column 2, 3, 4: Empty */}
                  <div className="reg-grid-col1-2 reg-flex-shrink0"></div>
                  <div className="reg-grid-col1-2 reg-flex-shrink0"></div>
                  <div className="reg-grid-col1-2 reg-flex-shrink0"></div>
                </div>
              </div>
            </div>
          </div>
          {/* End of White Background Wrapper */}

          {/* Search Modal */}
          <UserSearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            onSelect={(result) => {
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
          <div className="reg-grid-2col">
            <div className="reg-grid-full-width">
              {/* Full Name of Applicant Section */}
              <div className="reg-margin-bottom24">
                <div className="setup-input-label registration-setup-compulsory-label reg-label-bold-mb12">Full Name of Applicant</div>
                <div className="reg-flex-wrap-gap16-mb16">
                  {(formData.applicantType !== 'Corporate') && (
                    <label className="registration-setup-compulsory-label reg-status-radio-label">
                      <input
                        type="radio"
                        name="applicantType"
                        checked={formData.applicantType === 'Individual'}
                        onChange={() => handleInputChange('applicantType', 'Individual')}
                        disabled={!isFormEditable}
                        className="reg-radio-purple"
                      />
                      Individual
                    </label>
                  )}
                  {formData.applicantType === 'Individual' && (
                    <>
                      <div className="reg-flex-auto-shrink0">
                        <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '60px' }}>Title</label>
                        <select
                          className="setup-select-field reg-flex1"
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
                      <div className="reg-flex-auto-shrink0">
                        <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '60px' }}>Initials</label>
                        <input
                          type="text"
                          value={formData.initials}
                          onChange={(e) => handleInputChange('initials', e.target.value)}
                          disabled={!isFormEditable}
                          className="setup-input-field reg-flex1 reg-input-min-height32"
                          placeholder="K. L. C."
                        />
                      </div>
                    </>
                  )}
                  <div className="reg-flex-center-gap16">
                    {(formData.applicantType !== 'Individual') && (
                      <label className="registration-setup-compulsory-label reg-status-radio-label">
                        <input
                          type="radio"
                          name="applicantType"
                          checked={formData.applicantType === 'Corporate'}
                          onChange={() => handleInputChange('applicantType', 'Corporate')}
                          disabled={!isFormEditable}
                          className="reg-radio-purple"
                        />
                        Corporate
                      </label>
                    )}
                    {formData.applicantType === 'Corporate' && (
                      <div className="reg-company-table-wrapper" data-company-table>
                        <div
                          className="setup-input-field reg-company-select-box"
                          onClick={() => isFormEditable && setShowCompanyTable(!showCompanyTable)}
                          style={{
                            color: formData.description ? '#000000' : '#64748b'
                          }}
                        >
                          {formData.description || 'Select company '}
                        </div>
                        {showCompanyTable && isFormEditable && (
                          <div
                            data-company-table
                            className="reg-company-dropdown"
                          >
                            <table className="reg-company-table">
                              <thead>
                                <tr className="reg-bg-header reg-border-bottom-gray">
                                  <th
                                    className="reg-company-th"
                                    onClick={() => handleTableSort('company', 'code')}
                                  >
                                    Code{renderSortIndicator('company', 'code')}
                                  </th>
                                  <th
                                    className="reg-company-th-last"
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
                                    className="reg-company-tr"
                                    style={{
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
                                    <td className="reg-company-td">{company.code}</td>
                                    <td className="reg-company-td-last">{company.description}</td>
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
                  <div className="reg-grid-2fr-2fr">
                    <div className="reg-grid-col1-2 reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '140px' }}>Name Denoted by Initials</label>
                      <input
                        type="text"
                        value={formData.nameByInitials}
                        onChange={(e) => handleInputChange('nameByInitials', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1 reg-input-min-height32"
                        placeholder="Kankanamge Lakshan Chathuranga."
                      />
                    </div>
                    <div className="reg-grid-col1-2 reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '140px' }}>Surname</label>
                      <input
                        type="text"
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-input-flex05"
                        placeholder="Fernando."
                      />
                    </div>
                  </div>
                )}

                {/* Company Name and Business (for Corporate) */}
                {formData.applicantType === 'Corporate' && (
                  <div className="reg-grid-4col">
                    <div className="reg-grid-col1-3 reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label" style={{ minWidth: '120px' }}>Company Name</label>
                      <input
                        type="text"
                        value={formData.nameByInitials}
                        onChange={(e) => handleInputChange('nameByInitials', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1"
                        placeholder="Management System (PVT) LTD"
                      />
                    </div>
                    <div className="reg-grid-col3-4 reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label" style={{ minWidth: '140px' }}>Business</label>
                      <input
                        type="text"
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1"
                        placeholder="Unit Trust"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Identification and Contact Information Section */}
              <div className="reg-grid-4col reg-margin-bottom24 reg-margin-top16">
                {/* Column 1 - Identification */}
                <div className="reg-grid-col1-2 reg-flex-col-gap16">
                  <div className="reg-flex-nowrap-gap16">
                    <label className="setup-input-label registration-setup-compulsory-label reg-label-min140">
                      {formData.applicantType === 'Corporate' ? 'Commence' : 'Date of Birth'}
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-flex1 reg-date-picker-padded"
                      onClick={(e) => {
                        if (isFormEditable && e.currentTarget) {
                          e.currentTarget.showPicker?.();
                        }
                      }}
                    />
                  </div>
                  <div className="reg-flex-nowrap-gap16">
                    <label className="setup-input-label registration-setup-compulsory-label reg-label-min140">NIC</label>
                    <input
                      type="text"
                      value={formData.nic}
                      onChange={(e) => handleInputChange('nic', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-flex1"
                      placeholder="Enter NIC"
                    />
                  </div>
                  <div className="reg-flex-nowrap-gap16">
                    <label className="setup-input-label reg-label-min140">Passport</label>
                    <input
                      type="text"
                      value={formData.passport}
                      onChange={(e) => handleInputChange('passport', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-flex1"
                      placeholder="Enter passport number"
                    />
                  </div>
                </div>

                {/* Column 2 - Contact */}
                <div className="reg-grid-col2-3 reg-flex-col-gap16">
                  <div className="reg-flex-nowrap-gap16">
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>Telephone</label>
                    <select
                      className="setup-select-field reg-select-w70"
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
                      className="setup-input-field reg-input-min-w150-flex1"
                      placeholder="Enter telephone"
                      maxLength={10}
                    />
                  </div>
                  <div className="reg-flex-nowrap-gap16">
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>Fax</label>
                    <select
                      className="setup-select-field reg-select-w70"
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
                      className="setup-input-field reg-input-min-w150-flex1"
                      placeholder="Enter fax"
                      maxLength={10}
                    />
                  </div>
                  <div className="reg-flex-nowrap-gap16">
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>Mobile</label>
                    <select
                      className="setup-select-field reg-select-w70"
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
                      className="setup-input-field reg-input-min-w150-flex1"
                      placeholder="Enter mobile"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Column 3 - Other No., Comp Reg. No., and Nationality */}
                <div className="reg-grid-col3-4 reg-flex-col-gap16">
                  <div className="reg-flex-nowrap-gap16">
                    <label className="setup-input-label reg-label-min140">Other No.</label>
                    <input
                      type="text"
                      value={formData.otherNo}
                      onChange={(e) => handleInputChange('otherNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-flex1"
                      placeholder="Enter other number"
                    />
                  </div>
                  <div className="reg-flex-nowrap-gap16">
                    <label className="setup-input-label registration-setup-compulsory-label reg-label-min140">Comp Reg. No</label>
                    <input
                      type="text"
                      value={formData.compRegNo}
                      onChange={(e) => handleInputChange('compRegNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-flex1"
                      placeholder="Enter company registration number"
                    />
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div className="setup-input-label registration-setup-compulsory-label reg-label-bold-mb12" style={{ marginBottom: '4px' }}>Nationality</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      <label className="registration-setup-compulsory-label reg-status-radio-label">
                        <input
                          type="radio"
                          name="nationality"
                          checked={formData.nationality === 'Local'}
                          onChange={() => handleInputChange('nationality', 'Local')}
                          disabled={!isFormEditable}
                        />
                        Local
                      </label>
                      <label className="registration-setup-compulsory-label reg-status-radio-label">
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
                <div className="reg-grid-col4-5 reg-flex-col-gap16">
                  <div className="reg-flex-nowrap-gap16">
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>E-mail</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-flex1"
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="reg-flex-nowrap-gap16">
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>Tin No.</label>
                    <input
                      type="text"
                      value={formData.tinNo}
                      onChange={(e) => handleInputChange('tinNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-flex1"
                      placeholder="Enter TIN number"
                    />
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div className="setup-input-label registration-setup-compulsory-label reg-label-bold-mb12" style={{ marginBottom: '4px' }}>Related Party Status</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      <label className="registration-setup-compulsory-label reg-status-radio-label">
                        <input
                          type="radio"
                          name="relatedPartyStatus"
                          checked={formData.relatedPartyStatus === 'None Related'}
                          onChange={() => handleInputChange('relatedPartyStatus', 'None Related')}
                          disabled={!isFormEditable}
                        />
                        None Related
                      </label>
                      <label className="registration-setup-compulsory-label reg-status-radio-label">
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

              {/* PEP and FATCA Row */}
              <div className="reg-flex-wrap-gap16-mb16" style={{ marginTop: '16px' }}>
                {/* Politically Exposed Person (PEP) */}
                <div className="reg-flex-nowrap-gap16">
                  <label className="setup-input-label reg-label-bold-mb12 reg-label-min220" style={{ marginBottom: 0 }}>
                    Politically Exposed Person (PEP)
                  </label>
                  <select
                    className="setup-select-field reg-select-min140"
                    value={formData.pepStatus}
                    onChange={e => handleInputChange('pepStatus', e.target.value)}
                    disabled={!isFormEditable}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* FATCA Registered */}
                <div className="reg-flex-nowrap-gap16">
                  <label className="setup-input-label reg-label-bold-mb12 reg-label-min140" style={{ marginBottom: 0 }}>
                    FATCA Registered
                  </label>
                  <select
                    className="setup-select-field reg-select-min140"
                    value={formData.fatcaRegistered}
                    onChange={e => handleInputChange('fatcaRegistered', e.target.value)}
                    disabled={!isFormEditable}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

            </div>

          </div >
        );
      case 'Address/Bank Details':
        return (
          <div className="reg-w100pct">
            {/* Two Address Cards side by side with copy button in middle */}
            <div className="reg-grid-3addr">
              {/* Correspondence Address Card */}
              <div className="setup-ash-box reg-ash-box-padded">
                <div className="setup-input-label registration-setup-compulsory-label reg-label-bold-mb12">
                  Correspondence Address
                </div>
                <div className="reg-flex-col-gap12">
                  {/* Row 1: Street and Town */}
                  <div className="reg-grid-2col-gap12">
                    <div className="reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min55">Street</label>
                      {renderAddrCombobox('corrStreet', 'correspondenceStreet', formData.correspondenceStreet, streetOptions, 'Enter or select street')}
                    </div>
                    <div className="reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min45">Town</label>
                      {renderAddrCombobox('corrTown', 'correspondenceTown', formData.correspondenceTown, townOptions, 'Enter or select town')}
                    </div>
                  </div>
                  {/* Row 2: City and District */}
                  <div className="reg-grid-2col-gap12">
                    <div className="reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min55">City</label>
                      {renderAddrCombobox('corrCity', 'correspondenceCity', formData.correspondenceCity, cityOptions, 'Enter or select city')}
                    </div>
                    <div className="reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min55">District</label>
                      <select
                        className="setup-select-field reg-flex1"
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
                  <div className="reg-grid-3col-gap12">
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min55">Country</label>
                      <select
                        className="setup-select-field reg-flex1"
                        value={formData.correspondenceCountry}
                        onChange={e => handleInputChange('correspondenceCountry', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="India">India</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label" style={{ minWidth: '70px' }}>Postal Code</label>
                      <input
                        type="text"
                        value={formData.correspondencePostalCode}
                        onChange={(e) => handleInputChange('correspondencePostalCode', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1"
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '70px' }}>Postal Area</label>
                      <select
                        className="setup-select-field reg-flex1"
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
              <div className="reg-flex-col reg-flex-center-gap16" style={{ paddingTop: '60px' }}>
                <button
                  onClick={handleCopyAddress}
                  disabled={!isFormEditable}
                  className="reg-btn-copy-addr"
                  style={{ marginTop: 0 }}
                >
                  ==&gt;&gt;
                </button>
                <div style={{ color: '#0ea5e9', fontSize: '10px', textAlign: 'center', maxWidth: '100px', fontWeight: 600 }}>
                  Click If Correspondence Address And The Personal Address are the Same
                </div>
              </div>

              {/* Personal / Permanent Address Card */}
              <div className="setup-ash-box reg-ash-box-padded">
                <div className="setup-input-label registration-setup-compulsory-label reg-label-bold-mb12">
                  Personal / Permanent Address
                </div>
                <div className="reg-flex-col-gap12">
                  {/* Row 1: Street and Town */}
                  <div className="reg-grid-2col-gap12">
                    <div className="reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min55">Street</label>
                      {renderAddrCombobox('permStreet', 'permanentStreet', formData.permanentStreet, streetOptions, 'Enter or select street')}
                    </div>
                    <div className="reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min45">Town</label>
                      {renderAddrCombobox('permTown', 'permanentTown', formData.permanentTown, townOptions, 'Enter or select town')}
                    </div>
                  </div>
                  {/* Row 2: City and District */}
                  <div className="reg-grid-2col-gap12">
                    <div className="reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min55">City</label>
                      {renderAddrCombobox('permCity', 'permanentCity', formData.permanentCity, cityOptions, 'Enter or select city')}
                    </div>
                    <div className="reg-flex-shrink0 reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min55">District</label>
                      <select
                        className="setup-select-field reg-flex1"
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
                  <div className="reg-grid-3col-gap12">
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min55">Country</label>
                      <select
                        className="setup-select-field reg-flex1"
                        value={formData.permanentCountry}
                        onChange={e => handleInputChange('permanentCountry', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="India">India</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label" style={{ minWidth: '70px' }}>Postal Code</label>
                      <input
                        type="text"
                        value={formData.permanentPostalCode}
                        onChange={(e) => handleInputChange('permanentPostalCode', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1"
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '70px' }}>Postal Area</label>
                      <select
                        className="setup-select-field reg-flex1"
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', width: '100%', marginBottom: '24px' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Row 1: Bank */}
                <div className="reg-flex-nowrap-gap16">
                  <label className="setup-input-label registration-setup-compulsory-label reg-label-min60">Bank</label>
                  <select
                    className="setup-select-field reg-flex1"
                    value={formData.bank}
                    onChange={e => handleInputChange('bank', e.target.value)}
                    disabled={!isFormEditable}
                  >
                    <option value="">Select Bank</option>
                    <option value="BOC">Bank of Ceylon</option>
                    <option value="PB">People's Bank</option>
                    <option value="HNB">Hatton National Bank</option>
                  </select>
                </div>
                {/* Row 2: Branch */}
                <div className="reg-flex-nowrap-gap16">
                  <label className="setup-input-label reg-label-min60">Branch</label>
                  <div className="reg-relative reg-flex1" data-branch-table>
                    <div
                      className="setup-input-field reg-company-select-box reg-text-black"
                      onClick={() => isFormEditable && setShowBranchTable(!showBranchTable)}
                    >
                      {formData.branchNo || 'Select Branch'}
                    </div>
                    {showBranchTable && isFormEditable && (
                      <div className="reg-company-dropdown">
                        <table className="reg-company-table reg-text-black">
                          <thead>
                            <tr className="reg-bg-header reg-border-bottom-gray">
                              <th className="reg-company-th" onClick={() => handleTableSort('branch', 'code')}>
                                Code {renderSortIndicator('branch', 'code')}
                              </th>
                              <th className="reg-company-th-last" onClick={() => handleTableSort('branch', 'description')}>
                                Description {renderSortIndicator('branch', 'description')}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getSortedData('branch', branchData).map((branch, idx) => {
                              const value = `${branch.code} - ${branch.description}`;
                              return (
                                <tr key={idx} onClick={() => { handleInputChange('branchNo', value); setShowBranchTable(false); }} className="reg-company-tr" style={{ backgroundColor: formData.branchNo === value ? '#f3e8ff' : '#ffffff' }}>
                                  <td className="reg-company-td">{branch.code}</td>
                                  <td className="reg-company-td-last">{branch.description}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Column 3: Account Type + Account No */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Row 1: Account Type */}
                <div className="reg-flex-nowrap-gap16">
                  <label className="setup-input-label registration-setup-compulsory-label reg-label-min100">Account Type</label>
                  <select
                    className="setup-select-field reg-flex1"
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
                {/* Row 2: Account No + Add Button */}
                <div className="reg-flex-nowrap-gap16">
                  <label className="setup-input-label registration-setup-compulsory-label reg-label-min100">Account No</label>
                  <input
                    type="text"
                    value={formData.accountNo}
                    onChange={(e) => handleInputChange('accountNo', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field reg-flex1"
                    placeholder="Enter account number"
                  />
                  <button
                    onClick={handleAddBankAccount}
                    disabled={!isFormEditable}
                    className="reg-btn-copy-addr"
                    style={{
                      backgroundColor: '#a16207', color: '#ffffff',
                      marginTop: 0, minWidth: '40px', height: '32px'
                    }}
                    title="Add Bank Account"
                  >↓</button>
                </div>
              </div>
            </div>

            {/* Bank Accounts Table - Full Width */}
            <div style={{ width: '100%', marginTop: '16px' }}>
              <table className="reg-bank-accounts-table">
                <thead>
                  <tr className="reg-portal-thead">
                    <th className="reg-bank-accounts-th" style={{ borderRight: '1px solid #cbd5e1' }}>Bank Code</th>
                    <th className="reg-bank-accounts-th" style={{ borderRight: '1px solid #cbd5e1' }}>Account No.</th>
                    <th className="reg-bank-accounts-th" style={{ borderRight: '1px solid #cbd5e1' }}>Account Type</th>
                    <th className="reg-bank-accounts-th">Bank Name</th>
                  </tr>
                </thead>
                <tbody>
                  {bankAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="empty-cell" style={{ padding: '16px' }}>
                        No bank accounts added
                      </td>
                    </tr>
                  ) : (
                    bankAccounts.map((account, index) => (
                      <tr key={index}>
                        <td className="reg-bank-accounts-td" style={{ borderRight: '1px solid #e2e8f0' }}>{account.bankCode}</td>
                        <td className="reg-bank-accounts-td" style={{ borderRight: '1px solid #e2e8f0' }}>{account.accountNo}</td>
                        <td className="reg-bank-accounts-td" style={{ borderRight: '1px solid #e2e8f0' }}>{account.accountType}</td>
                        <td className="reg-bank-accounts-td">{account.bankName}</td>
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
                className="btn btn-clear"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#dc2626',
                  border: '1px solid #cbd5e1',
                  marginTop: '12px'
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
            <div className="setup-ash-box reg-ash-box-padded reg-w100pct">
              {/* Office Details Section */}
              <div className="reg-margin-bottom24">
                <div className="setup-input-label registration-setup-compulsory-label reg-label-bold-mb12">
                  Office Details
                </div>
                <div className="reg-flex-col-gap12">
                  {/* Row 1: Occupation, Office Name, Street, Town */}
                  <div className="reg-grid-4col-repeat">
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">Occupation</label>
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1"
                        placeholder="Enter occupation"
                      />
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">Office Name</label>
                      <input
                        type="text"
                        value={formData.officeName}
                        onChange={(e) => handleInputChange('officeName', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1"
                        placeholder="Enter office name"
                      />
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">Street</label>
                      {renderAddrCombobox('offStreet', 'officeStreet', formData.officeStreet, streetOptions, 'Enter or select street')}
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">Town</label>
                      {renderAddrCombobox('offTown', 'officeTown', formData.officeTown, townOptions, 'Enter or select town')}
                    </div>
                  </div>
                  {/* Row 2: City, Postal Code, Country, Tele. */}
                  <div className="reg-grid-4col-repeat">
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">City</label>
                      {renderAddrCombobox('offCity', 'officeCity', formData.officeCity, cityOptions, 'Enter or select city')}
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">Postal Code</label>
                      <input
                        type="text"
                        value={formData.officePostalCode}
                        onChange={(e) => handleInputChange('officePostalCode', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1"
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">Country</label>
                      <select
                        className="setup-select-field reg-flex1"
                        value={formData.officeCountry}
                        onChange={e => handleInputChange('officeCountry', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="India">India</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">Tele.</label>
                      <input
                        type="text"
                        value={formData.officeTele}
                        onChange={(e) => handleInputChange('officeTele', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1"
                        placeholder="Enter telephone"
                      />
                    </div>
                  </div>
                  {/* Row 3: Fax No., E-mail, Web Registration? */}
                  <div className="reg-grid-4col-repeat">
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">Fax No.</label>
                      <input
                        type="text"
                        value={formData.officeFaxNo}
                        onChange={(e) => handleInputChange('officeFaxNo', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1"
                        placeholder="Enter fax number"
                      />
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">E-mail</label>
                      <input
                        type="email"
                        value={formData.officeEmail}
                        onChange={(e) => handleInputChange('officeEmail', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-input-field reg-flex1"
                        placeholder="Enter email"
                      />
                    </div>
                    <div className="reg-flex-nowrap-gap16">
                      <label className="setup-input-label reg-label-min100">Web Registerd?</label>
                      <select
                        className="setup-select-field reg-flex1"
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
                    className={`reg-signature-canvas ${isFormEditable ? 'reg-cursor-pointer' : 'reg-cursor-default'}`}
                  />
                  <div className="reg-absolute-bottom-right reg-flex reg-gap8">
                    <button
                      onClick={clearSignature}
                      disabled={!isFormEditable}
                      className={`btn btn-new reg-btn-red ${isFormEditable ? 'reg-cursor-pointer' : 'reg-cursor-default'}`}
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
                      className={`btn btn-new reg-btn-sky ${isFormEditable ? 'reg-cursor-pointer' : 'reg-cursor-default'}`}
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
              <div className="setup-ash-box reg-p16">
                {/* Row 1: 4 Columns */}
                <div className="reg-grid-4col-24">
                  {/* Column 1: If Personal Customer Applicant label + checkbox */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label registration-setup-compulsory-label reg-fw600 reg-mb4">
                      If Personal Customer Applicant
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input
                        type="checkbox"
                        checked={formData.married}
                        onChange={(e) => setFormData(prev => ({ ...prev, married: e.target.checked }))}
                        disabled={!isFormEditable}
                        className={`reg-accent-purple ${isFormEditable ? 'reg-cursor-pointer' : 'reg-cursor-default'}`}
                      />
                      Married
                    </label>
                  </div>
                  {/* Column 2: Spouse's Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label reg-label-w120">Spouse's Name</label>
                    <input type="text" value={formData.spouseName} onChange={(e) => handleInputChange('spouseName', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter spouse's name" />
                  </div>
                  {/* Column 3: Spouse's Occupation */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label reg-label-w120">Spouse's Occupation</label>
                    <input type="text" value={formData.spouseOccupation} onChange={(e) => handleInputChange('spouseOccupation', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter spouse's occupation" />
                  </div>
                  {/* Column 4: Spouse's Employer */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label reg-label-w120">Spouse's Employer</label>
                    <input type="text" value={formData.spouseEmployer} onChange={(e) => handleInputChange('spouseEmployer', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter spouse's employer" />
                  </div>
                </div>

                {/* Row 2: 4 Columns — Currency | Annual Income | Source of Income | Risk Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>

                  {/* Column 1: Currency — table dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label" style={{ minWidth: '70px' }}>Currency</label>
                    <div style={{ position: 'relative', flex: 1 }} data-table="currency">
                      <div
                        className={`setup-input-field ${isFormEditable ? 'reg-cursor-pointer' : 'reg-cursor-default'} ${formData.incomeCurrency ? 'reg-text-black' : 'setup-placeholder-color'} reg-flex-center`}
                        onClick={() => isFormEditable && setShowCurrencyTable(!showCurrencyTable)}
                      >
                        {formData.incomeCurrency || 'Select Currency'}
                      </div>
                      {showCurrencyTable && isFormEditable && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', minWidth: '320px', maxHeight: '240px', overflowY: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', zIndex: 10 }}>
                              <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                                <th
                                  className="reg-p8-12 reg-text-left reg-text-black reg-cursor-pointer reg-user-select-none reg-border-right reg-fs12"
                                  onClick={() => handleTableSort('currency', 'code')}
                                >Code{renderSortIndicator('currency', 'code')}</th>
                                <th
                                  style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none', fontSize: '12px' }}
                                  onClick={() => handleTableSort('currency', 'description')}
                                >Description{renderSortIndicator('currency', 'description')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getSortedData('currency', currencyData).map((item, i) => (
                                <tr
                                  key={i}
                                  onMouseDown={e => { e.preventDefault(); handleInputChange('incomeCurrency', `${item.code} - ${item.description}`); setShowCurrencyTable(false); }}
                                  style={{ cursor: 'pointer', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                >
                                  <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000', fontSize: '13px' }}>{item.code}</td>
                                  <td style={{ padding: '8px 12px', color: '#000000', fontSize: '13px' }}>{item.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Annual Income — table dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>Annual Income</label>
                    <div style={{ position: 'relative', flex: 1 }} data-table="annualIncome">
                      <div
                        className="setup-input-field"
                        onClick={() => isFormEditable && setShowAnnualIncomeTable(!showAnnualIncomeTable)}
                        style={{ cursor: isFormEditable ? 'pointer' : 'default', color: formData.annualIncome ? '#000000' : '#64748b', display: 'flex', alignItems: 'center' }}
                      >
                        {formData.annualIncome || 'Select Annual Income'}
                      </div>
                      {showAnnualIncomeTable && isFormEditable && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', minWidth: '320px', maxHeight: '240px', overflowY: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', zIndex: 10 }}>
                              <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                                <th
                                  className="reg-p8-12 reg-text-left reg-text-black reg-cursor-pointer reg-user-select-none reg-border-right reg-fs12"
                                  onClick={() => handleTableSort('annualIncome', 'code')}
                                >Code{renderSortIndicator('annualIncome', 'code')}</th>
                                <th
                                  style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none', fontSize: '12px' }}
                                  onClick={() => handleTableSort('annualIncome', 'description')}
                                >Description{renderSortIndicator('annualIncome', 'description')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getSortedData('annualIncome', annualIncomeData).map((item, i) => (
                                <tr
                                  key={i}
                                  onMouseDown={e => { e.preventDefault(); handleInputChange('annualIncome', `${item.code} - ${item.description}`); setShowAnnualIncomeTable(false); }}
                                  style={{ cursor: 'pointer', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                >
                                  <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000', fontSize: '13px' }}>{item.code}</td>
                                  <td style={{ padding: '8px 12px', color: '#000000', fontSize: '13px' }}>{item.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Source of Income — table dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label" style={{ minWidth: '120px' }}>Source of Income</label>
                    <div style={{ position: 'relative', flex: 1 }} data-table="sourceOfIncome">
                      <div
                        className="setup-input-field"
                        onClick={() => isFormEditable && setShowSourceOfIncomeTable(!showSourceOfIncomeTable)}
                        style={{ cursor: isFormEditable ? 'pointer' : 'default', color: formData.sourceOfIncome ? '#000000' : '#64748b', display: 'flex', alignItems: 'center' }}
                      >
                        {formData.sourceOfIncome || 'Select Source of Income'}
                      </div>
                      {showSourceOfIncomeTable && isFormEditable && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', minWidth: '320px', maxHeight: '240px', overflowY: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', zIndex: 10 }}>
                              <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                                <th
                                  className="reg-p8-12 reg-text-left reg-text-black reg-cursor-pointer reg-user-select-none reg-border-right reg-fs12"
                                  onClick={() => handleTableSort('sourceOfIncome', 'code')}
                                >Code{renderSortIndicator('sourceOfIncome', 'code')}</th>
                                <th
                                  style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none', fontSize: '12px' }}
                                  onClick={() => handleTableSort('sourceOfIncome', 'description')}
                                >Description{renderSortIndicator('sourceOfIncome', 'description')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getSortedData('sourceOfIncome', sourceOfIncomeData).map((item, i) => (
                                <tr
                                  key={i}
                                  onMouseDown={e => { e.preventDefault(); handleInputChange('sourceOfIncome', `${item.code} - ${item.description}`); setShowSourceOfIncomeTable(false); }}
                                  style={{ cursor: 'pointer', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                >
                                  <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000', fontSize: '13px' }}>{item.code}</td>
                                  <td style={{ padding: '8px 12px', color: '#000000', fontSize: '13px' }}>{item.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 4: Risk Category */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '110px' }}>Risk Category</label>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <select
                        className="setup-select-field reg-text-black reg-flex-1"
                        value={formData.riskCategory}
                        onChange={e => handleInputChange('riskCategory', e.target.value)}
                        disabled={!isFormEditable}
                      >
                        <option value="">-- Select --</option>
                        <option value="Low">Low</option>
                        <option value="Low - Medium">Low - Medium</option>
                        <option value="Medium">Medium</option>
                        <option value="Medium - High">Medium - High</option>
                        <option value="High">High</option>
                        <option value="Very High">Very High</option>
                      </select>
                      {formData.riskCategory && (
                        <span className={`reg-risk-badge ${formData.riskCategory === 'Low' ? 'risk-low' :
                          formData.riskCategory === 'Low - Medium' ? 'risk-low-medium' :
                            formData.riskCategory === 'Medium' ? 'risk-medium' :
                              formData.riskCategory === 'Medium - High' ? 'risk-medium-high' :
                                formData.riskCategory === 'High' ? 'risk-high' : 'risk-very-high'
                          }`}>{formData.riskCategory}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Corporate sections remain unchanged */}
            {formData.applicantType === 'Corporate' && (
              <div className="setup-ash-box" style={{ padding: '16px', marginTop: '24px' }}>
                <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '12px' }}>
                  If Corporate Applicant
                </div>
                <div className="reg-grid-3col-custom">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
                    <label className="setup-input-label" style={{ margin: 0 }}>Are you a Subsidiary / Associate of another organization?</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="radio" name="isSubsidiaryAssociate" checked={formData.isSubsidiaryAssociate === 'Yes'} onChange={() => handleInputChange('isSubsidiaryAssociate', 'Yes')} disabled={!isFormEditable} style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }} />
                      Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="radio" name="isSubsidiaryAssociate" checked={formData.isSubsidiaryAssociate === 'No'} onChange={() => handleInputChange('isSubsidiaryAssociate', 'No')} disabled={!isFormEditable} style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }} />
                      No
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
                    <div className="setup-input-label" style={{ fontWeight: 600, margin: 0 }}>Ownership</div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="radio" name="ownershipType" checked={formData.ownershipType === 'Subsidiary'} onChange={() => handleInputChange('ownershipType', 'Subsidiary')} disabled={!isFormEditable} style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }} />
                      Subsidiary
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="radio" name="ownershipType" checked={formData.ownershipType === 'Associate'} onChange={() => handleInputChange('ownershipType', 'Associate')} disabled={!isFormEditable} style={{ accentColor: '#9333ea', cursor: isFormEditable ? 'pointer' : 'default' }} />
                      Associate
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px' }}>Organization</label>
                    <input type="text" value={formData.organizationName} onChange={(e) => handleInputChange('organizationName', e.target.value)} disabled={!isFormEditable} className="setup-input-field" placeholder="Enter organization name" style={{ color: '#000000', flex: 1 }} />
                  </div>
                </div>
              </div>
            )}

            {formData.applicantType === 'Corporate' && (
              <div className="setup-ash-box" style={{ padding: '16px', marginTop: '24px' }}>
                <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '16px' }}>Contact Person</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <label className="setup-input-label" style={{ minWidth: '80px' }}>Title</label>
                      <select className="setup-select-field" style={{ color: '#000000', flex: 1 }} value={formData.contactPersonTitle} onChange={e => handleInputChange('contactPersonTitle', e.target.value)} disabled={!isFormEditable}>
                        <option value="">Select Title</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>
                    <div className="reg-flex-center reg-gap8 reg-w100pct">
                      <label className="setup-input-label reg-min-w80">Initials</label>
                      <input type="text" value={formData.contactPersonInitials} onChange={(e) => handleInputChange('contactPersonInitials', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter initials" />
                    </div>
                    <div className="reg-flex-center reg-gap8 reg-w100pct">
                      <label className="setup-input-label reg-min-w80">First Name</label>
                      <input type="text" value={formData.contactPersonFirstName} onChange={(e) => handleInputChange('contactPersonFirstName', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter first name" />
                    </div>
                    <div className="reg-flex-center reg-gap8 reg-w100pct">
                      <label className="setup-input-label reg-min-w80">Surname</label>
                      <input type="text" value={formData.contactPersonSurname} onChange={(e) => handleInputChange('contactPersonSurname', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter surname" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                    <div className="reg-flex-center reg-gap8 reg-w100pct">
                      <label className="setup-input-label reg-min-w80">Designation</label>
                      <input type="text" value={formData.contactPersonDesignation} onChange={(e) => handleInputChange('contactPersonDesignation', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter designation" />
                    </div>
                    <div className="reg-flex-center reg-gap8 reg-w100pct">
                      <label className="setup-input-label reg-min-w80">Address</label>
                      <input type="text" value={formData.contactPersonAddress} onChange={(e) => handleInputChange('contactPersonAddress', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter address" />
                    </div>
                    <div className="reg-flex-center reg-gap8 reg-w100pct">
                      <label className="setup-input-label reg-min-w80">Telephone</label>
                      <input type="text" value={formData.contactPersonTelephone} onChange={(e) => handleInputChange('contactPersonTelephone', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter telephone" />
                    </div>
                    <div className="reg-flex-center reg-gap8 reg-w100pct">
                      <label className="setup-input-label reg-min-w80">Fax</label>
                      <input type="text" value={formData.contactPersonFax} onChange={(e) => handleInputChange('contactPersonFax', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter fax" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '24% 24% 24% 24%', gap: '12px', width: '100%' }}>
                    <div className="reg-flex-center reg-gap8 reg-w100pct">
                      <label className="setup-input-label reg-min-w80">E-Mail</label>
                      <input type="email" value={formData.contactPersonEmail} onChange={(e) => handleInputChange('contactPersonEmail', e.target.value)} disabled={!isFormEditable} className="setup-input-field reg-text-black reg-flex-1" placeholder="Enter email" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* How did you hear about us? — Promotion uses table dropdown */}
            <div className="reg-mt24 reg-border-top reg-pt16">
              <div className="setup-input-label reg-fw600 reg-mb12">
                How did you hear about us?
              </div>
              <div className="reg-flex-center reg-gap16 reg-flex-wrap">
                {['Media', 'Promotion', 'Referral', 'Call Centre', 'Other'].map(option => (
                  <label key={option} className="reg-flex-center reg-gap8 reg-text-black">
                    <input
                      type="radio"
                      name="heardAboutUs"
                      checked={formData.heardAboutUs === option}
                      onChange={() => {
                        handleInputChange('heardAboutUs', option as typeof formData.heardAboutUs);
                        if (option !== 'Promotion') handleInputChange('promotionOther', '');
                      }}
                      disabled={!isFormEditable}
                      className={`reg-accent-purple ${isFormEditable ? 'reg-cursor-pointer' : 'reg-cursor-default'}`}
                    />
                    {option}
                  </label>
                ))}

                {/* Promotion table dropdown */}
                {formData.heardAboutUs === 'Promotion' && (
                  <div className="reg-flex-center reg-gap8">
                    <label className="setup-input-label reg-min-w80">Promotion</label>
                    <div className="reg-relative reg-min-w280" data-table="promotion">
                      <div
                        className="setup-input-field"
                        onClick={() => isFormEditable && setShowPromotionTable(!showPromotionTable)}
                        style={{ cursor: isFormEditable ? 'pointer' : 'default', color: formData.promotionOther ? '#000000' : '#64748b', display: 'flex', alignItems: 'center' }}
                      >
                        {formData.promotionOther || 'Select Promotion'}
                      </div>
                      {showPromotionTable && isFormEditable && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', minWidth: '580px', maxHeight: '260px', overflowY: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', zIndex: 10 }}>
                              <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                                <th
                                  className="reg-p8-12 reg-text-left reg-text-black reg-cursor-pointer reg-user-select-none reg-border-right reg-fs12"
                                  onClick={() => handleTableSort('promotion', 'promotionCode')}
                                >Promotion Code{renderSortIndicator('promotion', 'promotionCode')}</th>
                                <th
                                  className="reg-p8-12 reg-text-left reg-text-black reg-cursor-pointer reg-user-select-none reg-border-right reg-fs12"
                                  onClick={() => handleTableSort('promotion', 'promotionDescription')}
                                >Promotion Description{renderSortIndicator('promotion', 'promotionDescription')}</th>
                                <th
                                  style={{ padding: '8px 12px', textAlign: 'left', color: '#000000', cursor: 'pointer', userSelect: 'none', fontSize: '12px' }}
                                  onClick={() => handleTableSort('promotion', 'description')}
                                >Description{renderSortIndicator('promotion', 'description')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getSortedData('promotion', promotionData).map((item, i) => (
                                <tr
                                  key={i}
                                  onMouseDown={e => { e.preventDefault(); handleInputChange('promotionOther', `${item.promotionCode} - ${item.promotionDescription}`); setShowPromotionTable(false); }}
                                  style={{ cursor: 'pointer', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                >
                                  <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000', fontSize: '13px' }}>{item.promotionCode}</td>
                                  <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000', fontSize: '13px' }}>{item.promotionDescription}</td>
                                  <td style={{ padding: '8px 12px', color: '#000000', fontSize: '13px' }}>{item.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
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
                      className="setup-input-field reg-text-black"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={newDirector.designation}
                      onChange={(e) => handleNewDirectorChange('designation', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-text-black"
                      placeholder="Designation"
                    />
                    <input
                      type="text"
                      value={newDirector.nic}
                      onChange={(e) => handleNewDirectorChange('nic', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-text-black"
                      placeholder="NIC"
                    />
                    <input
                      type="text"
                      value={newDirector.shares}
                      onChange={(e) => handleNewDirectorChange('shares', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-text-black"
                      placeholder="Shares"
                    />
                    <input
                      type="text"
                      value={newDirector.contactNo}
                      onChange={(e) => handleNewDirectorChange('contactNo', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-text-black"
                      placeholder="Contact No"
                    />
                    <input
                      type="text"
                      value={newDirector.address}
                      onChange={(e) => handleNewDirectorChange('address', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field reg-text-black"
                      placeholder="Address"
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
          <div className="reg-w100pct">
            {/* Statement Delivery */}
            <div className="reg-mb16">
              <label className="setup-input-label reg-fw600 reg-mr16">
                How do you wish to receive Statement ?
              </label>
              <label className="reg-mr18 reg-inline-flex reg-flex-center reg-gap8 reg-text-black">
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
              <label className="reg-mr18 reg-inline-flex reg-flex-center reg-gap8 reg-text-black">
                <input
                  type="radio"
                  name="statementDelivery"
                  checked={formData.statementDelivery === 'E-Mail'}
                  onChange={() => handleInputChange('statementDelivery', 'E-Mail')}
                  disabled={!isFormEditable}
                  className={`reg-accent-purple ${isFormEditable ? 'reg-cursor-pointer' : 'reg-cursor-default'}`}
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
            <div className="reg-grid-2col">
              {/* E-Mail Card */}
              <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
                <label className="reg-flex-center reg-gap8 reg-fw600 reg-text-black reg-mb12">
                  <input
                    type="checkbox"
                    checked={formData.emailNotifyEnabled}
                    onChange={(e) => handleInputChange('emailNotifyEnabled', e.target.checked)}
                    disabled={!isFormEditable}
                    className={`reg-accent-purple ${isFormEditable ? 'reg-cursor-pointer' : 'reg-cursor-default'}`}
                  />
                  Send me E-Mail on
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                  {/* Column 1: Confirmation of Investment, Confirmation of Redemption */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.emailConfirmInvestment} onChange={(e) => handleInputChange('emailConfirmInvestment', e.target.checked)} disabled={!isFormEditable || !formData.emailNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Investment
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.emailConfirmRedemption} onChange={(e) => handleInputChange('emailConfirmRedemption', e.target.checked)} disabled={!isFormEditable || !formData.emailNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Redemption
                    </label>
                  </div>
                  {/* Column 2: Unit Balance, Daily Unit Price */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.emailUnitBalance} onChange={(e) => handleInputChange('emailUnitBalance', e.target.checked)} disabled={!isFormEditable || !formData.emailNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Unit Balance - Confirmation
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.emailDailyUnitPrice} onChange={(e) => handleInputChange('emailDailyUnitPrice', e.target.checked)} disabled={!isFormEditable || !formData.emailNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Daily Unit Price
                    </label>
                  </div>
                </div>
              </div>

              {/* SMS Card */}
              <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
                <label className="reg-flex-center reg-gap8 reg-fw600 reg-text-black reg-mb12">
                  <input
                    type="checkbox"
                    checked={formData.smsNotifyEnabled}
                    onChange={(e) => handleInputChange('smsNotifyEnabled', e.target.checked)}
                    disabled={!isFormEditable}
                    className={`reg-accent-purple ${isFormEditable ? 'reg-cursor-pointer' : 'reg-cursor-default'}`}
                  />
                  Send me SMS on
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                  {/* Column 1: Confirmation of Investment, Confirmation of Redemption */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.smsConfirmInvestment} onChange={(e) => handleInputChange('smsConfirmInvestment', e.target.checked)} disabled={!isFormEditable || !formData.smsNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Investment
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.smsConfirmRedemption} onChange={(e) => handleInputChange('smsConfirmRedemption', e.target.checked)} disabled={!isFormEditable || !formData.smsNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Confirmation of Redemption
                    </label>
                  </div>
                  {/* Column 2: Unit Balance, Daily Unit Price */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.smsUnitBalance} onChange={(e) => handleInputChange('smsUnitBalance', e.target.checked)} disabled={!isFormEditable || !formData.smsNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Unit Balance - Confirmation
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                      <input type="checkbox" checked={formData.smsDailyUnitPrice} onChange={(e) => handleInputChange('smsDailyUnitPrice', e.target.checked)} disabled={!isFormEditable || !formData.smsNotifyEnabled} style={{ accentColor: '#9333ea' }} />
                      Daily Unit Price
                    </label>
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
                            className="setup-input-field reg-text-black"
                            placeholder=""
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
                <span className="setup-input-label reg-text-black">Select All</span>
              </div>
            </div>
          </div>
        );
      case 'Office Use Details':
        return (
          <div className="reg-w100pct">
            {/* First Row: Investment Type and Investor Category - 2 columns 1fr each */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%', marginBottom: '24px' }}>
              {/* Left Column: Investment Type at Registration */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: '220px' }}>Investment Type at Registration</label>
                <select
                  className="setup-select-field"
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
                <select className="setup-select-field" style={{ color: '#000000', flex: 1 }} value={formData.investorCategory} onChange={e => handleInputChange('investorCategory', e.target.value)} disabled={!isFormEditable}>
                  <option value="">Corporate</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
            </div>

            {/* Second Row: Agents Card (left) and Officers Card (right) - 2 columns 50% each */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%' }}>
              {/* Left: Agents Card - 3 columns */}
              <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
                <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Agents</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', width: '100%' }}>
                  {/* Column 1: Agency */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <label className="setup-input-label registration-setup-compulsory-label" style={{ minWidth: 'auto', marginBottom: '4px' }}>Agency</label>
                    <div style={{ position: 'relative', width: '100%' }} data-table="agency">
                      <div
                        className="setup-input-field"
                        onClick={() => isFormEditable && setShowAgencyTable(!showAgencyTable)}
                        style={{ cursor: isFormEditable ? 'pointer' : 'default', color: formData.officeAgency ? '#0f172a' : '#64748b', display: 'flex', alignItems: 'center', width: '100%' }}
                      >
                        {formData.officeAgency || 'Select agency'}
                      </div>
                      {showAgencyTable && isFormEditable && (
                        <div data-table="agency" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr className="reg-bg-header reg-border-bottom-gray">
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
                        className="setup-input-field"
                        onClick={() => isFormEditable && setShowSubAgencyTable(!showSubAgencyTable)}
                        style={{
                          cursor: isFormEditable ? 'pointer' : 'default', color: formData.officeSubAgency ? '#0f172a' : '#64748b',
                          display: 'flex', alignItems: 'center', width: '100%'
                        }}
                      >
                        {formData.officeSubAgency || 'Select sub agency'}
                      </div>
                      {showSubAgencyTable && isFormEditable && (
                        <div data-table="subagency" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr className="reg-bg-header reg-border-bottom-gray">
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
                        className="setup-input-field"
                        onClick={() => isFormEditable && setShowAgentTable(!showAgentTable)}
                        style={{ cursor: isFormEditable ? 'pointer' : 'default', color: formData.officeAgent ? '#0f172a' : '#64748b', display: 'flex', alignItems: 'center', width: '100%' }}
                      >
                        {formData.officeAgent || 'Select agent'}
                      </div>
                      {showAgentTable && isFormEditable && (
                        <div data-table="agent" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr className="reg-bg-header reg-border-bottom-gray">
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', width: '100%' }}>
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
      if (showAnnualIncomeTable && !target.closest('[data-table="annualIncome"]')) setShowAnnualIncomeTable(false);
      if (showSourceOfIncomeTable && !target.closest('[data-table="sourceOfIncome"]')) setShowSourceOfIncomeTable(false);
      if (showCurrencyTable && !target.closest('[data-table="currency"]')) setShowCurrencyTable(false);
      if (showPromotionTable && !target.closest('[data-table="promotion"]')) setShowPromotionTable(false);
    };

    if (showCompanyTable || showAgencyTable || showAnnualIncomeTable || showSourceOfIncomeTable || showCurrencyTable || showPromotionTable || showSubAgencyTable || showAgentTable || showFundTable || showReinvestFundTable || showPaymentTypeTable || showPayoutBankTable || showBankDetailsPaymentTypeTable || showBankDetailsBankTable || showApplicationNoTable) {
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
              <div className="reg-modal-overlay" onClick={() => setModalIdx(null)}>
                <div className="reg-modal-container" onClick={e => e.stopPropagation()}>

                  {/* FIXED: Header */}
                  <div className="reg-modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>{modules[modalIdx].icon}</span>
                      <span className="reg-modal-header-title">
                        {modules[modalIdx].title === 'Registration Unit Holders Profiles'
                          ? 'REGISTRATION UNIT HOLDERS PROFILES DETAILS'
                          : `${modules[modalIdx].title.toUpperCase()} DETAILS`}
                      </span>
                    </div>
                    <button onClick={() => setModalIdx(null)} className="reg-modal-close-btn">×</button>
                  </div>

                  {/* FIXED: Top search bar */}
                  <div className="reg-modal-topbar">
                    {renderModalContent()}
                  </div>

                  {/* FIXED: Action buttons */}
                  {modules[modalIdx]?.title !== 'Holder Document Handling' && (
                    <div className="reg-modal-actions">
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
                            cdsNo: '',
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
                            pepStatus: '',
                            fatcaRegistered: '',
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
                            riskCategory: '',
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
                            agencyCode: '',
                            subAgencyCode: '',
                            investorCategory: '',
                            verifyingOfficer: '',
                            inputOfficer: '',
                            authorizedOfficer: '',
                            ackNo: '',
                            registrationHolderName: '',
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

                  {/* FIXED: Sticky tab bar — always visible */}
                  {modules[modalIdx].title !== 'Holder Document Handling' && (
                    <div className="reg-tab-bar" role="tablist">
                      {(modules[modalIdx].title === 'Unit Holders Accounts'
                        ? ['Details', 'Bank Details', 'Existing Accounts']
                        : applicationTabs
                      ).map(tab => {
                        const isActive = modules[modalIdx].title === 'Unit Holders Accounts'
                          ? accountsActiveTab === tab
                          : activeTab === tab;
                        const handleClick = modules[modalIdx].title === 'Unit Holders Accounts'
                          ? () => setAccountsActiveTab(tab)
                          : () => setActiveTab(tab);
                        return (
                          <button
                            key={tab}
                            role="tab"
                            aria-selected={isActive}
                            className={`reg-tab${isActive ? ' active' : ''}`}
                            onClick={handleClick}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
                          >
                            {tab}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* SCROLLABLE: Body — tab content + Unit Holders content */}
                  <div className="reg-modal-body">
                    {/* Application Entry / Registration Unit Holders Profiles tab content */}
                    {modules[modalIdx].title !== 'Unit Holders Accounts' && modules[modalIdx].title !== 'Holder Document Handling' && (
                      <div className="reg-content-card">
                        {renderApplicationTabContent()}
                      </div>
                    )}

                    {/* Unit Holders Accounts tab content */}
                    {modules[modalIdx].title === 'Unit Holders Accounts' && (
                      <div className="reg-content-card">
                        {/* Tab content moved from old inline structure */}
                        <div>

                          {/* Tab content */}
                          <div>
                            {accountsActiveTab === 'Details' && (
                              <div className="reg-flex-col-gap12">
                                {/* First Row Info Grid */}
                                <div className="uha-info-grid" style={{ marginBottom: '16px' }}>
                                  <div className="uha-field-group">
                                    <div className="uha-selection-card" style={{ padding: '8px 12px', marginTop: 0 }}>
                                      <div className="uha-field-label">Fund</div>
                                      <div className="uha-select-wrap">
                                        <div onClick={() => isFormEditable && setShowFundTable(!showFundTable)} className={`uha-select-box ${formData.fund ? 'uha-text-black' : 'uha-placeholder'}`}>
                                          {formData.fund || 'Select fund'}
                                        </div>
                                        {showFundTable && isFormEditable && (
                                          <div data-table="fund" className="uha-dropdown-table-container">
                                            <table className="uha-dropdown-table">
                                              <thead>
                                                <tr>
                                                  <th onClick={() => handleTableSort('fund', 'name')}>Name</th>
                                                  <th onClick={() => handleTableSort('fund', 'code')}>Code</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {getSortedData('fund', fundData).map((fund, idx) => (
                                                  <tr key={idx} onClick={() => { handleInputChange('fund', `${fund.name} - ${fund.code}`); setShowFundTable(false); }}>
                                                    <td>{fund.name}</td>
                                                    <td>{fund.code}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="uha-field-group">
                                    <div className="uha-field-label">Account No</div>
                                    <input type="text" value={formData.accountNo} onChange={(e) => handleInputChange('accountNo', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Account No" readOnly />
                                  </div>
                                  <div className="uha-field-group">
                                    <div className="uha-field-label">Last Investment No</div>
                                    <input type="text" value={formData.lastInvestmentNo} onChange={(e) => handleInputChange('lastInvestmentNo', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Last Inv No" readOnly />
                                  </div>

                                  <div className="uha-field-group">
                                    <div className="uha-field-label">Active</div>
                                    <div className="uha-active-cell">
                                      <label className="uha-active-label">
                                        <input type="checkbox" checked={formData.isActive} onChange={(e) => handleInputChange('isActive', e.target.checked)} disabled={!isFormEditable} />
                                        <span>Active</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className="uha-info-grid" style={{ marginBottom: '16px', gridTemplateColumns: '1fr 1fr 2fr' }}>
                                  <div className="uha-field-group">
                                    <div className="uha-field-label">Holder ID</div>
                                    <input type="text" value={formData.holderId} onChange={(e) => handleInputChange('holderId', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Holder ID" />
                                  </div>
                                  <div className="uha-field-group">
                                    <div className="uha-field-label">Acc. Created On</div>
                                    <input type="date" value={formData.accCreatedOn} onChange={(e) => handleInputChange('accCreatedOn', e.target.value)} disabled={!isFormEditable} className="uha-text-input" onClick={(e) => { if (isFormEditable) { e.currentTarget.showPicker?.(); } }} />
                                  </div>
                                  <div className="uha-field-group">
                                    <div className="uha-field-label">CDS No</div>
                                    <input type="text" value={formData.cdsNo} onChange={(e) => handleInputChange('cdsNo', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="CDS No" style={{ height: '38px' }} />
                                  </div>
                                </div>

                                {/* ── Premium Joint/Nominee card ── */}
                                <div className="uha-section-card" style={{ marginTop: '4px' }}>
                                  {/* Sub-tab bar */}
                                  <div className="uha-subtab-bar" style={{ padding: '0 16px', background: '#f8fafc' }}>
                                    {['Joint Account Details', 'Nominee Details'].map(tab => (
                                      <button key={tab} className={`uha-subtab${accountHolderDetailsTab === tab ? ' active' : ''}`} onClick={() => setAccountHolderDetailsTab(tab)}>
                                        {tab}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Joint Account Details */}
                                  {accountHolderDetailsTab === 'Joint Account Details' && (
                                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                      {/* Account Holder Type */}
                                      <div>
                                        <div className="uha-field-label" style={{ marginBottom: '10px' }}>Account Holder Type</div>
                                        <div className="uha-holder-type-group">
                                          {(['Individual', 'Joint', 'Guardian'] as const).map(type => (
                                            <label key={type} className="uha-radio-option">
                                              <input type="radio" name="accountHolderType" value={type} checked={formData.accountHolderType === type} onChange={(e) => handleInputChange('accountHolderType', e.target.value as 'Individual' | 'Joint' | 'Guardian')} disabled={!isFormEditable} />
                                              {type}
                                            </label>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Holder search inputs */}
                                      {formData.accountHolderType !== 'Individual' && (
                                        <div className="uha-holder-input-row">
                                          <div className="uha-field-group">
                                            <div className="uha-field-label">{formData.accountHolderType === 'Joint' ? 'Joint Holder ID' : 'Guardian ID'}</div>
                                            <div className="uha-field-row">
                                              <input type="text" value={formData.accountHolderType === 'Joint' ? formData.jointHolderInput : formData.guardianInput} onChange={(e) => handleInputChange(formData.accountHolderType === 'Joint' ? 'jointHolderInput' : 'guardianInput', e.target.value)} disabled={!isFormEditable} readOnly className="uha-text-input" placeholder="Enter Holder ID" />
                                              <button className="uha-icon-btn uha-icon-btn-search" title="Search" onClick={() => { if (formData.accountHolderType === 'Joint') setIsJointHolderSearchModalOpen(true); else if (formData.accountHolderType === 'Guardian') setIsGuardianSearchModalOpen(true); }} disabled={!isFormEditable}>🔍</button>
                                            </div>
                                          </div>
                                          <div className="uha-field-group">
                                            <div className="uha-field-label">Holder Name</div>
                                            <div className="uha-field-row">
                                              <input type="text" value={formData.rightInput} onChange={(e) => handleInputChange('rightInput', e.target.value)} disabled={!isFormEditable} readOnly className="uha-text-input" placeholder="Name (auto-filled)" />
                                              <button className="uha-icon-btn uha-icon-btn-add" title="Add to list" onClick={() => { if (formData.rightInput.trim()) { const holderNoVal = formData.accountHolderType === 'Joint' ? formData.jointHolderInput : formData.guardianInput; const newHolder: HolderInfo = { holderNo: holderNoVal || String(jointHolders.length + 1), holderName: formData.rightInput.trim(), selected: false }; setJointHolders([...jointHolders, newHolder]); handleInputChange('rightInput', ''); handleInputChange('jointHolderInput', ''); handleInputChange('guardianInput', ''); } }} disabled={!isFormEditable || !formData.rightInput.trim()}>+</button>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Holders table */}
                                      {formData.accountHolderType !== 'Individual' && (
                                        <div className="uha-holders-table-wrap">
                                          <table className="uha-holders-table">
                                            <thead>
                                              <tr>
                                                <th>Holder No</th>
                                                <th>Holder Name</th>
                                                <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {jointHolders.length === 0 ? (
                                                <tr className="uha-empty-row"><td colSpan={3}>No holders added yet</td></tr>
                                              ) : (
                                                jointHolders.map((holder, idx) => (
                                                  <tr key={idx}>
                                                    <td>{holder.holderNo}</td>
                                                    <td>{holder.holderName}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                      <button className="uha-icon-btn uha-icon-btn-remove" title="Remove" onClick={() => setJointHolders(jointHolders.filter((_, i) => i !== idx))} disabled={!isFormEditable}>✕</button>
                                                    </td>
                                                  </tr>
                                                ))
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}

                                      {/* Account Operate */}
                                      {formData.accountHolderType === 'Joint' && (
                                        <div className="uha-operate-section">
                                          <div className="uha-operate-label">Account Operate</div>
                                          <div className="uha-operate-radios">
                                            {(['Either Party', 'Jointly'] as const).map(opt => (
                                              <label key={opt} className="uha-radio-option">
                                                <input type="radio" name="accountOperate" value={opt} checked={formData.accountOperate === opt} onChange={(e) => handleInputChange('accountOperate', e.target.value as 'Either Party' | 'Jointly')} disabled={!isFormEditable} />
                                                {opt}
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Nominee Details */}
                                  {accountHolderDetailsTab === 'Nominee Details' && (
                                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                      <div className="uha-holder-input-row">
                                        <div className="uha-field-group">
                                          <div className="uha-field-label">Nominee ID</div>
                                          <div className="uha-field-row">
                                            <input type="text" value={formData.nomineeInput} onChange={(e) => handleInputChange('nomineeInput', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Enter Holder ID" />
                                            <button className="uha-icon-btn uha-icon-btn-search" title="Search nominee" onClick={() => setIsNomineeSearchModalOpen(true)} disabled={!isFormEditable}>🔍</button>
                                          </div>
                                        </div>
                                        <div className="uha-field-group">
                                          <div className="uha-field-label">Nominee Name</div>
                                          <div className="uha-field-row">
                                            <input type="text" value={formData.nomineeRightInput} onChange={(e) => handleInputChange('nomineeRightInput', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Enter Name" />
                                            <button className="uha-icon-btn uha-icon-btn-add" title="Add to list" onClick={() => { if (formData.nomineeRightInput.trim()) { const newNominee: HolderInfo = { holderNo: String(nomineeHolders.length + 1), holderName: formData.nomineeRightInput.trim(), selected: false }; setNomineeHolders([...nomineeHolders, newNominee]); handleInputChange('nomineeRightInput', ''); } }} disabled={!isFormEditable || !formData.nomineeRightInput.trim()}>+</button>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="uha-holders-table-wrap">
                                        <table className="uha-holders-table">
                                          <thead>
                                            <tr>
                                              <th>Holder No</th>
                                              <th>Holder Name</th>
                                              <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {nomineeHolders.length === 0 ? (
                                              <tr className="uha-empty-row"><td colSpan={3}>No nominees added yet</td></tr>
                                            ) : (
                                              nomineeHolders.map((holder, idx) => (
                                                <tr key={idx}>
                                                  <td>{holder.holderNo}</td>
                                                  <td>{holder.holderName}</td>
                                                  <td style={{ textAlign: 'center' }}>
                                                    <button className="uha-icon-btn uha-icon-btn-remove" title="Remove" onClick={() => setNomineeHolders(nomineeHolders.filter((_, i) => i !== idx))} disabled={!isFormEditable}>✕</button>
                                                  </td>
                                                </tr>
                                              ))
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* ── Reinvest / Payout pill toggle ── */}
                                <div className="uha-reinvest-toggle">
                                  <span className="uha-toggle-label">Distribution:</span>
                                  <label className="uha-toggle-option">
                                    <input type="radio" name="reinvestPayout" value="Reinvest" checked={formData.reinvestPayout === 'Reinvest'} onChange={(e) => handleInputChange('reinvestPayout', e.target.value as 'Reinvest' | 'Payout')} disabled={!isFormEditable} />
                                    Reinvest
                                  </label>
                                  <label className="uha-toggle-option">
                                    <input type="radio" name="reinvestPayout" value="Payout" checked={formData.reinvestPayout === 'Payout'} onChange={(e) => handleInputChange('reinvestPayout', e.target.value as 'Reinvest' | 'Payout')} disabled={!isFormEditable} />
                                    Payout
                                  </label>
                                </div>

                                {/* Distribution Details (Reinvest/Payout) */}
                                {formData.reinvestPayout === 'Reinvest' && (
                                  <div className="uha-reinvest-card">
                                    <div className="uha-reinvest-grid">
                                      {/* Col 1: Toggle */}
                                      <div className="uha-field-group">
                                        <div className="uha-reinvest-title">Reinvest to Different Account</div>
                                        <label className="uha-checkbox-label">
                                          <input type="checkbox" checked={formData.reinvestToDifferentAccount} onChange={(e) => handleInputChange('reinvestToDifferentAccount', e.target.checked)} disabled={!isFormEditable} />
                                          Yes
                                        </label>
                                      </div>
                                      {/* Col 2: Fund */}
                                      <div className="uha-field-group">
                                        <div className="uha-selection-card" style={{ padding: '8px 12px', marginTop: 0 }}>
                                          <div className="uha-field-label">Fund</div>
                                          <div className="uha-select-wrap">
                                            <div onClick={() => isFormEditable && setShowReinvestFundTable(!showReinvestFundTable)} className={`uha-select-box ${formData.reinvestFund ? 'uha-text-black' : 'uha-placeholder'}`}>
                                              {formData.reinvestFund || 'Select fund'}
                                            </div>
                                            {showReinvestFundTable && isFormEditable && (
                                              <div data-table="reinvestFund" className="uha-dropdown-table-container">
                                                <table className="uha-dropdown-table">
                                                  <thead>
                                                    <tr>
                                                      <th onClick={() => handleTableSort('reinvestFund', 'name')}>Name</th>
                                                      <th onClick={() => handleTableSort('reinvestFund', 'code')}>Code</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {getSortedData('reinvestFund', fundData).map((fund, idx) => (
                                                      <tr key={idx} onClick={() => { handleInputChange('reinvestFund', `${fund.name} - ${fund.code}`); setShowReinvestFundTable(false); }}>
                                                        <td>{fund.name}</td>
                                                        <td>{fund.code}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      {/* Col 3: Account No */}
                                      <div className="uha-field-group">
                                        <div className="uha-field-label">Account No</div>
                                        <div className="uha-field-row">
                                          <input type="text" value={formData.reinvestAccountNo} onChange={(e) => handleInputChange('reinvestAccountNo', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Account No" />
                                          <button className="uha-icon-btn uha-icon-btn-search uha-btn-search-orange" title="Search" onClick={() => setIsReinvestAccountSearchModalOpen(true)} disabled={!isFormEditable}>🔍</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {formData.reinvestPayout === 'Payout' && (
                                  <div className="uha-reinvest-card">
                                    <div className="uha-bank-layout">
                                      <div className="uha-reinvest-grid">
                                        {/* Col 1: Payment Type */}
                                        <div className="uha-field-group">
                                          <div className="uha-field-label">Payment Type</div>
                                          <div className="uha-select-wrap">
                                            <div onClick={() => isFormEditable && setShowPaymentTypeTable(!showPaymentTypeTable)} className={`uha-select-box ${formData.paymentType ? 'uha-text-black' : 'uha-placeholder'}`}>
                                              {formData.paymentType || 'Select payment type'}
                                            </div>
                                            {showPaymentTypeTable && isFormEditable && (
                                              <div data-table="paymentType" className="uha-dropdown-table-container">
                                                <table className="uha-dropdown-table">
                                                  <thead>
                                                    <tr>
                                                      <th onClick={() => handleTableSort('paymentType', 'code')}>Code</th>
                                                      <th onClick={() => handleTableSort('paymentType', 'name')}>Name</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {getSortedData('paymentType', paymentTypeData).map((pt, idx) => (
                                                      <tr key={idx} onClick={() => { handleInputChange('paymentType', `${pt.name} - ${pt.code}`); setShowPaymentTypeTable(false); }}>
                                                        <td>{pt.code}</td>
                                                        <td>{pt.name}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        {/* Col 2: Bank */}
                                        <div className="uha-field-group">
                                          <div className="uha-field-label">Bank</div>
                                          <div className="uha-select-wrap">
                                            <div onClick={() => isFormEditable && setShowPayoutBankTable(!showPayoutBankTable)} className={`uha-select-box ${formData.payoutBank ? 'uha-text-black' : 'uha-placeholder'}`}>
                                              {formData.payoutBank || 'Select bank'}
                                            </div>
                                            {showPayoutBankTable && isFormEditable && (
                                              <div data-table="payoutBank" className="uha-dropdown-table-container">
                                                <table className="uha-dropdown-table">
                                                  <thead>
                                                    <tr>
                                                      <th onClick={() => handleTableSort('payoutBank', 'name')}>Name</th>
                                                      <th onClick={() => handleTableSort('payoutBank', 'code')}>Code</th>
                                                      <th onClick={() => handleTableSort('payoutBank', 'district')}>District</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {getSortedData('payoutBank', bankData).map((bank, idx) => (
                                                      <tr key={idx} onClick={() => { handleInputChange('payoutBank', `${bank.name} - ${bank.code}`); setShowPayoutBankTable(false); }}>
                                                        <td>{bank.name}</td>
                                                        <td>{bank.code}</td>
                                                        <td>{bank.district}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        {/* Col 3: Account No */}
                                        <div className="uha-field-group">
                                          <div className="uha-field-label">Account No</div>
                                          <input type="text" value={formData.payoutAccountNo} onChange={(e) => handleInputChange('payoutAccountNo', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Account No" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Payee */}
                                <div style={{ marginTop: '14px', maxWidth: '320px' }}>
                                  <div className="uha-field-group">
                                    <div className="uha-field-label">Payee</div>
                                    <input type="text" value={formData.payee} onChange={(e) => handleInputChange('payee', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Enter Payee Name" />
                                  </div>
                                </div>
                              </div>
                            )}

                            {accountsActiveTab === 'Bank Details' && (
                              <div className="uha-bank-details-wrap">
                                <div className="uha-section-card">
                                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {/* Bank Form Layout */}
                                    <div className="uha-bank-layout">
                                      <div className="uha-info-grid">
                                        <div className="uha-field-group">
                                          <div className="uha-field-label">Payment Type</div>
                                          <div className="uha-select-wrap">
                                            <div onClick={() => isFormEditable && setShowBankDetailsPaymentTypeTable(!showBankDetailsPaymentTypeTable)} className={`uha-select-box ${formData.bankDetailsPaymentType ? 'uha-text-black' : 'uha-placeholder'}`}>
                                              {formData.bankDetailsPaymentType || 'Select payment type'}
                                            </div>
                                            {showBankDetailsPaymentTypeTable && isFormEditable && (
                                              <div data-table="bankDetailsPaymentType" className="uha-dropdown-table-container">
                                                <table className="uha-dropdown-table">
                                                  <thead>
                                                    <tr>
                                                      <th onClick={() => handleTableSort('bankDetailsPaymentType', 'code')}>Code</th>
                                                      <th onClick={() => handleTableSort('bankDetailsPaymentType', 'name')}>Name</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {getSortedData('bankDetailsPaymentType', paymentTypeData).map((pt, idx) => (
                                                      <tr key={idx} onClick={() => { handleInputChange('bankDetailsPaymentType', `${pt.name} - ${pt.code}`); setShowBankDetailsPaymentTypeTable(false); }}>
                                                        <td>{pt.code}</td>
                                                        <td>{pt.name}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="uha-field-group">
                                          <div className="uha-field-label">Bank</div>
                                          <div className="uha-select-wrap">
                                            <div onClick={() => isFormEditable && setShowBankDetailsBankTable(!showBankDetailsBankTable)} className={`uha-select-box ${formData.bankDetailsBank ? 'uha-text-black' : 'uha-placeholder'}`}>
                                              {formData.bankDetailsBank || 'Select bank'}
                                            </div>
                                            {showBankDetailsBankTable && isFormEditable && (
                                              <div data-table="bankDetailsBank" className="uha-dropdown-table-container">
                                                <table className="uha-dropdown-table">
                                                  <thead>
                                                    <tr>
                                                      <th onClick={() => handleTableSort('bankDetailsBank', 'name')}>Name</th>
                                                      <th onClick={() => handleTableSort('bankDetailsBank', 'code')}>Code</th>
                                                      <th onClick={() => handleTableSort('bankDetailsBank', 'district')}>District</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {getSortedData('bankDetailsBank', bankData).map((bank, idx) => (
                                                      <tr key={idx} onClick={() => { handleInputChange('bankDetailsBank', `${bank.name} - ${bank.code}`); setShowBankDetailsBankTable(false); }}>
                                                        <td>{bank.name}</td>
                                                        <td>{bank.code}</td>
                                                        <td>{bank.district}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="uha-field-group">
                                          <div className="uha-field-label">Account No</div>
                                          <input type="text" value={formData.bankDetailsAccountNo} onChange={(e) => handleInputChange('bankDetailsAccountNo', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Account No" />
                                        </div>
                                        <div className="uha-field-group">
                                          <div className="uha-field-label">Account Name</div>
                                          <input type="text" value={formData.bankDetailsAccountName} onChange={(e) => handleInputChange('bankDetailsAccountName', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Account Name" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Payee Row */}
                                    <div style={{ maxWidth: '300px' }}>
                                      <div className="uha-field-group">
                                        <div className="uha-field-label">Payee</div>
                                        <input type="text" value={formData.bankDetailsPayee} onChange={(e) => handleInputChange('bankDetailsPayee', e.target.value)} disabled={!isFormEditable} className="uha-text-input" placeholder="Payee Name" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Bank Accounts Table */}
                                <div className="uha-holders-table-wrap" style={{ marginTop: '16px' }}>
                                  <table className="uha-holders-table">
                                    <thead>
                                      <tr>
                                        <th>Bank Code</th>
                                        <th>Account No.</th>
                                        <th>Account Type</th>
                                        <th>Bank Name</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {bankDetailsAccounts.length === 0 ? (
                                        <tr className="uha-empty-row"><td colSpan={4}>No bank accounts added</td></tr>
                                      ) : (
                                        bankDetailsAccounts.map((account, idx) => (
                                          <tr key={idx}>
                                            <td>{account.bankCode}</td>
                                            <td>{account.accountNo}</td>
                                            <td>{account.accountType}</td>
                                            <td>{account.bankName}</td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {accountsActiveTab === 'Existing Accounts' && (
                              <div className="uha-existing-accounts-wrap">
                                <div className="uha-holders-table-wrap">
                                  <table className="uha-holders-table">
                                    <thead>
                                      <tr>
                                        <th>Account No</th>
                                        <th>Fund Name</th>
                                        <th>Product Type</th>
                                        <th>Acc. Type</th>
                                        <th>Active</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {existingAccounts.length === 0 ? (
                                        Array.from({ length: 10 }).map((_, idx) => (
                                          <tr key={idx}><td colSpan={5} style={{ height: '38px' }}></td></tr>
                                        ))
                                      ) : (
                                        <>
                                          {existingAccounts.map((account, idx) => (
                                            <tr key={idx} className="uha-clickable-row" onDoubleClick={() => { if (isFormEditable) { handleInputChange('accountNo', account.accountNo); handleInputChange('fund', account.fundName); setAccountsActiveTab('Details'); } }}>
                                              <td>{account.accountNo}</td>
                                              <td>{account.fundName}</td>
                                              <td>{account.productType}</td>
                                              <td>{account.accType}</td>
                                              <td>{account.active}</td>
                                            </tr>
                                          ))}
                                          {existingAccounts.length < 10 && Array.from({ length: 10 - existingAccounts.length }).map((_, idx) => (
                                            <tr key={`empty-${idx}`}><td colSpan={5} style={{ height: '38px' }}></td></tr>
                                          ))}
                                        </>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                                <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b', fontStyle: 'italic', textAlign: 'right' }}>
                                  * Double click a row to edit
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* end reg-modal-body */}

                  <div className="reg-modal-footer">
                    Double click to get the selected value
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>

      {/* Account Search Modal — Reinvest Account No (orange button) */}
      <AccountSearchModal
        isOpen={isReinvestAccountSearchModalOpen}
        onClose={() => setIsReinvestAccountSearchModalOpen(false)}
        title="Search Account"
        onSelect={(result) => {
          if (result.accountNo) handleInputChange('reinvestAccountNo', result.accountNo);
        }}
      />

      <Footer />
    </>
  );
}

export default FourCardsWithModal;
