import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from '../reviews/dto/review.entity'; // Adjust the path if necessary
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]),
  forwardRef(() => ProductsModule),
  forwardRef(() => UsersModule),
], 
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService], // Export ReviewsService if needed in other modules
})
export class ReviewsModule {}
