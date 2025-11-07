import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { getWishlistCount } from '../utils/wishlist';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    // Actualizar contador de wishlist
    const updateWishlistCount = () => {
      setWishlistCount(getWishlistCount());
    };

    updateWishlistCount();

    // Escuchar cambios en localStorage
    window.addEventListener('storage', updateWishlistCount);
    
    // Polling cada 500ms para capturar cambios en la misma pestaña
    const interval = setInterval(updateWishlistCount, 500);

    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar con información de envío */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-center py-2 text-sm">
        🚚 <span className="font-semibold">Envío gratis</span> a Lo Valledor | Entregas a todo Chile 🇨🇱
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 gap-8">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            <span className="text-3xl">🧸</span>
            <span className="hidden md:block">OsitosLua</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden lg:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar peluches, animales, personajes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 pr-24 rounded-full border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-gray-700 placeholder-gray-400 transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all font-medium"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {/* Contact link */}
            <Link 
              to="/contact" 
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              <span className="text-xl">💬</span>
              <span className="hidden lg:inline">Contacto</span>
            </Link>

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="relative group"
            >
              <div className="flex items-center gap-2 text-gray-700 group-hover:text-pink-600 transition-colors">
                <div className="relative">
                  <FaHeart className="text-2xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline font-medium">Favoritos</span>
              </div>
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative group"
            >
              <div className="flex items-center gap-2 text-gray-700 group-hover:text-purple-600 transition-colors">
                <div className="relative">
                  <span className="text-2xl">🛒</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline font-medium">Carrito</span>
              </div>
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 px-4 py-2 rounded-full transition-all"
                >
                  <span className="text-xl">👤</span>
                  <span className="hidden lg:inline font-medium text-gray-700">
                    {user.nombre}
                  </span>
                  <span className="text-sm">▼</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.nombre}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span className="text-xl">📦</span>
                      <span className="text-gray-700 font-medium">Mis Órdenes</span>
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-100 my-2"></div>
                        <div className="px-4 py-2">
                          <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">Administrador</p>
                        </div>
                        
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="text-xl">📊</span>
                          <span className="text-gray-700 font-medium">Dashboard</span>
                        </Link>

                        <Link
                          to="/admin/products"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="text-xl">🧸</span>
                          <span className="text-gray-700 font-medium">Productos</span>
                        </Link>

                        <Link
                          to="/admin/orders"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="text-xl">📋</span>
                          <span className="text-gray-700 font-medium">Órdenes</span>
                        </Link>

                        <Link
                          to="/admin/reports"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="text-xl">📈</span>
                          <span className="text-gray-700 font-medium">Reportes</span>
                        </Link>

                        <Link
                          to="/admin/suggestions"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="text-xl">💬</span>
                          <span className="text-gray-700 font-medium">Sugerencias</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-2"></div>
                    
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <span className="text-xl">🚪</span>
                      <span className="text-red-600 font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="hidden md:inline-block text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-2xl text-gray-700"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="lg:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar peluches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-full border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-gray-700"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
          </div>
        </form>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-xl mr-2">🏠</span>
              Inicio
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-xl mr-2">💬</span>
              Contacto
            </Link>
            {!user && (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl mr-2">🔑</span>
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
