import { Address } from "../user";

export class UserModel {
  username: string;
  password: string;
  seller?: boolean;
  address?: Address;
}