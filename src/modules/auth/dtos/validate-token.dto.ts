import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class ValidateTokenDto {
  @ApiProperty()
  @IsJWT()
  at: string;
}
