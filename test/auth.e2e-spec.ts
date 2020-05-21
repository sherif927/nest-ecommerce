
import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { UserModel } from '../src/types/dto/user.dto';

let appUrl = 'http://localhost:3000/api';
let database = 'mongodb://localhost:27017/ecommerce';

beforeAll(async () => {
  await mongoose.connect(database);
  mongoose.connection.db.collection('users',
    async (error, collection: mongoose.Collection) => await collection.deleteMany({})
  );
});

afterAll(done => {
  mongoose.disconnect(done);
});

describe('AUTH', () => {
  const user: UserModel = {
    username: 'user1',
    password: 'password',
  };

  const sellerRegister: UserModel = {
    username: 'seller',
    password: 'password',
    seller: true,
  };

  const sellerLogin: UserModel = {
    username: 'seller',
    password: 'password'
  };

  let userToken: string;
  let sellerToken: string;

  it('should register user', () => {
    return request(appUrl)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.username).toEqual('user1');
        expect(body.password).toBeUndefined();
        expect(body.seller).toBeFalsy();
      }).expect(HttpStatus.CREATED);
  });

  it('should register seller', () => {
    return request(appUrl)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(sellerRegister)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.username).toEqual('seller');
        expect(body.password).toBeUndefined();
        expect(body.seller).toBeTruthy();
      }).expect(HttpStatus.CREATED);
  });

  it('should reject duplicate registration', () => {
    return request(appUrl)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
      }).expect(HttpStatus.BAD_REQUEST);
  });

  it('should login user', () => {
    return request(appUrl)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        userToken = body.token;

        expect(body.token).toBeDefined();
        expect(body.username).toEqual('user1');
        expect(body.password).toBeUndefined();
      }).expect(HttpStatus.CREATED);
  });

  it('should login seller', () => {
    return request(appUrl)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(sellerLogin)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.username).toEqual('seller');
        expect(body.password).toBeUndefined();
        expect(body.seller).toBeTruthy();
      });
  });

  /* it('should respect seller token', () => {
    return request(appUrl)
      .get('/product/mine')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);
  }); */
});