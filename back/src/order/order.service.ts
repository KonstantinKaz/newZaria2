import { PrismaService } from '@/prisma/prisma.service'
import { Injectable, Logger } from '@nestjs/common'
import { OrderStatus } from '@prisma/client'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrderService {
	private readonly logger = new Logger(OrderService.name)

	constructor(private readonly prisma: PrismaService) {}

	async getPaidOrders(userId: string) {
		const response = this.prisma.order.findMany({
			where: {
				status: OrderStatus.PAID,
				userId: userId
			}
		})
		return response
	}

	async getOrderById(orderId: string) {
		return this.prisma.order.findUnique({
			where: { id: orderId },
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		})
	}

	async createOrder(dto: CreateOrderDto, userId: string) {
		this.logger.log(
			`Creating order for user ${userId} with items: ${dto.cartItemIds.join(', ')}`
		)

		const cartItems = await this.prisma.cartItem.findMany({
			where: {
				id: { in: dto.cartItemIds },
				userId
			},
			include: {
				product: true
			}
		})

		this.logger.log(`Found ${cartItems.length} cart items`)

		const total = cartItems.reduce((acc, item) => {
			return acc + item.product.price * item.quantity
		}, 0)

		this.logger.log(`Total order price: ${total}`)

		try {
			const order = await this.prisma.order.create({
				data: {
					status: OrderStatus.PENDING,
					email: dto.email,
					total,
					userId,
					items: {
						create: cartItems.map(item => ({
							quantity: item.quantity,
							price: item.product.price,
							productId: item.product.id
						}))
					}
				},
				include: {
					items: {
						include: {
							product: true
						}
					}
				}
			})

			this.logger.log(`Order created with ID: ${order.id}`)

			// Очищаем корзину после создания заказа
			await this.prisma.cartItem.deleteMany({
				where: {
					id: { in: dto.cartItemIds },
					userId
				}
			})

			this.logger.log('Cart items removed')

			return order
		} catch (error) {
			this.logger.error('Error creating order:', error)
			throw error
		}
	}
}
