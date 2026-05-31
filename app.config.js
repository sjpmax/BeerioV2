module.exports = ({ config }) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  const android = { ...config.android };
  if (apiKey) {
    android.config = {
      ...(android.config ?? {}),
      googleMaps: { apiKey },
    };
  }
  return { ...config, android };
};
