// App.tsx
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/Navigation";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";


// Cor 1: #AED581
// Cor 2: #C8E6C9

const temaPersonalizado = {
  ...DefaultTheme,
  colors: {
    primary: '#81C784',
    primaryContainer: '#C8E6C9',
    secondary: '#AED581',
    secondaryContainer: '#E6EE9C',
    tertiary: '#80CBC4',
    tertiaryContainer: '#B2DFDB',

    background: '#F1F8E9',
    surface: '#FFFFFF',
    surfaceVariant: '#DCEDC8',
    surfaceDisabled: '#E0E0E0',

    error: '#EF9A9A',
    errorContainer: '#FFCDD2',

    onPrimary: '#1B5E20',
    onPrimaryContainer: '#2E7D32',
    onSecondary: '#33691E',
    onSecondaryContainer: '#558B2F',
    onTertiary: '#004D40',
    onTertiaryContainer: '#00796B',
    onSurface: '#2E7D32',
    onSurfaceVariant: '#4CAF50',
    onSurfaceDisabled: '#9E9E9E',
    onError: '#B71C1C',
    onErrorContainer: '#C62828',
    onBackground: '#33691E',

    outline: '#A5D6A7',
    outlineVariant: '#C5E1A5',

    inverseSurface: '#33691E',
    inverseOnSurface: '#F1F8E9',
    inversePrimary: '#388E3C',

    shadow: '#000000',
    scrim: '#00000066',
    backdrop: '#00000022',

    elevation: {
      level0: 'transparent',
      level1: '#F1F8E9',
      level2: '#E6EE9C',
      level3: '#DCEDC8',
      level4: '#C8E6C9',
      level5: '#A5D6A7',
    },
  },
};


export default function App() {
  return (
    <SafeAreaProvider>
<PaperProvider>
      <Navigation />
</PaperProvider>
    </SafeAreaProvider>
  );
}
