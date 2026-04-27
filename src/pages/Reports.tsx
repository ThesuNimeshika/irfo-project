import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../Setup.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const moduleData = [
    { title: 'User login Details', icon: '📝' },
    { title: 'MIS', icon: '📊' },
    { title: 'Dividend Reports', icon: '💰' },
    { title: 'Other Reports', icon: '📋' },
];

const modules = moduleData.map(m => ({ title: m.title, icon: m.icon }));

function Reports() {
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
        const title = modules[modalIdx].title;

        return (
            <div className="empty-content" style={{ padding: '20px', textAlign: 'center' }}>
                <p>Content for <strong>{title}</strong> will be implemented here.</p>
                <p>This is a placeholder modal for the Reports Module.</p>
            </div>
        );
    };

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
                        <div className="setup-modules-grid">
                            {modules.map((mod, idx) => (
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

                        {modalIdx !== null && createPortal(
                            <div className={`setup-modal-overlay ${isMobile ? 'mobile' : ''}`} onClick={handleModalClose}>
                                <div className={`setup-modal-container ${isMobile ? 'mobile' : ''}`} onClick={e => e.stopPropagation()}>
                                    <div className="setup-modal-header">
                                        <div className="setup-modal-header-content">
                                            <span className="setup-modal-header-icon">{modules[modalIdx].icon}</span>
                                            <span className="setup-modal-header-title">{modules[modalIdx].title}</span>
                                        </div>
                                        <button onClick={handleModalClose} className="setup-modal-close-btn" aria-label="Close modal">×</button>
                                    </div>

                                    <div className="setup-modal-content" style={{ overflow: 'auto', padding: '8px', isolation: 'auto' }}>
                                        {renderActiveModal()}
                                    </div>

                                    <div className="setup-modal-footer">
                                        <p>Reports Module</p>
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

export default Reports;
