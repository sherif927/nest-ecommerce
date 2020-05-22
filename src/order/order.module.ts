import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderSchema } from '../models/order.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }])
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule { }
