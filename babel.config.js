module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Reanimated 4 — must be last. Same stack as atlas-app / blackink-app.
      "react-native-worklets/plugin",
    ],
  };
};
