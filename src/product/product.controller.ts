import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductModel } from '../types/dto/product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SellerGuard } from 'src/auth/guards/seller.guard';
import { AuthUser } from '../auth/auth.user.dec';
import { User } from '../types/user';

@Controller('product')
export class ProductController {

  constructor(private productService: ProductService) { }

  @Get('mine')
  @UseGuards(JwtAuthGuard, SellerGuard)
  getMyProducts(@AuthUser() user: User) {
    return this.productService.findProductsByOwner(user.id);
  }

  @Get('seller/:id')
  getSellerProducts(@Param('id') id: string) {
    return this.productService.findProductsByOwner(id);
  }

  @Get()
  findAll() {
    return this.productService.findAllProducts();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productService.findProductById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, SellerGuard)
  createProduct(@Body() product: ProductModel, @AuthUser() user: User) {
    return this.productService.createProduct(product, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, SellerGuard)
  updateProduct(
    @Body() product: Partial<ProductModel>,
    @Param('id') id: string,
    @AuthUser() user: User
  ) {
    return this.productService.updateProduct(id, product, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SellerGuard)
  deleteProduct(@Param('id') id: string, @AuthUser() user: User) {
    return this.productService.deleteProduct(id, user);
  }

}
