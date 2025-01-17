import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  confirmPassword: string;

  @ApiProperty()
  @IsJWT()
  token: string;
}
