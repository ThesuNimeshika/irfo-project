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
  { title: 'Agent commission Definitions', icon: '📝' },
  { title: 'Assign Agents to Commission Definition', icon: '🔗' },
  { title: 'Institution Category', icon: '🏛️' },
  { title: 'Documents Setup', icon: '📄' },
  { title: 'Institution', icon: '🏫' },
  { title: 'Blocking Category', icon: '🚫' },
  { title: 'Customer Zone', icon: '🌐' },
  { title: 'Join Sale Agent', icon: '🤝' },
  { title: 'Complience MSG Setup', icon: '💬' },
  { title: 'Product type', icon: '📦' },
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
    { code: 'PA001', activity: 'Summer Sale', period: 'Jun-Aug 2024', discount: '20%' },
    { code: 'PA002', activity: 'Holiday Special', period: 'Dec 2024', discount: '15%' }
  ],
  'Unit Fee Codes': [
    { code: 'UFC001', description: 'Entry Fee', rate: '2.5%', type: 'Percentage' },
    { code: 'UFC002', description: 'Exit Fee', rate: '1.5%', type: 'Percentage' }
  ],
  'Agency Type': [
    { code: 'AT001', type: 'Primary Agent', commission: '3.0%' },
    { code: 'AT002', type: 'Sub Agent', commission: '1.5%' }
  ],
  Agency: [
    { code: 'AG001', name: 'Main Street Agency', location: 'Downtown', status: 'Active' },
    { code: 'AG002', name: 'Central Agency', location: 'Midtown', status: 'Active' }
  ],
  'Sub Agency': [
    { code: 'SA001', name: 'Downtown Branch', parent: 'Main Street Agency', manager: 'John Doe' },
    { code: 'SA002', name: 'Uptown Branch', parent: 'Central Agency', manager: 'Jane Smith' }
  ],
  Agents: [
    { code: 'AGT001', name: 'John Smith', phone: '+1-555-0123', email: 'john@agency.com' },
    { code: 'AGT002', name: 'Sarah Johnson', phone: '+1-555-0456', email: 'sarah@agency.com' }
  ],
  Territory: [
    { code: 'T001', name: 'North Region', manager: 'Mike Wilson', area: 'Northern States' },
    { code: 'T002', name: 'South Region', manager: 'Lisa Brown', area: 'Southern States' }
  ],
  'Commision Type': [
    { code: 'CT001', type: 'Flat Rate', rate: '50.00', description: 'Fixed commission per transaction' },
    { code: 'CT002', type: 'Percentage', rate: '2.5%', description: 'Percentage of transaction value' }
  ],
  'Commission Level': [
    { code: 'CL001', level: 'Bronze', rate: '1.0%', minAmount: '1000' },
    { code: 'CL002', level: 'Silver', rate: '1.5%', minAmount: '5000' },
    { code: 'CL003', level: 'Gold', rate: '2.0%', minAmount: '10000' }
  ],
  'Agent commission Definitions': [
    { code: 'ACD001', agent: 'John Smith', type: 'Flat Rate', amount: '25.00' },
    { code: 'ACD002', agent: 'Sarah Johnson', type: 'Percentage', rate: '2.0%' }
  ],
  'Assign Agents to Commission Definition': [
    { agent: 'John Smith', definition: 'ACD001', effectiveDate: '2024-01-01', status: 'Active' },
    { agent: 'Sarah Johnson', definition: 'ACD002', effectiveDate: '2024-01-01', status: 'Active' }
  ],
  'Institution Category': [
    { code: 'IC001', category: 'Bank', description: 'Financial Institutions' },
    { code: 'IC002', category: 'Insurance', description: 'Insurance Companies' }
  ],
  'Documents Setup': [
    { code: 'DS001', document: 'Application Form', required: 'Yes', format: 'PDF' },
    { code: 'DS002', document: 'ID Proof', required: 'Yes', format: 'Image' }
  ],
  Institution: [
    { code: 'INS001', name: 'First National Bank', type: 'Bank', status: 'Active' },
    { code: 'INS002', name: 'Metro Insurance', type: 'Insurance', status: 'Active' }
  ],
  'Blocking Category': [
    { code: 'BC001', category: 'Fraud', description: 'Suspicious activity detected' },
    { code: 'BC002', category: 'Compliance', description: 'Regulatory requirement' }
  ],
  'Customer Zone': [
    { code: 'CZ001', zone: 'Premium', criteria: 'High Value', benefits: 'VIP Services' },
    { code: 'CZ002', zone: 'Standard', criteria: 'Regular', benefits: 'Standard Services' }
  ],
  'Join Sale Agent': [
    { agent: 'John Smith', partner: 'Sarah Johnson', startDate: '2024-01-01', status: 'Active' },
    { agent: 'Mike Wilson', partner: 'Lisa Brown', startDate: '2024-02-01', status: 'Active' }
  ],
  'Complience MSG Setup': [
    { code: 'CMS001', message: 'Risk Warning', type: 'Mandatory', frequency: 'Every Transaction' },
    { code: 'CMS002', message: 'Terms & Conditions', type: 'Required', frequency: 'First Time' }
  ],
  'Product type': [
    { code: 'PT001', type: 'Equity Fund', risk: 'High', return: '8-12%' },
    { code: 'PT002', type: 'Bond Fund', risk: 'Low', return: '4-6%' }
  ],
  Title: [
    { code: 'T001', title: 'Mr.', gender: 'Male', formal: 'Yes' },
    { code: 'T002', title: 'Ms.', gender: 'Female', formal: 'Yes' },
    { code: 'T003', title: 'Dr.', gender: 'Any', formal: 'Yes' }
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
          >
            {[3, 5, 10, 15].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <span className="setup-table-records">
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
    companyFax: '',
    companyApplicationApproval: false,
    companyAccountApproval: false,
    companyTelephone: '',
    companyEmail: '',
    companyWebsite: '',
  });

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
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field.includes('Approval') ? value === 'true' : value 
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
    setFormData({ code: '', description: '', address: '', district: '', swiftCode: '', branchNo: '', transactionCode: '', transactionType: '', transactionName: '', lastTransactionNumber: '', trusteeCode: '', active: false, trusteeName: '', trusteeAddress: '', telephoneNumber: '', faxNo: '', email: '', custodianCode: '', custodianActive: false, custodianName: '', custodianAddress1: '', custodianAddress2: '', custodianAddress3: '', custodianTelephoneNumber: '', custodianFaxNo: '', custodianEmail: '', postalCode: '', postalActive: false, postalDescription: '', dividendType: '', dividendActive: false, dividendDescription: '', fund: '', fundName: '', manager: '', trustee: '', custodian: '', minValue: '', minUnits: '', suspenseAccount: '', launchDate: null, fundType: '', ipoStartDate: null, ipoEndDate: null, certificateType: '', portfolioCode: '', maturityDate: null, promotionCode: '', promotionName: '', promotionDescription: '', companyCode: '', companyName: '', companyPostalCode: '', companyStreet: '', companyTown: '', companyCity: '', companyTelephone: '', companyFax: '', companyApplicationApproval: false, companyAccountApproval: false, companyEmail: '', companyWebsite: '' });
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
            />
          )}
          {/* Default Bank modal for other modules */}
          {!['Bank', 'Transaction Type', 'Trustees', 'Custodian', 'Postal Area', 'Dividend Type', 'Funds', 'Promotional Activity', 'Company'].includes(modalTitle) && (
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
                        onClick={() => setFormData({ code: '', description: '', address: '', district: '', swiftCode: '', branchNo: '', transactionCode: '', transactionType: '', transactionName: '', lastTransactionNumber: '', trusteeCode: '', active: false, trusteeName: '', trusteeAddress: '', telephoneNumber: '', faxNo: '', email: '', custodianCode: '', custodianActive: false, custodianName: '', custodianAddress1: '', custodianAddress2: '', custodianAddress3: '', custodianTelephoneNumber: '', custodianFaxNo: '', custodianEmail: '', postalCode: '', postalActive: false, postalDescription: '', dividendType: '', dividendActive: false, dividendDescription: '', fund: '', fundName: '', manager: '', trustee: '', custodian: '', minValue: '', minUnits: '', suspenseAccount: '', launchDate: null, fundType: '', ipoStartDate: null, ipoEndDate: null, certificateType: '', portfolioCode: '', maturityDate: null, promotionCode: '', promotionName: '', promotionDescription: '', companyCode: '', companyName: '', companyPostalCode: '', companyStreet: '', companyTown: '', companyCity: '', companyTelephone: '', companyFax: '', companyApplicationApproval: false, companyAccountApproval: false, companyEmail: '', companyWebsite: '' })}
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
    <div className="setup-tabbed-table-section">
      <div className="setup-tab-navigation">
        <button className={`setup-tab-button ${activeTab === 'funds' ? 'active' : ''}`} onClick={() => setActiveTab('funds')}>Funds</button>
        <button className={`setup-tab-button ${activeTab === 'partly-redemptions' ? 'active' : ''}`} onClick={() => setActiveTab('partly-redemptions')}>Partly Redemptions</button>
        <button className={`setup-tab-button ${activeTab === 'fund-accounts' ? 'active' : ''}`} onClick={() => setActiveTab('fund-accounts')}>Fund Accounts</button>
        <button className={`setup-tab-button ${activeTab === 'gl-account' ? 'active' : ''}`} onClick={() => setActiveTab('gl-account')}>GL Account</button>
      </div>
      <div className="setup-tab-content">
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
  );
}

function CompanyDetailsTabs({ formData, handleInputChange, isFormEditable, isMobile }: { formData: FormData, handleInputChange: (field: string, value: string) => void, isFormEditable: boolean, isMobile: boolean }) {
  const [activeTab, setActiveTab] = React.useState('company');
  
  return (
    <>
      <div className="setup-tab-navigation">
        <button className={`setup-tab-button ${activeTab === 'company' ? 'active' : ''}`} onClick={() => setActiveTab('company')}>Company</button>
        <button className={`setup-tab-button ${activeTab === 'administrator' ? 'active' : ''}`} onClick={() => setActiveTab('administrator')}>Administrator</button>
        <button className={`setup-tab-button ${activeTab === 'email-sms' ? 'active' : ''}`} onClick={() => setActiveTab('email-sms')}>Email and SMS</button>
      </div>
      <div className="setup-tab-content">
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
                      onChange={(e) => handleInputChange('companyApplicationApproval', e.target.checked.toString())}
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
                      onChange={(e) => handleInputChange('companyAccountApproval', e.target.checked.toString())}
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
              <div className="setup-administrator-inputs">
                {/* Empty content for now */}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'email-sms' && (
          <div className="setup-email-sms-tab">
            <div className="setup-email-sms-form">
              <div className="setup-email-sms-inputs">
                {/* Empty content for now */}
              </div>
            </div>
          </div>
        )}
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
      <div>
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
      <div>
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
      <div>
        <label className="setup-input-label">Address (No/Street/Town/City)</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          disabled={!isFormEditable}
          className="setup-input-field"
          placeholder="Enter address as: No, Street Name, Town, City"
        />
      </div>
      <div>
        <label className="setup-input-label">District</label>
        <select
          value={formData.district}
          onChange={(e) => handleInputChange('district', e.target.value)}
          disabled={!isFormEditable}
          className="setup-select-field"
        >
          <option value="">Select district</option>
          <option value="north">North District</option>
          <option value="south">South District</option>
          <option value="east">East District</option>
          <option value="west">West District</option>
        </select>
      </div>
      <div>
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
      <div>
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
function PromotionalActivityModalContent({ formData, handleInputChange }: { formData: FormData, handleInputChange: (field: string, value: string) => void }) {
  return (
                          <>
                            <div>
        <label className="setup-input-label">Promotion Code</label>
                              <input
                                type="text"
          value={formData.promotionCode}
          onChange={(e) => handleInputChange('promotionCode', e.target.value)}
          className="setup-input-field"
          placeholder="Enter promotion code"
                              />
          </div>
                            <div>
        <label className="setup-input-label">Promotion Name</label>
                              <input
                                type="text"
          value={formData.promotionName}
          onChange={(e) => handleInputChange('promotionName', e.target.value)}
          className="setup-input-field"
          placeholder="Enter promotion name"
                              />
                            </div>
                            <div>
        <label className="setup-input-label">Description</label>
        <textarea
          value={formData.promotionDescription}
          onChange={(e) => handleInputChange('promotionDescription', e.target.value)}
                            className="setup-input-field"
          placeholder="Enter description"
          rows={3}
                          />
                        </div>
    </>
  );
}

export default Setup;
