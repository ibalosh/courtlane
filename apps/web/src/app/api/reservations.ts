import type {
  WeekScheduleQueryDto,
  WeekScheduleResponseDto,
} from '@courtlane/contracts';
import { request } from './client';

export type {
  WeekScheduleQueryDto as WeekScheduleQuery,
  WeekScheduleResponseDto as WeekScheduleResponse,
};

export function getWeekSchedule(
  query: WeekScheduleQueryDto,
): Promise<WeekScheduleResponseDto> {
  const search = new URLSearchParams({
    start: query.start,
  });

  return request<WeekScheduleResponseDto>(
    `/reservations/week?${search.toString()}`,
  );
}
