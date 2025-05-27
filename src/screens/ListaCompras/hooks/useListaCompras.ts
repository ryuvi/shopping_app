// useListaCompras.ts

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { and, eq } from "drizzle-orm";
import uuid from "react-native-uuid";

import * as schema from "@db/schema";
import { Itens } from "@db/schema";

export function useListaCompras() {
  const [items, setItems] = useState<Itens[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Itens | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
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
    const nomeJaExiste = await verificarNomeListaExistente(name);

    if (nomeJaExiste) {
      Alert.alert(
        "Lista já existe",
        "Ja existe uma lista com esse nome. O que deseja fazer?",
        [
          {
            text: "Sobrescrever",
            onPress: () => {
              setNomeLista(name);
              sobrescreverListaExistente(name);
              setSaveDialogVisible(false);
            },
          },
          {
            text: "Alterar nome",
            onPress: () => setSaveDialogVisible(true),
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ]
      );
    } else {
      setNomeLista(name);
      salvarLista();
      setSaveDialogVisible(false);
    }
  };

  const sobrescreverListaExistente = async (nome: string) => {
    try {
      // 1. Encontra a lista existente
      const listaExistente = await db
        .select()
        .from(schema.listas)
        .where(eq(schema.listas.nome, nome))
        .get();

      if (listaExistente) {
        // 2. Remove os itens antigos
        await db
          .delete(schema.listaItens)
          .where(eq(schema.listaItens.listaId, listaExistente.id));

        // 3. Adiciona os novos itens
        const relations = items.map((item) => ({
          listaId: listaExistente.id,
          itemId: item.id,
        }));

        await db.insert(schema.listaItens).values(relations);
        setSnackbarVisible(true);

        // 4. Limpa a lista temporária
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
        isPromocao: !!row.itens.isPromocao,
      }));

      setItems(itensConvertidos);
    } catch (err) {
      console.error("Erro ao carregar lista temporária:", err);
    }
  };

  useEffect(() => {
    carregarTemporaria();
  }, []);

  useEffect(() => {
    if (modalVisible === false) {
      carregarTemporaria(); // Reutiliza a função já existente
    }
  }, [modalVisible, tempListaId]);

  const abrirModal = (item?: Itens) => {
    setEditingItem(item || null);
    setModalVisible(true);
  };

  const abrirConfigModal = () => setConfigVisible(true);

  const salvarItem = async (item: Itens) => {
    console.log("Teste");
    // Validação básica
    if (!item.nome || !item.price) {
      Alert.alert("Erro", "Nome e preço são obrigatórios");
      return;
    }

    console.log("ALA");
    console.warn(editingItem);

    const id = editingItem?.id || uuid.v4();
    console.log(id);
    console.log("OASFKLDSF");
    const novoItem: Itens = {
      ...item,
      id,
      peso: item.peso ?? 0,
      isPromocao: item.isPromocao ?? false,
      createdAt: new Date().toISOString(),
    };

    console.log("Ola");

    try {
      // Usando transação para garantir atomicidade
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
      console.log("AAAA");

      // Atualização otimista do estado
      setItems((prevItems) =>
        editingItem
          ? prevItems.map((i) => (i.id === id ? novoItem : i))
          : [...prevItems, novoItem]
      );

      setModalVisible(false);
      setEditingItem(null);

      // Recarrega os itens do banco para garantir sincronização
      const resultado = await db
        .select()
        .from(schema.listaItens)
        .innerJoin(schema.itens, eq(schema.listaItens.itemId, schema.itens.id))
        .where(eq(schema.listaItens.listaId, tempListaId))
        .all();

      const itensAtualizados = resultado.map((row) => ({
        ...row.itens,
        isPromocao: !!row.itens.isPromocao,
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

  const salvarLista = async () => {
    try {
      const novaListaId = uuid.v4();

      await db.insert(schema.listas).values({
        id: novaListaId,
        nome: nomeLista,
        createdAt: new Date().toISOString(),
      });

      const relations = items.map((item) => ({
        listaId: novaListaId,
        itemId: item.id,
      }));

      await db.insert(schema.listaItens).values(relations);

      setSnackbarVisible(true);

      // limpa a lista temporária
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

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
