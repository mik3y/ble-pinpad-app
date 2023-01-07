import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

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
    </RootStack.Navigator>
  );
};

const RootView = () => {
  return <RootStackScreen />;
};

export default RootView;
