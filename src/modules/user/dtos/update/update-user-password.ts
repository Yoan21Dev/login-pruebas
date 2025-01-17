import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  confirmPassword: string;
}
