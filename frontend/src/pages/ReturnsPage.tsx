import Footer from '../components/Footer';

const ReturnsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Política de Devoluciones y Reembolsos
          </h1>
          <p className="text-xl text-gray-600">
            Tu satisfacción es nuestra prioridad
          </p>
        </div>

        {/* Quick Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-3xl p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            Resumen Rápido
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
              <div className="text-3xl mb-2">📅</div>
              <div className="font-bold mb-1">7 Días</div>
              <div className="text-sm text-blue-100">Para solicitar devolución</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-bold mb-1">100% Reembolso</div>
              <div className="text-sm text-blue-100">Si el producto es defectuoso</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
              <div className="text-3xl mb-2">📦</div>
              <div className="font-bold mb-1">Empaque Original</div>
              <div className="text-sm text-blue-100">Producto sin uso</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 1: General Policy */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Política General de Devoluciones
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                En <strong>OsitosLua</strong> queremos que estés completamente satisfecho con tu compra. 
                Si por alguna razón no estás conforme con tu producto, aceptamos devoluciones dentro de 
                los <strong>7 días corridos</strong> desde la fecha de recepción.
              </p>
              <p>
                Nuestro objetivo es hacer el proceso de devolución lo más simple y transparente posible, 
                siempre velando por tu satisfacción y la calidad de nuestro servicio.
              </p>
            </div>
          </div>

          {/* Section 2: Conditions */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">✅</span>
              Condiciones para Devoluciones
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-bold text-gray-800 mb-2">1. Plazo</h3>
                <p className="text-gray-600">
                  Debes solicitar la devolución dentro de los <strong>7 días corridos</strong> desde 
                  que recibiste el producto. Contáctanos inmediatamente si hay algún problema.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="font-bold text-gray-800 mb-2">2. Estado del Producto</h3>
                <p className="text-gray-600">
                  El peluche debe estar <strong>sin uso</strong>, en perfectas condiciones, con todas 
                  sus etiquetas originales y en su <strong>empaque original</strong>. Productos usados, 
                  lavados o sin empaque no serán aceptados para devolución.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-bold text-gray-800 mb-2">3. Comprobante de Compra</h3>
                <p className="text-gray-600">
                  Necesitarás tu <strong>número de orden</strong> o el email de confirmación de compra 
                  para procesar la devolución.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="font-bold text-gray-800 mb-2">4. Embalaje Protector</h3>
                <p className="text-gray-600">
                  Al devolver el producto, empácalo de manera segura para evitar daños durante el 
                  transporte. Recomendamos usar el mismo empaque en que lo recibiste.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Process */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">🔄</span>
              Proceso de Devolución
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Contáctanos</h3>
                  <p className="text-gray-600">
                    Envía un email a <a href="mailto:info@ositoslua.cl" className="text-blue-600 hover:underline">info@ositoslua.cl</a> o 
                    usa nuestro <a href="/contact" className="text-blue-600 hover:underline">formulario de contacto</a> indicando:
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-gray-600 space-y-1">
                    <li>Número de orden</li>
                    <li>Motivo de la devolución</li>
                    <li>Fotos del producto (si aplica)</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Aprobación</h3>
                  <p className="text-gray-600">
                    Nuestro equipo revisará tu solicitud dentro de <strong>24-48 horas</strong> y te 
                    enviaremos instrucciones detalladas para la devolución.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Envío del Producto</h3>
                  <p className="text-gray-600">
                    Envía el producto a la dirección que te indicaremos. Guarda el comprobante de 
                    envío como respaldo. El costo del envío de devolución es por cuenta del cliente 
                    (excepto en casos de defecto o error de nuestra parte).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Inspección</h3>
                  <p className="text-gray-600">
                    Una vez recibido el producto, nuestro equipo verificará que cumpla con las 
                    condiciones de devolución (sin uso, empaque original, etiquetas).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Reembolso</h3>
                  <p className="text-gray-600">
                    Si todo está en orden, procesaremos el reembolso dentro de <strong>5-10 días hábiles</strong> al 
                    método de pago original (tarjeta de crédito/débito).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Refund Info */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">💳</span>
              Información sobre Reembolsos
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold mb-2 text-blue-900">Método de Reembolso</h3>
                <p className="text-blue-800">
                  El reembolso se realizará al <strong>mismo método de pago</strong> utilizado en la compra 
                  original. Si pagaste con tarjeta, el monto aparecerá en tu estado de cuenta.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="font-bold mb-2 text-purple-900">Tiempo de Procesamiento</h3>
                <p className="text-purple-800">
                  Una vez aprobada la devolución, el reembolso tarda <strong>5-10 días hábiles</strong> en 
                  reflejarse. Los tiempos pueden variar según tu banco o institución financiera.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold mb-2 text-blue-900">Monto del Reembolso</h3>
                <p className="text-blue-800">
                  Reembolsaremos el <strong>valor total del producto</strong>. El costo de envío original 
                  <strong> NO es reembolsable</strong>, excepto en casos de producto defectuoso o error de 
                  nuestra parte.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Special Cases */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              Casos Especiales
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-xl">
                <h3 className="font-bold text-gray-800 mb-2">Producto Defectuoso o Dañado</h3>
                <p className="text-gray-600">
                  Si recibiste un producto con defectos de fabricación o dañado durante el envío, 
                  contáctanos <strong>inmediatamente</strong>. En estos casos:
                </p>
                <ul className="mt-2 ml-6 list-disc text-gray-600 space-y-1">
                  <li>Cubrimos el 100% del costo de envío de devolución</li>
                  <li>Reembolsamos el valor total del producto + costo de envío original</li>
                  <li>Ofrecemos reemplazo gratuito si prefieres</li>
                  <li>Proceso prioritario en 24-48 horas</li>
                </ul>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 rounded-r-xl">
                <h3 className="font-bold text-gray-800 mb-2">Producto Incorrecto</h3>
                <p className="text-gray-600">
                  Si recibiste un producto diferente al que ordenaste:
                </p>
                <ul className="mt-2 ml-6 list-disc text-gray-600 space-y-1">
                  <li>Contáctanos de inmediato con fotos del producto</li>
                  <li>Enviaremos el producto correcto sin costo adicional</li>
                  <li>Organizaremos el retiro del producto incorrecto sin costo para ti</li>
                  <li>Recibirás compensación por la molestia</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r-xl">
                <h3 className="font-bold text-gray-800 mb-2">Productos No Elegibles para Devolución</h3>
                <p className="text-gray-600">
                  No aceptamos devoluciones en los siguientes casos:
                </p>
                <ul className="mt-2 ml-6 list-disc text-gray-600 space-y-1">
                  <li>Productos usados, lavados o con señales de uso</li>
                  <li>Productos sin empaque original o etiquetas</li>
                  <li>Productos personalizados o hechos por encargo</li>
                  <li>Después del plazo de 7 días corridos</li>
                  <li>Productos en promoción o liquidación (salvo defecto)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 6: Exchanges */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">🔁</span>
              Cambios de Producto
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Si prefieres <strong>cambiar tu producto</strong> por otro en lugar de solicitar un reembolso, 
                podemos coordinarlo. El proceso es similar:
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-purple-200">
                <ol className="space-y-3 ml-4 list-decimal">
                  <li>Contáctanos indicando el producto que quieres cambiar y por cuál</li>
                  <li>Verificaremos disponibilidad del nuevo producto</li>
                  <li>Si hay diferencia de precio, te indicaremos cómo proceder</li>
                  <li>Enviamos el nuevo producto y coordinamos retiro del anterior</li>
                  <li>En caso de diferencia favorable, reembolsamos el saldo</li>
                </ol>
              </div>
              <p className="text-sm text-gray-600 italic">
                * El cambio está sujeto a disponibilidad de stock. El costo de envío del cambio 
                puede aplicar según el caso.
              </p>
            </div>
          </div>

          {/* Section 7: Contact */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">📞</span>
              ¿Necesitas Ayuda con una Devolución?
            </h2>
            <p className="mb-6 text-purple-100">
              Nuestro equipo está aquí para ayudarte en cada paso del proceso. No dudes en contactarnos:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="font-bold mb-2">📧 Email</div>
                <a href="mailto:info@ositoslua.cl" className="text-white hover:underline">
                  info@ositoslua.cl
                </a>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="font-bold mb-2">📋 Formulario</div>
                <a href="/contact" className="text-white hover:underline">
                  Formulario de Contacto
                </a>
              </div>
            </div>
            <div className="mt-6 bg-white/20 backdrop-blur rounded-xl p-4">
              <p className="text-sm">
                <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM<br />
                <strong>Tiempo de respuesta:</strong> 24-48 horas hábiles
              </p>
            </div>
          </div>

          {/* Section 8: Important Notes */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">📌</span>
              Notas Importantes
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">•</span>
                <p>
                  Esta política de devoluciones cumple con la <strong>Ley del Consumidor de Chile</strong> 
                  (Ley N° 19.496).
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">•</span>
                <p>
                  OsitosLua se reserva el derecho de rechazar devoluciones que no cumplan con las 
                  condiciones establecidas.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">•</span>
                <p>
                  Los plazos indicados son aproximados y pueden variar según circunstancias externas 
                  (bancos, courier, etc.).
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">•</span>
                <p>
                  Esta política puede ser actualizada sin previo aviso. Siempre revisa la versión 
                  más reciente en nuestro sitio web.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">•</span>
                <p>
                  Para situaciones no contempladas en esta política, contacta directamente a nuestro 
                  equipo de servicio al cliente.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">¿Listo para Comprar con Confianza?</h3>
            <p className="text-gray-600 mb-6">
              Ahora que conoces nuestra política, explora nuestros productos
            </p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition shadow-lg"
            >
              Ver Catálogo
            </a>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Última actualización: Enero 2025</p>
          <p className="mt-2">
            <a href="/terms" className="text-blue-600 hover:underline">Términos y Condiciones</a> • 
            <a href="/privacy" className="text-blue-600 hover:underline ml-2">Política de Privacidad</a>
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ReturnsPage;
