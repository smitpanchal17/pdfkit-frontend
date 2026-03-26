'use client';
import { useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '@/lib/config';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle');
  const [msg, setMsg] = useState('');
  const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setMsg('Passwords do not match.'); setStatus('error'); return; }
    if (password.length < 8) { setMsg('Password must be at least 8 characters.'); setStatus('error'); return; }
    setStatus('loading');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setMsg(error.message); setStatus('error'); }
    else { setMsg('Password updated successfully! You can now sign in.'); setStatus('done'); }
  };

  return (
    <main style={{maxWidth:'420px',margin:'80px auto',padding:'40px 24px',color:'inherit'}}>
      <h1 style={{marginBottom:'8px',fontSize:'28px'}}>Set New Password</h1>
      <p style={{color:'#888',marginBottom:'32px'}}>Enter and confirm your new password below.</p>
      {status === 'done' ? (
        <div style={{padding:'16px',background:'rgba(198,255,0,0.1)',borderRadius:'8px',border:'1px solid #C6FF00'}}>
          <p style={{color:'#C6FF00',fontWeight:600,margin:0}}>{msg}</p>
        </div>
      ) : (
        <form onSubmit={handleReset} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <input
            type="password"
            placeholder="New password (min 8 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            style={{padding:'12px 16px',borderRadius:'8px',border:'1px solid #333',background:'#111',color:'#fff',fontSize:'16px',outline:'none'}}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            style={{padding:'12px 16px',borderRadius:'8px',border:'1px solid #333',background:'#111',color:'#fff',fontSize:'16px',outline:'none'}}
          />
          {msg && status === 'error' && (
            <p style={{color:'#ff4444',margin:0,fontSize:'14px'}}>{msg}</p>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{padding:'14px',borderRadius:'8px',background:'#C6FF00',border:'none',fontWeight:700,fontSize:'16px',cursor:'pointer',color:'#000',opacity:status==='loading'?0.7:1}}
          >
            {status === 'loading' ? 'Updating password...' : 'Update Password'}
          </button>
        </form>
      )}
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{padding:'80px 24px',textAlign:'center'}}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
