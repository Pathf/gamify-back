import { Code } from "../entities/code.entity";

export const I_CODE_REPOSITORY = "I_CODE_REPOSITORY";

export interface ICodeRepository {
  findRegisterUserCode(): Promise<Code | null>;
  findAll(): Promise<Code[]>;

  create(code: Code): Promise<void>;

  deleteAll(): Promise<void>;
}
