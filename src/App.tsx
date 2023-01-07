import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { BluetoothContextProvider } from './component/BluetoothContext';
import MainView from './view/MainView';
import RootView from './view/RootView';

// TODO(mikey): Use our very own special colors here.
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

export default function App() {
  return (
    <PaperProvider
      theme={theme}
      settings={{
        icon: (props) => <FontAwesome5 {...props} />,
      }}
    >
      <SafeAreaProvider>
        <NavigationContainer>
          <BluetoothContextProvider>
            <RootView />
          </BluetoothContextProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
