import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../Setup.css';

interface SearchResult {
  holderName?: string;
  holderId?: string;
  nic?: string;
  passport?: string;
  otherNo?: string;
  [key: string]: any;
}

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (result: SearchResult) => void;
  title?: string;
  searchFields?: {
    leftColumn?: Array<{
      label: string;
      field: string;
      hasDropdown?: boolean;
    }>;
    rightColumn?: Array<{
      label: string;
      field: string;
    }>;
  };
  onSearch?: (criteria: Record<string, string>) => Promise<SearchResult[]>;
  onGet?: (result: SearchResult) => void;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Search',
  searchFields,
  onSearch,
  onGet,
}) => {
  // Default search fields matching the image
  const defaultSearchFields = {
    leftColumn: [
      { label: 'Name', field: 'name' },
      { label: 'Title', field: 'title', hasDropdown: true },
      { label: 'Initials', field: 'initials' },
      { label: 'First Name', field: 'firstName' },
      { label: 'Surname', field: 'surname' },
      { label: 'Street', field: 'street', hasDropdown: true },
      { label: 'Town', field: 'town', hasDropdown: true },
      { label: 'City', field: 'city', hasDropdown: true },
    ],
    rightColumn: [
      { label: 'Holder ID', field: 'holderId' },
      { label: 'NIC', field: 'nic' },
      { label: 'Passport', field: 'passport' },
      { label: 'Other No', field: 'otherNo' },
    ],
  };

  const fields = searchFields || defaultSearchFields;

  // State management
  const [searchCriteria, setSearchCriteria] = useState<Record<string, string>>({});
  const [orderBy, setOrderBy] = useState<'Holder Name' | 'Holder ID'>('Holder Name');
  const [ignoreCase, setIgnoreCase] = useState<boolean>(true);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Please Wait..................');
  
  // Dropdown data
  const titleOptions = ['Mr', 'Miss', 'Mrs', 'Dr'];
  
  const streetOptions = ['Main Street', 'Park Avenue', 'Ocean Drive', 'First Street', 'Second Street'];
  
  const townOptions = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'];
  
  const cityOptions = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'];

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
    setIsLoading(true);
    setStatusMessage('Searching...');
    
    try {
      if (onSearch) {
        const searchResults = await onSearch(searchCriteria);
        setResults(searchResults);
        setStatusMessage('Search completed');
      } else {
        // Mock data for demonstration
        const mockResults: SearchResult[] = Array.from({ length: 10 }).map((_, idx) => ({
          holderName: `Holder ${idx + 1}`,
          holderId: `H${String(idx + 1).padStart(4, '0')}`,
          nic: `NIC${idx + 1}`,
          passport: `P${idx + 1}`,
          otherNo: `O${idx + 1}`,
        }));
        setResults(mockResults);
        setStatusMessage('Search completed');
      }
    } catch (error) {
      setStatusMessage('Search failed');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fields.leftColumn?.map((field, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px', color: '#000000', fontWeight: 600 }}>
                      {field.label}:
                    </label>
                    {field.hasDropdown ? (
                      <select
                        value={searchCriteria[field.field] || ''}
                        onChange={(e) => handleInputChange(field.field, e.target.value)}
                        className="setup-dropdown-select"
                        style={{ color: '#000000', flex: 1 }}
                      >
                        <option value="">Select {field.label.toLowerCase()}</option>
                        {(field.field === 'title' ? titleOptions :
                          field.field === 'street' ? streetOptions :
                          field.field === 'town' ? townOptions : cityOptions).map((option, i) => (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={searchCriteria[field.field] || ''}
                        onChange={(e) => handleInputChange(field.field, e.target.value)}
                        className="setup-input-field"
                        style={{ color: '#000000', flex: 1 }}
                      />
                    )}
                    {field.label === 'Title' && (
                      <>
                        <label className="setup-input-label" style={{ minWidth: '60px', color: '#000000', fontWeight: 600, marginLeft: '8px' }}>
                          Initials:
                        </label>
                        <input
                          type="text"
                          value={searchCriteria.initials || ''}
                          onChange={(e) => handleInputChange('initials', e.target.value)}
                          className="setup-input-field"
                          style={{ color: '#000000', width: '120px' }}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fields.rightColumn?.map((field, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="setup-input-label" style={{ minWidth: '100px', color: '#000000', fontWeight: 600 }}>
                      {field.label}:
                    </label>
                    <input
                      type="text"
                      value={searchCriteria[field.field] || ''}
                      onChange={(e) => handleInputChange(field.field, e.target.value)}
                      className="setup-input-field"
                      style={{ color: '#000000', flex: 1 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section: Control Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
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
              onClick={handleGet}
              className="setup-btn"
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '6px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Get
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
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Holder Name</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Holder ID</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>NIC</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Passport</th>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#000000', fontWeight: 600 }}>Other No</th>
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
                        <td style={{ padding: '8px', color: '#000000' }}>{result.holderName || '-'}</td>
                        <td style={{ padding: '8px', color: '#000000' }}>{result.holderId || '-'}</td>
                        <td style={{ padding: '8px', color: '#000000' }}>{result.nic || '-'}</td>
                        <td style={{ padding: '8px', color: '#000000' }}>{result.passport || '-'}</td>
                        <td style={{ padding: '8px', color: '#000000' }}>{result.otherNo || '-'}</td>
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

export default UserSearchModal;

