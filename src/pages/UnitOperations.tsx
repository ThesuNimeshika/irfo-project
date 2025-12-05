import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ========================================
// STATIC DATA AND CONFIGURATION
// ========================================

// 23 Unit Operations cards (as specified)
const moduleData = [
  { title: 'Unit Fees', icon: '💳' },
  { title: 'Unit Creation', icon: '✨' },
  { title: 'Unit Redemption', icon: '💸' },
  { title: 'Unit Transfer', icon: '🔄' },
  { title: 'Unit Consolidation', icon: '🔗' },
  { title: 'Unit Switching', icon: '🔄' },
  { title: 'Unit Blocking', icon: '🚫' },
  { title: 'Dividend Issues', icon: '💰' },
  { title: 'Redemption Cheque Printing', icon: '🧾' },
  { title: 'Cheque Re Printing', icon: '🖨️' },
  { title: 'Web Data Downloading', icon: '⬇️' },
  { title: 'Standing Instructions', icon: '📋' },
  { title: 'Standing Instructions Processing', icon: '⚙️' },
  { title: 'Bank Slip Transfer', icon: '🏦' },
  { title: 'Reminders', icon: '🔔' },
  { title: 'Unit Transfer - Suspense Account', icon: '📊' },
  { title: 'Change Agent for Transaction', icon: '👤' },
  { title: 'Acknowledgement Printing', icon: '📄' },
  { title: 'Fund Price E-statement', icon: '📈' },
  { title: 'Upload and Download Data Web-Automated', icon: '🌐' },
  { title: 'WHT Per Unit Entry', icon: '📝' },
  { title: 'Data Upload', icon: '📤' },
  { title: 'Transaction Upload', icon: '📥' },
];

const modules = moduleData.map(m => ({
  title: m.title,
  icon: m.icon,
}));

// ========================================
// MAIN UNIT OPERATIONS COMPONENT
// ========================================

function UnitOperations() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Unit Fees modal state
  const [activeTab, setActiveTab] = useState<'Unit Price' | 'Creation Charges' | 'Redemption Charges'>('Unit Price');
  const [showFundTable, setShowFundTable] = useState(false);
  const [priceDate, setPriceDate] = useState<Date | null>(null);
  const [unitFeesFormData, setUnitFeesFormData] = useState({
    fund: '',
    fundCode: '',
    fundName: '',
    beforeBrokerageNAV: '',
    beforeBrokerageNAVAmount: '0.00',
    afterBrokerageNAV: '',
    afterBrokerageNAVAmount: '0.00',
    whtRate: '0.00',
    creationPriceWithoutFee: '0.000000',
    creationPriceWithFee: '0.000000',
    redeemPriceWithoutFee: '0.000000',
    redeemPriceWithFee: '0.000000',
    fundDetails: '',
    creationCharges: '',
    redemptionCharges: '',
  });

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle click outside to close fund dropdown table
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showFundTable && !target.closest('[data-table="fund"]')) {
        setShowFundTable(false);
      }
    };

    if (showFundTable) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFundTable]);

  // ========================================
  // HANDLERS
  // ========================================

  const handleModalOpen = (idx: number) => {
    setModalIdx(idx);
  };

  const handleModalClose = () => {
    setModalIdx(null);
    setActiveTab('Unit Price');
    setPriceDate(null);
    setUnitFeesFormData({
      fund: '',
      fundCode: '',
      fundName: '',
      beforeBrokerageNAV: '',
      beforeBrokerageNAVAmount: '0.00',
      afterBrokerageNAV: '',
      afterBrokerageNAVAmount: '0.00',
      whtRate: '0.00',
      creationPriceWithoutFee: '0.000000',
      creationPriceWithFee: '0.000000',
      redeemPriceWithoutFee: '0.000000',
      redeemPriceWithFee: '0.000000',
      fundDetails: '',
      creationCharges: '',
      redemptionCharges: '',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setUnitFeesFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fund data for dropdown table
  const fundData = [
    { code: 'F001', name: 'Equity Fund' },
    { code: 'F002', name: 'Bond Fund' },
    { code: 'F003', name: 'Mixed Fund' },
    { code: 'F004', name: 'Growth Fund' },
    { code: 'F005', name: 'Income Fund' },
  ];

  const renderUnitFeesModal = () => {
    return (
      <>
        {/* Tab Navigation - Using Unit Holders Accounts Details style */}
        <div className="setup-input-section" style={{ marginTop: '0' }}>
          <div className="setup-ash-box" style={{ padding: '16px', width: '100%' }}>
            {/* Tab headers */}
            <div role="tablist" aria-label="Unit Fees Tabs" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', marginBottom: '12px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {['Unit Price', 'Creation Charges', 'Redemption Charges'].map(tab => (
                <div
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  tabIndex={0}
                  onClick={() => setActiveTab(tab as 'Unit Price' | 'Creation Charges' | 'Redemption Charges')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(tab as 'Unit Price' | 'Creation Charges' | 'Redemption Charges'); }}
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

            {/* Tab content */}
            <div>
          {activeTab === 'Unit Price' && (
            <>
              {/* Top Card: Fund and Price Date */}
              <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '12px' }}>
                {/* Row 1: Fund and Price Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                  {/* Left Column: Fund */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%', flex: '1 1 50%' }}>
                    <label className="setup-input-label" style={{ minWidth: '140px' }}>Fund</label>
                    <div style={{ position: 'relative', flex: 1 }} data-table="fund">
                      <div
                        onClick={() => setShowFundTable(!showFundTable)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          color: unitFeesFormData.fundName ? '#0f172a' : '#64748b',
                          minHeight: '38px',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px'
                        }}
                      >
                        {unitFeesFormData.fundName || 'Select fund'}
                      </div>
                      {showFundTable && (
                        <div
                          data-table="fund"
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
                            overflowY: 'auto',
                            minWidth: '400px'
                          }}
                        >
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #cbd5e1', color: '#000000' }}>Code</th>
                                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#000000' }}>Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fundData.map((fund, i) => (
                                <tr
                                  key={i}
                                  onClick={() => {
                                    setUnitFeesFormData(prev => ({
                                      ...prev,
                                      fund: fund.code,
                                      fundCode: fund.code,
                                      fundName: fund.name,
                                    }));
                                    setShowFundTable(false);
                                  }}
                                  style={{
                                    cursor: 'pointer',
                                    backgroundColor: unitFeesFormData.fundCode === fund.code ? '#f3e8ff' : '#ffffff'
                                  }}
                                  onMouseEnter={e => {
                                    if (unitFeesFormData.fundCode !== fund.code) e.currentTarget.style.backgroundColor = '#f8fafc';
                                  }}
                                  onMouseLeave={e => {
                                    if (unitFeesFormData.fundCode !== fund.code) e.currentTarget.style.backgroundColor = '#ffffff';
                                  }}
                                >
                                  <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#000000' }}>{fund.code}</td>
                                  <td style={{ padding: '8px 12px', color: '#000000' }}>{fund.name}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Right Column: Price Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%', flex: '1 1 50%' }}>
                    <label className="setup-input-label" style={{ minWidth: '140px' }}>Price Date</label>
                    <div style={{ position: 'relative', flex: 1 }}>
                    <DatePicker
                      selected={priceDate}
                      onChange={(date: Date | null) => setPriceDate(date)}
                      dateFormat="dd/MMM/yyyy"
                      className="date-picker-input"
                      placeholderText="Select date"
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                    />
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Palette - Between top and bottom cards for Unit Price tab */}
              <div className="setup-action-buttons" style={{ marginBottom: '12px' }}>
                <button className="setup-btn setup-btn-new" onClick={() => handleModalClose()}>
                  <span className="setup-btn-icon">+</span>
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
                <button className="setup-btn setup-btn-clear" onClick={() => {
                  setPriceDate(null);
                  setUnitFeesFormData({
                    fund: '',
                    fundCode: '',
                    fundName: '',
                    beforeBrokerageNAV: '',
                    beforeBrokerageNAVAmount: '0.00',
                    afterBrokerageNAV: '',
                    afterBrokerageNAVAmount: '0.00',
                    whtRate: '0.00',
                    creationPriceWithoutFee: '0.000000',
                    creationPriceWithFee: '0.000000',
                    redeemPriceWithoutFee: '0.000000',
                    redeemPriceWithFee: '0.000000',
                    fundDetails: '',
                    creationCharges: '',
                    redemptionCharges: '',
                  });
                }}>
                  <span className="setup-btn-icon">🗑️</span>
                  Clear
                </button>
              </div>

              {/* Bottom Card: All other content */}
              {/* Before Brokerage */}
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  marginBottom: '12px'
                }}>
                  <div style={{ 
                    background: '#3b82f6', 
                    color: 'white', 
                    padding: '8px 12px', 
                    borderRadius: '4px',
                    marginBottom: '12px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Before Brokerage
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="setup-input-group">
                      <label className="setup-input-label">NAV</label>
                      <input
                        type="number"
                        className="setup-input-field"
                        value={unitFeesFormData.beforeBrokerageNAV}
                        onChange={(e) => handleInputChange('beforeBrokerageNAV', e.target.value)}
                      />
                    </div>
                    <div className="setup-input-group">
                      <label className="setup-input-label">NAV Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        className="setup-input-field"
                        value={unitFeesFormData.beforeBrokerageNAVAmount}
                        onChange={(e) => handleInputChange('beforeBrokerageNAVAmount', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* After Brokerage */}
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  marginBottom: '12px'
                }}>
                  <div style={{ 
                    background: '#3b82f6', 
                    color: 'white', 
                    padding: '8px 12px', 
                    borderRadius: '4px',
                    marginBottom: '12px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    After Brokerage
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="setup-input-group">
                      <label className="setup-input-label">NAV</label>
                      <input
                        type="number"
                        className="setup-input-field"
                        value={unitFeesFormData.afterBrokerageNAV}
                        onChange={(e) => handleInputChange('afterBrokerageNAV', e.target.value)}
                      />
                    </div>
                    <div className="setup-input-group">
                      <label className="setup-input-label">NAV Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        className="setup-input-field"
                        value={unitFeesFormData.afterBrokerageNAVAmount}
                        onChange={(e) => handleInputChange('afterBrokerageNAVAmount', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* WHT Rate per Unit */}
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  marginBottom: '12px'
                }}>
                  <div style={{ 
                    background: '#3b82f6', 
                    color: 'white', 
                    padding: '8px 12px', 
                    borderRadius: '4px',
                    marginBottom: '12px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    WHT Rate per Unit
                  </div>
                  <div className="setup-input-group">
                    <label className="setup-input-label">WHT</label>
                    <input
                      type="number"
                      step="0.01"
                      className="setup-input-field"
                      value={unitFeesFormData.whtRate}
                      onChange={(e) => handleInputChange('whtRate', e.target.value)}
                    />
                  </div>
                </div>

                {/* Creation Price and Redeem Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                  {/* Creation Price */}
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0' 
                  }}>
                    <div style={{ 
                      background: '#3b82f6', 
                      color: 'white', 
                      padding: '8px 12px', 
                      borderRadius: '4px',
                      marginBottom: '12px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      Creation Price
                    </div>
                    <div className="setup-input-group" style={{ marginBottom: '12px' }}>
                      <label className="setup-input-label">Without Front End Fee</label>
                      <input
                        type="number"
                        step="0.000001"
                        className="setup-input-field"
                        value={unitFeesFormData.creationPriceWithoutFee}
                        onChange={(e) => handleInputChange('creationPriceWithoutFee', e.target.value)}
                      />
                    </div>
                    <div className="setup-input-group">
                      <label className="setup-input-label">With Front End Fee</label>
                      <input
                        type="number"
                        step="0.000001"
                        className="setup-input-field"
                        value={unitFeesFormData.creationPriceWithFee}
                        onChange={(e) => handleInputChange('creationPriceWithFee', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Redeem Price */}
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0' 
                  }}>
                    <div style={{ 
                      background: '#3b82f6', 
                      color: 'white', 
                      padding: '8px 12px', 
                      borderRadius: '4px',
                      marginBottom: '12px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      Redeem Price
                    </div>
                    <div className="setup-input-group" style={{ marginBottom: '12px' }}>
                      <label className="setup-input-label">Without Exit Fee</label>
                      <input
                        type="number"
                        step="0.000001"
                        className="setup-input-field"
                        value={unitFeesFormData.redeemPriceWithoutFee}
                        onChange={(e) => handleInputChange('redeemPriceWithoutFee', e.target.value)}
                      />
                    </div>
                    <div className="setup-input-group">
                      <label className="setup-input-label">With Exit Fee</label>
                      <input
                        type="number"
                        step="0.000001"
                        className="setup-input-field"
                        value={unitFeesFormData.redeemPriceWithFee}
                        onChange={(e) => handleInputChange('redeemPriceWithFee', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Fund Details */}
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0' 
                }}>
                  <div style={{ 
                    background: '#3b82f6', 
                    color: 'white', 
                    padding: '8px 12px', 
                    borderRadius: '4px',
                    marginBottom: '12px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Fund Details
                  </div>
                  <div className="setup-input-group">
                    <textarea
                      className="setup-input-field"
                      rows={4}
                      value={unitFeesFormData.fundDetails}
                      onChange={(e) => handleInputChange('fundDetails', e.target.value)}
                      placeholder="Enter fund details..."
                      style={{ width: '100%', resize: 'vertical' }}
                    />
                  </div>
                </div>
            </>
          )}

          {activeTab === 'Creation Charges' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#000000' }}>
              <div className="setup-input-group">
                <textarea
                  className="setup-input-field"
                  rows={15}
                  value={unitFeesFormData.creationCharges}
                  onChange={(e) => handleInputChange('creationCharges', e.target.value)}
                  placeholder="Enter creation charges details..."
                  style={{ width: '100%', resize: 'vertical', minHeight: '400px', color: '#000000' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'Redemption Charges' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#000000' }}>
              <div className="setup-input-group">
                <textarea
                  className="setup-input-field"
                  rows={15}
                  value={unitFeesFormData.redemptionCharges}
                  onChange={(e) => handleInputChange('redemptionCharges', e.target.value)}
                  placeholder="Enter redemption charges details..."
                  style={{ width: '100%', resize: 'vertical', minHeight: '400px', color: '#000000' }}
                />
              </div>
            </div>
          )}
            </div>

            {/* Button Palette - For Creation Charges and Redemption Charges tabs */}
            {activeTab !== 'Unit Price' && (
              <div className="setup-action-buttons" style={{ marginTop: '12px' }}>
              <button className="setup-btn setup-btn-new" onClick={() => handleModalClose()}>
                <span className="setup-btn-icon">+</span>
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
              <button className="setup-btn setup-btn-clear" onClick={() => {
                setPriceDate(null);
                setUnitFeesFormData({
                  fund: '',
                  fundCode: '',
                  fundName: '',
                  beforeBrokerageNAV: '',
                  beforeBrokerageNAVAmount: '0.00',
                  afterBrokerageNAV: '',
                  afterBrokerageNAVAmount: '0.00',
                  whtRate: '0.00',
                  creationPriceWithoutFee: '0.000000',
                  creationPriceWithFee: '0.000000',
                  redeemPriceWithoutFee: '0.000000',
                  redeemPriceWithFee: '0.000000',
                  fundDetails: '',
                  creationCharges: '',
                  redemptionCharges: '',
                });
              }}>
                <span className="setup-btn-icon">🗑️</span>
                Clear
              </button>
              </div>
            )}
          </div>
        </div>

      </>
    );
  };

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
            {/* Unit Operations Cards Grid */}
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
                onClick={handleModalClose}
              >
                <div className={`setup-modal-container ${isMobile ? 'mobile' : ''}`}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="setup-modal-header">
                    <div className="setup-modal-header-content">
                      <span className="setup-modal-header-icon">{modules[modalIdx].icon}</span>
                      <span className="setup-modal-header-title">{modules[modalIdx].title}</span>
                    </div>
                    <button
                      onClick={handleModalClose}
                      className="setup-modal-close-btn"
                      aria-label="Close modal"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="setup-modal-content">
                    {modalIdx === 0 && modules[modalIdx].title === 'Unit Fees' ? (
                      renderUnitFeesModal()
                    ) : (
                      <div className="empty-content">
                        <p>Content for {modules[modalIdx].title} will be implemented here.</p>
                        <p>This is a placeholder modal.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  {!(modalIdx === 0 && modules[modalIdx].title === 'Unit Fees') && (
                    <div className="setup-modal-footer">
                      <p>Unit Operations Module</p>
                    </div>
                  )}
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

export default UnitOperations;

