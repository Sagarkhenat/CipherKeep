import { Injectable } from '@angular/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {

  constructor() { }

  async saveSecret(key: string, value: string): Promise<boolean> {
    try {
      await SecureStoragePlugin.set({ key, value });
      return true;
    } catch (error) {
      console.error('Failed to save securely to device keystore:', error);
      return false;
    }
  }

  async getSecret(key: string): Promise<string | null> {
    try {
      const result = await SecureStoragePlugin.get({ key });
      return result.value;
    } catch (error) {
      // Catching errors such as item not found, corrupted keychain data, or failed decryption attempts
      console.warn(`Could not retrieve secret for key ${key}. It may not exist or the keystore data is corrupted.`, error);
      return null;
    }
  }

  async removeSecret(key: string): Promise<boolean> {
    try {
      await SecureStoragePlugin.remove({ key });
      return true;
    } catch (error) {
      console.error('Failed to remove secret:', error);
      return false;
    }
  }
}
