import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  customerIdParamsSchema,
  customerListResponseSchema,
  createCustomerResponseSchema,
  createCustomerRequestSchema,
  type CreateCustomerRequestDto,
  type CreateCustomerResponseDto,
  type CustomerIdParamsDto,
  type CustomerListResponseDto,
  customerSearchResponseSchema,
  customerSearchQuerySchema,
  deleteCustomerResponseSchema,
  type DeleteCustomerResponseDto,
  type CustomerSearchQueryDto,
  type CustomerSearchResponseDto,
  updateCustomerRequestSchema,
  updateCustomerResponseSchema,
  type UpdateCustomerRequestDto,
  type UpdateCustomerResponseDto,
  type AuthUserDto,
} from '@courtlane/contracts';
import { ValidateResponseBySchemaInterceptor } from '../../common/interceptors';
import { ValidateBySchemaPipe } from '../../common/pipes';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CustomersService } from './customers.service';

@Controller('customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @UseInterceptors(new ValidateResponseBySchemaInterceptor(customerListResponseSchema))
  listCustomers(@CurrentUser() user: AuthUserDto): Promise<CustomerListResponseDto> {
    return this.customersService.listCustomers(user.accountId);
  }

  @Get('search')
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

  @Patch(':id')
  @UseInterceptors(new ValidateResponseBySchemaInterceptor(updateCustomerResponseSchema))
  updateCustomer(
    @Param(new ValidateBySchemaPipe(customerIdParamsSchema))
    customerParams: CustomerIdParamsDto,
    @Body(new ValidateBySchemaPipe(updateCustomerRequestSchema))
    updateCustomerDto: UpdateCustomerRequestDto,
    @CurrentUser() user: AuthUserDto,
  ): Promise<UpdateCustomerResponseDto> {
    return this.customersService.updateCustomer(user.accountId, customerParams.id, updateCustomerDto);
  }

  @Delete(':id')
  @UseInterceptors(new ValidateResponseBySchemaInterceptor(deleteCustomerResponseSchema))
  deleteCustomer(
    @Param(new ValidateBySchemaPipe(customerIdParamsSchema))
    customerParams: CustomerIdParamsDto,
    @CurrentUser() user: AuthUserDto,
  ): Promise<DeleteCustomerResponseDto> {
    return this.customersService.deleteCustomer(user.accountId, customerParams.id);
  }
}
