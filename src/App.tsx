import { FontAwesome5 } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BluetoothContextProvider } from './component/BluetoothContext';
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
