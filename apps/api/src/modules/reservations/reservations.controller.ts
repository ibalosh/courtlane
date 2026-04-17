import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  type AuthUserDto,
  type WeekScheduleResponseDto,
  weekScheduleQuerySchema,
} from '@courtlane/contracts';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
@UseGuards(AuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('week')
  getWeekSchedule(
    @Query() query: unknown,
    @CurrentUser() user: AuthUserDto,
  ): Promise<WeekScheduleResponseDto> {
    const weekQuery = weekScheduleQuerySchema.parse(query);

    return this.reservationsService.getWeekSchedule(
      user.accountId,
      weekQuery.start,
    );
  }
}
