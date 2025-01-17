import { Injectable } from '@nestjs/common';

import { MeRepository } from '@me/repositories/me.repository';

import { ConfigService } from '@nestjs/config';
import { ISessionInfo } from '@core/interfaces/session-info.interface';

@Injectable()
export class MeService {
  constructor(
    private readonly meRepository: MeRepository,
    private readonly configService: ConfigService
  ) {}

  public async getMyinfo(sessionInfo: ISessionInfo) {
    const { user, userAdmin } = await this.meRepository.findMyInfo(
      sessionInfo.id
    );
    const { ...userData } = user || userAdmin;
    return {
      ...userData,
    };
  }
}
