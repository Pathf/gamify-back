import { ISecurity } from "../ports/security.interface";

export class FixedSecurity implements ISecurity {
  async hash(password: string): Promise<string> {
    return password;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return password === hash;
  }
}
