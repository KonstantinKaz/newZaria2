import { Auth } from '@/auth/decorators/auth.decorator'
import { CurrentUser } from '@/auth/decorators/user.decorator'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	Logger,
	Param,
	Post
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderService } from './order.service'

@Controller('orders')
export class OrderController {
	private readonly logger = new Logger(OrderController.name)

	constructor(private readonly orderService: OrderService) {}

	@Get()
	@Auth([Role.USER, Role.ADMIN])
	async getAll(@CurrentUser('id') userId: string) {
		return this.orderService.getAll(userId)
	}

	@Get('by-user')
	@Auth([Role.USER, Role.ADMIN])
	async getByUserId(@CurrentUser('id') userId: string) {
		return this.orderService.getByUserId(userId)
	}

	@Get(':id')
	@Auth([Role.USER, Role.ADMIN])
	async getById(@Param('id') id: string) {
		return this.orderService.getById(id)
	}

	@Post()
	@HttpCode(200)
	@Auth([Role.USER, Role.ADMIN])
	async createOrder(
		@Body() createOrderDto: CreateOrderDto,
		@CurrentUser('id') userId: string
	) {
		this.logger.log(
			`Creating order for user ${userId} with promocode ${createOrderDto.promocodeId || 'none'}`
		)
		return this.orderService.createOrder(
			userId,
			createOrderDto.email,
			createOrderDto.promocodeId
		)
	}
}
