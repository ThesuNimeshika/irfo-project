import { useState } from 'react';
import { createPortal } from 'react-dom';
import '../Setup.css';

interface SearchResult {
  accountNo?: string;
  holderName?: string;
  holderId?: string;
  nic?: string;
  passport?: string;
  otherNo?: string;
  fund?: string;
  [key: string]: any;
}

interface AccountSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (result: SearchResult) => void;
  title?: string;
  onSearch?: (criteria: Record<string, string>) => Promise<SearchResult[]>;
  onGet?: (result: SearchResult) => void;
}

const AccountSearchModal: React.FC<AccountSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Search Account',
  onSearch,
  onGet,
}) => {
  // State management
  const [searchCriteria, setSearchCriteria] = useState<Record<string, string>>({});
  const [ignoreCase, setIgnoreCase] = useState<boolean>(true);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Please Wait..................');
  
  // Dropdown data
  const titleOptions = ['Mr', 'Miss', 'Mrs', 'Dr'];
  const streetOptions = ['Main Street', 'Park Avenue', 'Ocean Drive', 'First Street', 'Second Street'];
  const townOptions = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'];
  const cityOptions = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'];
  const fundOptions = ['Equity Fund', 'Bond Fund', 'Mixed Fund', 'Growth Fund', 'Income Fund'];

  const handleInputChange = (field: string, value: string) => {
    setSearchCriteria((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGet = () => {
    if (selectedResult && onGet) {
      onGet(selectedResult);
    } else if (selectedResult && onSelect) {
      onSelect(selectedResult);
    }
    onClose();
  };

  const handleSearch = async () => {
    setStatusMessage('Searching...');
    
    try {
      if (onSearch) {
        const searchResults = await onSearch(searchCriteria);
        setResults(searchResults);
        setStatusMessage('Search completed');
      } else {
        // Mock data for demonstration
        const mockResults: SearchResult[] = Array.from({ length: 10 }).map((_, idx) => ({
          accountNo: `ACC${String(idx + 1).padStart(4, '0')}`,
          holderName: `Holder ${idx + 1}`,
          holderId: `H${String(idx + 1).padStart(4, '0')}`,
          nic: `NIC${idx + 1}`,
          passport: `P${idx + 1}`,
          otherNo: `O${idx + 1}`,
          fund: fundOptions[idx % fundOptions.length],
        }));
        setResults(mockResults);
        setStatusMessage('Search completed');
      }
    } catch (error) {
      setStatusMessage('Search failed');
      console.error('Search error:', error);
    }
  };

  const handleRowDoubleClick = (result: SearchResult) => {
    setSelectedResult(result);
    if (onSelect) {
      onSelect(result);
      onClose();
    }
  };

  const handleRowClick = (result: SearchResult) => {
    setSelectedResult(result);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="setup-modal-overlay" onClick={onClose}>
      <div
        className="setup-modal-container"
        style={{ width: '90vw', maxWidth: '1000px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="setup-modal-header">
          <div className="setup-modal-header-content">
            <span className="setup-modal-header-icon">🔍</span>
            <span className="setup-modal-header-title">{title}</span>
          </div>
          <button onClick={onClose} className="setup-modal-close-btn">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="setup-modal-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Top Section: Search Criteria */}
          <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '33.33% 33.33% 33.33%', gap: '16px', width: '100%' }}>
              {/* Row 1, Column 1: Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  Name:
                </label>
                <input
                  type="text"
                  value={searchCriteria.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="setup-input-field"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                />
              </div>
              {/* Row 1, Column 2: Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  Title:
                </label>
                <select
                  value={searchCriteria.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="setup-dropdown-select"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                >
                  <option value="">Select title</option>
                  {titleOptions.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              {/* Row 1, Column 3: Initials */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  Initials:
                </label>
                <input
                  type="text"
                  value={searchCriteria.initials || ''}
                  onChange={(e) => handleInputChange('initials', e.target.value)}
                  className="setup-input-field"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                />
              </div>
              {/* Row 2, Column 1: Surname */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  Surname:
                </label>
                <input
                  type="text"
                  value={searchCriteria.surname || ''}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  className="setup-input-field"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                />
              </div>
              {/* Row 2, Column 2: First Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  First Name:
                </label>
                <input
                  type="text"
                  value={searchCriteria.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="setup-input-field"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                />
              </div>
              {/* Row 2, Column 3: Street */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  Street:
                </label>
                <select
                  value={searchCriteria.street || ''}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className="setup-dropdown-select"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                >
                  <option value="">Select street</option>
                  {streetOptions.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              {/* Row 3, Column 1: Town */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  Town:
                </label>
                <select
                  value={searchCriteria.town || ''}
                  onChange={(e) => handleInputChange('town', e.target.value)}
                  className="setup-dropdown-select"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                >
                  <option value="">Select town</option>
                  {townOptions.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              {/* Row 3, Column 2: City */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  City:
                </label>
                <select
                  value={searchCriteria.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="setup-dropdown-select"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                >
                  <option value="">Select city</option>
                  {cityOptions.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              {/* Row 3, Column 3: Holder ID */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  Holder ID:
                </label>
                <input
                  type="text"
                  value={searchCriteria.holderId || ''}
                  onChange={(e) => handleInputChange('holderId', e.target.value)}
                  className="setup-input-field"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                />
              </div>
              {/* Row 4, Column 1: NIC */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  NIC:
                </label>
                <input
                  type="text"
                  value={searchCriteria.nic || ''}
                  onChange={(e) => handleInputChange('nic', e.target.value)}
                  className="setup-input-field"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                />
              </div>
              {/* Row 4, Column 2: Passport */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  Passport:
                </label>
                <input
                  type="text"
                  value={searchCriteria.passport || ''}
                  onChange={(e) => handleInputChange('passport', e.target.value)}
                  className="setup-input-field"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                />
              </div>
              {/* Row 4, Column 3: Other No */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  Other No:
                </label>
                <input
                  type="text"
                  value={searchCriteria.otherNo || ''}
                  onChange={(e) => handleInputChange('otherNo', e.target.value)}
                  className="setup-input-field"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                />
              </div>
              {/* Row 5, Column 1: Fund */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label className="setup-input-label" style={{ minWidth: '80px', color: '#000000', fontWeight: 600 }}>
                  Fund:
                </label>
                <select
                  value={searchCriteria.fund || ''}
                  onChange={(e) => handleInputChange('fund', e.target.value)}
                  className="setup-dropdown-select"
                  style={{ color: '#000000', flex: 1, minWidth: '120px' }}
                >
                  <option value="">Select fund</option>
                  {fundOptions.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              {/* Row 5, Columns 2-3: Empty */}
              <div style={{ width: '100%' }}></div>
              <div style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Middle Section: Control Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
            <button
              onClick={handleGet}
              className="setup-btn"
              style={{
                backgroundColor: '#60a5fa',
                color: '#ffffff',
                padding: '6px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <span style={{ marginRight: '6px' }}>🔍</span>
              Get
            </button>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '16px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                style={{ accentColor: '#3b82f6' }}
              />
              <span style={{ color: '#000000' }}>ignore Case</span>
            </label>

            <button
              onClick={handleSearch}
              className="setup-btn"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '6px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              <span style={{ marginRight: '6px' }}>🔍</span>
              Search
            </button>

            <button
              onClick={onClose}
              className="setup-btn"
              style={{
                backgroundColor: '#60a5fa',
                color: '#ffffff',
                padding: '6px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>

          {/* Bottom Section: Results Display */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Results Grid */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                minHeight: '300px',
                maxHeight: '400px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {results.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Account No</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Holder Name</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Holder ID</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>NIC</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Passport</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Other No</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Fund</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, idx) => (
                      <tr
                        key={idx}
                        onClick={() => handleRowClick(result)}
                        onDoubleClick={() => handleRowDoubleClick(result)}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          backgroundColor: selectedResult === result ? '#e0e7ff' : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedResult !== result) {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedResult !== result) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <td style={{ padding: '8px', color: '#000000' }}>{result.accountNo || '-'}</td>
                        <td style={{ padding: '8px', color: '#000000' }}>{result.holderName || '-'}</td>
                        <td style={{ padding: '8px', color: '#000000' }}>{result.holderId || '-'}</td>
                        <td style={{ padding: '8px', color: '#000000' }}>{result.nic || '-'}</td>
                        <td style={{ padding: '8px', color: '#000000' }}>{result.passport || '-'}</td>
                        <td style={{ padding: '8px', color: '#000000' }}>{result.otherNo || '-'}</td>
                        <td style={{ padding: '8px', color: '#000000' }}>{result.fund || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '16px' }}>
                  {Array.from({ length: 15 }).map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        height: '24px',
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div style={{ padding: '4px 0' }}>
              <span style={{ color: '#2563eb', fontSize: '14px' }}>
                Double click or press [Get] button to get the selected value
              </span>
            </div>

            {/* Status Bar */}
            <div
              style={{
                backgroundColor: '#e5e7eb',
                padding: '6px 12px',
                textAlign: 'center',
                color: '#000000',
                fontSize: '14px',
                borderRadius: '4px',
              }}
            >
              {statusMessage}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AccountSearchModal;

