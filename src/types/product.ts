export enum ProductUnit {
  UNIT = "UNIT",
  KG = "KG",
  LITER = "LITER",
  METER = "METER",
  BOX = "BOX",
  PACK = "PACK",
}

export const unitLabels: Record<ProductUnit, string> = {
  [ProductUnit.UNIT]: "Unidad",
  [ProductUnit.KG]: "Kilogramo",
  [ProductUnit.LITER]: "Litro",
  [ProductUnit.METER]: "Metro",
  [ProductUnit.BOX]: "Caja",
  [ProductUnit.PACK]: "Paquete",
};

export type { Product } from "@/interface/product";
