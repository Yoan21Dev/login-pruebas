import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateRolDto } from '@rol/dtos/create/create-rol.dto';
import { AllRolesQueryDto } from '@rol/dtos/read/all-roles.dto';
import { UpdateRolDto } from '@rol/dtos/update/update-rol.dto';
import { RolService } from '@rol/services/rol.service';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  public async createRol(@Body() body: CreateRolDto) {
    return this.rolService.createRol(body);
  }

  @Patch(':id')
  public async updateRol(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRolDto
  ) {
    return this.rolService.updateRolById(id, body);
  }

  @Get('metadata')
  public async getRolesMetadata() {
    return this.rolService.getRolesMetadata();
  }

  @Get(':id')
  public async getRolById(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.getOneRolOrThrowBadRequest(id);
  }

  @Get()
  public async getAllRoles(@Query() queryParams: AllRolesQueryDto) {
    return this.rolService.getAllRoles(queryParams);
  }
}
