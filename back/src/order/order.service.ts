import { PrismaService } from '@/prisma/prisma.service'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { OrderStatus } from '@prisma/client'

@Injectable()
export class OrderService {
	private readonly logger = new Logger(OrderService.name)

	constructor(private readonly prisma: PrismaService) {}

	async getAll(userId: string) {
		return this.prisma.order.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		})
	}

	async getByUserId(userId: string) {
		return this.prisma.order.findMany({
			where: {
				userId,
				status: OrderStatus.PAID
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		})
	}

	async getById(id: string) {
		const order = await this.prisma.order.findUnique({
			where: {
				id
			},
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		})

		if (!order) {
			throw new NotFoundException('Order not found')
		}

		return order
	}

	async createOrder(userId: string, email: string, promocodeId?: string) {
		this.logger.log(
			`Creating order for user ${userId} ${promocodeId ? `with promocode ${promocodeId}` : ''}`
		)

		// Получаем только выбранные товары из корзины
		const cartItems = await this.prisma.cartItem.findMany({
			where: {
				userId,
				selected: true
			},
			include: {
				product: true
			}
		})

		this.logger.log(`Found ${cartItems.length} selected cart items`)

		if (cartItems.length === 0) {
			throw new NotFoundException('No selected items in cart')
		}

		let total = cartItems.reduce((acc, item) => {
			return acc + item.product.price * item.quantity
		}, 0)

		this.logger.log(`Initial total: ${total}`)

		// Если есть промокод, применяем скидку
		let appliedPromocode = null
		if (promocodeId) {
			appliedPromocode = await this.prisma.promocode.findUnique({
				where: { id: promocodeId }
			})

			if (appliedPromocode) {
				this.logger.log(`Applying promocode discount: ${appliedPromocode.discount}%`)
				const discount = (total * appliedPromocode.discount) / 100
				total = total - discount
				this.logger.log(`Total after discount: ${total}`)
			}
		}

		try {
			const order = await this.prisma.order.create({
				data: {
					status: OrderStatus.PENDING,
					email,
					total,
					userId,
					items: {
						create: cartItems.map(item => ({
							quantity: item.quantity,
							price: item.product.price,
							productId: item.product.id
						}))
					},
					promocodeId: appliedPromocode?.id
				},
				include: {
					items: {
						include: {
							product: true
						}
					},
					promocode: true
				}
			})

			this.logger.log(`Order created with ID: ${order.id}`)

			// Увеличиваем счетчик использований промокода
			if (appliedPromocode) {
				await this.prisma.promocode.update({
					where: { id: appliedPromocode.id },
					data: {
						usedCount: {
							increment: 1
						}
					}
				})
				this.logger.log(`Promocode usage count incremented`)
			}

			// Очищаем выбранные товары из корзины
			await this.prisma.cartItem.deleteMany({
				where: {
					userId,
					selected: true
				}
			})

			this.logger.log('Selected cart items removed')

			return order
		} catch (error) {
			this.logger.error('Error creating order:', error)
			throw error
		}
	}
}
