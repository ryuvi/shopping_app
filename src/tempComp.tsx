import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";

export default function Teste() {
      const tempDb = useSQLiteContext();
    
      useEffect(() => {
        const dropAllTables = async () => {
          try {
            const tables = await tempDb.execAsync("SELECT name FROM sqlite_master WHERE type='table'")
            console.warn(tables)
            await tempDb.execAsync("DROP TABLE IF EXISTS lista_itens;");
            await tempDb.execAsync("DROP TABLE IF EXISTS listas;");
            await tempDb.execAsync("DROP TABLE IF EXISTS itens;");
            await tempDb.execAsync("DROP TABLE IF EXISTS despensa;")
            await tempDb.execAsync("DROP TABLE IF EXISTS dispensa;")
            console.log("Tabelas apagadas com sucesso.");
          } catch (error) {
            console.error("Erro ao apagar tabelas:", error);
          }
        };
    
        dropAllTables();
      }, [])

      return null;
}