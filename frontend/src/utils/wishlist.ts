interface WishlistItem {
  productId: string;
  addedAt: number;
}

const WISHLIST_KEY = 'ositoslua_wishlist';
const MAX_WISHLIST_DAYS = 90; // 90 días de expiración

export const addToWishlist = (productId: string): void => {
  const wishlist = getWishlist();
  
  // Verificar si ya existe
  if (wishlist.some(item => item.productId === productId)) {
    return;
  }

  wishlist.push({
    productId,
    addedAt: Date.now(),
  });

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
};

export const removeFromWishlist = (productId: string): void => {
  const wishlist = getWishlist();
  const filtered = wishlist.filter(item => item.productId !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
};

export const isInWishlist = (productId: string): boolean => {
  const wishlist = getWishlist();
  return wishlist.some(item => item.productId === productId);
};

export const getWishlist = (): WishlistItem[] => {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (!stored) return [];

    const wishlist: WishlistItem[] = JSON.parse(stored);
    const now = Date.now();
    const maxAge = MAX_WISHLIST_DAYS * 24 * 60 * 60 * 1000;

    // Filtrar items expirados
    const filtered = wishlist.filter(item => {
      return now - item.addedAt < maxAge;
    });

    // Actualizar si hubo cambios
    if (filtered.length !== wishlist.length) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
    }

    return filtered;
  } catch (error) {
    console.error('Error al leer wishlist:', error);
    return [];
  }
};

export const getWishlistProductIds = (): string[] => {
  return getWishlist().map(item => item.productId);
};

export const clearWishlist = (): void => {
  localStorage.removeItem(WISHLIST_KEY);
};

export const getWishlistCount = (): number => {
  return getWishlist().length;
};

export const toggleWishlist = (productId: string): boolean => {
  if (isInWishlist(productId)) {
    removeFromWishlist(productId);
    return false; // Removido
  } else {
    addToWishlist(productId);
    return true; // Agregado
  }
};
