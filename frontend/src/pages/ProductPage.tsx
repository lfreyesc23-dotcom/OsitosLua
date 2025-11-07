import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../contexts/CartContext';
import { showSuccess, showError } from '../utils/notifications';
import { addToRecentlyViewed } from '../utils/recentlyViewed';
import SEO from '../components/SEO';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import ShareButtons from '../components/ShareButtons';
import { trackProductView, trackAddToCart } from '../utils/analytics';
import { generateProductStructuredData, generateBreadcrumbStructuredData } from '../utils/structuredData';

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenes: string[];
  categoria: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      
      // Trackear vista de producto
      trackProductView({
        id: response.data.id,
        nombre: response.data.nombre,
        precio: response.data.precio,
        categoria: response.data.categoria,
      });
      
      // Agregar a productos vistos recientemente
      addToRecentlyViewed({
        id: response.data.id,
        nombre: response.data.nombre,
        precio: response.data.precio,
        imagenes: response.data.imagenes
      });
      
      // Cargar productos relacionados de la misma categoría
      fetchRelatedProducts(response.data.categoria, response.data.id);
      
      // Cargar reviews para structured data
      fetchReviews(response.data.id);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al cargar el producto';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoria: string, productId: string) => {
    try {
      const response = await api.get('/products');
      const filtered = response.data
        .filter((p: Product) => p.categoria === categoria && p.id !== productId)
        .slice(0, 4); // Máximo 4 productos relacionados
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error cargando productos relacionados:', error);
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error cargando reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, cantidad);
      
      // Trackear agregar al carrito
      trackAddToCart(
        {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          categoria: product.categoria,
        },
        cantidad
      );
      
      showSuccess(`${cantidad} ${cantidad === 1 ? 'producto agregado' : 'productos agregados'} al carrito`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-purple-600 font-semibold">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-8xl mb-4 block">😢</span>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o fue eliminado</p>
          <Link 
            to="/" 
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.precio > 10000;
  const discountPercentage = hasDiscount ? 25 : 0;
  const originalPrice = hasDiscount ? Math.floor(product.precio * 1.33) : product.precio;

  // Generar structured data para el producto
  const productStructuredData = generateProductStructuredData(product, reviews);
  
  // Generar breadcrumb structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Inicio', url: 'https://ositoslua.cl' },
    { name: product.categoria, url: 'https://ositoslua.cl' },
    { name: product.nombre, url: `https://ositoslua.cl/product/${product.id}` },
  ]);

  // Combinar ambos structured data en un array
  const combinedStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [productStructuredData, breadcrumbStructuredData],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <SEO
        title={product.nombre}
        description={product.descripcion}
        keywords={`${product.nombre}, ${product.categoria}, peluche, comprar peluche, ${product.nombre} chile`}
        image={product.imagenes[0]}
        url={`https://ositoslua.cl/product/${product.id}`}
        type="product"
        structuredData={combinedStructuredData}
      />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-purple-600 transition">Inicio</Link>
          <span>›</span>
          <Link to="/" className="hover:text-purple-600 transition">{product.categoria}</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">{product.nombre}</span>
        </div>

        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition"
        >
          <span className="text-xl">←</span>
          <span>Volver</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div 
              className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden aspect-square cursor-zoom-in group"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={product.imagenes[selectedImage] || 'https://via.placeholder.com/600'}
                alt={`${product.nombre} - Vista principal del producto`}
                loading="eager"
                decoding="async"
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'group-hover:scale-110'
                }`}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    -{discountPercentage}% OFF
                  </span>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ¡Solo {product.stock} disponibles!
                  </span>
                )}
              </div>

              {/* Zoom indicator */}
              {!isZoomed && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-2 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  🔍 Click para ampliar
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {product.imagenes.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.imagenes.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setIsZoomed(false);
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border-3 transition-all ${
                      selectedImage === index
                        ? 'border-purple-600 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-purple-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.nombre} - Imagen ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-800 text-sm">Calidad Premium</p>
                  <p className="text-xs text-green-600">Productos seleccionados</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-semibold text-blue-800 text-sm">Envío Rápido</p>
                  <p className="text-xs text-blue-600">A todo Chile</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Categoría */}
            <div>
              <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                {product.categoria}
              </span>
            </div>

            {/* Nombre */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {product.nombre}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <span className="text-gray-600">
                ({Math.floor(Math.random() * 500) + 50} reseñas)
              </span>
            </div>

            {/* Precio */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  {formatPrice(product.precio)}
                </span>
                {hasDiscount && (
                  <span className="text-2xl text-gray-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-green-600 font-semibold">
                  ¡Ahorra {formatPrice(originalPrice - product.precio)}!
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.descripcion}
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Disponibilidad:</span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-2 text-green-600 font-bold">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  {product.stock} unidades en stock
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-600 font-bold">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  Agotado
                </span>
              )}
            </div>

            {/* Cantidad y Agregar al carrito */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-700 text-lg">Cantidad:</span>
                  <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="px-6 py-3 hover:bg-gray-200 transition-colors font-bold text-xl"
                    >
                      -
                    </button>
                    <span className="px-8 py-3 font-bold text-xl bg-white">
                      {cantidad}
                    </span>
                    <button
                      onClick={() => setCantidad(Math.min(product.stock, cantidad + 1))}
                      className="px-6 py-3 hover:bg-gray-200 transition-colors font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-500">
                    (máx. {product.stock})
                  </span>
                </div>

                <button 
                  onClick={handleAddToCart} 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-5 rounded-2xl text-xl font-bold hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">🛒</span>
                  <span>Agregar al carrito</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to="/cart"
                    className="text-center border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all"
                  >
                    Ver carrito
                  </Link>
                  <button className="border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                    ❤️ Favoritos
                  </button>
                </div>
              </div>
            )}

            {product.stock === 0 && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl text-center font-semibold">
                <span className="text-2xl block mb-2">😢</span>
                Producto agotado - Será reabastecido pronto
              </div>
            )}

            {/* Características adicionales */}
            <div className="border-t pt-6 space-y-3">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Características</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🧸</span>
                  <span className="text-gray-700">Material: Peluche suave y resistente</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✨</span>
                  <span className="text-gray-700">Calidad: Premium certificada</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎁</span>
                  <span className="text-gray-700">Perfecto para regalo</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏠</span>
                  <span className="text-gray-700">Decoración única y adorable</span>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="mt-6">
              <ShareButtons
                url={`https://ositoslua.cl/product/${product.id}`}
                title={product.nombre}
                description={product.descripcion}
                image={product.imagenes[0]}
              />
            </div>
          </div>
        </div>

        {/* Sección de opiniones simulada */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Opiniones de Clientes</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'María González', rating: 5, comment: '¡Hermoso peluche! Llegó en perfecto estado y es súper suave. Lo recomiendo 100%' },
              { name: 'Carlos Pérez', rating: 5, comment: 'Excelente calidad, mejor de lo que esperaba. Mi hija está encantada.' },
              { name: 'Andrea Silva', rating: 4, comment: 'Muy lindo, el envío fue rápido. Solo le falta un poco más de relleno.' },
              { name: 'José Ramírez', rating: 5, comment: 'Perfecto para decorar mi habitación. El tamaño es ideal y los colores son vibrantes.' },
            ].map((review, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-800">{review.name}</span>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Reviews */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Opiniones de clientes
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulario para dejar review */}
            <div className="lg:col-span-1">
              <ReviewForm 
                productId={product.id} 
                onReviewSubmitted={() => {
                  // Forzar recarga de reviews actualizando el key del componente
                  window.location.reload();
                }} 
              />
            </div>

            {/* Lista de reviews */}
            <div className="lg:col-span-2">
              <ReviewList productId={product.id} />
            </div>
          </div>
        </div>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              También te puede interesar
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={relatedProduct.imagenes[0] || 'https://via.placeholder.com/300'}
                        alt={`${relatedProduct.nombre} - Producto relacionado`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                        {relatedProduct.nombre}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {formatPrice(relatedProduct.precio)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Stock: {relatedProduct.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
