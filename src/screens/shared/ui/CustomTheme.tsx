import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#43A047',
    onPrimary: '#FFFFFF',
    primaryContainer: '#C8E6C9',
    onPrimaryContainer: '#1B5E20',

    secondary: '#689F38',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#DCE775',
    onSecondaryContainer: '#33691E',

    tertiary: '#0097A7',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#B2EBF2',
    onTertiaryContainer: '#004D40',

    background: '#FAFAFA',
    onBackground: '#212121',

    surface: '#FFFFFF',
    onSurface: '#212121',
    surfaceVariant: '#F0F0F0',
    onSurfaceVariant: '#4F4F4F',

    outline: '#BDBDBD',
    outlineVariant: '#E0E0E0',

    error: '#D32F2F',
    onError: '#FFFFFF',
    errorContainer: '#FFCDD2',
    onErrorContainer: '#C62828',

    inverseSurface: '#303030',
    inverseOnSurface: '#FAFAFA',
    inversePrimary: '#66BB6A',

    shadow: '#000000',
    surfaceDisabled: 'rgba(0, 0, 0, 0.12)',
    onSurfaceDisabled: 'rgba(0, 0, 0, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.32)',

    warning: '#FBC02D',
    onWarning: '#000000',
    warningContainer: '#FFF9C4',
    onWarningContainer: '#5D4037',
  },
};


export const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#81C784',
    onPrimary: '#1B5E20',
    primaryContainer: '#388E3C',
    onPrimaryContainer: '#C8E6C9',

    secondary: '#AED581',
    onSecondary: '#33691E',
    secondaryContainer: '#558B2F',
    onSecondaryContainer: '#DCEDC8',

    tertiary: '#4DD0E1',
    onTertiary: '#004D40',
    tertiaryContainer: '#006064',
    onTertiaryContainer: '#B2EBF2',

    background: '#121212',
    onBackground: '#FFFFFF',

    surface: '#1E1E1E',
    onSurface: '#E0E0E0',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: '#BDBDBD',

    outline: '#616161',
    outlineVariant: '#757575',

    error: '#EF9A9A',
    onError: '#000000',
    errorContainer: '#C62828',
    onErrorContainer: '#FFCDD2',

    inverseSurface: '#FAFAFA',
    inverseOnSurface: '#212121',
    inversePrimary: '#66BB6A',

    shadow: '#000000',
    surfaceDisabled: 'rgba(255, 255, 255, 0.12)',
    onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)',
    backdrop: 'rgba(255, 255, 255, 0.32)',

    warning: '#FFB300',
    onWarning: '#000000',
    warningContainer: '#4E342E',
    onWarningContainer: '#FFECB3',
  },
};


