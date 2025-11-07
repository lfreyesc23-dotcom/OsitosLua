# 🎯 Structured Data (Schema.org) - OsitosLua

## ✅ Implementado

### 📊 Tipos de Structured Data

#### 1. Product Schema (ProductPage)
```json
{
  "@type": "Product",
  "name": "Oso de Peluche Grande",
  "description": "...",
  "image": ["url1", "url2"],
  "brand": {
    "@type": "Brand",
    "name": "OsitosLua"
  },
  "offers": {
    "@type": "Offer",
    "price": "29990",
    "priceCurrency": "CLP",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "15"
  },
  "review": [...]
}
```

**Beneficios**:
- ⭐ Estrellas en resultados de búsqueda
- 💰 Precio visible en Google
- ✅ Stock/disponibilidad
- 📸 Imágenes en carousel

#### 2. Organization Schema (HomePage, AboutPage)
```json
{
  "@type": "Organization",
  "name": "OsitosLua",
  "url": "https://ositoslua.cl",
  "logo": "https://ositoslua.cl/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CL",
    "addressRegion": "Región Metropolitana"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Servicio al Cliente",
    "email": "contacto@ositoslua.cl"
  }
}
```

**Beneficios**:
- 🏢 Knowledge Graph en Google
- 📍 Información de contacto
- 🔗 Links a redes sociales

#### 3. WebSite Schema (HomePage)
```json
{
  "@type": "WebSite",
  "name": "OsitosLua",
  "url": "https://ositoslua.cl",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ositoslua.cl/?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Beneficios**:
- 🔍 Sitelinks searchbox en Google
- 🎯 Búsqueda directa desde resultados

#### 4. BreadcrumbList (ProductPage)
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://ositoslua.cl"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Peluches",
      "item": "https://ositoslua.cl/category/peluches"
    }
  ]
}
```

**Beneficios**:
- 🍞 Breadcrumbs en resultados
- 🧭 Mejor navegación UX

#### 5. FAQPage (FAQPage)
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta el envío?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los costos varían según ubicación..."
      }
    }
  ]
}
```

**Beneficios**:
- ❓ Rich snippets con preguntas
- 📍 Mayor visibilidad en SERP
- 🎯 Featured snippets

#### 6. ItemList (HomePage)
```json
{
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://ositoslua.cl/product/1",
      "name": "Oso de Peluche",
      "image": "..."
    }
  ]
}
```

**Beneficios**:
- 📋 Carousels de productos
- 🖼️ Grid de imágenes en Google

#### 7. LocalBusiness (AboutPage)
```json
{
  "@type": "LocalBusiness",
  "name": "OsitosLua",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -33.4489,
    "longitude": -70.6693
  },
  "openingHoursSpecification": {
    "dayOfWeek": ["Monday", "Tuesday", ...],
    "opens": "09:00",
    "closes": "18:00"
  }
}
```

**Beneficios**:
- 🗺️ Google Maps integration
- 📍 Local search visibility
- ⏰ Horarios en resultados

## 📁 Archivos Creados

### `/frontend/src/utils/structuredData.ts`
Utilidades para generar structured data:
- ✅ `generateProductStructuredData()` - Productos con reviews
- ✅ `generateOrganizationStructuredData()` - Organización
- ✅ `generateWebSiteStructuredData()` - Website con searchbox
- ✅ `generateBreadcrumbStructuredData()` - Breadcrumbs
- ✅ `generateFAQStructuredData()` - FAQ page
- ✅ `generateItemListStructuredData()` - Lista productos
- ✅ `generateLocalBusinessStructuredData()` - Negocio local

### `/frontend/src/components/SEO.tsx`
Actualizado con soporte para `structuredData` prop:
- ✅ Acepta objeto structured data
- ✅ Renderiza script JSON-LD
- ✅ Multiple structured data con @graph

## 🎯 Páginas con Structured Data

| Página | Schemas Implementados |
|--------|----------------------|
| **HomePage** | WebSite, Organization, ItemList |
| **ProductPage** | Product, BreadcrumbList, AggregateRating, Review |
| **FAQPage** | FAQPage |
| **AboutPage** | LocalBusiness, Organization |

## 🧪 Testing

### 1. Rich Results Test (Google)
```
https://search.google.com/test/rich-results
```

Probar URLs:
- https://ositoslua.cl/product/1
- https://ositoslua.cl/faq
- https://ositoslua.cl/about

### 2. Schema Markup Validator
```
https://validator.schema.org/
```

Validar structured data manualmente.

### 3. Chrome DevTools
```javascript
// En la consola del navegador:
document.querySelectorAll('script[type="application/ld+json"]')
```

### 4. Ver en Código Fuente
```html
<!-- Buscar en el HTML generado -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  ...
}
</script>
```

## 📈 Beneficios SEO

### Antes (Sin Structured Data)
```
OsitosLua - Oso de Peluche Grande
Oso de peluche grande de alta calidad...
ositoslua.cl › product › 1
```

### Después (Con Structured Data)
```
OsitosLua - Oso de Peluche Grande
⭐⭐⭐⭐⭐ 4.8 (15 reviews)
$29.990 CLP · En stock
[📸 Imagen 1] [📸 Imagen 2] [📸 Imagen 3]
ositoslua.cl › Peluches › Oso de Peluche Grande
Oso de peluche grande de alta calidad...
```

### Mejoras
- ✅ **15-30% más CTR** con rich snippets
- ✅ **Estrellas visibles** aumentan confianza
- ✅ **Precio visible** mejora intención de compra
- ✅ **Breadcrumbs** mejoran navegación
- ✅ **FAQ snippets** capturan featured snippets

## 🔍 Ejemplos por Tipo

### Product Rich Snippet
```
[Imagen del producto]
Oso de Peluche Grande - OsitosLua
⭐⭐⭐⭐⭐ 4.8 · 15 reseñas
$29.990 CLP
En stock
Envío disponible
```

### FAQ Rich Snippet
```
¿Cuánto cuesta el envío? ▼
Los costos varían según ubicación:
• Gratis en Lo Valledor
• $2.000 en La Cisterna
• $5.000 en Santiago
• $8.000 en Regiones
```

### Organization Knowledge Panel
```
┌─────────────────────────┐
│ 🧸 OsitosLua           │
│ Tienda de Peluches     │
│                        │
│ 📍 Santiago, Chile     │
│ 📧 contacto@...        │
│ 🌐 ositoslua.cl       │
│                        │
│ 🔗 Facebook           │
│ 🔗 Instagram          │
└─────────────────────────┘
```

## 📊 Métricas a Monitorear

### Google Search Console
- Impresiones con rich results
- CTR comparado con snippets normales
- Queries con featured snippets
- Errores de structured data

### Tipos de Rich Results
- ✅ Product snippets (con rating)
- ✅ FAQ snippets (desplegables)
- ✅ Breadcrumbs (navegación)
- ✅ Sitelinks search box
- ✅ Organization knowledge panel

## 🚀 Próximos Pasos

### Corto Plazo
- [ ] Agregar Review schema a más productos
- [ ] Monitorear Search Console para errores
- [ ] A/B testing de descriptions

### Mediano Plazo
- [ ] HowTo schema (guías de cuidado)
- [ ] Video schema (si agregamos videos)
- [ ] Event schema (promociones/eventos)
- [ ] Offer schema (ofertas especiales)

### Largo Plazo
- [ ] Course schema (si creamos tutoriales)
- [ ] Recipe schema (si agregamos DIY)
- [ ] Article schema (para blog)

## 🔧 Mantenimiento

### Mensualmente
- Verificar errores en Search Console
- Validar structured data con Google Test
- Revisar que ratings se actualicen
- Verificar precios correctos

### Trimestral
- Audit completo de structured data
- Comparar CTR antes/después
- Actualizar info de organización
- Agregar nuevos schemas disponibles

## 📚 Recursos

### Documentación
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)
- [JSON-LD Playground](https://json-ld.org/playground/)

### Herramientas
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Generator](https://technicalseo.com/tools/schema-markup-generator/)
- [Structured Data Linter](http://linter.structured-data.org/)

## ✅ Checklist

- [x] Product schema con ratings
- [x] Organization schema
- [x] WebSite schema con searchbox
- [x] BreadcrumbList schema
- [x] FAQPage schema
- [x] ItemList schema
- [x] LocalBusiness schema
- [x] Integrado en componente SEO
- [x] Aplicado en 4 páginas principales
- [ ] Testeado en Google Rich Results
- [ ] Monitoreado en Search Console

---

✅ **Structured Data 100% Implementado**  
🎯 Ready para rich snippets en Google!
