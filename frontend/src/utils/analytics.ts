import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';

// IDs de tracking (agregar a .env en producción)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || '';

let isInitialized = false;

/**
 * Inicializar Google Analytics 4 y Facebook Pixel
 */
export const initializeAnalytics = () => {
  if (isInitialized) return;

  // Inicializar Google Analytics 4
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      gaOptions: {
        siteSpeedSampleRate: 100, // Medir velocidad del sitio
      },
    });
    console.log('✅ Google Analytics inicializado');
  } else {
    console.warn('⚠️ VITE_GA_MEASUREMENT_ID no configurado');
  }

  // Inicializar Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.init(FB_PIXEL_ID, undefined, {
      autoConfig: true,
      debug: false, // Cambiar a true en desarrollo para ver logs
    });
    ReactPixel.pageView();
    console.log('✅ Facebook Pixel inicializado');
  } else {
    console.warn('⚠️ VITE_FB_PIXEL_ID no configurado');
  }

  isInitialized = true;
};

/**
 * Trackear vista de página
 */
export const trackPageView = (path: string, title?: string) => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.send({ hitType: 'pageview', page: path, title });
  }

  // Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.pageView();
  }
};

/**
 * Trackear búsqueda
 */
export const trackSearch = (searchTerm: string) => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: 'Search',
      action: 'search',
      label: searchTerm,
    });
  }

  // Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.track('Search', { search_string: searchTerm });
  }
};

/**
 * Trackear vista de producto
 */
export const trackProductView = (product: {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
}) => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: 'Product',
      action: 'view_item',
      label: product.nombre,
      value: product.precio,
    });
  }

  // Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.track('ViewContent', {
      content_name: product.nombre,
      content_category: product.categoria,
      content_ids: [product.id],
      content_type: 'product',
      value: product.precio,
      currency: 'CLP',
    });
  }
};

/**
 * Trackear agregar al carrito
 */
export const trackAddToCart = (product: {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
}, quantity: number = 1) => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: 'Ecommerce',
      action: 'add_to_cart',
      label: product.nombre,
      value: product.precio * quantity,
    });
  }

  // Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.track('AddToCart', {
      content_name: product.nombre,
      content_category: product.categoria,
      content_ids: [product.id],
      content_type: 'product',
      value: product.precio * quantity,
      currency: 'CLP',
    });
  }
};

/**
 * Trackear inicio de checkout
 */
export const trackBeginCheckout = (cartTotal: number, itemCount: number) => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: 'Ecommerce',
      action: 'begin_checkout',
      value: cartTotal,
    });
  }

  // Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.track('InitiateCheckout', {
      value: cartTotal,
      currency: 'CLP',
      num_items: itemCount,
    });
  }
};

/**
 * Trackear compra completada
 */
export const trackPurchase = (
  orderId: string,
  total: number,
  items: Array<{ id: string; nombre: string; precio: number; cantidad: number }>
) => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: 'Ecommerce',
      action: 'purchase',
      label: orderId,
      value: total,
    });
  }

  // Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.track('Purchase', {
      value: total,
      currency: 'CLP',
      content_ids: items.map(item => item.id),
      content_type: 'product',
      num_items: items.length,
    });
  }
};

/**
 * Trackear registro de usuario
 */
export const trackSignUp = (method: string = 'email') => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: 'User',
      action: 'sign_up',
      label: method,
    });
  }

  // Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.track('CompleteRegistration', {
      status: 'completed',
      registration_method: method,
    });
  }
};

/**
 * Trackear login
 */
export const trackLogin = (method: string = 'email') => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: 'User',
      action: 'login',
      label: method,
    });
  }

  // Facebook Pixel - No tiene evento específico de login
};

/**
 * Trackear agregar a wishlist
 */
export const trackAddToWishlist = (product: {
  id: string;
  nombre: string;
  precio: number;
}) => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: 'Engagement',
      action: 'add_to_wishlist',
      label: product.nombre,
      value: product.precio,
    });
  }

  // Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.track('AddToWishlist', {
      content_name: product.nombre,
      content_ids: [product.id],
      value: product.precio,
      currency: 'CLP',
    });
  }
};

/**
 * Trackear suscripción a newsletter
 */
export const trackNewsletterSignup = () => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: 'Engagement',
      action: 'newsletter_signup',
      label: 'footer',
    });
  }

  // Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.track('Lead', {
      content_name: 'Newsletter Subscription',
    });
  }
};

/**
 * Trackear contacto
 */
export const trackContact = (method: string) => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: 'Engagement',
      action: 'contact',
      label: method,
    });
  }

  // Facebook Pixel
  if (FB_PIXEL_ID) {
    ReactPixel.track('Contact', {
      content_name: method,
    });
  }
};

/**
 * Trackear evento personalizado
 */
export const trackCustomEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (!isInitialized) return;

  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }
};
