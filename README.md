# CipherKeep: Secure Biometric Vault

CipherKeep is a locally secured mobile application designed for storing sensitive text secrets. It shifts the focus from simple UI construction to robust, local security architecture by utilizing hardware-backed encryption and native biometric authentication.

## 🏗 Tech Stack & Architecture

* **Frontend:** Built with Angular 17 utilizing Standalone Components for a modular, modern structure.
* **State Management:** Angular Signals manage the global `isAuthenticated` state, providing a highly reactive and clean alternative to complex RxJS BehaviorSubjects.
* **Biometric Security:** Integrates `@aparajita/capacitor-biometric-auth` to interface directly with iOS FaceID/TouchID and Android Biometrics.
* **Hardware Encryption:** Utilizes `capacitor-secure-storage-plugin` to ensure all vaulted data is hardware-encrypted via the native OS security layers (iOS Keychain / Android Keystore) rather than vulnerable `localStorage`.

## 🛡️ Security Features & Edge Case Handling

A major focus of this project is resilient error handling and graceful degradation:

* **Fallback Authentication:** Implements a native PIN fallback system via Capacitor Preferences if biometric hardware is missing, disabled, or encounters permission denials.
* **Corrupted Data Protection:** Wraps all keystore read/write operations in robust `try/catch` blocks. If decryption fails due to corrupted keychain data, the app alerts the user gracefully without crashing.
* **Route Protection:** A functional Angular 17 Route Guard intercepts unauthorized navigation attempts to the internal tabs, ensuring the vault remains locked.

## 🚀 Running Locally

```bash
npm install
ionic serve
