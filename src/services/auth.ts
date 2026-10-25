
import type { User } from '../types';
import { requireSupabase, isSupabaseConfigured } from './supabase';

export interface SignUpDetails {
  name: string;
  locationAddress: string;
  phone?: string;
  email?: string;
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

const OTP_STORAGE_KEY = 'community_closet_otp_store';

function getOtpStore(): Record<string, StoredOtp> {
  try {
    const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOtpStore(store: Record<string, StoredOtp>) {
  try {
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage errors.
  }
}

export function clearStoredOtp(identifier: string) {
  const store = getOtpStore();
  delete store[identifier.trim().toLowerCase()];
  saveOtpStore(store);
}

/**
 * Validates an Indian 10-digit mobile number.
 */
export function validatePhoneNumber(
  phone: string
): { valid: boolean; cleanPhone: string; error?: string } {
  const cleanPhone = phone.replace(/\D/g, '');

  if (!cleanPhone) {
    return {
      valid: false,
      cleanPhone: '',
      error: 'Please enter your phone number.',
    };
  }

  if (cleanPhone.length !== 10) {
    return {
      valid: false,
      cleanPhone,
      error: `Phone number must be exactly 10 digits. (You entered ${cleanPhone.length} digits)`,
    };
  }

  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return {
      valid: false,
      cleanPhone,
      error: 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.',
    };
  }

  return { valid: true, cleanPhone };
}

/**
 * Creates an account and sends an email verification link.
 */
export async function sendSignUpLink(
  email: string,
  password: string,
  details: SignUpDetails
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!password) {
    throw new Error('Please enter a password.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const client = requireSupabase();

  const { data, error } = await client.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: {
        name: details.name.trim(),
        location_address: details.locationAddress,
        avatar_url: details.avatar,
        bio: details.bio,
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase();

    if (
      message.includes('already registered') ||
      message.includes('already exists') ||
      message.includes('already been registered') ||
      message.includes('user already registered')
    ) {
      throw new Error(
        'An account with this email already exists. Please sign in instead.'
      );
    }

    throw error;
  }

  // Supabase can return an indistinguishable success response for
  // an existing email. An empty identities array catches some such cases.
  // Supabase may return an existing email without a clear error.
if (data.user && data.user.identities?.length === 0) {
  throw new Error(
    'An account with this email already exists. Please sign in instead.'
  );
}
}

/**
 * Sends an email OTP. Retained for existing parts of the application
 * that still use OTP signup.
 */
export async function sendSignUpOtp(email: string): Promise<OtpResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const isPlaceholderUrl =
    !supabaseUrl || supabaseUrl.includes('your-project-ref');

  if (isSupabaseConfigured && !isPlaceholderUrl) {
    const { error } = await requireSupabase().auth.signInWithOtp({
      email: normalizedEmail,
      options: { shouldCreateUser: true },
    });

    if (error) throw error;

    clearStoredOtp(normalizedEmail);

    return {
      success: true,
      message: `A verification code was requested for ${normalizedEmail}.`,
      mode: 'supabase',
    };
  }

  const store = getOtpStore();
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  store[normalizedEmail] = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  };

  saveOtpStore(store);

  return {
    success: true,
    message: `Verification code generated for ${normalizedEmail}.`,
    previewCode: code,
    mode: 'simulated',
  };
}

/**
 * Verifies an email OTP and updates the account details.
 */
export async function verifySignUpOtp(
  email: string,
  otp: string,
  password: string,
  details: SignUpDetails
): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanedOtp = otp.trim().replace(/\s+/g, '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!/^\d{6}$/.test(cleanedOtp)) {
    throw new Error('Please enter the complete 6-digit verification code.');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const isPlaceholderUrl =
    !supabaseUrl || supabaseUrl.includes('your-project-ref');

  if (isSupabaseConfigured && !isPlaceholderUrl) {
    const client = requireSupabase();

    const { data, error } = await client.auth.verifyOtp({
      email: normalizedEmail,
      token: cleanedOtp,
      type: 'email',
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error(
        'Verification did not return an account. Please request a new code.'
      );
    }

    const { data: updatedData, error: updateError } =
      await client.auth.updateUser({
        password,
        data: {
          name: details.name,
          location_address: details.locationAddress,
          avatar_url: details.avatar,
          bio: details.bio,
        },
      });

    if (updateError) throw updateError;

    return mapAuthUser(updatedData.user);
  }

  const store = getOtpStore();
  const record = store[normalizedEmail];

  if (!record) {
    throw new Error('No verification code was requested for this email.');
  }

  if (Date.now() > record.expiresAt) {
    delete store[normalizedEmail];
    saveOtpStore(store);
    throw new Error('Verification code expired. Please request a new code.');
  }

  if (record.code !== cleanedOtp) {
    record.attempts += 1;

    if (record.attempts >= 5) {
      delete store[normalizedEmail];
      saveOtpStore(store);
      throw new Error('Too many failed attempts. Please request a new code.');
    }

    saveOtpStore(store);
    throw new Error('Incorrect verification code. Please try again.');
  }

  delete store[normalizedEmail];
  saveOtpStore(store);

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

/**
 * Converts a Supabase user into the app's User type.
 */
export function mapAuthUser(authUser: {
  id: string;
  email?: string;
  phone?: string;
  email_confirmed_at?: string | null;
  phone_confirmed_at?: string | null;
  created_at: string;
  user_metadata: Record<string, unknown>;
  app_metadata: Record<string, unknown>;
}): User {
  const metadata = authUser.user_metadata;

  return {
    id: authUser.id,
    email:
      authUser.email ||
      (typeof metadata.email === 'string' ? metadata.email : ''),
    phone:
      typeof metadata.phone === 'string'
        ? metadata.phone
        : authUser.phone,
    name:
      typeof metadata.name === 'string'
        ? metadata.name
        : authUser.email?.split('@')[0] || 'Community member',
    role: authUser.app_metadata.role === 'admin' ? 'admin' : 'user',
    avatar:
      typeof metadata.avatar_url === 'string'
        ? metadata.avatar_url
        : undefined,
    bio: typeof metadata.bio === 'string' ? metadata.bio : undefined,
    locationAddress:
      typeof metadata.location_address === 'string'
        ? metadata.location_address
        : 'Katraj, Pune, Maharashtra',
    lat: 18.4575,
    lng: 73.8508,
    ecoPoints: 100,
    co2SavedKg: 0,
    verified: Boolean(
      authUser.email_confirmed_at || authUser.phone_confirmed_at
    ),
    status: 'active',
    createdAt: authUser.created_at,
  };
}

/**
 * Signs in with email or phone and password.
 */
export async function signIn(
  identifier: string,
  password: string
): Promise<User> {
  const normalized = identifier.trim();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const isPlaceholderUrl =
    !supabaseUrl || supabaseUrl.includes('your-project-ref');

  if (isSupabaseConfigured && !isPlaceholderUrl) {
    const client = requireSupabase();
    const isEmail = normalized.includes('@');

    const credentials = isEmail
      ? { email: normalized.toLowerCase(), password }
      : { phone: `+91${normalized.replace(/\D/g, '')}`, password };

    const { data, error } =
      await client.auth.signInWithPassword(credentials);

    if (error) {
      if (!isEmail) {
        const fallbackEmail =
          `${normalized.replace(/\D/g, '')}@communitycloset.local`;

        const retry = await client.auth.signInWithPassword({
          email: fallbackEmail,
          password,
        });

        if (retry.error) throw error;

        return mapAuthUser(retry.data.user);
      }

      throw error;
    }

    return mapAuthUser(data.user);
  }

  // Local demo fallback.
  const cleanPhone = normalized.replace(/\D/g, '');

  return {
    id: 'u1',
    name: normalized.includes('@')
      ? normalized.split('@')[0]
      : `User ${cleanPhone.slice(-4)}`,
    email: normalized.includes('@')
      ? normalized.toLowerCase()
      : `${cleanPhone}@communitycloset.local`,
    phone: cleanPhone.length === 10 ? cleanPhone : '9876543210',
    role: 'user',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
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
 * Sends a phone OTP, using Supabase SMS if configured.
 */
export async function sendPhoneSignUpOtp(
  phone: string
): Promise<OtpResult> {
  const validation = validatePhoneNumber(phone);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cleanPhone = validation.cleanPhone;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const isPlaceholderUrl =
    !supabaseUrl || supabaseUrl.includes('your-project-ref');

  if (isSupabaseConfigured && !isPlaceholderUrl) {
    const client = requireSupabase();

    const { error } = await client.auth.signInWithOtp({
      phone: `+91${cleanPhone}`,
    });

    if (error) throw error;

    clearStoredOtp(cleanPhone);

    return {
      success: true,
      message: `A 6-digit verification code was requested via SMS for +91 ${cleanPhone}.`,
      mode: 'supabase',
    };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const store = getOtpStore();

  store[cleanPhone] = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  };

  saveOtpStore(store);

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    fetch(`${apiUrl}/api/auth/send-phone-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, code }),
    }).catch(() => {});
  } catch {
    // Ignore backend errors.
  }

  console.info(
    `[CommunityCloset Phone Verification] OTP for +91 ${cleanPhone}: ${code}`
  );

  return {
    success: true,
    message: `6-digit verification code generated for +91 ${cleanPhone}.`,
    previewCode: code,
    mode: 'simulated',
  };
}

/**
 * Verifies a phone OTP and creates or updates the account.
 */
export async function verifyPhoneSignUpOtp(
  phone: string,
  otp: string,
  password: string,
  details: SignUpDetails
): Promise<User> {
  const validation = validatePhoneNumber(phone);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cleanPhone = validation.cleanPhone;
  const cleanedOtp = otp.trim().replace(/\D/g, '');

  if (cleanedOtp.length !== 6) {
    throw new Error('Please enter the complete 6-digit verification code.');
  }

  const store = getOtpStore();
  const simulatedRecord = store[cleanPhone];

  if (simulatedRecord) {
    if (Date.now() > simulatedRecord.expiresAt) {
      delete store[cleanPhone];
      saveOtpStore(store);
      throw new Error('Verification code expired. Please request a new code.');
    }

    if (simulatedRecord.code !== cleanedOtp) {
      simulatedRecord.attempts += 1;

      if (simulatedRecord.attempts >= 5) {
        delete store[cleanPhone];
        saveOtpStore(store);
        throw new Error('Too many failed attempts. Please request a new code.');
      }

      saveOtpStore(store);
      throw new Error('Incorrect verification code. Please try again.');
    }

    delete store[cleanPhone];
    saveOtpStore(store);

    const generatedEmail =
      details.email || `${cleanPhone}@communitycloset.local`;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const isPlaceholderUrl =
      !supabaseUrl || supabaseUrl.includes('your-project-ref');

    if (isSupabaseConfigured && !isPlaceholderUrl) {
      const client = requireSupabase();

      const { data, error } = await client.auth.signUp({
        email: generatedEmail,
        password,
        options: {
          data: {
            name: details.name,
            phone: cleanPhone,
            location_address: details.locationAddress,
            avatar_url: details.avatar,
            bio: details.bio,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const user = mapAuthUser(data.user);
        user.phone = cleanPhone;
        return user;
      }

      throw new Error('Unable to create the account.');
    }

    return {
      id: `u-${Date.now()}`,
      email: generatedEmail,
      phone: cleanPhone,
      name: details.name || `Neighbor ${cleanPhone.slice(-4)}`,
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

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const isPlaceholderUrl =
    !supabaseUrl || supabaseUrl.includes('your-project-ref');

  if (isSupabaseConfigured && !isPlaceholderUrl) {
    const client = requireSupabase();

    const { data, error } = await client.auth.verifyOtp({
      phone: `+91${cleanPhone}`,
      token: cleanedOtp,
      type: 'sms',
    });

    if (error) throw error;

    if (data.user) {
      const { data: updatedData, error: updateError } =
        await client.auth.updateUser({
          password,
          data: {
            name: details.name,
            phone: cleanPhone,
            location_address: details.locationAddress,
            avatar_url: details.avatar,
            bio: details.bio,
          },
        });

      if (updateError) throw updateError;

      const user = mapAuthUser(updatedData.user);
      user.phone = cleanPhone;
      return user;
    }
  }

  throw new Error(
    'Invalid or expired verification code. Please request a new code.'
  );
}

/**
 * Legacy signup helper retained for existing callers.
 */
export async function signUp(
  email: string,
  password: string,
  details: SignUpDetails
) {
  const client = requireSupabase();

  const { data, error } = await client.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: {
        name: details.name,
        phone: details.phone,
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

  const { error } = await client.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    {
      redirectTo: `${window.location.origin}/#reset-password`,
    }
  );

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
