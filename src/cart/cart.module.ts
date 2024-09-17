import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './dto/cart.entity';
import { CartItem } from './dto/cart.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Category } from '../products/category.entity';
import { ProductsModule } from '../products/products.module'; // Updated import path
import { UsersModule } from '../users/users.module'; // Updated import path

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, User, Product, Category]),
    forwardRef(() => ProductsModule), // Correct usage of forwardRef
    forwardRef(() => UsersModule), // Correct usage of forwardRef
  ],
  providers: [CartService, UsersService, ProductsService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
