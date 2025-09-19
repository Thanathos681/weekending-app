import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import React from 'react';

const prefix = Linking.createURL('/');
const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#0B0B0B' } };

export const AppNavigation: React.FC<React.PropsWithChildren> = ({ children }) => (
  <NavigationContainer linking={{ prefixes: [prefix, 'weekending://'] }} theme={theme}>
    {children}
  </NavigationContainer>
);
