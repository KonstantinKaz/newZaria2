import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { CurrentUser } from '@/auth/decorators/user.decorator';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { UpdateSelectionDto } from './dto/update-selection.dto';
import { Role } from '@prisma/client';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Delete(':itemId')
  @Auth([Role.USER, Role.ADMIN])
  async removeFromCart(
    @CurrentUser('id') userId: string,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeFromCart(userId, +itemId);
  }

  @Delete()
  @Auth([Role.USER, Role.ADMIN])
  async removeMultipleFromCart(
    @CurrentUser('id') userId: string,
    @Body() dto: RemoveFromCartDto,
  ) {
    return this.cartService.removeMultipleFromCart(userId, dto.itemIds);
  }

  @Patch('batch-select')
  @Auth([Role.USER, Role.ADMIN])
  async updateMultipleSelection(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateSelectionDto,
  ) {
    return this.cartService.updateMultipleSelection(
      userId,
      dto.itemIds,
      dto.selected,
    );
  }

  @Post()
  @Auth([Role.USER, Role.ADMIN])
  addToCart(@CurrentUser('id') userId: string, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(userId, dto);
  }

  @Get()
  @Auth([Role.USER, Role.ADMIN])
  getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Patch(':itemId/select')
  @Auth([Role.USER, Role.ADMIN])
  updateSelection(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: number,
    @Body('selected') selected: boolean,
  ) {
    return this.cartService.updateSelection(userId, itemId, selected);
  }



  @Patch(':itemId')
  @Auth([Role.USER, Role.ADMIN])
  async updateQuantity(
    @CurrentUser('id') userId: string,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(userId, +itemId, quantity);
  }


}
