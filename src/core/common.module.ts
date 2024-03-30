import { Module } from "@nestjs/common";
import { BcryptSecurity } from "./adapters/bcrypt-security";
import { InMemoryMailer } from "./adapters/in-memory-mailer";
import { RandomIDGenartor } from "./adapters/random-id-generator";
import { AppService } from "./app.service";
import { I_ID_GENERATOR } from "./ports/id-generator.interface";
import { I_MAILER } from "./ports/mailer.interface";
import { I_SECURITY } from "./ports/security.interface";

@Module({
  imports: [],
  controllers: [],
  providers: [
    AppService,
    {
      provide: I_ID_GENERATOR,
      useClass: RandomIDGenartor,
    },
    {
      provide: I_MAILER,
      useClass: InMemoryMailer,
    },
    {
      provide: I_SECURITY,
      useClass: BcryptSecurity,
    },
  ],
  exports: [I_ID_GENERATOR, I_MAILER, I_SECURITY],
})
export class CommonModule {}
