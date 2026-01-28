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
    totalUnits:'',
    totalHolders:'',
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
      totalHolders:'',
      totalUnits: '',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setUnitFeesFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  type CreationChargeRow = {
    feeCode: string;
    description: string;
    percentage: number;
    amount: number;
  };
  type ChargeRow = {
    feeCode: string;
    description: string;
    percentage: number;
    amount: number;
  };
  
  const [creationChargesTable, setCreationChargesTable] = useState<CreationChargeRow[]>([
    { feeCode: 'FC001', description: 'Initial Setup Fee', percentage: 2.5, amount: 15000 },
    { feeCode: 'FC002', description: 'Admin Charges', percentage: 1.2, amount: 8000 },
  ]);
  const [redemptionChargesTable, setRedemptionChargesTable] = useState<ChargeRow[]>([
    { feeCode: 'RC001', description: 'Early Redemption Fee', percentage: 1.5, amount: 5000 },
    { feeCode: 'RC002', description: 'Processing Fee', percentage: 0.8, amount: 3000 },
  ]);
  
  // Fund data for dropdown table
  const fundData = [
    { code: 'F001', name: 'Equity Fund' },
    { code: 'F002', name: 'Bond Fund' },
    { code: 'F003', name: 'Mixed Fund' },
    { code: 'F004', name: 'Growth Fund' },
    { code: 'F005', name: 'Income Fund' },
  ];
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CreationChargeRow;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [redemptionSortConfig, setRedemptionSortConfig] = useState<{
    key: keyof ChargeRow;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const handleSort = (key: keyof CreationChargeRow) => {
    let direction: 'asc' | 'desc' = 'asc';
  
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
  
    setSortConfig({ key, direction });
  
    setCreationChargesTable(prev =>
      [...prev].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      })
    );
  };
  const cellStyle: React.CSSProperties = {
    padding: '6px 8px',
    border: '1px solid #e5e7eb',
  };
  
  const handleRedemptionSort = (key: keyof ChargeRow) => {
    let direction: 'asc' | 'desc' = 'asc';
  
    if (redemptionSortConfig?.key === key && redemptionSortConfig.direction === 'asc') {
      direction = 'desc';
    }
  
    setRedemptionSortConfig({ key, direction });
  
    setRedemptionChargesTable(prev =>
      [...prev].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      })
    );
  };
  
  const renderUnitFeesModal = () => {
    return (
      <>
        {/* Tab Navigation - Using Unit Holders Accounts Details style */}
        <div className="setup-input-section" style={{ marginTop: '0' }}>
          <div className="setup-ash-box" style={{ padding: '8px', width: '100%' }}>
            {/* Tab headers */}
            <div role="tablist" aria-label="Unit Fees Tabs" style={{ display: 'flex', flexWrap: 'nowrap', gap: '6px', marginBottom: '6px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {['Unit Price', 'Creation Charges', 'Redemption Charges'].map(tab => (
                <div
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  tabIndex={0}
                  onClick={() => setActiveTab(tab as 'Unit Price' | 'Creation Charges' | 'Redemption Charges')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(tab as 'Unit Price' | 'Creation Charges' | 'Redemption Charges'); }}
                  style={{
                    padding: '6px 10px',
                    background: activeTab === tab ? '#ffffff' : '#e2e8f0',
                    color: '#0f172a',
                    border: activeTab === tab ? '2px solid #0ea5e9' : '1px solid #cbd5e1',
                    borderBottom: activeTab === tab ? '2px solid #ffffff' : '1px solid #cbd5e1',
                    borderRadius: '6px 6px 0 0',
                    cursor: 'pointer',
                    fontWeight: 600,
                    minHeight: '28px',
                    lineHeight: 1.25,
                    fontSize: '11px',
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
              <div className="setup-ash-box" style={{ padding: '8px', marginBottom: '6px' }}>
                {/* Row 1: Fund and Price Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                  {/* Left Column: Fund */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '50%', flex: '1 1 50%' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px', fontSize: '12px' }}>Fund</label>
                    <div style={{ position: 'relative', flex: 1 }} data-table="fund">
                      <div
                        onClick={() => setShowFundTable(!showFundTable)}
                        style={{
                          padding: '6px 8px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          color: unitFeesFormData.fundName ? '#0f172a' : '#64748b',
                          minHeight: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '12px'
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '50%', flex: '1 1 50%' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px', fontSize: '12px' }}>Price Date</label>
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
              <div className="setup-action-buttons" style={{ marginBottom: '6px', marginTop: '4px', gap: '6px' }}>

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
                    totalUnits: '',
                    totalHolders: '',

                  });
                }}>
                  <span className="setup-btn-icon">🗑️</span>
                  Clear
                </button>
              </div>
{/* Modal Body */}
<div         
style={{
display: 'grid',
gridTemplateColumns: '2fr 2fr',
gap: '8px'
}}
>
  
    {/* BEFORE BROKERAGE */}
    <div
      style={{
        background: '#f8fafc',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        width: '100%'
      }}
    >
      <div
        style={{
          background: '#e2e8f0',
          color: '#0f172a',
          padding: '4px 8px',
          borderRadius: '4px',
          marginBottom: '8px',
          fontWeight: 600,
          fontSize: '11px'
        }}
      >
        Before Brokerage
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr',
          gap: '8px'
        }}
      >
        <div className="setup-input-group">
          <label className="setup-input-label" style={{ fontSize: '11px' }}>
            NAV
          </label>
          <input
            type="number"
            className="setup-input-field"
            value={unitFeesFormData.beforeBrokerageNAV}
            onChange={(e) =>
              handleInputChange('beforeBrokerageNAV', e.target.value)
            }
            style={{
              padding: '4px 6px',
              fontSize: '12px',
              minHeight: '28px'
            }}
          />
        </div>

        <div className="setup-input-group">
          <label className="setup-input-label" style={{ fontSize: '11px' }}>
            NAV Amount
          </label>
          <input
            type="number"
            step="0.01"
            className="setup-input-field"
            value={unitFeesFormData.beforeBrokerageNAVAmount}
            onChange={(e) =>
              handleInputChange('beforeBrokerageNAVAmount', e.target.value)
            }
            style={{
              padding: '4px 6px',
              fontSize: '12px',
              minHeight: '28px'
            }}
          />
        </div>
      </div>
    </div>

    {/* AFTER BROKERAGE */}
    <div
      style={{
        background: '#f8fafc',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        width: '100%'
      }}
    >
      <div
        style={{
          background: '#e2e8f0',
          color: '#0f172a',
          padding: '4px 8px',
          borderRadius: '4px',
          marginBottom: '8px',
          fontWeight: 600,
          fontSize: '11px'
        }}
      >
        After Brokerage
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr',
          gap: '8px'
        }}
      >
        <div className="setup-input-group">
          <label className="setup-input-label" style={{ fontSize: '11px' }}>
            NAV
          </label>
          <input
            type="number"
            className="setup-input-field"
            value={unitFeesFormData.afterBrokerageNAV}
            onChange={(e) =>
              handleInputChange('afterBrokerageNAV', e.target.value)
            }
            style={{
              padding: '4px 6px',
              fontSize: '12px',
              minHeight: '28px'
            }}
          />
        </div>

        <div className="setup-input-group">
          <label className="setup-input-label" style={{ fontSize: '11px' }}>
            NAV Amount
          </label>
          <input
            type="number"
            step="0.01"
            className="setup-input-field"
            value={unitFeesFormData.afterBrokerageNAVAmount}
            onChange={(e) =>
              handleInputChange('afterBrokerageNAVAmount', e.target.value)
            }
            style={{
              padding: '4px 6px',
              fontSize: '12px',
              minHeight: '28px'
            }}
          />
        </div>
      </div>
    </div>
  </div>
{/* WHT + Creation + Redeem +Fund Details- 4 Column Row */}
<div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '8px',
    width: '100%'
  }}
>
  {/* WHT Rate per Unit - LEFT */}
  <div
    style={{
      background: '#f8fafc',
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0'
    }}
  >
    <div
      style={{
        background: '#e2e8f0',
        color: '#0f172a',
        padding: '4px 8px',
        borderRadius: '4px',
        marginBottom: '6px',
        fontWeight: 'bold',
        fontSize: '11px'
      }}
    >
      WHT Rate per Unit
    </div>

    <div className="setup-input-group">
      <label className="setup-input-label" style={{ fontSize: '11px' }}>
        WHT
      </label>
      <input
        type="number"
        step="0.01"
        className="setup-input-field"
        value={unitFeesFormData.whtRate}
        onChange={(e) => handleInputChange('whtRate', e.target.value)}
        style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }}
      />
    </div>
  </div>

  {/* Creation Price - CENTER */}
  <div
    style={{
      background: '#f8fafc',
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0'
    }}
  >
    <div
      style={{
        background: '#e2e8f0',
        color: '#0f172a',
        padding: '4px 8px',
        borderRadius: '4px',
        marginBottom: '6px',
        fontWeight: 'bold',
        fontSize: '11px'
      }}
    >
      Creation Price
    </div>

    <div className="setup-input-group" style={{ marginBottom: '6px' }}>
      <label className="setup-input-label" style={{ fontSize: '11px' }}>
        Without Front End Fee
      </label>
      <input
        type="number"
        step="0.000001"
        className="setup-input-field"
        value={unitFeesFormData.creationPriceWithoutFee}
        onChange={(e) =>
          handleInputChange('creationPriceWithoutFee', e.target.value)
        }
        style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }}
      />
    </div>

    <div className="setup-input-group">
      <label className="setup-input-label" style={{ fontSize: '11px' }}>
        With Front End Fee
      </label>
      <input
        type="number"
        step="0.000001"
        className="setup-input-field"
        value={unitFeesFormData.creationPriceWithFee}
        onChange={(e) =>
          handleInputChange('creationPriceWithFee', e.target.value)
        }
        style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }}
      />
    </div>
  </div>

  {/* Redeem Price - RIGHT */}
  <div
    style={{
      background: '#f8fafc',
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0'
    }}
  >
    <div
      style={{
        background: '#e2e8f0',
        color: '#0f172a',
        padding: '4px 8px',
        borderRadius: '4px',
        marginBottom: '6px',
        fontWeight: 'bold',
        fontSize: '11px'
      }}
    >
      Redeem Price
    </div>

    <div className="setup-input-group" style={{ marginBottom: '6px' }}>
      <label className="setup-input-label" style={{ fontSize: '11px' }}>
        Without Exit Fee
      </label>
      <input
        type="number"
        step="0.000001"
        className="setup-input-field"
        value={unitFeesFormData.redeemPriceWithoutFee}
        onChange={(e) =>
          handleInputChange('redeemPriceWithoutFee', e.target.value)
        }
        style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }}
      />
    </div>

    <div className="setup-input-group">
      <label className="setup-input-label" style={{ fontSize: '11px' }}>
        With Exit Fee
      </label>
      <input
        type="number"
        step="0.000001"
        className="setup-input-field"
        value={unitFeesFormData.redeemPriceWithFee}
        onChange={(e) =>
          handleInputChange('redeemPriceWithFee', e.target.value)
        }
        style={{ padding: '4px 6px', fontSize: '12px', minHeight: '28px' }}
      />
    </div>    
  </div>
<div
  style={{
    background: '#f8fafc',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    gridColumn: '4 / 5',
    height: '100%'
  }}
>
  <div
    style={{
      background: '#e2e8f0',
      color: '#0f172a',
      padding: '4px 8px',
      borderRadius: '4px',
      marginBottom: '6px',
      fontWeight: 'bold',
      fontSize: '11px'
    }}
  >
    Fund Details
  </div>

  {/* Total No of Units */}
  <div className="setup-input-group" style={{ marginBottom: '6px' }}>
    <label className="setup-input-label" style={{ fontSize: '11px' }}>
      Total No of Units
    </label>
    <input
      type="number"
      className="setup-input-field"
      value={unitFeesFormData.totalUnits}
      onChange={(e) =>
        handleInputChange('totalUnits', e.target.value)
      }
      style={{
        padding: '4px 6px',
        fontSize: '12px',
        minHeight: '28px'
      }}
    />
  </div>

  {/* Total No of Holders */}
  <div className="setup-input-group">
    <label className="setup-input-label" style={{ fontSize: '11px' }}>
      Total No of Holders
    </label>
    <input
      type="number"
      className="setup-input-field"
      value={unitFeesFormData.totalHolders}
      onChange={(e) =>
        handleInputChange('totalHolders', e.target.value)
      }
      style={{
        padding: '4px 6px',
        fontSize: '12px',
        minHeight: '28px'
      }}
    />
  </div>
</div>


</div>
            </>
          )}

{activeTab === 'Creation Charges' && (
  <div style={{ overflowX: 'auto' }}>
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '12px',
        color: '#000000',
      }}
    >
      <thead>
        <tr style={{ background: '#f3f4f6' }}>
          {['feeCode', 'description', 'percentage', 'amount'].map(col => (
            <th
              key={col}
              onClick={() => handleSort(col as keyof CreationChargeRow)}
              style={{
                padding: '8px',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 600,
              }}
            >
              {col === 'feeCode' && 'Fee Code'}
              {col === 'description' && 'Description'}
              {col === 'percentage' && 'Percentage (%)'}
              {col === 'amount' && 'Amount'}
              {sortConfig?.key === col && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {creationChargesTable.map((row, index) => (
          <tr key={index}>
            <td style={cellStyle}>{row.feeCode}</td>
            <td style={cellStyle}>{row.description}</td>
            <td style={cellStyle}>{row.percentage}</td>
            <td style={cellStyle}>{row.amount.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{activeTab === 'Redemption Charges' && (
  <div style={{ overflowX: 'auto', color: '#000000' }}>
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '12px',
      }}
    >
      <thead>
        <tr style={{ background: '#f3f4f6' }}>
          {['feeCode', 'description', 'percentage', 'amount'].map(col => (
            <th
              key={col}
              onClick={() => handleRedemptionSort(col as keyof ChargeRow)}
              style={{
                padding: '8px',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 600,
              }}
            >
              {col === 'feeCode' && 'Fee Code'}
              {col === 'description' && 'Description'}
              {col === 'percentage' && 'Percentage (%)'}
              {col === 'amount' && 'Amount'}
              {redemptionSortConfig?.key === col &&
                (redemptionSortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {redemptionChargesTable.map((row, index) => (
          <tr key={index}>
            <td style={cellStyle}>{row.feeCode}</td>
            <td style={cellStyle}>{row.description}</td>
            <td style={cellStyle}>{row.percentage}</td>
            <td style={cellStyle}>{row.amount.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

            </div>

            {/* Button Palette - For Creation Charges and Redemption Charges tabs */}
            {activeTab !== 'Unit Price' && (
              <div className="setup-action-buttons" style={{ marginTop: '6px', gap: '6px' }}>
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
                  totalHolders: '',
                  totalUnits: '',
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
                  <div className="setup-modal-content" style={{ overflow: 'auto', padding: '8px' }}>
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

