/**
 * Utilidades para generar Structured Data (Schema.org) en formato JSON-LD
 * Para rich snippets en Google Search Results
 */

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenes: string[];
  categoria: string;
}

interface Review {
  rating: number;
  comentario: string;
  user?: {
    nombre: string;
  };
  createdAt: string;
}

/**
 * Genera structured data para un producto
 * Incluye: precio, disponibilidad, imágenes, ratings
 */
export function generateProductStructuredData(
  product: Product,
  reviews: Review[] = []
) {
  const baseUrl = 'https://ositoslua.cl';
  
  // Calcular rating promedio
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : undefined;

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    description: product.descripcion,
    image: product.imagenes,
    brand: {
      '@type': 'Brand',
      name: 'OsitosLua',
    },
    category: product.categoria,
    offers: {
      '@type': 'Offer',
      price: product.precio,
      priceCurrency: 'CLP',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/product/${product.id}`,
      seller: {
        '@type': 'Organization',
        name: 'OsitosLua',
      },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 1 año
    },
  };

  // Agregar rating si hay reviews
  if (avgRating && reviews.length > 0) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Agregar reviews individuales
  if (reviews.length > 0) {
    structuredData.review = reviews.slice(0, 5).map((review) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        '@type': 'Person',
        name: review.user?.nombre || 'Usuario',
      },
      reviewBody: review.comentario,
      datePublished: review.createdAt,
    }));
  }

  return structuredData;
}

/**
 * Genera structured data para la organización
 * Para la página de inicio y about
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OsitosLua',
    url: 'https://ositoslua.cl',
    logo: 'https://ositoslua.cl/logo.png',
    description:
      'Tienda online de peluches y juguetes de calidad en Chile. Envíos a todo el país.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
      addressRegion: 'Región Metropolitana',
      addressLocality: 'Santiago',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Servicio al Cliente',
      email: 'contacto@ositoslua.cl',
      availableLanguage: ['Spanish'],
    },
    sameAs: [
      'https://www.facebook.com/ositoslua',
      'https://www.instagram.com/ositoslua',
      'https://twitter.com/ositoslua',
    ],
  };
}

/**
 * Genera breadcrumb structured data
 * Para navegación en search results
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Genera WebSite structured data con sitelinks searchbox
 * Para la página de inicio
 */
export function generateWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OsitosLua',
    url: 'https://ositoslua.cl',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ositoslua.cl/?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Genera FAQ structured data
 * Para la página de FAQ
 */
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Genera ItemList structured data para el catálogo
 * Para HomePage con lista de productos
 */
export function generateItemListStructuredData(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://ositoslua.cl/product/${product.id}`,
      name: product.nombre,
      image: product.imagenes[0],
    })),
  };
}

/**
 * Genera LocalBusiness structured data
 * Para la página About
 */
export function generateLocalBusinessStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://ositoslua.cl/#business',
    name: 'OsitosLua',
    image: 'https://ositoslua.cl/logo.png',
    url: 'https://ositoslua.cl',
    telephone: '+56-9-XXXX-XXXX',
    email: 'contacto@ositoslua.cl',
    priceRange: '$5.000 - $50.000',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
      addressRegion: 'Región Metropolitana',
      addressLocality: 'Santiago',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -33.4489,
      longitude: -70.6693,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    paymentAccepted: 'Tarjetas de crédito, débito',
    currenciesAccepted: 'CLP',
  };
}
