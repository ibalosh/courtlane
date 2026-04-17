import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { AuthGuard, OptionalAuthGuard } from './auth.guard';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, SessionService, AuthGuard, OptionalAuthGuard],
  exports: [SessionService, AuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
