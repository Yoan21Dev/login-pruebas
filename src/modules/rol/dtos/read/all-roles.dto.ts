import { QueryBase } from '@core/dtos/query-base.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AllRolesQueryDto extends QueryBase {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
