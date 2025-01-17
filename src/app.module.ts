import { Module } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
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
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get('REDIS_URL'),
        username: configService.get('REDIS_USERNAME'),
        password: configService.get('REDIS_PASSWORD'),
      }),
      isGlobal: true,
      inject: [ConfigService],
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
export class AppModule {}
