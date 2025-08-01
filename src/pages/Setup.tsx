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
    { code: 'T001', description: 'Purchase', type: 'Buy' },
    { code: 'T002', description: 'Sale', type: 'Sell' },
    { code: 'T003', description: 'Dividend', type: 'Income' },
    { code: 'T004', description: 'Transfer', type: 'Move' }
  ],
  'System Calendar': [
    { date: '2024-01-01', description: 'New Year', type: 'Holiday' },
    { date: '2024-01-15', description: 'Working Day', type: 'Business' },
    { date: '2024-02-14', description: 'Valentine Day', type: 'Special' }
  ],
  Trustees: [
    { code: 'TR001', name: 'John Smith', company: 'Trust Corp Ltd', contact: '+1-555-0123' },
    { code: 'TR002', name: 'Sarah Johnson', company: 'Fiduciary Services', contact: '+1-555-0456' }
  ],
  Custodian: [
    { code: 'CU001', name: 'Global Custody Bank', address: '123 Wall Street, NY', swift: 'GCBNYUS' },
    { code: 'CU002', name: 'Euro Custody Ltd', address: '456 Fleet Street, London', swift: 'ECLGB2L' }
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
function CustomDataTable({ data, columns, title }: { data: any[], columns: string[], title: string }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const columnHelper = createColumnHelper<any>();

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
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
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
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
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
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 0, paddingTop: 0, height: '100%' }}>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
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
                          borderBottom: '2px solid #d1d5db'
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
                      <td key={cell.id} className="px-3 py-4 text-sm text-gray-900">
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
            onClick={() => table.previousPage()}
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
            onClick={() => table.nextPage()}
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
    branchNo: ''
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
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{mod.icon}</div>
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
                    height: isMobile ? '90vh' : '90vh',
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
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
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
                        gap: '16px' 
                      }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                            Code
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
                            placeholder="Enter code"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
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
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
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
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
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
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
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
                              color: '#666'
                            }}
                            placeholder="Enter swift code"
                            disabled
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
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
                              fontSize: '14px',
                              color: '#666'
                            }}
                            placeholder="Enter branch number"
                            disabled
                          />
                        </div>
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
                        onClick={() => setFormData({ code: '', description: '', address: '', district: '', swiftCode: '', branchNo: '' })}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>+</span>
                        New
                      </button>
                      <button
                        onClick={handleSave}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
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
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
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
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>🖨️</span>
                        Print
                      </button>
                      <button
                        onClick={() => setFormData({ code: '', description: '', address: '', district: '', swiftCode: '', branchNo: '' })}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>🗑️</span>
                        Clear
                      </button>
                    </div>

                    {/* Data Table */}
                    <div style={{ 
                      flex: 1, 
                      background: 'white', 
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '400px'
                    }}>
                      <div style={{ 
                        flex: 1,
                        overflow: 'auto',
                        minHeight: 0,
                        padding: '16px'
                      }}>
                        <CustomDataTable 
                          data={getTableData(modules[modalIdx].title)}
                          columns={getTableColumns(modules[modalIdx].title)}
                          title={modules[modalIdx].title}
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
