import { Injectable } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { CreateRolDto } from '@rol/dtos/create/create-rol.dto';
import { Rol, RolFields } from '@rol/types/rol.types';

@Injectable()
export class RolCreateRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createRol(body: CreateRolDto) {
    return (await this.prismaService.session_rol.create({
      select: RolFields,
      data: body,
    })) as unknown as Rol;
  }
}
