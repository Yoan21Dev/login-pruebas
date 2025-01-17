import { Module } from '@nestjs/common';

import { MeController } from '@me/controllers/me.controller';
import { MeService } from '@me/services/me.service';
import { MeRepository } from '@me/repositories/me.repository';

@Module({
  controllers: [MeController],
  providers: [MeService, MeRepository],
})
export class MeModule {}
