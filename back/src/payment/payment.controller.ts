import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  async checkout(@Body() body: { email: string; items: number[] }) {
    return this.paymentService.createOrder(body);
  }

  @Post('webhook')
  async webhook(@Body() event: any) {
    return this.paymentService.handleWebhook(event);
  }
}
