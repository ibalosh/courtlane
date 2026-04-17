import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { CsrfMiddleware } from './common/middleware/csrf.middleware';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [HealthModule, AuthModule, ReservationsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('*path');
  }
}
