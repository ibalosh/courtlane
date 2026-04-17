import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginRequestSchema, signupRequestSchema } from '@courtlane/contracts';
import { Request, Response } from 'express';
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from './auth.cookies';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signupDto = signupRequestSchema.parse(body);
    const signupResult = await this.authService.signup(signupDto);

    this.setSessionCookie(
      response,
      signupResult.sessionId,
      signupResult.sessionExpiresAt,
    );

    return { user: signupResult.user };
  }

  @Post('login')
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginDto = loginRequestSchema.parse(body);
    const loginResult = await this.authService.login(loginDto);

    this.setSessionCookie(
      response,
      loginResult.sessionId,
      loginResult.sessionExpiresAt,
    );

    return { user: loginResult.user };
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const logoutResponse = await this.authService.logout(
      this.getSessionId(request),
    );

    this.clearSessionCookie(response);

    return logoutResponse;
  }

  @Get('me')
  async me(@Req() request: Request) {
    const sessionId = this.getSessionId(request);
    return this.authService.me(sessionId);
  }

  private clearSessionCookie(response: Response) {
    response.clearCookie(SESSION_COOKIE_NAME, getSessionCookieOptions());
  }

  private setSessionCookie(
    response: Response,
    sessionId: string,
    expiresAt: Date,
  ) {
    response.cookie(
      SESSION_COOKIE_NAME,
      sessionId,
      getSessionCookieOptions({ expires: expiresAt }),
    );
  }

  private getSessionId(request: Request): string | null {
    return request.cookies?.[SESSION_COOKIE_NAME] ?? null;
  }
}
