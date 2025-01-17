import { Module } from '@nestjs/common';

import { RolGetRepository } from '@rol/repositories/rol-get.repository';
import { RolCreateRepository } from '@rol/repositories/rol-create.repository';
import { RolUpdateRepository } from '@rol/repositories/rol-update.repository';
import { RolService } from './services/rol.service';
import { RolController } from './controllers/rol.controller';

@Module({
  providers: [
    RolCreateRepository,
    RolGetRepository,
    RolUpdateRepository,
    RolService,
  ],
  controllers: [RolController],
})
export class RolModule {}
