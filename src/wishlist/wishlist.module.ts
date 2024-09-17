import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './dto/wishlist.entity'; // Adjust path as necessary
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { UsersModule } from '../users/users.module'; // Import UsersModule if needed
import { ProductsModule } from '../products/products.module'; // Import ProductsModule if needed

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist]),
    forwardRef(() => ProductsModule), // Use forwardRef if ProductsModule depends on WishlistModule
    forwardRef(() => UsersModule), // Use forwardRef if UsersModule depends on WishlistModule
  ],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [WishlistService], // Export WishlistService if other modules need it
})
export class WishlistModule {}
