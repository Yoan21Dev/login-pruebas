import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryBase {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  page?: number = 1;
}
