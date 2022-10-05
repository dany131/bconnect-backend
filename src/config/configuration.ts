export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 3000,
  MONGO_URI: process.env.MONGO_URI,
  VERSION: process.env.VERSION,
  AT_STRATEGY: process.env.AT_STRATEGY,
  MEDIA_PATH: process.env.MEDIA_PATH,
  REMOTE_BASE_URL: process.env.REMOTE_BASE_URL
});