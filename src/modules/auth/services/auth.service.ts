import { compareSync } from 'bcrypt';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { Cache } from 'cache-manager';
import { differenceInSeconds } from 'date-fns';

import { AuthRepository } from '@auth/repositories/auth.repositories';
import { ISessionInfo } from '@core/interfaces/session-info.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    public readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  public async generateAccessToken(tokenPayload: {
    id: bigint | number;
    type: number;
    rol: number;
    sede: number;
  }) {
    const accessTokenJwtid = nanoid(32);
    const accessTokenSignOptions: JwtSignOptions = {
      jwtid: accessTokenJwtid,
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_LIFE'),
    };
    const access_token = this.jwtService.sign(
      tokenPayload,
      accessTokenSignOptions
    );
    const refresh_token = this.generateRefreshAcessToken(accessTokenJwtid);

    await this.authRepository.updateMetaData(tokenPayload.id);

    return {
      access_token,
      refresh_token,
      expirationInSeconds: parseInt(
        this.configService.get('JWT_ACCESS_TOKEN_LIFE')
      ),
      type: tokenPayload.type,
      rol: tokenPayload.rol,
      sede: tokenPayload.sede,
    };
  }

  private generateRefreshAcessToken(accessTokenJwtid: string) {
    const refreshTokenJwtid = nanoid(32);
    const refreshTokenSignOptions: JwtSignOptions = {
      jwtid: refreshTokenJwtid,
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_LIFE'),
    };
    const refresh_token = this.jwtService.sign(
      { atjwtid: accessTokenJwtid },
      refreshTokenSignOptions
    );

    return refresh_token;
  }

  public async validate(username: string, password: string) {
    const sessionInfo = await this.authRepository.getSessionInfo(
      username.toLowerCase()
    );

    if (!sessionInfo || !compareSync(password, sessionInfo.password)) {
      return false;
    }

    return {
      id: sessionInfo.id,
      type: sessionInfo.typeId,
      rol: sessionInfo.rolId,
      accountConfirmed: sessionInfo.accountConfirmed,
    };
  }

  public async logout(tokenInfo: ISessionInfo) {
    await this.addTokenToBlackList(tokenInfo);

    return { message: 'session closed successfully' };
  }

  public async addTokenToBlackList(tokenInfo: ISessionInfo) {
    const jti = tokenInfo.jti;
    const now = Date.now();
    const exp = tokenInfo.exp * 1000;
    const ttl = differenceInSeconds(exp, now);

    if (1 > ttl) {
      return true;
    }

    await this.cacheManager.set(jti, jti, { ttl } as any);

    return true;
  }

  public async refreshToken(
    refreshTokenInfo: ISessionInfo,
    access_token: string
  ) {
    try {
      const accessTokenInfo: ISessionInfo = this.jwtService.verify(
        access_token,
        {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
          ignoreExpiration: true,
        }
      );

      if (refreshTokenInfo.atjwtid !== accessTokenInfo.jti) {
        throw new BadRequestException();
      }

      await this.addTokenToBlackList(refreshTokenInfo);
      await this.addTokenToBlackList(accessTokenInfo);

      return await this.generateAccessToken({
        id: accessTokenInfo.id,
        type: accessTokenInfo.type,
        rol: accessTokenInfo.rol,
        sede: accessTokenInfo.sede,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  public async isValidSession(sessionInfo: ISessionInfo) {
    const expirationInSeconds = differenceInSeconds(
      sessionInfo.exp * 1000,
      Date.now()
    );

    return {
      expirationInSeconds,
      type: sessionInfo.type,
    };
  }

  public generateRecoverPasswordToken(email: string) {
    const accessTokenJwtid = nanoid(32);
    const accessTokenSignOptions: JwtSignOptions = {
      jwtid: accessTokenJwtid,
      secret: this.configService.get('JWT_RECOVER_PASSWORD_SECRET'),
      expiresIn: this.configService.get('JWT_RECOVER_PASSWORD_LIFE'),
    };
    const token = this.jwtService.sign({ email }, accessTokenSignOptions);

    return token;
  }

  public generateConfirmAccountToken(email: string) {
    const accessTokenJwtid = nanoid(32);
    const accessTokenSignOptions: JwtSignOptions = {
      jwtid: accessTokenJwtid,
      secret: this.configService.get('JWT_CONFIRM_ACCOUNT_SECRET'),
      expiresIn: this.configService.get('JWT_CONFIRM_ACCOUNT_LIFE'),
    };
    const token = this.jwtService.sign({ email }, accessTokenSignOptions);

    return token;
  }

  public async tokenInBlacklist(accessToken: string): Promise<boolean> {
    const decodeToken: any = this.jwtService.decode(accessToken);

    if (!decodeToken) {
      return false;
    }

    const jti = decodeToken.jti;

    return (await this.cacheManager.get(jti)) || false;
  }
}
