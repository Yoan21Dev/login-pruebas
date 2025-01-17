import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { EmailModule } from '@core/email/email.module';
import { PrismaModule } from '@core/prisma/prisma.module';
import { AuthModule } from '@auth/auth.module';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UserModule } from '@user/user.module';
import { RolModule } from '@rol/rol.module';
import { MeModule } from '@me/me.module';
import { UserAdminModule } from '@user_admin/user_admin.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      // Aquí se puedes agregar opciones de caché si lo necesitas redis etc 

    }),
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    RolModule,
    MeModule,
    EmailModule,
    UserAdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }