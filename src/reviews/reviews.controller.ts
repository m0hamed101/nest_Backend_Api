import { Controller, Post, Get, Patch, Delete, Param, Body, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Request } from 'express';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':productId')
  createReview(@Req() req: Request, @Param('productId') productId: number, @Body() createReviewDto: CreateReviewDto) {
    const userId = req.user["id"]; // Ensure you handle optional user
    return this.reviewsService.addReview(userId, productId, createReviewDto);
  }

  @Get('product/:productId')
  findProductReviews(@Param('productId') productId: number) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Patch(':reviewId')
  updateReview(@Req() req: Request, @Param('reviewId') reviewId: number, @Body() updateReviewDto: UpdateReviewDto) {
    const userId = req.user["id"]; // Ensure you handle optional user
    return this.reviewsService.updateReview(userId, reviewId, updateReviewDto);
  }

  @Delete(':reviewId')
  removeReview(@Req() req: Request, @Param('reviewId') reviewId: number) {
    const userId = req.user["id"]; // Ensure you handle optional user
    return this.reviewsService.deleteReview(userId, reviewId);
  }
}
