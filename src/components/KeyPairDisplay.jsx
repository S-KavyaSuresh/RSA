import { LockKeyhole, UnlockKeyhole } from "lucide-react";
import CopyButton from "./CopyButton";
export default function KeyPairDisplay({keys}) {
 if(!keys)return null;
 return <div className="key-grid">
  <div className="key-card public"><div className="key-card-head"><span><UnlockKeyhole size={18}/> Public key</span><span className="badge good">Shareable</span></div><code>{keys.publicKey}</code><CopyButton value={keys.publicKey}/><p>Used by others to encrypt data for you.</p></div>
  <div className="key-card private"><div className="key-card-head"><span><LockKeyhole size={18}/> Private key</span><span className="badge warn">Protect</span></div><code className="private-code">{keys.privateKey}</code><CopyButton value={keys.privateKey}/><p>Keep this secret. It decrypts data encrypted for you.</p></div>
 </div>
}