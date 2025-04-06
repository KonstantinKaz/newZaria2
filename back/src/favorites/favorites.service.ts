import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavorites(userId: string) {
    const favorites = await this.prisma.favouriteItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { items: favorites };
  }

  async toggleFavorite(userId: string, productId: number) {
    const existingFavorite = await this.prisma.favouriteItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingFavorite) {
      return this.prisma.favouriteItem.delete({
        where: {
          id: existingFavorite.id,
        },
      });
    }

    return this.prisma.favouriteItem.create({
      data: {
        userId,
        productId,
      },
    });
  }
} 