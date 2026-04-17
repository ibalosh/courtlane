import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  clearReservationResponseSchema,
  createReservationRequestSchema,
  type ClearReservationResponseDto,
  reservationIdParamsSchema,
  reservationResponseSchema,
  type ReservationResponseDto,
  type AuthUserDto,
  updateReservationRequestSchema,
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

  @Post()
  async createReservation(
    @Body() body: unknown,
    @CurrentUser() user: AuthUserDto,
  ): Promise<ReservationResponseDto> {
    const createReservationDto = createReservationRequestSchema.parse(body);

    return reservationResponseSchema.parse({
      reservation: await this.reservationsService.createReservation(
        user.accountId,
        createReservationDto,
      ),
    });
  }

  @Patch(':id')
  async updateReservation(
    @Param() params: unknown,
    @Body() body: unknown,
    @CurrentUser() user: AuthUserDto,
  ): Promise<ReservationResponseDto> {
    const reservationParams = reservationIdParamsSchema.parse(params);
    const updateReservationDto = updateReservationRequestSchema.parse(body);

    return reservationResponseSchema.parse({
      reservation: await this.reservationsService.updateReservation(
        user.accountId,
        reservationParams.id,
        updateReservationDto,
      ),
    });
  }

  @Delete(':id')
  async clearReservation(
    @Param() params: unknown,
    @CurrentUser() user: AuthUserDto,
  ): Promise<ClearReservationResponseDto> {
    const reservationParams = reservationIdParamsSchema.parse(params);

    await this.reservationsService.clearReservation(
      user.accountId,
      reservationParams.id,
    );

    return clearReservationResponseSchema.parse({ ok: true });
  }
}
