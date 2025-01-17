import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { UpdateUserAdminDto } from '../dtos/update/update-user-admin.dto';
import { UserAdminFields } from '../types/user-admin.types';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserAdminUpdateRepository {
  private readonly logger = new Logger(UserAdminUpdateRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async updateUserAdmin(body: UpdateUserAdminDto, id: number) {
    try {
      const { address, email, password, ...userAdminData } = body;

      return this.prismaService.user_admin.update({
        where: { id },
        select: UserAdminFields,
        data: {
          ...userAdminData,

          ...((email || password) && {
            session: {
              update: {
                email,
                ...(password && { password: hashSync(password, 10) }),
              },
            },
          }),

          ...(address && {
            address: {
              upsert: {
                create: {
                  ...(address?.countryId && {
                    country: { connect: { id: address.countryId } },
                  }),

                  ...(address?.stateId && {
                    internalDbState: { connect: { id: address.stateId } },
                  }),

                  ...(address?.cityId && {
                    internalDbCity: { connect: { id: address.cityId } },
                  }),

                  ...(address?.street && {
                    street: address?.street,
                  }),
                },
                update: {
                  ...(address?.countryId && {
                    country: { connect: { id: address.countryId } },
                  }),

                  ...(address?.stateId && {
                    internalDbState: { connect: { id: address.stateId } },
                  }),

                  ...(address?.cityId && {
                    internalDbCity: { connect: { id: address.cityId } },
                  }),

                  ...(address?.street && {
                    street: address?.street,
                  }),
                },
              },
            },
          }),
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Ocurrio un error creando el usuario admistrador, intenta más tarde'
      );
    }
  }

  public async deleteUserAdmin(id: number) {
    try {
      await this.prismaService.user_admin.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return true;
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Ocurrio un error al borrar el usuario administrador'
      );
    }
  }
}
