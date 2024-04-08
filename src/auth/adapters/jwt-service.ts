import { Injectable } from "@nestjs/common";
import { JwtService as JwtServiceExt } from "@nestjs/jwt";
import { IJwtService } from "../ports/jwt-service.interface";

@Injectable()
export class JwtService implements IJwtService {
  constructor(private readonly jwtServiceExt: JwtServiceExt) {}

  async signAsync(payload: any) {
    return await this.jwtServiceExt.signAsync(payload);
  }

  sign(payload: any) {
    return this.jwtServiceExt.sign(payload);
  }

  async verifyAsync(token: string, options: any) {
    return await this.jwtServiceExt.verifyAsync(token, options);
  }
}
