import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	Post,
	UseGuards
} from '@nestjs/common'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { AdminGuard } from '../auth/guards/admin.guard'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { CreatePromocodeDto } from './dto/create-promocode.dto'
import { PromocodeService } from './promocode.service'

@Controller('promocodes')
export class PromocodeController {
	private readonly logger = new Logger(PromocodeController.name)

	constructor(private readonly promocodeService: PromocodeService) {}

	@Post()
	@UseGuards(JwtAuthGuard, AdminGuard)
	create(@Body() createPromocodeDto: CreatePromocodeDto) {
		return this.promocodeService.create(createPromocodeDto)
	}

	@Get()
	@UseGuards(JwtAuthGuard, AdminGuard)
	getAll() {
		return this.promocodeService.getAll()
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, AdminGuard)
	delete(@Param('id') id: string) {
		return this.promocodeService.delete(id)
	}

	@Post('validate/:code')
	@UseGuards(JwtAuthGuard)
	async validate(
		@Param('code') code: string,
		@CurrentUser('id') userId: string
	) {
		this.logger.log(`Validating promocode ${code} for user ${userId}`)
		return this.promocodeService.validate(code, userId)
	}

	@Post('remove-active')
	@UseGuards(JwtAuthGuard)
	async removeActive(@CurrentUser('id') userId: string) {
		this.logger.log(`Removing active promocode for user ${userId}`)
		return this.promocodeService.removeActivePromocode(userId)
	}
}
