import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cipherkeep.dev',
  appName: 'CipherKeep',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
