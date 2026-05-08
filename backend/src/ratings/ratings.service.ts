import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async submitRating(userId: number, storeId: number, rating: number) {
    const existing = await this.ratingsRepository.findOne({
      where: { user_id: userId, store_id: storeId },
    });
    if (existing) {
      await this.ratingsRepository.update(existing.id, { rating });
      return { message: 'Rating updated successfully' };
    }
    const newRating = this.ratingsRepository.create({
      user_id: userId,
      store_id: storeId,
      rating,
    });
    await this.ratingsRepository.save(newRating);
    return { message: 'Rating submitted successfully' };
  }

  async getUserRating(userId: number, storeId: number) {
    const rating = await this.ratingsRepository.findOne({
      where: { user_id: userId, store_id: storeId },
    });
    return rating || null;
  }

  async getTotalRatings() {
    return this.ratingsRepository.count();
  }
}
