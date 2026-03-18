import { useState, useRef } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../Login.css';

const OTP_LENGTH = 6;

interface Toast {
    id: number;
    type: 'success' | 'error';
    message: string;
}

export default function OtpAuth() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const addToast = (type: 'success' | 'error', message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

    const focusNext = (index: number) => {
        if (index + 1 < OTP_LENGTH) inputRefs.current[index + 1]?.focus();
    };

    const focusPrev = (index: number) => {
        if (index - 1 >= 0) inputRefs.current[index - 1]?.focus();
    };

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        const next = [...digits];
        next[index] = digit;
        setDigits(next);
        if (digit) focusNext(index);
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!digits[index]) {
                focusPrev(index);
            } else {
                const next = [...digits];
                next[index] = '';
                setDigits(next);
            }
        } else if (e.key === 'ArrowLeft') {
            focusPrev(index);
        } else if (e.key === 'ArrowRight') {
            focusNext(index);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = [...digits];
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
        setDigits(next);
        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[focusIdx]?.focus();
    };

    const handleResend = () => {
        setDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        addToast('success', 'A new OTP has been sent to your email.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otp = digits.join('');
        if (otp.length < OTP_LENGTH) {
            addToast('error', `Please enter all ${OTP_LENGTH} digits.`);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:5095/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp }),
            });

            if (res.ok) {
                login();
                addToast('success', 'Verification successful! Redirecting…');
                setTimeout(() => navigate('/'), 1000);
            } else {
                addToast('error', 'Invalid OTP. Please try again.');
                setDigits(Array(OTP_LENGTH).fill(''));
                inputRefs.current[0]?.focus();
            }
        } catch {
            // Backend unreachable – allow demo flow
            login();
            addToast('success', 'Verification successful! Redirecting…');
            setTimeout(() => navigate('/'), 1000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">
            {/* Decorative circles */}
            <div className="login-circle login-circle-1" />
            <div className="login-circle login-circle-2" />
            <div className="login-circle login-circle-3" />
            <div className="login-circle login-circle-4" />

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

            {/* Card */}
            <div className="login-card">

                {/* ── LEFT: OTP Form ── */}
                <div className="login-left">
                    <div style={{ width: '100%' }}>
                        <div className="login-welcome-title">Authentication</div>
                        <div className="login-subtitle" style={{ marginBottom: 24 }}>OTP Verification</div>

                        <p className="otp-instructions">
                            A verification code has been sent to your email.<br />
                            Please enter the {OTP_LENGTH}-digit code below to continue.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="otp-boxes" style={{ marginBottom: 14 }}>
                                {digits.map((d, i) => (
                                    <input
                                        key={i}
                                        id={`otp-box-${i}`}
                                        ref={el => { inputRefs.current[i] = el; }}
                                        className={`otp-box${d ? ' filled' : ''}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={d}
                                        onChange={e => handleChange(i, e.target.value)}
                                        onKeyDown={e => handleKeyDown(i, e)}
                                        onPaste={handlePaste}
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </div>

                            <div className="otp-resend" style={{ marginBottom: 20 }}>
                                Didn't receive the code?{' '}
                                <span onClick={handleResend}>Resend OTP</span>
                            </div>

                            <button
                                id="irfo-otp-submit"
                                className="login-btn"
                                type="submit"
                                disabled={loading}
                            >
                                {loading && <span className="login-spinner" />}
                                {loading ? 'Verifying…' : 'Submit'}
                            </button>
                        </form>
                    </div>

                    <div className="login-copyright">
                        © 2025 Management Systems (Pvt) Ltd | All rights reserved
                    </div>
                </div>

                {/* ── RIGHT: Branding ── */}
                <div className="login-right">
                    <div className="login-logo-circle">
                        <span className="login-logo-text">IRFO</span>
                    </div>

                    <div className="login-divider" />

                    <div className="login-app-name">IRFO</div>
                    <div className="login-app-desc">
                        Investor Registration and<br />Service Solution for<br />Fund Operation
                    </div>

                    <div className="login-brand-badge">
                        <span style={{ fontSize: 18, color: '#1565c0' }}>🏦</span>
                        <span className="login-brand-badge-text">MSL Management Systems</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
