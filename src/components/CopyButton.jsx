import { useState } from "react";
import { Check, Copy } from "lucide-react";
export default function CopyButton({value,label="Copy"}) {
  const [copied,setCopied]=useState(false);
  const copy=async()=>{try{await navigator.clipboard.writeText(String(value));setCopied(true);setTimeout(()=>setCopied(false),1400)}catch{}};
  return <button className="icon-btn" onClick={copy} aria-label={label} title={label}>{copied?<Check size={16}/>:<Copy size={16}/>}<span>{copied?"Copied":"Copy"}</span></button>;
}