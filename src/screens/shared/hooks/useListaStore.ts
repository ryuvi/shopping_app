// shared/hooks/useListaStore.ts
import { create } from 'zustand'
import { Itens
 } from '@/db/schema'

interface ListaEditandoState {
    id: string;
    nome: string;
    items: Itens[];
}

type Store = {
    modoEdicao: boolean;
    listaEditando: ListaEditandoState | null;
    iniciarEdicao: (lista: ListaEditandoState) => void;
    limparEdicao: () => void;
};

export const useListaStore = create<Store>((set) => ({
    modoEdicao: false,
    listaEditando: null,
    iniciarEdicao: (lista) => set({ modoEdicao: true, listaEditando: lista }),
    limparEdicao: () => set({ modoEdicao: false, listaEditando: null }),
}))
