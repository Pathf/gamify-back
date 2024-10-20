import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { DrawsModule } from "../draws/draws.module";
import { UsersModule } from "../users/users.module";
import { AppController } from "./app.controller";

import { TypeOrmModule } from "@nestjs/typeorm";
import { PostgresUserRole } from "../auth/adapters/postgres/postgres-user-roles";
import { PostgresChainedDraw } from "../draws/adapters/postgres/chained-draw/postgres-chained-draw";
import { PostgresCondition } from "../draws/adapters/postgres/condition/postgres-condition";
import { PostgresDraw } from "../draws/adapters/postgres/draw/postgres-draw";
import { PostgresParticipation } from "../draws/adapters/postgres/participation/postgres-participation";
import { PostgresCode } from "../users/adapters/postgres/postgres-code";
import { PostgresUser } from "../users/adapters/postgres/postgres-user";
import { CommonModule } from "./common.module";
import { DiscordModule } from "../discord/discord.module";

export const postgreEntities = [
  PostgresUser,
  PostgresCode,
  PostgresDraw,
  PostgresParticipation,
  PostgresCondition,
  PostgresChainedDraw,
  PostgresUserRole,
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST_2,
      port: +(process.env.DB_PORT ?? 5342),
      username: process.env.POSTGRES_USER_2,
      password: process.env.POSTGRES_PASSWORD_2,
      database: process.env.POSTGRES_DATABASE_2,
      entities: postgreEntities,
      synchronize: true,
      /*ssl:
        process.env.ENVIRONEMENT === "PRODUCTION"
          ? { rejectUnauthorized: false }
          : false,*/
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    DrawsModule,
    DiscordModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
