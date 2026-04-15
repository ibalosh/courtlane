import { Injectable } from '@nestjs/common';
import { SignupRequest } from '@courtlane/contracts';

@Injectable()
export class AuthService {
  signup(input: SignupRequest): { message: string } {
    return { message: 'Hello API' };
  }
}
