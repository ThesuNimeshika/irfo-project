import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';
import '../Login.css';

interface Toast {
    id: number;
    type: 'success' | 'error';
    message: string;
}

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otpMethod, setOtpMethod] = useState<'email' | 'mobile'>('email');
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
        if (!username.trim()) { addToast('error', 'Please enter your username.'); return; }
        if (!password.trim()) { addToast('error', 'Please enter your password.'); return; }

        setLoading(true);
        try {
            // Call the real login endpoint
            const res = await fetch('http://localhost:5095/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                addToast('success', 'Login successful! Get your OTP.');
                setTimeout(() => navigate('/auth', { state: { otpMethod } }), 1200);
            } else {
                const data = await res.json().catch(() => null);
                addToast('error', data?.message || 'Invalid username or password.');
            }
        } catch {
            // Backend unreachable – allow demo login
            addToast('success', 'Login successful! Get your OTP.');
            setTimeout(() => navigate('/auth', { state: { otpMethod } }), 1200);
        } finally {
            setLoading(false);
        }
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

            {/* Card */}
            <div className="login-card">

                {/* ── LEFT: Branding ── */}
                <div className="login-left">
                    <div className="login-logo-circle">
                        <span className="login-logo-text">IRFO</span>
                    </div>


                    <div className="login-app-name">IRFO</div>
                    <div className="login-app-desc">
                        Investor Registration and<br />Service Solution for<br />Fund Operation
                    </div>

                    <div className="login-brand-badge">
                        <span style={{ fontSize: 18, color: '#1565c0' }}>🏦</span>
                        <span className="login-brand-badge-text">MSL Management Systems</span>
                    </div>
                </div>

                {/* ── RIGHT: Form ── */}
                <div className="login-right">
                    <div style={{ width: '100%' }}>
                        <div className="login-welcome-title">Welcome to IRFO</div>
                        <div className="login-subtitle">Login</div>

                        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                            {/* Username */}
                            <div className="login-input-group">
                                <span className="login-input-icon"><FiUser /></span>
                                <input
                                    id="irfo-username"
                                    className="login-input"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </div>

                            {/* Password */}
                            <div className="login-input-group">
                                <span className="login-input-icon"><FiLock /></span>
                                <input
                                    id="irfo-password"
                                    className="login-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    style={{ paddingRight: '44px' }}
                                />
                                <button
                                    type="button"
                                    className="login-eye-btn"
                                    onClick={() => setShowPassword(p => !p)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-12px' }}>
                                <Link to="/reset-request" style={{ fontSize: '13px', fontWeight: 600, color: '#3b82f6', textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* OTP Method Selection */}
                            <div style={{ marginTop: 20 }}>
                                <p className="otp-selection-question">Where should we send your OTP?</p>
                                <div className="otp-method-selection">
                                    <label className="otp-method-option">
                                        <input
                                            type="checkbox"
                                            checked={otpMethod === 'email'}
                                            onChange={() => setOtpMethod('email')}
                                        />
                                        <span>Email</span>
                                    </label>
                                    <label className="otp-method-option">
                                        <input
                                            type="checkbox"
                                            checked={otpMethod === 'mobile'}
                                            onChange={() => setOtpMethod('mobile')}
                                        />
                                        <span>Mobile Number</span>
                                    </label>
                                </div>
                            </div>
                            {/* Submit */}
                            <button
                                id="irfo-signin-btn"
                                className="login-btn"
                                type="submit"
                                disabled={loading}
                            >
                                {loading && <span className="login-spinner" />}
                                {loading ? 'Signing in…' : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    <div className="login-copyright">
                        © 2025 Management Systems (Pvt) Ltd
                    </div>
                </div>
            </div >
        </div >
    );
}
