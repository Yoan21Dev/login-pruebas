import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SessionInfo } from '@core/decorators/session-info.decorator';
import { ISessionInfo } from '@core/interfaces/session-info.interface';
import { ROUTES } from '@core/enums/routes.enum';
import { AuthService } from '@auth/services/auth.service';
import { LocalAuthGuard } from '@auth/guards/local-auth-guard';
import { Public } from '@auth/decorators/public.decorator';
import { JwtRefreshGuard } from '@auth/guards/jwt-refresh.guard';
import { LoginDto } from '@auth/dtos/login.dto';
import { RefreshTokenDto } from '@auth/dtos/refresh-token.dto';

@ApiTags('Autenticación')
@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(ROUTES.AUTH_LOGIN)
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  public async login(@Request() req: any, @Body() _body: LoginDto) {
    return await this.authService.generateAccessToken(req.user);
  }

  @ApiBearerAuth()
  @Get(ROUTES.AUTH_VALIDATE)
  public isValidSession(@SessionInfo() sessionInfo: ISessionInfo) {
    return this.authService.isValidSession(sessionInfo);
  }

  @ApiBearerAuth()
  @Delete(ROUTES.AUTH_LOGOUT)
  public async logout(@SessionInfo() sessionInfo: ISessionInfo) {
    return await this.authService.logout(sessionInfo);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @Post(ROUTES.AUTH_REFRESH)
  public async refreshToken(
    @SessionInfo() sessionInfo: ISessionInfo,
    @Body() body: RefreshTokenDto
  ) {
    return this.authService.refreshToken(sessionInfo, body.access_token);
  }
}
