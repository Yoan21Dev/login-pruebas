import { Exclude } from 'class-transformer';

import { SessionEntity } from '@auth/serializers/session.entity';

export class UserEntity {
  id: string;
  name: string;
  lastName: string;
  createdAt: Date;

  @Exclude()
  deletedAt: Date | null;

  updatedAt: Date;
  image: string;
  session: SessionEntity;

  properties: any;
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
