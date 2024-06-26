import { Entity, PrimaryColumn } from "typeorm";
import { RoleEnum } from "../../decorators/roles.decorator";

@Entity()
export class PostgresUserRole {
  @PrimaryColumn({
    nullable: false,
  })
  userId: string;

  @PrimaryColumn({
    nullable: false,
    type: "enum",
    enum: RoleEnum,
  })
  role: RoleEnum;
}
