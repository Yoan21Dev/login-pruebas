import { BadRequestException, Injectable } from '@nestjs/common';

import { QueryParams } from '@core/types/query-params.type';
import { RolCreateRepository } from '@rol/repositories/rol-create.repository';
import { RolGetRepository } from '@rol/repositories/rol-get.repository';
import { RolUpdateRepository } from '@rol/repositories/rol-update.repository';
import { CreateRolDto } from '@rol/dtos/create/create-rol.dto';
import { AllRolesQueryDto } from '@rol/dtos/read/all-roles.dto';
import { UpdateRolDto } from '@rol/dtos/update/update-rol.dto';
import { serializeOne } from '@rol/serializers/rol.serializer';
import { RolFields } from '@rol/types/rol.types';

@Injectable()
export class RolService {
  constructor(
    private readonly rolCreateRepository: RolCreateRepository,
    private readonly rolGetRepository: RolGetRepository,
    private readonly rolUpdateRepository: RolUpdateRepository
  ) {}

  public async createRol(body: CreateRolDto) {
    const newRol = await this.rolCreateRepository.createRol(body);

    return serializeOne(newRol);
  }

  public async updateRolById(id: number, body: UpdateRolDto) {
    await this.getOneRolOrThrowBadRequest(id);

    const updatedRol = await this.rolUpdateRepository.updateRol(id, body);

    return serializeOne(updatedRol);
  }

  public async getOneRolOrThrowBadRequest(id: number) {
    const rol = await this.rolGetRepository.findOneRol(
      {
        where: { id },
        select: RolFields,
      },
      new BadRequestException('No existe el rol')
    );

    return serializeOne(rol);
  }

  public async getAllRoles(queryParams: AllRolesQueryDto) {
    const paginatedRoles = await this.rolGetRepository.findAllRoles(
      {
        select: RolFields,
        where: {
          ...(queryParams.search && {
            name: { contains: queryParams.search, mode: 'insensitive' },
          }),
        },
      },
      queryParams as QueryParams
    );

    return paginatedRoles;
  }

  public async getRolesMetadata() {
    return this.rolGetRepository.findRolesMetadata();
  }
}
