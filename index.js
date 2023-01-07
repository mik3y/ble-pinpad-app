// This file should not be necessary. We should be able to
// declare { "main": "src/index.js" } in package.json per the
// instructions [1]. But bundling subsequently gives me an
// error, sigh. Creating this shim and moving on with life.
//
// [1] https://docs.expo.dev/versions/latest/sdk/register-root-component/#what-if-i-want-to-name-my-main-app-file-something-other-than-appjs
import './src/index';
