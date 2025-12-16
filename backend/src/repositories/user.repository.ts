import prisma from '../config/database';
import { User } from '@prisma/client';

export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  /**
   * Create new user
   */
  async create(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    return prisma.user.create({ data });
  }

  /**
   * Update user profile
   */
  async update(
    id: string,
    data: { name?: string; email?: string }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Get all users (for assignment dropdown)
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}