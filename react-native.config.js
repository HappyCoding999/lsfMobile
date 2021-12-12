/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  dependencies: {
    "react-native-firebase": {
      platforms: {
        android: null,
      },
    },
  },
  assets: ["res/fonts"],
};

module.exports = {
  dependencies: {
    "react-native-video": {
      platforms: {
        android: {
          sourceDir: "../node_modules/react-native-video/android-exoplayer",
        },
      },
    },
  },
};
