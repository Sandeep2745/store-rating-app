import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(filters: any) {
    const query = this.usersRepository.createQueryBuilder('user');
    if (filters.name) query.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.email) query.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
    if (filters.address) query.andWhere('user.address ILIKE :address', { address: `%${filters.address}%` });
    if (filters.role) query.andWhere('user.role = :role', { role: filters.role });
    if (filters.sortBy) query.orderBy(`user.${filters.sortBy}`, filters.order === 'desc' ? 'DESC' : 'ASC');
    return query.getMany();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({ ...data, password: hashed });
    return this.usersRepository.save(user);
  }

  async updatePassword(id: number, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    await this.usersRepository.update(id, { password: hashed });
    return { message: 'Password updated successfully' };
  }

  async getDashboard() {
    const users = await this.usersRepository.count();
    return { totalUsers: users };
  }
}
