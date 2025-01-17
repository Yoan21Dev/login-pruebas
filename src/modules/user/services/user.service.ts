import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { EmailService } from '@core/email/services/email.service';
import { QueryParams } from '@core/types/query-params.type';
import { AllUsersQueryDto } from '@user/dtos/read/all-users.dto';
import { UserGetRepository } from '@user/repositories/user-get.repository';
import { User, UserFields } from '@user/types/user.type';
import { serializeMany, serializeOne } from '@user/serializers/user.serializer';
import { UpdateUserDto } from '@user/dtos/update/update-user.dto';
import { UserUpdateRepository } from '@user/repositories/user-update.repository';
import { UpdateUserPasswordDto } from '@user/dtos/update/update-user-password';
import { UserCreateRepository } from '@user/repositories/user-create.repository';
import { CreateUserDto } from '@user/dtos/create/create-user.dto';
import { SendLinkForSignUpDto } from '@user/dtos/create/send-link-for-sign-up.dto';
import { SendLinkForRecoverPasswordDto } from '@user/dtos/create/send-link-for-recover-password.dto';
import { AuthService } from '@auth/services/auth.service';
import { ResetPasswordDto } from '@user/dtos/create/reset-password.dto';
import { ConfirmAccountDto } from '@user/dtos/create/confirm-account.dto';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { ImagesService } from '@core/images/services/images.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userGetRepository: UserGetRepository,
    private readonly userUpdateRepository: UserUpdateRepository,
    private readonly userCreateReposiory: UserCreateRepository,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
    private readonly imagesService: ImagesService
  ) {}

  public async getAllUsers(queryParams: AllUsersQueryDto) {
    const findOptions: Prisma.userFindManyArgs =
      this.buildAllUsersFilters(queryParams);

    const users = await this.userGetRepository.findAllUsers(
      findOptions,
      queryParams as unknown as QueryParams,

      queryParams.paginated
    );

    if (!queryParams.paginated) {
      return serializeMany(users as unknown as User[], this.configService);
    }

    return users;
  }

  private buildAllUsersFilters(
    queryParams: AllUsersQueryDto
  ): Prisma.userFindManyArgs {
    return {
      select: UserFields,
      where: {
        deletedAt: null,

        ...(queryParams.sedeId !== undefined && {
          sede: { id: { equals: queryParams.sedeId } },
        }),

        session: {
          ...(queryParams.statusId && {
            status: { id: { equals: queryParams.statusId } },
          }),
          ...(queryParams.rolId && {
            rol: { id: { equals: queryParams.rolId } },
          }),
        },

        ...(queryParams.search && {
          OR: [
            {
              name: { contains: queryParams.search, mode: 'insensitive' },
            },
            {
              lastName: { contains: queryParams.search, mode: 'insensitive' },
            },
            {
              session: {
                email: { contains: queryParams.search, mode: 'insensitive' },
              },
            },
          ],
        }),
      },
    };
  }

  public async getRoles() {
    return this.userGetRepository.findAllRoles();
  }

  public async getStatuses() {
    return this.userGetRepository.findAllStatuses();
  }

  public async getAllUsersMetaData() {
    return this.userGetRepository.getAllUsersMetaData();
  }

  public async getOneUserOrThrowBadRequest(id: number) {
    const user = await this.userGetRepository.findOneUser(
      {
        select: UserFields,
        where: { id, deletedAt: null },
      },
      new BadRequestException('No existe el usuario')
    );

    return serializeOne(user, this.configService);
  }

  public async updateUserById(
    id: number,
    body: UpdateUserDto,
    file?: Express.Multer.File
  ) {
    await this.getOneUserOrThrowBadRequest(id);

    const updatedUser = await this.userUpdateRepository.updateUser(
      id,
      body,
      file
    );

    return serializeOne(updatedUser, this.configService);
  }

  public async updateUserPasswordById(id: number, body: UpdateUserPasswordDto) {
    await this.getOneUserOrThrowBadRequest(id);

    await this.userUpdateRepository.updateUserPasswordById(id, body);

    return { message: 'Contraseña actualizada' };
  }

  public async createUser(body: CreateUserDto) {
    body = {
      ...body,
      email: body.email.toLowerCase(),
    };

    const newUser = await this.userCreateReposiory.createUser(body);

    await this.sendConfirmEmail(body.email);

    return serializeOne(newUser, this.configService);
  }

  public async sendConfirmEmail(email: string) {
    const token = this.authService.generateConfirmAccountToken(email);
    const from = this.configService.get('SMTP_FROM');
    const frontBaseUrl = this.configService.get('FRONT_BASE_URL');

    const link = `${frontBaseUrl}/confirm-account?token=${token}`;

    await this.emailService.sendEmail({
      context: { link: link },
      from,
      to: email,
      subject: 'Confirmar Cuenta - Procanje',
      template: 'confirm-email',
    });

    return 'Correo Enviado';
  }

  public async deleteUser(id: number) {
    await this.getOneUserOrThrowBadRequest(id);

    await this.userUpdateRepository.deleteUser(id);

    return { message: 'Usuario Eliminado' };
  }

  public async sendLinkForSignUp(body: SendLinkForSignUpDto) {
    const from = this.configService.get('SMTP_FROM');
    const frontBaseUrl = this.configService.get('FRONT_BASE_URL');
    const link = `${frontBaseUrl}/sign-up?name=${body.name}&&email=${body.email}`;

    this.logger.verbose(
      await this.emailService.sendEmail({
        context: { link: link },
        from,
        to: body.email,
        subject: 'sign-up',
        template: 'sign-up',
      })
    );

    return { message: 'Correo Enviado' };
  }

  public async sendLinkForRecoverPassword(body: SendLinkForRecoverPasswordDto) {
    const from = this.configService.get('SMTP_FROM');
    const frontBaseUrl = this.configService.get('FRONT_BASE_URL');
    const token = this.authService.generateRecoverPasswordToken(body.email);

    const link = `${frontBaseUrl}/reset-password?token=${token}`;

    await this.emailService.sendEmail({
      context: { link: link },
      from,
      to: body.email,
      subject: 'Recuperar contraseña Procanje',
      template: 'reset-password',
    });

    return 'Correo Enviado';
  }

  public async resetPassword(body: ResetPasswordDto) {
    try {
      await this.authService.jwtService.verifyAsync(body.token, {
        secret: this.configService.get('JWT_RECOVER_PASSWORD_SECRET'),
      });
    } catch {
      throw new BadRequestException('El token ha expirado');
    }

    const tokenInBlacklist = await this.authService.tokenInBlacklist(
      body.token
    );

    if (tokenInBlacklist) {
      throw new BadRequestException('El token ha expirado');
    }

    const { email, jti, iat, exp } = this.authService.jwtService.decode(
      body.token
    ) as any;

    await this.userUpdateRepository.updatePassword(email, body.password);

    await this.authService.addTokenToBlackList({ jti, iat, exp });

    return { message: 'Contraseña reestablecida' };
  }

  public async confirmAccount(body: ConfirmAccountDto) {
    try {
      await this.authService.jwtService.verifyAsync(body.token, {
        secret: this.configService.get('JWT_CONFIRM_ACCOUNT_SECRET'),
      });
    } catch {
      throw new BadRequestException('El token ha expirado');
    }

    const tokenInBlacklist = await this.authService.tokenInBlacklist(
      body.token
    );

    if (tokenInBlacklist) {
      throw new BadRequestException('El token ha expirado');
    }

    const { email, jti, iat, exp } = this.authService.jwtService.decode(
      body.token
    ) as any;

    await this.userUpdateRepository.confirmAccount(email);

    await this.authService.addTokenToBlackList({ jti, iat, exp });

    return { message: 'Cuenta confirmada' };
  }

  public async uploadImages(id: number, file: Express.Multer.File) {
    try {
      return await this.updateUserById(id, {}, file);
    } catch (error) {
      const currentWorkingDirectory = process.cwd();

      const filePath = join(currentWorkingDirectory, file.path);

      unlinkSync(filePath);

      throw error;
    }
  }

  public async serveImage(response: Response, name: string) {
    const folder = this.configService.get('USER_IMAGES_FOLDER');

    return this.imagesService.serveImage(folder, name, response);
  }

  public async deleteImage(name: string) {
    const folder = this.configService.get('USER_IMAGES_FOLDER');
    const filePath = join(process.cwd(), folder, name);
    const fileExists = existsSync(filePath);

    if (!fileExists) {
      throw new BadRequestException('Image not found');
    }

    await this.userUpdateRepository.deleteImage(name);

    unlinkSync(filePath);

    return { message: 'Imagen Borrada' };
  }
}
