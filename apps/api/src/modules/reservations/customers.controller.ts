import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  createCustomerResponseSchema,
  createCustomerRequestSchema,
  type CreateCustomerRequestDto,
  type CreateCustomerResponseDto,
  customerSearchResponseSchema,
  customerSearchQuerySchema,
  type CustomerSearchQueryDto,
  type CustomerSearchResponseDto,
  type AuthUserDto,
} from '@courtlane/contracts';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CustomersService } from './customers.service';
import { ValidateBySchemaPipe } from '../../common/pipes';
import { ValidateResponseBySchemaInterceptor } from '../../common/interceptors';

@Controller('customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @UseInterceptors(new ValidateResponseBySchemaInterceptor(customerSearchResponseSchema))
  searchCustomers(
    @Query(new ValidateBySchemaPipe(customerSearchQuerySchema))
    searchQuery: CustomerSearchQueryDto,
    @CurrentUser() user: AuthUserDto,
  ): Promise<CustomerSearchResponseDto> {
    return this.customersService.searchCustomers(user.accountId, searchQuery.query);
  }

  @Post()
  @UseInterceptors(new ValidateResponseBySchemaInterceptor(createCustomerResponseSchema))
  createCustomer(
    @Body(new ValidateBySchemaPipe(createCustomerRequestSchema))
    createCustomerDto: CreateCustomerRequestDto,
    @CurrentUser() user: AuthUserDto,
  ): Promise<CreateCustomerResponseDto> {
    return this.customersService.createCustomer(user.accountId, createCustomerDto);
  }
}
