const { createRunOncePlugin } = require("expo/config-plugins");

const queries = {
  package: [
    { $: { "android:name": "com.wallet.crypto.trustapp" } },
    { $: { "android:name": "io.metamask" } },
    { $: { "android:name": "me.rainbow" } },
    { $: { "android:name": "io.zerion.android" } },
    { $: { "android:name": "io.gnosis.safe" } },
    { $: { "android:name": "com.uniswap.mobile" } },
  ],
};

const withAndroidManifestService = (config) => {
  return {
    ...config,
    android: {
      ...config.android,
      manifest: {
        ...config.android.manifest,
        queries,
      },
    },
  };
};

module.exports = createRunOncePlugin(
  withAndroidManifestService,
  "withAndroidManifestService",
  "1.0.0"
);
