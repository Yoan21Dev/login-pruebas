import { BadRequestException, Injectable } from '@nestjs/common';

import { UserAdminCreateRepository } from '../repositories/user_admin-create.repository';
import { CreateUserAdminDto } from '../dtos/create/create-user-admin.dto';
import { UserAdminUpdateRepository } from '../repositories/user_admin-update.repository';
import { UpdateUserAdminDto } from '../dtos/update/update-user-admin.dto';
import { UserAdminGetRepository } from '../repositories/user_admin-get.repository';
import { UserAdminFields } from '../types/user-admin.types';
import { AllUserAdminQueryDto } from '../dtos/read/all-user-admin.dto';
import { QueryParams } from '@core/types/query-params.type';

@Injectable()
export class UserAdminService {
  constructor(
    private readonly userAdminCreateRepository: UserAdminCreateRepository,
    private readonly userAdminUpdateRepository: UserAdminUpdateRepository,
    private readonly userAdminGetRepository: UserAdminGetRepository
  ) {}

  public async createUserAdmin(body: CreateUserAdminDto) {
    const newUserAdmin =
      await this.userAdminCreateRepository.createUserAdmin(body);

    return newUserAdmin;
  }

  public async updateUserAdmin(body: UpdateUserAdminDto, id: number) {
    const updatedUser = await this.userAdminUpdateRepository.updateUserAdmin(
      body,
      id
    );

    return updatedUser;
  }

  public async getOneUserAdminOrThrowBadRequest(id: number) {
    const userAdmin = await this.userAdminGetRepository.findOneUserAdmin(
      {
        select: UserAdminFields,
        where: { id, deletedAt: null },
      },
      new BadRequestException('No existe el usuario administrador')
    );

    return userAdmin;
  }

  public async getAllUsersAdmin(queryParams: AllUserAdminQueryDto) {
    const userAdmins = await this.userAdminGetRepository.findAllUserAdmin(
      {
        select: UserAdminFields,
        where: { deletedAt: null },
      },
      queryParams as unknown as QueryParams,
      queryParams.paginated
    );

    return userAdmins;
  }

  public async deleteUserAdmin(id: number) {
    await this.userAdminUpdateRepository.deleteUserAdmin(id);

    return { message: 'Usuario Eliminado' };
  }
}
