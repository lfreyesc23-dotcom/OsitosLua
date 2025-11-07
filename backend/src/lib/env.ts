import { logger } from './logger';

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'FRONTEND_URL',
] as const;

const optionalEnvVars = [
  'PORT',
  'NODE_ENV',
  'LOG_LEVEL',
] as const;

export function validateEnv(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Verificar variables requeridas
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Verificar variables opcionales
  optionalEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  });

  // Si faltan variables críticas, salir
  if (missing.length > 0) {
    console.error('\n❌ ERROR: Faltan variables de entorno requeridas:\n');
    missing.forEach(varName => {
      console.error(`  ✗ ${varName}`);
    });
    console.error('\n📝 Por favor, configura estas variables en tu archivo .env\n');
    console.error('💡 Puedes copiar .env.example como base\n');
    process.exit(1);
  }

  // Advertencias para variables opcionales
  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('\n⚠️  Variables de entorno opcionales no configuradas:');
    warnings.forEach(varName => {
      console.warn(`  • ${varName} (usando valor por defecto)`);
    });
    console.warn('');
  }

  // Validaciones específicas
  validateSpecificVars();

  logger.info('✅ Variables de entorno validadas correctamente');
}

function validateSpecificVars(): void {
  // Validar JWT_SECRET longitud
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET debería tener al menos 32 caracteres para mayor seguridad');
  }

  // Validar formato de EMAIL_PORT
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');
  if (isNaN(emailPort) || emailPort < 1 || emailPort > 65535) {
    console.error('❌ EMAIL_PORT debe ser un número entre 1 y 65535');
    process.exit(1);
  }

  // Validar que FRONTEND_URL sea una URL válida
  try {
    if (process.env.FRONTEND_URL) {
      new URL(process.env.FRONTEND_URL);
    }
  } catch {
    console.error('❌ FRONTEND_URL debe ser una URL válida');
    process.exit(1);
  }

  // Advertir si estamos en producción sin HTTPS
  if (process.env.NODE_ENV === 'production') {
    if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.startsWith('https://')) {
      console.warn('⚠️  FRONTEND_URL debería usar HTTPS en producción');
    }
    
    if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
      console.warn('⚠️  Usando claves de Stripe en modo TEST en producción');
    }
  }
}

// Obtener variable de entorno con valor por defecto
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Variable de entorno ${key} no está definida`);
  }
  return value || defaultValue!;
}

// Obtener variable de entorno como número
export function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Variable de entorno ${key} no está definida`);
  }
  const num = parseInt(value || String(defaultValue));
  if (isNaN(num)) {
    throw new Error(`Variable de entorno ${key} debe ser un número`);
  }
  return num;
}

// Obtener variable de entorno como booleano
export function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}
