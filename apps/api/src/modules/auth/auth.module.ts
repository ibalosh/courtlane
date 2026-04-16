import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, SessionService],
})
export class AuthModule {}
