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
  [key: string]: string | undefined;
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
  const [searchCriteria, setSearchCriteria] = useState<Record<string, string>>({});
  const [ignoreCase, setIgnoreCase] = useState<boolean>(true);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Please Wait..................');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const titleOptions = ['Mr', 'Miss', 'Mrs', 'Dr'];
  const streetOptions = ['Main Street', 'Park Avenue', 'Ocean Drive', 'First Street', 'Second Street'];
  const townOptions = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'];
  const cityOptions = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'];
  const fundOptions = ['Equity Fund', 'Bond Fund', 'Mixed Fund', 'Growth Fund', 'Income Fund'];

  const handleInputChange = (field: string, value: string) =>
    setSearchCriteria(prev => ({ ...prev, [field]: value }));

  const handleNew = () => {
    setIsEnabled(true);
    setSearchCriteria({});
    setResults([]);
    setSelectedResult(null);
    setStatusMessage('Please Wait..................');
  };

  const handleGet = () => {
    if (selectedResult && onGet) onGet(selectedResult);
    else if (selectedResult && onSelect) onSelect(selectedResult);
    onClose();
  };

  const handleSearch = async () => {
    setStatusMessage('Searching...');
    try {
      if (onSearch) {
        const r = await onSearch(searchCriteria);
        setResults(r);
        setStatusMessage('Search completed');
      } else {
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
    } catch {
      setStatusMessage('Search failed');
    }
  };

  const handleRowDoubleClick = (result: SearchResult) => {
    setSelectedResult(result);
    if (onSelect) { onSelect(result); onClose(); }
  };

  if (!isOpen) return null;

  const labelStyle: React.CSSProperties = {
    minWidth: '82px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    flexShrink: 0,
    textAlign: 'right',
  };

  const fieldBase: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: '5px 8px',
    fontSize: '12px',
    border: '1.5px solid',
    borderColor: isEnabled ? '#cbd5e1' : '#e2e8f0',
    borderRadius: '4px',
    color: '#1f2937',
    background: isEnabled ? '#ffffff' : '#f1f5f9',
    opacity: isEnabled ? 1 : 0.7,
    cursor: isEnabled ? 'auto' : 'not-allowed',
    outline: 'none',
    fontFamily: "'Lato',system-ui,sans-serif",
    boxSizing: 'border-box' as const,
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return createPortal(
    <div className="setup-modal-overlay">
      <div
        className="setup-modal-container"
        style={{ width: '90vw', maxWidth: '1020px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="setup-modal-header">
          <div className="setup-modal-header-content">
            <span className="setup-modal-header-icon">🔍</span>
            <span className="setup-modal-header-title">{title}</span>
          </div>
          <button onClick={onClose} className="setup-modal-close-btn" aria-label="Close modal">×</button>
        </div>

        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Search Criteria */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px 16px' }}>

            {/* Row 1: Name | Title | Initials */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 24px', marginBottom: '10px' }}>
              <div style={rowStyle}>
                <label style={labelStyle}>Name:</label>
                <input style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.name || ''} onChange={e => handleInputChange('name', e.target.value)} />
              </div>
              <div style={rowStyle}>
                <label style={labelStyle}>Title:</label>
                <select style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.title || ''} onChange={e => handleInputChange('title', e.target.value)}>
                  <option value="">Select title</option>
                  {titleOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>
              <div style={rowStyle}>
                <label style={labelStyle}>Initials:</label>
                <input style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.initials || ''} onChange={e => handleInputChange('initials', e.target.value)} />
              </div>
            </div>

            {/* Row 2: Surname | First Name | Street */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 24px', marginBottom: '10px' }}>
              <div style={rowStyle}>
                <label style={labelStyle}>Surname:</label>
                <input style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.surname || ''} onChange={e => handleInputChange('surname', e.target.value)} />
              </div>
              <div style={rowStyle}>
                <label style={labelStyle}>First Name:</label>
                <input style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.firstName || ''} onChange={e => handleInputChange('firstName', e.target.value)} />
              </div>
              <div style={rowStyle}>
                <label style={labelStyle}>Street:</label>
                <select style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.street || ''} onChange={e => handleInputChange('street', e.target.value)}>
                  <option value="">Select street</option>
                  {streetOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Row 3: Town | City | Holder ID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 24px', marginBottom: '10px' }}>
              <div style={rowStyle}>
                <label style={labelStyle}>Town:</label>
                <select style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.town || ''} onChange={e => handleInputChange('town', e.target.value)}>
                  <option value="">Select town</option>
                  {townOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>
              <div style={rowStyle}>
                <label style={labelStyle}>City:</label>
                <select style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.city || ''} onChange={e => handleInputChange('city', e.target.value)}>
                  <option value="">Select city</option>
                  {cityOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>
              <div style={rowStyle}>
                <label style={labelStyle}>Holder ID:</label>
                <input style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.holderId || ''} onChange={e => handleInputChange('holderId', e.target.value)} />
              </div>
            </div>

            {/* Row 4: NIC | Passport | Other No */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 24px', marginBottom: '10px' }}>
              <div style={rowStyle}>
                <label style={labelStyle}>NIC:</label>
                <input style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.nic || ''} onChange={e => handleInputChange('nic', e.target.value)} />
              </div>
              <div style={rowStyle}>
                <label style={labelStyle}>Passport:</label>
                <input style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.passport || ''} onChange={e => handleInputChange('passport', e.target.value)} />
              </div>
              <div style={rowStyle}>
                <label style={labelStyle}>Other No:</label>
                <input style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.otherNo || ''} onChange={e => handleInputChange('otherNo', e.target.value)} />
              </div>
            </div>

            {/* Row 5: Fund */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 24px' }}>
              <div style={rowStyle}>
                <label style={labelStyle}>Fund:</label>
                <select style={fieldBase} disabled={!isEnabled}
                  value={searchCriteria.fund || ''} onChange={e => handleInputChange('fund', e.target.value)}>
                  <option value="">Select fund</option>
                  {fundOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>
              <div />
              <div />
            </div>
          </div>

          {/* Control Bar — all buttons right-aligned */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: '#374151', fontWeight: 600 }}>
              <input type="checkbox" checked={ignoreCase} onChange={e => setIgnoreCase(e.target.checked)}
                style={{ accentColor: '#3b82f6', width: '14px', height: '14px' }} />
              Ignore Case
            </label>

            <button onClick={handleNew} style={{
              background: 'linear-gradient(135deg,#1e3a8a,#1e40af)', color: '#fff',
              border: 'none', borderRadius: '4px', padding: '6px 18px', fontSize: '12px',
              fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
              gap: '6px', boxShadow: '0 2px 8px rgba(30,58,138,0.28)',
            }}>＋ New</button>

            <button onClick={handleGet} style={{
              background: '#60a5fa', color: '#fff', border: 'none',
              borderRadius: '4px', padding: '6px 18px', fontSize: '12px',
              fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>🔍 Get</button>

            <button onClick={handleSearch} disabled={!isEnabled} style={{
              background: isEnabled ? '#2563eb' : '#9ca3af', color: '#fff', border: 'none',
              borderRadius: '4px', padding: '6px 22px', fontSize: '12px', fontWeight: 700,
              cursor: isEnabled ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center',
              gap: '6px', boxShadow: isEnabled ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
              opacity: isEnabled ? 1 : 0.7,
            }}>🔍 Search</button>
          </div>

          {/* Results Grid */}
          <div style={{
            background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px',
            minHeight: '220px', maxHeight: '300px', overflowY: 'auto',
          }}>
            {results.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#1e3a8a' }}>
                    {['Account No', 'Holder Name', 'Holder ID', 'NIC', 'Passport', 'Other No', 'Fund'].map((h, i, arr) => (
                      <th key={i} style={{
                        padding: '7px 10px', textAlign: 'left', color: '#fff', fontWeight: 700,
                        fontSize: '11px', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                        borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => (
                    <tr key={idx}
                      onClick={() => setSelectedResult(r)}
                      onDoubleClick={() => handleRowDoubleClick(r)}
                      style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: selectedResult === r ? '#dbeafe' : idx % 2 === 0 ? '#fff' : '#f8fafc' }}
                      onMouseEnter={e => { if (selectedResult !== r) (e.currentTarget as HTMLTableRowElement).style.background = '#f1f5f9'; }}
                      onMouseLeave={e => { if (selectedResult !== r) (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? '#fff' : '#f8fafc'; }}
                    >
                      <td style={{ padding: '6px 10px', color: '#1e3a8a', fontWeight: 700 }}>{r.accountNo || '-'}</td>
                      <td style={{ padding: '6px 10px', color: '#1f2937' }}>{r.holderName || '-'}</td>
                      <td style={{ padding: '6px 10px', color: '#374151' }}>{r.holderId || '-'}</td>
                      <td style={{ padding: '6px 10px', color: '#374151' }}>{r.nic || '-'}</td>
                      <td style={{ padding: '6px 10px', color: '#374151' }}>{r.passport || '-'}</td>
                      <td style={{ padding: '6px 10px', color: '#374151' }}>{r.otherNo || '-'}</td>
                      <td style={{ padding: '6px 10px', color: '#374151' }}>{r.fund || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div key={idx} style={{ height: '22px', borderBottom: '1px solid #e2e8f0' }} />
                ))}
              </div>
            )}
          </div>

          {/* Hint + Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 600 }}>
              Double click or press [Get] to use the selected value
            </span>
            <div style={{
              background: '#e5e7eb', padding: '5px 18px', borderRadius: '4px',
              color: '#374151', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
            }}>
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