'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/lib/supabase';

const PAGE_SIZE = 50;
const ACCOUNT = { email: 'banatokenproject@gmail.com', password: '12345' };
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

interface UserRecord {
  address: string;
  join_date: string;
}

interface AttestationRecord {
  id: number;
  address: string;
  checkup_date: string;
  checkup_type: string;
  attested_at: string;
}

interface DailyData {
  date: string;
  newUsers: number;
  cumulative: number;
}

// ─── Login Gate ────────────────────────────────────────────────────────────────

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(() => parseInt(localStorage.getItem('login_attempts') ?? '0'));
  const [lockedUntil, setLockedUntil] = useState<number | null>(() => {
    const s = localStorage.getItem('login_locked_until');
    return s ? parseInt(s) : null;
  });
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const left = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (left <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        localStorage.removeItem('login_locked_until');
        localStorage.removeItem('login_attempts');
        setRemaining(0);
      } else {
        setRemaining(left);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    if (email === ACCOUNT.email && password === ACCOUNT.password) {
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('login_locked_until');
      sessionStorage.setItem('users_auth', '1');
      onSuccess();
    } else {
      const next = attempts + 1;
      setAttempts(next);
      localStorage.setItem('login_attempts', String(next));
      setPassword('');
      if (next >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS;
        setLockedUntil(until);
        localStorage.setItem('login_locked_until', String(until));
        setError('');
      } else {
        setError(`Invalid email or password. ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next === 1 ? '' : 's'} remaining.`);
      }
    }
  };

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image src="/logo_alt.png" alt="BANA logo" width={56} height={56} unoptimized className="mx-auto mb-4 h-14 w-14 object-contain" />
          <h1 className="text-xl font-semibold text-white">BANA Protocol</h1>
          <p className="mt-1 text-[13px] text-white/40">Sign in to access user statistics</p>
        </div>
        {isLocked ? (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-8 text-center">
            <p className="text-[13px] font-medium text-red-400">Account temporarily locked</p>
            <p className="mt-1 text-[12px] text-white/40">Too many failed attempts</p>
            <p className="mt-4 text-2xl font-bold tabular-nums text-white">{mins}:{String(secs).padStart(2, '0')}</p>
            <p className="mt-1 text-[11px] text-white/30">remaining</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoFocus
              className={`w-full rounded-2xl border px-5 py-4 text-[14px] text-white placeholder-white/30 outline-none bg-white/6 backdrop-blur-xl transition-all duration-300 ${error ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 focus:border-violet-400/60'}`} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
              className={`w-full rounded-2xl border px-5 py-4 text-[14px] text-white placeholder-white/30 outline-none bg-white/6 backdrop-blur-xl transition-all duration-300 ${error ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 focus:border-violet-400/60'}`} />
            {error && <p className="text-[12px] text-red-400 text-center">{error}</p>}
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 py-4 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_6px_24px_rgba(139,92,246,0.5)] hover:-translate-y-0.5">
              Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-xl">
      <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-[12px] text-white/40">{sub}</p>}
    </div>
  );
}

// ─── Chart Tab ─────────────────────────────────────────────────────────────────

function ChartTab({ daily, attestDaily }: { daily: DailyData[]; attestDaily: AttestDailyData[] }) {
  const total = daily[daily.length - 1]?.cumulative ?? 0;
  const todayCount = daily[daily.length - 1]?.newUsers ?? 0;
  const avgCount = daily.length > 0 ? Math.round(total / daily.length) : 0;
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const chartData = daily.map((d) => ({ date: d.date.slice(5), newUsers: d.newUsers, cumulative: d.cumulative }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={total.toLocaleString()} sub={`As of ${todayStr}`} />
        <StatCard label="Daily Avg" value={`+${avgCount.toLocaleString()}`} sub={`Per day over ${daily.length} days`} />
        <StatCard label="Today" value={`+${todayCount.toLocaleString()}`} sub={todayStr} />
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-xl">
        <p className="mb-1 text-[13px] font-semibold text-white">Cumulative Users</p>
        <p className="mb-6 text-[11px] text-white/40 uppercase tracking-widest">Feb 19, 2026 – {todayStr}</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} interval={14} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={36} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} itemStyle={{ color: '#a78bfa' }} formatter={(v) => [(v as number).toLocaleString(), 'Total Users']} />
            <Area type="monotone" dataKey="cumulative" stroke="#8b5cf6" strokeWidth={2} fill="url(#cumGrad)" dot={false} activeDot={{ r: 4, fill: '#8b5cf6' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {attestDaily.length > 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-xl">
          <p className="mb-1 text-[13px] font-semibold text-white">Cumulative Attestations</p>
          <p className="mb-6 text-[11px] text-white/40 uppercase tracking-widest">Health Proof · All time</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={attestDaily} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="attestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} interval={Math.floor(attestDaily.length / 6)} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)} width={40} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} itemStyle={{ color: '#10b981' }} formatter={(v) => [(v as number).toLocaleString(), 'Total Attestations']} />
              <Area type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2} fill="url(#attestGrad)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-xl">
        <p className="mb-1 text-[13px] font-semibold text-white">Daily New Users</p>
        <p className="mb-6 text-[11px] text-white/40 uppercase tracking-widest">Feb 19, 2026 – {todayStr}</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} interval={14} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} itemStyle={{ color: '#60a5fa' }} formatter={(v) => [(v as number).toLocaleString(), 'New Users']} />
            <Area type="monotone" dataKey="newUsers" stroke="#3b82f6" strokeWidth={2} fill="url(#dailyGrad)" dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Users Tab ─────────────────────────────────────────────────────────────────

function UsersTab({ total }: { total: number }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [filteredTotal, setFilteredTotal] = useState(total);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(filteredTotal / PAGE_SIZE);

  const fetchUsers = useCallback(async (p: number, q: string) => {
    setLoading(true);
    const from = (p - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('wallets').select('address, join_date', { count: 'exact' }).order('join_date', { ascending: false });
    if (q) query = query.ilike('address', `%${q}%`);
    query = query.range(from, to);

    const { data, count } = await query;
    setUsers(data ?? []);
    setFilteredTotal(count ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchUsers(page, search);
  }, [page, search, fetchUsers]);

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const exportCsv = async () => {
    let query = supabase.from('wallets').select('address, join_date').order('join_date', { ascending: false });
    if (search) query = query.ilike('address', `%${search}%`);
    const { data } = await query;
    if (!data) return;
    const rows = ['No,Wallet Address,Join Date', ...data.map((u, i) => `${i + 1},${u.address},${u.join_date}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bana_users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/8">
        <p className="text-[13px] font-semibold">
          All Users
          <span className="ml-2 text-white/40 font-normal">{filteredTotal.toLocaleString()} records</span>
        </p>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Search wallet address..." value={search} onChange={(e) => handleSearch(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/6 px-4 py-2 text-[12px] text-white placeholder-white/30 outline-none focus:border-violet-400/60 w-full sm:w-56 transition-colors" />
          <button onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/6 px-4 py-2 text-[12px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/6 text-white/40 text-[11px] uppercase tracking-widest">
              <th className="px-6 py-3 text-left w-12">#</th>
              <th className="px-6 py-3 text-left">Wallet Address</th>
              <th className="px-6 py-3 text-left">Join Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-white/30">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-white/30">No results found.</td></tr>
            ) : users.map((user, i) => (
              <tr key={user.address} className="border-b border-white/4 hover:bg-white/4 transition-colors">
                <td className="px-6 py-3 text-white/30 tabular-nums">{((page - 1) * PAGE_SIZE + i + 1).toLocaleString()}</td>
                <td className="px-6 py-3 font-mono text-white/80">
                  <span className="hidden sm:inline">{user.address}</span>
                  <span className="sm:hidden">{user.address.slice(0, 10)}...{user.address.slice(-6)}</span>
                </td>
                <td className="px-6 py-3 text-white/50">{user.join_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/8">
          <p className="text-[12px] text-white/40">Page {page} of {totalPages.toLocaleString()}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="rounded-lg px-3 py-1.5 text-[12px] text-white/50 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">«</button>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg px-3 py-1.5 text-[12px] text-white/50 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">‹</button>
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${p === page ? 'bg-gradient-to-br from-violet-500 to-blue-500 text-white' : 'text-white/50 hover:bg-white/8'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg px-3 py-1.5 text-[12px] text-white/50 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">›</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="rounded-lg px-3 py-1.5 text-[12px] text-white/50 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">»</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Attestations Tab ──────────────────────────────────────────────────────────

interface AttestDailyData {
  date: string;
  newCount: number;
  cumulative: number;
}

function AttestationsTab() {
  const [attestations, setAttestations] = useState<AttestationRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchAttestations = useCallback(async (p: number) => {
    setLoading(true);
    const from = (p - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, count } = await supabase
      .from('attestations')
      .select('id, address, checkup_date, checkup_type, attested_at', { count: 'exact' })
      .order('attested_at', { ascending: false })
      .range(from, to);
    setAttestations(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchAttestations(page);
  }, [page, fetchAttestations]);

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total Attestations" value={total.toLocaleString()} />
        <StatCard label="BANA Distributed" value={(total * 100).toLocaleString()} sub="100 BANA per attestation" />
      </div>


      <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <p className="text-[13px] font-semibold">
            Attestation Records
            <span className="ml-2 text-white/40 font-normal">{total.toLocaleString()} total</span>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/6 text-white/40 text-[11px] uppercase tracking-widest">
                <th className="px-6 py-3 text-left w-12">#</th>
                <th className="px-6 py-3 text-left">Wallet Address</th>
                <th className="px-6 py-3 text-left">Checkup Type</th>
                <th className="px-6 py-3 text-left">Checkup Date</th>
                <th className="px-6 py-3 text-left">Attested At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-white/30">Loading...</td></tr>
              ) : attestations.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-white/30">No attestations yet.</td></tr>
              ) : attestations.map((a, i) => (
                <tr key={a.id} className="border-b border-white/4 hover:bg-white/4 transition-colors">
                  <td className="px-6 py-3 text-white/30 tabular-nums">{((page - 1) * PAGE_SIZE + i + 1).toLocaleString()}</td>
                  <td className="px-6 py-3 font-mono text-white/80">
                    <span className="hidden sm:inline">{a.address}</span>
                    <span className="sm:hidden">{a.address.slice(0, 10)}...{a.address.slice(-6)}</span>
                  </td>
                  <td className="px-6 py-3 text-white/60">{a.checkup_type}</td>
                  <td className="px-6 py-3 text-white/50">{a.checkup_date}</td>
                  <td className="px-6 py-3 text-white/50">{new Date(a.attested_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/8">
            <p className="text-[12px] text-white/40">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1} className="rounded-lg px-3 py-1.5 text-[12px] text-white/50 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">«</button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg px-3 py-1.5 text-[12px] text-white/50 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">‹</button>
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${p === page ? 'bg-gradient-to-br from-violet-500 to-blue-500 text-white' : 'text-white/50 hover:bg-white/8'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg px-3 py-1.5 text-[12px] text-white/50 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">›</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="rounded-lg px-3 py-1.5 text-[12px] text-white/50 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<'chart' | 'users' | 'attestations'>('chart');
  const [daily, setDaily] = useState<DailyData[]>([]);
  const [total, setTotal] = useState(0);
  const [attestDaily, setAttestDaily] = useState<AttestDailyData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('users_auth') === '1') setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    void (async () => {
      const [usersRes, attestRes] = await Promise.all([
        supabase.rpc('get_daily_stats'),
        supabase.rpc('get_attestation_stats'),
      ]);

      if (usersRes.data) {
        let cumulative = 0;
        const computed: DailyData[] = (usersRes.data as { join_date: string; daily_count: number }[]).map((row) => {
          cumulative += Number(row.daily_count);
          return { date: row.join_date, newUsers: Number(row.daily_count), cumulative };
        });
        setDaily(computed);
        setTotal(cumulative);
      }

      if (attestRes.data) {
        let cumulative = 0;
        const computed: AttestDailyData[] = (attestRes.data as { attest_date: string; daily_count: number }[]).map((row) => {
          cumulative += Number(row.daily_count);
          return { date: row.attest_date.slice(5), newCount: Number(row.daily_count), cumulative };
        });
        setAttestDaily(computed);
      }

      setLoadingData(false);
    })();
  }, [authed]);

  const tabs = useMemo(() => [['chart', 'Dashboard'], ['users', 'User List'], ['attestations', 'Attestations']] as const, []);

  if (!authed) return <PasswordGate onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="border-b border-white/8 bg-white/4 px-6 py-5 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo_alt.png" alt="BANA logo" width={36} height={36} unoptimized className="h-9 w-9 object-contain" />
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight">BANA Protocol</h1>
              <p className="text-[11px] text-white/50">User Statistics</p>
            </div>
          </div>
          <button onClick={() => { sessionStorage.removeItem('users_auth'); setAuthed(false); }} className="text-[12px] text-white/30 hover:text-white/60 transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div className="flex gap-1 rounded-2xl border border-white/8 bg-white/4 p-1 w-fit backdrop-blur-xl">
          {tabs.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`rounded-xl px-5 py-2.5 text-[13px] font-medium transition-all duration-200 ${tab === key ? 'bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-[0_4px_14px_rgba(139,92,246,0.35)]' : 'text-white/50 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin" />
          </div>
        ) : tab === 'chart' ? (
          <ChartTab daily={daily} attestDaily={attestDaily} />
        ) : tab === 'users' ? (
          <UsersTab total={total} />
        ) : (
          <AttestationsTab />
        )}
      </div>
    </div>
  );
}
