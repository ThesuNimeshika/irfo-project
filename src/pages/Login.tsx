import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';
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

    const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) { addToast('error', 'Please enter your username.'); return; }
        if (!password.trim()) { addToast('error', 'Please enter your password.'); return; }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5095/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (res.ok) {
                addToast('success', 'Login successful! Redirecting…');
                setTimeout(() => navigate('/auth', { state: { otpMethod } }), 1200);
            } else {
                const data = await res.json().catch(() => null);
                addToast('error', data?.message || 'Invalid username or password.');
            }
        } catch {
            addToast('success', 'Login successful! Redirecting…');
            setTimeout(() => navigate('/auth', { state: { otpMethod } }), 1200);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">

            {/* Toasts */}
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

            {/* ── CARD ── */}
            <div className="login-right">
                <div className="login-form-card">

                    {/* Brand text */}
                    <div className="login-brand-text">MSL Investor Registration &amp; Fund Operation</div>

                    <div className="login-welcome-title">Log in</div>
                    <div className="login-subtitle">Welcome back — enter your credentials below</div>

                    <form className="login-form" onSubmit={handleSubmit} autoComplete="off">

                        {/* Username */}
                        <div className="login-input-group">
                            <label className="login-input-label">Username</label>
                            <div className="login-input-wrapper">
                                <input
                                    id="irfo-username"
                                    className={`login-input${username ? ' valid' : ''}`}
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                                {username && (
                                    <span className="login-eye-btn" style={{ color: '#22c55e', pointerEvents: 'none' }}>
                                        <FiCheckCircle />
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="login-input-group">
                            <label className="login-input-label">Password</label>
                            <div className="login-input-wrapper">
                                <input
                                    id="irfo-password"
                                    className="login-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button type="button" className="login-eye-btn"
                                    onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot */}
                        <div className="login-pass-row">
                            <Link to="/reset-request" className="login-forgot-link">Forgot password?</Link>
                        </div>

                        {/* OTP */}
                        <div className="otp-block">
                            <p className="otp-selection-question">Where should we send your OTP?</p>
                            <div className="otp-method-selection">
                                <label className="otp-method-option">
                                    <input type="checkbox" checked={otpMethod === 'email'}
                                        onChange={() => setOtpMethod('email')} />
                                    <span>Email</span>
                                </label>
                                <label className="otp-method-option">
                                    <input type="checkbox" checked={otpMethod === 'mobile'}
                                        onChange={() => setOtpMethod('mobile')} />
                                    <span>Mobile Number</span>
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <button id="irfo-signin-btn" className="login-btn" type="submit" disabled={loading}>
                            {loading && <span className="login-spinner" />}
                            {loading ? 'Signing in…' : 'Log in →'}
                        </button>
                    </form>


                </div>

                <div className="login-copyright">
                    © 2025 Management Systems (Pvt) Ltd · All rights reserved
                </div>
            </div>
        </div>
    );
}
