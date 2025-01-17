import { BadRequestException, Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { SessionStatus } from '@core/enums/session-status.enum';
import { PrismaService } from '@core/prisma/services/prisma.service';
import { UpdateUserDto } from '@user/dtos/update/update-user.dto';
import { User, UserFields } from '@user/types/user.type';
import { UpdateUserPasswordDto } from '@user/dtos/update/update-user-password';

@Injectable()
export class UserUpdateRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async updateUser(
    id: number,
    body: UpdateUserDto,
    file?: Express.Multer.File
  ) {
    return (await this.prismaService.user.update({
      where: { id },
      select: UserFields,
      data: {
        ...(body.name && { name: body.name }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.about && { about: body.about }),
        ...(body.companies && { companies: body.companies }),
        ...(body.phone && { phone: body.phone }),
        ...(body.rut && { rut: body.rut }),
        ...(body.webPage && { webPage: body.webPage }),

        session: {
          update: {
            ...(body.email && { email: body.email }),
          },
        },

        ...(body.address && {
          address: {
            upsert: {
              create: {
                ...(body.address?.countryId && {
                  country: { connect: { id: body.address.countryId } },
                }),

                ...(body.address?.stateId && {
                  internalDbState: { connect: { id: body.address.stateId } },
                }),

                ...(body.address?.cityId && {
                  internalDbCity: { connect: { id: body.address.cityId } },
                }),

                ...(body.address?.street && {
                  street: body.address?.street,
                }),
              },
              update: {
                ...(body.address?.countryId && {
                  country: { connect: { id: body.address.countryId } },
                }),

                ...(body.address?.stateId && {
                  internalDbState: { connect: { id: body.address.stateId } },
                }),

                ...(body.address?.cityId && {
                  internalDbCity: { connect: { id: body.address.cityId } },
                }),

                ...(body.address?.street && {
                  street: body.address?.street,
                }),
              },
            },
          },
        }),
        ...(Array(file).length && {
          image: file?.[0]?.filename,
        }),
      },
    })) as unknown as User;
  }

  public async updateUserPasswordById(id: number, body: UpdateUserPasswordDto) {
    await this.prismaService.user.update({
      where: { id },
      select: { id: true },
      data: { session: { update: { password: hashSync(body.password, 10) } } },
    });

    return true;
  }

  public async deleteUser(id: number) {
    await this.prismaService.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        session: {
          update: {
            status: { connect: { id: SessionStatus.DESHABILITADO } },
          },
        },
      },
    });

    return true;
  }

  public async updatePassword(email: string, newPassword: string) {
    const user = await this.prismaService.user.findFirst({
      where: { session: { email } },
      select: { id: true },
    });

    if (!user) {
      throw new BadRequestException('Este correo no esta registrado');
    }

    return this.prismaService.user.update({
      select: UserFields,
      where: { id: user.id },
      data: { session: { update: { password: hashSync(newPassword, 10) } } },
    });
  }

  public async confirmAccount(email: string) {
    await this.prismaService.session.update({
      where: { email },
      data: { accountConfirmed: true },
    });

    return true;
  }

  async deleteImage(_name: string) {
    // Implement file deletion logic here
  }
}
