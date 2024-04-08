export const I_JWT_SERVICE = "I_JWT_SERVICE";

export interface IJwtService {
  signAsync(payload: any): Promise<string>;
  sign(payload: any): string;
  verifyAsync(token: string, options: any): Promise<any>;
}
