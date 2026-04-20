import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AuthenticatedRequest } from './auth.types';
import { SESSION_COOKIE_NAME } from './auth.cookies';
import { SessionService } from './session.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const sessionToken = request.cookies?.[SESSION_COOKIE_NAME] ?? null;
    await this.attachUserToTheRequest(request, sessionToken);

    return true;
  }

  private async attachUserToTheRequest(request: AuthenticatedRequest, sessionToken: string) {
    request.user = sessionToken ? await this.sessionService.getUser(sessionToken) : null;
  }
}

@Injectable()
export class AuthGuard extends OptionalAuthGuard {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user) {
      throw new UnauthorizedException('Authentication required.');
    }

    return true;
  }
}
