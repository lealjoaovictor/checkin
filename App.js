import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

import MapaScreen from './src/screens/MapaScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';

const Stack = createStackNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3F51B5',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Mapa" component={MapaScreen} />
          <Stack.Screen name="Historico" component={HistoricoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}