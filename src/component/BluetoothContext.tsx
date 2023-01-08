import React, { useEffect, useState } from 'react';

import { Buffer } from 'buffer';
import { BleManager } from 'react-native-ble-plx';

import {
  PINPAD_HOTP_COUNTER_CHR_UUID,
  PINPAD_RPC_COMMAND_CHR_UUID,
  PINPAD_SECURITY_MODE_CHR_UUID,
  PINPAD_SERVICE_UUID,
  PINPAD_STATUS_CHR_UUID,
  SECURITY_MODE_HOTP,
  SECURITY_MODE_NONE,
  SECURITY_MODE_TOTP,
} from '../lib/constants';
import { hotp, totp } from '../lib/otp';
import SplashView from '../view/SplashView';

const BLE = new BleManager();

const SCAN_TIMEOUT_SECONDS = 5;

const doHotp = (passcode, counter) => {
  return hotp(passcode, counter, { digits: 6 });
};

const doTotp = (passcode) => {
  return totp(passcode, { digits: 6 });
};

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
  getPinpadStatus: () => {},
  submitToPinpad: () => {},
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
    setTimeout(() => stopScan(), SCAN_TIMEOUT_SECONDS * 1000);
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

  const getPinpadStatus = async (device, stayConnected = false) => {
    await BLE.connectToDevice(device.id);
    try {
      console.log('---- discovering characteristics');
      await BLE.discoverAllServicesAndCharacteristicsForDevice(device.id);

      console.log('---- reading device status');
      const statusChar = await BLE.readCharacteristicForDevice(
        device.id,
        PINPAD_SERVICE_UUID,
        PINPAD_STATUS_CHR_UUID
      );
      const status = Buffer.from(statusChar.value, 'base64').toString('ascii');

      console.log('---- reading device security mode');
      const modeChar = await BLE.readCharacteristicForDevice(
        device.id,
        PINPAD_SERVICE_UUID,
        PINPAD_SECURITY_MODE_CHR_UUID
      );
      const mode = Buffer.from(modeChar.value, 'base64').toString('ascii');

      console.log('---- reading hotp counter');
      const hotpChar = await BLE.readCharacteristicForDevice(
        device.id,
        PINPAD_SERVICE_UUID,
        PINPAD_HOTP_COUNTER_CHR_UUID
      );
      const hotpCounter = Number.parseInt(
        Buffer.from(hotpChar.value, 'base64').toString('ascii'),
        10
      );
      return {
        status,
        mode,
        hotpCounter,
      };
    } finally {
      if (!stayConnected) {
        BLE.cancelDeviceConnection(device.id);
      }
    }
  };

  const submitToPinpad = async (device, secretPasscode, deviceStatus = null) => {
    const { status, mode, hotpCounter } = await getPinpadStatus(device, true);
    console.log('submitToPinpad: device=', device);
    try {
      let pinValue;
      switch (mode) {
        case SECURITY_MODE_NONE:
          pinValue = secretPasscode;
          break;
        case SECURITY_MODE_HOTP:
          pinValue = doHotp(secretPasscode, hotpCounter);
          break;
        case SECURITY_MODE_TOTP:
          pinValue = doTotp(secretPasscode);
          break;
        default:
          throw new Error(`Unsupported security mode: ${mode}`);
      }
      console.log(`Sending pin: ${pinValue}`);
      const encodedValue = Buffer.from(pinValue).toString('base64');
      await BLE.writeCharacteristicWithResponseForDevice(
        device.id,
        PINPAD_SERVICE_UUID,
        PINPAD_RPC_COMMAND_CHR_UUID,
        encodedValue
      );
    } finally {
      // Disconnect
      BLE.cancelDeviceConnection(device.id);
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
        getPinpadStatus,
        submitToPinpad,
      }}
    >
      {getComponentToRender()}
    </BluetoothContext.Provider>
  );
};

export const BluetoothContextConsumer = BluetoothContext.Consumer;
export default BluetoothContext;
