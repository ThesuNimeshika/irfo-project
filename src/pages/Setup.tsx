import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect, useMemo } from 'react';
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

// Add custom styles for date picker
const datePickerStyles = `
  .date-picker-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = datePickerStyles;
document.head.appendChild(styleSheet);

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
  { title: 'Other charges', icon: '💳' },
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

// Sample data for different table views
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
  'Other charges': [
    { code: 'OC001', description: 'Processing Fee', amount: '25.00', type: 'Fixed' },
    { code: 'OC002', description: 'Maintenance Fee', amount: '50.00', type: 'Annual' }
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

// Custom DataTable Component
function CustomDataTable({ data, columns }: { data: Record<string, string | undefined>[], columns: string[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 3,
  });

  const columnHelper = createColumnHelper<Record<string, string | undefined>>();

  const tableColumns = useMemo(() => 
    columns.map((column) =>
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
    ), [columns]
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

function Setup() {
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [suspenseModalOpen, setSuspenseModalOpen] = useState(false);
  const [systemCalendarOpen, setSystemCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
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
    town: '',
    city: '',
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
    launchDate: null as Date | null,
    fundType: '',
    ipoStartDate: null as Date | null,
    ipoEndDate: null as Date | null,
    certificateType: '',
    portfolioCode: '',
    maturityDate: null as Date | null
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: string, date: Date | null) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving:', formData);
    alert('Data saved successfully!');
  };

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Deleting record');
    alert('Record deleted successfully!');
  };

  const handlePrint = () => {
    // Handle print logic here
    console.log('Printing data');
    window.print();
  };

  const getTableColumns = (title: string) => {
    const data = tableData[title as keyof typeof tableData] || [];
    if (data.length === 0) return [];
    
    return Object.keys(data[0]);
  };

  const getTableData = (title: string) => {
    return tableData[title as keyof typeof tableData] || [];
  };

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
                      setModalIdx(idx);
                    }
                  }}
                  onKeyDown={e => { 
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (mod.title === 'System Calendar') {
                        setSystemCalendarOpen(true);
                      } else {
                        setModalIdx(idx);
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
                    {/* Input Fields Section */}
                    <div className="setup-input-section">
                      <div className={`setup-input-grid ${isMobile ? 'mobile' : ''}`}>
                        {modules[modalIdx].title === 'Transaction Type' ? (
                                                      <>
                                                         <div className="setup-input-group">
                               <label className="setup-input-label">
                                 Transaction Code
                               </label>
                               <input
                                 type="text"
                                 value={formData.transactionCode}
                                 onChange={(e) => handleInputChange('transactionCode', e.target.value)}
                                 className="setup-input-field"
                                 placeholder="Enter transaction code"
                               />
              </div>
                             <div>
                               <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                 Transaction Type
                               </label>
                               <select
                                 value={formData.transactionType}
                                 onChange={(e) => handleInputChange('transactionType', e.target.value)}
                                 style={{
                                   width: '100%',
                                   padding: '8px 12px',
                                   border: '1px solid #ddd',
                                   borderRadius: '4px',
                                   fontSize: '14px'
                                 }}
                               >
                                 <option value="">Select transaction type</option>
                                 <option value="Purchase">Purchase</option>
                                 <option value="Sale">Sale</option>
                                 <option value="Dividend">Dividend</option>
                                 <option value="Transfer">Transfer</option>
                               </select>
                             </div>
                             <div>
                               <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                 Transaction Name
                               </label>
                               <input
                                 type="text"
                                 value={formData.transactionName}
                                 onChange={(e) => handleInputChange('transactionName', e.target.value)}
                                 style={{
                                   width: '100%',
                                   padding: '8px 12px',
                                   border: '1px solid #ddd',
                                   borderRadius: '4px',
                                   fontSize: '14px'
                                 }}
                                 placeholder="Enter transaction name"
                               />
                             </div>
                             <div>
                               <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                 Last Transaction Number
                               </label>
                               <input
                                 type="text"
                                 value={formData.lastTransactionNumber}
                                 onChange={(e) => handleInputChange('lastTransactionNumber', e.target.value)}
                                 style={{
                                   width: '100%',
                                   padding: '8px 12px',
                                   border: '1px solid #ddd',
                                   borderRadius: '4px',
                                   fontSize: '14px'
                                 }}
                                 placeholder="Enter last transaction number"
                               />
                             </div>
                          </>
                        ) : modules[modalIdx].title === 'Trustees' ? (
                          <>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Trustee Code
                              </label>
                              <input
                                type="text"
                                value={formData.trusteeCode}
                                onChange={(e) => handleInputChange('trusteeCode', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter trustee code"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Active
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="checkbox"
                                  checked={formData.active}
                                  onChange={(e) => handleInputChange('active', e.target.checked.toString())}
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer'
                                  }}
                                />
                                <span style={{ fontSize: '14px', color: '#666' }}>Active</span>
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Trustee Name
                              </label>
                              <input
                                type="text"
                                value={formData.trusteeName}
                                onChange={(e) => handleInputChange('trusteeName', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter trustee name"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Address
                              </label>
                              <input
                                type="text"
                                value={formData.trusteeAddress}
                                onChange={(e) => handleInputChange('trusteeAddress', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter address House no, Street Name"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Town
                              </label>
                              <input
                                type="text"
                                value={formData.town}
                                onChange={(e) => handleInputChange('town', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter your town"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                City
                              </label>
                              <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter your City, District"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Telephone Number
                              </label>
                              <input
                                type="text"
                                value={formData.telephoneNumber}
                                onChange={(e) => handleInputChange('telephoneNumber', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter telephone number"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Fax No
                              </label>
                              <input
                                type="text"
                                value={formData.faxNo}
                                onChange={(e) => handleInputChange('faxNo', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter fax number"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                E-mail
                              </label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter e-mail"
                              />
                            </div>
                          </>
                        ) : modules[modalIdx].title === 'Custodian' ? (
                          <>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Custodian Code
                              </label>
                              <input
                                type="text"
                                value={formData.custodianCode}
                                onChange={(e) => handleInputChange('custodianCode', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter custodian code"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Active
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="checkbox"
                                  checked={formData.custodianActive}
                                  onChange={(e) => handleInputChange('custodianActive', e.target.checked.toString())}
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer'
                                  }}
                                />
                                <span style={{ fontSize: '14px', color: '#666' }}>Active</span>
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Custodian Name
                              </label>
                              <input
                                type="text"
                                value={formData.custodianName}
                                onChange={(e) => handleInputChange('custodianName', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter custodian name"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Address 1
                              </label>
                              <input
                                type="text"
                                value={formData.custodianAddress1}
                                onChange={(e) => handleInputChange('custodianAddress1', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter address 1"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Address 2
                              </label>
                              <input
                                type="text"
                                value={formData.custodianAddress2}
                                onChange={(e) => handleInputChange('custodianAddress2', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter address 2"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Address 3
                              </label>
                              <input
                                type="text"
                                value={formData.custodianAddress3}
                                onChange={(e) => handleInputChange('custodianAddress3', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter address 3"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Telephone Number
                              </label>
                              <input
                                type="text"
                                value={formData.custodianTelephoneNumber}
                                onChange={(e) => handleInputChange('custodianTelephoneNumber', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter telephone number"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Fax No
                              </label>
                              <input
                                type="text"
                                value={formData.custodianFaxNo}
                                onChange={(e) => handleInputChange('custodianFaxNo', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter fax number"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                E-mail
                              </label>
                              <input
                                type="email"
                                value={formData.custodianEmail}
                                onChange={(e) => handleInputChange('custodianEmail', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter e-mail"
                              />
                            </div>
                          </>
                        ) : modules[modalIdx].title === 'Postal Area' ? (
                          <>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Postal Code
                              </label>
                              <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter postal code"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Active
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="checkbox"
                                  checked={formData.postalActive}
                                  onChange={(e) => handleInputChange('postalActive', e.target.checked.toString())}
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer'
                                  }}
                                />
                                <span style={{ fontSize: '14px', color: '#666' }}>Active</span>
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Description
                              </label>
                              <input
                                type="text"
                                value={formData.postalDescription}
                                onChange={(e) => handleInputChange('postalDescription', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter description"
                              />
                            </div>
                          </>
                        ) : modules[modalIdx].title === 'Dividend Type' ? (
                          <>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Dividend Type
                              </label>
                              <input
                                type="text"
                                value={formData.dividendType}
                                onChange={(e) => handleInputChange('dividendType', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter dividend type"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Active
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="checkbox"
                                  checked={formData.dividendActive}
                                  onChange={(e) => handleInputChange('dividendActive', e.target.checked.toString())}
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer'
                                  }}
                                />
                                <span style={{ fontSize: '14px', color: '#666' }}>Active</span>
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Description
                              </label>
                              <input
                                type="text"
                                value={formData.dividendDescription}
                                onChange={(e) => handleInputChange('dividendDescription', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter description"
                              />
                            </div>
                          </>
                        ) : modules[modalIdx].title === 'Funds' ? (
                          <>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Fund
                              </label>
                              <input
                                type="text"
                                value={formData.fund}
                                onChange={(e) => handleInputChange('fund', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter Fund"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Name
                              </label>
                              <input
                                type="text"
                                value={formData.fundName}
                                onChange={(e) => handleInputChange('fundName', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter Name"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Manager
                              </label>
                              <input
                                type="text"
                                value={formData.manager}
                                onChange={(e) => handleInputChange('manager', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter Manager"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Trustee
                              </label>
                              <select
                                value={formData.trustee}
                                onChange={(e) => handleInputChange('trustee', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                              >
                                <option value="">Select Trustee</option>
                                <option value="Trust Corp">Trust Corp</option>
                                <option value="Fiduciary Ltd">Fiduciary Ltd</option>
                                <option value="Trustee Corp">Trustee Corp</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Custodian
                              </label>
                              <select
                                value={formData.custodian}
                                onChange={(e) => handleInputChange('custodian', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                              >
                                <option value="">Select Custodian</option>
                                <option value="Global Custody">Global Custody</option>
                                <option value="Euro Custody">Euro Custody</option>
                                <option value="Asia Custody">Asia Custody</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Min Value of Investment
                              </label>
                              <input
                                type="text"
                                value={formData.minValue}
                                onChange={(e) => handleInputChange('minValue', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter Min Value"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Min No of Units
                              </label>
                              <input
                                type="text"
                                value={formData.minUnits}
                                onChange={(e) => handleInputChange('minUnits', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter Units"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Fund Suspense Account
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => setSuspenseModalOpen(true)}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    backgroundColor: '#f8f9fa',
                                    color: '#333',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e9ecef';
                                    e.currentTarget.style.borderColor = '#adb5bd';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    e.currentTarget.style.borderColor = '#ddd';
                                  }}
                                >
                                  A
                                </button>
                                <input
                                  type="text"
                                  value={formData.suspenseAccount}
                                  onChange={(e) => handleInputChange('suspenseAccount', e.target.value)}
                                  style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                  placeholder="Enter Suspense Account"
                                />
                              </div>
                            </div>
                                                           <div>
                                 <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                   Launch Date
                                 </label>
                                 <DatePicker
                                   selected={formData.launchDate}
                                   onChange={(date) => handleDateChange('launchDate', date)}
                                   dateFormat="dd/MM/yyyy"
                                   placeholderText="dd/mm/yyyy"
                                   className="date-picker-input"
                                 />
                               </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Fund Type
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                  <input
                                    type="radio"
                                    name="fundType"
                                    value="Open Ended"
                                    checked={formData.fundType === 'Open Ended'}
                                    onChange={(e) => handleInputChange('fundType', e.target.value)}
                                    style={{
                                      width: '16px',
                                      height: '16px',
                                      cursor: 'pointer'
                                    }}
                                  />
                                  Open Ended
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                  <input
                                    type="radio"
                                    name="fundType"
                                    value="Close Ended"
                                    checked={formData.fundType === 'Close Ended'}
                                    onChange={(e) => handleInputChange('fundType', e.target.value)}
                                    style={{
                                      width: '16px',
                                      height: '16px',
                                      cursor: 'pointer'
                                    }}
                                  />
                                  Close Ended
                                </label>
                              </div>
                            </div>
                                                           <div>
                                 <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                   IPO Starting Date
                                 </label>
                                 <DatePicker
                                   selected={formData.ipoStartDate}
                                   onChange={(date) => handleDateChange('ipoStartDate', date)}
                                   dateFormat="dd/MM/yyyy"
                                   placeholderText="dd/mm/yyyy"
                                   className="date-picker-input"
                                 />
                               </div>
                                                           <div>
                                 <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                   IPO Ending Date
                                 </label>
                                 <DatePicker
                                   selected={formData.ipoEndDate}
                                   onChange={(date) => handleDateChange('ipoEndDate', date)}
                                   dateFormat="dd/MM/yyyy"
                                   placeholderText="dd/mm/yyyy"
                                   className="date-picker-input"
                                 />
                               </div>
                            {formData.fundType === 'Close Ended' ? (
                              <>
                                <div>
                                  <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Maturity Date
                                  </label>
                                  <DatePicker
                                    selected={formData.maturityDate}
                                    onChange={(date) => handleDateChange('maturityDate', date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/mm/yyyy"
                                    className="date-picker-input"
                                  />
                                </div>
                                <div>
                                  <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Certificate Type
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.certificateType}
                                    onChange={(e) => handleInputChange('certificateType', e.target.value)}
                                    style={{
                                      width: '100%',
                                      padding: '8px 12px',
                                      border: '1px solid #ddd',
                                      borderRadius: '4px',
                                      fontSize: '14px'
                                    }}
                                    placeholder="Enter Certificate Type"
                                  />
                                </div>
                                <div>
                                  <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Portfolio Code
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.portfolioCode}
                                    onChange={(e) => handleInputChange('portfolioCode', e.target.value)}
                                    style={{
                                      width: '100%',
                                      padding: '8px 12px',
                                      border: '1px solid #ddd',
                                      borderRadius: '4px',
                                      fontSize: '14px'
                                    }}
                                    placeholder="Enter PF Code"
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Certificate Type
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.certificateType}
                                    onChange={(e) => handleInputChange('certificateType', e.target.value)}
                                    style={{
                                      width: '100%',
                                      padding: '8px 12px',
                                      border: '1px solid #ddd',
                                      borderRadius: '4px',
                                      fontSize: '14px'
                                    }}
                                    placeholder="Enter Certificate Type"
                                  />
                                </div>
                                <div>
                                  <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Portfolio Code
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.portfolioCode}
                                    onChange={(e) => handleInputChange('portfolioCode', e.target.value)}
                                    style={{
                                      width: '100%',
                                      padding: '8px 12px',
                                      border: '1px solid #ddd',
                                      borderRadius: '4px',
                                      fontSize: '14px'
                                    }}
                                    placeholder="Enter PF Code"
                                  />
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Bank Code
                              </label>
                              <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => handleInputChange('code', e.target.value)}
                                maxLength={7}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter bank code"
                              />
          </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Description
                              </label>
                              <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter description"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Address
                              </label>
                              <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter address"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                District
                              </label>
                              <select
                                value={formData.district}
                                onChange={(e) => handleInputChange('district', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                              >
                                <option value="">Select district</option>
                                <option value="north">North District</option>
                                <option value="south">South District</option>
                                <option value="east">East District</option>
                                <option value="west">West District</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Swift Code
                              </label>
                              <input
                                type="text"
                                value={formData.swiftCode}
                                onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  color: '#666',
                                  backgroundColor: '#f5f5f5'
                                }}
                                placeholder="Read only field"
                                readOnly
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                Branch No
                              </label>
                              <input
                                type="text"
                                value={formData.branchNo}
                                onChange={(e) => handleInputChange('branchNo', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="Enter branch number"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="setup-action-buttons">
                      <button
                        onClick={() => setFormData({ code: '', description: '', address: '', district: '', swiftCode: '', branchNo: '', transactionCode: '', transactionType: '', transactionName: '', lastTransactionNumber: '', trusteeCode: '', active: false, trusteeName: '', trusteeAddress: '', town: '', city: '', telephoneNumber: '', faxNo: '', email: '', custodianCode: '', custodianActive: false, custodianName: '', custodianAddress1: '', custodianAddress2: '', custodianAddress3: '', custodianTelephoneNumber: '', custodianFaxNo: '', custodianEmail: '', postalCode: '', postalActive: false, postalDescription: '', dividendType: '', dividendActive: false, dividendDescription: '', fund: '', fundName: '', manager: '', trustee: '', custodian: '', minValue: '', minUnits: '', suspenseAccount: '', launchDate: null, fundType: '', ipoStartDate: null, ipoEndDate: null, certificateType: '', portfolioCode: '', maturityDate: null })}
                        className="setup-btn setup-btn-new"
                      >
                        <span className="setup-btn-icon">+</span>
                        New
                      </button>
                      <button
                        onClick={handleSave}
                        className="setup-btn setup-btn-save"
                      >
                        <span className="setup-btn-icon">💾</span>
                        Save
                      </button>
                      <button
                        onClick={handleDelete}
                        className="setup-btn setup-btn-delete"
                      >
                        <span className="setup-btn-icon">🗑️</span>
                        Delete
                      </button>
                      <button
                        onClick={handlePrint}
                        className="setup-btn setup-btn-print"
                      >
                        <span className="setup-btn-icon">🖨️</span>
                        Print
                      </button>
                      <button
                        onClick={() => setFormData({ code: '', description: '', address: '', district: '', swiftCode: '', branchNo: '', transactionCode: '', transactionType: '', transactionName: '', lastTransactionNumber: '', trusteeCode: '', active: false, trusteeName: '', trusteeAddress: '', town: '', city: '', telephoneNumber: '', faxNo: '', email: '', custodianCode: '', custodianActive: false, custodianName: '', custodianAddress1: '', custodianAddress2: '', custodianAddress3: '', custodianTelephoneNumber: '', custodianFaxNo: '', custodianEmail: '', postalCode: '', postalActive: false, postalDescription: '', dividendType: '', dividendActive: false, dividendDescription: '', fund: '', fundName: '', manager: '', trustee: '', custodian: '', minValue: '', minUnits: '', suspenseAccount: '', launchDate: null, fundType: '', ipoStartDate: null, ipoEndDate: null, certificateType: '', portfolioCode: '', maturityDate: null })}
                        className="setup-btn setup-btn-clear"
                      >
                        <span className="setup-btn-icon">🗑️</span>
                        Clear
                      </button>
                    </div>

                    {/* Data Table */}
                    <div className="setup-data-table-container">
                      <div className="setup-data-table-content">
                        <CustomDataTable 
                          data={getTableData(modules[modalIdx].title)}
                          columns={getTableColumns(modules[modalIdx].title)}
                        />
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
                      <span className="setup-suspense-modal-header-icon">🏦</span>
                      <span className="setup-suspense-modal-header-title">Suspense Account Management</span>
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
                    {/* Input Fields Section */}
                    <div className="setup-input-section">
                      <div className={`setup-suspense-input-grid ${isMobile ? 'mobile' : ''}`}>
                        <div className="setup-input-group">
                          <label className="setup-input-label">
                            Account Code
                          </label>
                          <input
                            type="text"
                            className="setup-input-field"
                            placeholder="Enter account code"
                          />
                        </div>
                        <div className="setup-input-group">
                          <label className="setup-input-label">
                            Account Name
                          </label>
                          <input
                            type="text"
                            className="setup-input-field"
                            placeholder="Enter account name"
                          />
                        </div>
                        <div className="setup-input-group">
                          <label className="setup-input-label">
                            Account Type
                          </label>
                          <select className="setup-select-field">
                            <option value="">Select account type</option>
                            <option value="asset">Asset</option>
                            <option value="liability">Liability</option>
                            <option value="equity">Equity</option>
                            <option value="revenue">Revenue</option>
                            <option value="expense">Expense</option>
                          </select>
                        </div>
                        <div className="setup-input-group">
                          <label className="setup-input-label">
                            Status
                          </label>
                          <div className="setup-checkbox-group">
                            <input
                              type="checkbox"
                              className="setup-checkbox"
                            />
                            <span className="setup-checkbox-label">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="setup-suspense-action-buttons">
                      <button className="setup-btn setup-btn-new">
                        <span className="setup-btn-icon">➕</span>
                        New
                      </button>
                      <button className="setup-btn setup-btn-save">
                        <span className="setup-btn-icon">💾</span>
                        Save
                      </button>
                      <button className="setup-btn setup-btn-delete">
                        <span className="setup-btn-icon">🗑️</span>
                        Delete
                      </button>
                      <button className="setup-btn setup-btn-print">
                        <span className="setup-btn-icon">🖨️</span>
                        Print
                      </button>
                      <button
                        onClick={() => setSuspenseModalOpen(false)}
                        className="setup-btn setup-btn-close"
                      >
                        <span className="setup-btn-icon">❌</span>
                        Close
                      </button>
                    </div>

                    {/* Data Table */}
                    <div className="setup-suspense-data-table-container">
                      <div className="setup-suspense-data-table-content">
                        <CustomDataTable 
                          data={[
                            { accountCode: 'SUS001', accountName: 'Suspense Account 1', accountType: 'Asset', status: 'Active' },
                            { accountCode: 'SUS002', accountName: 'Suspense Account 2', accountType: 'Liability', status: 'Active' },
                            { accountCode: 'SUS003', accountName: 'Suspense Account 3', accountType: 'Asset', status: 'Inactive' }
                          ]}
                          columns={['accountCode', 'accountName', 'accountType', 'status']}
                        />
                      </div>
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
      <Footer />
    </>
  );
}

export default Setup;
