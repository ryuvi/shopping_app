// Item.tsx
export default interface Item {
  id: number;
  name: string;
  pricePerItem: number;
  quantity: number;
  priceFull: number;
  isPromotion: boolean;
  date?: string; // novo campo
  listName?: string; // novo campo (caso queira múltiplas listas no futuro)
  category?: string;
}
