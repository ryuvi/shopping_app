export interface Item {
  id: string; // UUID
  name: string;
  pricePerItem: number;
  quantity: number;
  priceFull: number;
  isPromotion: boolean;
  category?: string;
  createdAt: string; // ISO timestamp
}