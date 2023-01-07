/**
 * MainView shows an overview of Bluetooth state, and a list of
 * any discovered devices.
 */
import { useContext } from 'react';

import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';

import BluetoothContext from '../component/BluetoothContext';

const DeviceCard = ({ device, onPress = () => {}, ...cardProps }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card {...cardProps} key={`device-${device.id}`} style={styles.cardStyle}>
        <Card.Title
          title={device.name || device.id}
          // titleStyle={GlobalStyles.appTitle}
          // left={(props) => React.cloneElement(appIcon, props)}
          subtitle={device.id}
          leftStyle={{
            margin: 0,
            padding: 0,
            width: 20,
            alignContent: 'flex-end',
          }}
        />
        <Card.Content>
          <View></View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const DiscoveredDeviceList = () => {
  const { isScanning, allDevices, startScan } = useContext(BluetoothContext);

  const deviceItems = Object.entries(allDevices).map(([deviceId, device]) => {
    return <DeviceCard key={`device-${deviceId}`} device={device} />;
  });

  return (
    <View style={styles.container}>
      <Text>Discovered devices appear below.</Text>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isScanning} onRefresh={startScan} />}
      >
        {deviceItems}
        <View style={{ marginBottom: 30 }}></View>
      </ScrollView>
    </View>
  );
};

const MainView = ({}) => {
  return (
    <View key={'main'} style={styles.container}>
      <DiscoveredDeviceList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  message: {
    marginTop: 10,
    color: '#aaa',
  },
  scrollView: {
    width: '100%',
    padding: 20,
  },
});

export default MainView;
