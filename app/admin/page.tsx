'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ── Types ──────────────────────────────────────────────
interface Stats {
  visits: { total: number; last7Days: number; last30Days: number };
  interactions: { total: number; top: { name: string; count: number }[] };
  pages: { top: { path: string; count: number }[] };
  messages: { total: number; unread: number };
  chart: { day: string; visits: number }[];
}

interface Message {
  id: string; name: string; email: string; subject: string;
  message: string; read: boolean; replied: boolean; createdAt: string;
}

// ── Stat card ─────────────────────────────────────────
function StatCard({ label, value, sub, color = '#00f5ff', icon }: {
  label: string; value: number | string; sub?: string;
  color?: string; icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neon-card p-6 flex items-start gap-4"
      style={{ borderColor: `${color}30` }}
    >
      <div className="w-12 h-12 flex items-center justify-center border flex-shrink-0"
        style={{ borderColor: `${color}40`, color }}>
        {icon}
      </div>
      <div>
        <p className="font-mono text-xs text-cyber-white/40 uppercase tracking-widest">{label}</p>
        <p className="font-display text-3xl font-black mt-1" style={{ color }}>{value}</p>
        {sub && <p className="font-mono text-xs text-cyber-white/30 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ── Login form ────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) onLogin();
      else setError('Contraseña incorrecta');
    } catch { setError('Error de conexión'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cyber-black bg-grid flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyber-cyan/5 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative neon-card p-10 w-full max-w-md mx-6"
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyber-cyan" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyber-cyan" />

        <div className="text-center mb-8">
          <p className="font-mono text-cyber-pink text-xs tracking-widest uppercase mb-2">
            Acceso restringido
          </p>
          <h1 className="font-display text-2xl font-black text-cyber-white uppercase tracking-widest">
            Admin Panel
          </h1>
          <div className="mt-3 w-16 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent mx-auto" />
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="font-mono text-xs text-cyber-cyan/70 uppercase tracking-widest block mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-cyber-navy border border-cyber-cyan/20 font-mono text-sm text-cyber-white placeholder-cyber-white/25 px-4 py-3 focus:outline-none focus:border-cyber-cyan transition-all"
            />
          </div>
          {error && (
            <p className="font-mono text-xs text-red-400">✗ {error}</p>
          )}
          <button type="submit" disabled={loading} className="btn-cyber w-full justify-center">
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────
function Dashboard() {
  const [stats, setStats]         = useState<Stats | null>(null);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'messages'>('overview');
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<Message | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, mRes] = await Promise.all([
        fetch('/api/analytics/stats'),
        fetch('/api/admin/messages'),
      ]);
      if (sRes.ok) setStats(await sRes.json());
      if (mRes.ok) setMessages((await mRes.json()).messages);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const markRead = async (id: string) => {
    await fetch('/api/admin/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: true }),
    });
    setMessages(ms => ms.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const chartData = stats?.chart.map(d => ({
    day: format(new Date(d.day), 'dd MMM', { locale: es }),
    visitas: d.visits,
  })) || [];

  const colors = ['#00f5ff', '#ff0080', '#7c00ff', '#00ff88', '#ffee00'];

  return (
    <div className="min-h-screen bg-cyber-black bg-grid">
      {/* Header */}
      <header className="border-b border-cyber-cyan/15 bg-cyber-black/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-cyber-pink text-xs tracking-widest uppercase">Admin Panel</p>
            <h1 className="font-display text-lg font-black text-cyber-white uppercase tracking-widest">
              FS<span className="text-cyber-cyan">.DEV</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchAll} className="font-mono text-xs text-cyber-white/40 hover:text-cyber-cyan transition-colors">
              ↺ Actualizar
            </button>
            <a href="/" className="btn-cyber text-xs py-1.5 px-4">← Portfolio</a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-cyber-cyan/10">
          {(['overview', 'messages'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-mono text-sm uppercase tracking-widest transition-colors relative ${
                activeTab === tab ? 'text-cyber-cyan' : 'text-cyber-white/40 hover:text-cyber-white/70'
              }`}
            >
              {tab === 'overview' ? 'Resumen' : `Mensajes ${stats?.messages.unread ? `(${stats.messages.unread})` : ''}`}
              {activeTab === tab && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-px bg-cyber-cyan" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              <p className="font-mono text-xs text-cyber-white/40">Cargando datos...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard label="Visitas totales" value={stats?.visits.total || 0} sub={`${stats?.visits.last7Days || 0} esta semana`} color="#00f5ff"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>}
                  />
                  <StatCard label="Últimos 30 días" value={stats?.visits.last30Days || 0} color="#ff0080"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
                  />
                  <StatCard label="Interacciones" value={stats?.interactions.total || 0} color="#7c00ff"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
                  />
                  <StatCard label="Mensajes" value={stats?.messages.total || 0} sub={`${stats?.messages.unread || 0} sin leer`} color="#00ff88"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Visits chart */}
                  <motion.div className="neon-card p-6 lg:col-span-2"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <p className="font-mono text-xs text-cyber-cyan/70 uppercase tracking-widest mb-6">
                      Visitas últimos 30 días
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,245,255,0.06)" />
                        <XAxis dataKey="day" tick={{ fontFamily: 'monospace', fontSize: 10, fill: 'rgba(232,244,248,0.4)' }} />
                        <YAxis tick={{ fontFamily: 'monospace', fontSize: 10, fill: 'rgba(232,244,248,0.4)' }} />
                        <Tooltip
                          contentStyle={{ background: '#0a0d1a', border: '1px solid rgba(0,245,255,0.3)', fontFamily: 'monospace', fontSize: 12 }}
                          labelStyle={{ color: '#00f5ff' }}
                          itemStyle={{ color: '#e8f4f8' }}
                        />
                        <Line type="monotone" dataKey="visitas" stroke="#00f5ff"
                          strokeWidth={2} dot={false}
                          style={{ filter: 'drop-shadow(0 0 4px #00f5ff)' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Top interactions */}
                  <motion.div className="neon-card p-6"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <p className="font-mono text-xs text-cyber-pink/70 uppercase tracking-widest mb-6">
                      Top interacciones
                    </p>
                    {stats?.interactions.top.length ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={stats.interactions.top} layout="vertical">
                          <XAxis type="number" tick={{ fontFamily: 'monospace', fontSize: 10, fill: 'rgba(232,244,248,0.4)' }} />
                          <YAxis dataKey="name" type="category" tick={{ fontFamily: 'monospace', fontSize: 10, fill: 'rgba(232,244,248,0.4)' }} width={80} />
                          <Tooltip
                            contentStyle={{ background: '#0a0d1a', border: '1px solid rgba(255,0,128,0.3)', fontFamily: 'monospace', fontSize: 12 }}
                            labelStyle={{ color: '#ff0080' }}
                          />
                          <Bar dataKey="count" radius={[0, 2, 2, 0]}>
                            {stats.interactions.top.map((_, i) => (
                              <Cell key={i} fill={colors[i % colors.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="font-mono text-xs text-cyber-white/30 text-center mt-8">Sin datos aún</p>
                    )}
                  </motion.div>
                </div>

                {/* Top pages */}
                <motion.div className="neon-card p-6 mt-6"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <p className="font-mono text-xs text-cyber-purple/70 uppercase tracking-widest mb-4">
                    Páginas más visitadas
                  </p>
                  <div className="space-y-3">
                    {stats?.pages.top.map((p, i) => (
                      <div key={p.path} className="flex items-center gap-4">
                        <span className="font-mono text-xs text-cyber-white/30 w-6">{String(i+1).padStart(2,'0')}</span>
                        <span className="font-mono text-sm text-cyber-white flex-1">{p.path || '/'}</span>
                        <div className="flex-1 h-1 bg-cyber-navy relative">
                          <div
                            className="h-full transition-all duration-1000"
                            style={{
                              width: `${stats?.pages.top[0] ? (p.count / stats.pages.top[0].count) * 100 : 0}%`,
                              background: colors[i % colors.length],
                              boxShadow: `0 0 6px ${colors[i % colors.length]}`,
                            }}
                          />
                        </div>
                        <span className="font-mono text-sm text-cyber-cyan w-12 text-right">{p.count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Messages list */}
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <p className="font-mono text-xs text-cyber-white/30 text-center py-16">Sin mensajes</p>
                  ) : messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      onClick={() => { setSelected(msg); markRead(msg.id); }}
                      whileHover={{ x: 4 }}
                      className={`neon-card p-4 cursor-pointer transition-all ${
                        selected?.id === msg.id ? 'border-cyber-cyan/60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!msg.read && <span className="w-2 h-2 rounded-full bg-cyber-pink flex-shrink-0" />}
                            <p className="font-mono text-sm text-cyber-white truncate">{msg.name}</p>
                          </div>
                          <p className="font-mono text-xs text-cyber-cyan/70 truncate mt-0.5">{msg.subject}</p>
                          <p className="font-mono text-xs text-cyber-white/30 mt-1">
                            {format(new Date(msg.createdAt), 'dd MMM yyyy HH:mm', { locale: es })}
                          </p>
                        </div>
                        {msg.replied && (
                          <span className="text-xs font-mono text-cyber-green flex-shrink-0">Respondido</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message detail */}
                <div className="neon-card p-6">
                  {selected ? (
                    <div className="space-y-4">
                      <div>
                        <p className="font-mono text-xs text-cyber-cyan/50 uppercase tracking-widest mb-1">De</p>
                        <p className="font-mono text-sm text-cyber-white">{selected.name}</p>
                        <p className="font-mono text-xs text-cyber-pink/70">{selected.email}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-cyber-cyan/50 uppercase tracking-widest mb-1">Asunto</p>
                        <p className="font-mono text-sm text-cyber-white">{selected.subject}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-cyber-cyan/50 uppercase tracking-widest mb-2">Mensaje</p>
                        <p className="font-mono text-sm text-cyber-white/70 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                      </div>
                      <div className="pt-4 border-t border-cyber-cyan/10 flex gap-3">
                        <a
                          href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                          className="btn-cyber text-xs py-2 px-4"
                        >
                          Responder
                        </a>
                        <button
                          onClick={() => {
                            fetch('/api/admin/messages', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: selected.id, replied: true }),
                            });
                            setMessages(ms => ms.map(m => m.id === selected.id ? { ...m, replied: true } : m));
                            setSelected(s => s ? { ...s, replied: true } : null);
                          }}
                          className="btn-cyber btn-cyber-pink text-xs py-2 px-4"
                        >
                          Marcar respondido
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-48">
                      <p className="font-mono text-xs text-cyber-white/30">Seleccioná un mensaje</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already logged in
    fetch('/api/analytics/stats').then(r => {
      if (r.ok) setAuthed(true);
    }).finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return authed ? <Dashboard /> : <LoginScreen onLogin={() => setAuthed(true)} />;
}
