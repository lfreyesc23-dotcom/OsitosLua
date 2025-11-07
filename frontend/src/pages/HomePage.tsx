import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import RecentlyViewed from '../components/RecentlyViewed';
import SEO from '../components/SEO';
import DiscountWheel from '../components/DiscountWheel';
import { useCart } from '../contexts/CartContext';
import { showSuccess, showError } from '../utils/notifications';
import { trackSearch } from '../utils/analytics';
import {
  generateWebSiteStructuredData,
  generateOrganizationStructuredData,
  generateItemListStructuredData,
} from '../utils/structuredData';

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

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showWheel, setShowWheel] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { addToCart } = useCart();
  
  // Estados para filtros avanzados
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    fetchProducts();
  }, []);

  // Trackear búsquedas
  useEffect(() => {
    if (searchQuery) {
      trackSearch(searchQuery);
    }
  }, [searchQuery]);

  // Verificar si es primera visita y mostrar ruleta
  useEffect(() => {
    // DESHABILITADO TEMPORALMENTE - La ruleta automática puede causar problemas
    // Solo se mostrará si el usuario hace clic en el botón
    // const hasUsedWheel = localStorage.getItem('wheelUsed');
    // if (!hasUsedWheel) {
    //   // Mostrar ruleta después de 2 segundos
    //   const timer = setTimeout(() => {
    //     setShowWheel(true);
    //   }, 2000);
    //   return () => clearTimeout(timer);
    // }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      console.log('API Response:', response.data);
      
      // La API devuelve { products: [...], pagination: {...} }
      let productsData = response.data.products || response.data;
      
      // Asegurar que siempre sea un array
      if (!Array.isArray(productsData)) {
        console.error('Products data is not an array:', productsData);
        productsData = [];
      }
      
      setProducts(productsData);
    } catch (error: any) {
      console.error('Error cargando productos:', error);
      const message = error.response?.data?.error || error.response?.data?.message || 'Error al cargar productos';
      showError(message);
      // No bloquear la UI, solo mostrar array vacío
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showSuccess('Producto agregado al carrito');
  };

  const handleWheelWin = (discount: number) => {
    showSuccess(`🎉 ¡Felicitaciones! Ganaste ${discount}% de descuento`);
  };

  const categories = ['all', ...new Set(products.map((p) => p.categoria))];
  
  // Filtrar productos por categoría y búsqueda
  let filteredProducts = filter === 'all' ? products : products.filter((p) => p.categoria === filter);
  
  // Aplicar búsqueda si existe
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter((p) => 
      p.nombre.toLowerCase().includes(query) ||
      p.descripcion.toLowerCase().includes(query) ||
      p.categoria.toLowerCase().includes(query)
    );
  }

  // Aplicar filtro de precio
  filteredProducts = filteredProducts.filter(
    (p) => p.precio >= priceRange[0] && p.precio <= priceRange[1]
  );

  // Aplicar ordenamiento
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.precio - b.precio;
      case 'price-high':
        return b.precio - a.precio;
      case 'name':
        return a.nombre.localeCompare(b.nombre);
      case 'featured':
      default:
        return 0; // Orden original
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Cargando peluches increíbles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <SEO 
        title={searchQuery ? `Resultados para "${searchQuery}"` : undefined}
        description={searchQuery 
          ? `Encuentra ${searchQuery} en nuestra tienda de peluches. Calidad premium, envíos a todo Chile.`
          : undefined
        }
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            generateWebSiteStructuredData(),
            generateOrganizationStructuredData(),
            ...(sortedProducts.length > 0 ? [generateItemListStructuredData(sortedProducts.slice(0, 12))] : []),
          ],
        }}
      />
      
      {/* Hero Banner - Enfocado en productos */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              🧸 Los peluches más tiernos de Chile
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              Calidad Premium • Envío Gratis a Lo Valledor • Descuentos Especiales
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <p className="text-2xl md:text-3xl font-bold text-white mb-2">
                🎁 ¡Gira la ruleta y gana hasta 15% de descuento!
              </p>
              <p className="text-white/90 mb-4">
                Válido para tu primera compra
              </p>
              {!localStorage.getItem('wheelUsed') && (
                <button
                  onClick={() => setShowWheel(true)}
                  className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-purple-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  🎡 ¡Girar Ruleta Ahora!
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Decoración de círculos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
      </div>

      {/* Barra de Beneficios */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🚚</span>
              <div className="text-left">
                <p className="font-bold text-sm">Envío a todo Chile</p>
                <p className="text-xs text-gray-600">Gratis en Lo Valledor</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">💎</span>
              <div className="text-left">
                <p className="font-bold text-sm">Calidad Premium</p>
                <p className="text-xs text-gray-600">Materiales de primera</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">💳</span>
              <div className="text-left">
                <p className="font-bold text-sm">Pago Seguro</p>
                <p className="text-xs text-gray-600">Stripe garantizado</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🎁</span>
              <div className="text-left">
                <p className="font-bold text-sm">Regalo Perfecto</p>
                <p className="text-xs text-gray-600">Para todas las edades</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Productos */}
      <div id="productos" className="container mx-auto px-4 py-12">
        {/* Título de sección */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            🎀 Nuestra Colección de Peluches
          </h2>
          <p className="text-gray-600">Productos seleccionados con la mejor calidad</p>
        </div>

        {/* Indicador de búsqueda activa */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-center gap-3 bg-purple-50 border-2 border-purple-200 rounded-2xl p-4">
            <span className="text-2xl">🔍</span>
            <p className="text-gray-700">
              Buscando: <span className="font-bold text-purple-600">"{searchQuery}"</span>
              {sortedProducts.length > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  ({sortedProducts.length} {sortedProducts.length === 1 ? 'resultado' : 'resultados'})
                </span>
              )}
            </p>
            <Link 
              to="/"
              className="ml-auto bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-700 transition"
            >
              ✕ Limpiar búsqueda
            </Link>
          </div>
        )}

        {/* Filtros Avanzados */}
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filtro de Precio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                💰 Rango de Precio
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Mín"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Máx"
                  />
                </div>
                <div className="text-xs text-gray-600 text-center">
                  ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} CLP
                </div>
              </div>
            </div>

            {/* Ordenar Por */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🔄 Ordenar Por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="featured">Destacados</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>

            {/* Botón Limpiar Filtros */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setPriceRange([0, 100000]);
                  setSortBy('featured');
                  setFilter('all');
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all shadow-md"
              >
                🔄 Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Contador de Resultados */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            Mostrando <span className="font-bold text-purple-600">{sortedProducts.length}</span> de <span className="font-bold">{products.length}</span> productos
          </div>
        </div>

        {/* Filtro de Categorías - Estilo Pills Moderno */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-md ${
                filter === cat
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg'
              }`}
            >
              {cat === 'all' ? '✨ Todos' : `🧸 ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Grid de Productos */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">
              {searchQuery ? '🔍' : '🧸'}
            </div>
            <p className="text-2xl text-gray-400 font-semibold">
              {searchQuery 
                ? `No se encontraron resultados para "${searchQuery}"`
                : 'No hay productos disponibles'
              }
            </p>
            <p className="text-gray-500 mt-2">
              {searchQuery 
                ? 'Intenta con otras palabras clave o revisa la ortografía'
                : '¡Pronto agregaremos más peluches increíbles!'
              }
            </p>
            {searchQuery && (
              <Link 
                to="/"
                className="mt-6 inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                Ver todos los productos
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}

        {/* Productos Vistos Recientemente */}
        {!searchQuery && <RecentlyViewed />}
      </div>

      {/* Footer con información */}
      <Footer />

      {/* Ruleta de Descuentos */}
      {showWheel && (
        <DiscountWheel
          onClose={() => setShowWheel(false)}
          onWin={handleWheelWin}
        />
      )}
    </div>
  );
};

export default HomePage;
