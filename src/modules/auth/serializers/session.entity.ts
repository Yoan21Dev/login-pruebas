import { Exclude } from 'class-transformer';

import { SessionTypeEntity } from '@auth/serializers/session-type.entity';
import { SessionStatusEntity } from '@auth/serializers/session-status.entity';
import { RolEntity } from '@rol/serializers/entities/rol.entity';

export class SessionEntity {
  id: string;
  email: string;

  @Exclude()
  password: string;

  lastAccess: Date;
  timesLoggedIn: number;
  type: SessionTypeEntity;
  status: SessionStatusEntity;
  rol: RolEntity;

  constructor(partial: Partial<SessionEntity>) {
    Object.assign(this, partial);
  }
}
