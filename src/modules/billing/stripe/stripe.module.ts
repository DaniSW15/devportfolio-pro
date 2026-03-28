import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { BillingController } from './stripe.controller';

@Module({
  controllers: [BillingController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
