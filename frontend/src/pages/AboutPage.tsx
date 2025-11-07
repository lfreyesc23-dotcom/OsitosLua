import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { generateLocalBusinessStructuredData, generateOrganizationStructuredData } from '../utils/structuredData';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <SEO
        title="Sobre Nosotros"
        description="Conoce la historia de OsitosLua, la tienda de peluches más querida de Chile. Calidad, ternura y envíos a todo el país."
        url="https://ositoslua.cl/about"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            generateLocalBusinessStructuredData(),
            generateOrganizationStructuredData(),
          ],
        }}
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Sobre OsitosLua
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-purple-100">
            Llevamos alegría y ternura a los hogares chilenos con los peluches más adorables
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Our Story */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">📖</span>
            <h2 className="text-3xl font-bold text-gray-800">Nuestra Historia</h2>
          </div>
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
            <p>
              OsitosLua nació de una pasión simple pero poderosa: hacer sonreír a las personas. 
              Creemos que un peluche no es solo un juguete, es un compañero, un regalo de amor, 
              un recuerdo que perdura en el tiempo.
            </p>
            <p>
              Comenzamos con una visión clara: traer a Chile los peluches más suaves, adorables 
              y de mayor calidad del mercado. Cada producto que ofrecemos ha sido cuidadosamente 
              seleccionado pensando en la felicidad de nuestros clientes.
            </p>
            <p>
              Hoy, somos orgullosos de ser parte de los momentos especiales de miles de familias 
              chilenas: cumpleaños, aniversarios, nacimientos, graduaciones, o simplemente un 
              "te quiero" expresado con suavidad.
            </p>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Mission */}
          <div className="bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🎯</span>
              <h2 className="text-3xl font-bold">Nuestra Misión</h2>
            </div>
            <p className="text-lg text-purple-100 leading-relaxed">
              Ofrecer peluches de calidad excepcional que traigan alegría y consuelo a personas 
              de todas las edades, con un servicio de excelencia y precios justos que lleguen a 
              todo Chile.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🌟</span>
              <h2 className="text-3xl font-bold">Nuestra Visión</h2>
            </div>
            <p className="text-lg text-blue-100 leading-relaxed">
              Ser la tienda de peluches más querida de Chile, reconocida por la calidad de 
              nuestros productos, la calidez de nuestro servicio y el impacto positivo que 
              generamos en cada entrega.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">💎</span>
            <h2 className="text-3xl font-bold text-gray-800">¿Por Qué Elegirnos?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-2xl">
                    ✨
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Calidad Premium</h3>
                  <p className="text-gray-600">
                    Seleccionamos cuidadosamente cada peluche para garantizar suavidad, 
                    durabilidad y seguridad certificada.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                    🚚
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Envíos a Todo Chile</h3>
                  <p className="text-gray-600">
                    Desde Arica a Punta Arenas. Envíos rápidos, seguros y con tarifas 
                    transparentes según tu ubicación.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    💳
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Pago 100% Seguro</h3>
                  <p className="text-gray-600">
                    Procesamos pagos con Stripe, la plataforma más confiable del mundo. 
                    Tus datos están protegidos.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-2xl">
                    💰
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Precios Justos</h3>
                  <p className="text-gray-600">
                    Calidad premium no significa precios exorbitantes. Trabajamos para 
                    ofrecerte el mejor valor.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                    🤝
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Atención Personalizada</h3>
                  <p className="text-gray-600">
                    Nuestro equipo está aquí para ayudarte. Respondemos rápido y con calidez 
                    a todas tus consultas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    🔄
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Devoluciones Fáciles</h3>
                  <p className="text-gray-600">
                    ¿No quedaste satisfecho? Aceptamos devoluciones dentro de 7 días. 
                    Tu satisfacción es nuestra prioridad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">❤️</span>
            <h2 className="text-3xl font-bold text-gray-800">Nuestros Valores</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-pink-50 to-white border border-pink-200">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Pasión</h3>
              <p className="text-gray-600">
                Amamos lo que hacemos y eso se refleja en cada detalle de nuestro servicio.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-purple-50 to-white border border-purple-200">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Excelencia</h3>
              <p className="text-gray-600">
                Buscamos constantemente mejorar y ofrecer la mejor experiencia posible.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-200">
              <div className="text-5xl mb-4">🤗</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Cercanía</h3>
              <p className="text-gray-600">
                Tratamos a cada cliente como parte de nuestra familia OsitosLua.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-pink-50 to-white border border-pink-200">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Integridad</h3>
              <p className="text-gray-600">
                Somos transparentes, honestos y cumplimos lo que prometemos.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-purple-50 to-white border border-purple-200">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Innovación</h3>
              <p className="text-gray-600">
                Incorporamos tecnología para hacer tu experiencia más fácil y agradable.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-200">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Responsabilidad</h3>
              <p className="text-gray-600">
                Nos preocupamos por el impacto social y ambiental de nuestro negocio.
              </p>
            </div>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🤲</span>
            <h2 className="text-3xl font-bold">Nuestro Compromiso</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Con Nuestros Clientes</h3>
              <ul className="space-y-2 text-purple-100">
                <li>✓ Productos de calidad certificada</li>
                <li>✓ Envíos rápidos y seguros</li>
                <li>✓ Precios transparentes sin sorpresas</li>
                <li>✓ Atención al cliente excepcional</li>
                <li>✓ Procesos de compra seguros</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Con la Comunidad</h3>
              <ul className="space-y-2 text-purple-100">
                <li>✓ Apoyamos el comercio local</li>
                <li>✓ Generamos empleo digno</li>
                <li>✓ Contribuimos al desarrollo social</li>
                <li>✓ Operamos con ética y transparencia</li>
                <li>✓ Cuidamos el medio ambiente</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes Preguntas?</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Estamos aquí para ayudarte. Contáctanos y con gusto resolveremos tus dudas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:from-pink-600 hover:to-purple-700 transition shadow-lg"
            >
              📧 Contáctanos
            </a>
            <a
              href="/faq"
              className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-bold hover:from-purple-600 hover:to-blue-600 transition shadow-lg"
            >
              ❓ Ver Preguntas Frecuentes
            </a>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
