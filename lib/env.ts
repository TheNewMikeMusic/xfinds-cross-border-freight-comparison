/**
 * Environment variables validation and type definitions
 * Ensures all required environment variables are set and valid
 */

const isProduction = process.env.NODE_ENV === 'production'
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-development-build'

function getEnvVar(name: string, defaultValue?: string, required = true): string {
  const value = process.env[name] || defaultValue

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  // Only validate JWT_SECRET at runtime, not during build
  if (isProduction && !isBuildTime && name === 'JWT_SECRET' && value === 'dev-secret-key-change-in-production') {
    throw new Error('JWT_SECRET must be changed from default value in production')
  }

  return value!
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  isDevelopment: !isProduction,

  // Authentication
  jwtSecret: getEnvVar('JWT_SECRET', 'dev-secret-key-change-in-production', isProduction),
  authMode: getEnvVar('AUTH_MODE', 'stub', false),

  // Admin
  adminToken: getEnvVar('ADMIN_TOKEN', undefined, false),

  // API
  exchangeRateApi: getEnvVar('EXCHANGE_RATE_API', 'https://api.exchangerate-api.com/v4/latest/CNY', false),
} as const

// Validate environment on module load (only at runtime, not during build)
if (isProduction && !isBuildTime) {
  // Additional production checks
  if (!env.jwtSecret || env.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production')
  }
}

