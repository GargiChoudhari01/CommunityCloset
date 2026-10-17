import type { User } from '../types';
import { requireSupabase } from './supabase';

export interface SignUpDetails {
  name: string;
  locationAddress: string;
  avatar?: string;
  bio?: string;
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

export async function signIn(email: string, password: string): Promise<User> {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return mapAuthUser(data.user);
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
