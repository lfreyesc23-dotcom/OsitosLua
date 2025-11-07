import { Link } from 'react-router-dom';
import NewsletterSignup from './NewsletterSignup';

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="mb-12">
          <NewsletterSignup />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-xl mb-4">🧸 OsitosLua</h3>
            <p className="text-purple-200">
              Ofrecemos los mejores peluches con la más alta calidad y los mejores precios en Chile.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xl mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-purple-200 hover:text-pink-300 transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-purple-200 hover:text-pink-300 transition">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-purple-200 hover:text-pink-300 transition">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-purple-200 hover:text-pink-300 transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-xl mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-purple-200 hover:text-pink-300 transition">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-purple-200 hover:text-pink-300 transition">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-purple-200 hover:text-pink-300 transition">
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="font-bold text-xl mb-4">⚡ Envíos</h3>
            <p className="text-purple-200">🎁 Gratis en Lo Valledor</p>
            <p className="text-purple-200">🚚 $2.000 La Cisterna</p>
            <p className="text-purple-200">📦 $5.000 Santiago</p>
            <p className="text-purple-200">🌎 $8.000 Regiones</p>
            <div className="mt-4">
              <p className="text-purple-200 text-sm">📧 info@ositoslua.cl</p>
              <p className="text-purple-200 text-sm">📍 Santiago, Chile</p>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-700 mt-8 pt-8 text-center text-purple-300">
          <p>© 2024 OsitosLua. Todos los derechos reservados. 🧸💕</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
