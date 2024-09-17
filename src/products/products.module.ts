import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { Category } from './category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]), // Ensure Product and Category are imported here
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService], // Export ProductsService if used in other modules
})
export class ProductsModule {}
