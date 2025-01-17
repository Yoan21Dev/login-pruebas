import { Public } from '@auth/decorators/public.decorator';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Response,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { Response as IResponse } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { ConfirmAccountDto } from '@user/dtos/create/confirm-account.dto';

import { CreateUserDto } from '@user/dtos/create/create-user.dto';
import { ResetPasswordDto } from '@user/dtos/create/reset-password.dto';
import { SendLinkForRecoverPasswordDto } from '@user/dtos/create/send-link-for-recover-password.dto';
import { SendLinkForSignUpDto } from '@user/dtos/create/send-link-for-sign-up.dto';
import { AllUsersQueryDto } from '@user/dtos/read/all-users.dto';
import { UploadImageUserDto } from '@user/dtos/update/update-user-image';
import { UpdateUserPasswordDto } from '@user/dtos/update/update-user-password';
import { UpdateUserDto } from '@user/dtos/update/update-user.dto';
import { UserService } from '@user/services/user.service';

@ApiTags('Usuarios')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  public async getAllUsers(@Query() queryParams: AllUsersQueryDto) {
    return this.userService.getAllUsers(queryParams);
  }

  @ApiBearerAuth()
  @Get('metadata')
  public async getAllUsersMetaData() {
    return this.userService.getAllUsersMetaData();
  }

  @ApiBearerAuth()
  @Get('roles')
  public async getRoles() {
    return this.userService.getRoles();
  }

  @ApiBearerAuth()
  @Get('statuses')
  public async getStatuses() {
    return this.userService.getStatuses();
  }

  @ApiBearerAuth()
  @Get('roles')
  public async getUserRoles() {
    return '';
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getOneUserOrThrowBadRequest(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  public async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto
  ) {
    return this.userService.updateUserById(id, body);
  }

  @ApiBearerAuth()
  @Patch(':id/password')
  public async updateUserPasswordById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserPasswordDto
  ) {
    return this.userService.updateUserPasswordById(id, body);
  }

  @Public()
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  public async createuser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @ApiBearerAuth()
  @Delete(':id')
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  // sign up

  @Public()
  @Post('send-link-for-sign-up')
  public async sendLinkForSignUp(@Body() body: SendLinkForSignUpDto) {
    return this.userService.sendLinkForSignUp(body);
  }

  // end sign up

  // password recovery

  @Public()
  @Post('send-link-for-recover-password')
  public async sendLinkForRecoverPassword(
    @Body() body: SendLinkForRecoverPasswordDto
  ) {
    return this.userService.sendLinkForRecoverPassword(body);
  }

  // end password recovery

  // reset password

  @Public()
  @Post('reset-password')
  public async resetPassword(@Body() body: ResetPasswordDto) {
    return this.userService.resetPassword(body);
  }

  // end reset password

  @Public()
  @Post('confirm-account')
  public async confirmAccount(@Body() body: ConfirmAccountDto) {
    return this.userService.confirmAccount(body);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'id del user',
    required: true,
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('image'))
  @Post('image/:id')
  public async uploadImages(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UploadImageUserDto,
    @UploadedFiles() file: Express.Multer.File
  ) {
    return this.userService.uploadImages(id, file);
  }

  @Public()
  @Get('image/:name')
  public async serveImage(
    @Response({ passthrough: true }) response: IResponse,
    @Param('name') name: string
  ) {
    return this.userService.serveImage(response, name);
  }
  @ApiBearerAuth()
  @Delete('image/:name')
  public async deleteImage(@Param('name') name: string) {
    return this.userService.deleteImage(name);
  }
}
