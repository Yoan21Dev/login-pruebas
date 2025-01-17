import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import {
  CreateUserAdminAddressdto,
  CreateUserAdminDto,
} from '../create/create-user-admin.dto';
import { ValidateNested } from 'class-validator';

export class UpdateUserAdminAddressdto extends PartialType(
  CreateUserAdminAddressdto
) {}

export class UpdateUserAdminDto extends OmitType(
  PartialType(CreateUserAdminDto),
  ['address']
) {
  @ApiPropertyOptional()
  @ValidateNested()
  address?: UpdateUserAdminAddressdto;
}
