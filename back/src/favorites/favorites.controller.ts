import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Auth } from '@/auth/decorators/auth.decorator';
import { CurrentUser } from '@/auth/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @Auth([Role.USER, Role.ADMIN])
  getFavorites(@CurrentUser('id') userId: string) {
    return this.favoritesService.getFavorites(userId);
  }

  @Post(':productId')
  @Auth([Role.USER, Role.ADMIN])
  toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.favoritesService.toggleFavorite(userId, productId);
  }
}