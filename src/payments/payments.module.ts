import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from '../orders/orders.module'; // Ensure OrdersModule is imported if it's used
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Order } from '../orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]), // Register Order repository
    UsersModule,
    OrdersModule, // Ensure OrdersModule is imported if it's used
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService], // Optionally export PaymentsService if needed
})
export class PaymentsModule {}
