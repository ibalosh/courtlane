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
  UseInterceptors,
} from '@nestjs/common';

import {
  clearReservationResponseSchema,
  createReservationRequestSchema,
  type CreateReservationRequestDto,
  type ClearReservationResponseDto,
  reservationIdParamsSchema,
  reservationResponseSchema,
  type ReservationIdParamsDto,
  type ReservationResponseDto,
  type AuthUserDto,
  updateReservationRequestSchema,
  type UpdateReservationRequestDto,
  weekScheduleResponseSchema,
  type WeekScheduleResponseDto,
  type WeekScheduleQueryDto,
  weekScheduleQuerySchema,
} from '@courtlane/contracts';

import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ReservationsService } from './reservations.service';
import { ValidateResponseBySchemaInterceptor } from '../../common/interceptors';
import { ValidateBySchemaPipe } from '../../common/pipes';

@Controller('reservations')
@UseGuards(AuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('week')
  @UseInterceptors(
    new ValidateResponseBySchemaInterceptor(weekScheduleResponseSchema),
  )
  getWeekSchedule(
    @Query(new ValidateBySchemaPipe(weekScheduleQuerySchema))
    weekScheduleQuery: WeekScheduleQueryDto,
    @CurrentUser() user: AuthUserDto,
  ): Promise<WeekScheduleResponseDto> {
    return this.reservationsService.getWeekSchedule(
      user.accountId,
      weekScheduleQuery.start,
    );
  }

  @Post()
  @UseInterceptors(
    new ValidateResponseBySchemaInterceptor(reservationResponseSchema),
  )
  async createReservation(
    @Body(new ValidateBySchemaPipe(createReservationRequestSchema))
    createReservationDto: CreateReservationRequestDto,
    @CurrentUser() user: AuthUserDto,
  ): Promise<ReservationResponseDto> {
    return {
      reservation: await this.reservationsService.createReservation(
        user.accountId,
        createReservationDto,
      ),
    };
  }

  @Patch(':id')
  @UseInterceptors(
    new ValidateResponseBySchemaInterceptor(reservationResponseSchema),
  )
  async updateReservation(
    @Param(new ValidateBySchemaPipe(reservationIdParamsSchema))
    reservationParams: ReservationIdParamsDto,
    @Body(new ValidateBySchemaPipe(updateReservationRequestSchema))
    updateReservationDto: UpdateReservationRequestDto,
    @CurrentUser() user: AuthUserDto,
  ): Promise<ReservationResponseDto> {
    return {
      reservation: await this.reservationsService.updateReservation(
        user.accountId,
        reservationParams.id,
        updateReservationDto,
      ),
    };
  }

  @Delete(':id')
  @UseInterceptors(
    new ValidateResponseBySchemaInterceptor(clearReservationResponseSchema),
  )
  async clearReservation(
    @Param(new ValidateBySchemaPipe(reservationIdParamsSchema))
    reservationParams: ReservationIdParamsDto,
    @CurrentUser() user: AuthUserDto,
  ): Promise<ClearReservationResponseDto> {
    await this.reservationsService.clearReservation(
      user.accountId,
      reservationParams.id,
    );

    return { ok: true };
  }
}
