import { useMemo, useState } from "react";
import { Calculator, CheckCircle2, Lock, Unlock } from "lucide-react";
import { generateToyKeys, modPow } from "../utils/rsaMath";
import CopyButton from "./CopyButton";
function DemoStep({n,title,children}){return <div className="demo-step"><div className="step-no">{n}</div><div><h4>{title}</h4><div className="math">{children}</div></div></div>}
export default function RsaDemo(){
 const [p,setP]=useState("11"),[q,setQ]=useState("13"),[keys,setKeys]=useState(null),[error,setError]=useState("");
 const [text,setText]=useState("A"),[enc,setEnc]=useState(null),[dec,setDec]=useState(null);
 const generate=()=>{try{const k=generateToyKeys(p,q);setKeys(k);setError("");setEnc(null);setDec(null)}catch(e){setError(e.message)}};
 const encrypt=()=>{setEnc(null);setDec(null);if(!keys)return setError("Generate demo keys first.");if(!text||text.length>12)return setError("Enter a short word (maximum 12 characters).");const chars=[...text];const rows=[];for(const ch of chars){const m=BigInt(ch.codePointAt(0));if(m>=keys.n)return setError(`"${ch}" has code ${m}, but n is ${keys.n}. Choose larger demo primes.`);rows.push({ch,m,c:modPow(m,keys.e,keys.n)})}setEnc(rows);setError("")};
 const decrypt=()=>{if(!enc)return;setDec(enc.map(r=>({...r,recovered:modPow(r.c,keys.d,keys.n)})))};
 const calc=useMemo(()=>keys?keys:null,[keys]);
 return <div className="demo">
  <div className="warning"><strong>Try RSA demonstration</strong><span>Intentionally insecure and for learning only. Small primes can be factored easily.</span></div>
  <div className="demo-inputs"><label>Prime p<input value={p} onChange={e=>setP(e.target.value)} inputMode="numeric"/></label><label>Prime q<input value={q} onChange={e=>setQ(e.target.value)} inputMode="numeric"/></label><button className="primary-btn" onClick={generate}>Generate Demo Keys<Calculator size={17}/></button></div>
  {error&&<div className="alert error">{error}</div>}
  {calc&&<div className="calc-grid">
    <DemoStep n="01" title="Read the two primes"><div>p = <b>{keys.p}</b>, q = <b>{keys.q}</b></div></DemoStep>
    <DemoStep n="02" title="Calculate the modulus"><div>n = p × q = {keys.p} × {keys.q} = <b>{keys.n}</b></div></DemoStep>
    <DemoStep n="03" title="Calculate Euler's totient"><div>φ(n) = (p − 1)(q − 1) = {keys.p - 1n} × {keys.q - 1n} = <b>{keys.phi}</b></div></DemoStep>
    <DemoStep n="04" title="Choose public exponent"><div>e = <b>{keys.e}</b> and gcd({keys.e}, {keys.phi}) = 1</div></DemoStep>
    <DemoStep n="05" title="Calculate private exponent"><div>d × {keys.e} ≡ 1 (mod {keys.phi}) → d = <b>{keys.d}</b></div></DemoStep>
    <DemoStep n="06" title="Create the keys"><div><span className="key-inline"><Unlock size={15}/> Public = {keys.publicKey}</span><span className="key-inline"><Lock size={15}/> Private = {keys.privateKey}</span></div></DemoStep>
  </div>}
  {keys&&<div className="demo-encrypt">
   <div className="demo-section-head"><div><span className="eyebrow">STEP-BY-STEP ENCRYPTION</span><h3>Turn a short word into ciphertext</h3></div></div>
   <div className="demo-inputs word"><label>Message<input value={text} onChange={e=>setText(e.target.value)} maxLength={12}/></label><button className="secondary-btn" onClick={encrypt}>Encrypt Demo</button></div>
   {enc&&<div className="calc-grid compact">{enc.map((r,i)=><DemoStep key={i} n={String(i+1).padStart(2,"0")} title={`Character "${r.ch}"`}><div>Code M = {r.m} → C = {r.m}^{keys.e} mod {keys.n} = <b>{r.c}</b></div></DemoStep>)}</div>}
   {enc&&<div className="cipher-banner"><span>Ciphertext</span><code>{enc.map(r=>r.c).join(" ")}</code><CopyButton value={enc.map(r=>r.c).join(" ")}/><button className="primary-btn" onClick={decrypt}>Decrypt This Demo Ciphertext</button></div>}
   {dec&&<div className="result-card success"><h3>Decryption</h3>{dec.map((r,i)=><p key={i}><b>C = {r.c}</b> → {r.c}^{keys.d} mod {keys.n} = <b>{r.recovered}</b> → “{String.fromCodePoint(Number(r.recovered))}”</p>)}<div className="recovered"><span>Recovered message</span><strong>{dec.map(r=>String.fromCodePoint(Number(r.recovered))).join("")}</strong></div></div>}
  </div>}
 </div>
}