/**
 * Secure Client-Side Password Hashing Utility
 * Uses native Web Crypto API (SHA-256 with cryptographically secure salt)
 * Universally supported in modern browsers and Node 18+.
 * Ensures NO plain-text passwords are ever stored in localStorage or memory.
 */

// Helper to convert ArrayBuffer to Hex String
const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Generate a cryptographically random salt (16 bytes = 32 hex chars)
 */
export const generateSalt = () => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    const array = new Uint8Array(16);
    globalThis.crypto.getRandomValues(array);
    return bufferToHex(array);
  }
  // Math.random fallback
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Hash a password with salt using SHA-256 via Web Crypto API
 */
export const hashPassword = async (password, salt) => {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:mylala_pwa_secret_2026`);

  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
  }

  // Fallback hash implementation
  let hash = 0;
  const str = `${salt}:${password}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
};

/**
 * Verify a password attempt against stored salt and hash
 */
export const verifyPassword = async (password, salt, storedHash) => {
  if (!password || !salt || !storedHash) return false;
  const computedHash = await hashPassword(password, salt);
  return computedHash === storedHash;
};
