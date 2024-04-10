import { Module } from "@nestjs/common";
import { BcryptSecurity } from "./adapters/bcrypt-security";
import { CurrentDateGenerator } from "./adapters/current-date-generator";
import { InMemoryMailer } from "./adapters/in-memory/in-memory-mailer";
import { RandomIDGenartor } from "./adapters/random-id-generator";
import { ResendMailer } from "./adapters/resend-mailer";
import { ShuffleService } from "./adapters/shuffle-service";
import { I_DATE_GENERATOR } from "./ports/date-generator.interface";
import { I_ID_GENERATOR } from "./ports/id-generator.interface";
import { I_MAILER } from "./ports/mailer.interface";
import { I_SECURITY } from "./ports/security.interface";
import { I_SHUFFLE_SERVICE } from "./ports/shuffle-service.interface";

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: I_ID_GENERATOR,
      useClass: RandomIDGenartor,
    },
    {
      provide: I_MAILER,
      useFactory: () => {
        if (process.env.ENVIRONEMENT === "PRODUCTION") {
          return new ResendMailer();
        }
        return new InMemoryMailer();
      },
    },
    {
      provide: I_SECURITY,
      useFactory: () => {
        return new BcryptSecurity();
      },
    },
    {
      provide: I_SHUFFLE_SERVICE,
      useClass: ShuffleService,
    },
    {
      provide: I_DATE_GENERATOR,
      useClass: CurrentDateGenerator,
    },
  ],
  exports: [
    I_ID_GENERATOR,
    I_MAILER,
    I_SECURITY,
    I_SHUFFLE_SERVICE,
    I_DATE_GENERATOR,
  ],
})
export class CommonModule {}
