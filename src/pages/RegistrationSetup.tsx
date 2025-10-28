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

// ========================================
// TYPE DEFINITIONS
// ========================================

  interface FormData {
  // Join Sale Agent Details fields
  bankCode: string;
  description: string;
  address: string;
  district: string;
  swiftCode: string;
  branchNo: string;
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

// Sample table data for the four modules
const tableData = {
  Dashboard: [
    { id: '1', name: 'Performance Metrics', type: 'Widget', status: 'Active' },
    { id: '2', name: 'Revenue Chart', type: 'Chart', status: 'Active' },
  ],
  Reports: [
    { id: 'R1', name: 'Monthly Sales', type: 'PDF', status: 'Generated' },
    { id: 'R2', name: 'User Activity', type: 'Excel', status: 'Pending' },
  ],
  Users: [
    { id: 'U1', name: 'John Doe', role: 'Admin', status: 'Active' },
    { id: 'U2', name: 'Jane Smith', role: 'User', status: 'Inactive' },
  ],
  Settings: [
    { id: 'S1', name: 'System Preferences', category: 'General', status: 'Configured' },
    { id: 'S2', name: 'Email Settings', category: 'Notifications', status: 'Pending' },
  ],
};

const modules = moduleData.map(m => ({
  title: m.title,
  icon: m.icon,

}));

// ========================================
// CUSTOM COMPONENTS (Reused from Setup)
// ========================================

// Custom DataTable Component (same as in Setup.tsx)
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
        header: column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1').trim(),
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
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="setup-table-search"
          />
          <select
            value={pagination.pageSize}
            onChange={e => {
              const newPageSize = Number(e.target.value);
              setPagination(prev => ({
                ...prev,
                pageSize: newPageSize,
                pageIndex: 0,
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
  });

  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFormEditable, setIsFormEditable] = useState(false);

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

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  const getTableColumns = (title: string) => {
    const data = tableData[title as keyof typeof tableData] || [];
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const getTableData = (title: string) => {
    return tableData[title as keyof typeof tableData] || [];
  };

  // ========================================
  // MODAL CONTENT RENDERER
  // ========================================

  const renderModalContent = () => {
    if (modalIdx === null) return null;

    return (
      <div className="setup-input-section">
        <div className={`setup-input-grid ${isMobile ? 'mobile' : ''}`}>
          {/* Join Sale Agent Details Form Fields */}
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
          
          <div className="setup-input-group">
            <label className="setup-input-label">Address (No/Street/Town/City)</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isFormEditable}
              className="setup-input-field"
              placeholder="Enter address as: No, Street Name, Town, City"
              rows={3}
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
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Kalutara">Kalutara</option>
              <option value="Kandy">Kandy</option>
              <option value="Matale">Matale</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
            </select>
          </div>
          
          <div className="setup-input-group">
            <label className="setup-input-label">Swift Code</label>
            <input
              type="text"
              value={formData.swiftCode}
              onChange={(e) => handleInputChange('swiftCode', e.target.value)}
              disabled={true}
              className="setup-input-field"
              placeholder="Read only field"
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
        </div>
      </div>
    );
  };

  // ========================================
  // TABLE CONTENT RENDERER
  // ========================================

  const renderTableContent = () => {
    if (modalIdx === null) return null;

    const modalTitle = modules[modalIdx].title;
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
                          bankCode: '', description: '', address: '', district: '', swiftCode: 'SBLILKLX', branchNo: ''
                        })}
                        className="setup-btn setup-btn-clear"
                        disabled={!isFormEditable}
                      >
                        <span className="setup-btn-icon">🗑️</span>
                        Clear
                      </button>
                    </div>

                    {/* Table Section */}
                    <div className="setup-data-table-container">
                      <div className="setup-data-table-content">
                        {renderTableContent()}
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