import type { BaseEntity } from "./base-entity";
import type { Contact } from "./contact";

export interface Product extends BaseEntity {
  sku: string;
  name: string;
  unit?: ProductUnit;
  unitDescription?: string;
  purchasePrice: string;
  minStock?: number;
  isActive?: boolean;
  imageUrl?: string;
  warehouses?: Array<{
    id: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    updatedAt: string;
    warehouse: {
      id: string;
      name: string;
      city: string;
      address: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
  suppliers?: Array<{
    id: string;
    supplier: Contact;
  }>;
}

export enum ProductUnit {
  UNIT = "UNIT",
  BOX = "BOX",
  PACKAGE = "PACKAGE",
  BAG = "BAG",
  LITER = "LITER",
  KILO = "KILO",
}
