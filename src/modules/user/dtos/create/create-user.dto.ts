import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateUserAddressdto {
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

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rut?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  webPage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companies?: Array<string>;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  planId?: number;

  @ApiPropertyOptional()
  @ValidateNested()
  address?: CreateUserAddressdto;
}
