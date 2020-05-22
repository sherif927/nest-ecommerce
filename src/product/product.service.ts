import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../types/product';
import { User } from '../types/user';
import { ProductModel } from '../types/dto/product.dto';


@Injectable()
export class ProductService {

  constructor(@InjectModel('Product') private productModel: Model<Product>) { }

  async createProduct(product: ProductModel, owner: User): Promise<Product> {
    const newProduct = await this.productModel.create({ ...product, owner });
    await newProduct.save();
    return newProduct.populate('owner');
  }

  async updateProduct(id: string, product: Partial<ProductModel>, productOwner: User): Promise<Product> {
    const existingProduct = await this.productModel.findById(id);
    if (!existingProduct) throw new NotFoundException('Product Not Found');
    if (existingProduct.owner.toString() !== productOwner.id) throw new UnauthorizedException();
    await existingProduct.update(product).populate('owner');
    return await this.productModel.findById(id).populate('owner');
  }

  async deleteProduct(id: string, productOwner: User): Promise<Product> {
    const existingProduct = await this.productModel.findById(id);
    if (!existingProduct) throw new NotFoundException('Product Not Found');
    if (existingProduct.owner.toString() !== productOwner.id) throw new UnauthorizedException();
    return await existingProduct.remove();
  }

  findAllProducts(): Promise<Product[]> {
    return this.productModel.find({}).populate('owner').exec();
  }

  findProductBy(query: any): Promise<Product> {
    return this.productModel.findOne(query).populate('owner').exec();
  }

  findProductById(id: string): Promise<Product> {
    return this.productModel.findById(id).populate('owner').exec();
  }

  async findProductsByOwner(owner: any): Promise<Product[]> {
    return await this.productModel.find({ owner }).populate('owner');
  }

}
