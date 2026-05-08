import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { Rating } from '../ratings/rating.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async findAll(filters: any) {
    const query = this.storesRepository.createQueryBuilder('store');
    if (filters.name) query.andWhere('store.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.address) query.andWhere('store.address ILIKE :address', { address: `%${filters.address}%` });
    if (filters.sortBy) query.orderBy(`store.${filters.sortBy}`, filters.order === 'desc' ? 'DESC' : 'ASC');
    return query.getMany();
  }

  async findOne(id: number) {
    const store = await this.storesRepository.findOne({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');
    const avg = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'avg')
      .where('rating.store_id = :id', { id })
      .getRawOne();
    return { ...store, averageRating: parseFloat(avg.avg) || 0 };
  }

  async create(data: any) {
    const store = this.storesRepository.create(data);
    return this.storesRepository.save(store);
  }

  async getStoreByOwner(ownerId: number) {
    const store = await this.storesRepository.findOne({ where: { owner_id: ownerId } });
    if (!store) throw new NotFoundException('Store not found');
    const avg = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'avg')
      .where('rating.store_id = :id', { id: store.id })
      .getRawOne();
    const raters = await this.ratingsRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.user', 'user')
      .where('rating.store_id = :id', { id: store.id })
      .getMany();
    return { store, averageRating: parseFloat(avg.avg) || 0, raters };
  }
}
