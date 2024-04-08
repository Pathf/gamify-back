import { IJwtService } from "../ports/jwt-service.interface";

export class FixedJwtService implements IJwtService {
  async signAsync(payload: any) {
    return Buffer.from(JSON.stringify(payload)).toString("base64");
  }

  sign(payload: any) {
    return Buffer.from(JSON.stringify(payload)).toString("base64");
  }

  async verifyAsync(token: string, options: any) {
    const s = JSON.stringify(options);
    return JSON.parse(Buffer.from(token + s, "base64").toString());
  }
}
