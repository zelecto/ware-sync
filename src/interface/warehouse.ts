import type { BaseEntity } from "./base-entity";

export interface Warehouse extends BaseEntity {
  name: string;
  city: string;
  address: string;
  warehouseProducts?: Array<{
    id: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    updatedAt: string;
    product: {
      id: string;
      sku: string;
      name: string;
      unit?: string;
      unitDescription?: string;
      purchasePrice: string;
      minStock?: number;
      isActive?: boolean;
      imageUrl?: string | null;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}
