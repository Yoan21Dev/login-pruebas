import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ISessionInfo } from '@core/interfaces/session-info.interface';
import { SessionInfo } from '@core/decorators/session-info.decorator';
import { MeService } from '@me/services/me.service';

@ApiBearerAuth()
@ApiTags('Me (Información del sueño de la session)')
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  public async getMyinfo(@SessionInfo() sessionInfo: ISessionInfo) {
    return this.meService.getMyinfo(sessionInfo);
  }
}
