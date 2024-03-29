import { ISecurity } from "../ports/security.interface";
import * as bcrypt from 'bcrypt';

export class BcryptSecurity implements ISecurity {
  async hash(password: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt();
    return bcrypt.hash(password, saltOrRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}