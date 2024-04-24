import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Code } from "../../entities/code.entity";
import { ICodeRepository } from "../../ports/code-repository.interface";
import { PostgresCode } from "./postgres-code";
import { CodeMapper } from "./postgres-code.mapper";

@Injectable()
export class PostgresCodeRepository implements ICodeRepository {
  private readonly codeMapper: CodeMapper = new CodeMapper();

  constructor(
    @InjectRepository(PostgresCode)
    private readonly codeRepository: Repository<PostgresCode>,
  ) {}

  async findRegisterUserCode(): Promise<Code | null> {
    const registerUserCode = await this.codeRepository.findOneBy({
      name: "REGISTER_USER",
    });
    return registerUserCode ? this.codeMapper.toDomain(registerUserCode) : null;
  }

  async findAll(): Promise<Code[]> {
    return (await this.codeRepository.find()).map((postgreCode) =>
      this.codeMapper.toDomain(postgreCode),
    );
  }

  async create(code: Code): Promise<void> {
    const postgreCode = this.codeMapper.toPersistence(code);
    await this.codeRepository.save(postgreCode);
  }

  async deleteAll(): Promise<void> {
    await this.codeRepository.clear();
  }
}
