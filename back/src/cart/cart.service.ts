import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { AddToCartDto } from './dto/add-to-cart.dto'

@Injectable()
export class CartService {
	constructor(private prisma: PrismaService) {}

	async addToCart(userId: string, dto: AddToCartDto) {
		const cartItems = await Promise.all(
			dto.items.map(item =>
				this.prisma.cartItem.upsert({
					where: {
						userId_productId: {
							userId,
							productId: item.productId
						}
					},
					update: {
						quantity: item.quantity
					},
					create: {
						userId,
						productId: item.productId,
						quantity: item.quantity
					}
				})
			)
		)

		return cartItems
	}

	async getCart(userId: string) {
		const cartItems = await this.prisma.cartItem.findMany({
			where: { userId },
			include: {
				product: {
					include: {
						category: true
					}
				}
			},
			orderBy: {
				id: 'desc'
			}
		})

		const userWithPromocode = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				activePromocode: true
			}
		})

		const selectedItems = cartItems.filter(item => item.selected)
		const totalQuantity = selectedItems.reduce(
			(sum, item) => sum + item.quantity,
			0
		)
		let totalPrice = selectedItems.reduce(
			(sum, item) => sum + item.quantity * item.product.price,
			0
		)

		if (userWithPromocode?.activePromocode) {
			const discount =
				(totalPrice * userWithPromocode.activePromocode.discount) / 100
			totalPrice = totalPrice - discount
		}

		return {
			items: cartItems,
			totalQuantity,
			totalPrice,
			promocode: userWithPromocode?.activePromocode || null
		}
	}

	async updateSelection(userId: string, itemId: number, selected: boolean) {
		return this.prisma.cartItem.update({
			where: {
				id: itemId,
				userId
			},
			data: { selected }
		})
	}

	async removeFromCart(userId: string, itemId: number) {
		return this.prisma.cartItem.delete({
			where: {
				id: itemId,
				userId
			}
		})
	}

	async updateQuantity(userId: string, itemId: number, quantity: number) {
		return this.prisma.cartItem.update({
			where: {
				id: itemId,
				userId
			},
			data: {
				quantity
			}
		})
	}

	async removeMultipleFromCart(userId: string, itemIds: number[]) {
		if (!itemIds?.length) {
			return { count: 0 }
		}

		return this.prisma.cartItem.deleteMany({
			where: {
				AND: [{ userId }, { id: { in: itemIds } }]
			}
		})
	}

	async updateMultipleSelection(
		userId: string,
		itemIds: number[],
		selected: boolean
	) {
		const validIds = itemIds.filter(id => !isNaN(id))

		return this.prisma.cartItem.updateMany({
			where: {
				id: { in: validIds },
				userId
			},
			data: {
				selected
			}
		})
	}
}
