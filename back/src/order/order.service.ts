import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { OrderStatus } from '@prisma/client'

@Injectable()
export class OrderService {
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
}
