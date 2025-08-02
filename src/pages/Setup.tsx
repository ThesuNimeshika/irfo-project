import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
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
    { trusteeCode: 'TR002', active: 'Yes', trusteeName: 'Sarah Johnson', address: '456 Oak Avenue', town: 'Midtown', city: 'Los Angeles', telephoneNumber: '+1-555-0456', faxNo: '+1-555-0457', email: 'sarah@fiduciary.com' }
  ],
  Custodian: [
    { custodianCode: 'CU001', active: 'Yes', custodianName: 'Global Custody Bank', address1: '123 Wall Street', address2: 'Suite 100', address3: 'Floor 5', telephoneNumber: '+1-555-0123', faxNo: '+1-555-0124', email: 'global@custody.com' },
    { custodianCode: 'CU002', active: 'Yes', custodianName: 'Euro Custody Ltd', address1: '456 Fleet Street', address2: 'Building A', address3: 'Level 3', telephoneNumber: '+44-20-7123-4567', faxNo: '+44-20-7123-4568', email: 'euro@custody.co.uk' }
  ],
  'Postal Area': [
    { code: 'PA001', area: 'Downtown', city: 'New York', zip: '10001' },
    { code: 'PA002', area: 'Midtown', city: 'New York', zip: '10016' },
    { code: 'PA003', area: 'Uptown', city: 'New York', zip: '10025' }
  ],
  'Dividend Type': [
    { code: 'DIV001', type: 'Cash Dividend', frequency: 'Quarterly' },
    { code: 'DIV002', type: 'Stock Dividend', frequency: 'Annually' },
    { code: 'DIV003', type: 'Special Dividend', frequency: 'One-time' }
  ],
  Funds: [
    { code: 'F001', name: 'Growth Fund', type: 'Equity', nav: '15.67' },
    { code: 'F002', name: 'Income Fund', type: 'Bond', nav: '12.34' },
    { code: 'F003', name: 'Balanced Fund', type: 'Mixed', nav: '18.92' }
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
    <div className="relative z-10" style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 0, marginTop: 0 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 0 }}>
        <div className="flex items-center space-x-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{
              width: '200px',
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '12px',
              background: 'white',
              marginRight: '8px'
            }}
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
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '12px',
              background: 'white',
              marginRight: '8px'
            }}
          >
            {[3, 5, 10, 15].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-800" style={{ fontSize: 12 }}>
            {data.length} Records
          </span>
        </div>
      </div>
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 0, paddingTop: 0, minHeight: '200px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Fixed Header */}
          <div style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db', flexShrink: 0 }}>
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        style={{
                          padding: '12px 8px',
                          textAlign: 'left',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          fontSize: '12px',
                          background: '#f3f4f6',
                          cursor: 'pointer',
                          borderBottom: '2px solid #d1d5db',
                          width: `${100 / columns.length}%`,
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: '40px',
                        }}
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
          
          {/* Scrollable Body */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', background: 'white', minHeight: '120px' }}>
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      console.log('Selected row:', row.original);
                      alert(`Selected: ${JSON.stringify(row.original)}`);
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td 
                        key={cell.id} 
                        className="px-3 py-4 text-sm text-gray-900"
                        style={{
                          width: `${100 / columns.length}%`,
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          padding: '12px 8px',
                          height: '40px'
                        }}
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <span style={{ fontSize: 12, marginBottom: 8, color: '#6b7280' }}>Showing {table.getRowModel().rows.length} of {data.length} results</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
            disabled={!table.getCanPreviousPage()}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 'medium',
              color: table.getCanPreviousPage() ? 'white' : '#9ca3af',
              background: table.getCanPreviousPage() ? '#3b82f6' : '#f3f4f6',
              borderRadius: '6px',
              border: `1px solid ${table.getCanPreviousPage() ? '#3b82f6' : '#e5e7eb'}`,
              cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (table.getCanPreviousPage()) {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.borderColor = '#2563eb';
              }
            }}
            onMouseLeave={e => {
              if (table.getCanPreviousPage()) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.borderColor = '#3b82f6';
              }
            }}
          >
            <span style={{ fontSize: '12px' }}>‹</span>
            Previous
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            disabled={!table.getCanNextPage()}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 'medium',
              color: table.getCanNextPage() ? 'white' : '#9ca3af',
              background: table.getCanNextPage() ? '#3b82f6' : '#f3f4f6',
              borderRadius: '6px',
              border: `1px solid ${table.getCanNextPage() ? '#3b82f6' : '#e5e7eb'}`,
              cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (table.getCanNextPage()) {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.borderColor = '#2563eb';
              }
            }}
            onMouseLeave={e => {
              if (table.getCanNextPage()) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.borderColor = '#3b82f6';
              }
            }}
          >
            Next
            <span style={{ fontSize: '12px' }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Setup() {
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
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
    custodianEmail: ''
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
      <div className="home-main-layout" style={{ 
        marginTop: 0, 
        paddingTop: 0, 
        display: 'flex', 
        flexDirection: 'row', 
        height: '100vh', 
        minHeight: 'unset', 
        overflow: 'hidden',
        marginBottom: 0,
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)'
      }}>
        {/* Sidebar left-aligned, fixed width on desktop only */}
        <div className="home-sidebar-container">
          <Sidebar />
        </div>
        {/* Main content area */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 0, 
          height: '100vh', 
          overflow: 'auto', 
          padding: 0,
          marginBottom: 0,
          paddingTop: '50px'
        }}>
          <div className="setup-main-card magical-bg animated-bg" style={{ 
            borderRadius: 16, 
            background: 'linear-gradient(120deg, rgba(255,255,255,0.99) 85%, rgba(79,70,229,0.06) 100%), linear-gradient(100deg, rgba(217,70,239,0.04) 0%, rgba(245,158,66,0.04) 100%)', 
            boxShadow: '0 6px 32px 0 rgba(80, 80, 120, 0.13)', 
            padding: 24, 
            minHeight: 0, 
            marginBottom: 0, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid rgba(80,80,120,0.13)',
            backdropFilter: 'blur(2px)'
          }}>
            <div className="setup-modules-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: 'repeat(5, 1fr)',
              gap: '14px', 
              width: '88%', 
              height: '70%',
              alignContent: 'center',
              justifyContent: 'center',
              padding: '18px',
              margin: '0 auto'
            }}>
              {modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="setup-module-card"
                  style={{ 
                    background: '#f8fafc', 
                    borderRadius: 8, 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                    padding: '8px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    fontSize: '12px', 
                    cursor: 'pointer', 
                    transition: 'box-shadow 0.2s, transform 0.2s', 
                    outline: 'none',
                    border: '1px solid #e5e7eb',
                    margin: '3px'
                  }}
                  tabIndex={0}
                  onClick={() => setModalIdx(idx)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setModalIdx(idx); }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '2px' }}>{mod.icon}</div>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '11px', 
                    textAlign: 'center',
                    lineHeight: 1.1,
                    wordBreak: 'break-word',
                    color: '#333'
                  }}>{mod.title}</div>
                </div>
              ))}
            </div>
            
            {/* Comprehensive Modal */}
            {modalIdx !== null && createPortal(
              <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 99999999,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: isMobile ? 16 : 32,
                paddingTop: '20px',
                isolation: 'isolate'
              }}
                onClick={() => setModalIdx(null)}
              >
                <div
                  style={{
                    background: '#f5f5f5',
                    borderRadius: '0 0 8px 8px',
                    boxShadow: '0 4px 32px #0003',
                    width: isMobile ? '95vw' : '80vw',
                    maxHeight: isMobile ? '98vh' : '98vh',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    marginTop: '0px',
                    zIndex: 99999999
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div style={{
                    background: 'linear-gradient(90deg, #4f46e5 0%, #d946ef 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    minHeight: '40px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{modules[modalIdx].icon}</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{modules[modalIdx].title} Details</span>
                    </div>
                  <button
                    onClick={() => setModalIdx(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                        fontSize: '18px',
                        color: 'white',
                      cursor: 'pointer',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    ×
                  </button>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'auto', maxHeight: 'calc(98vh - 120px)' }}>
                    {/* Input Fields Section */}
                    <div style={{ 
                      background: 'white', 
                      padding: '20px', 
                      borderRadius: '8px', 
                      marginBottom: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                        gap: '8px' 
                      }}>
                        {modules[modalIdx].title === 'Transaction Type' ? (
                          <>
                                                         <div>
                               <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '14px' }}>
                                 Transaction Code
                               </label>
                               <input
                                 type="text"
                                 value={formData.transactionCode}
                                 onChange={(e) => handleInputChange('transactionCode', e.target.value)}
                                 style={{
                                   width: '100%',
                                   padding: '8px 12px',
                                   border: '1px solid #ddd',
                                   borderRadius: '4px',
                                   fontSize: '14px'
                                 }}
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
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      marginBottom: '20px',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => setFormData({ code: '', description: '', address: '', district: '', swiftCode: '', branchNo: '', transactionCode: '', transactionType: '', transactionName: '', lastTransactionNumber: '', trusteeCode: '', active: false, trusteeName: '', trusteeAddress: '', town: '', city: '', telephoneNumber: '', faxNo: '', email: '', custodianCode: '', custodianActive: false, custodianName: '', custodianAddress1: '', custodianAddress2: '', custodianAddress3: '', custodianTelephoneNumber: '', custodianFaxNo: '', custodianEmail: '' })}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>+</span>
                        New
                      </button>
                      <button
                        onClick={handleSave}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>💾</span>
                        Save
                      </button>
                      <button
                        onClick={handleDelete}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>🗑️</span>
                        Delete
                      </button>
                      <button
                        onClick={handlePrint}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)';
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>🖨️</span>
                        Print
                      </button>
                      <button
                        onClick={() => setFormData({ code: '', description: '', address: '', district: '', swiftCode: '', branchNo: '', transactionCode: '', transactionType: '', transactionName: '', lastTransactionNumber: '', trusteeCode: '', active: false, trusteeName: '', trusteeAddress: '', town: '', city: '', telephoneNumber: '', faxNo: '', email: '', custodianCode: '', custodianActive: false, custodianName: '', custodianAddress1: '', custodianAddress2: '', custodianAddress3: '', custodianTelephoneNumber: '', custodianFaxNo: '', custodianEmail: '' })}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(107, 114, 128, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(107, 114, 128, 0.3)';
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>🗑️</span>
                        Clear
                      </button>
                    </div>

                    {/* Data Table */}
                    <div style={{ 
                      background: 'white', 
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '250px',
                      maxHeight: '350px'
                    }}>
                      <div style={{ 
                        padding: '16px',
                        height: '100%'
                      }}>
                        <CustomDataTable 
                          data={getTableData(modules[modalIdx].title)}
                          columns={getTableColumns(modules[modalIdx].title)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    padding: '12px 20px',
                    background: '#f3f4f6',
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '12px',
                    color: '#6b7280',
                    textAlign: 'center'
                  }}>
                    Double click to get the selected value
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

export default Setup;
