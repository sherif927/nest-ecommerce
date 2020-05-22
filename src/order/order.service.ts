import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../types/order';
import { OrderModel } from '../types/dto/order.dto';
import { User } from '../types/user';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) { }

  async listUserOrders(id: any): Promise<Order[]> {
    const orders = await this.orderModel.find({ owner: id })
      .populate('owner')
      .populate('products.product');
    return orders;
  }

  async placeOrder(orderModel: OrderModel, user: User): Promise<Order> {
    const newOrder = { ...orderModel, owner: user.id };
    const { _id } = await this.orderModel.create(newOrder);

    const order = await this.orderModel.findById(_id)
      .populate('owner')
      .populate('products.product');

    const totalPrice = order.products.reduce((acc, current) => {
      const price = current.product.price * current.quantity;
      return price + acc;
    }, 0);

    await order.update({ totalPrice });
    return this.orderModel.findById(_id)
      .populate('owner')
      .populate('products.product');
  }
}
