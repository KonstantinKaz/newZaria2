import { Auth } from '@/auth/decorators/auth.decorator'
import { CurrentUser } from '@/auth/decorators/user.decorator'
import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common'
import { Role } from '@prisma/client'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderService } from './order.service'

@Controller('orders')
export class OrderController {
	private readonly logger = new Logger(OrderController.name)

	constructor(private readonly orderService: OrderService) {}

	@Get('mine')
	@Auth([Role.USER, Role.ADMIN])
	getPaidOrders(@CurrentUser('id') userId: string) {
		return this.orderService.getPaidOrders(userId)
	}

	@Get(':id')
	@Auth([Role.USER, Role.ADMIN])
	getOrderById(@Param('id') orderId: string) {
		return this.orderService.getOrderById(orderId)
	}

	@Post()
	@Auth([Role.USER, Role.ADMIN])
	async createOrder(
		@Body() dto: CreateOrderDto,
		@CurrentUser('id') userId: string
	) {
		this.logger.log(`Received order creation request from user ${userId}`)
		this.logger.debug('Order DTO:', dto)

		try {
			const order = await this.orderService.createOrder(dto, userId)
			this.logger.log(`Successfully created order ${order.id}`)
			return order
		} catch (error) {
			this.logger.error('Error creating order:', error)
			throw error
		}
	}
}
