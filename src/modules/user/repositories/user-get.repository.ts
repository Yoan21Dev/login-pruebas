import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { sub } from 'date-fns';
import { PrismaService } from '@core/prisma/services/prisma.service';
import { QueryParams } from '@core/types/query-params.type';
import { User } from '@user/types/user.type';
import { UserEntity } from '@user/serializers/entities/user.entity';
import { serializeMany } from '@user/serializers/user.serializer';
import { SessionStatus } from '@core/enums/session-status.enum';

@Injectable()
export class UserGetRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAllUsers(
    findOptions: Prisma.userFindManyArgs,
    queryParams: QueryParams,
    paginated: boolean = true
  ) {
    if (!paginated) return this.prismaService.user.findMany(findOptions);

    const model: any = this.prismaService.user;
    const resourceUrl = 'users';
    const paginateSearch = this.prismaService.paginatedSearch<
      User,
      Prisma.userFindManyArgs,
      UserEntity
    >(model, findOptions, resourceUrl, queryParams, serializeMany);

    return paginateSearch;
  }

  public async getAllUsersMetaData() {
    const totalUsers = await this.prismaService.user.count();
    const activeUsers = await this.prismaService.user.count({
      where: { session: { status: { id: { equals: SessionStatus.ACTIVE } } } },
    });
    const newUsers = await this.prismaService.user.count({
      where: { createdAt: { gte: sub(new Date(), { weeks: 1 }) } },
    });

    return { totalUsers, activeUsers, newUsers };
  }

  public async findOneUser(
    findOptions: Prisma.userFindFirstArgs,
    httpException?: HttpException
  ) {
    const user = await this.prismaService.user.findFirst(findOptions);

    if (!user && httpException) {
      throw httpException;
    }

    return user as unknown as User;
  }

  public async findAllRoles() {
    return this.prismaService.session_rol.findMany({
      select: { id: true, name: true },
    });
  }

  public async findAllStatuses() {
    return this.prismaService.session_status.findMany({
      select: { id: true, name: true },
    });
  }
}
