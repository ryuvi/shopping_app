// ListaCompras/hooks/useListaCompras.ts

import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { and, eq } from "drizzle-orm";
import uuid from "react-native-uuid";

import * as schema from "@db/schema";
import { Itens } from "@db/schema";
import { useListaStore } from "@/screens/shared/hooks/useListaStore";

export function useListaCompras() {
  const [items, setItems] = useState<Itens[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Itens | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { modoEdicao, listaEditando, limparEdicao } = useListaStore();

  const [nomeLista, setNomeLista] = useState(
    `Lista do Dia - ${new Date().toLocaleDateString("pt-BR")}`
  );
  const [limite, setLimite] = useState<number>(500);
  const [configVisible, setConfigVisible] = useState<boolean>(false);
  const [tempListaId, setTempListaId] = useState<string>("temp");
  const [saveDialogVisible, setSaveDialogVisible] = useState<boolean>(false);

  const sqliteDb = useSQLiteContext();
  const db = drizzle(sqliteDb);

  const handleSaveList = async (name: string) => {
    // const nomeJaExiste = await verificarNomeListaExistente(name);
    if (modoEdicao) {
      await sobrescreverListaExistente(name);
      limparEdicao();
    } else {
      await salvarLista(name);
    }
    setNomeLista(name)
    setSaveDialogVisible(false);
  };

  const sobrescreverListaExistente = async (nome: string) => {
    try {
      const listaExistente = await db
        .select()
        .from(schema.listas)
        .where(eq(schema.listas.nome, nome))
        .get();

      if (listaExistente) {
        await db
          .delete(schema.listaItens)
          .where(eq(schema.listaItens.listaId, listaExistente.id));

        const relations = items.map((item) => ({
          listaId: listaExistente.id,
          itemId: item.id,
        }));

        await db.insert(schema.listaItens).values(relations);
        setSnackbarVisible(true);

        await db
          .delete(schema.listaItens)
          .where(eq(schema.listaItens.listaId, tempListaId));
        setItems([]);
      }
    } catch (e) {
      console.error("Erro ao sobrescrever lista:", e);
    }
  };

  const carregarTemporaria = async () => {
    try {
      const [lista] = await db
        .select()
        .from(schema.listas)
        .where(eq(schema.listas.id, tempListaId))
        .all();
      console.log(lista)

      if (!lista) {
        await db.insert(schema.listas).values({
          id: tempListaId,
          nome: "Lista Temporária",
          createdAt: new Date().toISOString(),
        });
      }

      const resultado = await db
        .select()
        .from(schema.listaItens)
        .innerJoin(schema.itens, eq(schema.listaItens.itemId, schema.itens.id))
        .where(eq(schema.listaItens.listaId, tempListaId))
        .all();

      const itensConvertidos = resultado.map((row) => ({
        ...row.itens,
        isPromocao: row.itens.isPromocao, // converte INTEGER para boolean
      }));

      setItems(itensConvertidos);
    } catch (err) {
      console.error("Erro ao carregar lista temporária:", err);
    }
  };

  const carregarLista = async () => {
    if (modoEdicao && listaEditando) {
      setItems(listaEditando.items);
      setNomeLista(listaEditando.nome);
      setTempListaId(listaEditando.id);
    } else {
      await carregarTemporaria();
    }
  };

  useEffect(() => {
    carregarLista();
  }, []);

  useEffect(() => {
    if (!modalVisible) {
      carregarTemporaria();
    }
  }, [modalVisible, tempListaId]);

  const abrirModal = (item?: Itens) => {
    setEditingItem(item || null);
    setModalVisible(true);
  };

  const abrirConfigModal = () => setConfigVisible(true);

  const salvarItem = async (item: Itens) => {
    if (!item.nome || !item.price) {
      Alert.alert("Erro", "Nome e preço são obrigatórios");
      return;
    }

    const id = editingItem?.id || uuid.v4();

    const novoItem: Itens = {
      ...item,
      id,
      peso: item.peso ?? 0,
      isPromocao: item.isPromocao ? 1 : 0, // converte boolean para INTEGER
      createdAt: new Date().toISOString(),
    };

    try {
      await db.transaction(async (tx) => {
        if (editingItem) {
          await tx
            .update(schema.itens)
            .set(novoItem)
            .where(eq(schema.itens.id, id));
        } else {
          await tx.insert(schema.itens).values(novoItem);
          await tx.insert(schema.listaItens).values({
            listaId: tempListaId,
            itemId: id,
          });
        }
      });

      setItems((prevItems) =>
        editingItem
          ? prevItems.map((i) => (i.id === id ? novoItem : i))
          : [...prevItems, novoItem]
      );

      setModalVisible(false);
      setEditingItem(null);

      const resultado = await db
        .select()
        .from(schema.listaItens)
        .innerJoin(schema.itens, eq(schema.listaItens.itemId, schema.itens.id))
        .where(eq(schema.listaItens.listaId, tempListaId))
        .all();

      const itensAtualizados = resultado.map((row) => ({
        ...row.itens,
        isPromocao: row.itens.isPromocao,
      }));

      setItems(itensAtualizados);
    } catch (err) {
      console.error("Erro ao salvar item:", err);
      Alert.alert("Erro", "Não foi possível salvar o item");
    }
  };

  const verificarNomeListaExistente = async (nome: string) => {
    try {
      const listaExistente = await db
        .select()
        .from(schema.listas)
        .where(eq(schema.listas.nome, nome))
        .get();

      return !!listaExistente;
    } catch (err) {
      console.error("Erro ao verificar nome da lista:", err);
      return false;
    }
  };

  const salvarLista = async (name: string) => {
    try {
      const novaListaId = uuid.v4();

      await db.insert(schema.listas).values({
        id: novaListaId,
        nome: name,
        createdAt: new Date().toISOString(),
      });

      const relations = items.map((item) => ({
        listaId: novaListaId,
        itemId: item.id,
      }));

      await db.insert(schema.listaItens).values(relations);
      setSnackbarVisible(true);

      await db
        .delete(schema.listaItens)
        .where(eq(schema.listaItens.listaId, tempListaId));
      setItems([]);
    } catch (e) {
      console.error("Erro ao salvar lista final:", e);
    }
  };

  const removerItem = (itemId: string) => {
    Alert.alert("Confirmar remoção", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await db
              .delete(schema.listaItens)
              .where(
                and(
                  eq(schema.listaItens.listaId, tempListaId),
                  eq(schema.listaItens.itemId, itemId)
                )
              );

            await db.delete(schema.itens).where(eq(schema.itens.id, itemId));

            setItems((prev) => prev.filter((item) => item.id !== itemId));
          } catch (error) {
            console.error("Erro ao remover item:", error);
          }
        },
      },
    ]);
  };

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + item.price * (item.quantity ?? 1) * (item.peso ?? 1);
    }, 0)
  }, [items]);

  return {
    items,
    modalVisible,
    editingItem,
    snackbarVisible,
    nomeLista,
    limite,
    configVisible,
    subtotal,
    setModalVisible,
    setEditingItem,
    setSnackbarVisible,
    setLimite,
    setConfigVisible,
    abrirModal,
    abrirConfigModal,
    salvarItem,
    salvarLista,
    removerItem,
    saveDialogVisible,
    setSaveDialogVisible,
    handleSaveList,
  };
}
