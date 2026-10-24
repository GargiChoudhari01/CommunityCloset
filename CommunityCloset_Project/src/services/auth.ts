import type { User } from '../types';
import { requireSupabase, isSupabaseConfigured } from './supabase';

export interface SignUpDetails {
  name: string;
  locationAddress: string;
  avatar?: string;
  bio?: string;
}

export interface OtpResult {
  success: boolean;
  message: string;
  previewCode?: string;
  mode: 'supabase' | 'simulated';
}

interface StoredOtp {
  code: string;
  expiresAt: number;
  attempts: number;
}

const SIGNUP_OTP_STORAGE_KEY = 'community_closet_signup_otp_store';

function getOtpStore(): Record<string, StoredOtp> {
  try {
    const raw = sessionStorage.getItem(SIGNUP_OTP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOtpStore(store: Record<string, StoredOtp>) {
  try {
    sessionStorage.setItem(SIGNUP_OTP_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function clearStoredOtp(email: string) {
  const store = getOtpStore();
  delete store[email.trim().toLowerCase()];
  saveOtpStore(store);
}

export function mapAuthUser(authUser: {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  created_at: string;
  user_metadata: Record<string, unknown>;
  app_metadata: Record<string, unknown>;
}): User {
  const metadata = authUser.user_metadata;
  return {
    id: authUser.id,
    email: authUser.email || '',
    name: typeof metadata.name === 'string' ? metadata.name : authUser.email?.split('@')[0] || 'Community member',
    role: authUser.app_metadata.role === 'admin' ? 'admin' : 'user',
    avatar: typeof metadata.avatar_url === 'string' ? metadata.avatar_url : undefined,
    bio: typeof metadata.bio === 'string' ? metadata.bio : undefined,
    locationAddress: typeof metadata.location_address === 'string' ? metadata.location_address : 'Katraj, Pune, Maharashtra',
    lat: 18.4575,
    lng: 73.8508,
    ecoPoints: 100,
    co2SavedKg: 0,
    verified: Boolean(authUser.email_confirmed_at),
    status: 'active',
    createdAt: authUser.created_at,
  };
}

/**
 * Direct sign in with email and password (no OTP verification on sign-in).
 */
export async function signIn(email: string, password: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const isPlaceholderUrl = !supabaseUrl || supabaseUrl.includes('your-project-ref');

  if (isSupabaseConfigured && !isPlaceholderUrl) {
    const client = requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (error) throw error;
    return mapAuthUser(data.user);
  }

  // Fallback demo user for local development
  return {
    id: 'u1',
    name: normalizedEmail.split('@')[0],
    email: normalizedEmail,
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    locationAddress: 'Near PICT, Katraj, Pune',
    lat: 18.4575,
    lng: 73.8508,
    ecoPoints: 100,
    co2SavedKg: 0,
    verified: true,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Sends a 6-digit OTP code (code, not link) to the email address during account creation.
 */
export async function sendSignUpOtp(email: string): Promise<OtpResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  let supabaseSent = false;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const isPlaceholderUrl = !supabaseUrl || supabaseUrl.includes('your-project-ref');

  if (isSupabaseConfigured && !isPlaceholderUrl) {
    try {
      const client = requireSupabase();
      // Calling signInWithOtp triggers the OTP email template configured in Supabase.
      // In Supabase Dashboard -> Authentication -> Email Templates -> Magic Link,
      // changing {{ .ConfirmationURL }} to {{ .Token }} sends the 6-digit code.
      const { error } = await client.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
        },
      });
      if (!error) {
        supabaseSent = true;
      } else {
        console.warn('Supabase signUp OTP error, falling back to local OTP:', error.message);
      }
    } catch (err) {
      console.warn('Supabase signUp OTP threw, falling back to local OTP:', err);
    }
  }

  if (supabaseSent) {
    clearStoredOtp(normalizedEmail);
    return {
      success: true,
      message: `A 6-digit verification code was sent to ${normalizedEmail}. Please check your email inbox.`,
      mode: 'supabase',
    };
  }

  // Generate 6-digit OTP code for local development / demo presentation
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const store = getOtpStore();
  store[normalizedEmail] = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  };
  saveOtpStore(store);

  // Notify backend API if active
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, code }),
    }).catch(() => {});
  } catch {
    // Ignore backend errors
  }

  console.info(`[CommunityCloset Account Creation] 6-digit OTP code for ${normalizedEmail}: ${code}`);

  return {
    success: true,
    message: `Verification code generated for ${normalizedEmail}.`,
    previewCode: code,
    mode: 'simulated',
  };
}

/**
 * Verifies the 6-digit OTP code and creates the user account with provided details.
 */
export async function verifySignUpOtp(
  email: string,
  otp: string,
  password: string,
  details: SignUpDetails
): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  let cleanedOtp = otp.trim();

  // If user pasted a link or full URL containing a token parameter, extract it
  const tokenInUrl = cleanedOtp.match(/[?&#]token=([a-zA-Z0-9_-]+)/);
  if (tokenInUrl) {
    cleanedOtp = tokenInUrl[1];
  } else {
    cleanedOtp = cleanedOtp.replace(/\s+/g, '');
  }

  if (!cleanedOtp || (cleanedOtp.length !== 6 && !tokenInUrl)) {
    throw new Error('Please enter the complete 6-digit verification code.');
  }

  const store = getOtpStore();
  const simulatedRecord = store[normalizedEmail];

  // 1. Verify against simulated OTP store
  if (simulatedRecord) {
    if (Date.now() > simulatedRecord.expiresAt) {
      delete store[normalizedEmail];
      saveOtpStore(store);
      throw new Error('Verification code has expired. Please request a new code.');
    }

    if (simulatedRecord.code !== cleanedOtp) {
      simulatedRecord.attempts += 1;
      saveOtpStore(store);
      if (simulatedRecord.attempts >= 5) {
        delete store[normalizedEmail];
        saveOtpStore(store);
        throw new Error('Too many failed attempts. Please request a new verification code.');
      }
      throw new Error('Incorrect verification code. Please check your email and try again.');
    }

    // Success - clean up OTP
    delete store[normalizedEmail];
    saveOtpStore(store);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const isPlaceholderUrl = !supabaseUrl || supabaseUrl.includes('your-project-ref');

    if (isSupabaseConfigured && !isPlaceholderUrl) {
      try {
        const client = requireSupabase();
        const { data } = await client.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              name: details.name,
              location_address: details.locationAddress,
              avatar_url: details.avatar,
              bio: details.bio,
            },
          },
        });
        if (data.user) {
          return mapAuthUser(data.user);
        }
      } catch (err) {
        console.warn('Supabase signUp error after OTP verification:', err);
      }
    }

    return {
      id: `u-${Date.now()}`,
      email: normalizedEmail,
      name: details.name || normalizedEmail.split('@')[0],
      role: 'user',
      avatar: details.avatar,
      bio: details.bio,
      locationAddress: details.locationAddress || 'Katraj, Pune, Maharashtra',
      lat: 18.4575,
      lng: 73.8508,
      ecoPoints: 100,
      co2SavedKg: 0,
      verified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  }

  // 2. Verify with Supabase if live
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const isPlaceholderUrl = !supabaseUrl || supabaseUrl.includes('your-project-ref');

  if (isSupabaseConfigured && !isPlaceholderUrl) {
    const client = requireSupabase();
    const { data, error } = await client.auth.verifyOtp({
      email: normalizedEmail,
      token: cleanedOtp,
      type: 'email',
    });

    if (error) {
      const retry = await client.auth.verifyOtp({
        email: normalizedEmail,
        token: cleanedOtp,
        type: 'signup',
      });
      if (retry.error) throw retry.error;
      if (retry.data.user) {
        await client.auth.updateUser({
          data: {
            name: details.name,
            location_address: details.locationAddress,
            avatar_url: details.avatar,
            bio: details.bio,
          },
        });
        return mapAuthUser(retry.data.user);
      }
    } else if (data.user) {
      await client.auth.updateUser({
        password,
        data: {
          name: details.name,
          location_address: details.locationAddress,
          avatar_url: details.avatar,
          bio: details.bio,
        },
      });
      return mapAuthUser(data.user);
    }
  }

  throw new Error('Invalid or expired verification code. Please request a new code.');
}

export async function signUp(email: string, password: string, details: SignUpDetails) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: details.name,
        location_address: details.locationAddress,
        avatar_url: details.avatar,
        bio: details.bio,
      },
    },
  });
  if (error) throw error;
  return {
    user: data.user ? mapAuthUser(data.user) : null,
    needsEmailConfirmation: !data.session,
  };
}

export async function signInWithGoogle(): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function sendPasswordReset(email: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/#reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword(password: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}
