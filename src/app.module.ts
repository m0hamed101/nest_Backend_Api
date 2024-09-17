import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Category } from './products/category.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order.entity';
import { Cart } from './cart/dto/cart.entity';
import { CartItem } from './cart/dto/cart.entity'; 
import { CartModule } from './cart/cart.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/dto/review.entity';
import { WishlistModule } from './wishlist/wishlist.module';
import { Wishlist } from './wishlist/dto/wishlist.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/dto/notifications.entity';
import { ReportsController } from './reports/reports.controller';
import { ReportsService } from './reports/reports.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db',
      entities: [User, Product, Category, Order, OrderItem, Cart, CartItem,Review,Wishlist,Notification],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    CartModule,
    ReviewsModule,
    WishlistModule,
    NotificationsModule,
  ],
})
export class AppModule {}
