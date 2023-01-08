# BLE Pinpad App

Simple iOS/Android (react native) app that discovers nearby Bluetooth LE pinpads and lets you send a pin to them.

![Screenshot 1: Nearby device list](https://user-images.githubusercontent.com/390829/211176134-dd687816-d706-46b8-955c-183e3bf18bea.PNG) ![Screenshot 2: Auth screen](https://user-images.githubusercontent.com/390829/211176131-4012d7c7-74e9-4a20-a13d-8bed02144571.PNG)

> **Status**: 🚨 Experimental! Use at your own risk.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What's a BLE Pinpad?](#whats-a-ble-pinpad)
- [Developer Instructions](#developer-instructions)
  - [Initial install](#initial-install)
  - [Running against local device](#running-against-local-device)
- [App Stores](#app-stores)
- [Help, Feedback, and Ideas](#help-feedback-and-ideas)
- [License & Credit](#license--credit)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What's a BLE Pinpad?

See [@mik3y/esp32-ble-pinpad](https://github.com/mik3y/esp32-ble-pinpad) for the reference (and only known!) implementation. The [protocol details section](https://github.com/mik3y/esp32-ble-pinpad#protocol-how-it-works) describes what a client, like this one, must implement

## Developer Instructions

### Initial install

```
yarn install
```

### Running against local device

```
yarn expo run:ios --device
```

## App Stores

Not yet launched on the app stores.

## Help, Feedback, and Ideas

Please open an issue on GitHub!

## License & Credit

Written by **@mik3y**. 

All code is offered under the MIT license. See `LICENSE.txt` for full terms.
