import axios from 'axios';
import * as mongoose from 'mongoose';
import { UserModel } from '../src/types/dto/user.dto';
import { ProductModel } from '../src/types/dto/product.dto';
import { Product } from '../src/types/product';
import * as request from 'supertest';

let app = 'http://localhost:3000/api';
let database = 'mongodb://localhost:27017/ecommerce';
let sellerToken: string;
let buyerToken: string;
let boughtProducts: Product[];
const orderSeller: UserModel = {
  seller: true,
  username: 'orderSeller',
  password: 'password',
};
const orderBuyer: UserModel = {
  seller: false,
  username: 'orderBuyer',
  password: 'password',
};
const soldProducts: ProductModel[] = [
  {
    title: 'newer phone',
    image: 'n/a',
    description: 'description',
    price: 10,
  },
  {
    title: 'newest phone',
    image: 'n/a',
    description: 'description',
    price: 20,
  },
];

beforeAll(async () => {
  await mongoose.connect(database, { useUnifiedTopology: true, useNewUrlParser: true });
  await mongoose.connection.db.dropDatabase();

  ({ data: { token: sellerToken } } = await axios.post(`${app}/auth/register`, orderSeller));
  ({ data: { token: buyerToken } } = await axios.post(`${app}/auth/register`, orderBuyer));

  const [{ data: data1 }, { data: data2 }] = await Promise.all(
    soldProducts.map(product =>
      axios.post(`${app}/product`, product, {
        headers: { authorization: `Bearer ${sellerToken}` },
      }),
    ),
  );

  boughtProducts = [data1, data2];
});

afterAll(async done => {
  mongoose.disconnect(done);
});

describe('ORDER', () => {
  it('should create order of all products', async () => {
    const orderDTO = {
      products: boughtProducts.map(product => ({
        product: product._id,
        quantity: 1,
      })),
    };

    return request(app)
      .post('/order')
      .set('Authorization', `Bearer ${buyerToken}`)
      .set('Accept', 'application/json')
      .send(orderDTO)
      .expect(({ body }) => {
        expect(body.owner.username).toEqual(orderBuyer.username);
        expect(body.products.length).toEqual(boughtProducts.length);
        expect(
          boughtProducts
            .map(product => product._id)
            .includes(body.products[0].product._id),
        ).toBeTruthy();
        expect(body.totalPrice).toEqual(
          boughtProducts.reduce((acc, i) => acc + i.price, 0),
        );
      })
      .expect(201);
  });

  it('should list all orders of buyer', () => {
    return request(app)
      .get('/order')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(({ body }) => {
        expect(body.length).toEqual(1);
        expect(body[0].products.length).toEqual(boughtProducts.length);
        expect(
          boughtProducts
            .map(product => product._id)
            .includes(body[0].products[0].product._id),
        ).toBeTruthy();
        expect(body[0].totalPrice).toEqual(
          boughtProducts.reduce((acc, i) => acc + i.price, 0),
        );
      })
      .expect(200);
  });

});