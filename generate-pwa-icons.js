/**
 * Script para generar iconos PWA con emoji de osito 🧸
 * Requiere: npm install canvas
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configuración de iconos a generar
const icons = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon.ico', size: 32 } // Generamos PNG, renombrar manualmente a .ico
];

// Color de fondo (rosa pastel)
const backgroundColor = '#FFB6C1';

// Función para generar un icono
function generateIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fondo con gradiente
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#FFB6C1'); // Rosa pastel
  gradient.addColorStop(1, '#FFC0CB'); // Rosa más claro
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Círculo decorativo (opcional)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Emoji de osito 🧸
  // Nota: Los emoji pueden no renderizar bien en canvas
  // Alternativa: usar texto "🧸" con fallback
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#8B4513'; // Marrón para el texto de respaldo
  ctx.fillText('🧸', size / 2, size / 2);

  // Guardar imagen
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Generado: ${outputPath}`);
}

// Crear directorio public si no existe
const publicDir = path.join(__dirname, 'frontend', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generar todos los iconos
console.log('🎨 Generando iconos PWA...\n');

icons.forEach(({ name, size }) => {
  const outputPath = path.join(publicDir, name);
  try {
    generateIcon(size, outputPath);
  } catch (error) {
    console.error(`❌ Error generando ${name}:`, error.message);
  }
});

console.log('\n✨ ¡Iconos generados exitosamente!');
console.log('\n📝 Notas:');
console.log('- Si el emoji no se ve bien, considera usar un logo SVG real');
console.log('- Para favicon.ico, renombra favicon.ico.png manualmente');
console.log('- Puedes mejorar los iconos con: https://realfavicongenerator.net/');
