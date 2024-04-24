import { Code } from "../../users/entities/code.entity";
import {
  ICodeRepository,
  I_CODE_REPOSITORY,
} from "../../users/ports/code-repository.interface";
import { IFixture } from "../utils/fixture";
import { TestApp } from "../utils/test-app";

export class CodeFixture implements IFixture {
  constructor(public readonly entity: Code) {}

  async load(app: TestApp): Promise<void> {
    const codeRepository = app.get<ICodeRepository>(I_CODE_REPOSITORY);
    await codeRepository.create(this.entity);
  }
}
