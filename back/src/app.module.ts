import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CartModule } from './cart/cart.module'
import { CategoriesModule } from './categories/categories.module'
import { FavoritesModule } from './favorites/favorites.module'
import { OrderModule } from './order/order.module'
import { PaymentModule } from './payment/payment.module'
import { PrismaModule } from './prisma/prisma.module'
import { PrismaService } from './prisma/prisma.service'
import { ProductsModule } from './products/products.module'
import { PromocodeModule } from './promocode/promocode.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '../uploads'),
			serveRoot: '/uploads'
		}),
		ConfigModule.forRoot({
			isGlobal: true
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		ProductsModule,
		CategoriesModule,
		CartModule,
		OrderModule,
		PaymentModule,
		FavoritesModule,
		PromocodeModule
	],
	controllers: [AppController],
	providers: [AppService, PrismaService]
})
export class AppModule {}
