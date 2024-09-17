import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { UsersService } from '../users/users.service';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private usersService: UsersService,
  ) {
    this.stripe = new Stripe('sk_test_51Pz65j2KPx2Jofd46K5dgZ1U7QZVhwUSVgaCJ4u2hNg0HMPXs9e7JvrD8NbpJZQSkZA7bEW8pfjMbY3CQm2F2hMh00qvgKL9Ck', {
      apiVersion: '2024-06-20', // Update to the latest Stripe API version
    });
  }

  async createPaymentIntent(orderId: number): Promise<Stripe.PaymentIntent> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId }, // Ensure `orderId` is of type number
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Stripe amount is in cents
      currency: 'usd',
      metadata: { orderId: order.id.toString() },
    });

    return paymentIntent;
  }

  constructStripeEvent(body: Buffer, sig: string, webhookSecret: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(body, sig, webhookSecret);
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      // Ensure `orderId` is a number before querying
      const order = await this.ordersRepository.findOne({
        where: { id: parseInt(orderId, 10) }, // Convert to number
      });

      if (order) {
        order.status = 'paid';
        await this.ordersRepository.save(order);
      }
    }
  }
}
