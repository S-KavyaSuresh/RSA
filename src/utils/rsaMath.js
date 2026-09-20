export function gcd(a, b) {
  a = BigInt(a); b = BigInt(b);
  while (b !== 0n) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
}

export function modPow(base, exponent, modulus) {
  base = BigInt(base); exponent = BigInt(exponent); modulus = BigInt(modulus);
  if (modulus <= 0n) throw new Error("Modulus must be positive.");
  let result = 1n;
  base %= modulus;
  while (exponent > 0n) {
    if (exponent & 1n) result = (result * base) % modulus;
    base = (base * base) % modulus;
    exponent >>= 1n;
  }
  return result;
}

export function extendedGcd(a, b) {
  a = BigInt(a); b = BigInt(b);
  let oldR=a, r=b, oldS=1n, s=0n, oldT=0n, t=1n;
  while (r !== 0n) {
    const q=oldR/r;
    [oldR,r]=[r,oldR-q*r];
    [oldS,s]=[s,oldS-q*s];
    [oldT,t]=[t,oldT-q*t];
  }
  return {gcd:oldR,x:oldS,y:oldT};
}

export function modInverse(a, m) {
  const {gcd:g,x}=extendedGcd(a,m);
  if (g !== 1n) throw new Error("A modular inverse does not exist because gcd(e, φ(n)) is not 1.");
  return ((x % BigInt(m)) + BigInt(m)) % BigInt(m);
}

export function isPrime(n) {
  n=BigInt(n);
  if (n<2n) return false;
  if (n===2n || n===3n) return true;
  if (n%2n===0n) return false;
  for(let i=3n;i*i<=n;i+=2n) if(n%i===0n) return false;
  return true;
}

export function chooseExponent(phi) {
  const preferred=[65537n,257n,17n,5n,3n];
  for(const e of preferred) if(e<phi && gcd(e,phi)===1n) return e;
  for(let e=3n;e<phi;e+=2n) if(gcd(e,phi)===1n) return e;
  throw new Error("Could not find a valid public exponent.");
}

export function generateToyKeys(p,q) {
  p=BigInt(p); q=BigInt(q);
  if(!isPrime(p)||!isPrime(q)) throw new Error("Both p and q must be prime numbers.");
  if(p===q) throw new Error("p and q must be different primes.");
  const n=p*q, phi=(p-1n)*(q-1n), e=chooseExponent(phi), d=modInverse(e,phi);
  return {p,q,n,phi,e,d,publicKey:`(${e}, ${n})`,privateKey:`(${d}, ${n})`};
}

export function encodeText(text) {
  return [...text].map(ch => ch.codePointAt(0));
}

export function bytesToBase64(bytes) {
  let binary="";
  const chunk=0x8000;
  for(let i=0;i<bytes.length;i+=chunk) binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));
  return btoa(binary);
}
export function base64ToBytes(base64) {
  const binary=atob(base64);
  return Uint8Array.from(binary,c=>c.charCodeAt(0));
}
export function formatBigInt(value) { return String(value); }