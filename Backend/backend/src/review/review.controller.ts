import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from '../entities/review.entity';

@Controller('products/:productId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async addReview(
    @Param('productId') productId: number,
    @Body() reviewData: Partial<Review>,
  ): Promise<Review> {
    return this.reviewService.createReview(productId, reviewData);
  }

  @Get()
  async getReviews(@Param('productId') productId: number): Promise<Review[]> {
    return this.reviewService.getReviewsForProduct(productId);
  }
}
