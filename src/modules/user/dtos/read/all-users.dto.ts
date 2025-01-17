import { QueryBase } from '@core/dtos/query-base.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class AllUsersQueryDto extends QueryBase {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  statusId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sedeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  paginated: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rolId?: number;
}
