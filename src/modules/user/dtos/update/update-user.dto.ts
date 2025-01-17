import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@user/dtos/create/create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const)
) {}
