import React, { useEffect, useState } from 'react';

import { BleManager } from 'react-native-ble-plx';

import { PINPAD_SERVICE_UUID } from '../lib/constants';
import SplashView from '../view/SplashView';

const BLE = new BleManager();

/**
 * BluetoothContext sets up bluetooth, showing a permissions screen if
 * needed.
 */
const BluetoothContext = React.createContext({
  isInitialized: false,
  isScanning: false,
  selectedDevice: null,
  connectedDevice: null,
  allDevices: [],
  startScan: () => {},
  stopScan: () => {},
});

export const BluetoothContextProvider = function ({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [allDevices, setAllDevices] = useState({});
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);

  useEffect(() => {
    const subscription = BLE.onStateChange((state) => {
      if (state === 'PoweredOn') {
        setIsInitialized(true);
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      console.log('BLE is ready, doing scan');
      startScan();
    }
  }, [isInitialized]);

  useEffect(() => {
    console.log('allDevices:', allDevices);
  }, [allDevices]);

  const startScan = async () => {
    setIsScanning(true);
    BLE.startDeviceScan([PINPAD_SERVICE_UUID], null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }
      if (!device) {
        return;
      }
      handleDeviceDiscovered(device);
    });
  };

  const stopScan = () => {
    try {
      BLE.stopDeviceScan();
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeviceDiscovered = (device) => {
    console.log(`device discovered: ${device.id} [${device.name}]`);
    setAllDevices((prev) => {
      return {
        ...prev,
        [device.id]: device,
      };
    });
  };

  const getComponentToRender = () => {
    if (!isInitialized) {
      // We haven't (potentially) loaded our API key from storage. Just wait
      // for that to come online.
      return <SplashView message={'Setting up BLE...'} />;
    } else {
      // Happy path: Onward to the rest of the app!
      return children;
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        isInitialized,
        isScanning,
        selectedDevice,
        connectedDevice,
        allDevices,
        startScan,
        stopScan,
      }}
    >
      {getComponentToRender()}
    </BluetoothContext.Provider>
  );
};

export const BluetoothContextConsumer = BluetoothContext.Consumer;
export default BluetoothContext;
