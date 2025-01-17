import { Module } from '@nestjs/common';
import { UserAdminController } from './controllers/user_admin.controller';
import { UserAdminService } from './services/user_admin.service';
import { UserAdminCreateRepository } from './repositories/user_admin-create.repository';
import { UserAdminUpdateRepository } from './repositories/user_admin-update.repository';
import { UserAdminGetRepository } from './repositories/user_admin-get.repository';

@Module({
  controllers: [UserAdminController],
  providers: [
    UserAdminService,
    UserAdminCreateRepository,
    UserAdminUpdateRepository,
    UserAdminGetRepository,
  ],
})
export class UserAdminModule {}
