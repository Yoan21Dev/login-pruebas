import { PartialType } from '@nestjs/swagger';

import { CreateRolDto } from '@rol/dtos/create/create-rol.dto';

export class UpdateRolDto extends PartialType(CreateRolDto) {}
