import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Shield, Globe, KeyRound, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import type { User } from '../types';
import {
  signIn,
  sendSignUpOtp,
  verifySignUpOtp,
  signInWithGoogle,
  sendPasswordReset,
} from '../services/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void | Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details');

  // Input States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSuccess(await signIn(loginIdentifier.trim(), password));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInitiateSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !loginIdentifier.trim() || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendSignUpOtp(loginIdentifier.trim());
      setOtpPreview(result.previewCode || null);
      setOtpDigits(['', '', '', '', '', '']);
      setSignupStep('otp');
      setResendCooldown(30);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySignUpOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await verifySignUpOtp(loginIdentifier, otpDigits.join(''), password, {
        name: name.trim(),
        locationAddress: 'Katraj, Pune, Maharashtra',
      });
      await onSuccess(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendSignUpOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;
    setError('');
    try {
      const result = await sendSignUpOtp(loginIdentifier.trim());
      setOtpPreview(result.previewCode || null);
      setResendCooldown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resend verification code.');
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    const updated = [...otpDigits];
    digits.slice(0, 6 - index).split('').forEach((digit, offset) => {
      updated[index + offset] = digit;
    });
    setOtpDigits(updated);
    otpInputRefs.current[Math.min(index + digits.length, 5)]?.focus();
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    setOtpDigits(Array.from({ length: 6 }, (_, index) => digits[index] || ''));
    otpInputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleFillPreviewOtp = () => {
    if (!otpPreview) return;
    setOtpDigits(otpPreview.split(''));
    otpInputRefs.current[5]?.focus();
  };

  const handleGoogleOAuth = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in with Google.');
    }
  };

  const handlePasswordReset = async () => {
    if (!loginIdentifier.trim()) {
      setError('Enter your registered email address first.');
      return;
    }
    try {
      await sendPasswordReset(loginIdentifier.trim());
      setError('Password reset link sent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send password reset email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#FFC0CB] relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#900C3F] font-bold flex items-center justify-center mx-auto mb-2 shadow-sm border border-[#FFC0CB]">
            {isSignUp && signupStep === 'otp' ? <KeyRound className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {isSignUp ? signupStep === 'otp' ? 'Verify Email with OTP' : 'Join CommunityCloset' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {isSignUp && signupStep === 'otp'
              ? `Enter the 6-digit verification code sent to ${loginIdentifier}`
              : "Katraj's hyper-local resource sharing network"}
          </p>
        </div>

        {/* 1. SIGN IN VIEW (DIRECT - NO OTP) */}
        {!isSignUp && (
          <>
            <button
              onClick={() => { void handleGoogleOAuth(); }}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-sm shadow-sm transition-all flex items-center justify-center space-x-2 mb-4"
            >
              <Globe className="w-5 h-5 text-blue-500" />
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-gray-400 font-semibold uppercase">Or Credentials</span>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email or Phone Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="name@gmail.com or 10-digit phone"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#900C3F] hover:bg-[#700931] disabled:opacity-50 text-white font-extrabold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? <span>Signing In...</span> : <span>Sign In</span>}
              </button>
            </form>

            {error && <p role="alert" className="mt-3 text-xs font-semibold text-red-700">{error}</p>}
            <button onClick={() => { void handlePasswordReset(); }} className="mt-3 w-full text-xs text-[#900C3F] font-bold hover:underline">
              Forgot password?
            </button>

            <div className="text-center mt-4">
              <button
                onClick={() => { setIsSignUp(true); setSignupStep('details'); setError(''); }}
                className="text-xs text-[#900C3F] font-bold hover:underline"
              >
                New to Katraj community? Sign Up
              </button>
            </div>
          </>
        )}

        {/* 2. CREATE ACCOUNT */}
        {isSignUp && signupStep === 'details' && (
          <>
            <form onSubmit={handleInitiateSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 6 chars)"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#900C3F] hover:bg-[#700931] disabled:opacity-50 text-white font-extrabold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Sending Verification Code...</span>
                ) : (
                  <>
                    <span>Verify Email & Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-gray-400 text-center mt-2">
              A 6-digit code will be sent to your email address.
            </p>

            {error && <p role="alert" className="mt-3 text-xs font-semibold text-red-700 bg-red-50 p-2 rounded-xl">{error}</p>}

            <div className="text-center mt-4">
              <button
                onClick={() => { setIsSignUp(false); setError(''); }}
                className="text-xs text-[#900C3F] font-bold hover:underline"
              >
                Already have an account? Sign In
              </button>
            </div>
          </>
        )}

        {isSignUp && signupStep === 'otp' && (
          <form onSubmit={handleVerifySignUpOtp} className="space-y-4 animate-fade-in">
            {otpPreview && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-2.5 text-xs flex items-center justify-between">
                <span>Demo email code: <strong className="font-mono tracking-widest text-[#900C3F]">{otpPreview}</strong></span>
                <button
                  type="button"
                  onClick={handleFillPreviewOtp}
                  className="text-[11px] font-bold bg-[#900C3F] text-white px-2 py-0.5 rounded-lg hover:bg-[#700931]"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 text-center mb-2">Enter 6-Digit Code</label>
              <div className="flex justify-center items-center gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => { otpInputRefs.current[index] = element; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleOtpDigitChange(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
                        otpInputRefs.current[index - 1]?.focus();
                      }
                    }}
                    className="w-10 h-12 text-center text-lg font-mono font-black rounded-xl border-2 border-gray-300 bg-[#FFF0F5]/40 focus:bg-white focus:outline-none focus:border-[#900C3F] focus:ring-2 focus:ring-[#FFC0CB]"
                  />
                ))}
              </div>
            </div>

            {error && <p role="alert" className="text-xs font-semibold text-red-700 text-center">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting || otpDigits.join('').length !== 6}
              className="w-full bg-[#900C3F] hover:bg-[#700931] disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm shadow-md transition-all"
            >
              {isSubmitting ? 'Verifying Code...' : 'Verify Code & Complete Sign Up'}
            </button>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => { setSignupStep('details'); setError(''); }}
                className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Edit Details
              </button>
              {resendCooldown > 0 ? (
                <span className="text-gray-400">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => { void handleResendSignUpOtp(); }}
                  className="text-[#900C3F] hover:underline font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend Code
                </button>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
