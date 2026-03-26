'use client';
import { useState, Suspense } from 'react';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setMsg('Passwords do not match.'); setStatus('error'); return; }
    if (password.length < 8) { setMsg('Password must be at least 8 characters.'); setStatus('error'); return; }
    setStatus('loading');
    const sb = (window as any).supabase;
    if (!sb) { setMsg('Auth not ready. Please refresh and try again.'); setStatus('error'); return; }
    const { error } = await sb.auth.updateUser({ password });
    if (error) { setMsg(error.message); setStatus('error'); }
    else { setMsg('Password updated! Redirecting...'); setStatus('done'); setTimeout(() => { window.location.href = '/'; }, 2000); }
  };

  return (
    <main style={{maxWidth:'420px',margin:'80px auto',padding:'40px 24px',color:'inherit',fontFamily:'inherit'}}>
      <h1 style={{fontSize:'28px',fontWeight:700,marginBottom:'8px'}}>Set New Password</h1>
      <p style={{color:'#888',marginBottom:'32px'}}>Enter and confirm your new password below.</p>
      {status === 'done' ? (
        <div style={{padding:'16px 20px',background:'rgba(198,255,0,0.08)',borderRadius:'12px',border:'1px solid rgba(198,255,0,0.3)'}}>
          <p style={{color:'#C6FF00',fontWeight:600,margin:0}}>{msg}</p>
        </div>
      ) : (
        <form onSubmit={handleReset} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <input type="password" placeholder="New password (min 8 chars)" value={password}
            onChange={e => setPassword(e.target.value)} required minLength={8}
            style={{padding:'12px 16px',borderRadius:'8px',border:'1px solid #2a2a2a',background:'#111',color:'#fff',fontSize:'16px',width:'100%',boxSizing:'border-box' as any}} />
          <input type="password" placeholder="Confirm new password" value={confirm}
            onChange={e => setConfirm(e.target.value)} required
            style={{padding:'12px 16px',borderRadius:'8px',border:'1px solid #2a2a2a',background:'#111',color:'#fff',fontSize:'16px',width:'100%',boxSizing:'border-box' as any}} />
          {msg && status === 'error' && <p style={{color:'#ff5555',margin:0,fontSize:'14px'}}>{msg}</p>}
          <button type="submit" disabled={status === 'loading'}
            style={{padding:'14px',borderRadius:'8px',background:'#C6FF00',border:'none',fontWeight:700,fontSize:'16px',cursor:'pointer',color:'#000',width:'100%',opacity:status==='loading'?0.7:1}}>
            {status === 'loading' ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{padding:'80px 24px',textAlign:'center',color:'#888'}}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
