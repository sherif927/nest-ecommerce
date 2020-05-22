export class ProductModel {
  title: string;
  image: string;
  description: string;
  price: number;
  created?: Date = new Date();
}