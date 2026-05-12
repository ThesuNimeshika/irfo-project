import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import BackupModalContent from '../components/BackupModalContent';
import DayEndModalContent from '../components/DayEndModalContent';
import '../App.css';
import '../Setup.css';

const moduleData = [
    { title: 'Back Up', icon: '💽' },
    { title: 'Day End', icon: '🔄' },
    { title: 'Mobile Excel File Upload', icon: '📊' },
];

function Process() {
    const [modalIdx, setModalIdx] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleModalOpen = (index: number) => setModalIdx(index);
    const handleModalClose = () => setModalIdx(null);

    const renderActiveModal = () => {
        if (modalIdx === null) return null;
        const title = moduleData[modalIdx].title;

        if (title === 'Back Up') {
            return <BackupModalContent />;
        }

        if (title === 'Day End') {
            return <DayEndModalContent />;
        }

        return (
            <div className="empty-content" style={{ padding: '20px', textAlign: 'center' }}>
                <p>Content for <strong>{title}</strong> will be implemented here.</p>
                <p>This is a placeholder modal for the Process Page.</p>
            </div>
        );
    };

    return (
        <>
            <div className="navbar-fixed-wrapper">
                <Navbar />
            </div>

            <div className="setup-main-layout" style={{ minHeight: 'calc(100vh - 70px)' }}>
                <div className="home-sidebar-container">
                    <Sidebar />
                </div>

                <div className="setup-main-content">
                    <div className="setup-main-card magical-bg animated-bg">
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>Process Management</h1>
                            <p style={{ color: '#64748b', fontSize: '14px' }}>Execute system maintenance and data processing tasks</p>
                        </div>

                        <div className="setup-modules-grid">
                            {moduleData.map((mod, idx) => (
                                <div
                                    key={idx}
                                    className="setup-module-card"
                                    tabIndex={0}
                                    onClick={() => handleModalOpen(idx)}
                                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleModalOpen(idx); }}
                                >
                                    <div className="setup-module-icon">{mod.icon}</div>
                                    <div className="setup-module-title">{mod.title}</div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Portal */}
                        {modalIdx !== null && createPortal(
                            <div className={`setup-modal-overlay ${isMobile ? 'mobile' : ''}`} onClick={handleModalClose}>
                                <div className={`setup-modal-container ${isMobile ? 'mobile' : ''}`} onClick={e => e.stopPropagation()}>
                                    <div className="setup-modal-header">
                                        <div className="setup-modal-header-content">
                                            <span className="setup-modal-header-icon">{moduleData[modalIdx].icon}</span>
                                            <span className="setup-modal-header-title">{moduleData[modalIdx].title}</span>
                                        </div>
                                        <button onClick={handleModalClose} className="setup-modal-close-btn" aria-label="Close modal">×</button>
                                    </div>

                                    <div className="setup-modal-content" style={{ overflow: 'auto', padding: '8px', isolation: 'auto' }}>
                                        {renderActiveModal()}
                                    </div>

                                    <div className="setup-modal-footer">
                                        <p>Process Management Module</p>
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Process;
