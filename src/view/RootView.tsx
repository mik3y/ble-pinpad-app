import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';

import DeviceView from './DeviceView';
import MainView from './MainView';

const RootStack = createStackNavigator();
const RootStackScreen = () => {
  const { colors } = useTheme();
  return (
    <RootStack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          color: colors.inversePrimary,
        },
      }}
    >
      <RootStack.Screen name="MainScreen" component={MainView} options={{ title: 'BLE Pinpad' }} />
      <RootStack.Screen name="DeviceScreen" component={DeviceView} options={{ title: 'Pin In' }} />
    </RootStack.Navigator>
  );
};

const RootView = () => {
  return <RootStackScreen />;
};

export default RootView;
