import { Injectable } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { UserFields } from '@user/types/user.type';

@Injectable()
export class MeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findMyInfo(sessionId: number) {
    return this.prismaService.session.findFirst({
      where: { id: sessionId },
      select: {
        user: { select: UserFields },
        userAdmin: {
          select: { id: true, name: true, lastName: true },
        },
      },
    });
  }
}
