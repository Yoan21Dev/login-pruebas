import { ConfigService } from '@nestjs/config';

import { User } from '@user/types/user.type';
import { UserEntity } from '@user/serializers/entities/user.entity';
import { SessionEntity } from '@auth/serializers/session.entity';
import { SessionTypeEntity } from '@auth/serializers/session-type.entity';
import { SessionStatusEntity } from '@auth/serializers/session-status.entity';
import { serializeOne as serializeOneRol } from '@rol/serializers/rol.serializer';

export function serializeOne(user: User, _configService: ConfigService) {
  const { session, ...userData } = user;
  const { rol, status, type, ...sessionData } = session;

  return new UserEntity({
    ...userData,
    session: new SessionEntity({
      ...sessionData,
      rol: serializeOneRol(rol),
      type: new SessionTypeEntity(type),
      status: new SessionStatusEntity(status),
    }),
  });
}

export function serializeMany(
  users: Array<User>,
  configService: ConfigService
) {
  return users.map((user) => serializeOne(user, configService));
}
