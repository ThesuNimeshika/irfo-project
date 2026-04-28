import React, { useState, useMemo } from 'react';

interface FundData {
    id: string;
    fundName: string;
    currentDate: string;
    fundCode: string;
    nextDate: string;
}

const mockData: FundData[] = [
    { id: '1', fundName: 'test1', currentDate: '26/May/2025', fundCode: '11', nextDate: '27/May/2025' },
    { id: '2', fundName: 'Ceylon Income Fund', currentDate: '24/May/2025', fundCode: '12', nextDate: '25/May/2025' },
    { id: '3', fundName: 'Ceylon Tourism Fund', currentDate: '24/May/2025', fundCode: '13', nextDate: '25/May/2025' },
    { id: '4', fundName: 'Ceylon Financial Sector Fund', currentDate: '25/May/2025', fundCode: '14', nextDate: '26/May/2025' },
    { id: '5', fundName: 'Ceylon IPO Fund', currentDate: '24/May/2025', fundCode: '15', nextDate: '25/May/2025' },
    { id: '6', fundName: 'Ceylon Gilt Edged Fund', currentDate: '25/Sep/2019', fundCode: '16', nextDate: '26/Sep/2019' },
    { id: '7', fundName: 'Ceylon Dollar Bond Fund', currentDate: '24/May/2025', fundCode: '17', nextDate: '25/May/2025' },
    { id: '8', fundName: 'Ceylon Treasury Income Fund', currentDate: '26/May/2025', fundCode: '18', nextDate: '27/May/2025' },
    { id: '9', fundName: 'Ceylon Money Market Fund', currentDate: '26/May/2025', fundCode: '19', nextDate: '27/May/2025' },
    { id: '10', fundName: 'Test Fund A', currentDate: '28/May/2025', fundCode: '20', nextDate: '29/May/2025' },
    { id: '11', fundName: 'Test Fund B', currentDate: '29/May/2025', fundCode: '21', nextDate: '30/May/2025' },
    { id: '12', fundName: 'Test Fund C', currentDate: '30/May/2025', fundCode: '22', nextDate: '31/May/2025' },
];

const DayEndModalContent = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Number of items that looks good

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const totalPages = Math.ceil(mockData.length / itemsPerPage);

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return mockData.slice(start, start + itemsPerPage);
    }, [currentPage, mockData]);

    const cellStyle: React.CSSProperties = {
        padding: '12px 16px',
        borderBottom: '1px solid #f1f5f9',
        borderRight: '1px solid #f1f5f9',
        whiteSpace: 'nowrap',
        color: '#334155',
        fontSize: '13px'
    };

    const headerStyle: React.CSSProperties = {
        padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0',
        borderRight: '1px solid #f1f5f9',
        background: '#f8fafc',
        color: '#64748b',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        textAlign: 'left',
    };

    return (
        <div style={{ background: '#fff', padding: '24px', minHeight: '400px', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body, system-ui, sans-serif)' }}>
                    <thead>
                        <tr>
                            <th style={{ ...headerStyle, width: '40%' }}>Fund</th>
                            <th style={{ ...headerStyle, width: '20%' }}>Current Date</th>
                            <th style={{ ...headerStyle, width: '15%' }}>Fund C...</th>
                            <th style={{ ...headerStyle, borderRight: 'none' }}>Next Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row) => (
                            <tr key={row.id} style={{ transition: 'background-color 0.2s', background: selectedIds.includes(row.id) ? '#f0f9ff' : '#fff' }}>
                                <td style={{ ...cellStyle, display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(row.id)}
                                        onChange={() => toggleSelect(row.id)}
                                        style={{
                                            margin: 0,
                                            cursor: 'pointer',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '4px',
                                            accentColor: 'var(--accent, #1e3a8a)'
                                        }}
                                    />
                                    <span style={{ fontWeight: 500 }}>{row.fundName}</span>
                                </td>
                                <td style={cellStyle}>{row.currentDate}</td>
                                <td style={cellStyle}>{row.fundCode}</td>
                                <td style={{ ...cellStyle, borderRight: 'none' }}>{row.nextDate}</td>
                            </tr>
                        ))}
                        {/* Empty slots to maintain table height completely if we want constant height */}
                        {Array.from({ length: Math.max(0, itemsPerPage - currentData.length) }).map((_, idx) => (
                            <tr key={`empty-${idx}`}>
                                <td style={{ ...cellStyle, height: '46px' }}></td>
                                <td style={cellStyle}></td>
                                <td style={cellStyle}></td>
                                <td style={{ ...cellStyle, borderRight: 'none' }}></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 0 0' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, mockData.length)}</strong> of <strong>{mockData.length}</strong> entries
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            background: currentPage === 1 ? '#f8fafc' : '#fff',
                            color: currentPage === 1 ? '#94a3b8' : '#334155',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        Previous
                    </button>

                    <div style={{ display: 'flex', gap: '4px' }}>
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    border: currentPage === idx + 1 ? 'none' : '1px solid #e2e8f0',
                                    background: currentPage === idx + 1 ? 'var(--accent, #1e3a8a)' : '#fff',
                                    color: currentPage === idx + 1 ? '#fff' : '#334155',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: currentPage === idx + 1 ? 'bold' : 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            background: currentPage === totalPages ? '#f8fafc' : '#fff',
                            color: currentPage === totalPages ? '#94a3b8' : '#334155',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DayEndModalContent;
