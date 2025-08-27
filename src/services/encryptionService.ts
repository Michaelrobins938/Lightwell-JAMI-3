import crypto from 'crypto';
import { promisify } from 'util';

// HIPAA-compliant encryption standards
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits
const PBKDF2_ITERATIONS = 100000; // NIST recommended minimum
const PBKDF2_DIGEST = 'sha512';

export interface EncryptedData {
  encryptedData: string;
  iv: string;
  authTag: string;
  salt: string;
  version: string;
  timestamp: number;
}

export interface EncryptionKey {
  key: Buffer;
  salt: Buffer;
  iterations: number;
}

export class EncryptionService {
  private static instance: EncryptionService;
  private masterKey: Buffer | null = null;

  private constructor() {}

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Initialize the encryption service with a master key
   * This should be called once during application startup
   */
  public async initialize(masterKey: string): Promise<void> {
    if (!masterKey || masterKey.length < 32) {
      throw new Error('Master key must be at least 32 characters long');
    }
    
    // Derive a secure master key using PBKDF2
    this.masterKey = await this.deriveKey(masterKey, crypto.randomBytes(32), 200000);
  }

  /**
   * Generate a cryptographically secure random key
   */
  public generateSecureKey(): Buffer {
    return crypto.randomBytes(KEY_LENGTH);
  }

  /**
   * Derive a key from a password using PBKDF2
   */
  public async deriveKey(password: string, salt: Buffer, iterations: number = PBKDF2_ITERATIONS): Promise<Buffer> {
    const pbkdf2 = promisify(crypto.pbkdf2);
    return await pbkdf2(password, salt as any, iterations, KEY_LENGTH, PBKDF2_DIGEST);
  }

  /**
   * Encrypt sensitive data with AES-256-GCM
   * This provides both confidentiality and authenticity
   */
  public async encryptData(data: string, key: Buffer): Promise<EncryptedData> {
    if (!data || !key) {
      throw new Error('Data and key are required for encryption');
    }

    // Generate a random IV for each encryption
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher with proper GCM mode
    const cipher = crypto.createCipherGCM(ENCRYPTION_ALGORITHM, key, iv);
    cipher.setAAD(Buffer.from('luna-hipaa-compliant', 'utf8') as any);

    // Encrypt the data
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      salt: crypto.randomBytes(32).toString('hex'),
      version: '1.0',
      timestamp: Date.now()
    };
  }

  /**
   * Decrypt data with AES-256-GCM
   */
  public async decryptData(encryptedData: EncryptedData, key: Buffer): Promise<string> {
    if (!encryptedData || !key) {
      throw new Error('Encrypted data and key are required for decryption');
    }

    try {
      // Create decipher with proper GCM mode
      const decipher = crypto.createDecipherGCM(ENCRYPTION_ALGORITHM, key, Buffer.from(encryptedData.iv, 'hex'));
      decipher.setAAD(Buffer.from('luna-hipaa-compliant', 'utf8') as any);
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex') as any);

      // Decrypt the data
      let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Encrypt user-specific data with user's derived key
   * This ensures zero-knowledge architecture
   */
  public async encryptUserData(data: string, userPassword: string, userSalt: string): Promise<EncryptedData> {
    const salt = Buffer.from(userSalt, 'hex');
    const userKey = await this.deriveKey(userPassword, salt);
    return await this.encryptData(data, userKey);
  }

  /**
   * Decrypt user-specific data with user's derived key
   */
  public async decryptUserData(encryptedData: EncryptedData, userPassword: string, userSalt: string): Promise<string> {
    const salt = Buffer.from(userSalt, 'hex');
    const userKey = await this.deriveKey(userPassword, salt);
    return await this.decryptData(encryptedData, userKey);
  }

  /**
   * Generate a secure hash for password verification
   * Uses Argon2-like approach with multiple rounds
   */
  public async hashPassword(password: string): Promise<{ hash: string; salt: string; iterations: number }> {
    const salt = crypto.randomBytes(32);
    const iterations = PBKDF2_ITERATIONS;
    
    const hash = await this.deriveKey(password, salt, iterations);
    
    return {
      hash: hash.toString('hex'),
      salt: salt.toString('hex'),
      iterations
    };
  }

  /**
   * Verify a password against its hash
   */
  public async verifyPassword(password: string, hash: string, salt: string, iterations: number): Promise<boolean> {
    const derivedKey = await this.deriveKey(password, Buffer.from(salt, 'hex'), iterations);
    return crypto.timingSafeEqual(derivedKey, Buffer.from(hash, 'hex') as any);
  }

  /**
   * Generate a secure random token for password reset
   */
  public generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash sensitive data for storage (one-way)
   */
  public hashSensitiveData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate a secure session ID
   */
  public generateSessionId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Encrypt API keys and sensitive configuration
   */
  public async encryptConfiguration(config: Record<string, any>): Promise<EncryptedData> {
    if (!this.masterKey) {
      throw new Error('Encryption service not initialized');
    }
    
    const configString = JSON.stringify(config);
    return await this.encryptData(configString, this.masterKey);
  }

  /**
   * Decrypt API keys and sensitive configuration
   */
  public async decryptConfiguration(encryptedConfig: EncryptedData): Promise<Record<string, any>> {
    if (!this.masterKey) {
      throw new Error('Encryption service not initialized');
    }
    
    const configString = await this.decryptData(encryptedConfig, this.masterKey);
    return JSON.parse(configString);
  }

  /**
   * Generate a secure encryption key for database fields
   */
  public generateFieldKey(): Buffer {
    return crypto.randomBytes(KEY_LENGTH);
  }

  /**
   * Encrypt database field data
   */
  public async encryptField(data: string, fieldKey: Buffer): Promise<EncryptedData> {
    return await this.encryptData(data, fieldKey);
  }

  /**
   * Decrypt database field data
   */
  public async decryptField(encryptedData: EncryptedData, fieldKey: Buffer): Promise<string> {
    return await this.decryptData(encryptedData, fieldKey);
  }

  /**
   * Generate a secure hash for audit logging
   */
  public generateAuditHash(data: string, timestamp: number): string {
    const auditData = `${data}:${timestamp}:${process.env.AUDIT_SECRET || 'default-audit-secret'}`;
    return crypto.createHash('sha256').update(auditData).digest('hex');
  }

  /**
   * Verify audit log integrity
   */
  public verifyAuditHash(data: string, timestamp: number, hash: string): boolean {
    const expectedHash = this.generateAuditHash(data, timestamp);
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex') as any,
      Buffer.from(expectedHash, 'hex') as any
    );
  }
}

// Export singleton instance
export const encryptionService = EncryptionService.getInstance();

// Export utility functions for direct use
export const {
  generateSecureKey,
  deriveKey,
  encryptData,
  decryptData,
  hashPassword,
  verifyPassword,
  generateSecureToken,
  hashSensitiveData,
  generateSessionId,
  generateFieldKey,
  encryptField,
  decryptField,
  generateAuditHash,
  verifyAuditHash
} = encryptionService;
