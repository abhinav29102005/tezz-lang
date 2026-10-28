// Tezz Language — JWT Library (tezz-jwt)
// Secure JWT signing and verification using jose (RFC 7519 compliant)

import { SignJWT, jwtVerify, importSPKI, importPKCS8, exportSPKI, exportPKCS8, generateKeyPair } from 'jose';

// Default algorithm
const DEFAULT_ALG = 'RS256';
const DEFAULT_EXPIRY = '1h';

/**
 * Generate a new RSA key pair for JWT signing
 * @returns {Promise<{publicKey: CryptoKey, privateKey: CryptoKey, publicKeyPem: string, privateKeyPem: string}>}
 */
export async function generateKeyPair() {
  const { publicKey, privateKey } = await generateKeyPair('RSA', { modulusLength: 2048 });
  
  const publicKeyPem = await exportSPKI(publicKey);
  const privateKeyPem = await exportPKCS8(privateKey);
  
  return { publicKey, privateKey, publicKeyPem, privateKeyPem };
}

/**
 * Import a public key from PEM format
 * @param {string} pem - PEM formatted public key
 * @returns {Promise<CryptoKey>}
 */
export async function importPublicKey(pem) {
  return await importSPKI(pem, DEFAULT_ALG);
}

/**
 * Import a private key from PEM format
 * @param {string} pem - PEM formatted private key
 * @returns {Promise<CryptoKey>}
 */
export async function importPrivateKey(pem) {
  return await importPKCS8(pem, DEFAULT_ALG);
}

/**
 * Sign a JWT token
 * @param {Object} payload - Claims to include in the token
 * @param {CryptoKey|string} key - Private key (CryptoKey or PEM string)
 * @param {Object} options - Signing options
 * @param {string} options.algorithm - JWA algorithm (default: RS256)
 * @param {string|number} options.expiresIn - Expiration time (default: 1h)
 * @param {string} options.issuer - Issuer claim
 * @param {string} options.subject - Subject claim
 * @param {string} options.audience - Audience claim
 * @returns {Promise<string>} Signed JWT token
 */
export async function sign(payload, key, options = {}) {
  const algorithm = options.algorithm || DEFAULT_ALG;
  const expiresIn = options.expiresIn || DEFAULT_EXPIRY;
  
  let privateKey = key;
  if (typeof key === 'string') {
    privateKey = await importPrivateKey(key);
  }
  
  const jwt = new SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(expiresIn);
  
  if (options.issuer) jwt.setIssuer(options.issuer);
  if (options.subject) jwt.setSubject(options.subject);
  if (options.audience) jwt.setAudience(options.audience);
  
  return await jwt.sign(privateKey);
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @param {CryptoKey|string} key - Public key (CryptoKey or PEM string)
 * @param {Object} options - Verification options
 * @param {string} options.issuer - Expected issuer
 * @param {string} options.subject - Expected subject
 * @param {string} options.audience - Expected audience
 * @param {number} options.clockTolerance - Clock tolerance in seconds (default: 60)
 * @returns {Promise<Object>} Decoded payload
 */
export async function verify(token, key, options = {}) {
  let publicKey = key;
  if (typeof key === 'string') {
    publicKey = await importPublicKey(key);
  }
  
  const { payload } = await jwtVerify(token, publicKey, {
    issuer: options.issuer,
    subject: options.subject,
    audience: options.audience,
    clockTolerance: options.clockTolerance ?? 60,
  });
  
  return payload;
}

/**
 * Decode a JWT token without verification (use with caution!)
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded header and payload, or null if invalid
 */
export function decode(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    return { header, payload };
  } catch {
    return null;
  }
}

/**
 * Create a JWKS (JSON Web Key Set) from a public key
 * @param {CryptoKey|string} publicKey - Public key
 * @param {string} kid - Key ID
 * @returns {Promise<Object>} JWKS object
 */
export async function createJWKS(publicKey, kid = 'tezz-key-1') {
  const key = typeof publicKey === 'string' ? await importPublicKey(publicKey) : publicKey;
  const jwk = await jose.exportJWK(key);
  return { keys: [{ ...jwk, kid, use: 'sig' }] };
}

// Re-export jose for advanced usage
export * from 'jose';

// Default export for CommonJS compatibility
export default {
  sign,
  verify,
  decode,
  generateKeyPair,
  importPublicKey,
  importPrivateKey,
  createJWKS,
};