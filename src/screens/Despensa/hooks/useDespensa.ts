import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import uuid from 'react-native-uuid'

export interface DespensaItem {
  id: string;
  name: string;
  quantity: number;
  peso: number;
  category: string;
  isAberto: boolean;
  createdAt: string;
}

interface UseDespensaReturn {
  items: DespensaItem[];
  categories: string[];
  loading: boolean;
  error: Error | null;
  addItem: (item: Omit<DespensaItem, "id" | "createdAt">) => Promise<void>;
  updateItem: (id: string, updates: Partial<DespensaItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleItemStatus: (id: string) => Promise<void>;
  getItemById: (id: string) => Promise<DespensaItem | undefined>;
  getItemsByCategory: (category: string) => DespensaItem[];
}

export const useDespensa = (): UseDespensaReturn => {
  const sqliteDb = useSQLiteContext();
  const db = drizzle(sqliteDb);

  const [items, setItems] = useState<DespensaItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const result = await db.select().from(schema.despensa).all();
      setItems(result);
      const categorias = [...new Set(result.map((item) => item.category))];
      setCategories(categorias);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erro ao carregar itens"));
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    loadItems();
  }, []);

  const addItem = useCallback(
    async (item: Omit<DespensaItem, "id" | "createdAt">) => {
      try {
        setLoading(true);
        const newItem = {
          ...item,
          id: uuid.v4(),
          createdAt: new Date().toISOString(),
        };

        await db.insert(schema.despensa).values(newItem).run();
        await loadItems();
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err : new Error("Erro ao adicionar item"));
        throw err;
      }
    },
    [db, loadItems]
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<DespensaItem>) => {
      try {
        setLoading(true);
        await db
          .update(schema.despensa)
          .set(updates)
          .where(eq(schema.despensa.id, id))
          .run();
        await loadItems();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erro ao atualizar item"));
        throw err;
      }
    },
    [db, loadItems]
  );

  const removeItem = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await db
          .delete(schema.despensa)
          .where(eq(schema.despensa.id, id))
          .run();
        await loadItems();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erro ao remover item"));
        throw err;
      }
    },
    [db, loadItems]
  );

  const toggleItemStatus = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const item = items.find((i) => i.id === id);
        if (item) {
          await db
            .update(schema.despensa)
            .set({ isAberto: !item.isAberto })
            .where(eq(schema.despensa.id, id))
            .run();
          await loadItems();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erro ao alternar status do item"));
        throw err;
      }
    },
    [db, items, loadItems]
  );

  const getItemById = useCallback(
    async (id: string): Promise<DespensaItem | undefined> => {
      try {
        const result = await db
          .select()
          .from(schema.despensa)
          .where(eq(schema.despensa.id, id))
          .get();
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erro ao buscar item por ID"));
        throw err;
      }
    },
    [db]
  );

  const getItemsByCategory = useCallback(
    (category: string): DespensaItem[] => {
      return items.filter((item) => item.category === category);
    },
    [items]
  );

  return {
    items,
    categories,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    toggleItemStatus,
    getItemById,
    getItemsByCategory,
  };
};
