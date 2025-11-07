import Footer from '../components/Footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Política de Privacidad
          </h1>
          
          <p className="text-gray-600 mb-8">
            Última actualización: {new Date().toLocaleDateString('es-CL')}
          </p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">1. Introducción</h2>
              <p>
                En OsitosLua respetamos tu privacidad y estamos comprometidos a proteger tus datos personales. 
                Esta política de privacidad te informará sobre cómo cuidamos tus datos personales cuando 
                visitas nuestro sitio web y te informará sobre tus derechos de privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">2. Información que Recopilamos</h2>
              <div className="bg-purple-50 p-6 rounded-xl mb-4">
                <h3 className="font-bold mb-3">Datos Personales:</h3>
                <ul className="space-y-2">
                  <li>✅ Nombre completo</li>
                  <li>✅ Correo electrónico</li>
                  <li>✅ Dirección de envío</li>
                  <li>✅ Ciudad y región</li>
                  <li>✅ Código postal</li>
                  <li>✅ Historial de compras</li>
                </ul>
              </div>
              <div className="bg-pink-50 p-6 rounded-xl">
                <h3 className="font-bold mb-3">Datos Técnicos:</h3>
                <ul className="space-y-2">
                  <li>📊 Dirección IP</li>
                  <li>📊 Tipo de navegador</li>
                  <li>📊 Páginas visitadas</li>
                  <li>📊 Tiempo de navegación</li>
                  <li>📊 Cookies y tecnologías similares</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">3. Cómo Usamos tu Información</h2>
              <p className="mb-3">Utilizamos tu información personal para:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Procesar pedidos:</strong> Para completar tu compra y gestionar el envío</li>
                <li><strong>Comunicación:</strong> Enviarte confirmaciones de pedido y actualizaciones de estado</li>
                <li><strong>Soporte:</strong> Responder a tus consultas y resolver problemas</li>
                <li><strong>Mejora del servicio:</strong> Analizar el uso del sitio para mejorar tu experiencia</li>
                <li><strong>Marketing:</strong> Enviarte ofertas y promociones (solo con tu consentimiento)</li>
                <li><strong>Seguridad:</strong> Proteger contra fraudes y uso no autorizado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">4. Base Legal para el Procesamiento</h2>
              <p className="mb-3">Procesamos tus datos personales bajo las siguientes bases legales:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Ejecución de contrato:</strong> Para completar tu pedido</li>
                <li><strong>Consentimiento:</strong> Para marketing y comunicaciones promocionales</li>
                <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraude</li>
                <li><strong>Obligaciones legales:</strong> Para cumplir con requisitos fiscales y legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">5. Compartir Información</h2>
              <p className="mb-3">Podemos compartir tu información con:</p>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-bold">Proveedores de Servicios:</h4>
                  <ul className="list-disc list-inside mt-2">
                    <li>Stripe (procesamiento de pagos)</li>
                    <li>Servicios de envío y logística</li>
                    <li>Cloudinary (almacenamiento de imágenes)</li>
                    <li>Proveedores de email (Nodemailer/Gmail)</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  ⚠️ <strong>Nunca vendemos</strong> tu información personal a terceros para fines de marketing.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">6. Seguridad de Datos</h2>
              <div className="bg-green-50 p-6 rounded-xl">
                <p className="mb-3">Implementamos medidas de seguridad para proteger tus datos:</p>
                <ul className="space-y-2">
                  <li>🔒 Cifrado SSL/TLS para todas las comunicaciones</li>
                  <li>🔒 Almacenamiento seguro de contraseñas (hash + salt)</li>
                  <li>🔒 Tokens JWT para autenticación</li>
                  <li>🔒 Procesamiento de pagos mediante Stripe (PCI-DSS compliant)</li>
                  <li>🔒 Acceso restringido a datos personales</li>
                  <li>🔒 Monitoreo regular de seguridad</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">7. Retención de Datos</h2>
              <p className="mb-3">Conservamos tus datos personales durante:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Cuentas activas:</strong> Mientras tu cuenta esté activa</li>
                <li><strong>Historial de compras:</strong> 5 años para fines fiscales y legales</li>
                <li><strong>Marketing:</strong> Hasta que retires tu consentimiento</li>
                <li><strong>Logs técnicos:</strong> 12 meses máximo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">8. Tus Derechos</h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                <p className="mb-3 font-semibold">Tienes derecho a:</p>
                <ul className="space-y-2">
                  <li>📋 <strong>Acceso:</strong> Solicitar copia de tus datos personales</li>
                  <li>✏️ <strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                  <li>🗑️ <strong>Supresión:</strong> Solicitar eliminación de tus datos</li>
                  <li>⏸️ <strong>Restricción:</strong> Limitar el procesamiento de tus datos</li>
                  <li>📦 <strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                  <li>🚫 <strong>Oposición:</strong> Oponerte al procesamiento con fines de marketing</li>
                  <li>❌ <strong>Retirar consentimiento:</strong> En cualquier momento</li>
                </ul>
              </div>
              <p className="mt-4 text-sm">
                Para ejercer estos derechos, contáctanos en info@ositoslua.cl
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">9. Cookies</h2>
              <p className="mb-3">Utilizamos cookies para:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Mantener tu sesión iniciada</li>
                <li>Recordar tu carrito de compras</li>
                <li>Analizar el uso del sitio</li>
                <li>Personalizar tu experiencia</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar 
                la funcionalidad del sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">10. Transferencias Internacionales</h2>
              <p>
                Algunos de nuestros proveedores de servicios pueden estar ubicados fuera de Chile. 
                Nos aseguramos de que existan salvaguardias adecuadas para proteger tus datos 
                según los estándares internacionales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">11. Menores de Edad</h2>
              <p>
                Nuestro sitio no está dirigido a menores de 18 años. No recopilamos conscientemente 
                información personal de menores. Si eres padre/madre y crees que tu hijo nos ha 
                proporcionado información personal, contáctanos inmediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">12. Cambios a Esta Política</h2>
              <p>
                Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos 
                cualquier cambio significativo publicando la nueva política en esta página y 
                actualizando la fecha de "última actualización".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">13. Contacto</h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                <p className="mb-3 font-semibold">
                  Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos:
                </p>
                <ul className="space-y-2">
                  <li>📧 <strong>Email:</strong> info@ositoslua.cl</li>
                  <li>📍 <strong>Dirección:</strong> Santiago, Chile</li>
                  <li>💬 <strong>Formulario:</strong> Disponible en nuestra página de contacto</li>
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

export default PrivacyPage;
