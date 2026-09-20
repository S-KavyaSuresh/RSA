import { useState } from "react";
import { BookOpen, X, LockKeyhole, UnlockKeyhole, ArrowDown, ArrowRight, Lightbulb } from "lucide-react";
import RsaDemo from "./RsaDemo";
function Concept(){return <div className="learning-content">
 <div className="hero-learning"><span className="eyebrow">START HERE</span><h2>RSA, without the headache.</h2><p>RSA is a public-key cryptosystem: one key can be shared, while a mathematically related private key stays secret. Think of a lock that anyone can close, but only the owner can open.</p></div>
 <div className="learn-grid">
  <article className="learn-card"><div className="learn-icon"><LockKeyhole/></div><h3>What is RSA?</h3><p>RSA lets people communicate using a public key and a private key. This app focuses on encryption and decryption; RSA can also be used for digital signatures.</p></article>
  <article className="learn-card"><div className="learn-icon"><UnlockKeyhole/></div><h3>Two related keys</h3><p>The public key contains <b>e, n</b> and can be shared. The private key contains <b>d, n</b> and must be protected.</p></article>
 </div>
 <section className="learn-section"><h3>How key generation works</h3><div className="numbered">{[
 ["01","Choose p and q","Pick two different prime numbers."],
 ["02","Calculate n","Multiply them: n = p × q."],
 ["03","Calculate φ(n)","For distinct primes, φ(n) = (p − 1)(q − 1)."],
 ["04","Choose e","Pick e so gcd(e, φ(n)) = 1."],
 ["05","Calculate d","d is the modular inverse of e modulo φ(n)."],
 ["06","Build the keys","Public = (e, n). Private = (d, n)."]
 ].map(x=><div className="numbered-item" key={x[0]}><b>{x[0]}</b><div><strong>{x[1]}</strong><p>{x[2]}</p></div></div>)}</div></section>
 <section className="learn-section"><h3>RSA encryption & decryption</h3><div className="formula-grid"><div><span>ENCRYPT</span><code>C = M<sup>e</sup> mod n</code><p>M is the numeric message, e is public, and C is ciphertext.</p></div><ArrowRight/><div><span>DECRYPT</span><code>M = C<sup>d</sup> mod n</code><p>C is ciphertext, d is private, and the result recovers M under valid try-RSA conditions.</p></div></div></section>
 <section className="learn-section"><h3>RSA at a glance</h3><div className="rsa-diagram"><div className="diagram-top"><div><span>PUBLIC KEY</span><b>(e, n)</b></div><div><span>PRIVATE KEY</span><b>(d, n)</b></div></div><div className="diagram-row"><div className="node">Message</div><ArrowDown/><div className="node accent">ENCRYPT</div><ArrowDown/><div className="node">Ciphertext</div><ArrowDown/><div className="node accent">DECRYPT</div><ArrowDown/><div className="node">Original message</div></div></div></section>
 <section className="learn-section limitations"><h3><Lightbulb/> Know the limitations</h3><ul><li>Raw textbook RSA is not secure for real-world encryption.</li><li>RSA should not directly encrypt long messages.</li><li>OAEP padding is important for practical RSA encryption.</li><li>RSA is computationally heavier than simpler arithmetic operations, so real systems must choose parameters carefully.</li><li>Private keys must be protected.</li><li>Tiny demonstration primes can be factored easily.</li></ul></section>
 </div>}
export default function LearningCenter({onClose}){const [tab,setTab]=useState("learn");return <div className="modal-backdrop"><div className="learning-modal"><header className="modal-head"><div><span className="eyebrow">RSA LEARNING CENTER</span><h1>Unlock RSA</h1></div><button className="close-btn" onClick={onClose} aria-label="Close learning center"><X/></button></header><div className="tabs"><button className={tab==="learn"?"active":""} onClick={()=>setTab("learn")}><BookOpen size={17}/>Understand RSA</button><button className={tab==="demo"?"active":""} onClick={()=>setTab("demo")}><span className="tab-dot"/>Try the RSA Demo</button></div>{tab==="learn"?<Concept/>:<RsaDemo/>}</div></div>}
