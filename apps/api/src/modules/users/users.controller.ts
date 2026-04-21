import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import type { AuthUserDto, UpdateProfileDto } from '@courtlane/contracts';
import { updateProfileRequestSchema } from '@courtlane/contracts';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ValidateBySchemaPipe } from '../../common/pipes';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateProfile(
    @Body(new ValidateBySchemaPipe(updateProfileRequestSchema)) updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: AuthUserDto,
  ) {
    return {
      user: await this.usersService.updateProfile(user.id, updateProfileDto),
    };
  }
}
