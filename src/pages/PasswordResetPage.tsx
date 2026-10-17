import React, { useState } from 'react';
import { Lock, Shield } from 'lucide-react';
import { updatePassword } from '../services/auth';

interface PasswordResetPageProps {
  onComplete: () => void;
}

export const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ onComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (password !== confirmation) {
      setError('The passwords do not match.');
      return;
    }

    setIsSaving(true);
    try {
      await updatePassword(password);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update your password.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF0F5] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-3xl border border-[#FFC0CB] bg-white p-8 shadow-xl">
        <div className="text-center">
          <Shield className="mx-auto mb-3 h-10 w-10 text-[#900C3F]" />
          <h1 className="text-2xl font-black text-gray-900">Choose a new password</h1>
          <p className="mt-1 text-sm text-gray-600">Enter and confirm your new account password.</p>
        </div>
        <label className="block text-sm font-semibold text-gray-700">
          New password
          <span className="relative mt-1 block">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3"
            />
          </span>
        </label>
        <label className="block text-sm font-semibold text-gray-700">
          Confirm new password
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5"
          />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-xl bg-[#900C3F] py-3 font-bold text-white disabled:opacity-60"
        >
          {isSaving ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </main>
  );
};
