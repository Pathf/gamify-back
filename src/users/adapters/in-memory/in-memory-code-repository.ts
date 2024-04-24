import { Code } from "../../entities/code.entity";
import { ICodeRepository } from "../../ports/code-repository.interface";

export class InMemoryCodeRepository implements ICodeRepository {
  constructor(public codes: Code[] = []) {}

  async findRegisterUserCode(): Promise<Code | null> {
    return this.codes.find((c) => c.props.name === "REGISTER_USER") || null;
  }

  async findAll(): Promise<Code[]> {
    return this.codes;
  }

  async create(code: Code): Promise<void> {
    this.codes.push(code);
  }
}
