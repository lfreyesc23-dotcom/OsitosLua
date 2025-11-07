import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import api from '../api/axios';
import { getWishlistProductIds, removeFromWishlist, clearWishlist } from '../utils/wishlist';
import { useCart } from '../contexts/CartContext';
import { showSuccess, showError } from '../utils/notifications';
import SEO from '../components/SEO';

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenes: string[];
  categoria: string;
}

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlistProducts();
  }, []);

  const fetchWishlistProducts = async () => {
    try {
      setLoading(true);
      const productIds = getWishlistProductIds();

      if (productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Obtener todos los productos
      const { data } = await api.get('/products');
      
      // Filtrar solo los que están en wishlist
      const wishlistProducts = data.filter((p: Product) => 
        productIds.includes(p.id)
      );

      setProducts(wishlistProducts);
    } catch (error) {
      console.error('Error al cargar wishlist:', error);
      showError('Error al cargar tu lista de deseos');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    setProducts(products.filter(p => p.id !== productId));
    showSuccess('Producto eliminado de tu lista de deseos');
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addToCart(product);
      showSuccess(`${product.nombre} agregado al carrito`);
    } else {
      showError('Producto sin stock disponible');
    }
  };

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de vaciar toda tu lista de deseos?')) {
      clearWishlist();
      setProducts([]);
      showSuccess('Lista de deseos vaciada');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <SEO 
        title="Mi Lista de Deseos"
        description="Guarda tus productos favoritos en tu lista de deseos"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <FaHeart className="text-pink-500" />
                Mi Lista de Deseos
              </h1>
              <p className="text-gray-600 mt-2">
                {products.length} {products.length === 1 ? 'producto guardado' : 'productos guardados'}
              </p>
            </div>
            {products.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-semibold transition flex items-center gap-2"
              >
                <FaTrash />
                Vaciar lista
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-6">💝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tu lista de deseos está vacía
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Guarda tus productos favoritos haciendo clic en el corazón. 
              Así podrás encontrarlos fácilmente más tarde.
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition"
            >
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Imagen */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.imagenes[0] || 'https://via.placeholder.com/300'}
                      alt={product.nombre}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </Link>
                  
                  {/* Botón de eliminar */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition group"
                    title="Quitar de favoritos"
                  >
                    <FaHeart className="text-pink-500 group-hover:scale-110 transition-transform w-5 h-5" />
                  </button>

                  {/* Badge de stock */}
                  {product.stock === 0 && (
                    <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Agotado
                    </div>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ¡Últimas unidades!
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="p-5">
                  {/* Categoría */}
                  <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold uppercase mb-2">
                    {product.categoria}
                  </span>

                  {/* Nombre */}
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition">
                      {product.nombre}
                    </h3>
                  </Link>

                  {/* Descripción */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.descripcion}
                  </p>

                  {/* Precio */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(product.precio)}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart />
                      {product.stock === 0 ? 'Agotado' : 'Agregar'}
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        {products.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Te gustan estos productos?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Agrégalos a tu carrito y completa tu compra hoy mismo
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/cart"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Ver Carrito
              </Link>
              <Link
                to="/"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
              >
                Seguir Explorando
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
