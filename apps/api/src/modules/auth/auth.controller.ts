import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { AuthUserDto, LoginDto, SignupDto, UpdateProfileDto } from '@courtlane/contracts';
import { AuthService } from './auth.service';
import { loginRequestSchema, signupRequestSchema, updateProfileRequestSchema } from '@courtlane/contracts';
import { Request, Response } from 'express';
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from './auth.cookies';
import { CurrentUser } from './current-user.decorator';
import { AuthGuard, OptionalAuthGuard } from './auth.guard';
import { ValidateBySchemaPipe } from '../../common/pipes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body(new ValidateBySchemaPipe(signupRequestSchema)) signupDto: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signupResult = await this.authService.signup(signupDto);

    this.setSessionCookie(response, signupResult.sessionId, signupResult.sessionExpiresAt);

    return { user: signupResult.user };
  }

  @Post('login')
  async login(
    @Body(new ValidateBySchemaPipe(loginRequestSchema)) loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginResult = await this.authService.login(loginDto);

    this.setSessionCookie(response, loginResult.sessionId, loginResult.sessionExpiresAt);

    return { user: loginResult.user };
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const logoutResponse = await this.authService.logout(this.getSessionId(request));
    this.clearSessionCookie(response);

    return logoutResponse;
  }

  @UseGuards(OptionalAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUserDto | null) {
    return { user };
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateProfile(
    @Body(new ValidateBySchemaPipe(updateProfileRequestSchema)) updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: AuthUserDto,
  ) {
    return {
      user: await this.authService.updateProfile(user.id, updateProfileDto),
    };
  }

  private clearSessionCookie(response: Response) {
    response.clearCookie(SESSION_COOKIE_NAME, getSessionCookieOptions());
  }

  private setSessionCookie(response: Response, sessionId: string, expiresAt: Date) {
    response.cookie(SESSION_COOKIE_NAME, sessionId, getSessionCookieOptions({ expires: expiresAt }));
  }

  private getSessionId(request: Request): string | null {
    return request.cookies?.[SESSION_COOKIE_NAME] ?? null;
  }
}
