import { useEffect, useState } from 'react';
import { KeyRound, RotateCcw, Unlock } from 'lucide-react';
import CopyButton from './CopyButton';

export default function DecryptionPanel({ keys, prefill, onReset }) {
  const [cipher, setCipher] = useState(prefill || '');
  const [plain, setPlain] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [ms, setMs] = useState(null);

  useEffect(() => {
    if (prefill) setCipher(prefill);
  }, [prefill]);

  const decrypt = async () => {
    setError('');
    setPlain('');
    if (!keys) return setError('Generate RSA keys first.');
    if (!cipher.trim()) return setError('Paste an RSA ciphertext first.');

    setBusy(true);
    const start = performance.now();
    try {
      const { rsaDecrypt } = await import('../utils/rsaCrypto');
      const out = await rsaDecrypt(cipher.trim(), keys.privateKey);
      setPlain(out);
      setMs((performance.now() - start).toFixed(2));
    } catch {
      setError('RSA decryption failed. The ciphertext may be corrupted, malformed, or encrypted for a different private key.');
    } finally {
      setBusy(false);
    }
  };

  return <section className="panel">
    <div className="panel-head">
      <div><span className="eyebrow">RSA PRIVATE-KEY WORKFLOW</span><h2><Unlock size={20}/> Decrypt a message</h2></div>
      <button className="ghost-btn" onClick={() => { setCipher(''); setPlain(''); setError(''); onReset?.(); }}><RotateCcw size={15}/>Reset</button>
    </div>
    <p className="muted">Paste the RSA ciphertext produced by this application. The private RSA key is used directly to recover the original short message.</p>
    <textarea value={cipher} onChange={e => setCipher(e.target.value)} maxLength={10000} placeholder='Paste the RSA ciphertext here' aria-label="RSA encrypted ciphertext" />
    <div className="row-between"><span className="counter">{cipher.length}/10000</span><button className="primary-btn" disabled={busy || !keys} onClick={decrypt}>{busy ? 'Decrypting…' : 'Decrypt with RSA'}<KeyRound size={17}/></button></div>
    {error && <div className="alert error">{error}</div>}
    {plain && <div className="result-card success"><div className="result-head"><div><span className="eyebrow">PLAINTEXT RECOVERED</span><h3>{plain}</h3></div><CopyButton value={plain}/></div><p className="muted">RSA decryption completed in {ms} ms.</p></div>}
  </section>;
}
