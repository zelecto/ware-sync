import { ProductUnit } from "@/interface/product";

export const UNIT_LABELS: Record<ProductUnit, string> = {
  [ProductUnit.UNIT]: "Unidades",
  [ProductUnit.KG]: "Kilogramos",
  [ProductUnit.LITER]: "Litros",
  [ProductUnit.METER]: "Metros",
  [ProductUnit.BOX]: "Cajas",
  [ProductUnit.PACK]: "Paquetes",
};

export const getUnitLabel = (unit: string): string => {
  return UNIT_LABELS[unit as ProductUnit] || unit;
};
