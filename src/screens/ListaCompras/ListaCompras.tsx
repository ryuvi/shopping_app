// ListaCompras.tsx
import React from "react";
import { View } from "react-native";
import { Snackbar, Portal } from "react-native-paper";

import Header from "@shared/components/Header";

import ListaItemList from "./components/ListaItemList";
import ListaModal from "./components/ListaModal";
import ListaSubtotal from "./components/ListaSubtotal";
import ListaFAB from "./components/ListaFAB";
import ConfigModal from "./components/ConfigModal";

import { useListaCompras } from "./hooks/useListaCompras";
import SaveListDialog from "./components/ListaNomeDialog";
import { useConfig } from "../shared/hooks/useConfigStore";

const ListaCompras = () => {
  const { limite } = useConfig();
  const {
    items,
    modalVisible,
    editingItem,
    snackbarVisible,
    nomeLista,
    configVisible,
    subtotal,
    setModalVisible,
    setSnackbarVisible,
    setConfigVisible,
    abrirModal,
    abrirConfigModal,
    salvarItem,
    salvarLista,
    removerItem,
    saveDialogVisible,
    setSaveDialogVisible,
    handleSaveList
  } = useListaCompras();

  return (
    <Portal.Host>
      <View style={{ flex: 1 }}>
        <Header
          title={nomeLista}
        />
        <ListaItemList items={items} onEdit={abrirModal} onDelete={removerItem} />
        <ListaModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onSave={salvarItem}
          item={editingItem}
        />
        <ConfigModal
          visible={configVisible}
          onDismiss={() => setConfigVisible(false)}
        />
        <SaveListDialog
          visible={saveDialogVisible}
          onDismiss={() => setSaveDialogVisible(false)}
          onSave={handleSaveList}
          initialListName={nomeLista}
        />
        <ListaFAB 
          onPress={() => abrirModal()}
          onConfig={abrirConfigModal}
          onSave={() => setSaveDialogVisible(true)}
          />
        <ListaSubtotal subtotal={subtotal} limite={limite} />
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          action={{ label: "OK", onPress: () => {} }}
        >
          Lista salva com sucesso!
        </Snackbar>
      </View>
    </Portal.Host>
  );
};

export default ListaCompras;
