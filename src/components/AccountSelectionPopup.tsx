/**
 * AccountSelectionPopup.tsx  — Refined Account Selection Popup
 * Matches project-standard aesthetic
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface AccountSelectionPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (row: any) => void;
    title?: string;
}

export default function AccountSelectionPopup({
    isOpen,
    onClose,
    onSelect,
    title = 'Edit — Account Selection',
}: AccountSelectionPopupProps) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            setData([
                { actNo: 'ACT001', name: 'John Doe', fundCode: 'F001', regNo: 'REG101' },
                { actNo: 'ACT002', name: 'Jane Smith', fundCode: 'F002', regNo: 'REG102' },
                { actNo: 'ACT003', name: 'Robert Johnson', fundCode: 'F001', regNo: 'REG103' },
                { actNo: 'ACT004', name: 'Emily Davis', fundCode: 'F003', regNo: 'REG104' },
                { actNo: 'ACT005', name: 'Michael Brown', fundCode: 'F002', regNo: 'REG105' },
            ]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const S = {
        overlay: {
            position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2147483647,
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)', padding: '20px'
        },
        shell: {
            background: '#ffffff', borderRadius: '8px', width: '700px', maxWidth: '96vw',
            display: 'flex', flexDirection: 'column' as const, boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            overflow: 'hidden', border: '1.5px solid #0d7f5a',
        },
        header: {
            display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%)',
            minHeight: '44px', flexShrink: 0, borderBottom: '2px solid #0d7f5a',
        },
        logoLeft: {
            background: 'linear-gradient(180deg,#0d7f5a 0%,#065f46 100%)', color: '#ffffff', fontWeight: 900,
            fontSize: '12px', letterSpacing: '0.06em', padding: '0 12px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', minWidth: '48px', height: '44px', borderRight: '2px solid rgba(255,255,255,0.18)',
        },
        logoRight: {
            background: 'linear-gradient(180deg,#34d399 0%,#0d7f5a 100%)', color: '#ffffff', fontWeight: 700,
            fontSize: '9px', letterSpacing: '0.05em', lineHeight: 1.35, padding: '0 10px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', height: '44px', borderRight: '2px solid rgba(255,255,255,0.14)',
            textAlign: 'center' as const,
        },
        headerTitle: {
            flex: 1, color: '#ffffff', fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em',
            textTransform: 'uppercase' as const, padding: '0 16px',
        },
        closeBtn: {
            background: 'rgba(255,255,255,0.10)', border: 'none', color: '#ffffff', fontSize: '22px',
            fontWeight: 700, cursor: 'pointer', width: '44px', height: '44px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
        },
        body: { padding: '12px', background: '#f1f5f9' },
        tableContainer: {
            background: '#ffffff', border: '1.5px solid #bdd5f0', borderRadius: '8px',
            padding: '0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(59,130,246,0.07)',
        },
        table: { width: '100%', borderCollapse: 'collapse' as const },
        th: {
            padding: '8px 12px', background: '#f8fafc', fontWeight: 700, fontSize: '11px',
            color: '#475569', textAlign: 'left' as const, textTransform: 'uppercase' as const,
            letterSpacing: '0.05em', borderBottom: '2px solid #cbd5e1', borderRight: '1px solid #e2e8f0',
        },
        td: {
            padding: '8px 12px', fontSize: '12px', color: '#1e293b', borderBottom: '1px solid #f1f5f9',
            borderRight: '1px solid #f1f5f9',
        },
        footer: {
            display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px',
            padding: '10px 14px', background: 'linear-gradient(90deg,#f1f4f9 0%,#e8edf5 100%)',
            borderRadius: '0 0 8px 8px', borderTop: '1px solid rgba(0,0,0,0.07)',
        },
        btnOk: {
            padding: '0 20px', height: '28px', background: '#3b82f6', color: '#fff',
            border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        },
        btnCancel: {
            padding: '0 20px', height: '28px', background: '#f1f5f9', color: '#374151',
            border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
        }
    };

    return createPortal(
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div style={S.shell}>
                <div style={S.header}>
                    <div style={S.logoLeft}>MSL</div>
                    <div style={S.logoRight}>Computer<br />Services</div>
                    <div style={S.headerTitle}>{title}</div>
                    <button style={S.closeBtn} onClick={onClose}>×</button>
                </div>

                <div style={S.body}>
                    <div style={S.tableContainer}>
                        <table style={S.table}>
                            <thead>
                                <tr>
                                    <th style={S.th}>Act No</th>
                                    <th style={S.th}>Name</th>
                                    <th style={S.th}>Fund Code</th>
                                    <th style={S.th}>Reg No</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onSelect?.(row)}>
                                        <td style={{ ...S.td, fontWeight: 700, color: '#1e3a8a' }}>{row.actNo}</td>
                                        <td style={S.td}>{row.name}</td>
                                        <td style={S.td}>{row.fundCode}</td>
                                        <td style={S.td}>{row.regNo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={S.footer}>
                    <button style={S.btnOk} onClick={onClose}>Get</button>
                    <button style={S.btnCancel} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
