import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupRequestSchema } from '@courtlane/contracts';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: unknown) {
    const input = signupRequestSchema.parse(body);

    return this.authService.signup(input);
  }
}
