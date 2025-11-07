// LocalStorage utilities para productos vistos recientemente

const RECENTLY_VIEWED_KEY = 'ositoslua_recently_viewed';
const MAX_RECENT_PRODUCTS = 8;

export interface RecentProduct {
  id: string;
  nombre: string;
  precio: number;
  imagenes: string[];
  viewedAt: number;
}

// Agregar producto a vistos recientemente
export const addToRecentlyViewed = (product: {
  id: string;
  nombre: string;
  precio: number;
  imagenes: string[];
}) => {
  try {
    const recent = getRecentlyViewed();
    
    // Remover si ya existe
    const filtered = recent.filter(p => p.id !== product.id);
    
    // Agregar al inicio con timestamp
    const updated = [
      {
        ...product,
        viewedAt: Date.now()
      },
      ...filtered
    ].slice(0, MAX_RECENT_PRODUCTS);
    
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error guardando producto visto:', error);
  }
};

// Obtener productos vistos recientemente
export const getRecentlyViewed = (): RecentProduct[] => {
  try {
    const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!data) return [];
    
    const products = JSON.parse(data);
    
    // Filtrar productos de más de 30 días
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return products.filter((p: RecentProduct) => p.viewedAt > thirtyDaysAgo);
  } catch (error) {
    console.error('Error obteniendo productos vistos:', error);
    return [];
  }
};

// Limpiar productos vistos
export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch (error) {
    console.error('Error limpiando productos vistos:', error);
  }
};

// Remover producto específico
export const removeFromRecentlyViewed = (productId: string) => {
  try {
    const recent = getRecentlyViewed();
    const filtered = recent.filter(p => p.id !== productId);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removiendo producto visto:', error);
  }
};
