import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4CAF50',
    onPrimary: '#FFFFFF',
    primaryContainer: '#A5D6A7',
    onPrimaryContainer: '#1B5E20',

    secondary: '#8BC34A',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#DCEDC8',
    onSecondaryContainer: '#33691E',

    tertiary: '#00BCD4',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#B2EBF2',
    onTertiaryContainer: '#006064',

    background: '#F5F5F5',
    onBackground: '#212121',

    surface: '#FFFFFF',
    onSurface: '#212121',
    surfaceVariant: '#EEEEEE',
    onSurfaceVariant: '#424242',

    outline: '#BDBDBD',
    outlineVariant: '#E0E0E0',

    error: '#D32F2F',
    onError: '#FFFFFF',
    errorContainer: '#FFCDD2',
    onErrorContainer: '#B71C1C',

    inverseSurface: '#212121',
    inverseOnSurface: '#FAFAFA',
    inversePrimary: '#66BB6A',

    shadow: '#000000',
    surfaceDisabled: 'rgba(33, 33, 33, 0.12)',
    onSurfaceDisabled: 'rgba(33, 33, 33, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.32)',
    
    warning: '#FFA000',           // Amarelo escuro (Amber 700)
    onWarning: '#000000',         // Preto (bom contraste)
    warningContainer: '#FFECB3',  // Amarelo claro (Amber 100)
    onWarningContainer: '#4E342E' // Marrom escuro (bom contraste)
  },
};


export const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#81C784',
    onPrimary: '#000000',
    primaryContainer: '#388E3C',
    onPrimaryContainer: '#C8E6C9',

    secondary: '#A5D6A7',
    onSecondary: '#1B5E20',
    secondaryContainer: '#558B2F',
    onSecondaryContainer: '#DCEDC8',

    tertiary: '#4DD0E1',
    onTertiary: '#00363A',
    tertiaryContainer: '#00838F',
    onTertiaryContainer: '#B2EBF2',

    background: '#121212',
    onBackground: '#FFFFFF',

    surface: '#1E1E1E',
    onSurface: '#E0E0E0',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: '#BDBDBD',

    outline: '#424242',
    outlineVariant: '#616161',

    error: '#EF9A9A',
    onError: '#000000',
    errorContainer: '#B71C1C',
    onErrorContainer: '#FFCDD2',

    inverseSurface: '#FAFAFA',
    inverseOnSurface: '#212121',
    inversePrimary: '#66BB6A',

    shadow: '#000000',
    surfaceDisabled: 'rgba(224, 224, 224, 0.12)',
    onSurfaceDisabled: 'rgba(224, 224, 224, 0.38)',
    backdrop: 'rgba(255, 255, 255, 0.32)',

    warning: '#FFCA28',           // Amarelo médio (Amber 400)
    onWarning: '#000000',
    warningContainer: '#4E342E',  // Marrom escuro (fundo para destaque)
    onWarningContainer: '#FFECB3' // Texto amarelo claro
  },
};

