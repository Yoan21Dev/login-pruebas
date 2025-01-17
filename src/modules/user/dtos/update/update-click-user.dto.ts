import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateClickUserPortalDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  clickOfNameRealtor?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  clickOfMoreOfRealtor?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  clickOfOpenContact?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  clickOfSendContact?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  clickOfWebPage?: number;
}
