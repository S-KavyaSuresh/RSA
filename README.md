# RSA Explorer

RSA Explorer is a React + Vite educational application for learning RSA key generation, encryption, decryption, and the underlying mathematics.

## What is included

- 2048-bit RSA-OAEP key generation using the browser Web Crypto API
- SHA-256 OAEP padding
- Direct RSA encryption and decryption of short messages
- A 190-byte plaintext limit for the 2048-bit RSA-OAEP workflow
- Public/private key display with clear educational warnings
- Step-by-step toy RSA demonstration using JavaScript BigInt
- Prime validation, modular exponentiation, modular inverse, and RSA calculations
- Learning Center with RSA concepts and diagrams
- Copy, reset, validation, and error states
- Responsive interface and reduced-motion-friendly animations

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

## RSA workflow

The practical workspace uses RSA-OAEP directly. A short plaintext is encoded as UTF-8 bytes, encrypted with the generated public RSA key, and decrypted with the matching private RSA key.

The application intentionally limits plaintext length because RSA-OAEP is not intended for arbitrarily long messages. With a 2048-bit RSA key and SHA-256 OAEP, the maximum plaintext is 190 bytes.

## Educational demo

The learning demo uses small prime values and textbook RSA mathematics so every calculation can be inspected. This mode is intentionally insecure and is only for learning.

## Security note

Do not use the toy RSA demo for real secrets. The application is an educational project designed to make RSA understandable.

## Structure

```text
src/
├── components/
├── utils/
│   ├── rsaCrypto.js
│   └── rsaMath.js
├── App.jsx
├── main.jsx
└── styles/
```
