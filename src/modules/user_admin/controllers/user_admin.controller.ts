import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserAdminDto } from '../dtos/create/create-user-admin.dto';
import { UserAdminService } from '../services/user_admin.service';
import { UpdateUserAdminDto } from '../dtos/update/update-user-admin.dto';
import { AllUserAdminQueryDto } from '../dtos/read/all-user-admin.dto';

@ApiBearerAuth()
@ApiTags('Usuarios Administradores')
@Controller('user-admin')
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Post()
  public async createUserAdmin(@Body() body: CreateUserAdminDto) {
    return this.userAdminService.createUserAdmin(body);
  }

  @Patch(':id')
  public async updateUserAdmin(
    @Body() body: UpdateUserAdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.userAdminService.updateUserAdmin(body, id);
  }

  @Get(':id')
  public async getOneUserAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.userAdminService.getOneUserAdminOrThrowBadRequest(id);
  }

  @Get()
  public async getAllUsersAdmin(@Query() queryParams: AllUserAdminQueryDto) {
    return this.userAdminService.getAllUsersAdmin(queryParams);
  }

  @Delete(':id')
  public async deleteUserAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.userAdminService.deleteUserAdmin(id);
  }
}
