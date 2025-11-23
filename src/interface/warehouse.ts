import type { BaseEntity } from "./base-entity";

export interface Warehouse extends BaseEntity {
  name: string;
  city: string;
  address: string;
}
