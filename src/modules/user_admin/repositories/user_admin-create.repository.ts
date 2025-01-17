import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { CreateUserAdminDto } from '../dtos/create/create-user-admin.dto';
import { UserAdmin, UserAdminFields } from '../types/user-admin.types';
import { SessionTypes } from '@core/enums/session-types.enum';
import { SessionStatus } from '@core/enums/session-status.enum';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserAdminCreateRepository {
  private readonly logger = new Logger(UserAdminCreateRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async createUserAdmin(body: CreateUserAdminDto) {
    try {
      const { address, email, password, ...userData } = body;

      return (await this.prismaService.user_admin.create({
        select: UserAdminFields,
        data: {
          ...userData,

          ...(address && {
            address: {
              create: {
                country: { connect: { id: address?.countryId } },
                internalDbState: { connect: { id: address?.stateId } },
                internalDbCity: { connect: { id: address?.cityId } },
                street: address?.street,
              },
            },
          }),

          session: {
            create: {
              email,
              password: hashSync(password, 10),
              type: { connect: { id: SessionTypes.USER_ADMIN } },
              status: { connect: { id: SessionStatus.ACTIVE } },
              rol: { connect: { id: 1 } },
            },
          },
        },
      })) as unknown as UserAdmin;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Este correo ya existe');
      }

      this.logger.error(error);

      throw new InternalServerErrorException(
        'Ocurrio un error code: DRERdfa2556'
      );
    }
  }
}
