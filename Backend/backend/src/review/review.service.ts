import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createReview(productId: number, reviewData: Partial<Review>): Promise<Review> {
    this.logger.log(`Attempting to save review for product ID ${productId}, data: ${JSON.stringify(reviewData)}`);
    try {
      const product = await this.productRepository.findOne({ where: { id: productId } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      const review = this.reviewRepository.create({
        ...reviewData,
        product,
      });
      const savedReview = await this.reviewRepository.save(review);
      this.logger.log(`Successfully saved review with ID ${savedReview.id}`);
      return savedReview;
    } catch (error) {
      this.logger.error(`Error saving review for product ID ${productId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getReviewsForProduct(productId: number): Promise<Review[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['reviews'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return product.reviews;
  }
}
