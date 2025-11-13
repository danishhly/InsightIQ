export const config = {
  // Server
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // OpenAI (optional for now)
  openaiApiKey: process.env.OPENAI_API_KEY || '',
};

// Validate required environment variables
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

if (config.nodeEnv === 'production' && config.jwtSecret === 'your-secret-key-change-in-production') {
  console.warn('⚠️  Warning: Using default JWT secret in production is insecure!');
}

