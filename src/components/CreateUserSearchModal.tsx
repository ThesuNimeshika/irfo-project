import { useState } from 'react';
import { createPortal } from 'react-dom';
import '../Setup.css';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export interface CreateUserFormData {
    fullName: string;
    empNo: string;
    gender: string;
    designation: string;
    dateOfBirth: Date | null;
    mobileNumber: string;
    emailAddress: string;
    address: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: CreateUserFormData) => void;
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const CreateUserSearchModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    const [searchCriteria, setSearchCriteria] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<CreateUserFormData | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('Ready to search');

    // Dummy mock users with the specific fields
    const mockUsers: CreateUserFormData[] = [
        { fullName: 'Anushka Perera', empNo: 'EMP001', gender: 'male', designation: 'Senior Fund Manager', dateOfBirth: new Date('1985-05-12'), mobileNumber: '0712345678', emailAddress: 'anushka@irfo.com', address: 'Colombo 03' },
        { fullName: 'Basuru Wickramasinghe', empNo: 'EMP002', gender: 'male', designation: 'System Administrator', dateOfBirth: new Date('1990-08-22'), mobileNumber: '0771234567', emailAddress: 'basuru@irfo.com', address: 'Kandy' },
        { fullName: 'Tharindu Silva', empNo: 'EMP003', gender: 'male', designation: 'Operations Analyst', dateOfBirth: new Date('1992-11-05'), mobileNumber: '0754567890', emailAddress: 'tharindu@irfo.com', address: 'Galle' },
        { fullName: 'Thilina Fernando', empNo: 'EMP004', gender: 'male', designation: 'Security Consultant', dateOfBirth: new Date('1988-02-14'), mobileNumber: '0721122334', emailAddress: 'thilina@irfo.com', address: 'Negombo' },
        { fullName: 'Thushara Bandara', empNo: 'EMP005', gender: 'male', designation: 'HR Executive', dateOfBirth: new Date('1995-09-30'), mobileNumber: '0789988776', emailAddress: 'thushara@irfo.com', address: 'Jaffna' },
        { fullName: 'Nimali Fernando', empNo: 'EMP006', gender: 'female', designation: 'Investment Advisor', dateOfBirth: new Date('1993-04-18'), mobileNumber: '0719876543', emailAddress: 'nimali@irfo.com', address: 'Mount Lavinia' },
    ];

    const [results, setResults] = useState<CreateUserFormData[]>([]);

    const handleSearch = () => {
        setStatusMessage('Searching...');
        const filtered = mockUsers.filter(u =>
            u.fullName.toLowerCase().includes(searchCriteria.toLowerCase()) ||
            u.empNo.toLowerCase().includes(searchCriteria.toLowerCase()) ||
            u.designation.toLowerCase().includes(searchCriteria.toLowerCase())
        );
        setResults(filtered);
        setStatusMessage(`Search completed (${filtered.length} found)`);
    };

    const handleGet = () => {
        if (selectedUser && onConfirm) {
            onConfirm(selectedUser);
            onClose();
        }
    };

    const handleRowDoubleClick = (user: CreateUserFormData) => {
        setSelectedUser(user);
        if (onConfirm) {
            onConfirm(user);
            onClose();
        }
    };

    const formatDOB = (date: Date | null) => {
        if (!date) return '—';
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="setup-modal-overlay">
            <div className="setup-modal-container" style={{ width: '90vw', maxWidth: '850px' }} onClick={e => e.stopPropagation()}>

                {/* HEADER */}
                <div className="setup-modal-header">
                    <div className="setup-modal-header-content">
                        <span className="setup-modal-header-icon">👤</span>
                        <span className="setup-modal-header-title">Create User Search</span>
                    </div>
                    <button onClick={onClose} className="setup-modal-close-btn">×</button>
                </div>

                {/* BODY */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search by Name, Employee No, or Designation..."
                                value={searchCriteria}
                                onChange={e => setSearchCriteria(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                            />
                        </div>
                        <button onClick={handleSearch} style={{ padding: '0 24px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
                        <button onClick={handleGet} disabled={!selectedUser} style={{ padding: '0 24px', background: selectedUser ? '#10b981' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: selectedUser ? 'pointer' : 'not-allowed' }}>Get</button>
                    </div>

                    <div style={{ minHeight: '300px', maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', position: 'sticky', top: 0, borderBottom: '2px solid #e2e8f0', zIndex: 1 }}>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#64748b' }}>Full Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#64748b' }}>Emp. No</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#64748b' }}>Designation</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#64748b' }}>Gender</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#64748b' }}>DOB</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#64748b' }}>Mobile</th>
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
                                            background: selectedUser === u ? '#eff6ff' : 'transparent',
                                            transition: 'background 0.2s',
                                        }}
                                    >
                                        <td style={{ padding: '12px', fontWeight: selectedUser === u ? 600 : 400 }}>{u.fullName}</td>
                                        <td style={{ padding: '12px' }}>{u.empNo}</td>
                                        <td style={{ padding: '12px' }}>{u.designation}</td>
                                        <td style={{ padding: '12px', textTransform: 'capitalize' }}>{u.gender}</td>
                                        <td style={{ padding: '12px' }}>{formatDOB(u.dateOfBirth)}</td>
                                        <td style={{ padding: '12px' }}>{u.mobileNumber}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
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

export default CreateUserSearchModal;
