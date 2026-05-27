module.exports = ({ config }) => {
  const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  console.log(
    '[app.config.js] EXPO_PUBLIC_GOOGLE_MAPS_API_KEY:',
    key ? `SET (length ${key.length})` : 'UNDEFINED'
  );

  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...((config.android && config.android.config) || {}),
        googleMaps: {
          apiKey: key,
        },
      },
    },
  };
};
