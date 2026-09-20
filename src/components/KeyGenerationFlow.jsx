import { CheckCircle2, Circle, KeyRound } from "lucide-react";
export default function KeyGenerationFlow({active=0,done=false}) {
 const steps=["Choose primes","Calculate n","Calculate φ(n)","Choose e","Calculate d","Public key","Private key"];
 return <div className="flow" aria-label="RSA key generation flow">
 {steps.map((s,i)=><div className={`flow-step ${i<active||done?"complete":i===active?"active":""}`} key={s}>
   <div className="flow-icon">{i<active||done?<CheckCircle2 size={18}/>:i===active?<KeyRound size={18}/>:<Circle size={18}/>}</div>
   <span>{s}</span>{i<steps.length-1&&<div className="flow-line"/>}
 </div>)}
 </div>
}