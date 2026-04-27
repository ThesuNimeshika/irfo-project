import { useState, useRef } from 'react';

const BackupModalContent = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState('C:\\Backup\\IRFO_DB_BACKUP.bak');
    const [history, setHistory] = useState([
        { date: '2026-04-20', time: '10:30 AM', file: 'IRFO_DB_BACKUP_20260420.bak', size: '1.2 GB', status: 'Success', user: 'Admin' },
        { date: '2026-04-10', time: '02:15 PM', file: 'IRFO_DB_BACKUP_20260410.bak', size: '1.1 GB', status: 'Success', user: 'Admin' },
        { date: '2026-04-01', time: '09:00 AM', file: 'IRFO_DB_BACKUP_20260401.bak', size: '1.0 GB', status: 'Success', user: 'Admin' }
    ]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleUpload = () => {
        if (!fileName) return;
        const newEntry = {
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: fileName,
            size: 'Unknown',
            status: 'Pending',
            user: 'Admin'
        };
        setHistory([newEntry, ...history]);
        alert(`Uploading and processing backup: ${fileName}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* File Selection Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', minWidth: '80px' }}>File Name</label>
                        <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                style={{
                                    flex: 1,
                                    height: '40px',
                                    padding: '0 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '13px',
                                    background: '#fff'
                                }}
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                accept=".bak,.sql,.zip"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    width: '26px',
                                    height: '26px',
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            >
                                📁
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Action Palette */}
                <div className="setup-action-buttons" style={{ margin: 0, padding: 0 }}>
                    <button
                        className="setup-btn setup-btn-backup"
                        onClick={handleUpload}
                        style={{ padding: '0 24px', height: '42px' }}
                    >
                        <span className="setup-btn-icon">📤</span>
                        Upload & Process
                    </button>
                    <button
                        className="setup-btn setup-btn-clear"
                        onClick={() => setFileName('')}
                    >
                        <span className="setup-btn-icon">✕</span>
                        Clear
                    </button>
                </div>

                {/* History Table (Screenshot Bottom Section) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', paddingLeft: '4px' }}>Previously Uploaded Files</div>
                    <div style={{
                        background: '#fff',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>Date</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>Time</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>File Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>Size</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s' }}>
                                        <td style={{ padding: '10px 12px', color: '#1e293b' }}>{row.date}</td>
                                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{row.time}</td>
                                        <td style={{ padding: '10px 12px', fontWeight: 500, color: '#1e3a8a' }}>{row.file}</td>
                                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{row.size}</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                background: '#dcfce7',
                                                color: '#166534',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackupModalContent;
