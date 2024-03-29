import { Module } from '@nestjs/common';
import { InMemoryMailer } from './adapters/in-memory-mailer';
import { RandomIDGenartor } from './adapters/random-id-generator';
import { AppService } from './app.service';
import { I_ID_GENERATOR } from './ports/id-generator.interface';
import { I_MAILER } from './ports/mailer.interface';

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
  ],
  exports: [I_ID_GENERATOR, I_MAILER],
})
export class CommonModule {}
