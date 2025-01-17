import { HttpException, Injectable } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { Prisma } from '@prisma/client';
import { Rol } from '@rol/types/rol.types';
import { QueryParams } from '@core/types/query-params.type';
import { RolEntity } from '@rol/serializers/entities/rol.entity';
import { serializeMany } from '@rol/serializers/rol.serializer';

@Injectable()
export class RolGetRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findOneRol(
    findOptions: Prisma.session_rolFindFirstArgs,
    httpException?: HttpException
  ) {
    const rol = await this.prismaService.session_rol.findFirst(findOptions);

    if (!rol && httpException) {
      throw httpException;
    }

    return rol as unknown as Rol;
  }

  public async findAllRoles(
    findOptions: Prisma.session_rolFindManyArgs,
    queryParams: QueryParams,
    paginated: boolean = true
  ) {
    if (!paginated) return this.prismaService.session_rol.findMany(findOptions);

    const model: any = this.prismaService.session_rol;
    const resourceUrl = 'roles';
    const paginateSearch = this.prismaService.paginatedSearch<
      Rol,
      Prisma.session_rolFindManyArgs,
      RolEntity
    >(model, findOptions, resourceUrl, queryParams, serializeMany);

    return paginateSearch;
  }

  public async findRolesMetadata() {
    const totalRoles = await this.prismaService.session_rol.count();

    return { totalRoles };
  }
}
