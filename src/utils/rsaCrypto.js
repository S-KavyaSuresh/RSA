import { bytesToBase64, base64ToBytes } from './rsaMath';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function ensureCrypto() {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto API is unavailable. Run the app in a modern browser.');
  }
}

function pem(bytes, label) {
  const b64 = bytesToBase64(bytes);
  const lines = b64.match(/.{1,64}/g)?.join('\n') || '';
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
}

function stripPem(pemText) {
  return pemText.replace(/-----BEGIN [^-]+-----|-----END [^-]+-----|\s/g, '');
}

async function importPublicKey(pemText) {
  const der = base64ToBytes(stripPem(pemText));

  return crypto.subtle.importKey(
    'spki',
    der,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt']
  );
}

async function importPrivateKey(pemText) {
  const der = base64ToBytes(stripPem(pemText));

  return crypto.subtle.importKey(
    'pkcs8',
    der,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['decrypt']
  );
}

export async function generateRsaKeyPair() {
  ensureCrypto();

  const pair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicDer = new Uint8Array(
    await crypto.subtle.exportKey('spki', pair.publicKey)
  );

  const privateDer = new Uint8Array(
    await crypto.subtle.exportKey('pkcs8', pair.privateKey)
  );

  return {
    publicKey: pem(publicDer, 'PUBLIC KEY'),
    privateKey: pem(privateDer, 'PRIVATE KEY'),
    keySize: 2048,
    algorithm: 'RSA-OAEP / SHA-256'
  };
}

export async function rsaEncrypt(message, publicPem) {
  ensureCrypto();

  const bytes = encoder.encode(message);
  const maxBytes = 190;

  if (bytes.length > maxBytes) {
    throw new Error(
      `RSA-OAEP with a 2048-bit key and SHA-256 supports at most ${maxBytes} UTF-8 bytes. Enter a short word or phrase.`
    );
  }

  const publicKey = await importPublicKey(publicPem);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    bytes
  );

  return bytesToBase64(new Uint8Array(encrypted));
}

export async function rsaDecrypt(ciphertextBase64, privatePem) {
  ensureCrypto();

  if (!ciphertextBase64 || typeof ciphertextBase64 !== 'string') {
    throw new Error('Enter an RSA ciphertext.');
  }

  const privateKey = await importPrivateKey(privatePem);
  const ciphertext = base64ToBytes(ciphertextBase64.trim());

  const plaintext = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    ciphertext
  );

  return decoder.decode(plaintext);
}