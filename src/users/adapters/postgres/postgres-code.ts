import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PostgresCode {
  @PrimaryColumn({
    nullable: false,
  })
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  code: string;
}
