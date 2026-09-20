import { useState } from "react";
import { BookOpen, KeyRound, ShieldCheck, Sparkles, Github, RotateCcw, LockKeyhole, ArrowRight, Zap } from "lucide-react";
import { generateRsaKeyPair } from "./utils/rsaCrypto";
import KeyGenerationFlow from "./components/KeyGenerationFlow";
import KeyPairDisplay from "./components/KeyPairDisplay";
import EncryptionPanel from "./components/EncryptionPanel";
import DecryptionPanel from "./components/DecryptionPanel";
import LearningCenter from "./components/LearningCenter";

export default function App(){
 const [keys,setKeys]=useState(null),[gen,setGen]=useState(false),[error,setError]=useState(""),[learning,setLearning]=useState(false),[encrypted,setEncrypted]=useState(null),[active,setActive]=useState("encrypt");
 const generate=async()=>{setError("");setGen(true);try{await new Promise(r=>setTimeout(r,450));const k=await generateRsaKeyPair();setKeys(k);setActive("encrypt")}catch(e){setError(e.message||"Key generation failed.")}finally{setGen(false)}};
 return <div className="app-shell">
  <header className="navbar"><div className="brand"><div className="brand-mark"><KeyRound size={20}/></div><div><strong>RSA Explorer</strong><span>Cryptography, made understandable.</span></div></div><div className="nav-actions"><button className="learn-btn" onClick={()=>setLearning(true)}><Sparkles size={16}/>How does RSA actually work?</button></div></header>
  <main>
   <section className="hero"><div className="hero-copy"><div className="pill"><span/>INTERACTIVE CRYPTOGRAPHY LAB</div><h1>Understand the mathematics.<br/><em>Explore the keys.</em><br/>Experience encryption.</h1><p>Generate a real browser RSA key pair, encrypt short messages directly with RSA, and step through toy RSA math without the scary jargon.</p><div className="hero-actions"><button className="primary-btn large" onClick={generate} disabled={gen}>{gen?"Generating secure keys…":"Generate RSA Keys"}<ArrowRight size={18}/></button><button className="secondary-btn large" onClick={()=>setLearning(true)}><BookOpen size={18}/> Learn RSA</button></div><div className="trust-row"><span><ShieldCheck size={15}/> Web Crypto API</span><span><LockKeyhole size={15}/> RSA-OAEP / SHA-256</span><span><Zap size={15}/> Runs locally</span></div></div><div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="cipher-core"><KeyRound size={48}/><span>RSA</span></div><div className="float-card card-one"><span>PUBLIC</span><b>(e, n)</b></div><div className="float-card card-two"><span>PRIVATE</span><b>(d, n)</b></div></div></section>
   <section className="workspace">
    <div className="section-heading"><div><span className="eyebrow">01 / KEY MANAGEMENT</span><h2>Your RSA key pair</h2><p>Start with a 2048-bit RSA-OAEP key pair. The browser generates it using the Web Crypto API.</p></div><button className="secondary-btn" onClick={generate} disabled={gen}><RotateCcw size={16}/>{keys?"Generate New Keys":"Generate RSA Keys"}</button></div>
    {error&&<div className="alert error">{error}</div>}
    <KeyGenerationFlow active={gen?Math.min(6,Math.floor(performance.now()%700/100)):7} done={!!keys&&!gen}/>
    {keys?<><KeyPairDisplay keys={keys}/><div className="key-meta"><span><b>Algorithm</b>{keys.algorithm}</span><span><b>Key size</b>{keys.keySize} bits</span><span><b>Status</b><i className="status-dot"/>Ready</span></div></>:<div className="empty-state"><div><KeyRound size={30}/></div><h3>No key pair yet</h3><p>Generate keys to unlock encryption and decryption.</p></div>}
   </section>
   <section className="workspace"><div className="section-heading"><div><span className="eyebrow">02 / MESSAGE WORKSPACE</span><h2>Encrypt or decrypt</h2><p>Use the public key to encrypt. Use the private key to decrypt.</p></div><div className="segmented"><button className={active==="encrypt"?"active":""} onClick={()=>setActive("encrypt")}><LockKeyhole size={16}/>Encrypt</button><button className={active==="decrypt"?"active":""} onClick={()=>setActive("decrypt")}><KeyRound size={16}/>Decrypt</button></div></div>
    <div className="panel-grid">{active==="encrypt"?<EncryptionPanel keys={keys} onEncrypted={pkg=>{setEncrypted(pkg);setActive("decrypt")}}/>:<DecryptionPanel keys={keys} prefill={encrypted} />}</div>
   </section>
   <section className="learn-banner"><div className="learn-banner-icon"><BookOpen/></div><div><span className="eyebrow">03 / LEARNING CENTER</span><h2>RSA makes more sense when you can touch the math.</h2><p>See key generation, encryption formulas, and a fully interactive toy example with p = 11 and q = 13.</p></div><button className="primary-btn" onClick={()=>setLearning(true)}>Explore RSA <ArrowRight size={17}/></button></section>
  </main>
  <footer><span>RSA Explorer · University Cryptography & Network Security</span><span>Educational project · Never use toy RSA for real secrets.</span></footer>
  {learning&&<LearningCenter onClose={()=>setLearning(false)}/>}
 </div>
}