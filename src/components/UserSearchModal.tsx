import { useState } from 'react';
import { createPortal } from 'react-dom';
import '../Setup.css';

interface UserSearchResult {
  fullName?: string;
  empNo?: string;
  mobile?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
  employer?: string;
  department?: string;
  otpMethod?: string;
  userType?: string;
  [key: string]: any;
}

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (user: UserSearchResult) => void;
  title?: string;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Search User',
}) => {
  const [searchCriteria, setSearchCriteria] = useState<string>('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to search');

  const mockUsers: UserSearchResult[] = [
    { fullName: 'Anushka Perera', empNo: 'EMP001', mobile: '0712345678', email: 'anushka@irfo.com', address: 'Colombo 03', isActive: true, employer: 'irfo', department: 'it', otpMethod: 'email', userType: 'super_admin' },
    { fullName: 'Basuru Wickramasinghe', empNo: 'EMP002', mobile: '0771234567', email: 'basuru@irfo.com', address: 'Kandy', isActive: true, employer: 'irfo', department: 'finance', otpMethod: 'sms', userType: 'system_admin' },
    { fullName: 'Tharindu Silva', empNo: 'EMP003', mobile: '0754567890', email: 'tharindu@irfo.com', address: 'Galle', isActive: false, employer: 'management_systems', department: 'operations', otpMethod: 'authenticator', userType: 'standard' },
    { fullName: 'Thilina Fernando', empNo: 'EMP004', mobile: '0721122334', email: 'thilina@irfo.com', address: 'Negombo', isActive: true, employer: 'external_contractor', department: 'security', otpMethod: 'email', userType: 'read_only' },
    { fullName: 'Thushara Bandara', empNo: 'EMP005', mobile: '0789988776', email: 'thushara@irfo.com', address: 'Jaffna', isActive: true, employer: 'irfo', department: 'hr', otpMethod: 'sms', userType: 'standard' },
  ];

  const handleSearch = () => {
    setStatusMessage('Searching...');
    const filtered = mockUsers.filter(u =>
      u.fullName?.toLowerCase().includes(searchCriteria.toLowerCase()) ||
      u.empNo?.toLowerCase().includes(searchCriteria.toLowerCase())
    );
    setResults(filtered);
    setStatusMessage(`Search completed (${filtered.length} found)`);
  };

  const handleGet = () => {
    if (selectedUser && onSelect) {
      onSelect(selectedUser);
      onClose();
    }
  };

  const handleRowDoubleClick = (user: UserSearchResult) => {
    setSelectedUser(user);
    if (onSelect) {
      onSelect(user);
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="setup-modal-overlay">
      <div className="setup-modal-container" style={{ width: '90vw', maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
        <div className="setup-modal-header">
          <div className="setup-modal-header-content">
            <span className="setup-modal-header-icon">👤</span>
            <span className="setup-modal-header-title">{title}</span>
          </div>
          <button onClick={onClose} className="setup-modal-close-btn">×</button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
              <input
                type="text"
                placeholder="Search by Name or Employee No..."
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
            </div>
            <button onClick={handleSearch} style={{ padding: '0 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
            <button onClick={handleGet} disabled={!selectedUser} style={{ padding: '0 24px', background: selectedUser ? '#10b981' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: selectedUser ? 'pointer' : 'not-allowed' }}>Get</button>
          </div>

          <div style={{ minHeight: '300px', maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', position: 'sticky', top: 0, borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#64748b' }}>Full Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#64748b' }}>Employee No</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#64748b' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#64748b' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? results.map((u, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedUser(u)}
                    onDoubleClick={() => handleRowDoubleClick(u)}
                    style={{
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      background: selectedUser === u ? '#eff6ff' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '12px' }}>{u.fullName}</td>
                    <td style={{ padding: '12px' }}>{u.empNo}</td>
                    <td style={{ padding: '12px' }}>{u.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        background: u.isActive ? '#dcfce7' : '#fee2e2',
                        color: u.isActive ? '#16a34a' : '#ef4444'
                      }}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                      {statusMessage === 'Ready to search' ? 'Enter a name or employee number to search' : 'No users found matching your criteria'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', color: '#64748b' }}>
            {statusMessage}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UserSearchModal;
