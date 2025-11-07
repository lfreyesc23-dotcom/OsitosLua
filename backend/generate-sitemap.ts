/**
 * Script para generar sitemap.xml dinámicamente desde la base de datos
 * Uso: npx ts-node generate-sitemap.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  images?: Array<{
    loc: string;
    title: string;
  }>;
}

async function generateSitemap() {
  console.log('🗺️  Generando sitemap.xml...');

  const baseUrl = 'https://ositoslua.cl';
  const today = new Date().toISOString().split('T')[0];
  const urls: SitemapUrl[] = [];

  // Páginas estáticas
  const staticPages = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/contact', changefreq: 'monthly', priority: '0.8' },
    { path: '/faq', changefreq: 'monthly', priority: '0.7' },
    { path: '/wishlist', changefreq: 'weekly', priority: '0.6' },
    { path: '/terms', changefreq: 'yearly', priority: '0.5' },
    { path: '/privacy', changefreq: 'yearly', priority: '0.5' },
    { path: '/returns', changefreq: 'yearly', priority: '0.5' },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  // Productos dinámicos desde la base de datos
  const products = await prisma.product.findMany({
    select: {
      id: true,
      nombre: true,
      imagenes: true,
      updatedAt: true,
    },
  });

  console.log(`📦 Encontrados ${products.length} productos`);

  products.forEach(product => {
    const productUrl: SitemapUrl = {
      loc: `${baseUrl}/product/${product.id}`,
      lastmod: product.updatedAt.toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.9',
    };

    // Agregar imágenes del producto
    if (product.imagenes && product.imagenes.length > 0) {
      productUrl.images = product.imagenes.slice(0, 3).map(img => ({
        loc: img,
        title: product.nombre,
      }));
    }

    urls.push(productUrl);
  });

  // Generar XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;

    if (url.images) {
      url.images.forEach(image => {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${escapeXml(image.loc)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(image.title)}</image:title>\n`;
        xml += '    </image:image>\n';
      });
    }

    xml += '  </url>\n';
  });

  xml += '</urlset>';

  // Guardar archivo
  const outputPath = path.join(__dirname, '../frontend/public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');

  console.log(`✅ Sitemap generado: ${outputPath}`);
  console.log(`📊 Total URLs: ${urls.length}`);
  console.log(`   - Páginas estáticas: ${staticPages.length}`);
  console.log(`   - Productos: ${products.length}`);
  
  await prisma.$disconnect();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Ejecutar
generateSitemap()
  .then(() => {
    console.log('\n🎉 Sitemap actualizado exitosamente!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error generando sitemap:', error);
    process.exit(1);
  });
