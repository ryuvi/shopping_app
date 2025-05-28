import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/Navigation";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "./src/drizzle/migrations";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { useColorScheme, View, StyleSheet } from "react-native";
import {
  CustomLightTheme,
  CustomDarkTheme,
} from "./src/screens/shared/ui/CustomTheme";
import { useSQLiteContext } from "expo-sqlite";
import * as SplashScreen from "expo-splash-screen";
import { Text } from "react-native-paper";

import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { useEffect } from "react";
import Teste from './src/tempComp'

// Mantenha a splash screen visível enquanto carregamos os recursos
// SplashScreen.preventAutoHideAsync();

const DATABASE_NAME = "compras.db";
const expoDb = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDb);

export default function App() {
  const scheme = useColorScheme();
  // const scheme = "dark"
  const theme = scheme === "dark" ? CustomDarkTheme : CustomLightTheme;

  const reset =false;

  if (!reset){

  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View>
        <Text>Erro com o banco {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      </View>
    );
  }}

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <SQLiteProvider
          databaseName="compras.db"
          options={{ enableChangeListener: true }}
          useSuspense
        >
          { reset && <Teste /> }
          <Navigation />
        </SQLiteProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Ou use sua cor de tema
  },
  errorText: {
    marginTop: 20,
    color: "red",
    textAlign: "center",
  },
});
