// App.tsx
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/Navigation";

import {
  PaperProvider,
} from "react-native-paper";
import { useColorScheme } from "react-native";
import { CustomLightTheme, CustomDarkTheme } from './src/components/Themes/CustomTheme'

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? CustomDarkTheme :CustomLightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={ CustomLightTheme }>
        <Navigation />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
