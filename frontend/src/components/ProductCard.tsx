import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toggleWishlist, isInWishlist } from '../utils/wishlist';
import { showSuccess } from '../utils/notifications';
import { trackAddToWishlist } from '../utils/analytics';

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento?: number; // Porcentaje de descuento
  stock: number;
  imagenes: string[];
  categoria: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const imageUrl = product.imagenes?.[0] || '/logo-ositoslua.png';
  const [isHovered, setIsHovered] = useState(false);
  const [inWishlist, setInWishlist] = useState(isInWishlist(product.id));
  
  // Usar el descuento real del producto si existe
  const hasDiscount = product.descuento && product.descuento > 0;
  const discountPercentage = product.descuento || 0;
  const discountedPrice = hasDiscount ? product.precio * (1 - discountPercentage / 100) : product.precio;

  // Formato de precio chileno
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    setInWishlist(added);
    
    if (added) {
      trackAddToWishlist({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
      });
      showSuccess('💝 Agregado a favoritos');
    } else {
      showSuccess('Eliminado de favoritos');
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {hasDiscount && (
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discountPercentage}% OFF
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ¡Últimas {product.stock} unidades!
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            AGOTADO
          </span>
        )}
      </div>

      {/* Botón de Wishlist */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all group/heart"
        title={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {inWishlist ? (
          <FaHeart className="text-pink-500 group-hover/heart:scale-110 transition-transform w-5 h-5" />
        ) : (
          <FaRegHeart className="text-gray-600 group-hover/heart:text-pink-500 group-hover/heart:scale-110 transition-all w-5 h-5" />
        )}
      </button>

      {/* Imagen del producto */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-square relative bg-gradient-to-br from-pink-50 to-purple-50">
          <img
            src={imageUrl}
            alt={`${product.nombre} - Peluche de calidad premium en OsitosLua`}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Overlay en hover */}
          <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
      </Link>

      {/* Información del producto */}
      <div className="p-4">
        {/* Categoría */}
        <Link to={`/product/${product.id}`}>
          <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">
            {product.categoria}
          </span>
        </Link>

        {/* Nombre del producto */}
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-2 text-base font-semibold text-gray-800 line-clamp-2 hover:text-purple-600 transition-colors min-h-[48px]">
            {product.nombre}
          </h3>
        </Link>

        {/* Descripción */}
        <p className="mt-2 text-xs text-gray-500 line-clamp-2 min-h-[32px]">
          {product.descripcion}
        </p>

        {/* Precio */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            {formatPrice(discountedPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.precio)}
            </span>
          )}
        </div>

        {/* Envío gratis badge */}
        <div className="mt-2 flex items-center gap-1 text-green-600 text-xs font-medium">
          <span>🚚</span>
          <span>Envío calculado al checkout</span>
        </div>

        {/* Rating ficticio */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">⭐</span>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({Math.floor(Math.random() * 500) + 50} reseñas)
          </span>
        </div>

        {/* Botones de acción */}
        <div className="mt-4 flex gap-2">
          {onAddToCart && product.stock > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span className="text-lg">🛒</span>
              <span>Agregar</span>
            </button>
          )}
          
          <Link 
            to={`/product/${product.id}`}
            className={`${onAddToCart && product.stock > 0 ? 'w-auto' : 'flex-1'} bg-white border-2 border-purple-600 text-purple-600 py-3 px-4 rounded-xl font-semibold text-sm hover:bg-purple-50 transition-all duration-200 flex items-center justify-center`}
          >
            {onAddToCart && product.stock > 0 ? '👁️' : '👁️ Ver Detalles'}
          </Link>
        </div>

        {/* Mensaje de agotado */}
        {product.stock === 0 && (
          <div className="mt-4 bg-gray-100 text-gray-600 py-3 px-4 rounded-xl text-center font-medium text-sm">
            Producto Agotado
          </div>
        )}
      </div>

      {/* Indicador de stock bajo */}
      {product.stock > 0 && product.stock <= 3 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
      )}
    </div>
  );
};

export default ProductCard;
