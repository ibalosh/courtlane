import type {
  ClearReservationResponseDto,
  CreateReservationRequestDto,
  ReservationResponseDto,
  WeekScheduleQueryDto,
  WeekScheduleResponseDto,
  UpdateReservationRequestDto,
} from '@courtlane/contracts';
import { request } from './client';

export type {
  ClearReservationResponseDto as ClearReservationResponse,
  CreateReservationRequestDto as CreateReservationInput,
  ReservationResponseDto as ReservationResponse,
  UpdateReservationRequestDto as UpdateReservationInput,
  WeekScheduleQueryDto as WeekScheduleQuery,
  WeekScheduleResponseDto as WeekScheduleResponse,
};

export function getWeekSchedule(query: WeekScheduleQueryDto): Promise<WeekScheduleResponseDto> {
  const search = new URLSearchParams({
    start: query.start,
  });

  return request<WeekScheduleResponseDto>(`/reservations/week?${search.toString()}`);
}

export function createReservation(input: CreateReservationRequestDto): Promise<ReservationResponseDto> {
  return request<ReservationResponseDto>('/reservations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateReservation(id: number, input: UpdateReservationRequestDto): Promise<ReservationResponseDto> {
  return request<ReservationResponseDto>(`/reservations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function clearReservation(id: number): Promise<ClearReservationResponseDto> {
  return request<ClearReservationResponseDto>(`/reservations/${id}`, {
    method: 'DELETE',
  });
}
