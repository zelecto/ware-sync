import { ProductUnit } from "@/interface/product";

export const UNIT_LABELS: Record<ProductUnit, string> = {
  [ProductUnit.UNIT]: "Unidades",
  [ProductUnit.BOX]: "Cajas",
  [ProductUnit.PACKAGE]: "Paquetes",
  [ProductUnit.BAG]: "Bolsas",
  [ProductUnit.LITER]: "Litros",
  [ProductUnit.KILO]: "Kilogramos",
};

export const getUnitLabel = (unit: string): string => {
  return UNIT_LABELS[unit as ProductUnit] || unit;
};
