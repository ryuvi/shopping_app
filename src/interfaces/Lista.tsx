import { Item } from "./Item";

export interface Lista {
  nome_da_lista: string;
  items: Item[];
  criadaEm: string; // ISO timestamp
}