import type { BaseEntity } from "./base-entity";
import type { Warehouse } from "./warehouse";
import type { Contact } from "./contact";
import type { User } from "./user";
import type { Product } from "./product";

export interface Distribution extends BaseEntity {
  originWarehouseId: string;
  destinationWarehouseId?: string;
  contactId?: string;
  status: DistributionStatus;
  createdBy: string;
  originWarehouse: Warehouse;
  destinationWarehouse?: Warehouse;
  contact?: Contact;
  creator: User;
  details: DistributionDetail[];
}

export interface DistributionDetail extends BaseEntity {
  distributionId: string;
  productId: string;
  amount: number;
  product: Product;
}

export enum DistributionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
