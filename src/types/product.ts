export enum ProductUnit {
  UNIT = "UNIT",
  BOX = "BOX",
  PACKAGE = "PACKAGE",
  BAG = "BAG",
  LITER = "LITER",
  KILO = "KILO",
}

export const unitLabels: Record<ProductUnit, string> = {
  [ProductUnit.UNIT]: "Unidad",
  [ProductUnit.BOX]: "Caja",
  [ProductUnit.PACKAGE]: "Paquete",
  [ProductUnit.BAG]: "Bolsa",
  [ProductUnit.LITER]: "Litro",
  [ProductUnit.KILO]: "Kilogramo",
};

export type { Product } from "@/interface/product";
