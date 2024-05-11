export const I_SECURITY = "I_SECURITY";
export interface ISecurity {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
  generatePassword(length: number): Promise<string>;
}
