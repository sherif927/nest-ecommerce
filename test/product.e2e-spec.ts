import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { UserModel } from '../src/types/dto/user.dto';
import { ProductModel } from '../src/types/dto/product.dto';

let app = 'http://localhost:3000/api';
let database = 'mongodb://localhost:27017/ecommerce';

let sellerToken: string;
let productSeller: UserModel = {
  seller: true,
  username: 'productSeller',
  password: 'password',
};

beforeAll(async () => {
  await mongoose.connect(database, { useUnifiedTopology: true, useNewUrlParser: true });
  await mongoose.connection.db.dropDatabase();

  const { data: { token } } = await axios.post(`${app}/auth/register`, productSeller);

  sellerToken = token;
});

afterAll(done => {
  mongoose.disconnect(done);
});

describe('PRODUCT', () => {
  const product: ProductModel = {
    title: 'new phone',
    image: 'n/a',
    description: 'description',
    price: 10,
  };

  let productId: string;

  it('should list all products', () => {
    return request(app)
      .get('/product')
      .expect(HttpStatus.OK);
  });

  it('should list my products', () => {
    return request(app)
      .get('/product/mine')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(HttpStatus.OK);
  });

  it('should create product', () => {
    return request(app)
      .post('/product')
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Accept', 'application/json')
      .send(product)
      .expect(({ body }) => {
        productId = body._id;
        expect(body._id).toBeDefined();
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      }).expect(HttpStatus.CREATED);
  });

  it('should read product', () => {
    return request(app)
      .get(`/product/${productId}`)
      .expect(({ body }) => {
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      }).expect(HttpStatus.OK);

  });

  it('should update product', () => {
    return request(app)
      .put(`/product/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Accept', 'application/json')
      .send({ title: 'newTitle' })
      .expect(({ body }) => {
        expect(body.title).not.toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      }).expect(HttpStatus.OK);

  });

  it('should delete product', async () => {
    return request(app)
      .delete(`/product/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Accept', 'application/json')
      .expect(({ body }) => {
        expect(body.title).not.toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
      }).expect(HttpStatus.OK);
  });

});