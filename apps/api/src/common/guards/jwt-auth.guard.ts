import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser | false,
    _info: unknown,
  ): TUser {
    if (err || !user) {
      throw (
        (err as Error) ||
        new UnauthorizedException('Authentication required. Please provide a valid Bearer token.')
      );
    }
    return user;
  }
}
