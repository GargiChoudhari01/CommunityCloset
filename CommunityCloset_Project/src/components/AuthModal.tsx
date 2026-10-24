import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User as UserIcon, Shield, Globe, KeyRound, ArrowRight, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Sign-up OTP States
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [showTemplateHelp, setShowTemplateHelp] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // --- SIGN IN (DIRECT PASSWORD LOGIN - NO OTP) ---
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await signIn(email.trim(), password);
      await onSuccess(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SIGN UP STEP 1: SEND EMAIL OTP CODE ---
  const handleInitiateSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const otpResult = await sendSignUpOtp(email.trim());
      setOtpPreview(otpResult.previewCode || null);
      setSignupStep('otp');
      setResendCooldown(30);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SIGN UP STEP 2: VERIFY OTP CODE & CREATE ACCOUNT ---
  const handleVerifySignUpOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const verifiedUser = await verifySignUpOtp(
        email.trim(),
        fullCode,
        password,
        {
          name: name.trim(),
          locationAddress: 'Katraj, Pune, Maharashtra',
        }
      );
      await onSuccess(verifiedUser);
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
      const otpResult = await sendSignUpOtp(email.trim());
      setOtpPreview(otpResult.previewCode || null);
      setResendCooldown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resend OTP code.');
    }
  };

  // OTP Box Handlers
  const handleOtpDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split('');
      const updated = [...otpDigits];
      chars.forEach((c, i) => {
        if (index + i < 6) updated[index + i] = c;
      });
      setOtpDigits(updated);
      const nextIndex = Math.min(index + chars.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleaned;
    setOtpDigits(updated);

    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const rawData = e.clipboardData.getData('text').trim();
    
    // Automatically extract 6 digits if user pastes URL or plain numbers
    const tokenMatch = rawData.match(/[?&#]token=(\d{6})/);
    const plain6Digit = rawData.match(/\b\d{6}\b/);
    const digitsOnly = rawData.replace(/\D/g, '').slice(0, 6);
    const matched = (tokenMatch ? tokenMatch[1] : (plain6Digit ? plain6Digit[0] : digitsOnly)).slice(0, 6);

    if (!matched) return;
    const digits = matched.split('');
    const updated = [...otpDigits];
    digits.forEach((d, i) => {
      if (i < 6) updated[i] = d;
    });
    setOtpDigits(updated);
    otpInputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleFillPreviewOtp = () => {
    if (!otpPreview) return;
    const digits = otpPreview.slice(0, 6).split('');
    setOtpDigits(digits);
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
    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }
    try {
      await sendPasswordReset(email.trim());
      setError('Password reset email sent.');
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
            {isSignUp && signupStep === 'otp' ? (
              <KeyRound className="w-6 h-6 animate-pulse" />
            ) : (
              <Shield className="w-6 h-6" />
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {isSignUp
              ? signupStep === 'otp'
                ? 'Verify Email with OTP'
                : 'Join CommunityCloset'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {isSignUp && signupStep === 'otp'
              ? `Enter the 6-digit verification code sent to ${email}`
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
              <span className="bg-white px-3 text-[11px] text-gray-400 font-semibold uppercase">Or Email</span>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@gmail.com"
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

        {/* 2. CREATE ACCOUNT - STEP 1 (DETAILS) */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@gmail.com"
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
              ✉️ A 6-digit OTP code (not a link) will be sent to your email to verify your address.
            </p>

            {error && <p role="alert" className="mt-3 text-xs font-semibold text-red-700">{error}</p>}

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

        {/* 3. CREATE ACCOUNT - STEP 2 (OTP VERIFICATION) */}
        {isSignUp && signupStep === 'otp' && (
          <form onSubmit={handleVerifySignUpOtp} className="space-y-4 animate-fade-in">
            {otpPreview && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-2.5 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-medium">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Demo OTP: <strong className="font-mono tracking-widest text-[#900C3F] font-bold">{otpPreview}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={handleFillPreviewOtp}
                  className="text-[11px] font-bold bg-[#900C3F] text-white px-2 py-0.5 rounded-lg hover:bg-[#700931] transition-all"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {/* Collapsible Supabase Template Guidance */}
            <div className="bg-[#FFF0F5] border border-[#FFC0CB] rounded-2xl p-2.5 text-xs text-gray-700 space-y-1">
              <div className="flex items-center justify-between font-bold text-[#900C3F]">
                <span className="flex items-center space-x-1 text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#900C3F] shrink-0" />
                  <span>Received a link instead of a 6-digit code?</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowTemplateHelp(!showTemplateHelp)}
                  className="text-[11px] underline hover:text-[#700931] font-bold ml-1 shrink-0"
                >
                  {showTemplateHelp ? 'Hide' : 'Quick fix'}
                </button>
              </div>
              {showTemplateHelp && (
                <div className="text-[11px] text-gray-600 space-y-1 pt-1.5 border-t border-[#FFC0CB]/60 animate-fade-in">
                  <p>
                    In your <strong>Supabase Dashboard</strong> &rarr; <strong>Authentication</strong> &rarr; <strong>Email Templates</strong> &rarr; <strong>Magic Link</strong>:
                  </p>
                  <p>
                    Change <code className="bg-white px-1 py-0.5 rounded border border-gray-200 text-red-600">{"{{ .ConfirmationURL }}"}</code> to <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-bold text-emerald-700">{"{{ .Token }}"}</code>.
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Supabase will then email the 6-digit code directly! (You can also paste the confirmation link here).
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 text-center mb-2">
                Enter 6-Digit Code
              </label>
              <div className="flex justify-center items-center gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 text-center text-lg font-mono font-black rounded-xl border-2 border-gray-300 bg-[#FFF0F5]/40 focus:bg-white focus:outline-none focus:border-[#900C3F] focus:ring-2 focus:ring-[#FFC0CB] transition-all"
                  />
                ))}
              </div>
            </div>

            {error && <p role="alert" className="text-xs font-semibold text-red-700 text-center">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || otpDigits.join('').length !== 6}
              className="w-full bg-[#900C3F] hover:bg-[#700931] disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Verify Code & Complete Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => { setSignupStep('details'); setError(''); }}
                className="text-gray-500 hover:text-gray-800 font-bold flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>

              {resendCooldown > 0 ? (
                <span className="text-gray-400 font-medium text-[11px]">
                  Resend in <strong className="text-[#900C3F]">{resendCooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendSignUpOtp}
                  className="text-[#900C3F] hover:underline font-bold flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Code</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
