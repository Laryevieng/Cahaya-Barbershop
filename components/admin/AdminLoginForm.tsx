'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Password admin salah.');
        setLoading(false);
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Koneksi terganggu. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#181b22] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-[#c89b3c]/15 border border-[#c89b3c]/30 flex items-center justify-center text-[#c89b3c]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Admin Reservasi
          </h1>
          <p className="text-xs text-[#9ca3af]">Cahaya Barbershop Kuningan</p>
        </div>
      </div>

      <p className="text-xs text-[#9ca3af] mb-6 leading-relaxed">
        Area ini khusus staf dan pengelola untuk memantau kursi, mengonfirmasi booking, atau melepas slot no-show.
      </p>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="admin-password"
            className="block text-xs font-medium text-[#d1d5db] mb-2 uppercase tracking-wider"
          >
            Password Admin
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password admin..."
              required
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-[#0f1115] border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c89b3c] transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#c89b3c] hover:bg-[#b5892f] text-[#0f1115] flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#c89b3c]/15 cursor-pointer"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-[#0f1115]/30 border-t-[#0f1115] rounded-full animate-spin" />
          ) : (
            <>
              <span>Masuk Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
