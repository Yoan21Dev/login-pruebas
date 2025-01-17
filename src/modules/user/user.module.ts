import { Module } from '@nestjs/common';

import { EmailModule } from '@core/email/email.module';
import { UserService } from '@user/services/user.service';
import { UserGetRepository } from '@user/repositories/user-get.repository';
import { UserController } from '@user/controllers/user.controller';
import { UserUpdateRepository } from '@user/repositories/user-update.repository';
import { UserCreateRepository } from '@user/repositories/user-create.repository';
import { AuthModule } from '@auth/auth.module';
import { ImagesModule } from '@core/images/images.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { editFileName } from '@utils/file-upload.utils';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('USER_IMAGES_FOLDER'),
          filename: editFileName,
        }),
      }),
      inject: [ConfigService],
    }),
    EmailModule,
    AuthModule,
    ImagesModule,
  ],
  providers: [
    UserService,
    UserGetRepository,
    UserUpdateRepository,
    UserCreateRepository,
  ],
  controllers: [UserController],
  exports: [UserGetRepository],
})
export class UserModule {}
