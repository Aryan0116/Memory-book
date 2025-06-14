
// Simple encryption utility using Web Crypto API
export class CryptoUtil {
  private static readonly algorithm = 'AES-GCM';
  private static readonly keyLength = 256;
  
  // Generate a key from a password
  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  // Encrypt text data
  static async encrypt(text: string, password: string = 'slam-book-secret-key'): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const key = await this.deriveKey(password, salt);
      
      const encrypted = await crypto.subtle.encrypt(
        { name: this.algorithm, iv: iv },
        key,
        data
      );
      
      // Combine salt, iv, and encrypted data
      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encrypted), salt.length + iv.length);
      
      // Convert to base64 for storage
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      return text; // Fallback to original text if encryption fails
    }
  }
  
  // Decrypt text data
  static async decrypt(encryptedText: string, password: string = 'slam-book-secret-key'): Promise<string> {
    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedText).split('').map(char => char.charCodeAt(0))
      );
      
      // Extract salt, iv, and encrypted data
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encrypted = combined.slice(28);
      
      const key = await this.deriveKey(password, salt);
      
      const decrypted = await crypto.subtle.decrypt(
        { name: this.algorithm, iv: iv },
        key,
        encrypted
      );
      
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedText; // Fallback to original text if decryption fails
    }
  }
}
