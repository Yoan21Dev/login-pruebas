import { HttpException, Injectable } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { Prisma } from '@prisma/client';
import { UserAdmin } from '../types/user-admin.types';
import { QueryParams } from '@core/types/query-params.type';

@Injectable()
export class UserAdminGetRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findOneUserAdmin(
    findOptions: Prisma.user_adminFindFirstArgs,
    httpException: HttpException
  ) {
    const userAdmin =
      await this.prismaService.user_admin.findFirst(findOptions);

    if (!userAdmin && httpException) {
      throw httpException;
    }

    return userAdmin as unknown as UserAdmin;
  }

  public async findAllUserAdmin(
    findOptions: Prisma.user_adminFindManyArgs,
    queryParams: QueryParams,
    paginated: boolean = true
  ) {
    if (!paginated) return this.prismaService.user_admin.findMany(findOptions);

    const model: any = this.prismaService.user_admin;
    const resourceUrl = 'user-admin';
    const paginateSearch = this.prismaService.paginatedSearch<
      UserAdmin,
      Prisma.user_adminFindManyArgs,
      any
    >(model, findOptions, resourceUrl, queryParams);

    return paginateSearch;
  }
}
