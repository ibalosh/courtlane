import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginRequestSchema, signupRequestSchema } from '@courtlane/contracts';
import { Request, Response } from 'express';
import { SESSION_COOKIE_NAME } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const input = signupRequestSchema.parse(body);
    const result = await this.authService.signup(input);

    this.setSessionCookie(response, result.sessionId, result.sessionExpiresAt);

    return { user: result.user };
  }

  @Post('login')
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const input = loginRequestSchema.parse(body);
    const result = await this.authService.login(input);

    this.setSessionCookie(response, result.sessionId, result.sessionExpiresAt);

    return { user: result.user };
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.logout(this.getSessionId(request));

    this.clearSessionCookie(response);

    return result;
  }

  @Get('me')
  async me(@Req() request: Request) {
    const sessionId = this.getSessionId(request);
    return this.authService.me(sessionId);
  }

  private clearSessionCookie(response: Response) {
    response.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env['NODE_ENV'] === 'production',
      path: '/',
    });
  }

  private setSessionCookie(
    response: Response,
    sessionId: string,
    expiresAt: Date,
  ) {
    response.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env['NODE_ENV'] === 'production',
      expires: expiresAt,
      path: '/',
    });
  }

  private getSessionId(request: Request): string | null {
    const cookieHeader = request.headers.cookie;

    if (!cookieHeader) {
      return null;
    }

    for (const cookie of cookieHeader.split(';')) {
      const [rawName, ...rawValueParts] = cookie.trim().split('=');

      if (rawName === SESSION_COOKIE_NAME) {
        return rawValueParts.join('=') || null;
      }
    }

    return null;
  }
}
