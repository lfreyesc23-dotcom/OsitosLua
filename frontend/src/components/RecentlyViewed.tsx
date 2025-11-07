import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentlyViewed, RecentProduct } from '../utils/recentlyViewed';

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const products = getRecentlyViewed();
    setRecentProducts(products.slice(0, 4)); // Mostrar solo 4
  }, []);

  if (recentProducts.length === 0) {
    return null; // No mostrar si no hay productos vistos
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="mt-12 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          👁️ Vistos Recientemente
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {recentProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group"
          >
            <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-purple-100">
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                <img
                  src={product.imagenes[0] || 'https://via.placeholder.com/300'}
                  alt={`${product.nombre} - Producto visto recientemente`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                  {product.nombre}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {formatPrice(product.precio)}
                  </span>
                  <span className="text-xs text-gray-500 bg-purple-100 px-2 py-1 rounded-full">
                    Visto antes
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
