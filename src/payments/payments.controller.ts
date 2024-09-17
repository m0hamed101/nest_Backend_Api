import { Controller, Post, Body, Param, Req, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import { Stripe } from 'stripe';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent/:orderId')
  async createPaymentIntent(@Param('orderId') orderId: string) {
    // Convert orderId to number if necessary
    const orderIdNumber = parseInt(orderId, 10);
    if (isNaN(orderIdNumber)) {
      throw new BadRequestException('Invalid order ID');
    }
    return this.paymentsService.createPaymentIntent(orderIdNumber);
  }

  @Post('webhook')
  async handleWebhook(@Req() request: Request) {
    const sig = request.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // Ensure this is set in your environment variables

    if (!webhookSecret) {
      throw new BadRequestException('Stripe webhook secret not configured');
    }

    // Convert request.body to Buffer
    const body = Buffer.from(JSON.stringify(request.body));
    const stripeEvent = this.paymentsService.constructStripeEvent(body, sig, webhookSecret);

    await this.paymentsService.handleWebhook(stripeEvent);

    return { received: true };
  }
}
