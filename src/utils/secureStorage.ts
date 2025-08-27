// Secure storage utilities to replace insecure localStorage usage

interface SecureStorageOptions {
  encrypt?: boolean;
  ttl?: number; // Time to live in milliseconds
}

class SecureStorage {
  private static instance: SecureStorage;
  private encryptionKey: string | null = null;

  private constructor() {
    // Initialize encryption key if available
    if (typeof window !== 'undefined') {
      this.encryptionKey = this.generateEncryptionKey();
    }
  }

  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  private generateEncryptionKey(): string {
    // Generate a simple encryption key for client-side storage
    // In production, this should be more sophisticated
    return btoa(Math.random().toString(36) + Date.now().toString(36));
  }

  private encrypt(data: string): string {
    if (!this.encryptionKey) return data;
    
    try {
      // Simple XOR encryption (for demonstration - use proper encryption in production)
      let encrypted = '';
      for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(
          data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
        );
      }
      return btoa(encrypted);
    } catch (error) {
      console.warn('Encryption failed, storing as plain text');
      return data;
    }
  }

  private decrypt(data: string): string {
    if (!this.encryptionKey) return data;
    
    try {
      const encrypted = atob(data);
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(
          encrypted.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
        );
      }
      return decrypted;
    } catch (error) {
      console.warn('Decryption failed, returning as is');
      return data;
    }
  }

  public setItem(key: string, value: any, options: SecureStorageOptions = {}): void {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        value,
        timestamp: Date.now(),
        ttl: options.ttl
      };

      const serialized = JSON.stringify(data);
      const encrypted = options.encrypt ? this.encrypt(serialized) : serialized;
      
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  }

  public getItem(key: string, options: SecureStorageOptions = {}): any {
    if (typeof window === 'undefined') return null;

    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = options.encrypt ? this.decrypt(encrypted) : encrypted;
      const data = JSON.parse(decrypted);

      // Check TTL
      if (data.ttl && Date.now() - data.timestamp > data.ttl) {
        this.removeItem(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  }

  public removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  }

  public clear(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.clear();
  }

  // Secure token storage (should use httpOnly cookies in production)
  public setToken(token: string): void {
    this.setItem('auth_token', token, { encrypt: true, ttl: 24 * 60 * 60 * 1000 }); // 24 hours
  }

  public getToken(): string | null {
    return this.getItem('auth_token', { encrypt: true });
  }

  public removeToken(): void {
    this.removeItem('auth_token');
  }

  // Secure user data storage
  public setUserData(data: any): void {
    this.setItem('user_data', data, { encrypt: true, ttl: 60 * 60 * 1000 }); // 1 hour
  }

  public getUserData(): any {
    return this.getItem('user_data', { encrypt: true });
  }

  public removeUserData(): void {
    this.removeItem('user_data');
  }

  // Secure chat data storage
  public setChatData(data: any): void {
    this.setItem('chat_data', data, { encrypt: false, ttl: 30 * 60 * 1000 }); // 30 minutes
  }

  public getChatData(): any {
    return this.getItem('chat_data', { encrypt: false });
  }

  public removeChatData(): void {
    this.removeItem('chat_data');
  }
}

// Export singleton instance
export const secureStorage = SecureStorage.getInstance();

// Utility functions for common operations
export const secureStorageUtils = {
  // Token management
  setAuthToken: (token: string) => secureStorage.setToken(token),
  getAuthToken: () => secureStorage.getToken(),
  removeAuthToken: () => secureStorage.removeToken(),

  // User data management
  setUserProfile: (profile: any) => secureStorage.setUserData(profile),
  getUserProfile: () => secureStorage.getUserData(),
  removeUserProfile: () => secureStorage.removeUserData(),

  // Chat data management
  setChatHistory: (history: any) => secureStorage.setChatData(history),
  getChatHistory: () => secureStorage.getChatData(),
  removeChatHistory: () => secureStorage.removeChatData(),

  // Clear all secure data
  clearAll: () => secureStorage.clear()
};

export default secureStorage;
