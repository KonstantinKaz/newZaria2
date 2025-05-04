import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePromocodeDto } from './dto/create-promocode.dto'

@Injectable()
export class PromocodeService {
	private readonly logger = new Logger(PromocodeService.name)

	constructor(private readonly prisma: PrismaService) {}

	async create(createPromocodeDto: CreatePromocodeDto) {
		this.logger.log(
			`Creating promocode with data: ${JSON.stringify(createPromocodeDto)}`
		)
		return this.prisma.promocode.create({
			data: {
				code: createPromocodeDto.code,
				discount: createPromocodeDto.discount,
				maxUses: createPromocodeDto.maxUses,
				validUntil: createPromocodeDto.validUntil
					? new Date(createPromocodeDto.validUntil)
					: null,
				description: createPromocodeDto.description,
				isActive: true
			}
		})
	}

	async validate(code: string, userId: string) {
		this.logger.log(`Validating promocode: ${code} for user: ${userId}`)
		const promocode = await this.prisma.promocode.findUnique({
			where: { code }
		})

		if (!promocode) {
			throw new NotFoundException('Promocode not found')
		}

		if (!promocode.isActive) {
			throw new NotFoundException('Promocode is not active')
		}

		const now = new Date()
		if (promocode.validUntil && promocode.validUntil < now) {
			throw new NotFoundException('Promocode has expired')
		}

		if (promocode.maxUses && promocode.usedCount >= promocode.maxUses) {
			throw new NotFoundException('Promocode usage limit exceeded')
		}

		// Устанавливаем промокод как активный для пользователя
		await this.prisma.user.update({
			where: { id: userId },
			data: {
				activePromocodeId: promocode.id
			}
		})

		this.logger.log(
			`Set promocode ${promocode.id} as active for user ${userId}`
		)

		return promocode
	}

	async getAll() {
		this.logger.log('Getting all promocodes')
		return this.prisma.promocode.findMany()
	}

	async delete(id: string) {
		this.logger.log(`Deleting promocode with id: ${id}`)
		return this.prisma.promocode.delete({
			where: { id }
		})
	}

	async incrementUsage(id: string) {
		return this.prisma.promocode.update({
			where: { id },
			data: {
				usedCount: {
					increment: 1
				}
			}
		})
	}

	async removeActivePromocode(userId: string) {
		this.logger.log(`Removing active promocode for user ${userId}`)
		return this.prisma.user.update({
			where: { id: userId },
			data: {
				activePromocodeId: null
			}
		})
	}
}
