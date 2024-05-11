import { Entity } from "../../shared/entity.abstract";

type CodeProps = {
  id: string;
  name: string;
  code: string;
};

export class Code extends Entity<CodeProps> {
  isSame(code: string): boolean {
    return this.props.code === code;
  }
}
