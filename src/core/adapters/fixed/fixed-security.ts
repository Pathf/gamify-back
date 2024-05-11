import { ISecurity } from "../../ports/security.interface";

export class FixedSecurity implements ISecurity {
  async hash(password: string): Promise<string> {
    return password;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return password === hash;
  }

  async generatePassword(length: number): Promise<string> {
    const sizePassword = length < 1 ? 8 : length;
    let password = "";
    for (let i = 0; i < sizePassword; i++) {
      password += "p";
    }
    return password;
  }
}
