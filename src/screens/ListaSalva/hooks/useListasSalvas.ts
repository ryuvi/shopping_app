// hooks/useListasSalvas.ts
import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import * as schema from "../../../db/schema";

export interface Item {
  id: string;
  nome: string;
  quantity: number;
  price: number;
  peso: number;
  category: string;
  isPromocao: boolean;
  createdAt: string;
}

export interface ListaComItens {
  id: string;
  nome: string;
  createdAt: string;
  items: Item[];
}

export default function useListasSalvas() {
  const sqliteDb = useSQLiteContext();
  const db = drizzle(sqliteDb);

  const [listasComItens, setListasComItens] = useState<ListaComItens[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [listaSelecionada, setListaSelecionada] = useState<ListaComItens | null>(null);

  const carregarListasComItens = useCallback(async () => {
    try {
      const listasResult = await db.select().from(schema.listas).all();

      const listasComItensPromises = listasResult.map(async (lista) => {
        const resultado = await db
          .select({
            id: schema.itens.id,
            nome: schema.itens.nome,
            quantity: schema.itens.quantity,
            price: schema.itens.price,
            peso: schema.itens.peso,
            category: schema.itens.category,
            isPromocao: schema.itens.isPromocao,
            createdAt: schema.itens.createdAt,
          })
          .from(schema.listaItens)
          .innerJoin(schema.itens, eq(schema.listaItens.itemId, schema.itens.id))
          .where(eq(schema.listaItens.listaId, lista.id))
          .all();

        const itensConvertidos = resultado.map((item) => ({
          ...item,
          isPromocao: !!item.isPromocao,
        }));

        return {
          ...lista,
          items: itensConvertidos,
        };
      });

      const listasComItens = await Promise.all(listasComItensPromises);
      setListasComItens(listasComItens);
    } catch (error) {
      console.error("Erro ao carregar listas com itens:", error);
    }
  }, [db]);

  useEffect(() => {
    carregarListasComItens();
  }, [carregarListasComItens]);

  const abrirModal = useCallback((lista: ListaComItens) => {
    setListaSelecionada(lista);
    setModalVisible(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    listasComItens,
    modalVisible,
    listaSelecionada,
    abrirModal,
    fecharModal,
    recarregarListas: carregarListasComItens,
  };
}