import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PostgresUser {
  @PrimaryColumn({
    nullable: false,
  })
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    name: "email_address",
    nullable: false,
  })
  emailAddress: string;

  @Column({
    nullable: false,
  })
  password: string;
}
