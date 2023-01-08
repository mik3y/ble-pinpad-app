import { useContext, useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Headline, TextInput } from 'react-native-paper';

import BluetoothContext from '../component/BluetoothContext';
import LoadingZone from '../component/LoadingZone';

const Authenticator = ({ device }) => {
  const [passcode, setPasscode] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getPinpadStatus, submitToPinpad } = useContext(BluetoothContext);

  useEffect(() => {
    async function load() {
      const result = await getPinpadStatus(device);
      console.log('connected, result=', result);
      setDeviceStatus(result);
    }
    load();
  }, []);

  const doSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitToPinpad(device, passcode, deviceStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!deviceStatus) {
    return <LoadingZone />;
  }

  return (
    <View style={styles.container}>
      <Text>Please enter the passcode</Text>
      <TextInput
        value={passcode}
        onChangeText={setPasscode}
        label="Passcode"
        style={styles.input}
        textContentType="password"
        secureTextEntry
        placeholder=""
        autoCompleteType="password"
        autoCorrect={false}
        editable={!isSubmitting}
      />
      <Button
        mode="contained"
        onPress={doSubmit}
        disabled={isSubmitting}
        style={styles.submitButton}
      >
        {isSubmitting ? 'Sending pin...' : 'Submit pin'}
      </Button>
    </View>
  );
};

const DeviceView = ({ route }) => {
  const { deviceId } = route.params;
  const { allDevices } = useContext(BluetoothContext);
  const device = allDevices[deviceId];
  return (
    <View key={'main'} style={styles.container}>
      <Headline>{device.name}</Headline>
      <Authenticator device={device} />
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
    paddingLeft: 10,
    paddingRight: 10,
  },
  message: {
    marginTop: 10,
    color: '#aaa',
  },
  scrollView: {
    width: '100%',
    padding: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  submitButton: {
    width: '100%',
    padding: 16,
  },
});

export default DeviceView;
