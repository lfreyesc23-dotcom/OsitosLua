import Footer from '../components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Términos y Condiciones
          </h1>
          
          <p className="text-gray-600 mb-8">
            Última actualización: {new Date().toLocaleDateString('es-CL')}
          </p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">1. Aceptación de Términos</h2>
              <p>
                Al acceder y utilizar OsitosLua, aceptas cumplir con estos términos y condiciones. 
                Si no estás de acuerdo con alguno de estos términos, por favor no utilices nuestro sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">2. Productos y Precios</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Todos los precios están expresados en pesos chilenos (CLP)</li>
                <li>Los precios incluyen IVA</li>
                <li>Nos reservamos el derecho de modificar precios sin previo aviso</li>
                <li>Las imágenes son referenciales y pueden variar del producto real</li>
                <li>Verificamos la disponibilidad de stock antes de confirmar tu pedido</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">3. Proceso de Compra</h2>
              <p className="mb-3">Para realizar una compra en OsitosLua:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Puedes comprar como usuario registrado o como invitado</li>
                <li>Debes proporcionar información de contacto y envío válida</li>
                <li>El pago se procesa de forma segura a través de Stripe</li>
                <li>Recibirás un correo de confirmación una vez completada la compra</li>
                <li>Tu pedido será procesado dentro de 24-48 horas hábiles</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">4. Envíos y Entregas</h2>
              <div className="bg-purple-50 p-6 rounded-xl mb-4">
                <h3 className="font-bold mb-3">Costos de Envío:</h3>
                <ul className="space-y-2">
                  <li>🎁 <strong>Gratis</strong> - Lo Valledor</li>
                  <li>🚚 <strong>$2.000</strong> - La Cisterna</li>
                  <li>📦 <strong>$5.000</strong> - Santiago</li>
                  <li>🌎 <strong>$8.000</strong> - Regiones</li>
                </ul>
              </div>
              <p className="mb-3">Tiempos de entrega:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Santiago: 2-4 días hábiles</li>
                <li>Regiones: 5-7 días hábiles</li>
                <li>Los tiempos pueden variar según disponibilidad</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">5. Política de Devoluciones</h2>
              <p className="mb-3">Aceptamos devoluciones bajo las siguientes condiciones:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Tienes 7 días corridos desde la recepción del producto</li>
                <li>El producto debe estar en su empaque original y sin uso</li>
                <li>Debes conservar el comprobante de compra</li>
                <li>El costo de envío de devolución corre por cuenta del cliente (excepto en caso de producto defectuoso)</li>
                <li>El reembolso se procesará dentro de 5-10 días hábiles</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                Para iniciar una devolución, contáctanos a través de nuestro formulario de contacto o 
                escríbenos a info@ositoslua.cl
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">6. Garantía de Productos</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Garantizamos la calidad de todos nuestros peluches</li>
                <li>Si recibes un producto defectuoso, lo reemplazaremos sin costo</li>
                <li>Debes reportar cualquier defecto dentro de las primeras 48 horas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">7. Uso del Sitio</h2>
              <p className="mb-3">Al usar OsitosLua, te comprometes a:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Proporcionar información verdadera y actualizada</li>
                <li>No realizar actividades fraudulentas</li>
                <li>No intentar vulnerar la seguridad del sitio</li>
                <li>Respetar los derechos de propiedad intelectual</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">8. Privacidad de Datos</h2>
              <p>
                Tu privacidad es importante para nosotros. Consulta nuestra{' '}
                <a href="/privacy" className="text-purple-600 hover:underline font-semibold">
                  Política de Privacidad
                </a>{' '}
                para conocer cómo manejamos tu información personal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">9. Limitación de Responsabilidad</h2>
              <p>
                OsitosLua no se hace responsable por daños indirectos, incidentales o consecuentes 
                derivados del uso de nuestros productos o servicios. Nuestra responsabilidad máxima 
                está limitada al valor del producto adquirido.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">10. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios serán efectivos inmediatamente después de su publicación en el sitio. 
                Es tu responsabilidad revisar periódicamente estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">11. Contacto</h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                <p className="mb-2">Si tienes preguntas sobre estos términos, contáctanos:</p>
                <ul className="space-y-2">
                  <li>📧 Email: info@ositoslua.cl</li>
                  <li>📍 Santiago, Chile</li>
                  <li>💬 Formulario de contacto en nuestro sitio</li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default TermsPage;
