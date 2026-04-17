import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  createCustomerRequestSchema,
  type CreateCustomerResponseDto,
  customerSearchQuerySchema,
  type CustomerSearchResponseDto,
  type AuthUserDto,
} from '@courtlane/contracts';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ReservationsService } from './reservations.service';

@Controller('customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  searchCustomers(
    @Query() query: unknown,
    @CurrentUser() user: AuthUserDto,
  ): Promise<CustomerSearchResponseDto> {
    const searchQuery = customerSearchQuerySchema.parse(query);

    return this.reservationsService.searchCustomers(
      user.accountId,
      searchQuery.query,
    );
  }

  @Post()
  createCustomer(
    @Body() body: unknown,
    @CurrentUser() user: AuthUserDto,
  ): Promise<CreateCustomerResponseDto> {
    const createCustomerDto = createCustomerRequestSchema.parse(body);

    return this.reservationsService.createCustomer(
      user.accountId,
      createCustomerDto,
    );
  }
}
