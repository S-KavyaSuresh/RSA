import { useState } from 'react';
import { ArrowRight, Lock, RotateCcw } from 'lucide-react';
import CopyButton from './CopyButton';

export default function EncryptionPanel({ keys, onEncrypted, onReset }) {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

const encrypt = async () => {
  setError('');
  setResult(null);

  if (!keys) {
    return setError('Generate RSA keys first.');
  }

  if (!message.trim()) {
    return setError('Enter a short word or phrase before encrypting.');
  }

  const byteLength = new TextEncoder().encode(message).length;

  if (byteLength > 190) {
    return setError(
      'This RSA-OAEP key supports at most 190 UTF-8 bytes. Enter a short word or phrase.'
    );
  }

  setBusy(true);

  const start = performance.now();

  try {
    const { rsaEncrypt } = await import('../utils/rsaCrypto');

    const ciphertext = await rsaEncrypt(message, keys.publicKey);
    const executionMs = (performance.now() - start).toFixed(2);

    setResult({
      ciphertext,
      executionMs
    });

    onEncrypted?.(ciphertext);
  } catch (e) {
    setError(e.message || 'RSA encryption failed.');
  } finally {
    setBusy(false);
  }
};

  const ciphertext = result?.ciphertext || '';

  return <section className="panel">
    <div className="panel-head">
      <div><span className="eyebrow">RSA WORKFLOW</span><h2><Lock size={20}/> Encrypt a short message</h2></div>
      <button className="ghost-btn" onClick={() => { setMessage(''); setResult(null); setError(''); onReset?.(); }}><RotateCcw size={15}/>Reset</button>
    </div>
    <p className="muted">This workspace uses RSA-OAEP directly. Because RSA is not designed for long plaintexts, keep the message to a short word or phrase.</p>
    <textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={190} placeholder="Try: HELLO RSA" aria-label="Short message to encrypt" />
    <div className="row-between">
      <span className="counter">{new TextEncoder().encode(message).length}/190 bytes</span>
      <button className="primary-btn" disabled={busy || !keys} onClick={encrypt}>{busy ? 'Encrypting…' : 'Encrypt with RSA'}<ArrowRight size={17}/></button>
    </div>
    {error && <div className="alert error">{error}</div>}
    {result && <div className="result-card">
      <div className="result-head"><div><span className="eyebrow">RSA CIPHERTEXT</span><h3>Ciphertext</h3></div><CopyButton value={ciphertext}/></div>
      <div className="code-box">{ciphertext}</div>
      <button className="secondary-btn full" onClick={() => onEncrypted?.(ciphertext)}>Decrypt This Message</button>
    </div>}
  </section>;
}
