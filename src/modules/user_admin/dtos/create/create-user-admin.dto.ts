import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateUserAdminAddressdto {
  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsNumber()
  countryId: number;

  @ApiProperty()
  @IsNumber()
  stateId: number;

  @ApiProperty()
  @IsNumber()
  cityId: number;
}

export class CreateUserAdminDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @ValidateNested()
  address?: CreateUserAdminAddressdto;
}
