import { Injectable } from '@nestjs/common'
import YooKassa from 'yookassa-ts/lib/yookassa'
import { PrismaService } from '../prisma/prisma.service'
import { PaymentMethodsEnum } from 'yookassa-ts/lib/types/PaymentMethod'
import { CurrencyEnum } from 'yookassa-ts/lib/types/Common'
import { OrderStatus } from '@prisma/client'

@Injectable()
export class PaymentService {
	private readonly yooKassa: YooKassa

	constructor(private readonly prisma: PrismaService) {
		this.yooKassa = new YooKassa({
			shopId: process.env['SHOP_ID'],
			secretKey: process.env['PAYMENT_TOKEN']
		})
	}

	async createOrder(data: { email: string; items: number[] }) {
		const orderItems = await Promise.all(
			data.items.map(async item => {
				const cartItem = await this.prisma.cartItem.findUnique({
					where: { id: item }
				})

				if (!cartItem) {
					throw new Error(`Cart item with id ${item} not found`)
				}

				const product = await this.prisma.product.findUnique({
					where: { id: cartItem.productId },
					select: { price: true }
				})

				if (!product) {
					throw new Error(`Product with id ${cartItem.productId} not found`)
				}

				return {
					productId: cartItem.productId,
					quantity: cartItem.quantity,
					price: product.price
				}
			})
		)

		const total = orderItems.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
		)

		const order = await this.prisma.order.create({
			data: {
				email: data.email,
				total: total,
				items: {
					create: orderItems
				}
			}
		})

		// Удаление товаров из корзины
		await Promise.all(
			data.items.map(item =>
				this.prisma.cartItem.delete({ where: { id: item } })
			)
		)

		const payment = await this.yooKassa.createPayment({
			amount: {
				value: total.toFixed(2),
				currency: CurrencyEnum.RUB
			},
			payment_method_data: {
				type: PaymentMethodsEnum.bank_card
			},
			capture: true,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			confirmation: {
				type: 'redirect',
				return_url: 'https://e-commerce.ilyacode.ru/thanks'
			},
			description: `Order #${order.id}`
		})

		return payment
	}

	async handleWebhook(event: any) {
		if (event.event === 'payment.succeeded') {
			const orderId = event.object.description.split('#')[1]
			await this.prisma.order.update({
				where: { id: orderId },
				data: { status: OrderStatus.PAID }
			})
		}
		return { success: true }
	}

	
}
