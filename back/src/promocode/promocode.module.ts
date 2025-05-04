import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PromocodeController } from './promocode.controller'
import { PromocodeService } from './promocode.service'

@Module({
	controllers: [PromocodeController],
	providers: [PromocodeService, PrismaService],
	exports: [PromocodeService]
})
export class PromocodeModule {}
