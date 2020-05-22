export interface OrderModel {
  products: {
    product: string;
    quantity: number;
  }[];
}