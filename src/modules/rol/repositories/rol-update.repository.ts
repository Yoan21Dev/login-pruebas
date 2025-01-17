import { Injectable } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { UpdateRolDto } from '@rol/dtos/update/update-rol.dto';
import { Rol, RolFields } from '@rol/types/rol.types';

@Injectable()
export class RolUpdateRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async updateRol(id: number, body: UpdateRolDto) {
    return (await this.prismaService.session_rol.update({
      where: { id },
      select: RolFields,
      data: body,
    })) as unknown as Rol;
  }
}
