import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '@auth/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validate(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.accountConfirmed) {
      throw new UnauthorizedException(
        'Confirma tu cuenta para iniciar sessión'
      );
    }

    return user;
  }
}
