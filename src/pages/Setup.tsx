import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { SortingState, RowSelectionState } from "@tanstack/react-table";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SystemCalendar from '../components/SystemCalendar';
import React from 'react';

// ========================================
// TYPE DEFINITIONS
// ========================================

interface FormData {
  code: string;
  description: string;
  address: string;
  district: string;
  swiftCode: string;
  branchNo: string;
  transactionCode: string;
  transactionType: string;
  transactionName: string;
  lastTransactionNumber: string;
  trusteeCode: string;
  active: boolean;
  trusteeName: string;
  trusteeAddress: string;
  telephoneNumber: string;
  faxNo: string;
  email: string;
  custodianCode: string;
  custodianActive: boolean;
  custodianName: string;
  custodianAddress1: string;
  custodianAddress2: string;
  custodianAddress3: string;
  custodianTelephoneNumber: string;
  custodianFaxNo: string;
  custodianEmail: string;
  postalCode: string;
  postalActive: boolean;
  postalDescription: string;
  dividendType: string;
  dividendActive: boolean;
  dividendDescription: string;
  fund: string;
  fundName: string;
  manager: string;
  trustee: string;
  custodian: string;
  minValue: string;
  minUnits: string;
  suspenseAccount: string;
  launchDate: Date | null;
  fundType: string;
  ipoStartDate: Date | null;
  ipoEndDate: Date | null;
  certificateType: string;
  portfolioCode: string;
  maturityDate: Date | null;
  promotionCode: string;
  promotionName: string;
  promotionDescription: string;
  companyCode: string;
  companyName: string;
  companyPostalCode: string;
  companyStreet: string;
  companyTown: string;
  companyCity: string;
  companyTelephone: string;
  companyFax: string;
  companyApplicationApproval: boolean;
  companyAccountApproval: boolean;
  companyEmail: string;
  companyWebsite: string;
  companyAddress: string;
  companyPhone: string;
  // Administrator tab fields
  reportPath: string;
  documentPath: string;
  unitsDecimalPosition: string;
  unitsDecimalMethod: string;
  amountDecimalPosition: string;
  amountDecimalMethod: string;
  smtpInvalidLogin: boolean;
  smtpLockedAccount: boolean;
  smtpRegistrationApproval: boolean;
  applicationApprove: boolean;
  registrationApprove: boolean;
  accountApprove: boolean;
  transactionApprove: boolean;
  unitPriceApprove: boolean;
  sendEmailsAccountApproval: boolean;
  sendEmailsAcknowledgment: boolean;
  sendEmailsInvestment: boolean;
  loginInvalidUser: boolean;
  loginAccountLock: boolean;
  multipleUserAccess: string;
  tableName: string;
  certificateSeparateExitFee: boolean;
  sendEmailsOn: boolean;
  senderAddress: string;
  smtpServer: string;
  smtpUser: string;
  smtpPassword: string;
  emailSendingMethod: string;
  smtpPort: string;
  useDefaultCredentials: string;
  sendSmsOn: boolean;
  smsProvider: string;
  smsUserName: string;
  smsAlias: string;
  smsApiKey: string;
  unitFeeApplicableFunds: string[];
  unitFeeTxnType: string;
  unitFeeCode: string;
  unitFeePercentage: string;
  unitFeeDescription: string;
  unitFeePriceOne: string;
  unitFeePriceTwo: string;
  unitFee: string;
  // Documents Setup fields
  documentType: string;
  documentHolderType: string;
  documentCode: string;
  documentActive: boolean;
  documentName: string;
  // Agency Type fields
  agencyTypeCode: string;
  agencyTypeDescription: string;
  // Agency fields
  agencyCode: string;
  agencyDescription: string;
  agencyType: string;
  calculateCommission: string;
  // Sub Agency fields
  agency: string;
  subAgencyCode: string;
  subAgencyDescription: string;
  // Agent fields
  subAgency: string;
  agentCode: string;
  registrationNumber: string;
  city: string;
  residence: string;
  agentType: string;
  joinedDate: string;
  territory: string;
  // Additional fields used in resetFormData
  dividendCode: string;
  activityCode: string;
  activityName: string;
  activityType: string;
  activityDescription: string;
  fundCode: string;
  fundRisk: string;
  fundReturn: string;
  postalArea: string;
  postalCity: string;
  postalDistrict: string;
  commissionType: string;
  commissionDescription: string;
  territoryCode: string;
  territoryDescription: string;
  institutionCategoryCode: string;
  institutionCategoryActive: boolean;
  institutionCategoryType: string;
  institutionCategoryName: string;
  institutionCategoryAddress1: string;
  institutionCategoryAddress2: string;
  institutionCategoryAddress3: string;
  institutionCategoryContactPerson: string;
  institutionCategoryContactNo: string;
  institutionCategoryDescription: string;
  // New fields for Blocking Category
  blockingCategoryType: string;
  blockingCategoryActive: boolean;
  blockingCategoryDescription: string;
  // New fields for Customer Zone
  customerZoneCode: string;
  customerZoneActive: boolean;
  customerZoneDescription: string;
  // New fields for Compliance Msg Setup
  compliancePosition: string;
  complianceUser: string;
  // New fields for Title
  titleCode: string;
  titleActive: boolean;
  titleDescription: string;
  // New fields for Other Charges
  otherChargesCode: string;
  otherChargesActive: boolean;
  otherChargesName: string;
  otherChargesValidFrom: Date | null;
  otherChargesValidTo: Date | null;
  otherChargesType: 'percentage' | 'value';
  otherChargesPercentage: string;
  otherChargesValue: string;
  // New fields for Commission Level
  commissionLevelCode: string;
  commissionLevelDescription: string;
  // New fields for Agent Commission Definition
  agentCommissionCategory: 'investment' | 'trailer';
  agentCommissionType: string;
  agentCommissionLevel: string;
  agentCommissionFund: string;
  agentCommissionAgentType: 'agency' | 'subAgency' | 'agent';
  agentCommissionPeriodFrom: Date | null;
  agentCommissionPeriodTo: Date | null;
  agentCommissionAmountFrom: string;
  agentCommissionAmountTo: string;
  agentCommissionRate: string;
    // Joint Sale Agent fields
    jointAgency: string;
    jointSubAgency: string;
    jointAgentCode: string;
    jointAgentDescription: string;
    nameAgency: string;
    nameSubAgency: string;
    nameAgentCode: string;
    // Product Type fields
    productType: string;
    productTypeActive: boolean;
    productTypeDescription: string;
    
}

// ========================================
// STATIC DATA AND CONFIGURATION
// ========================================

// TODO: Replace with API call to fetch modules from backend
// API Endpoint: GET /api/setup/modules
const moduleData = [
  { title: 'Bank', icon: '🏦' },
  { title: 'Transaction Type', icon: '🔄' },
  { title: 'System Calendar', icon: '📅' },
  { title: 'Trustees', icon: '👔' },
  { title: 'Custodian', icon: '🗄️' },
  { title: 'Postal Area', icon: '📮' },
  { title: 'Dividend Type', icon: '💸' },
  { title: 'Funds', icon: '💰' },
  { title: 'Company', icon: '🏢' },
  { title: 'Promotional Activity', icon: '🎉' },
  { title: 'Unit Fee Codes', icon: '🧾' },
  { title: 'Agency Type', icon: '🏷️' },
  { title: 'Agency', icon: '🏬' },
  { title: 'Sub Agency', icon: '🏪' },
  { title: 'Agents', icon: '🧑‍💼' },
  { title: 'Territory', icon: '🗺️' },
  { title: 'Commision Type', icon: '📊' },
  { title: 'Commission Level', icon: '📈' },
  { title: 'Agent Commission Definition', icon: '💰' },
  { title: 'Assign Agent to Commission Definition', icon: '👥' }, 
  { title: 'Institution Category', icon: '🏛️' },
  { title: 'Documents Setup', icon: '📄' },
  { title: 'Institution', icon: '🏫' },
  { title: 'Blocking Category', icon: '🚫' },
  { title: 'Customer Zone', icon: '🌐' },
  { title: 'Join Sale Agent', icon: '🤝' }, 
  { title: 'Complience MSG Setup', icon: '💬' },
  { title: 'Product Type', icon: '📦' },
  { title: 'Title', icon: '🔔' },
];

// TODO: Replace with API call to fetch table data from backend
// API Endpoint: GET /api/setup/table-data/{module}
const tableData = {
  Bank: [
    { code: '0', description: 'Bank Muscat', address: 'CJW5+9HF, Sohar, Oman' },
    { code: '1', description: 'Zurcher kantonalbank', address: 'Switzerland' },
    { code: '31', description: 'Federal credit union in New York', address: '2 United Nations Plaza, New York, NY 10017' },
    { code: '111', description: 'HSBC Indonesia', address: 'Jakarta, Indonesia' },
    { code: '4806', description: 'HSBC - De Voeux Branch', address: 'Des Voeux Road Central, Hong Kong' },
    { code: '40111', description: 'HSBC - Hong Kong', address: "Queen's Road Central, Hong Kong" },
    { code: '83268', description: 'National Australia Bank', address: 'Melbourne, Australia' },
    { code: '210000', description: 'Chase Bank - Park Avenue South', address: 'New York' },
    { code: '301830', description: 'Lloyds Bank Plc - Haywards Heath', address: '99-101 South Road - Post / ZIP Code : Rh16 4nd' }
  ],
  'Transaction Type': [
    { transactionCode: 'T001', transactionType: 'Purchase', transactionName: 'Buy Transaction', lastTransactionNumber: '1001' },
    { transactionCode: 'T002', transactionType: 'Sale', transactionName: 'Sell Transaction', lastTransactionNumber: '1002' },
    { transactionCode: 'T003', transactionType: 'Dividend', transactionName: 'Dividend Payment', lastTransactionNumber: '1003' },
    { transactionCode: 'T004', transactionType: 'Transfer', transactionName: 'Transfer Transaction', lastTransactionNumber: '1004' }
  ],
  'System Calendar': [
    { date: '2024-01-01', description: 'New Year', type: 'Holiday' },
    { date: '2024-01-15', description: 'Working Day', type: 'Business' },
    { date: '2024-02-14', description: 'Valentine Day', type: 'Special' }
  ],
  Trustees: [
    { trusteeCode: 'TR001', active: 'Yes', trusteeName: 'John Smith', address: '123 Main Street', town: 'Downtown', city: 'New York', telephoneNumber: '+1-555-0123', faxNo: '+1-555-0124', email: 'john@trustcorp.com' },
    { trusteeCode: 'TR002', active: 'Yes', trusteeName: 'Sarah Johnson', address: '456 Oak Avenue', town: 'Midtown', city: 'Los Angeles', telephoneNumber: '+1-555-0456', faxNo: '+1-555-0457', email: 'sarah@fiduciary.com' },
    { trusteeCode: 'TR003', active: 'No', trusteeName: 'Michael Brown', address: '789 Pine Street', town: 'Uptown', city: 'Chicago', telephoneNumber: '+1-555-0789', faxNo: '+1-555-0790', email: 'michael@trustee.com' }
  ],
  Custodian: [
    { custodianCode: 'CU001', active: 'Yes', custodianName: 'Global Custody Bank', address1: '123 Wall Street', address2: 'Suite 100', address3: 'Floor 5', telephoneNumber: '+1-555-0123', faxNo: '+1-555-0124', email: 'global@custody.com' },
    { custodianCode: 'CU002', active: 'Yes', custodianName: 'Euro Custody Ltd', address1: '456 Fleet Street', address2: 'Building A', address3: 'Level 3', telephoneNumber: '+44-20-7123-4567', faxNo: '+44-20-7123-4568', email: 'euro@custody.co.uk' },
    { custodianCode: 'CU003', active: 'Yes', custodianName: 'Asia Pacific Custody', address1: '789 Finance Street', address2: 'Tower B', address3: 'Level 10', telephoneNumber: '+65-6123-4567', faxNo: '+65-6123-4568', email: 'asia@custody.sg' }
  ],
  'Postal Area': [
    { postalCode: 'PA001', active: 'Yes', description: 'Downtown Area' },
    { postalCode: 'PA002', active: 'Yes', description: 'Midtown Area' },
    { postalCode: 'PA003', active: 'No', description: 'Uptown Area' }
  ],
  'Dividend Type': [
    { dividendType: 'DIV001', active: 'Yes', description: 'Cash Dividend' },
    { dividendType: 'DIV002', active: 'Yes', description: 'Stock Dividend' },
    { dividendType: 'DIV003', active: 'No', description: 'Special Dividend' }
  ],
  Funds: [
    { fund: 'F001', name: 'Growth Fund', manager: 'John Smith', trustee: 'Trust Corp', custodian: 'Global Custody', minValue: '10000', minUnits: '1000', suspenseAccount: 'SUS001', launchDate: '01/01/2024', fundType: 'Open Ended', ipoStartDate: '01/01/2024', ipoEndDate: '31/01/2024', certificateType: 'Digital', portfolioCode: 'PF001' },
    { fund: 'F002', name: 'Income Fund', manager: 'Sarah Johnson', trustee: 'Fiduciary Ltd', custodian: 'Euro Custody', minValue: '5000', minUnits: '500', suspenseAccount: 'SUS002', launchDate: '15/02/2024', fundType: 'Close Ended', ipoStartDate: '15/02/2024', ipoEndDate: '15/03/2024', certificateType: 'Physical', portfolioCode: 'PF002' },
    { fund: 'F003', name: 'Balanced Fund', manager: 'Michael Brown', trustee: 'Trustee Corp', custodian: 'Asia Custody', minValue: '7500', minUnits: '750', suspenseAccount: 'SUS003', launchDate: '01/03/2024', fundType: 'Open Ended', ipoStartDate: '01/03/2024', ipoEndDate: '31/03/2024', certificateType: 'Digital', portfolioCode: 'PF003' }
  ],
  Company: [
    { code: 'C001', name: 'ABC Corporation', sector: 'Technology', employees: '5000' },
    { code: 'C002', name: 'XYZ Industries', sector: 'Manufacturing', employees: '3000' }
  ],
  'Promotional Activity': [
    { code: 'PA001', Name: 'Summer Sale', discription: '20%' },
    { code: 'PA002', Name: 'Holiday Special', discription: '15%' }
  ],
  'Other Charges': [
    { code: 'OC001', active: 'Yes', name: 'Processing Fee', validFrom: '2024-01-01', validTo: '2024-12-31', type: 'Percentage', percentage: '2.5%', value: '' },
    { code: 'OC002', active: 'Yes', name: 'Service Charge', validFrom: '2024-01-01', validTo: '2024-12-31', type: 'Value', percentage: '', value: '50.00' },
    { code: 'OC003', active: 'No', name: 'Maintenance Fee', validFrom: '2024-01-01', validTo: '2024-12-31', type: 'Percentage', percentage: '1.0%', value: '' }
  ],
  'Unit Fee Codes': [
    { feeCode: 'UFC001', description: 'Entry Fee', percentage: '2.5%', ageFrom: '18', ageTo: '65', unitFee: '100.00' },
    { feeCode: 'UFC002', description: 'Exit Fee', percentage: '1.5%', ageFrom: '18', ageTo: '65', unitFee: '75.00' }
  ],
  'Agency Type': [
    { agencyTypeCode: 'AT001', agencyTypeDescription: 'Primary Agent' },
    { agencyTypeCode: 'AT002', agencyTypeDescription: 'Sub Agent' }
  ],
  Agency: [
    { agencyCode: 'AG001', agencyDescription: 'Main Street Agency', agencyType: 'Primary Agent', calculateCommission: 'Yes' },
    { agencyCode: 'AG002', agencyDescription: 'Central Agency', agencyType: 'Sub Agent', calculateCommission: 'Percentage' }
  ],
  'Sub Agency': [
    { agency: 'AG001', subAgencyCode: 'SA001', subAgencyDescription: 'Downtown Branch' },
    { agency: 'AG002', subAgencyCode: 'SA002', subAgencyDescription: 'Uptown Branch' }
  ],
  Agents: [
    { 
      agency: 'AG001', 
      subAgency: 'SA001', 
      agentCode: 'AGT001', 
      registrationNumber: 'REG001', 
      description: 'John Smith', 
      city: 'Colombo', 
      district: 'Western', 
      residence: 'Residence', 
      agentType: 'Non-Institution', 
      calculateCommission: 'Percentage', 
      joinedDate: '2023-01-15', 
      territory: 'Western Province' 
    },
    { 
      agency: 'AG002', 
      subAgency: 'SA002', 
      agentCode: 'AGT002', 
      registrationNumber: 'REG002', 
      description: 'Sarah Johnson', 
      city: 'Kandy', 
      district: 'Central', 
      residence: 'Non-Residence', 
      agentType: 'Institution', 
      calculateCommission: 'Fixed Amount', 
      joinedDate: '2023-03-20', 
      territory: 'Central Province' 
    }
  ],
  Territory: [
    { code: 'T001', name: 'North Region'},
    { code: 'T002', name: 'South Region'}
  ],
  'Commision Type': [
    { type: 'Flat Rate', description: 'Fixed commission per transaction' },
    { type: 'Percentage', description: 'Percentage of transaction value' }
  ],
  'Commission Level': [
    { commissionLevel: 'CL001', description: 'Entry Level Commission - Basic commission structure for new agents' },
    { commissionLevel: 'CL002', description: 'Intermediate Level Commission - Enhanced commission for experienced agents' },
    { commissionLevel: 'CL003', description: 'Senior Level Commission - Premium commission for top-performing agents' },
    { commissionLevel: 'CL004', description: 'Executive Level Commission - Highest commission tier for elite agents' }
  ],
  'Agent Commission Definition': [
    { 
      commissionCategory: 'Investment Wise Commission', 
      commissionType: 'Flat Rate', 
      commissionLevel: 'Entry Level', 
      fund: 'Growth Fund',
      agentType: 'Agency Wise',
      periodFrom: '2024-01-01',
      periodTo: '2024-12-31',
      amountFrom: '1000',
      amountTo: '10000',
      commissionRate: '2.5%'
    },
    { 
      commissionCategory: 'Trailer Fee', 
      commissionType: 'Percentage', 
      commissionLevel: 'Senior Level', 
      fund: 'Income Fund',
      agentType: 'Agent Wise',
      periodFrom: '2024-01-01',
      periodTo: '2024-12-31',
      amountFrom: '5000',
      amountTo: '50000',
      commissionRate: '1.5%'
    },
    { 
      commissionCategory: 'Investment Wise Commission', 
      commissionType: 'Percentage', 
      commissionLevel: 'Executive Level', 
      fund: 'Balanced Fund',
      agentType: 'Sub Agency Wise',
      periodFrom: '2024-01-01',
      periodTo: '2024-12-31',
      amountFrom: '10000',
      amountTo: '100000',
      commissionRate: '3.0%'
    }
  ],
  'Assign Agent to Commission Definition': [
    { 
      Agency: 'Investment Wise Commission', 
      SubAgency: 'Flat Rate', 
      Agent: 'Entry Level'

    },
    { 
      Agency: 'Investment Wise Commission', 
      SubAgency: 'Flat Rate', 
      Agent: 'Entry Level'
    },
    { 
      Agency: 'Investment Wise Commission', 
      SubAgency: 'Flat Rate', 
      Agent: 'Entry Level'
    }
  ],
  'Institution Category': [
    { institutionCategory: 'Bank', active: 'Yes', description: 'Financial Institutions including commercial banks, investment banks, and credit unions' },
    { institutionCategory: 'Insurance', active: 'Yes', description: 'Insurance companies providing life, health, and property insurance services' },
    { institutionCategory: 'Investment', active: 'Yes', description: 'Investment firms, asset management companies, and portfolio management services' },
    { institutionCategory: 'Brokerage', active: 'No', description: 'Stock brokerage firms and trading platforms' }
  ],
  'Institution': [
    { 
      institutionCode: 'IC001', 
      status: 'Active', 
      institutionCategory: 'Bank', 
      institutionName: 'First National Bank',
      address1: '123 Main Street',
      address2: 'Suite 100',
      address3: 'Downtown',
      contactPerson: 'John Smith',
      contactNo: '+1-555-0123'
    },
    { 
      institutionCode: 'IC002', 
      status: 'Active', 
      institutionCategory: 'Insurance', 
      institutionName: 'Metro Insurance Co.',
      address1: '456 Business Ave',
      address2: 'Floor 5',
      address3: 'Financial District',
      contactPerson: 'Sarah Johnson',
      contactNo: '+1-555-0456'
    },
    { 
      institutionCode: 'IC003', 
      status: 'Inactive', 
      institutionCategory: 'Investment', 
      institutionName: 'Global Investment Ltd.',
      address1: '789 Finance Blvd',
      address2: 'Tower A',
      address3: 'Business Center',
      contactPerson: 'Mike Wilson',
      contactNo: '+1-555-0789'
    }
  ],
  'Documents Setup': [
    { code: 'DS001', name: 'Application Form', holderType: 'Individual' },
    { code: 'DS002', name: 'ID Proof', holderType: 'Cooperate' }
  ],
  'Blocking Category': [
    { blockingCategory: 'Fraud', active: 'Yes', description: 'Suspicious activity detected, potential fraud indicators, and fraudulent transactions' },
    { blockingCategory: 'Compliance', active: 'Yes', description: 'Regulatory requirement violations, compliance issues, and policy breaches' },
    { blockingCategory: 'Risk', active: 'Yes', description: 'High-risk transactions, suspicious patterns, and risk management concerns' },
    { blockingCategory: 'Regulatory', active: 'No', description: 'Regulatory violations and compliance failures' }
  ],
  'Customer Zone': [
    { zoneCode: 'CZ001', active: 'Yes', description: 'Premium customer zone with high-value clients, VIP services, and priority support' },
    { zoneCode: 'CZ002', active: 'Yes', description: 'Standard customer zone with regular clients, standard services, and normal support' },
    { zoneCode: 'CZ003', active: 'Yes', description: 'Corporate customer zone with business clients, enterprise services, and dedicated support' },
    { zoneCode: 'CZ004', active: 'No', description: 'Inactive customer zone for suspended or terminated accounts' }
  ],
  'Joint Sale Agent': [
    {
      agencyCode: 'AG001',
      subAgencyCode: 'SA001',
      agentCode: 'AGT001',
      agentDescription: 'John Smith'
    },
    {
      agencyCode: 'AG002',
      subAgencyCode: 'SA002',
      agentCode: 'AGT002',
      agentDescription: 'Sarah Johnson'
    },
  ],
  
  'Complience MSG Setup': [
    { position: 'Manager', user: 'John Smith' },
    { position: 'Supervisor', user: 'Sarah Johnson' },
    { position: 'Officer', user: 'Michael Brown' },
    { position: 'Analyst', user: 'Emily Davis' },
    { position: 'Coordinator', user: 'David Wilson' },
    { position: 'Specialist', user: 'Lisa Anderson' }
  ],
  'Product Type': [
    { 
      ProductType: 'Investment Wise Commission', 
      Description: 'Unit Trust', 
      Active: 'Y'

    },
  ],
  Title: [
    { titleCode: 'T001', active: 'Yes', description: 'Mr. - Formal title for adult males, commonly used in business and formal correspondence' },
    { titleCode: 'T002', active: 'Yes', description: 'Ms. - Formal title for adult females, commonly used in business and formal correspondence' },
    { titleCode: 'T003', active: 'Yes', description: 'Dr. - Academic title for individuals with doctoral degrees, used in professional and academic contexts' },
    { titleCode: 'T004', active: 'Yes', description: 'Prof. - Academic title for professors, used in educational and research institutions' },
    { titleCode: 'T005', active: 'No', description: 'Sir - Honorary title for knights, currently inactive in the system' }
  ]
};

const modules = moduleData.map(m => ({
  title: m.title,
  icon: m.icon,
  description: `Setup for ${m.title}`
}));

// ========================================
// CUSTOM COMPONENTS
// ========================================

// Custom DataTable Component for displaying table data
function CustomDataTable({ data, columns }: { data: Record<string, string | undefined>[], columns: string[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 3,
  });

  const columnHelper = createColumnHelper<Record<string, string | undefined>>();

  const tableColumns = columns.map((column) =>
      columnHelper.accessor(column, {
        header: column === 'code' ? 'Code' : 
                column === 'description' ? 'Description' : 
                column === 'address' ? 'Address' : 
                column === 'district' ? 'District' : 
                column === 'swiftCode' ? 'Swift Code' : 
                column === 'branchNo' ? 'Branch No' : 
                column === 'institutionCode' ? 'Institution Code' : 
                column === 'status' ? 'Status' : 
                column === 'institutionCategory' ? 'Institution Category' : 
                column === 'institutionName' ? 'Institution Name' : 
                column === 'address1' ? 'Address 1' : 
                column === 'address2' ? 'Address 2' : 
                column === 'address3' ? 'Address 3' : 
                column === 'contactPerson' ? 'Contact Person' : 
                column === 'contactNo' ? 'Contact No' : 
                column === 'active' ? 'Active' : 
                column === 'blockingCategory' ? 'Blocking Category' : 
                column === 'zoneCode' ? 'Zone Code' : 
                column === 'position' ? 'Position' : 
                column === 'user' ? 'User' : 
                column === 'titleCode' ? 'Title Code' : 
                column === 'feeCode' ? 'Fee Code' : 
                column === 'percentage' ? 'Percentage' : 
                column === 'ageFrom' ? 'Age From' : 
                column === 'ageTo' ? 'Age To' : 
                column === 'unitFee' ? 'Unit Fee' : 
                column === 'holderType' ? 'Holder Type' : 
                column.replace(/([A-Z])/g, ' $1').trim(),
        cell: (info) => (
          <span className="text-gray-900">{info.getValue()}</span>
        ),
      })
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="setup-custom-table">
      <div className="setup-table-header">
        <div className="setup-table-controls">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="setup-table-search"
            style={{ color: '#000000' }}
          />
          {/* Shortlist Dropdown */}
          <select
            value={pagination.pageSize}
            onChange={e => {
              const newPageSize = Number(e.target.value);
              setPagination(prev => ({
                ...prev,
                pageSize: newPageSize,
                pageIndex: 0, // Reset to first page when changing page size
              }));
            }}
            className="setup-table-shortlist"
            style={{ color: '#000000' }}
          >
            {[3, 5, 10, 15].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <span className="setup-table-records" style={{ color: '#000000' }}>
            {data.length} Records
          </span>
        </div>
      </div>
      <div className="setup-table-wrapper">
        <div className="setup-table-inner">
                      {/* Fixed Header */}
            <div className="setup-table-fixed-header">
              <div className="setup-table-header-wrapper">
                <table className="setup-table-header-table">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="setup-table-header-th"
                          onClick={header.column.getToggleSortingHandler()}
                          style={{ color: '#000000' }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
              </table>
            </div>
          </div>
          
                      {/* Scrollable Body */}
            <div className="setup-table-scrollable-body">
              <div className="setup-table-body-wrapper">
                <table className="setup-table-body-table">
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr
                      key={row.id}
                      className="setup-table-body-tr"
                      onClick={() => {
                        console.log('Selected row:', row.original);
                        alert(`Selected: ${JSON.stringify(row.original)}`);
                      }}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td 
                          key={cell.id} 
                          className="setup-table-body-td"
                          style={{ color: '#000000' }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// MAIN SETUP COMPONENT
// ========================================

function Setup() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // TODO: Replace with API call to fetch initial form data
  // API Endpoint: GET /api/setup/form-data/{module}
  const [formData, setFormData] = useState<FormData>({
    code: '',
    description: '',
    address: '',
    district: '',
    swiftCode: '',
    branchNo: '',
    transactionCode: '',
    transactionType: '',
    transactionName: '',
    lastTransactionNumber: '',
    trusteeCode: '',
    active: false,
    trusteeName: '',
    trusteeAddress: '',
    telephoneNumber: '',
    faxNo: '',
    email: '',
    custodianCode: '',
    custodianActive: false,
    custodianName: '',
    custodianAddress1: '',
    custodianAddress2: '',
    custodianAddress3: '',
    custodianTelephoneNumber: '',
    custodianFaxNo: '',
    custodianEmail: '',
    postalCode: '',
    postalActive: false,
    postalDescription: '',
    dividendType: '',
    dividendActive: false,
    dividendDescription: '',
    fund: '',
    fundName: '',
    manager: '',
    trustee: '',
    custodian: '',
    minValue: '',
    minUnits: '',
    suspenseAccount: '',
    launchDate: null,
    fundType: '',
    ipoStartDate: null,
    ipoEndDate: null,
    certificateType: '',
    portfolioCode: '',
    maturityDate: null,
    promotionCode: '',
    promotionName: '',
    promotionDescription: '',
    companyCode: '',
    companyName: '',
    companyPostalCode: '',
    companyStreet: '',
    companyTown: '',
    companyCity: '',
    companyTelephone: '',
    companyFax: '',
    companyApplicationApproval: false,
    companyAccountApproval: false,
    companyEmail: '',
    companyWebsite: '',
    companyAddress: '',
    companyPhone: '',
    // Administrator tab fields
    reportPath: '',
    documentPath: '',
    unitsDecimalPosition: '',
    unitsDecimalMethod: '',
    amountDecimalPosition: '',
    amountDecimalMethod: '',
    smtpInvalidLogin: false,
    smtpLockedAccount: false,
    smtpRegistrationApproval: false,
    applicationApprove: false,
    registrationApprove: false,
    accountApprove: false,
    transactionApprove: false,
    unitPriceApprove: false,
    sendEmailsAccountApproval: false,
    sendEmailsAcknowledgment: false,
    sendEmailsInvestment: false,
    loginInvalidUser: false,
    loginAccountLock: false,
    multipleUserAccess: '',
    tableName: '',
    certificateSeparateExitFee: false,
    sendEmailsOn: false,
    senderAddress: '',
    smtpServer: '',
    smtpUser: '',
    smtpPassword: '',
    emailSendingMethod: '',
    smtpPort: '',
    useDefaultCredentials: '',
    sendSmsOn: false,
    smsProvider: '',
    smsUserName: '',
    smsAlias: '',
    smsApiKey: '',
    unitFeeApplicableFunds: [],
    unitFeeTxnType: 'creation',
    unitFeeCode: '',
    unitFeePercentage: '',
    unitFeeDescription: '',
    unitFeePriceOne: '',
    unitFeePriceTwo: '',
    unitFee: '',
    // Documents Setup fields
    documentType: '',
    documentHolderType: '',
    documentCode: '',
    documentActive: false,
    documentName: '',
    // Agency Type fields
    agencyTypeCode: '',
    agencyTypeDescription: '',
    // Agency fields
    agencyCode: '',
    agencyDescription: '',
    agencyType: '',
    calculateCommission: '',
    // Sub Agency fields
    agency: '',
    subAgencyCode: '',
    subAgencyDescription: '',
    // Agent fields
    subAgency: '',
    agentCode: '',
    registrationNumber: '',
    city: '',
    residence: '',
    agentType: '',
    joinedDate: '',
    territory: '',
    // Additional fields
    dividendCode: '',
    activityCode: '',
    activityName: '',
    activityType: '',
    activityDescription: '',
    fundCode: '',
    fundRisk: '',
    fundReturn: '',
    postalArea: '',
    postalCity: '',
    postalDistrict: '',
    commissionType: '',
    commissionDescription: '',
    territoryCode: '',
    territoryDescription: '',
    institutionCategoryCode: '',
    institutionCategoryActive: false,
    institutionCategoryType: '',
    institutionCategoryName: '',
    institutionCategoryAddress1: '',
    institutionCategoryAddress2: '',
    institutionCategoryAddress3: '',
    institutionCategoryContactPerson: '',
    institutionCategoryContactNo: '',
    institutionCategoryDescription: '',
    // New fields for Blocking Category
    blockingCategoryType: '',
    blockingCategoryActive: false,
    blockingCategoryDescription: '',
    // New fields for Customer Zone
    customerZoneCode: '',
    customerZoneActive: false,
    customerZoneDescription: '',
    // New fields for Compliance Msg Setup
    compliancePosition: '',
    complianceUser: '',
    // New fields for Title
    titleCode: '',
    titleActive: false,
    titleDescription: '',
    // New fields for Other Charges
    otherChargesCode: '',
    otherChargesActive: false,
    otherChargesName: '',
    otherChargesValidFrom: null,
    otherChargesValidTo: null,
    otherChargesType: 'percentage',
    otherChargesPercentage: '',
    otherChargesValue: '',
    // New fields for Commission Level
    commissionLevelCode: '',
    commissionLevelDescription: '',
    // New fields for Agent Commission Definition
    agentCommissionCategory: 'investment',
    agentCommissionType: '',
    agentCommissionLevel: '',
    agentCommissionFund: '',
    agentCommissionAgentType: 'agency',
    agentCommissionPeriodFrom: null,
    agentCommissionPeriodTo: null,
    agentCommissionAmountFrom: '',
    agentCommissionAmountTo: '',
    agentCommissionRate: '',
        // Joint Sale Agent fields
        jointAgency: '',
        jointSubAgency: '',
        jointAgentCode: '',
        jointAgentDescription: '',
        nameAgency: '',
        nameSubAgency: '',
        nameAgentCode: '',
        // Product Type fields
        productType: '',
        productTypeActive: false,
        productTypeDescription: '',
  });

  // Reset form data function
  const resetFormData = () => {
    setFormData({
      // Bank fields
      code: '',
      description: '',
      address: '',
      district: '',
      swiftCode: '',
      branchNo: '',
      // Transaction Type fields
      transactionCode: '',
      transactionType: '',
      transactionName: '',
      lastTransactionNumber: '',
      // Trustees fields
      trusteeCode: '',
      active: false,
      trusteeName: '',
      trusteeAddress: '',
      telephoneNumber: '',
      faxNo: '',
      email: '',
      // Custodian fields
      custodianCode: '',
      custodianActive: false,
      custodianName: '',
      custodianAddress1: '',
      custodianAddress2: '',
      custodianAddress3: '',
      custodianTelephoneNumber: '',
      custodianFaxNo: '',
      custodianEmail: '',
      // Postal Area fields
      postalCode: '',
      postalActive: false,
      postalDescription: '',
      postalArea: '',
      postalCity: '',
      postalDistrict: '',
      // Dividend Type fields
      dividendCode: '',
      dividendType: '',
      dividendDescription: '',
      // Funds fields
      fund: '',
      fundCode: '',
      fundName: '',
      manager: '',
      trustee: '',
      custodian: '',
      minValue: '',
      minUnits: '',
      suspenseAccount: '',
      fundType: '',
      fundRisk: '',
      fundReturn: '',
      // Promotional Activity fields
      promotionCode: '',
      promotionName: '',
      promotionDescription: '',
      activityCode: '',
      activityName: '',
      activityType: '',
      activityDescription: '',
      // Additional fields
      certificateType: '',
      portfolioCode: '',
      // Company fields
      companyCode: '',
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: '',
      companyWebsite: '',
      // Unit Fee Codes fields
      unitFeeApplicableFunds: [],
      unitFeeTxnType: '',
      unitFeeCode: '',
      unitFeePercentage: '',
      unitFeeDescription: '',
      unitFeePriceOne: '',
      unitFeePriceTwo: '',
      unitFee: '',
      // Documents Setup fields
      documentType: '',
      documentHolderType: '',
      documentCode: '',
      documentActive: false,
      documentName: '',
      // Agency Type fields
      agencyTypeCode: '',
      agencyTypeDescription: '',
      // Agency fields
      agencyCode: '',
      agencyDescription: '',
      agencyType: '',
      calculateCommission: '',
      // Sub Agency fields
      agency: '',
      subAgencyCode: '',
      subAgencyDescription: '',
      // Agent fields
      subAgency: '',
      agentCode: '',
      registrationNumber: '',
      city: '',
      residence: '',
      agentType: '',
      joinedDate: '',
      territory: '',
      // Additional fields
      // Boolean fields
      dividendActive: false,
      companyApplicationApproval: false,
      companyAccountApproval: false,
      smtpInvalidLogin: false,
      smtpLockedAccount: false,
      smtpRegistrationApproval: false,
      applicationApprove: false,
      registrationApprove: false,
      accountApprove: false,
      transactionApprove: false,
      unitPriceApprove: false,
      sendEmailsAccountApproval: false,
      sendEmailsAcknowledgment: false,
      sendEmailsInvestment: false,
      loginInvalidUser: false,
      loginAccountLock: false,
      certificateSeparateExitFee: false,
      sendEmailsOn: false,
      sendSmsOn: false,
      // Additional string fields
      companyPostalCode: '',
      companyStreet: '',
      companyTown: '',
      companyCity: '',
      companyTelephone: '',
      companyFax: '',
      reportPath: '',
      documentPath: '',
      unitsDecimalPosition: '',
      unitsDecimalMethod: '',
      amountDecimalPosition: '',
      amountDecimalMethod: '',
      multipleUserAccess: '',
      tableName: '',
      senderAddress: '',
      smtpServer: '',
      smtpUser: '',
      smtpPassword: '',
      emailSendingMethod: '',
      smtpPort: '',
      useDefaultCredentials: '',
      smsProvider: '',
      smsUserName: '',
      smsAlias: '',
      smsApiKey: '',
      // Date fields
      launchDate: null,
      ipoStartDate: null,
      ipoEndDate: null,
      maturityDate: null,
      commissionType: '',
      commissionDescription: '',
      territoryCode: '',
      territoryDescription: '',
      institutionCategoryCode: '',
      institutionCategoryActive: false,
      institutionCategoryType: '',
      institutionCategoryName: '',
      institutionCategoryAddress1: '',
      institutionCategoryAddress2: '',
      institutionCategoryAddress3: '',
      institutionCategoryContactPerson: '',
      institutionCategoryContactNo: '',
      institutionCategoryDescription: '',
      // New fields for Blocking Category
      blockingCategoryType: '',
      blockingCategoryActive: false,
      blockingCategoryDescription: '',
      // New fields for Customer Zone
      customerZoneCode: '',
      customerZoneActive: false,
      customerZoneDescription: '',
      // New fields for Compliance Msg Setup
      compliancePosition: '',
      complianceUser: '',
      // New fields for Title
      titleCode: '',
      titleActive: false,
      titleDescription: '',
      // New fields for Other Charges
      otherChargesCode: '',
      otherChargesActive: false,
      otherChargesName: '',
      otherChargesValidFrom: null,
      otherChargesValidTo: null,
      otherChargesType: 'percentage',
      otherChargesPercentage: '',
      otherChargesValue: '',
      // New fields for Commission Level
      commissionLevelCode: '',
      commissionLevelDescription: '',
      // New fields for Agent Commission Definition
      agentCommissionCategory: 'investment',
      agentCommissionType: '',
      agentCommissionLevel: '',
      agentCommissionFund: '',
      agentCommissionAgentType: 'agency',
      agentCommissionPeriodFrom: null,
      agentCommissionPeriodTo: null,
      agentCommissionAmountFrom: '',
      agentCommissionAmountTo: '',
      agentCommissionRate: '',
          // Joint Sale Agent fields
    jointAgency: '',
    jointSubAgency: '',
    jointAgentCode: '',
    jointAgentDescription: '',
    nameAgency: '',
    nameSubAgency: '',
    nameAgentCode: '',
    // Product Type fields
    productType: '',
    productTypeActive: false,
    productTypeDescription: '',
    });
  };

  // Modal state management
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [suspenseModalOpen, setSuspenseModalOpen] = useState(false);
  const [systemCalendarOpen, setSystemCalendarOpen] = useState(false);
  const [isFormEditable, setIsFormEditable] = useState(false);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  // Handle window resize for responsive design
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };

  // Handle input field changes
  // TODO: Add validation and API call for real-time validation
  // API Endpoint: POST /api/setup/validate-field
  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Handle date field changes
  // TODO: Add date validation and API call for date-specific validation
  // API Endpoint: POST /api/setup/validate-date
  const handleDateChange = (field: string, date: Date | null) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  // Handle new button click - clear form
  // TODO: Add API call to fetch default values for new record
  // API Endpoint: GET /api/setup/default-values/{module}
  const handleNewButtonClick = () => {
    setIsFormEditable(true);
    resetFormData();
  };

  // Handle modal open
  // TODO: Add API call to fetch existing data when opening modal
  // API Endpoint: GET /api/setup/{module}/data/{id}
  const handleModalOpen = (idx: number) => {
    setModalIdx(idx);
    setIsFormEditable(false);
  };

  // Handle save button click
  // TODO: Add API call to save form data
  // API Endpoint: POST /api/setup/{module}/save
  const handleSave = () => {
    console.log('Saving:', formData);
    alert('Data saved successfully!');
  };

  // Handle delete button click
  // TODO: Add API call to delete record
  // API Endpoint: DELETE /api/setup/{module}/delete/{id}
  const handleDelete = () => {
    console.log('Deleting record');
    alert('Record deleted successfully!');
  };

  // Handle print button click
  // TODO: Add API call to generate print data
  // API Endpoint: GET /api/setup/{module}/print/{id}
  const handlePrint = () => {
    console.log('Printing data');
    window.print();
  };

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  // Get table columns for specific module
  // TODO: Replace with API call to fetch table columns from backend
  // API Endpoint: GET /api/setup/table-columns/{module}
  const getTableColumns = (title: string) => {
    // Enforce explicit column order for specific modules
    if (title === 'Join Sale Agent') {
      return ['agencyCode', 'subAgencyCode', 'agentCode', 'agentDescription'];
    }
    const data = tableData[title as keyof typeof tableData] || [];
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  // Get table data for specific module
  // TODO: Replace with API call to fetch table data from backend
  // API Endpoint: GET /api/setup/table-data/{module}
  const getTableData = (title: string) => {
    return tableData[title as keyof typeof tableData] || [];
  };

  // ========================================
  // MODAL CONTENT RENDERER
  // ========================================

  // TODO: Replace with API call to fetch modal content configuration
  // API Endpoint: GET /api/setup/modal-config/{module}
  const renderModalContent = () => {
    if (modalIdx === null) return null;

    const modalTitle = modules[modalIdx].title;

    // Company modal has special tabbed layout
    if (modalTitle === 'Company') {
      return (
        <div className="setup-company-modal-content">
          <CompanyDetailsTabs 
            formData={formData}
            handleInputChange={handleInputChange}
            isFormEditable={isFormEditable}
            isMobile={isMobile}
          />
        </div>
      );
    }

    // Other modals use input grid layout
    return (
      <div className="setup-input-section">
        <div className={`setup-input-grid ${isMobile ? 'mobile' : ''}`}>
          {modalTitle === 'Bank' && (
            <BankModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Transaction Type' && (
            <TransactionTypeModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Trustees' && (
            <TrusteesModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Custodian' && (
            <CustodianModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
          )}
          {modalTitle === 'Postal Area' && (
            <PostalAreaModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
          )}
          {modalTitle === 'Dividend Type' && (
            <DividendTypeModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
          )}
          {modalTitle === 'Funds' && (
            <FundsModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleDateChange={handleDateChange}
              isFormEditable={isFormEditable} 
              setSuspenseModalOpen={setSuspenseModalOpen}
            />
          )}
          {modalTitle === 'Promotional Activity' && (
            <PromotionalActivityModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable}
            />
          )}
          {modalTitle === 'Other Charges' && (
            <OtherChargesModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleDateChange={handleDateChange}
              isFormEditable={isFormEditable}
            />
          )}
          {modalTitle === 'Unit Fee Codes' && (
            <UnitFeeCodesSection 
              formData={formData}
              handleInputChange={handleInputChange}
              isFormEditable={isFormEditable}
            />
          )}
          {modalTitle === 'Documents Setup' && (
            <DocumentsSetupModalContent 
              formData={formData}
              handleInputChange={handleInputChange}
              isFormEditable={isFormEditable}
            />
          )}
          {modalTitle === 'Agency Type' && (
            <AgencyTypeModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Agency' && (
            <AgencyModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Sub Agency' && (
            <SubAgencyModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Agents' && (
            <AgentModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Commision Type' && (
            <CommissionTypeModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Commission Level' && (
            <CommissionLevelModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable}
            />
          )}
          {modalTitle === 'Agent Commission Definition' && (
            <AgentCommissionDefinitionModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleDateChange={handleDateChange}
              isFormEditable={isFormEditable}
            />
          )}
          {modalTitle === 'Assign Agent to Commission Definition' && (
            <AgentCommissionDefinitionModalContent 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleDateChange={handleDateChange}
              isFormEditable={isFormEditable}
            />
          )}
            {modalTitle === 'Territory' && (
            <TerritoryModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Institution' && (
            <InstitutionModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Institution Category' && (
            <InstitutionCategoryModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
          {modalTitle === 'Blocking Category' && (
            <BlockingCategoryModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
                      {modalTitle === 'Customer Zone' && (
              <CustomerZoneModalContent 
                formData={formData} 
                handleInputChange={handleInputChange} 
                isFormEditable={isFormEditable} 
              />
            )}
            {modalTitle === 'Join Sale Agent' && (
              <JointSaleAgentModalContent
                formData={formData} 
                handleInputChange={handleInputChange}
                isFormEditable={isFormEditable}
              />
            )}
            {modalTitle === 'Complience MSG Setup' && (
              <ComplianceMsgSetupModalContent 
                formData={formData} 
                handleInputChange={handleInputChange} 
                isFormEditable={isFormEditable} 
              />
            )}
            {modalTitle === 'Title' && (
              <TitleModalContent 
                formData={formData} 
                handleInputChange={handleInputChange} 
                isFormEditable={isFormEditable} 
              />
            )}
            {modalTitle === 'Product Type' && (
  <ProductTypeModalContent 
    formData={formData} 
    handleInputChange={handleInputChange}
    isFormEditable={isFormEditable}
  />
)}
          {/* Default Bank modal for other modules */}
          {!['Bank', 'Transaction Type', 'Trustees', 'Custodian', 'Postal Area', 'Dividend Type', 'Funds', 'Promotional Activity', 'Other Charges', 'Company', 'Unit Fee Codes', 'Documents Setup', 'Agency Type', 'Agency', 'Sub Agency', 'Agents', 'Commision Type', 'Commission Level', 'Agent Commission Definition', 'Assign Agent to Commission Definition', 'Territory', 'Institution', 'Institution Category', 'Blocking Category', 'Customer Zone', 'Complience MSG Setup', 'Title', 'Join Sale Agent', 'Product Type'].includes(modalTitle) && (
            <BankModalContent 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isFormEditable={isFormEditable} 
            />
          )}
        </div>
      </div>
    );
  };

  // ========================================
  // TABLE CONTENT RENDERER
  // ========================================

  // TODO: Replace with API call to fetch table data
  // API Endpoint: GET /api/setup/table-data/{module}
  const renderTableContent = () => {
    if (modalIdx === null || modules[modalIdx].title === 'Company') return null;

    const modalTitle = modules[modalIdx].title;

    if (modalTitle === 'Funds') {
      return <FundsDetailsTabs />;
    }

    return (
      <CustomDataTable 
        data={getTableData(modalTitle)}
        columns={getTableColumns(modalTitle)}
      />
    );
  };

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ========================================
  // RENDER
  // ========================================

  return (
    <>
      <div className="navbar-fixed-wrapper">
        <Navbar />
      </div>
      <div className="setup-main-layout">
        {/* Sidebar left-aligned, fixed width on desktop only */}
        <div className="home-sidebar-container">
          <Sidebar />
        </div>
        {/* Main content area */}
        <div className="setup-main-content">
          <div className="setup-main-card magical-bg animated-bg">
            <div className="setup-modules-grid">
              {modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="setup-module-card"
                  tabIndex={0}
                  onClick={() => {
                    if (mod.title === 'System Calendar') {
                      setSystemCalendarOpen(true);
                    } else {
                      handleModalOpen(idx);
                    }
                  }}
                  onKeyDown={e => { 
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (mod.title === 'System Calendar') {
                        setSystemCalendarOpen(true);
                      } else {
                        handleModalOpen(idx);
                      }
                    }
                  }}
                >
                  <div className="setup-module-icon">{mod.icon}</div>
                  <div className="setup-module-title">{mod.title}</div>
                </div>
              ))}
            </div>
            
            {/* Comprehensive Modal */}
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
                        onClick={resetFormData}
                        className="setup-btn setup-btn-clear"
                        disabled={!isFormEditable}
                      >
                        <span className="setup-btn-icon">🗑️</span>
                        Clear
                      </button>
                    </div>

                    {/* Second Card - Tabbed Table Section */}
                    {modules[modalIdx].title !== 'Company' && (
                      <div className="setup-data-table-container">
                        <div className="setup-data-table-content">
                          {renderTableContent()}
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

            {/* Suspense Account Modal */}
            {suspenseModalOpen && createPortal(
              <div className={`setup-suspense-modal-overlay ${isMobile ? 'mobile' : ''}`}
                onClick={() => setSuspenseModalOpen(false)}
              >
                <div className={`setup-suspense-modal-container ${isMobile ? 'mobile' : ''}`}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="setup-suspense-modal-header">
                    <div className="setup-suspense-modal-header-content">
                      <span className="setup-suspense-modal-header-icon">🔍</span>
                      <span className="setup-suspense-modal-header-title">Search Account</span>
                    </div>
                    <button
                      onClick={() => setSuspenseModalOpen(false)}
                      className="setup-suspense-modal-close-btn"
                    >
                      ×
                    </button>
                  </div>

                  {/* Content */}
                  <div className="setup-suspense-modal-content">
                    {/* Search Form */}
                    <div className="setup-input-section">
                      <div className="setup-search-form-container">
                        {/* Full Width Name Input */}
                        <div className="setup-input-group" style={{ gridColumn: '1 / -1' }}>
                          <label className="setup-input-label">Name</label>
                          <input
                            type="text"
                            className="setup-input-field"
                            placeholder="Enter name"
                          />
                        </div>

                        {/* 3-Column Grid for 12 Inputs */}
                        <div className="setup-search-three-columns">
                          <div className="setup-input-group">
                            <label className="setup-input-label">Title</label>
                            <select className="setup-dropdown-select">
                              <option value="">Select title</option>
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Ms">Ms</option>
                              <option value="Dr">Dr</option>
                              <option value="Prof">Prof</option>
                            </select>
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">Initials</label>
                            <input
                              type="text"
                              className="setup-input-field"
                              placeholder="Enter initials"
                            />
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">Surname</label>
                            <input
                              type="text"
                              className="setup-input-field"
                              placeholder="Enter surname"
                            />
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">First Name</label>
                            <input
                              type="text"
                              className="setup-input-field"
                              placeholder="Enter first name"
                            />
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">Street</label>
                            <select className="setup-dropdown-select">
                              <option value="">Select street</option>
                              <option value="Main Street">Main Street</option>
                              <option value="Oak Avenue">Oak Avenue</option>
                              <option value="Pine Road">Pine Road</option>
                              <option value="Elm Street">Elm Street</option>
                              <option value="Cedar Lane">Cedar Lane</option>
                            </select>
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">Town</label>
                            <select className="setup-dropdown-select">
                              <option value="">Select town</option>
                              <option value="Downtown">Downtown</option>
                              <option value="Midtown">Midtown</option>
                              <option value="Uptown">Uptown</option>
                              <option value="Westside">Westside</option>
                              <option value="Eastside">Eastside</option>
                            </select>
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">City</label>
                            <select className="setup-dropdown-select">
                              <option value="">Select city</option>
                              <option value="New York">New York</option>
                              <option value="Los Angeles">Los Angeles</option>
                              <option value="Chicago">Chicago</option>
                              <option value="Houston">Houston</option>
                              <option value="Phoenix">Phoenix</option>
                            </select>
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">Holder ID</label>
                            <input
                              type="text"
                              className="setup-input-field"
                              placeholder="Enter holder ID"
                            />
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">NIC</label>
                            <input
                              type="text"
                              className="setup-input-field"
                              placeholder="Enter NIC"
                            />
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">Passport</label>
                            <input
                              type="text"
                              className="setup-input-field"
                              placeholder="Enter passport"
                            />
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">Other No</label>
                            <input
                              type="text"
                              className="setup-input-field"
                              placeholder="Enter other number"
                            />
                          </div>
                          <div className="setup-input-group">
                            <label className="setup-input-label">Fund</label>
                            <select className="setup-dropdown-select" defaultValue="11">
                              <option value="11">11</option>
                              <option value="12">12</option>
                              <option value="13">13</option>
                              <option value="14">14</option>
                              <option value="15">15</option>
                            </select>
                          </div>
                        </div>

                        {/* Buttons Row */}
                        <div className="setup-search-buttons-row">
                          <button className="setup-btn-get">Get</button>
                          <div className="setup-checkbox-container">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="setup-checkbox-input"
                            />
                            <span className="setup-checkbox-label">ignore Case</span>
                          </div>
                          <button className="setup-btn-search">Search</button>
                        </div>
                      </div>
                    </div>

                    {/* Results Area */}
                    <div className="setup-results-area">
                      {/* Loading Animation */}
                      <div className="setup-loading-container">
                        <div className="setup-loading-spinner"></div>
                        <span className="setup-loading-text">Please Wait...........</span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="setup-instructions">
                      Double click or press [Get] button to get the selected value
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}

            {/* System Calendar Modal */}
            <SystemCalendar
              isOpen={systemCalendarOpen}
              onClose={() => setSystemCalendarOpen(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function FundsDetailsTabs() {
  const [activeTab, setActiveTab] = React.useState('funds');
  // Define the columns and data for the Funds tab
  const fundsColumns = [
    'fundCode', 'fundName', 'fundManager', 'launch', 'minNo', 'minNA'
  ];
  const fundsData = [
    { fundCode: 'F001', fundName: 'Growth Fund', fundManager: 'John Smith', launch: '2023-01-15', minNo: '100', minNA: '10000' },
    { fundCode: 'F002', fundName: 'Income Fund', fundManager: 'Sarah Johnson', launch: '2023-03-20', minNo: '50', minNA: '5000' },
    { fundCode: 'F003', fundName: 'Balanced Fund', fundManager: 'Mike Wilson', launch: '2023-06-10', minNo: '75', minNA: '7500' },
  ];
  return (
    <div className="setup-input-section" style={{ marginTop: '0' }}>
      <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
        {/* Tab headers - Using Unit Holders Accounts Details style */}
        <div role="tablist" aria-label="Funds Details Tabs" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', marginBottom: '12px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {['Funds', 'Partly Redemptions', 'Fund Accounts', 'GL Account'].map(tab => {
            const tabKey = tab === 'Funds' ? 'funds' : 
                          tab === 'Partly Redemptions' ? 'partly-redemptions' :
                          tab === 'Fund Accounts' ? 'fund-accounts' : 'gl-account';
            return (
              <div
                key={tabKey}
                role="tab"
                aria-selected={activeTab === tabKey}
                tabIndex={0}
                onClick={() => setActiveTab(tabKey)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(tabKey); }}
                style={{
                  padding: '10px 14px',
                  background: activeTab === tabKey ? '#ffffff' : '#e2e8f0',
                  color: '#0f172a',
                  border: activeTab === tabKey ? '2px solid #0ea5e9' : '1px solid #cbd5e1',
                  borderBottom: activeTab === tabKey ? '2px solid #ffffff' : '1px solid #cbd5e1',
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
            );
          })}
        </div>

        {/* Tab content */}
        <div>
        {activeTab === 'funds' && (
          <CustomDataTable data={fundsData} columns={fundsColumns} />
        )}
        {activeTab === 'partly-redemptions' && (
          <div className="setup-partly-redemptions-tab">
            <div className="setup-redemptions-form">
              <div className="setup-redemptions-inputs">
                <div className="setup-input-group">
                  <label className="setup-input-label">Starting Date</label>
                  <input type="date" className="setup-input-field" placeholder="dd/mm/yyyy" />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Ending Date</label>
                  <input type="date" className="setup-input-field" placeholder="dd/mm/yyyy" />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Redeem Percentage</label>
                  <input type="number" className="setup-input-field" placeholder="%" />
                </div>
              </div>
              <div className="setup-redemptions-buttons">
                <button className="setup-btn-add">Add to List</button>
                <button className="setup-btn-remove">Remove all from List</button>
              </div>
            </div>
            <div className="setup-redemptions-list">
              <div className="setup-list-placeholder">
                <p>No redemptions added yet</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'fund-accounts' && (
          <div className="setup-fund-accounts-tab">
            <div className="setup-fund-accounts-form">
              <div className="setup-fund-accounts-inputs">
                <div className="setup-input-group">
                  <label className="setup-input-label">Account Type</label>
                  <select className="setup-dropdown-select">
                    <option value="">Select Account Type</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="fixed">Fixed Deposit</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Bank Code</label>
                  <select className="setup-dropdown-select">
                    <option value="">Select Bank</option>
                    <option value="BOC">BOC - Bank of Ceylon</option>
                    <option value="PEOPLES">PEOPLES - Peoples Bank</option>
                    <option value="HNB">HNB - Hatton National Bank</option>
                    <option value="COMBANK">COMBANK - Commercial Bank</option>
                    <option value="NDB">NDB - National Development Bank</option>
                  </select>
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Acc No</label>
                  <input type="text" className="setup-input-field" placeholder="Enter Account Number" />
                </div>
              </div>
              <div className="setup-fund-accounts-buttons">
                <button className="setup-btn-add">Add to List</button>
                <button className="setup-btn-remove">Remove from List</button>
              </div>
            </div>
            <div className="setup-fund-accounts-list">
              <div className="setup-list-placeholder">
                No fund accounts added yet
              </div>
            </div>
          </div>
        )}
        {activeTab === 'gl-account' && (
          <div className="setup-gl-account-tab">
            <div className="setup-gl-account-form">
              <div className="setup-gl-account-inputs">
                <div className="setup-input-group">
                  <label className="setup-input-label">Management Fee Account No (GL)</label>
                  <input type="text" className="setup-input-field" placeholder="Enter GL Account Number" />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Registrar Fee Account No (GL)</label>
                  <input type="text" className="setup-input-field" placeholder="Enter GL Account Number" />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Trustee Fee Account No (GL)</label>
                  <input type="text" className="setup-input-field" placeholder="Enter GL Account Number" />
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

function CompanyDetailsTabs({ formData, handleInputChange, isFormEditable, isMobile }: { formData: FormData, handleInputChange: (field: string, value: string | string[] | boolean) => void, isFormEditable: boolean, isMobile: boolean }) {
  const [activeTab, setActiveTab] = React.useState('company');
  
  return (
    <>
      {/* Tab Navigation - Using Unit Holders Accounts Details style */}
      <div className="setup-input-section" style={{ marginTop: '0' }}>
        <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
          {/* Tab headers */}
          <div role="tablist" aria-label="Company Details Tabs" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', marginBottom: '12px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {['Company', 'Administrator', 'Email and SMS'].map(tab => {
              const tabKey = tab === 'Company' ? 'company' : 
                            tab === 'Administrator' ? 'administrator' : 'email-sms';
              return (
                <div
                  key={tabKey}
                  role="tab"
                  aria-selected={activeTab === tabKey}
                  tabIndex={0}
                  onClick={() => setActiveTab(tabKey)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(tabKey); }}
                  style={{
                    padding: '10px 14px',
                    background: activeTab === tabKey ? '#ffffff' : '#e2e8f0',
                    color: '#0f172a',
                    border: activeTab === tabKey ? '2px solid #0ea5e9' : '1px solid #cbd5e1',
                    borderBottom: activeTab === tabKey ? '2px solid #ffffff' : '1px solid #cbd5e1',
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
              );
            })}
          </div>

          {/* Tab content */}
          <div>
        {activeTab === 'company' && (
          <div className="setup-company-tab">
            <div className="setup-company-form">
              <div className={`setup-input-grid ${isMobile ? 'mobile' : ''}`}>
                                                         <div className="setup-input-group">
                  <label className="setup-input-label">Code</label>
                  <input
                    type="text"
                    value={formData.companyCode}
                    onChange={(e) => handleInputChange('companyCode', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter code"
                  />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter name"
                  />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Postal Code</label>
                  <input
                    type="text"
                    value={formData.companyPostalCode}
                    onChange={(e) => handleInputChange('companyPostalCode', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter postal code"
                  />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Street</label>
                  <input
                    type="text"
                    value={formData.companyStreet}
                    onChange={(e) => handleInputChange('companyStreet', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter street"
                  />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Town</label>
                  <input
                    type="text"
                    value={formData.companyTown}
                    onChange={(e) => handleInputChange('companyTown', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter town"
                  />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">City</label>
                  <input
                    type="text"
                    value={formData.companyCity}
                    onChange={(e) => handleInputChange('companyCity', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter city"
                  />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Telephone</label>
                  <input
                    type="text"
                    value={formData.companyTelephone}
                    onChange={(e) => handleInputChange('companyTelephone', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter telephone"
                  />
                </div>
                <div className="setup-input-group">
                  <label className="setup-input-label">Fax</label>
                  <input
                    type="text"
                    value={formData.companyFax}
                    onChange={(e) => handleInputChange('companyFax', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter fax"
                  />
                </div>
                <div className="setup-input-group" style={{ gridColumn: '3 / 4' }}>
                  <div className="setup-checkbox-container">
                    <input
                      type="checkbox"
                      id="applicationApproval"
                      checked={formData.companyApplicationApproval}
                                                  onChange={(e) => handleInputChange('companyApplicationApproval', e.target.checked)}
                      disabled={!isFormEditable}
                      className="setup-checkbox-input"
                    />
                    <label htmlFor="applicationApproval" className="setup-checkbox-label">
                      Application approval
                               </label>
                  </div>
                  <div className="setup-checkbox-container">
                    <input
                      type="checkbox"
                      id="accountApproval"
                      checked={formData.companyAccountApproval}
                                                  onChange={(e) => handleInputChange('companyAccountApproval', e.target.checked)}
                      disabled={!isFormEditable}
                      className="setup-checkbox-input"
                    />
                    <label htmlFor="accountApproval" className="setup-checkbox-label">
                      Account approval
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'administrator' && (
          <div className="setup-administrator-tab">
            <div className="setup-administrator-form">
              
              {/* ========================================
                 PATH CONFIGURATION SECTION (FULL WIDTH)
                 ======================================== */}
              <div className="setup-input-group">
                <label className="setup-input-label">Report Path</label>
                <input
                  type="text"
                  value={formData.reportPath}
                  onChange={(e) => handleInputChange('reportPath', e.target.value)}
                  disabled={!isFormEditable}
                  className="setup-input-field"
                  placeholder="Enter report path"
                />
              </div>
              <div className="setup-input-group">
                <label className="setup-input-label">Document Path</label>
                <input
                  type="text"
                  value={formData.documentPath}
                  onChange={(e) => handleInputChange('documentPath', e.target.value)}
                  disabled={!isFormEditable}
                  className="setup-input-field"
                  placeholder="Enter document path"
                />
              </div>

              {/* ========================================
                 TWO COLUMN LAYOUT SECTION
                 ======================================== */}
              <div className="setup-administrator-two-column">
                
                {/* LEFT COLUMN - 3 ROWS WITH ASH BACKGROUND */}
                <div className="setup-administrator-left-column">
                  
                  {/* Row 1: Units */}
                  <div className="setup-ash-box">
                    <label className="setup-input-label">Units</label>
                                                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', alignItems: 'center' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
                            <label className="setup-input-label" style={{ marginBottom: '0' }}>Decimal Position</label>
                            <input
                              type="text"
                              value={formData.unitsDecimalPosition}
                              onChange={(e) => handleInputChange('unitsDecimalPosition', e.target.value)}
                              disabled={!isFormEditable}
                              className="setup-input-field"
                              placeholder="Enter decimal position"
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <label className="setup-radio-label">
                              <input
                                type="radio"
                                name="unitsDecimalMethod"
                                value="truncate"
                                checked={formData.unitsDecimalMethod === 'truncate'}
                                onChange={(e) => handleInputChange('unitsDecimalMethod', e.target.value)}
                                disabled={!isFormEditable}
                                className="setup-radio-input"
                              />
                              Truncate
                            </label>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <label className="setup-radio-label">
                              <input
                                type="radio"
                                name="unitsDecimalMethod"
                                value="round"
                                checked={formData.unitsDecimalMethod === 'round'}
                                onChange={(e) => handleInputChange('unitsDecimalMethod', e.target.value)}
                                disabled={!isFormEditable}
                                className="setup-radio-input"
                              />
                              Round
                            </label>
                          </div>
                        </div>
                  </div>

                  {/* Row 2: Amount */}
                  <div className="setup-ash-box">
                    <label className="setup-input-label">Amount</label>
                                                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', alignItems: 'center' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
                            <label className="setup-input-label" style={{ marginBottom: '0' }}>Decimal Position</label>
                            <input
                              type="text"
                              value={formData.amountDecimalPosition}
                              onChange={(e) => handleInputChange('amountDecimalPosition', e.target.value)}
                              disabled={!isFormEditable}
                              className="setup-input-field"
                              placeholder="Enter decimal position"
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <label className="setup-radio-label">
                              <input
                                type="radio"
                                name="amountDecimalMethod"
                                value="truncate"
                                checked={formData.amountDecimalMethod === 'truncate'}
                                onChange={(e) => handleInputChange('amountDecimalMethod', e.target.value)}
                                disabled={!isFormEditable}
                                className="setup-radio-input"
                              />
                              Truncate
                            </label>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <label className="setup-radio-label">
                              <input
                                type="radio"
                                name="amountDecimalMethod"
                                value="round"
                                checked={formData.amountDecimalMethod === 'round'}
                                onChange={(e) => handleInputChange('amountDecimalMethod', e.target.value)}
                                disabled={!isFormEditable}
                                className="setup-radio-input"
                              />
                              Round
                            </label>
                          </div>
                        </div>
                  </div>

                  {/* Row 3: SMTP Email Setup */}
                  <div className="setup-ash-box">
                    <label className="setup-input-label">SMTP Email Setup</label>
                    <div className="setup-three-column-row">
                      <div className="setup-column">
                        <div className="setup-checkbox-container">
                          <input
                            type="checkbox"
                            id="smtpInvalidLogin"
                            checked={formData.smtpInvalidLogin}
                            onChange={(e) => handleInputChange('smtpInvalidLogin', e.target.checked)}
                            disabled={!isFormEditable}
                            className="setup-checkbox-input"
                          />
                          <label htmlFor="smtpInvalidLogin" className="setup-checkbox-label">
                            Invalid Login
                          </label>
                        </div>
                      </div>
                      <div className="setup-column">
                        <div className="setup-checkbox-container">
                          <input
                            type="checkbox"
                            id="smtpLockedAccount"
                            checked={formData.smtpLockedAccount}
                            onChange={(e) => handleInputChange('smtpLockedAccount', e.target.checked)}
                            disabled={!isFormEditable}
                            className="setup-checkbox-input"
                          />
                          <label htmlFor="smtpLockedAccount" className="setup-checkbox-label">
                            Locked Account
                          </label>
                        </div>
                      </div>
                      <div className="setup-column">
                        <div className="setup-checkbox-container">
                          <input
                            type="checkbox"
                            id="smtpRegistrationApproval"
                            checked={formData.smtpRegistrationApproval}
                            onChange={(e) => handleInputChange('smtpRegistrationApproval', e.target.checked)}
                            disabled={!isFormEditable}
                            className="setup-checkbox-input"
                          />
                          <label htmlFor="smtpRegistrationApproval" className="setup-checkbox-label">
                            Registration Approval
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN - DIFFERENT DATA ENTRY CONFIRM/APPROVE */}
                <div className="setup-administrator-right-column">
                  <div className="setup-ash-box">
                    <label className="setup-input-label">Different Data Entry Confirm/Approve</label>
                    <div className="setup-checkbox-group">
                      <div className="setup-checkbox-container">
                        <input
                          type="checkbox"
                          id="applicationApprove"
                          checked={formData.applicationApprove}
                          onChange={(e) => handleInputChange('applicationApprove', e.target.checked)}
                          disabled={!isFormEditable}
                          className="setup-checkbox-input"
                        />
                        <label htmlFor="applicationApprove" className="setup-checkbox-label">
                          Application Approve
                        </label>
                      </div>
                      <div className="setup-checkbox-container">
                        <input
                          type="checkbox"
                          id="registrationApprove"
                          checked={formData.registrationApprove}
                          onChange={(e) => handleInputChange('registrationApprove', e.target.checked)}
                          disabled={!isFormEditable}
                          className="setup-checkbox-input"
                        />
                        <label htmlFor="registrationApprove" className="setup-checkbox-label">
                          Registration Approve
                        </label>
                      </div>
                      <div className="setup-checkbox-container">
                        <input
                          type="checkbox"
                          id="accountApprove"
                          checked={formData.accountApprove}
                          onChange={(e) => handleInputChange('accountApprove', e.target.checked.toString())}
                          disabled={!isFormEditable}
                          className="setup-checkbox-input"
                        />
                        <label htmlFor="accountApprove" className="setup-checkbox-label">
                          Account Approve
                        </label>
                      </div>
                      <div className="setup-checkbox-container">
                        <input
                          type="checkbox"
                          id="transactionApprove"
                          checked={formData.transactionApprove}
                          onChange={(e) => handleInputChange('transactionApprove', e.target.checked.toString())}
                          disabled={!isFormEditable}
                          className="setup-checkbox-input"
                        />
                        <label htmlFor="transactionApprove" className="setup-checkbox-label">
                          Transaction Approve
                        </label>
                      </div>
                      <div className="setup-checkbox-container">
                        <input
                          type="checkbox"
                          id="unitPriceApprove"
                          checked={formData.unitPriceApprove}
                          onChange={(e) => handleInputChange('unitPriceApprove', e.target.checked.toString())}
                          disabled={!isFormEditable}
                          className="setup-checkbox-input"
                        />
                        <label htmlFor="unitPriceApprove" className="setup-checkbox-label">
                          Unit Price Approve
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ========================================
                 FULL WIDTH THREE COLUMN SECTION
                 ======================================== */}
              <div className="setup-administrator-full-width">
                
                {/* Column 1: Email Sending Options */}
                <div className="setup-ash-box">
                  <label className="setup-input-label">Email Sending Options</label>
                  <div className="setup-checkbox-group">
                    <div className="setup-checkbox-container">
                      <input
                        type="checkbox"
                        id="sendEmailsAccountApproval"
                        checked={formData.sendEmailsAccountApproval}
                        onChange={(e) => handleInputChange('sendEmailsAccountApproval', e.target.checked.toString())}
                        disabled={!isFormEditable}
                        className="setup-checkbox-input"
                      />
                      <label htmlFor="sendEmailsAccountApproval" className="setup-checkbox-label">
                        Send Emails on Account Approval
                      </label>
                    </div>
                    <div className="setup-checkbox-container">
                      <input
                        type="checkbox"
                        id="sendEmailsAcknowledgment"
                        checked={formData.sendEmailsAcknowledgment}
                        onChange={(e) => handleInputChange('sendEmailsAcknowledgment', e.target.checked.toString())}
                        disabled={!isFormEditable}
                        className="setup-checkbox-input"
                      />
                      <label htmlFor="sendEmailsAcknowledgment" className="setup-checkbox-label">
                        Send Emails on Acknowledgment
                      </label>
                    </div>
                    <div className="setup-checkbox-container">
                      <input
                        type="checkbox"
                        id="sendEmailsInvestment"
                        checked={formData.sendEmailsInvestment}
                        onChange={(e) => handleInputChange('sendEmailsInvestment', e.target.checked.toString())}
                        disabled={!isFormEditable}
                        className="setup-checkbox-input"
                      />
                      <label htmlFor="sendEmailsInvestment" className="setup-checkbox-label">
                        Send Emails on Investment
                      </label>
                    </div>
                  </div>
                </div>

                {/* Column 2: Login */}
                <div className="setup-ash-box">
                  <label className="setup-input-label">Login</label>
                  <div className="setup-checkbox-group">
                    <div className="setup-checkbox-container">
                      <input
                        type="checkbox"
                        id="loginInvalidUser"
                        checked={formData.loginInvalidUser}
                        onChange={(e) => handleInputChange('loginInvalidUser', e.target.checked.toString())}
                        disabled={!isFormEditable}
                        className="setup-checkbox-input"
                      />
                      <label htmlFor="loginInvalidUser" className="setup-checkbox-label">
                        Invalid User
                      </label>
                    </div>
                    <div className="setup-checkbox-container">
                      <input
                        type="checkbox"
                        id="loginAccountLock"
                        checked={formData.loginAccountLock}
                        onChange={(e) => handleInputChange('loginAccountLock', e.target.checked.toString())}
                        disabled={!isFormEditable}
                        className="setup-checkbox-input"
                      />
                      <label htmlFor="loginAccountLock" className="setup-checkbox-label">
                        Account Lock
                      </label>
                    </div>
                  </div>
                </div>

                {/* Column 3: Multiple User Access */}
                <div className="setup-ash-box">
                  <label className="setup-input-label">Multiple User Access</label>
                  <div className="setup-radio-group">
                    <label className="setup-radio-label">
                      <input
                        type="radio"
                        name="multipleUserAccess"
                        value="yes"
                        checked={formData.multipleUserAccess === 'yes'}
                        onChange={(e) => handleInputChange('multipleUserAccess', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-radio-input"
                      />
                      Yes
                    </label>
                    <label className="setup-radio-label">
                      <input
                        type="radio"
                        name="multipleUserAccess"
                        value="no"
                        checked={formData.multipleUserAccess === 'no'}
                        onChange={(e) => handleInputChange('multipleUserAccess', e.target.value)}
                        disabled={!isFormEditable}
                        className="setup-radio-input"
                      />
                      No
                    </label>
                  </div>
                </div>

              </div>

              {/* ========================================
                 BOTTOM SECTION - TABLE NAME, CREATE FILE, CERTIFICATE
                 ======================================== */}
              <div className="setup-three-column-row" style={{ marginBottom: '48px' }}>
                <div className="setup-column" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', alignItems: 'center' }}>
                  <label className="setup-input-label" style={{ marginBottom: '0' }}>Table Name</label>
                  <input
                    type="text"
                    value={formData.tableName}
                    onChange={(e) => handleInputChange('tableName', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-input-field"
                    placeholder="Enter table name"
                  />
                </div>
                
                <div className="setup-column" style={{ display: 'flex', alignItems: 'end' }}>
                  <button
                    onClick={() => {
                      // TODO: Add API call to create configuration file
                      // API Endpoint: POST /api/setup/administrator/create-file
                      console.log('Creating configuration file with data:', formData);
                      alert('Configuration file created successfully!');
                    }}
                    disabled={!isFormEditable}
                    className="setup-btn setup-btn-primary"
                    style={{ width: '100%' }}
                  >
                    Create File
                  </button>
                </div>
                
                <div className="setup-column" style={{ display: 'flex', alignItems: 'end' }}>
                  <div className="setup-checkbox-container">
                    <input
                      type="checkbox"
                      id="certificateSeparateExitFee"
                      checked={formData.certificateSeparateExitFee}
                      onChange={(e) => handleInputChange('certificateSeparateExitFee', e.target.checked.toString())}
                      disabled={!isFormEditable}
                      className="setup-checkbox-input"
                    />
                    <label htmlFor="certificateSeparateExitFee" className="setup-checkbox-label">
                      Certificate Separate with Exit Fee
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
        {activeTab === 'email-sms' && (
          <div className="setup-email-sms-tab">
            {/* Email Parameter Setting Box */}
            <div className="setup-ash-box" style={{ marginBottom: '24px' }}>
              <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px' }}>Email Parameter Setting</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="setup-checkbox-container">
                    <input
                      type="checkbox"
                      id="sendEmailsOn"
                      checked={formData.sendEmailsOn || false}
                      onChange={e => handleInputChange('sendEmailsOn', e.target.checked.toString())}
                      disabled={!isFormEditable}
                      className="setup-checkbox-input"
                    />
                    <label htmlFor="sendEmailsOn" className="setup-checkbox-label">Send Emails On</label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>Sender Address</label>
                    <input
                      type="text"
                      value={formData.senderAddress || ''}
                      onChange={e => handleInputChange('senderAddress', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter sender address"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>SMTP Server</label>
                    <input
                      type="text"
                      value={formData.smtpServer || ''}
                      onChange={e => handleInputChange('smtpServer', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter SMTP server"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>SMTP User</label>
                    <input
                      type="text"
                      value={formData.smtpUser || ''}
                      onChange={e => handleInputChange('smtpUser', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter SMTP user"
                    />
                  </div>
                </div>
                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>Password</label>
                    <input
                      type="password"
                      value={formData.smtpPassword || ''}
                      onChange={e => handleInputChange('smtpPassword', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter password"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>Email Sending Method</label>
                    <select
                      value={formData.emailSendingMethod || ''}
                      onChange={e => handleInputChange('emailSendingMethod', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                    >
                      <option value="">Select method</option>
                      <option value="smtp">SMTP</option>
                      <option value="api">API</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>Port Number</label>
                    <input
                      type="text"
                      value={formData.smtpPort || ''}
                      onChange={e => handleInputChange('smtpPort', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter port number"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>Use Default Credentials</label>
                    <select
                      value={formData.useDefaultCredentials || ''}
                      onChange={e => handleInputChange('useDefaultCredentials', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                    >
                      <option value="">Select</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* SMS Provider and Parameter Setting Box */}
            <div className="setup-ash-box">
              <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px' }}>SMS Provider and Parameter Setting</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="setup-checkbox-container">
                    <input
                      type="checkbox"
                      id="sendSmsOn"
                      checked={formData.sendSmsOn || false}
                      onChange={e => handleInputChange('sendSmsOn', e.target.checked.toString())}
                      disabled={!isFormEditable}
                      className="setup-checkbox-input"
                    />
                    <label htmlFor="sendSmsOn" className="setup-checkbox-label">Send SMS On</label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>SMS Provider</label>
                    <select
                      value={formData.smsProvider || ''}
                      onChange={e => handleInputChange('smsProvider', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                    >
                      <option value="">Select provider</option>
                      <option value="twilio">Twilio</option>
                      <option value="nexmo">Nexmo</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>User Name</label>
                    <input
                      type="text"
                      value={formData.smsUserName || ''}
                      onChange={e => handleInputChange('smsUserName', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter user name"
                    />
                  </div>
                </div>
                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>Alias</label>
                    <input
                      type="text"
                      value={formData.smsAlias || ''}
                      onChange={e => handleInputChange('smsAlias', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter alias"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ marginBottom: 0 }}>API Key</label>
                    <input
                      type="text"
                      value={formData.smsApiKey || ''}
                      onChange={e => handleInputChange('smsApiKey', e.target.value)}
                      disabled={!isFormEditable}
                      className="setup-input-field"
                      placeholder="Enter API key"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </>
  );
}

// ========================================
// MODAL COMPONENTS
// ========================================

// ========================================
// BANK MODAL COMPONENT
// ========================================
function BankModalContent({ formData, handleInputChange, isFormEditable = false }: { formData: FormData, handleInputChange: (field: string, value: string) => void, isFormEditable: boolean }) {
  return (
    <>
      <div className="setup-input-group">
        <label className="setup-input-label">Bank Code</label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => handleInputChange('code', e.target.value)}
          maxLength={7}
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
      <div className="setup-input-group">
        <label className="setup-input-label">Address (No/Street/Town/City)</label>
        <textarea
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter address as: No, Street Name, Town, City"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">District</label>
        <select
          value={formData.district}
          onChange={(e) => handleInputChange('district', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
        >
          <option value="">Select district</option>
          <option value="Ampara">Ampara</option>
          <option value="Anuradhapura">Anuradhapura</option>
          <option value="Badulla">Badulla</option>
          <option value="Batticaloa">Batticaloa</option>
          <option value="Colombo">Colombo</option>
          <option value="Galle">Galle</option>
          <option value="Gampaha">Gampaha</option>
          <option value="Hambantota">Hambantota</option>
          <option value="Jaffna">Jaffna</option>
          <option value="Kalutara">Kalutara</option>
          <option value="Kandy">Kandy</option>
          <option value="Kegalle">Kegalle</option>
          <option value="Kilinochchi">Kilinochchi</option>
          <option value="Kurunegala">Kurunegala</option>
          <option value="Mannar">Mannar</option>
          <option value="Matale">Matale</option>
          <option value="Matara">Matara</option>
          <option value="Monaragala">Monaragala</option>
          <option value="Mullaitivu">Mullaitivu</option>
          <option value="Nuwara Eliya">Nuwara Eliya</option>
          <option value="Polonnaruwa">Polonnaruwa</option>
          <option value="Puttalam">Puttalam</option>
          <option value="Ratnapura">Ratnapura</option>
          <option value="Trincomalee">Trincomalee</option>
          <option value="Vavuniya">Vavuniya</option>
        </select>
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Swift Code</label>
        <input
          type="text"
          value={formData.swiftCode}
          onChange={(e) => handleInputChange('swiftCode', e.target.value)}
          className="setup-input-field readonly"
          placeholder="Read only field"
          readOnly
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Branch No</label>
        <input
          type="text"
          value={formData.branchNo}
          onChange={(e) => handleInputChange('branchNo', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter branch number"
        />
      </div>
    </>
  );
}

// ========================================
// TRANSACTION TYPE MODAL COMPONENT
// ========================================
function TransactionTypeModalContent({ formData, handleInputChange, isFormEditable = false }: { formData: FormData, handleInputChange: (field: string, value: string) => void, isFormEditable: boolean }) {
  return (
                                                      <>
                                                         <div className="setup-input-group">
        <label className="setup-input-label">Transaction Code</label>
                               <input
                                 type="text"
                                 value={formData.transactionCode}
                                 onChange={(e) => handleInputChange('transactionCode', e.target.value)}
                                 className="setup-input-field"
                                 placeholder="Enter transaction code"
                                 disabled={!isFormEditable}
                               />
              </div>
                             <div>
        <label className="setup-input-label">Transaction Type</label>
                               <select
                                 value={formData.transactionType}
                                 onChange={(e) => handleInputChange('transactionType', e.target.value)}
                                 disabled={!isFormEditable}
          className="setup-select-field"
                               >
                                 <option value="">Select transaction type</option>
                                 <option value="Purchase">Purchase</option>
                                 <option value="Sale">Sale</option>
                                 <option value="Dividend">Dividend</option>
                                 <option value="Transfer">Transfer</option>
                               </select>
                             </div>
                             <div>
        <label className="setup-input-label">Transaction Name</label>
                               <input
                                 type="text"
                                 value={formData.transactionName}
                                 onChange={(e) => handleInputChange('transactionName', e.target.value)}
                                 disabled={!isFormEditable}
          className="setup-input-field"
                                 placeholder="Enter transaction name"
                               />
                             </div>
                             <div>
        <label className="setup-input-label">Last Transaction Number</label>
                               <input
                                 type="text"
                                 value={formData.lastTransactionNumber}
                                 onChange={(e) => handleInputChange('lastTransactionNumber', e.target.value)}
                                 disabled={!isFormEditable}
          className="setup-input-field"
                                 placeholder="Enter last transaction number"
                               />
                             </div>
                          </>
  );
}

// ========================================
// TRUSTEES MODAL COMPONENT
// ========================================
function TrusteesModalContent({ formData, handleInputChange, isFormEditable = false }: { formData: FormData, handleInputChange: (field: string, value: string) => void, isFormEditable: boolean }) {
  return (
                          <>
                            <div>
        <label className="setup-input-label">Trustee Code</label>
                              <input
                                type="text"
                                value={formData.trusteeCode}
                                onChange={(e) => handleInputChange('trusteeCode', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter trustee code"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Active</label>
        <div className="setup-checkbox-group">
                                <input
                                  type="checkbox"
                                  checked={formData.active}
                                  onChange={(e) => handleInputChange('active', e.target.checked.toString())}
                                  disabled={!isFormEditable}
            className="setup-checkbox"
          />
          <span className="setup-checkbox-label">Active</span>
                              </div>
                            </div>
                            <div>
        <label className="setup-input-label">Trustee Name</label>
                              <input
                                type="text"
                                value={formData.trusteeName}
                                onChange={(e) => handleInputChange('trusteeName', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter trustee name"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Address (No/Street/Town/City)</label>
                              <input
                                type="text"
                                value={formData.trusteeAddress}
                                onChange={(e) => handleInputChange('trusteeAddress', e.target.value)}
                                disabled={!isFormEditable}
          className="setup-input-field"
                                placeholder="Enter address as: No, Street Name, Town, City"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Telephone Number</label>
                              <input
                                type="text"
                                value={formData.telephoneNumber}
                                onChange={(e) => handleInputChange('telephoneNumber', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter telephone number"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Fax No</label>
                              <input
                                type="text"
                                value={formData.faxNo}
                                onChange={(e) => handleInputChange('faxNo', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter fax number"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">E-mail</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter e-mail"
                              />
                            </div>
                          </>
  );
}

// ========================================
// CUSTODIAN MODAL COMPONENT
// ========================================
function CustodianModalContent({ formData, handleInputChange }: { formData: FormData, handleInputChange: (field: string, value: string) => void }) {
  return (
                          <>
                            <div>
        <label className="setup-input-label">Custodian Code</label>
                              <input
                                type="text"
                                value={formData.custodianCode}
                                onChange={(e) => handleInputChange('custodianCode', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter custodian code"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Active</label>
        <div className="setup-checkbox-group">
                                <input
                                  type="checkbox"
                                  checked={formData.custodianActive}
                                  onChange={(e) => handleInputChange('custodianActive', e.target.checked.toString())}
            className="setup-checkbox"
          />
          <span className="setup-checkbox-label">Active</span>
                              </div>
                            </div>
                            <div>
        <label className="setup-input-label">Custodian Name</label>
                              <input
                                type="text"
                                value={formData.custodianName}
                                onChange={(e) => handleInputChange('custodianName', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter custodian name"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Address 1</label>
                              <input
                                type="text"
                                value={formData.custodianAddress1}
                                onChange={(e) => handleInputChange('custodianAddress1', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter address 1"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Address 2</label>
                              <input
                                type="text"
                                value={formData.custodianAddress2}
                                onChange={(e) => handleInputChange('custodianAddress2', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter address 2"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Address 3</label>
                              <input
                                type="text"
                                value={formData.custodianAddress3}
                                onChange={(e) => handleInputChange('custodianAddress3', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter address 3"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Telephone Number</label>
                              <input
                                type="text"
                                value={formData.custodianTelephoneNumber}
                                onChange={(e) => handleInputChange('custodianTelephoneNumber', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter telephone number"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Fax No</label>
                              <input
                                type="text"
                                value={formData.custodianFaxNo}
                                onChange={(e) => handleInputChange('custodianFaxNo', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter fax number"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">E-mail</label>
                              <input
                                type="email"
                                value={formData.custodianEmail}
                                onChange={(e) => handleInputChange('custodianEmail', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter e-mail"
                              />
                            </div>
                          </>
  );
}

// ========================================
// POSTAL AREA MODAL COMPONENT
// ========================================
function PostalAreaModalContent({ formData, handleInputChange }: { formData: FormData, handleInputChange: (field: string, value: string) => void }) {
  return (
                          <>
                            <div>
        <label className="setup-input-label">Postal Code</label>
                              <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter postal code"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Active</label>
        <div className="setup-checkbox-group">
                                <input
                                  type="checkbox"
                                  checked={formData.postalActive}
                                  onChange={(e) => handleInputChange('postalActive', e.target.checked.toString())}
            className="setup-checkbox"
          />
          <span className="setup-checkbox-label">Active</span>
                              </div>
                            </div>
                            <div>
        <label className="setup-input-label">Description</label>
                              <input
                                type="text"
                                value={formData.postalDescription}
                                onChange={(e) => handleInputChange('postalDescription', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter description"
                              />
                            </div>
                          </>
  );
}

// ========================================
// DIVIDEND TYPE MODAL COMPONENT
// ========================================
function DividendTypeModalContent({ formData, handleInputChange }: { formData: FormData, handleInputChange: (field: string, value: string) => void }) {
  return (
                          <>
                            <div>
        <label className="setup-input-label">Dividend Type</label>
                              <input
                                type="text"
                                value={formData.dividendType}
                                onChange={(e) => handleInputChange('dividendType', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter dividend type"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Active</label>
        <div className="setup-checkbox-group">
                                <input
                                  type="checkbox"
                                  checked={formData.dividendActive}
                                  onChange={(e) => handleInputChange('dividendActive', e.target.checked.toString())}
            className="setup-checkbox"
          />
          <span className="setup-checkbox-label">Active</span>
                              </div>
                            </div>
                            <div>
        <label className="setup-input-label">Description</label>
                              <input
                                type="text"
                                value={formData.dividendDescription}
                                onChange={(e) => handleInputChange('dividendDescription', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter description"
                              />
                            </div>
                          </>
  );
}

// ========================================
// FUNDS MODAL COMPONENT
// ========================================
function FundsModalContent({ formData, handleInputChange, handleDateChange, isFormEditable = false, setSuspenseModalOpen }: { formData: FormData, handleInputChange: (field: string, value: string) => void, handleDateChange: (field: string, date: Date | null) => void, isFormEditable: boolean, setSuspenseModalOpen: (open: boolean) => void }) {
  return (
                          <>
                            <div>
        <label className="setup-input-label">Fund</label>
                              <input
                                type="text"
                                value={formData.fund}
                                onChange={(e) => handleInputChange('fund', e.target.value)}
                                disabled={!isFormEditable}
          className="setup-input-field"
                                placeholder="Enter Fund"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Name</label>
                              <input
                                type="text"
                                value={formData.fundName}
                                onChange={(e) => handleInputChange('fundName', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter Name"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Manager</label>
                              <input
                                type="text"
                                value={formData.manager}
                                onChange={(e) => handleInputChange('manager', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter Manager"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Trustee</label>
                              <select
                                value={formData.trustee}
                                onChange={(e) => handleInputChange('trustee', e.target.value)}
                                disabled={!isFormEditable}
          className="setup-select-field"
                              >
                                <option value="">Select Trustee</option>
                                <option value="Trust Corp">Trust Corp</option>
                                <option value="Fiduciary Ltd">Fiduciary Ltd</option>
                                <option value="Trustee Corp">Trustee Corp</option>
                              </select>
                            </div>
                            <div>
        <label className="setup-input-label">Custodian</label>
                              <select
                                value={formData.custodian}
                                onChange={(e) => handleInputChange('custodian', e.target.value)}
          className="setup-select-field"
                              >
                                <option value="">Select Custodian</option>
                                <option value="Global Custody">Global Custody</option>
                                <option value="Euro Custody">Euro Custody</option>
                                <option value="Asia Custody">Asia Custody</option>
                              </select>
                            </div>
                            <div>
        <label className="setup-input-label">Min Value of Investment</label>
                              <input
                                type="text"
                                value={formData.minValue}
                                onChange={(e) => handleInputChange('minValue', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter Min Value"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Min No of Units</label>
                              <input
                                type="text"
                                value={formData.minUnits}
                                onChange={(e) => handleInputChange('minUnits', e.target.value)}
          className="setup-input-field"
                                placeholder="Enter Units"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Fund Suspense Account</label>
        <div className="setup-suspense-input-container">
                                <button
                                  type="button"
            onClick={() => setSuspenseModalOpen?.(true)}
            className="setup-suspense-account-button"
                                >
                                  A
                                </button>
                                <input
                                  type="text"
                                  value={formData.suspenseAccount}
                                  onChange={(e) => handleInputChange('suspenseAccount', e.target.value)}
            className="setup-suspense-input-field"
                                  placeholder="Enter Suspense Account"
                                />
                              </div>
                            </div>
                                                           <div>
        <label className="setup-input-label">Launch Date</label>
                                 <DatePicker
                                   selected={formData.launchDate}
          onChange={(date) => handleDateChange?.('launchDate', date)}
                                   dateFormat="dd/MM/yyyy"
                                   placeholderText="dd/mm/yyyy"
                                   className="date-picker-input"
                                   disabled={!isFormEditable}
                                 />
                               </div>
                            <div>
        <label className="setup-input-label">Fund Type</label>
        <div className="setup-radio-group">
          <label className="setup-radio-item">
                                  <input
                                    type="radio"
                                    name="fundType"
                                    value="Open Ended"
                                    checked={formData.fundType === 'Open Ended'}
                                    onChange={(e) => handleInputChange('fundType', e.target.value)}
                                    disabled={!isFormEditable}
              className="setup-radio-input"
                                  />
                                  Open Ended
                                </label>
          <label className="setup-radio-item">
                                  <input
                                    type="radio"
                                    name="fundType"
                                    value="Close Ended"
                                    checked={formData.fundType === 'Close Ended'}
                                    onChange={(e) => handleInputChange('fundType', e.target.value)}
                                    disabled={!isFormEditable}
              className="setup-radio-input"
                                  />
                                  Close Ended
                                </label>
                              </div>
                            </div>
                                                           <div>
        <label className="setup-input-label">IPO Starting Date</label>
                                 <DatePicker
                                   selected={formData.ipoStartDate}
          onChange={(date) => handleDateChange?.('ipoStartDate', date)}
                                   dateFormat="dd/MM/yyyy"
                                   placeholderText="dd/mm/yyyy"
                                   className="date-picker-input"
                                 />
                               </div>
                                                           <div>
        <label className="setup-input-label">IPO Ending Date</label>
                                 <DatePicker
                                   selected={formData.ipoEndDate}
          onChange={(date) => handleDateChange?.('ipoEndDate', date)}
                                   dateFormat="dd/MM/yyyy"
                                   placeholderText="dd/mm/yyyy"
                                   className="date-picker-input"
                                 />
                               </div>
                            {formData.fundType === 'Close Ended' ? (
                              <>
                                <div>
            <label className="setup-input-label">Maturity Date</label>
                                  <DatePicker
                                    selected={formData.maturityDate}
              onChange={(date) => handleDateChange?.('maturityDate', date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/mm/yyyy"
                                    className="date-picker-input"
                                  />
                                </div>
                                <div>
            <label className="setup-input-label">Certificate Type</label>
                                  <input
                                    type="text"
                                    value={formData.certificateType}
                                    onChange={(e) => handleInputChange('certificateType', e.target.value)}
              className="setup-input-field"
                                    placeholder="Enter Certificate Type"
                                  />
                                </div>
                                <div>
            <label className="setup-input-label">Portfolio Code</label>
                                  <input
                                    type="text"
                                    value={formData.portfolioCode}
                                    onChange={(e) => handleInputChange('portfolioCode', e.target.value)}
              className="setup-input-field"
                                    placeholder="Enter PF Code"
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
            <label className="setup-input-label">Certificate Type</label>
                                  <input
                                    type="text"
                                    value={formData.certificateType}
                                    onChange={(e) => handleInputChange('certificateType', e.target.value)}
              className="setup-input-field"
                                    placeholder="Enter Certificate Type"
                                  />
                                </div>
                                <div>
            <label className="setup-input-label">Portfolio Code</label>
                                  <input
                                    type="text"
                                    value={formData.portfolioCode}
                                    onChange={(e) => handleInputChange('portfolioCode', e.target.value)}
              className="setup-input-field"
                                    placeholder="Enter PF Code"
                                  />
                                </div>
                              </>
                            )}
                          </>
  );
}

// ========================================
// PROMOTIONAL ACTIVITY MODAL COMPONENT
// ========================================
function PromotionalActivityModalContent({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string) => void, isFormEditable: boolean }) {
  return (
                          <>
                            <div className="setup-input-group">
        <label className="setup-input-label">Promotion Code</label>
                              <input
                                type="text"
          value={formData.promotionCode}
          onChange={(e) => handleInputChange('promotionCode', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter promotion code"
                              />
          </div>
                            <div className="setup-input-group">
        <label className="setup-input-label">Promotion Name</label>
                              <input
                                type="text"
          value={formData.promotionName}
          onChange={(e) => handleInputChange('promotionName', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter promotion name"
                              />
                            </div>
                            <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.promotionDescription}
          onChange={(e) => handleInputChange('promotionDescription', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter description"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
                        </div>
    </>
  );
}

// ========================================
// OTHER CHARGES MODAL CONTENT
// ========================================
function OtherChargesModalContent({ formData, handleInputChange, handleDateChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[] | boolean) => void, handleDateChange: (field: string, date: Date | null) => void, isFormEditable: boolean }) {
  return (
    <>
      {/* Code */}
      <div className="setup-input-group">
        <label className="setup-input-label">Code</label>
        <input
          type="text"
          value={formData.otherChargesCode || ''}
          onChange={e => handleInputChange('otherChargesCode', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter code"
        />
      </div>
      
      {/* Active Checkbox */}
      <div className="setup-input-group">
        <label className="setup-checkbox-label">
          <input
            type="checkbox"
            checked={formData.otherChargesActive || false}
            onChange={e => handleInputChange('otherChargesActive', e.target.checked)}
            disabled={!isFormEditable}
            className="setup-checkbox-input"
          />
          <span className="setup-checkbox-text">Active</span>
        </label>
      </div>
      
      {/* Name */}
      <div className="setup-input-group">
        <label className="setup-input-label">Name</label>
        <input
          type="text"
          value={formData.otherChargesName || ''}
          onChange={e => handleInputChange('otherChargesName', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter name"
        />
      </div>
      
      {/* Valid From Date */}
      <div className="setup-input-group">
        <label className="setup-input-label">Valid From</label>
        <input
          type="date"
          value={formData.otherChargesValidFrom ? formData.otherChargesValidFrom.toISOString().split('T')[0] : ''}
          onChange={e => handleDateChange('otherChargesValidFrom', e.target.value ? new Date(e.target.value) : null)}
          disabled={!isFormEditable}
          className="setup-input-field"
        />
      </div>
      
      {/* Valid To Date */}
      <div className="setup-input-group">
        <label className="setup-input-label">Valid To</label>
        <input
          type="date"
          value={formData.otherChargesValidFrom ? formData.otherChargesValidTo?.toISOString().split('T')[0] : ''}
          onChange={e => handleDateChange('otherChargesValidTo', e.target.value ? new Date(e.target.value) : null)}
          disabled={!isFormEditable}
          className="setup-input-field"
        />
      </div>
      
      {/* Type Radio Buttons */}
      <div className="setup-input-group">
        <label className="setup-input-label">Type</label>
        <div className="setup-radio-group">
          <label className="setup-radio-label">
            <input
              type="radio"
              name="otherChargesType"
              value="percentage"
              checked={formData.otherChargesType === 'percentage'}
              onChange={e => handleInputChange('otherChargesType', e.target.value)}
              disabled={!isFormEditable}
              className="setup-radio-input"
            />
            <span className="setup-radio-text">Percentage</span>
          </label>
          <label className="setup-radio-label">
            <input
              type="radio"
              name="otherChargesType"
              value="value"
              checked={formData.otherChargesType === 'value'}
              onChange={e => handleInputChange('otherChargesType', e.target.value)}
              disabled={!isFormEditable}
              className="setup-radio-input"
            />
            <span className="setup-radio-text">Value</span>
          </label>
        </div>
      </div>
      
      {/* Percentage Input */}
      {formData.otherChargesType === 'percentage' && (
        <div className="setup-input-group">
          <label className="setup-input-label">Percentage</label>
          <input
            type="text"
            value={formData.otherChargesPercentage || ''}
            onChange={e => handleInputChange('otherChargesPercentage', e.target.value)}
            disabled={!isFormEditable}
            className="setup-input-field"
            placeholder="Enter percentage (e.g., 2.5)"
          />
        </div>
      )}
      
      {/* Value Input */}
      {formData.otherChargesType === 'value' && (
        <div className="setup-input-group">
          <label className="setup-input-label">Value</label>
          <input
            type="text"
            value={formData.otherChargesValue || ''}
            onChange={e => handleInputChange('otherChargesValue', e.target.value)}
            disabled={!isFormEditable}
            className="setup-input-field"
            placeholder="Enter value (e.g., 50.00)"
          />
        </div>
      )}
    </>
  );
}

// ========================================
// AGENCY MODAL COMPONENT
// ========================================
function AgencyModalContent({ formData, handleInputChange, isFormEditable = false }: { formData: FormData, handleInputChange: (field: string, value: string) => void, isFormEditable: boolean }) {
  return (
    <>
      <div>
        <label className="setup-input-label">Agency Code</label>
        <input
          type="text"
          value={formData.agencyCode || ''}
          onChange={(e) => handleInputChange('agencyCode', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter agency code"
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.agencyDescription || ''}
          onChange={(e) => handleInputChange('agencyDescription', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter description"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>
      <div>
        <label className="setup-input-label">Agency Type</label>
        <select
          value={formData.agencyType || ''}
          onChange={(e) => handleInputChange('agencyType', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
        >
          <option value="">Select agency type</option>
          <option value="Primary Agent">Primary Agent</option>
          <option value="Sub Agent">Sub Agent</option>
          <option value="Broker">Broker</option>
          <option value="Distributor">Distributor</option>
        </select>
      </div>
      <div>
        <label className="setup-input-label">Calculate Commission</label>
        <select
          value={formData.calculateCommission || ''}
          onChange={(e) => handleInputChange('calculateCommission', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
        >
          <option value="">Select commission type</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Percentage">Percentage</option>
          <option value="Fixed Amount">Fixed Amount</option>
        </select>
      </div>
    </>
  );
}

// ========================================
// AGENT MODAL COMPONENT
// ========================================

function AgentModalContent({ formData, handleInputChange, isFormEditable = false }: { formData: FormData, handleInputChange: (field: string, value: string) => void, isFormEditable: boolean }) {
  return (
    <>
      {/* Agency */}
      <div className="setup-input-group">
        <label className="setup-input-label">Agency</label>
        <select
          value={formData.agency || ''}
          onChange={(e) => handleInputChange('agency', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
          style={{ color: '#000000' }}
        >
          <option value="">Select agency</option>
          <option value="AG001">AG001 - Main Street Agency</option>
          <option value="AG002">AG002 - Central Agency</option>
          <option value="AG003">AG003 - Downtown Agency</option>
        </select>
      </div>

      {/* Sub Agency */}
      <div className="setup-input-group">
        <label className="setup-input-label">Sub Agency</label>
        <select
          value={formData.subAgency || ''}
          onChange={(e) => handleInputChange('subAgency', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
          style={{ color: '#000000' }}
        >
          <option value="">Select sub agency</option>
          <option value="SA001">SA001 - Downtown Branch</option>
          <option value="SA002">SA002 - Uptown Branch</option>
          <option value="SA003">SA003 - Central Branch</option>
        </select>
      </div>

      {/* Agent Code */}
      <div className="setup-input-group">
        <label className="setup-input-label">Agent Code</label>
        <input
          type="text"
          value={formData.agentCode || ''}
          onChange={(e) => handleInputChange('agentCode', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter agent code"
        />
      </div>

      {/* Registration Number */}
      <div className="setup-input-group">
        <label className="setup-input-label">Registration Number</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
          <input
            type="text"
            value={formData.registrationNumber || ''}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            disabled={!isFormEditable}
            className="setup-input-field"
            placeholder="Enter registration number"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            disabled={!isFormEditable}
            className="setup-button"
            style={{ 
              padding: '8px 12px', 
              height: '40px', 
              minWidth: '40px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isFormEditable ? 'pointer' : 'not-allowed',
              opacity: isFormEditable ? 1 : 0.5
            }}
            onClick={() => {
              console.log('Open top-up modal');
            }}
          >
            P
          </button>
        </div>
      </div>

      {/* Add reg No as Agent Code button */}
      <div className="setup-input-group">
        <button
          type="button"
          disabled={!isFormEditable}
          className="setup-button"
          style={{ 
            width: '100%',
            padding: '10px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isFormEditable ? 'pointer' : 'not-allowed',
            opacity: isFormEditable ? 1 : 0.5
          }}
          onClick={() => {
            if (formData.registrationNumber) {
              handleInputChange('agentCode', formData.registrationNumber);
            }
          }}
        >
          Add reg No as Agent Code
        </button>
      </div>

      {/* Calculate Commission */}
      <div className="setup-input-group">
        <label className="setup-input-label">Calculate Commission</label>
        <select
          value={formData.calculateCommission || ''}
          onChange={(e) => handleInputChange('calculateCommission', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
          style={{ color: '#000000' }}
        >
          <option value="">Select commission type</option>
          <option value="Percentage">Percentage</option>
          <option value="Fixed Amount">Fixed Amount</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Description */}
      <div className="setup-input-group">
        <label className="setup-input-label">Description (Name)</label>
        <input
          type="text"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter agent name"
        />
      </div>

      {/* City */}
      <div className="setup-input-group">
        <label className="setup-input-label">City</label>
        <select
          value={formData.city || ''}
          onChange={(e) => handleInputChange('city', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
          style={{ color: '#000000' }}
        >
          <option value="">Select city</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
          <option value="Jaffna">Jaffna</option>
        </select>
      </div>

      {/* District */}
      <div className="setup-input-group">
        <label className="setup-input-label">District</label>
        <select
          value={formData.district || ''}
          onChange={(e) => handleInputChange('district', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
          style={{ color: '#000000' }}
        >
          <option value="">Select district</option>
          <option value="Western">Western</option>
          <option value="Central">Central</option>
          <option value="Southern">Southern</option>
          <option value="Northern">Northern</option>
        </select>
      </div>

      {/* Residence */}
      <div className="setup-input-group">
        <label className="setup-input-label">Residence</label>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="radio"
              name="residence"
              value="Residence"
              checked={formData.residence === 'Residence'}
              onChange={(e) => handleInputChange('residence', e.target.value)}
              disabled={!isFormEditable}
              style={{ margin: 0, accentColor: '#8b5cf6' }}
            />
            <span style={{ color: '#000000' }}>Residence</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="radio"
              name="residence"
              value="Non-Residence"
              checked={formData.residence === 'Non-Residence'}
              onChange={(e) => handleInputChange('residence', e.target.value)}
              disabled={!isFormEditable}
              style={{ margin: 0, accentColor: '#8b5cf6' }}
            />
            <span style={{ color: '#000000' }}>Non-Residence</span>
          </label>
        </div>
      </div>

      {/* Joined Date */}
      <div className="setup-input-group">
        <label className="setup-input-label">Joined Date</label>
        <input
          type="date"
          value={formData.joinedDate || ''}
          onChange={(e) => handleInputChange('joinedDate', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
        />
      </div>

      {/* Territory */}
      <div className="setup-input-group">
        <label className="setup-input-label">Territory</label>
        <select
          value={formData.territory || ''}
          onChange={(e) => handleInputChange('territory', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
          style={{ color: '#000000' }}
        >
          <option value="">Select territory</option>
          <option value="Western Province">Western Province</option>
          <option value="Central Province">Central Province</option>
          <option value="Southern Province">Southern Province</option>
          <option value="Northern Province">Northern Province</option>
        </select>
      </div>
    </>
  );
}

// ========================================
// SUB AGENCY MODAL COMPONENT
// ========================================
function SubAgencyModalContent({ formData, handleInputChange, isFormEditable = false }: { formData: FormData, handleInputChange: (field: string, value: string) => void, isFormEditable: boolean }) {
  return (
    <>
      <div className="setup-input-group">
        <label className="setup-input-label">Agency</label>
        <select
          value={formData.agency || ''}
          onChange={(e) => handleInputChange('agency', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
        >
          <option value="">Select agency</option>
          <option value="AG001">AG001 - Main Street Agency</option>
          <option value="AG002">AG002 - Central Agency</option>
          <option value="AG003">AG003 - Downtown Agency</option>
          <option value="AG004">AG004 - Uptown Agency</option>
        </select>
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Sub Agency Code</label>
        <input
          type="text"
          value={formData.subAgencyCode || ''}
          onChange={(e) => handleInputChange('subAgencyCode', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter sub agency code"
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.subAgencyDescription || ''}
          onChange={(e) => handleInputChange('subAgencyDescription', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter description"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>
    </>
  );
}

// ========================================
// AGENCY TYPE MODAL COMPONENT
// ========================================
function AgencyTypeModalContent({ formData, handleInputChange, isFormEditable = false }: { formData: FormData, handleInputChange: (field: string, value: string) => void, isFormEditable: boolean }) {
  return (
    <>
      <div className="setup-input-group">
        <label className="setup-input-label">Agency Type Code</label>
        <input
          type="text"
          value={formData.agencyTypeCode || ''}
          onChange={(e) => handleInputChange('agencyTypeCode', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter agency type code"
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.agencyTypeDescription || ''}
          onChange={(e) => handleInputChange('agencyTypeDescription', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter description"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>
    </>
  );
}

// ========================================
// DOCUMENTS SETUP MODAL COMPONENT
// ========================================
function DocumentsSetupModalContent({ formData, handleInputChange, isFormEditable = false }: { formData: FormData, handleInputChange: (field: string, value: string | string[] | boolean) => void, isFormEditable: boolean }) {
  return (
    <>
      {/* Wrapper to force full card width */}
      <div style={{ width: '100%', gridColumn: '1 / -1' }}>
      {/* Row 1: Title + centered two-column radios (50% each) */}
      <div style={{ width: '100%' }}>
        <div className="setup-input-group" style={{ marginBottom: '8px' }}>
          <label className="setup-input-label" style={{ fontWeight: 600 }}>Select Document Type</label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <label className="setup-radio-label">
              <input
                type="radio"
                name="documentType"
                value="remote"
                checked={formData.documentType === 'remote'}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                disabled={!isFormEditable}
                className="setup-radio-input"
              />
              Remote Documents
            </label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <label className="setup-radio-label">
              <input
                type="radio"
                name="documentType"
                value="checklist"
                checked={formData.documentType === 'checklist'}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                disabled={!isFormEditable}
                className="setup-radio-input"
              />
              Checklist Documents
            </label>
            {formData.documentType === 'checklist' && (
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', width: '100%' }}>
                <label className="setup-radio-label">
                  <input
                    type="radio"
                    name="documentHolderType"
                    value="individual"
                    checked={formData.documentHolderType === 'individual'}
                    onChange={(e) => handleInputChange('documentHolderType', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-radio-input"
                  />
                  Individual
                </label>
                <label className="setup-radio-label">
                  <input
                    type="radio"
                    name="documentHolderType"
                    value="cooperate"
                    checked={formData.documentHolderType === 'cooperate'}
                    onChange={(e) => handleInputChange('documentHolderType', e.target.value)}
                    disabled={!isFormEditable}
                    className="setup-radio-input"
                  />
                  Cooperate
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Code + input | Active | Name + input (single row, 3 columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '32px', alignItems: 'center', width: '100%', marginTop: '16px' }}>
        {/* Column 1: Code label + input inline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px', alignItems: 'center' }}>
          <label className="setup-input-label" style={{ marginBottom: 0 }}>Code</label>
          <input
            type="text"
            value={formData.documentCode || ''}
            onChange={(e) => handleInputChange('documentCode', e.target.value)}
            disabled={!isFormEditable}
            className="setup-input-field"
            style={{ width: '100%', maxWidth: '600px' }}
            placeholder="Enter code"
          />
        </div>

        {/* Column 2: Active checkbox centered */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="setup-checkbox-container" style={{ marginBottom: 0 }}>
            <input
              type="checkbox"
              id="documentActive"
              checked={formData.documentActive || false}
              onChange={(e) => handleInputChange('documentActive', e.target.checked)}
              disabled={!isFormEditable}
              className="setup-checkbox-input"
            />
            <label htmlFor="documentActive" className="setup-checkbox-label">Active</label>
          </div>
        </div>

        {/* Column 3: Name label + input inline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px', alignItems: 'center' }}>
          <label className="setup-input-label" style={{ marginBottom: 0 }}>Name</label>
          <input
            type="text"
            value={formData.documentName || ''}
            onChange={(e) => handleInputChange('documentName', e.target.value)}
            disabled={!isFormEditable}
            className="setup-input-field"
            style={{ width: '100%', maxWidth: '600px' }}
            placeholder="Enter name"
          />
        </div>
      </div>
      </div>
    </>
  );
}

// ========================================
// UNIT FEE CODES SECTION
// ========================================
function UnitFeeCodesSection({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[]) => void, isFormEditable: boolean }) {
  // Example data for table
  const funds = [
    { code: 'FUND001', name: 'Equity Growth Fund' },
    { code: 'FUND002', name: 'Balanced Income Fund' },
    { code: 'FUND003', name: 'Income Plus Fund' },
    { code: 'FUND004', name: 'Global Opportunities' },
  ];
  // Simulate backend loading for checkboxes
  const selectedFunds = formData.unitFeeApplicableFunds || [];
  const handleFundCheckbox = (code: string, checked: boolean) => {
    let updated: string[] = selectedFunds ? [...selectedFunds] : [];
    if (checked) {
      if (!updated.includes(code)) updated.push(code);
    } else {
      updated = updated.filter((c: string) => c !== code);
    }
    handleInputChange('unitFeeApplicableFunds', updated);
  };
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '48px', 
      width: '100%', 
      maxWidth: 'none',
      minWidth: '100%',
      boxSizing: 'border-box',
      padding: '0',
      gridColumn: '1 / -1', // Span all columns of parent grid
      marginTop: '32px'
    }}>
      {/* Left Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        {/* Txn. Type Box */}
        <div className="setup-ash-box" style={{ marginBottom: '8px' }}>
          <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Txn. Type</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <label className="setup-radio-label">
                              <input
                type="radio"
                name="unitFeeTxnType"
                value="creation"
                checked={formData.unitFeeTxnType === 'creation'}
                onChange={e => handleInputChange('unitFeeTxnType', e.target.value)}
                                disabled={!isFormEditable}
                className="setup-radio-input"
              />
              Creation
                              </label>
            <label className="setup-radio-label">
              <input
                type="radio"
                name="unitFeeTxnType"
                value="redemption"
                checked={formData.unitFeeTxnType === 'redemption'}
                onChange={e => handleInputChange('unitFeeTxnType', e.target.value)}
                                disabled={!isFormEditable}
                className="setup-radio-input"
              />
              Redemption
                              </label>
          </div>
        </div>
        {/* Code */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
          <label className="setup-input-label" style={{ marginBottom: 0 }}>Code</label>
                              <input
                                type="text"
            value={formData.unitFeeCode || ''}
            onChange={e => handleInputChange('unitFeeCode', e.target.value)}
            disabled={!isFormEditable}
            className="setup-input-field"
            placeholder="Enter code"
                              />
                            </div>
        {/* Percentage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
          <label className="setup-input-label" style={{ marginBottom: 0 }}>Percentage</label>
                              <input
                                type="text"
            value={formData.unitFeePercentage || ''}
            onChange={e => handleInputChange('unitFeePercentage', e.target.value)}
                                disabled={!isFormEditable}
            className="setup-input-field"
            placeholder="Enter percentage"
                              />
                            </div>
        {/* Description */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
          <label className="setup-input-label" style={{ marginBottom: 0 }}>Description</label>
          <input
            type="text"
            value={formData.unitFeeDescription || ''}
            onChange={e => handleInputChange('unitFeeDescription', e.target.value)}
                        disabled={!isFormEditable}
            className="setup-input-field"
            placeholder="Enter description"
                        />
                      </div>
        {/* Price One (%) and Price Two (%) in one row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
            <label className="setup-input-label" style={{ marginBottom: 0 }}>Price One (%)</label>
                          <input
                            type="text"
              value={formData.unitFeePriceOne || ''}
              onChange={e => handleInputChange('unitFeePriceOne', e.target.value)}
              disabled={!isFormEditable}
                            className="setup-input-field"
              placeholder="Price One (%)"
                          />
                        </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
            <label className="setup-input-label" style={{ marginBottom: 0 }}>Price Two (%)</label>
                          <input
                            type="text"
              value={formData.unitFeePriceTwo || ''}
              onChange={e => handleInputChange('unitFeePriceTwo', e.target.value)}
              disabled={!isFormEditable}
                            className="setup-input-field"
              placeholder="Price Two (%)"
                          />
                        </div>
                        </div>
        {/* Unit Fee */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' }}>
          <label className="setup-input-label" style={{ marginBottom: 0 }}>Unit Fee</label>
                            <input
            type="text"
            value={formData.unitFee || ''}
            onChange={e => handleInputChange('unitFee', e.target.value)}
            disabled={!isFormEditable}
            className="setup-input-field"
            placeholder="Enter unit fee"
          />
                          </div>
                        </div>
      {/* Right Column: Card with scrollable table */}
      <div style={{ background: '#f8fafc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px', color: '#000000' }}>Applicable Funds</div>
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '320px' }}>
          <table className="setup-custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', color: '#000000', fontWeight: 600 }}>Code</th>
                <th style={{ textAlign: 'left', padding: '8px', color: '#000000', fontWeight: 600 }}>Fund Name</th>
              </tr>
            </thead>
            <tbody>
              {funds.map(fund => (
                <tr key={fund.code}>
                  <td style={{ padding: '8px', color: '#000000' }}>
                    <input
                      type="checkbox"
                      checked={selectedFunds && selectedFunds.includes(fund.code)}
                      onChange={e => handleFundCheckbox(fund.code, e.target.checked)}
                      className="setup-checkbox-input"
                    />
                    <span style={{ marginLeft: '8px' }}>{fund.code}</span>
                  </td>
                  <td style={{ padding: '8px', color: '#000000' }}>{fund.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
                      </div>
                    </div>
                  </div>
  );
}

// ========================================
// COMMISSION TYPE MODAL CONTENT
// ========================================
function CommissionTypeModalContent({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[]) => void, isFormEditable: boolean }) {
  return (
    <>
      {/* Commission Type */}
      <div className="setup-input-group">
        <label className="setup-input-label">Commission Type</label>
        <input
          type="text"
          value={formData.commissionType || ''}
          onChange={e => handleInputChange('commissionType', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter commission type"
        />
      </div>
      
      {/* Description */}
      <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.commissionDescription || ''}
          onChange={e => handleInputChange('commissionDescription', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter description"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>
    </>
  );
}

// ========================================
// COMMISSION LEVEL MODAL CONTENT
// ========================================
function CommissionLevelModalContent({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[]) => void, isFormEditable: boolean }) {
  return (
    <>
      {/* Commission Level */}
      <div className="setup-input-group">
        <label className="setup-input-label">Commission Level</label>
        <input
          type="text"
          value={formData.commissionLevelCode || ''}
          onChange={e => handleInputChange('commissionLevelCode', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter commission level"
        />
      </div>
      
      {/* Description */}
      <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.commissionLevelDescription || ''}
          onChange={e => handleInputChange('commissionLevelDescription', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter description"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>
    </>
  );
}

// ========================================
// AGENT COMMISSION DEFINITION MODAL CONTENT
// ========================================
function AgentCommissionDefinitionModalContent({ formData, handleInputChange, handleDateChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[] | boolean) => void, handleDateChange: (field: string, date: Date | null) => void, isFormEditable: boolean }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '48px', 
      width: '100%', 
      maxWidth: 'none',
      minWidth: '100%',
      boxSizing: 'border-box',
      padding: '0',
      gridColumn: '1 / -1' // Span all columns of parent grid
    }}>
      {/* Left Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        {/* Commission Category Group */}
        <div className="setup-ash-box">
          <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px' }}>Commission Category</div>
          <div className="setup-radio-group">
            <label className="setup-radio-label">
              <input
                type="radio"
                name="agentCommissionCategory"
                value="investment"
                checked={formData.agentCommissionCategory === 'investment'}
                onChange={e => handleInputChange('agentCommissionCategory', e.target.value)}
                disabled={!isFormEditable}
                className="setup-radio-input"
              />
              <span className="setup-radio-text">Investment Wise Commission</span>
            </label>
            <label className="setup-radio-label">
              <input
                type="radio"
                name="agentCommissionCategory"
                value="trailer"
                checked={formData.agentCommissionCategory === 'trailer'}
                onChange={e => handleInputChange('agentCommissionCategory', e.target.value)}
                disabled={!isFormEditable}
                className="setup-radio-input"
              />
              <span className="setup-radio-text">Trailer Fee</span>
            </label>
          </div>
        </div>

        {/* Commission Type, Level, Fund Group */}
        <div className="setup-ash-box">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Commission Type */}
            <div className="setup-input-group">
              <label className="setup-input-label">Commission Type</label>
              <select
                value={formData.agentCommissionType || ''}
                onChange={e => handleInputChange('agentCommissionType', e.target.value)}
                disabled={!isFormEditable}
                className="setup-dropdown-select"
                style={{ color: '#000000' }}
              >
                <option value="">Select Commission Type</option>
                <option value="Flat Rate">Flat Rate</option>
                <option value="Percentage">Percentage</option>
                <option value="Tiered">Tiered</option>
              </select>
            </div>

            {/* Commission Level */}
            <div className="setup-input-group">
              <label className="setup-input-label">Commission Level</label>
              <select
                value={formData.agentCommissionLevel || ''}
                onChange={e => handleInputChange('agentCommissionLevel', e.target.value)}
                disabled={!isFormEditable}
                className="setup-dropdown-select"
                style={{ color: '#000000' }}
              >
                <option value="">Select Commission Level</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Intermediate Level">Intermediate Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive Level">Executive Level</option>
              </select>
            </div>

            {/* Fund */}
            <div className="setup-input-group">
              <label className="setup-input-label">Fund</label>
              <select
                value={formData.agentCommissionFund || ''}
                onChange={e => handleInputChange('agentCommissionFund', e.target.value)}
                disabled={!isFormEditable}
                className="setup-dropdown-select"
                style={{ color: '#000000' }}
              >
                <option value="">Select Fund</option>
                <option value="Growth Fund">Growth Fund</option>
                <option value="Income Fund">Income Fund</option>
                <option value="Balanced Fund">Balanced Fund</option>
                <option value="Money Market Fund">Money Market Fund</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        {/* Agent Type Group */}
        <div className="setup-ash-box">
          <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px' }}>Agent Type</div>
          <div className="setup-radio-group">
            <label className="setup-radio-label">
              <input
                type="radio"
                name="agentCommissionAgentType"
                value="agency"
                checked={formData.agentCommissionAgentType === 'agency'}
                onChange={e => handleInputChange('agentCommissionAgentType', e.target.value)}
                disabled={!isFormEditable}
                className="setup-radio-input"
              />
              <span className="setup-radio-text">Agency Wise</span>
            </label>
            <label className="setup-radio-label">
              <input
                type="radio"
                name="agentCommissionAgentType"
                value="subAgency"
                checked={formData.agentCommissionAgentType === 'subAgency'}
                onChange={e => handleInputChange('agentCommissionAgentType', e.target.value)}
                disabled={!isFormEditable}
                className="setup-radio-input"
              />
              <span className="setup-radio-text">Sub Agency Wise</span>
            </label>
            <label className="setup-radio-label">
              <input
                type="radio"
                name="agentCommissionAgentType"
                value="agent"
                checked={formData.agentCommissionAgentType === 'agent'}
                onChange={e => handleInputChange('agentCommissionAgentType', e.target.value)}
                disabled={!isFormEditable}
                className="setup-radio-input"
              />
              <span className="setup-radio-text">Agent Wise</span>
            </label>
          </div>
        </div>

        {/* Period and Amount Group */}
        <div className="setup-ash-box">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Period From/To */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="setup-input-group">
                <label className="setup-input-label" style={{ color: '#000000' }}>Period From</label>
                <input
                  type="date"
                  value={formData.agentCommissionPeriodFrom ? formData.agentCommissionPeriodFrom.toISOString().split('T')[0] : ''}
                  onChange={e => handleDateChange('agentCommissionPeriodFrom', e.target.value ? new Date(e.target.value) : null)}
                  disabled={!isFormEditable}
                  className="setup-input-field"
                  style={{ color: '#000000', cursor: 'pointer' }}
                  onClick={(e) => {
                    if (!isFormEditable) return;
                    e.currentTarget.showPicker?.();
                  }}
                />
              </div>
              <div className="setup-input-group">
                <label className="setup-input-label" style={{ color: '#000000' }}>Period To</label>
                <input
                  type="date"
                  value={formData.agentCommissionPeriodTo ? formData.agentCommissionPeriodTo.toISOString().split('T')[0] : ''}
                  onChange={e => handleDateChange('agentCommissionPeriodTo', e.target.value ? new Date(e.target.value) : null)}
                  disabled={!isFormEditable}
                  className="setup-input-field"
                  style={{ color: '#000000', cursor: 'pointer' }}
                  onClick={(e) => {
                    if (!isFormEditable) return;
                    e.currentTarget.showPicker?.();
                  }}
                />
              </div>
            </div>

            {/* Amount From/To */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="setup-input-group">
                <label className="setup-input-label" style={{ color: '#000000' }}>Amount From</label>
                <input
                  type="text"
                  value={formData.agentCommissionAmountFrom || ''}
                  onChange={e => handleInputChange('agentCommissionAmountFrom', e.target.value)}
                  disabled={!isFormEditable}
                  className="setup-input-field"
                  placeholder="Enter amount from"
                  style={{ color: '#000000' }}
                />
              </div>
              <div className="setup-input-group">
                <label className="setup-input-label" style={{ color: '#000000' }}>Amount To</label>
                <input
                  type="text"
                  value={formData.agentCommissionAmountTo || ''}
                  onChange={e => handleInputChange('agentCommissionAmountTo', e.target.value)}
                  disabled={!isFormEditable}
                  className="setup-input-field"
                  placeholder="Enter amount to"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>

            {/* Commission Rate */}
            <div className="setup-input-group">
              <label className="setup-input-label" style={{ color: '#000000' }}>Commission Rate</label>
              <input
                type="text"
                value={formData.agentCommissionRate || ''}
                onChange={e => handleInputChange('agentCommissionRate', e.target.value)}
                disabled={!isFormEditable}
                className="setup-input-field"
                placeholder="Enter commission rate (e.g., 2.5%)"
                style={{ color: '#000000' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ========================================
// TERRITORY MODAL CONTENT
// ========================================
function TerritoryModalContent({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[]) => void, isFormEditable: boolean }) {
  return (
    <>
      <div className="setup-input-group">
        <label className="setup-input-label">Territory Code</label>
        <input
          type="text"
          value={formData.territoryCode || ''}
          onChange={e => handleInputChange('territoryCode', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter territory code"
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.territoryDescription || ''}
          onChange={e => handleInputChange('territoryDescription', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter description"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>
    </>
  );
}

// ========================================
// INSTITUTION CATEGORY MODAL CONTENT
// ========================================
function InstitutionCategoryModalContent({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[] | boolean) => void, isFormEditable: boolean }) {
  return (
    <>
      {/* Institution Category Input */}
      <div className="setup-input-group">
        <label className="setup-input-label">Institution Category</label>
        <input
          type="text"
          value={formData.institutionCategoryType || ''}
          onChange={e => handleInputChange('institutionCategoryType', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter institution category"
        />
      </div>
      
      {/* Active Checkbox */}
      <div className="setup-input-group">
        <label className="setup-checkbox-label">
          <input
            type="checkbox"
            checked={formData.institutionCategoryActive || false}
            onChange={e => handleInputChange('institutionCategoryActive', e.target.checked)}
            disabled={!isFormEditable}
            className="setup-checkbox-input"
          />
          <span className="setup-checkbox-text">Active</span>
        </label>
      </div>
      
      {/* Description */}
      <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.institutionCategoryDescription || ''}
          onChange={e => handleInputChange('institutionCategoryDescription', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter description"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>
    </>
  );
}

// ========================================
// INSTITUTION MODAL CONTENT
// ========================================
function InstitutionModalContent({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[] | boolean) => void, isFormEditable: boolean }) {
  return (
    <>
      <div className="setup-input-group">
        <label className="setup-input-label">Institution Code</label>
        <input
          type="text"
          value={formData.code || ''}
          onChange={e => handleInputChange('code', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter institution code"
        />
      </div>
      <div className="setup-input-group">
        <div className="setup-checkbox-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="institutionCategoryActive" className="setup-checkbox-label" style={{ marginRight: '8px', order: -1 }}>
            Active
          </label>
          <input
            type="checkbox"
            id="institutionCategoryActive"
            checked={formData.institutionCategoryActive || false}
            onChange={e => handleInputChange('institutionCategoryActive', e.target.checked)}
            disabled={!isFormEditable}
            className="setup-checkbox-input"
          />
        </div>
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Institution Category</label>
        <select
          value={formData.institutionCategoryType || ''}
          onChange={e => handleInputChange('institutionCategoryType', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
          style={{ color: '#000000' }}
        >
          <option value="" style={{ color: '#000000' }}>Select institution category</option>
          <option value="Bank" style={{ color: '#000000' }}>Bank</option>
          <option value="Insurance" style={{ color: '#000000' }}>Insurance</option>
          <option value="Investment" style={{ color: '#000000' }}>Investment</option>
          <option value="Brokerage" style={{ color: '#000000' }}>Brokerage</option>
        </select>
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Institution Name</label>
        <input
          type="text"
          value={formData.institutionCategoryName || ''}
          onChange={e => handleInputChange('institutionCategoryName', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter institution name"
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Address 1</label>
        <input
          type="text"
          value={formData.institutionCategoryAddress1 || ''}
          onChange={e => handleInputChange('institutionCategoryAddress1', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter address 1"
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Address 2</label>
        <input
          type="text"
          value={formData.institutionCategoryAddress2 || ''}
          onChange={e => handleInputChange('institutionCategoryAddress2', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter address 2"
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Address 3</label>
        <input
          type="text"
          value={formData.institutionCategoryAddress3 || ''}
          onChange={e => handleInputChange('institutionCategoryAddress3', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter address 3"
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Contact Person</label>
        <input
          type="text"
          value={formData.institutionCategoryContactPerson || ''}
          onChange={e => handleInputChange('institutionCategoryContactPerson', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter contact person"
        />
      </div>
      <div className="setup-input-group">
        <label className="setup-input-label">Contact No</label>
        <input
          type="text"
          value={formData.institutionCategoryContactNo || ''}
          onChange={e => handleInputChange('institutionCategoryContactNo', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter contact number"
        />
      </div>
    </>
  );
}

// ========================================
// BLOCKING CATEGORY MODAL CONTENT
// ========================================
function BlockingCategoryModalContent({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[] | boolean) => void, isFormEditable: boolean }) {
  return (
    <>
      {/* Blocking Category Input */}
      <div className="setup-input-group">
        <label className="setup-input-label">Blocking Category</label>
        <input
          type="text"
          value={formData.blockingCategoryType || ''}
          onChange={e => handleInputChange('blockingCategoryType', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter blocking category"
        />
      </div>
      
      {/* Active Checkbox */}
      <div className="setup-input-group">
        <label className="setup-checkbox-label">
          <input
            type="checkbox"
            checked={formData.blockingCategoryActive || false}
            onChange={e => handleInputChange('blockingCategoryActive', e.target.checked)}
            disabled={!isFormEditable}
            className="setup-checkbox-input"
          />
          <span className="setup-checkbox-text">Active</span>
        </label>
      </div>
      
      {/* Description */}
      <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.blockingCategoryDescription || ''}
          onChange={e => handleInputChange('blockingCategoryDescription', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter description"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>
    </>
  );
}

// ========================================
// CUSTOMER ZONE MODAL CONTENT
// ========================================
function CustomerZoneModalContent({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[] | boolean) => void, isFormEditable: boolean }) {
  return (
    <>
      {/* Zone Code */}
      <div className="setup-input-group">
        <label className="setup-input-label">Zone Code</label>
        <input
          type="text"
          value={formData.customerZoneCode || ''}
          onChange={e => handleInputChange('customerZoneCode', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter zone code"
        />
      </div>
      
      {/* Active Checkbox */}
      <div className="setup-input-group">
        <label className="setup-checkbox-label">
          <input
            type="checkbox"
            checked={formData.customerZoneActive || false}
            onChange={e => handleInputChange('customerZoneActive', e.target.checked)}
            disabled={!isFormEditable}
            className="setup-checkbox-input"
          />
          <span className="setup-checkbox-text">Active</span>
        </label>
      </div>
      
      {/* Description */}
      <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.customerZoneDescription || ''}
          onChange={e => handleInputChange('customerZoneDescription', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter description"
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>
    </>
  );
}
// ========================================
// JOINT SALE AGENT MODAL CONTENT
// ========================================
function JointSaleAgentModalContent({ 
  formData, 
  handleInputChange, 
  isFormEditable 
}: { 
  formData: FormData, 
  handleInputChange: (field: string, value: string | string[] | boolean) => void, 
  isFormEditable: boolean 
}) {
  // State for dropdown table visibility
  const [showInstituteAgentTable, setShowInstituteAgentTable] = useState(false);
  const [showNormalAgentTable, setShowNormalAgentTable] = useState(false);
  const [showJointAgencyTable, setShowJointAgencyTable] = useState(false);
  const [showJointSubAgencyTable, setShowJointSubAgencyTable] = useState(false);

  // Sample data for Agent Code dropdown table (4 columns: Agency_code, Sub_Agency_code, Agent_Code, Agent_Description)
  const agentCodeData = [
    { agencyCode: 'AG001', subAgencyCode: 'SA001', agentCode: 'AGT001', agentDescription: 'John Smith - Senior Agent' },
    { agencyCode: 'AG001', subAgencyCode: 'SA002', agentCode: 'AGT002', agentDescription: 'Jane Doe - Junior Agent' },
    { agencyCode: 'AG002', subAgencyCode: 'SA001', agentCode: 'AGT003', agentDescription: 'Bob Johnson - Senior Agent' },
    { agencyCode: 'AG002', subAgencyCode: 'SA003', agentCode: 'AGT004', agentDescription: 'Alice Williams - Junior Agent' },
    { agencyCode: 'AG003', subAgencyCode: 'SA002', agentCode: 'AGT005', agentDescription: 'Charlie Brown - Senior Agent' },
  ];

  // Sample data for Joint Agent Agency dropdown table (2 columns: Code, Description)
  const jointAgencyData = [
    { code: 'AG001', description: 'Main Street Agency' },
    { code: 'AG002', description: 'Central Agency' },
    { code: 'AG003', description: 'Downtown Agency' },
    { code: 'AG004', description: 'Uptown Agency' },
  ];

  // Sample data for Joint Agent Sub Agency dropdown table (4 columns: Agency_Code, Code, Description, Agency_description)
  const jointSubAgencyData = [
    { agencyCode: 'AG001', code: 'SA001', description: 'Downtown Branch', agencyDescription: 'Main Street Agency' },
    { agencyCode: 'AG001', code: 'SA002', description: 'Uptown Branch', agencyDescription: 'Main Street Agency' },
    { agencyCode: 'AG002', code: 'SA001', description: 'Central Branch', agencyDescription: 'Central Agency' },
    { agencyCode: 'AG002', code: 'SA003', description: 'North Branch', agencyDescription: 'Central Agency' },
    { agencyCode: 'AG003', code: 'SA002', description: 'South Branch', agencyDescription: 'Downtown Agency' },
  ];

  // Close dropdown tables when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showInstituteAgentTable && !target.closest('[data-table="institute-agent"]')) {
        setShowInstituteAgentTable(false);
      }
      if (showNormalAgentTable && !target.closest('[data-table="normal-agent"]')) {
        setShowNormalAgentTable(false);
      }
      if (showJointAgencyTable && !target.closest('[data-table="joint-agency"]')) {
        setShowJointAgencyTable(false);
      }
      if (showJointSubAgencyTable && !target.closest('[data-table="joint-subagency"]')) {
        setShowJointSubAgencyTable(false);
      }
    };
    
    if (showInstituteAgentTable || showNormalAgentTable || showJointAgencyTable || showJointSubAgencyTable) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInstituteAgentTable, showNormalAgentTable, showJointAgencyTable, showJointSubAgencyTable]);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '48px', 
      width: '100%', 
      maxWidth: 'none',
      minWidth: '100%',
      boxSizing: 'border-box',
      padding: '0',
      gridColumn: '1 / -1'
    }}>
      {/* Left Column - Institute Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        
        {/* Institute Section */}
        <div className="setup-ash-box">
          <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px' }}>Institute</div>
          
          <div className="setup-input-group">
            <label className="setup-input-label">Agency</label>
            <select
              value={formData.agency || ''}
              onChange={e => handleInputChange('agency', e.target.value)}
              disabled={!isFormEditable}
              className="setup-dropdown-select"
              style={{ color: '#000000' }}
            >
              <option value="">Select Agency</option>
              <option value="AG001">AG001 - Main Street Agency</option>
              <option value="AG002">AG002 - Central Agency</option>
              <option value="AG003">AG003 - Downtown Agency</option>
            </select>
          </div>

          <div className="setup-input-group">
            <label className="setup-input-label">Sub Agency</label>
            <select
              value={formData.subAgency || ''}
              onChange={e => handleInputChange('subAgency', e.target.value)}
              disabled={!isFormEditable}
              className="setup-dropdown-select"
              style={{ color: '#000000' }}
            >
              <option value="">Select Sub Agency</option>
              <option value="SA001">SA001 - Downtown Branch</option>
              <option value="SA002">SA002 - Uptown Branch</option>
              <option value="SA003">SA003 - Central Branch</option>
            </select>
          </div>

          <div className="setup-input-group">
            <label className="setup-input-label">Agent Code</label>
            <div style={{ position: 'relative' }} data-table="institute-agent">
              <div
                onClick={() => isFormEditable && setShowInstituteAgentTable(!showInstituteAgentTable)}
                style={{
                  padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff',
                  cursor: isFormEditable ? 'pointer' : 'default', color: formData.agentCode ? '#0f172a' : '#64748b',
                  minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '14px'
                }}
              >
                {formData.agentCode || 'Select agent code'}
              </div>
              {showInstituteAgentTable && isFormEditable && (
                <div data-table="institute-agent" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '300px', overflowY: 'auto', minWidth: '600px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Agency_code</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Sub_Agency_code</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Agent_Code</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#000000' }}>Agent_Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentCodeData.map((agent, i) => (
                        <tr 
                          key={i} 
                          onClick={() => { 
                            handleInputChange('agentCode', agent.agentCode); 
                            setShowInstituteAgentTable(false); 
                          }} 
                          style={{ 
                            cursor: 'pointer', 
                            backgroundColor: formData.agentCode === agent.agentCode ? '#f3e8ff' : '#ffffff' 
                          }} 
                          onMouseEnter={e => { 
                            if (formData.agentCode !== agent.agentCode) e.currentTarget.style.backgroundColor = '#f8fafc'; 
                          }} 
                          onMouseLeave={e => { 
                            if (formData.agentCode !== agent.agentCode) e.currentTarget.style.backgroundColor = '#ffffff'; 
                          }}
                        >
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{agent.agencyCode}</td>
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{agent.subAgencyCode}</td>
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{agent.agentCode}</td>
                          <td style={{ padding: '8px 12px', color: '#000000' }}>{agent.agentDescription}</td>
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

      {/* Right Column - Name Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        
        {/* Name Section */}
        <div className="setup-ash-box">
          <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px' }}>Normal</div>
          
          <div className="setup-input-group">
            <label className="setup-input-label">Agency</label>
            <select
              value={formData.nameAgency || ''}
              onChange={e => handleInputChange('nameAgency', e.target.value)}
              disabled={!isFormEditable}
              className="setup-dropdown-select"
              style={{ color: '#000000' }}
            >
              <option value="">Select Agency</option>
              <option value="AG001">AG001 - Main Street Agency</option>
              <option value="AG002">AG002 - Central Agency</option>
              <option value="AG003">AG003 - Downtown Agency</option>
            </select>
          </div>

          <div className="setup-input-group">
            <label className="setup-input-label">Sub Agency</label>
            <select
              value={formData.nameSubAgency || ''}
              onChange={e => handleInputChange('nameSubAgency', e.target.value)}
              disabled={!isFormEditable}
              className="setup-dropdown-select"
              style={{ color: '#000000' }}
            >
              <option value="">Select Sub Agency</option>
              <option value="SA001">SA001 - Downtown Branch</option>
              <option value="SA002">SA002 - Uptown Branch</option>
              <option value="SA003">SA003 - Central Branch</option>
            </select>
          </div>

          <div className="setup-input-group">
            <label className="setup-input-label">Agent Code</label>
            <div style={{ position: 'relative' }} data-table="normal-agent">
              <div
                onClick={() => isFormEditable && setShowNormalAgentTable(!showNormalAgentTable)}
                style={{
                  padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff',
                  cursor: isFormEditable ? 'pointer' : 'default', color: formData.nameAgentCode ? '#0f172a' : '#64748b',
                  minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '14px'
                }}
              >
                {formData.nameAgentCode || 'Select agent code'}
              </div>
              {showNormalAgentTable && isFormEditable && (
                <div data-table="normal-agent" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '300px', overflowY: 'auto', minWidth: '600px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Agency_code</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Sub_Agency_code</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Agent_Code</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#000000' }}>Agent_Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentCodeData.map((agent, i) => (
                        <tr 
                          key={i} 
                          onClick={() => { 
                            handleInputChange('nameAgentCode', agent.agentCode); 
                            setShowNormalAgentTable(false); 
                          }} 
                          style={{ 
                            cursor: 'pointer', 
                            backgroundColor: formData.nameAgentCode === agent.agentCode ? '#f3e8ff' : '#ffffff' 
                          }} 
                          onMouseEnter={e => { 
                            if (formData.nameAgentCode !== agent.agentCode) e.currentTarget.style.backgroundColor = '#f8fafc'; 
                          }} 
                          onMouseLeave={e => { 
                            if (formData.nameAgentCode !== agent.agentCode) e.currentTarget.style.backgroundColor = '#ffffff'; 
                          }}
                        >
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{agent.agencyCode}</td>
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{agent.subAgencyCode}</td>
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{agent.agentCode}</td>
                          <td style={{ padding: '8px 12px', color: '#000000' }}>{agent.agentDescription}</td>
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

      {/* Centered Joint Agent Card spanning full width */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
        <div className="setup-ash-box" style={{ width: '100%', maxWidth: '720px' }}>
          <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px' }}>Joint Agent</div>

          <div className="setup-input-group">
            <label className="setup-input-label">Agency</label>
            <div style={{ position: 'relative' }} data-table="joint-agency">
              <div
                onClick={() => isFormEditable && setShowJointAgencyTable(!showJointAgencyTable)}
                style={{
                  padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff',
                  cursor: isFormEditable ? 'pointer' : 'default', color: formData.jointAgency ? '#0f172a' : '#64748b',
                  minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '14px'
                }}
              >
                {formData.jointAgency || 'Select agency'}
              </div>
              {showJointAgencyTable && isFormEditable && (
                <div data-table="joint-agency" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', minWidth: '400px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Code</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#000000' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jointAgencyData.map((agency, i) => (
                        <tr 
                          key={i} 
                          onClick={() => { 
                            handleInputChange('jointAgency', agency.code); 
                            setShowJointAgencyTable(false); 
                          }} 
                          style={{ 
                            cursor: 'pointer', 
                            backgroundColor: formData.jointAgency === agency.code ? '#f3e8ff' : '#ffffff' 
                          }} 
                          onMouseEnter={e => { 
                            if (formData.jointAgency !== agency.code) e.currentTarget.style.backgroundColor = '#f8fafc'; 
                          }} 
                          onMouseLeave={e => { 
                            if (formData.jointAgency !== agency.code) e.currentTarget.style.backgroundColor = '#ffffff'; 
                          }}
                        >
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{agency.code}</td>
                          <td style={{ padding: '8px 12px', color: '#000000' }}>{agency.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="setup-input-group">
            <label className="setup-input-label">Sub Agency</label>
            <div style={{ position: 'relative' }} data-table="joint-subagency">
              <div
                onClick={() => isFormEditable && setShowJointSubAgencyTable(!showJointSubAgencyTable)}
                style={{
                  padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff',
                  cursor: isFormEditable ? 'pointer' : 'default', color: formData.jointSubAgency ? '#0f172a' : '#64748b',
                  minHeight: '38px', display: 'flex', alignItems: 'center', fontSize: '14px'
                }}
              >
                {formData.jointSubAgency || 'Select sub agency'}
              </div>
              {showJointSubAgencyTable && isFormEditable && (
                <div data-table="joint-subagency" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000, maxHeight: '300px', overflowY: 'auto', minWidth: '600px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Agency_Code</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Code</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Description</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#000000' }}>Agency_description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jointSubAgencyData.map((subAgency, i) => (
                        <tr 
                          key={i} 
                          onClick={() => { 
                            handleInputChange('jointSubAgency', subAgency.code); 
                            setShowJointSubAgencyTable(false); 
                          }} 
                          style={{ 
                            cursor: 'pointer', 
                            backgroundColor: formData.jointSubAgency === subAgency.code ? '#f3e8ff' : '#ffffff' 
                          }} 
                          onMouseEnter={e => { 
                            if (formData.jointSubAgency !== subAgency.code) e.currentTarget.style.backgroundColor = '#f8fafc'; 
                          }} 
                          onMouseLeave={e => { 
                            if (formData.jointSubAgency !== subAgency.code) e.currentTarget.style.backgroundColor = '#ffffff'; 
                          }}
                        >
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{subAgency.agencyCode}</td>
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{subAgency.code}</td>
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{subAgency.description}</td>
                          <td style={{ padding: '8px 12px', color: '#000000' }}>{subAgency.agencyDescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="setup-input-group">
            <label className="setup-input-label">Agent Code</label>
            <input
              type="text"
              value={formData.jointAgentCode || ''}
              onChange={e => handleInputChange('jointAgentCode', e.target.value)}
              disabled={!isFormEditable}
              className="setup-input-field"
              placeholder="Enter joint agent code"
            />
          </div>

          <div className="setup-input-group">
            <label className="setup-input-label">Description</label>
            <input
              type="text"
              value={formData.jointAgentDescription || ''}
              onChange={e => handleInputChange('jointAgentDescription', e.target.value)}
              disabled={!isFormEditable}
              className="setup-input-field"
              placeholder="Enter description"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
// ========================================
// COMPLIANCE MSG SETUP MODAL CONTENT
// ========================================
function ComplianceMsgSetupModalContent({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[]) => void, isFormEditable: boolean }) {
  return (
    <>
      {/* Position Dropdown */}
      <div className="setup-input-group">
        <label className="setup-input-label">Position</label>
        <select
          value={formData.compliancePosition || ''}
          onChange={e => handleInputChange('compliancePosition', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          style={{ color: '#000000' }}
        >
          <option value="">Select Position</option>
          <option value="Manager">Manager</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Officer">Officer</option>
          <option value="Analyst">Analyst</option>
          <option value="Coordinator">Coordinator</option>
          <option value="Specialist">Specialist</option>
        </select>
      </div>
      
      {/* User Dropdown */}
      <div className="setup-input-group">
        <label className="setup-input-label">User</label>
        <select
          value={formData.complianceUser || ''}
          onChange={e => handleInputChange('complianceUser', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          style={{ color: '#000000' }}
        >
          <option value="">Select User</option>
          <option value="John Smith">John Smith</option>
          <option value="Sarah Johnson">Sarah Johnson</option>
          <option value="Michael Brown">Michael Brown</option>
          <option value="Emily Davis">Emily Davis</option>
          <option value="David Wilson">David Wilson</option>
          <option value="Lisa Anderson">Lisa Anderson</option>
          <option value="Robert Taylor">Robert Taylor</option>
          <option value="Jennifer Martinez">Jennifer Martinez</option>
        </select>
      </div>
    </>
  );
}
// ========================================
// PRODUCT TYPE MODAL CONTENT
// ========================================
function ProductTypeModalContent({ 
  formData, 
  handleInputChange, 
  isFormEditable 
}: { 
  formData: FormData, 
  handleInputChange: (field: string, value: string | string[] | boolean) => void, 
  isFormEditable: boolean 
}) {
  // Product Type - Applicable Funds data
  const applicableFunds = [
    { code: 'F001', name: 'Growth Fund' },
    { code: 'F002', name: 'Income Fund' },
    { code: 'F003', name: 'Balanced Fund' }
  ];
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '48px', 
      width: '100%', 
      maxWidth: 'none',
      minWidth: '100%',
      boxSizing: 'border-box',
      padding: '0',
      gridColumn: '1 / -1'
    }}>
      
      {/* Left Column - Application Funds and Product Type Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        {/* Product Type Form Section */}
        <div className="setup-ash-box">
          
          {/* Product Type Input - Product Type field */}
          <div className="setup-input-group" style={{ marginBottom: '24px' }}>
            <label className="setup-input-label">Product Type</label>
            <input
              type="text"
              value={formData.productType || ''}
              onChange={e => handleInputChange('productType', e.target.value)}
              disabled={!isFormEditable}
              className="setup-input-field"
              placeholder="Enter product type"
              style={{ color: '#000000' }}
            />
          </div>

          {/* Active Checkbox - Product Type Active field */}
          <div className="setup-input-group">
            <label className="setup-checkbox-label">
              <input
                type="checkbox"
                checked={formData.productTypeActive || false}
                onChange={e => handleInputChange('productTypeActive', e.target.checked)}
                disabled={!isFormEditable}
                className="setup-checkbox-input"
              />
              <span className="setup-checkbox-text">Active</span>
            </label>
          </div>

          {/* Description Textarea - Product Type Description field */}
          <div className="setup-input-group">
            <label className="setup-input-label">Description</label>
            <textarea
              value={formData.productTypeDescription || ''}
              onChange={e => handleInputChange('productTypeDescription', e.target.value)}
              disabled={!isFormEditable}
              className="setup-input-field"
              placeholder="Enter product type description"
              rows={3}
              style={{ resize: 'vertical', minHeight: '80px' }}
              
            />
          </div>
        </div>
      </div>

      {/* Right Column - Product Types Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        
        {/* Applicable Funds Table */}
        <div className="setup-ash-box" style={{ flex: 1 }}>
          <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px', color: '#000000' }}>Applicable Funds</div>
          
          {/* Simple table with just the structure */}
          <div style={{ overflowX: 'auto' }}>
            <table className="setup-custom-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '50%' }} />
                <col style={{ width: '50%' }} />
              </colgroup>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9' }}>
                  <th style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'left', color: '#000000', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Code</th>
                  <th style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'left', color: '#000000', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Fund Name</th>
                </tr>
              </thead>
              <tbody>
                {applicableFunds.map(f => (
                  <tr key={f.code}>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0', color: '#000000', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" disabled={!isFormEditable} />
                        <span>{f.code}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0', color: '#000000', verticalAlign: 'middle' }}>{f.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
// ========================================
// TITLE MODAL CONTENT
// ========================================
function TitleModalContent({ formData, handleInputChange, isFormEditable }: { formData: FormData, handleInputChange: (field: string, value: string | string[] | boolean) => void, isFormEditable: boolean }) {
  return (
    <>
      {/* Title Code */}
      <div className="setup-input-group">
        <label className="setup-input-label">Title Code</label>
        <input
          type="text"
          value={formData.titleCode || ''}
          onChange={e => handleInputChange('titleCode', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter title code"
        />
      </div>
      
      {/* Active Checkbox */}
      <div className="setup-input-group">
        <label className="setup-checkbox-label">
          <label className="setup-checkbox-label">
            <input
              type="checkbox"
              checked={formData.titleActive || false}
              onChange={e => handleInputChange('titleActive', e.target.checked)}
              disabled={!isFormEditable}
              className="setup-checkbox-input"
            />
            <span className="setup-checkbox-text">Active</span>
          </label>
        </label>
      </div>
      
      {/* Description */}
      <div className="setup-input-group">
        <label className="setup-input-label">Description</label>
                  <textarea
            value={formData.titleDescription || ''}
            onChange={e => handleInputChange('titleDescription', e.target.value)}
            disabled={!isFormEditable}
            className="setup-input-field"
            placeholder="Enter description"
            rows={3}
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
      </div>
    </>
  );
}

// 

export default Setup;
