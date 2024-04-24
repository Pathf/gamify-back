import { Code } from "../../entities/code.entity";
import { PostgresCode } from "./postgres-code";

export class CodeMapper {
  toDomain({ id, name, code }: PostgresCode): Code {
    return new Code({
      id,
      name,
      code,
    });
  }

  toPersistence(code: Code): PostgresCode {
    const postgreCode = new PostgresCode();
    postgreCode.id = code.props.id;
    postgreCode.name = code.props.name;
    postgreCode.code = code.props.code;
    return postgreCode;
  }
}
