import {
  sqliteTable,
  text,
  primaryKey,
  integer,
  real,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Listas de Compras
export const listas = sqliteTable("listas", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  createdAt: text("criada_em").notNull(),
});

// Despensa
export const despensa = sqliteTable("despensa", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  peso: real("peso").notNull(),
  category: text("category").notNull(),
  isAberto: integer("aberto").notNull().default(0), // 0 = false, 1 = true
  createdAt: text("criado_em").notNull(),
});

// Itens
export const itens = sqliteTable("itens", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  quantity: integer("quantidade").notNull(),
  price: real("preco").notNull(),
  peso: real("peso").notNull(),
  category: text("categoria").notNull(),
  isPromocao: integer("promocao").notNull().default(0), // 0 = false, 1 = true
  createdAt: text("criado_em").notNull(),
});

// Tabela intermediária lista-itens
export const listaItens = sqliteTable(
  "lista_itens",
  {
    listaId: text("lista_id")
      .notNull()
      .references(() => listas.id),
    itemId: text("item_id")
      .notNull()
      .references(() => itens.id),
  },
  (table) => [primaryKey({ columns: [table.listaId, table.itemId] })]
);

// Relations
export const listasRelations = relations(listas, ({ many }) => ({
  listaItens: many(listaItens),
}));

export const itensRelations = relations(itens, ({ many }) => ({
  listaItens: many(listaItens),
}));

export const listaItensRelations = relations(listaItens, ({ one }) => ({
  lista: one(listas, {
    fields: [listaItens.listaId],
    references: [listas.id],
  }),
  item: one(itens, {
    fields: [listaItens.itemId],
    references: [itens.id],
  }),
}));

// Tipos
export type Listas = typeof listas.$inferSelect;
export type Itens = typeof itens.$inferSelect;
export type ListaItens = typeof listaItens.$inferSelect;
export type Despensa = typeof despensa.$inferSelect;
