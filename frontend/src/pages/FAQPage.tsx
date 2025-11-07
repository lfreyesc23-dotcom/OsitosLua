import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { generateFAQStructuredData } from '../utils/structuredData';

const FAQPage = () => {
  const faqs = [
    {
      category: "Pedidos y Compras",
      icon: "🛒",
      questions: [
        {
          q: "¿Cómo puedo realizar un pedido?",
          a: "Puedes comprar como usuario registrado o como invitado. Simplemente agrega productos al carrito, completa tus datos de envío y procede al pago con tarjeta a través de Stripe."
        },
        {
          q: "¿Qué métodos de pago aceptan?",
          a: "Aceptamos todas las tarjetas de crédito y débito a través de Stripe (Visa, Mastercard, American Express). El pago es 100% seguro y cifrado."
        },
        {
          q: "¿Puedo comprar sin registrarme?",
          a: "Sí, ofrecemos checkout como invitado. Sin embargo, si te registras podrás ver tu historial de compras y hacer seguimiento de tus pedidos."
        },
        {
          q: "¿Recibiré confirmación de mi pedido?",
          a: "Sí, recibirás un email de confirmación inmediatamente después de completar tu compra con todos los detalles de tu pedido."
        }
      ]
    },
    {
      category: "Envíos y Entregas",
      icon: "🚚",
      questions: [
        {
          q: "¿Cuánto cuesta el envío?",
          a: "Los costos varían según la ubicación:\n• Gratis en Lo Valledor\n• $2.000 en La Cisterna\n• $5.000 en Santiago\n• $8.000 en Regiones"
        },
        {
          q: "¿Cuánto demora la entrega?",
          a: "En Santiago: 2-4 días hábiles. En Regiones: 5-7 días hábiles. Los tiempos pueden variar según disponibilidad y ubicación exacta."
        },
        {
          q: "¿Hacen envíos a todo Chile?",
          a: "Sí, realizamos envíos a todas las regiones de Chile. Calculamos automáticamente el costo de envío según tu ubicación."
        },
        {
          q: "¿Puedo hacer seguimiento de mi envío?",
          a: "Sí, puedes ver el estado de tu pedido en la sección 'Mis Órdenes' de tu cuenta. Te notificaremos por email cuando tu pedido cambie de estado."
        },
        {
          q: "¿Qué hago si no estoy en casa al momento de la entrega?",
          a: "El courier intentará entregar hasta 3 veces. Si no estás, dejará un aviso para coordinar una nueva entrega o retiro en oficina."
        }
      ]
    },
    {
      category: "Productos",
      icon: "🧸",
      questions: [
        {
          q: "¿Los productos son de buena calidad?",
          a: "Sí, todos nuestros peluches son de calidad premium. Seleccionamos cuidadosamente cada producto para garantizar suavidad, durabilidad y seguridad."
        },
        {
          q: "¿Las imágenes son reales?",
          a: "Las imágenes son referenciales. El producto puede variar ligeramente en color o textura debido a las condiciones de fotografía y pantalla."
        },
        {
          q: "¿Tienen stock disponible?",
          a: "Verificamos el stock en tiempo real. Si puedes agregar un producto al carrito, significa que está disponible. Te notificaremos si hay algún problema."
        },
        {
          q: "¿Puedo ver el producto antes de comprarlo?",
          a: "Contamos con punto de retiro en Lo Valledor donde puedes ver algunos productos. Contáctanos para coordinar."
        }
      ]
    },
    {
      category: "Devoluciones y Cambios",
      icon: "🔄",
      questions: [
        {
          q: "¿Puedo devolver un producto?",
          a: "Sí, aceptamos devoluciones dentro de los 7 días corridos desde la recepción. El producto debe estar en su empaque original y sin uso."
        },
        {
          q: "¿Cómo inicio una devolución?",
          a: "Contáctanos por email (info@ositoslua.cl) o través del formulario de contacto con tu número de orden. Te guiaremos en el proceso."
        },
        {
          q: "¿Quién paga el envío de devolución?",
          a: "El costo de envío de devolución es por cuenta del cliente, excepto si el producto llegó defectuoso o incorrecto."
        },
        {
          q: "¿Cuándo recibiré mi reembolso?",
          a: "Una vez recibido y verificado el producto devuelto, procesamos el reembolso en 5-10 días hábiles a tu método de pago original."
        },
        {
          q: "¿Hacen cambios de producto?",
          a: "Sí, si prefieres un cambio en lugar de devolución, podemos coordinarlo. Contacta a nuestro equipo para más detalles."
        }
      ]
    },
    {
      category: "Cuenta y Seguridad",
      icon: "🔐",
      questions: [
        {
          q: "¿Es seguro comprar en OsitosLua?",
          a: "Absolutamente. Usamos Stripe para pagos (certificado PCI-DSS), conexión SSL cifrada, y nunca almacenamos datos de tarjetas en nuestros servidores."
        },
        {
          q: "¿Cómo creo una cuenta?",
          a: "Haz clic en 'Registrarse' en el menú, completa tu email, nombre y contraseña. ¡Es rápido y gratuito!"
        },
        {
          q: "¿Olvidé mi contraseña, qué hago?",
          a: "Contáctanos en info@ositoslua.cl y te ayudaremos a recuperar el acceso a tu cuenta."
        },
        {
          q: "¿Puedo cambiar mis datos de cuenta?",
          a: "Sí, puedes actualizar tu información personal contactándonos. Estamos trabajando en una función de edición automática."
        }
      ]
    },
    {
      category: "Otros",
      icon: "❓",
      questions: [
        {
          q: "¿Tienen tienda física?",
          a: "Tenemos punto de retiro en Lo Valledor con envío gratis. Contáctanos para coordinar el retiro de tu pedido."
        },
        {
          q: "¿Ofrecen descuentos o promociones?",
          a: "Sí, ocasionalmente tenemos ofertas especiales. Regístrate para recibir notificaciones de nuestras promociones."
        },
        {
          q: "¿Puedo comprar al por mayor?",
          a: "Sí, ofrecemos precios especiales para compras al por mayor. Contáctanos directamente para cotizar."
        },
        {
          q: "¿Cómo puedo contactarlos?",
          a: "Puedes escribirnos a info@ositoslua.cl, usar nuestro formulario de contacto, o encontrarnos en nuestras redes sociales."
        },
        {
          q: "¿Hacen envoltorio para regalo?",
          a: "Actualmente no ofrecemos este servicio, pero nuestros peluches vienen en empaque protector. Contáctanos si necesitas algo especial."
        }
      ]
    }
  ];

  // Aplanar todas las preguntas para structured data
  const allQuestions = faqs.flatMap(category => 
    category.questions.map(q => ({
      question: q.q,
      answer: q.a
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12">
      <SEO
        title="Preguntas Frecuentes"
        description="Todas las respuestas sobre pedidos, envíos, devoluciones y más. Compra peluches con confianza en OsitosLua."
        url="https://ositoslua.cl/faq"
        structuredData={generateFAQStructuredData(allQuestions)}
      />
      
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-gray-600">
            Todo lo que necesitas saber sobre OsitosLua
          </p>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl p-8 mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">¿No encuentras tu respuesta?</h3>
              <p className="text-purple-100">
                Nuestro equipo está aquí para ayudarte. Contáctanos directamente.
              </p>
            </div>
            <a
              href="/contact"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg whitespace-nowrap"
            >
              📧 Contáctanos
            </a>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  {section.category}
                </h2>
              </div>

              {/* Questions */}
              <div className="p-6 space-y-6">
                {section.questions.map((faq, qIdx) => (
                  <div key={qIdx} className="border-l-4 border-purple-500 pl-6 py-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-4">¿Listo para comprar?</h3>
          <p className="text-gray-600 mb-6">
            Explora nuestra colección de peluches adorables
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:from-pink-600 hover:to-purple-700 transition shadow-lg"
          >
            Ver Productos
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQPage;
