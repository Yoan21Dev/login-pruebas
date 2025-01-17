import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { hashSync } from 'bcrypt';

import { SessionTypes } from '@core/enums/session-types.enum';
import { PrismaService } from '@core/prisma/services/prisma.service';
import { CreateUserDto } from '@user/dtos/create/create-user.dto';
import { User, UserFields } from '@user/types/user.type';

@Injectable()
export class UserCreateRepository {
  private readonly logger = new Logger(UserCreateRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async createUser(body: CreateUserDto) {
    try {
      return (await this.prismaService.user.create({
        select: UserFields,
        data: {
          name: body.name,
          lastName: body.lastName,

          session: {
            create: {
              email: body.email,
              password: hashSync(body.password, 10),
              status: { connect: { id: 1 } },
              type: { connect: { id: SessionTypes.USER } },
              rol: { connect: { id: 2 } },
            },
          },
        },
      })) as unknown as User;
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target[0] === 'email') {
        throw new BadRequestException(
          'El correo que intentas registrar ya existe'
        );
      }

      this.logger.error(error);

      throw new BadRequestException(error);
    }
  }
}
