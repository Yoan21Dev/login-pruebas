import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { QueryBase } from '@core/dtos/query-base.dto';

export class AllUserAdminQueryDto extends QueryBase {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  paginated: boolean = true;
}
