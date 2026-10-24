import React, { useEffect, useRef, useState } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Shield,
  MapPin,
  Heart,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import type { User } from '../types';
import {
  signIn,
  sendSignUpOtp,
  verifySignUpOtp,
  sendPasswordReset,
} from '../services/auth';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateAdmin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateAdmin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');

  // Sign-in States (Direct sign in, no OTP)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign-up States
  const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [neighborhood, setNeighborhood] = useState('Katraj, Pune, Maharashtra');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Gardening', 'DIY']);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Common UI States
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = ['Books', 'Clothes', 'Furniture', 'Kitchen Items', 'Sports Equipment', 'Electronics', 'Study Materials'];

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter(t => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- SIGN IN HANDLER (DIRECT - NO OTP) ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMessage('Please enter both email/phone and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const signedInUser = await signIn(loginIdentifier.trim(), loginPassword);
      await onLoginSuccess(signedInUser);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !signupEmail.trim() || !signupPassword) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendSignUpOtp(signupEmail.trim());
      setOtpPreview(result.previewCode || null);
      setOtpDigits(['', '', '', '', '', '']);
      setSignupStep('otp');
      setResendCooldown(30);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to send the email verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const verifiedUser = await verifySignUpOtp(
        signupEmail,
        otpDigits.join(''),
        signupPassword,
        {
          name: name.trim(),
          avatar: avatarUrl || undefined,
          locationAddress: neighborhood.trim() || 'PICT, Pune, Maharashtra',
          bio: `Neighbor in ${neighborhood}. Interested in ${selectedInterests.join(', ')}.`,
        }
      );
      await onLoginSuccess(verifiedUser);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Invalid or expired verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendSignupOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;
    setErrorMessage('');
    try {
      const result = await sendSignUpOtp(signupEmail);
      setOtpPreview(result.previewCode || null);
      setResendCooldown(30);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to resend the verification code.');
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

  // --- FORGOT PASSWORD HANDLER ---
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMessage('Please enter your registered email address to receive password reset link.');
      return;
    }
    setErrorMessage('');
    try {
      await sendPasswordReset(forgotEmail.trim());
      setResetSent(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] via-[#FFE4E1]/40 to-[#FFF0F5] flex items-center justify-center p-4 py-12 animate-fade-in">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl shadow-2xl border border-[#FFC0CB] overflow-hidden">
        
        {/* Left Branding Side */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#900C3F] via-[#A8144D] to-[#700931] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <Heart className="w-3.5 h-3.5 text-[#FFB6C1] fill-current" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#FFF0F5]">For the people, by the people</span>
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">CommunityCloset</h1>
              <p className="text-xs text-[#FFC0CB] mt-1 font-medium leading-relaxed">
                PICT, Pune hyper-local sharing platform. Lend, borrow, exchange and sell safely with real neighbors.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center space-x-2 text-[#FFF0F5]">
                <CheckCircle2 className="w-4 h-4 text-[#FFB6C1]" />
                <span>Free neighbor-to-neighbor sharing platform</span>
              </div>
              <div className="flex items-center space-x-2 text-[#FFF0F5]">
                <CheckCircle2 className="w-4 h-4 text-[#FFB6C1]" />
                <span>Verified accounts via email verification code</span>
              </div>
              <div className="flex items-center space-x-2 text-[#FFF0F5]">
                <CheckCircle2 className="w-4 h-4 text-[#FFB6C1]" />
                <span>Make everyday living more affordable and eco-friendly</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-[#FFC0CB]">SAVE MONEY, SHARE VALUE</span>
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="text-[11px] font-bold text-white hover:underline flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-lg hover:bg-white/20 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Auth Forms Side */}
        <div className="md:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-center">
          
          {/* Tab Navigation */}
          <div className="flex items-center space-x-2 bg-[#FFF0F5] p-1.5 rounded-2xl border border-[#FFC0CB]/60 mb-6">
            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(''); setResetSent(false); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-[#900C3F] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#900C3F]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setSignupStep('details'); setErrorMessage(''); setResetSent(false); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                activeTab === 'signup'
                  ? 'bg-[#900C3F] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#900C3F]'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4 font-semibold animate-fade-in flex items-start space-x-2">
              <span className="shrink-0 text-red-500 font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN (DIRECT LOGIN - NO OTP) */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address or Phone Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="name@gmail.com or 10-digit phone"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F] focus:ring-2 focus:ring-[#FFC0CB]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('forgot'); setForgotEmail(loginIdentifier); setErrorMessage(''); }}
                    className="text-[11px] font-bold text-[#900C3F] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F] focus:ring-2 focus:ring-[#FFC0CB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#900C3F] hover:bg-[#700931] disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Enter Community Closet</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {activeTab === 'signup' && signupStep === 'details' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a strong password (min 6 chars)"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Neighborhood</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Near PICT, Katraj"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              {/* Optional Profile Photo */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Optional Profile Photo</label>
                <div className="flex items-center space-x-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar Preview" className="w-8 h-8 rounded-full object-cover border border-[#FFC0CB]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FFF0F5] border border-[#FFC0CB] flex items-center justify-center text-xs text-[#900C3F] font-bold">
                      {name ? name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#FFF0F5] file:text-[#900C3F] hover:file:bg-[#FFE4E1]"
                  />
                </div>
              </div>

              {/* Optional Interests */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Interests & Specialities</label>
                <div className="flex flex-wrap gap-1.5">
                  {interestOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        selectedInterests.includes(tag)
                          ? 'bg-[#900C3F] text-white border-[#900C3F]'
                          : 'bg-[#FFF0F5] text-gray-600 border-[#FFC0CB] hover:bg-[#FFE4E1]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#900C3F] hover:bg-[#700931] disabled:opacity-50 text-white font-black py-2.5 rounded-xl text-xs shadow-md transition-all mt-2 flex items-center justify-center space-x-2"
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

              <p className="text-[10px] text-gray-400 text-center">
                A 6-digit code will be sent to your email address.
              </p>
            </form>
          )}

          {activeTab === 'signup' && signupStep === 'otp' && (
            <form onSubmit={handleVerifySignupOtp} className="space-y-4 animate-fade-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#900C3F] font-bold flex items-center justify-center mx-auto shadow-sm border border-[#FFC0CB]">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-gray-900">Email OTP Verification</h3>
                <p className="text-xs text-gray-500">
                  Enter the 6-digit code sent to <strong className="text-gray-900">{signupEmail}</strong>
                </p>
              </div>

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
                      className="w-10 sm:w-11 h-12 text-center text-lg font-mono font-black rounded-xl border-2 border-gray-300 bg-[#FFF0F5]/40 focus:bg-white focus:outline-none focus:border-[#900C3F] focus:ring-2 focus:ring-[#FFC0CB]"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpDigits.join('').length !== 6}
                className="w-full bg-[#900C3F] hover:bg-[#700931] disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm shadow-md transition-all"
              >
                {isSubmitting ? 'Verifying Code...' : 'Verify Code & Complete Registration'}
              </button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => { setSignupStep('details'); setErrorMessage(''); }}
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
                    onClick={() => { void handleResendSignupOtp(); }}
                    className="text-[#900C3F] hover:underline font-bold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD FORM */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 animate-fade-in">
              <div className="text-left">
                <h3 className="text-base font-extrabold text-gray-900">Reset Your Password</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter your registered Community Closet email address and we'll send you a password reset link.
                </p>
              </div>

              {resetSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Password Reset Link Sent!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    We sent an email to <strong>{forgotEmail}</strong>. Follow the link in the message to create your new password.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setResetSent(false); }}
                    className="text-xs font-bold text-[#900C3F] underline pt-1 block"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#900C3F] hover:bg-[#700931] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
                  >
                    Send Password Reset Email
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                    className="w-full text-xs font-bold text-gray-500 hover:text-gray-800 py-1"
                  >
                    Cancel and Return to Sign In
                  </button>
                </>
              )}
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
