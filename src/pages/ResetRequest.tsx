import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';
import '../Login.css';

interface Toast {
    id: number;
    type: 'success' | 'error';
    message: string;
}

export default function ResetRequest() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (type: 'success' | 'error', message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier.trim()) {
            addToast('error', 'Please enter your username or email.');
            return;
        }

        setLoading(true);
        // Simulate request to admin
        setTimeout(() => {
            setLoading(false);
            addToast('success', 'Request sent to admin successfully! Please wait for approval.');
            setTimeout(() => navigate('/login'), 2500);
        }, 1500);
    };

    return (
        <div className="login-bg">
            {/* Toast notifications */}
            <div className="login-toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`login-toast ${t.type}`}>
                        <span className="login-toast-icon">
                            {t.type === 'success' ? <FiCheckCircle /> : <FiXCircle />}
                        </span>
                        <span>{t.message}</span>
                        <button className="login-toast-close" onClick={() => removeToast(t.id)}><FiX /></button>
                    </div>
                ))}
            </div>

            <div className="login-right">
                <div className="login-form-card">
                    <div className="login-welcome-title">Reset Password</div>
                    <div className="login-subtitle">Request admin for password reset</div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-input-group">
                            <label className="login-input-label">Username or Email</label>
                            <div className="login-input-wrapper">
                                <input
                                    className="login-input"
                                    type="text"
                                    placeholder="Enter identifier"
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    autoComplete="off"
                                />
                                <span className="login-eye-btn" style={{ pointerEvents: 'none' }}>
                                    <FiMail />
                                </span>
                            </div>
                        </div>

                        <button className="login-btn" type="submit" disabled={loading}>
                            {loading && <span className="login-spinner" />}
                            {loading ? 'Sending Request...' : 'Send Request to Admin'}
                        </button>
                    </form>

                    <div className="login-bottom-note">
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
                            <FiArrowLeft /> <span>Back to Login</span>
                        </Link>
                    </div>
                </div>

                <div className="login-copyright">
                    © 2025 Management Systems (Pvt) Ltd - All rights reserved
                </div>
            </div>
        </div>
    );
}
