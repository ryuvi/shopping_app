import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import { Item } from "../interfaces/Item";
import { Lista } from "../interfaces/Lista";
import { v4 as uuidv4 } from "uuid";

type StorageContextType = {
  listaTemporaria: Item[];
  listas: Lista[];
  historicoListas: Lista[];
  historicoItems: Item[];

  adicionarItemTemporario: (item: Omit<Item, 'id' | 'createdAt' | 'priceFull'>) => Promise<void>;
  salvarBackup: () => Promise<void>;
  salvarListaFinal: (lista: Omit<Lista, 'criadaEm'>) => Promise<void>;
  salvarHistoricoItem: (item: Item) => Promise<void>;
  carregarDados: () => Promise<void>;
  limparTemporaria: () => Promise<void>;
};

const StorageContext = createContext<StorageContextType | null>(null);

// Abre o banco de dados de forma assíncrona
const getDatabase = async () => {
  return SQLite.openDatabaseAsync("minhaLista.db");
};

// Função auxiliar para converter itens do banco de dados
const convertItemFromDB = (item: any): Item => ({
  ...item,
  isPromotion: item.isPromotion === 1 || item.isPromotion === true,
  priceFull: item.priceFull || (item.pricePerItem * item.quantity)
});

// Função auxiliar para converter itens para o banco de dados
const convertItemToDB = (item: Item): any => ({
  ...item,
  isPromotion: item.isPromotion ? 1 : 0
});

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listaTemporaria, setListaTemporaria] = useState<Item[]>([]);
  const [listas, setListas] = useState<Lista[]>([]);
  const [historicoListas, setHistoricoListas] = useState<Lista[]>([]);
  const [historicoItems, setHistoricoItems] = useState<Item[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  // Inicializa o banco de dados
  useEffect(() => {
    const initDb = async () => {
      try {
        const database = await getDatabase();
        setDb(database);
        await criarTabelas(database);
        await carregarDados(database);
      } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
      }
    };

    initDb();

    return () => {
      if (db) {
        db.closeAsync().catch(console.error);
      }
    };
  }, []);

  // Criação das tabelas SQLite
  const criarTabelas = async (database: SQLite.SQLiteDatabase) => {
    try {
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS itens (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT,
          pricePerItem REAL,
          quantity INTEGER,
          priceFull REAL,
          isPromotion INTEGER,  -- Armazenado como 0 ou 1
          category TEXT,
          createdAt TEXT
        );
        CREATE TABLE IF NOT EXISTS listas (
          nome_da_lista TEXT PRIMARY KEY NOT NULL,
          items TEXT,
          criadaEm TEXT
        );
        CREATE TABLE IF NOT EXISTS historico_listas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome_da_lista TEXT NOT NULL,
          items TEXT,
          criadaEm TEXT
        );
        CREATE TABLE IF NOT EXISTS historico_items (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT,
          pricePerItem REAL,
          quantity INTEGER,
          priceFull REAL,
          isPromotion INTEGER,  -- Armazenado como 0 ou 1
          category TEXT,
          createdAt TEXT
        );
      `);
    } catch (error) {
      console.error("Erro criando tabelas SQLite:", error);
      throw error;
    }
  };

  // Função utilitária para execuções SQL
  const executeSqlPromise = async (sql: string, params: any[] = []): Promise<any> => {
    if (!db) throw new Error("Banco de dados não inicializado");

    try {
      return await db.runAsync(sql, params);
    } catch (error) {
      console.error("Erro executando SQL:", sql, params, error);
      throw error;
    }
  };

  // Sincronização entre AsyncStorage e SQLite
  const syncStorageToSQLite = async () => {
    if (!db) return;

    try {
      const syncData = async (key: string, syncFn: (data: any) => Promise<void>) => {
        const data = await AsyncStorage.getItem(key);
        if (data) await syncFn(JSON.parse(data));
      };

      await Promise.all([
        syncData("lista-temporaria", salvarTemporariaSQLite),
        syncData("lista-compras", async (listas) => {
          for (const lista of listas) await salvarListaFinalSQLite(lista);
        }),
        syncData("historico-listas", async (historico) => {
          for (const lista of historico) await salvarHistoricoListaSQLite(lista);
        }),
        syncData("historico-items", async (items) => {
          for (const item of items) await salvarHistoricoItemSQLite(item);
        })
      ]);
    } catch (error) {
      console.error("Erro na sincronização para SQLite:", error);
    }
  };

  // --- Operações com lista temporária ---
  const salvarTemporariaSQLite = async (items: Item[]): Promise<void> => {
    if (!db) return;

    try {
      await executeSqlPromise("DELETE FROM itens;");
      for (const item of items) {
        const itemDB = convertItemToDB(item);
        await executeSqlPromise(
          `INSERT OR REPLACE INTO itens (id, name, pricePerItem, quantity, priceFull, isPromotion, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            itemDB.id,
            itemDB.name,
            itemDB.pricePerItem,
            itemDB.quantity,
            itemDB.priceFull,
            itemDB.isPromotion,
            itemDB.category || null,
            itemDB.createdAt
          ]
        );
      }
    } catch (error) {
      console.error("Erro salvando itens temporários no SQLite:", error);
      throw error;
    }
  };

  const salvarTemporaria = async (novaLista: Item[]) => {
    try {
      await Promise.all([
        AsyncStorage.setItem("lista-temporaria", JSON.stringify(novaLista)),
        salvarTemporariaSQLite(novaLista)
      ]);
      setListaTemporaria(novaLista);
    } catch (error) {
      console.error("Erro ao salvar lista temporária:", error);
      throw error;
    }
  };

  // --- Operações com histórico de itens ---
  const salvarHistoricoItemSQLite = async (item: Item): Promise<void> => {
    if (!db) return;

    try {
      const itemDB = convertItemToDB(item);
      await executeSqlPromise(
        `INSERT OR REPLACE INTO historico_items (id, name, pricePerItem, quantity, priceFull, isPromotion, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          itemDB.id,
          itemDB.name,
          itemDB.pricePerItem,
          itemDB.quantity,
          itemDB.priceFull,
          itemDB.isPromotion,
          itemDB.category || null,
          itemDB.createdAt
        ]
      );
    } catch (error) {
      console.error("Erro ao salvar item no histórico SQLite:", error);
      throw error;
    }
  };

  const salvarHistoricoItem = async (item: Item) => {
    try {
      const novoItem: Item = { 
        ...item,
        id: item.id || uuidv4(),
        createdAt: item.createdAt || new Date().toISOString(),
        priceFull: item.priceFull || (item.pricePerItem * item.quantity)
      };
      
      const novoHistorico = [...historicoItems, novoItem];
      
      await Promise.all([
        AsyncStorage.setItem("historico-items", JSON.stringify(novoHistorico)),
        salvarHistoricoItemSQLite(novoItem)
      ]);
      
      setHistoricoItems(novoHistorico);
    } catch (error) {
      console.error("Erro ao salvar item no histórico:", error);
      throw error;
    }
  };

  // --- Operações com listas finais ---
  const salvarListaFinalSQLite = async (lista: Lista): Promise<void> => {
    if (!db) return;

    try {
      await executeSqlPromise(
        `INSERT OR REPLACE INTO listas (nome_da_lista, items, criadaEm) VALUES (?, ?, ?);`,
        [
          lista.nome_da_lista, 
          JSON.stringify(lista.items.map(convertItemToDB)), 
          lista.criadaEm
        ]
      );
    } catch (error) {
      console.error("Erro ao salvar lista final no SQLite:", error);
      throw error;
    }
  };

  const salvarListaFinal = async (lista: Omit<Lista, 'criadaEm'>) => {
    try {
      const listaCompleta: Lista = {
        ...lista,
        criadaEm: new Date().toISOString()
      };

      const atualizadas = [...listas];
      const index = atualizadas.findIndex((l) => l.nome_da_lista === lista.nome_da_lista);

      if (index !== -1) {
        atualizadas[index] = listaCompleta;
      } else {
        atualizadas.push(listaCompleta);
      }

      await Promise.all([
        AsyncStorage.setItem("lista-compras", JSON.stringify(atualizadas)),
        salvarListaFinalSQLite(listaCompleta)
      ]);
      
      setListas(atualizadas);
      await salvarHistoricoLista(listaCompleta);
    } catch (error) {
      console.error("Erro ao salvar lista final:", error);
      throw error;
    }
  };

  // --- Operações com histórico de listas ---
  const salvarHistoricoListaSQLite = async (lista: Lista): Promise<void> => {
    if (!db) return;

    try {
      await executeSqlPromise(
        `INSERT INTO historico_listas (nome_da_lista, items, criadaEm) VALUES (?, ?, ?);`,
        [
          lista.nome_da_lista, 
          JSON.stringify(lista.items.map(convertItemToDB)), 
          lista.criadaEm
        ]
      );
    } catch (error) {
      console.error("Erro ao salvar histórico de lista no SQLite:", error);
      throw error;
    }
  };

  const salvarHistoricoLista = async (lista: Lista) => {
    try {
      const historico = [...historicoListas, lista];
      
      await Promise.all([
        AsyncStorage.setItem("historico-listas", JSON.stringify(historico)),
        salvarHistoricoListaSQLite(lista)
      ]);
      
      setHistoricoListas(historico);
    } catch (error) {
      console.error("Erro ao salvar histórico de lista:", error);
      throw error;
    }
  };

  // --- Backup ---
  const salvarBackup = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem("lista-backup", JSON.stringify(listaTemporaria)),
        salvarTemporariaSQLite(listaTemporaria)
      ]);
    } catch (error) {
      console.error("Erro ao salvar backup:", error);
      throw error;
    }
  };

  // --- Limpeza da lista temporária ---
  const limparTemporariaSQLite = async (): Promise<void> => {
    if (!db) return;

    try {
      await executeSqlPromise("DELETE FROM itens;");
    } catch (error) {
      console.error("Erro ao limpar itens temporários no SQLite", error);
      throw error;
    }
  };

  const limparTemporaria = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem("lista-temporaria"),
        limparTemporariaSQLite()
      ]);
      setListaTemporaria([]);
    } catch (error) {
      console.error("Erro ao limpar lista temporária:", error);
      throw error;
    }
  };

  // --- Carregamento de dados ---
  const carregarItensSQLite = async (): Promise<Item[]> => {
    if (!db) return [];

    try {
      const result = await db.getAllAsync<any>("SELECT * FROM itens;");
      return result.map(convertItemFromDB);
    } catch (error) {
      console.error("Erro ao carregar itens do SQLite:", error);
      return [];
    }
  };

  const carregarListasSQLite = async (): Promise<Lista[]> => {
    if (!db) return [];

    try {
      const result = await db.getAllAsync<{nome_da_lista: string, items: string, criadaEm: string}>("SELECT * FROM listas;");
      return result.map(row => ({
        nome_da_lista: row.nome_da_lista,
        items: JSON.parse(row.items).map(convertItemFromDB),
        criadaEm: row.criadaEm
      }));
    } catch (error) {
      console.error("Erro ao carregar listas do SQLite:", error);
      return [];
    }
  };

  const carregarHistoricoListasSQLite = async (): Promise<Lista[]> => {
    if (!db) return [];

    try {
      const result = await db.getAllAsync<{nome_da_lista: string, items: string, criadaEm: string}>("SELECT * FROM historico_listas;");
      return result.map(row => ({
        nome_da_lista: row.nome_da_lista,
        items: JSON.parse(row.items).map(convertItemFromDB),
        criadaEm: row.criadaEm
      }));
    } catch (error) {
      console.error("Erro ao carregar histórico de listas do SQLite:", error);
      return [];
    }
  };

  const carregarHistoricoItemsSQLite = async (): Promise<Item[]> => {
    if (!db) return [];

    try {
      const result = await db.getAllAsync<any>("SELECT * FROM historico_items;");
      return result.map(convertItemFromDB);
    } catch (error) {
      console.error("Erro ao carregar histórico de itens do SQLite:", error);
      return [];
    }
  };

  const carregarDados = async (database?: SQLite.SQLiteDatabase) => {
    const dbToUse = database || db;
    if (!dbToUse) return;

    try {
      const firstRun = await AsyncStorage.getItem("first-run");
      if (!firstRun) {
        await syncStorageToSQLite();
        await AsyncStorage.setItem("first-run", "true");
      }

      const [
        tempAsync,
        listasAsync,
        histListasAsync,
        histItemsAsync,
        tempSQLite,
        listasSQLite,
        histListasSQLite,
        histItemsSQLite,
      ] = await Promise.all([
        AsyncStorage.getItem("lista-temporaria"),
        AsyncStorage.getItem("lista-compras"),
        AsyncStorage.getItem("historico-listas"),
        AsyncStorage.getItem("historico-items"),
        carregarItensSQLite(),
        carregarListasSQLite(),
        carregarHistoricoListasSQLite(),
        carregarHistoricoItemsSQLite(),
      ]);

      setListaTemporaria(tempSQLite.length > 0 ? tempSQLite : (tempAsync ? JSON.parse(tempAsync) : []));
      setListas(listasSQLite.length > 0 ? listasSQLite : (listasAsync ? JSON.parse(listasAsync) : []));
      setHistoricoListas(histListasSQLite.length > 0 ? histListasSQLite : (histListasAsync ? JSON.parse(histListasAsync) : []));
      setHistoricoItems(histItemsSQLite.length > 0 ? histItemsSQLite : (histItemsAsync ? JSON.parse(histItemsAsync) : []));
    } catch (error) {
      console.error("Erro carregando dados:", error);
    }
  };

  // --- Adicionar item na lista temporária ---
  const adicionarItemTemporario = async (item: Omit<Item, 'id' | 'createdAt' | 'priceFull'>) => {
    try {
      const itemCompleto: Item = {
        ...item,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        priceFull: item.pricePerItem * item.quantity
      };
      const novaLista = [...listaTemporaria, itemCompleto];
      await salvarTemporaria(novaLista);
    } catch (error) {
      console.error("Erro ao adicionar item temporário:", error);
      throw error;
    }
  };

  return (
    <StorageContext.Provider
      value={{
        listaTemporaria,
        listas,
        historicoListas,
        historicoItems,
        adicionarItemTemporario,
        salvarBackup,
        salvarListaFinal,
        salvarHistoricoItem,
        carregarDados: () => carregarDados(),
        limparTemporaria,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = (): StorageContextType => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
};