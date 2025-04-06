import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { OrderService } from './order.service';
import { PrismaService } from '@/prisma/prisma.service';
import { OrderController } from './order.controller';


@Module({
	imports: [
		HttpModule,
		ConfigModule
	],
	controllers: [OrderController],
	providers: [
		OrderService,
		PrismaService,

	],
})
export class OrderModule {}
