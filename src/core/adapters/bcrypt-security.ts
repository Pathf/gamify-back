import * as bcrypt from "bcrypt";
import type { ISecurity } from "../ports/security.interface";

export class BcryptSecurity implements ISecurity {
  async hash(password: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt();
    return bcrypt.hash(password, saltOrRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generatePassword(length: number): Promise<string> {
    const sizePassword = length < 1 ? 8 : length;
    const crypto = window.crypto || (window as any).msCrypto; // For compatibility with IE11.
    const array = crypto.getRandomValues(new Uint8Array(sizePassword));
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let password = "";

    for (let i = 0; i < sizePassword; i++) {
      password += characters.charAt(array[i] % characters.length);
    }

    return password;
  }
}
