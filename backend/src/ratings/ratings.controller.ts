import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RatingsService } from './ratings.service';

@Controller('ratings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @Roles('user')
  submitRating(
    @Request() req: any,
    @Body('store_id') storeId: number,
    @Body('rating') rating: number,
  ) {
    return this.ratingsService.submitRating(req.user.id, storeId, rating);
  }

  @Get('store/:storeId')
  getUserRating(
    @Request() req: any,
    @Param('storeId') storeId: string,
  ) {
    return this.ratingsService.getUserRating(req.user.id, +storeId);
  }

  @Get('total')
  @Roles('admin')
  getTotalRatings() {
    return this.ratingsService.getTotalRatings();
  }
}
