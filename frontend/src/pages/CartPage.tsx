import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { showSuccess, showError, showWarning } from '../utils/notifications';
import { trackBeginCheckout } from '../utils/analytics';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { calculateShippingCost } from '../utils/geocoding';
import RutInput from '../components/RutInput';
import { validateRut, cleanRut } from '../utils/rut';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  
  // Evitar warning de variable no usada
  if (showShippingForm) { /* form visible */ }
  
  // Datos del formulario de envío
  const [shippingData, setShippingData] = useState({
    esInvitado: !user,
    nombreInvitado: '',
    emailInvitado: '',
    rutInvitado: '',
    direccion: '',
    ciudad: '',
    region: 'Región Metropolitana',
    codigoPostal: '',
  });
  
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [mensajeEnvio, setMensajeEnvio] = useState('');
  const [calculandoEnvio, setCalculandoEnvio] = useState(false);
  
  // Cupón
  const [codigoCupon, setCodigoCupon] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState<any>(null);
  const [validandoCupon, setValidandoCupon] = useState(false);

  // Verificar si hay cupón de ruleta al cargar
  useEffect(() => {
    const wheelDiscount = localStorage.getItem('wheelDiscount');
    if (wheelDiscount && !cuponAplicado) {
      try {
        const discount = JSON.parse(wheelDiscount);
        const expiresAt = new Date(discount.expiresAt);
        
        // Verificar si no ha expirado
        if (expiresAt > new Date()) {
          setCodigoCupon(discount.code);
          showSuccess(`🎉 Tienes un cupón de ${discount.discount}% de la ruleta disponible!`);
        } else {
          // Limpiar cupón expirado
          localStorage.removeItem('wheelDiscount');
        }
      } catch (error) {
        console.error('Error leyendo cupón de ruleta:', error);
      }
    }
  }, [cuponAplicado]);

  const calcularEnvio = async () => {
    if (!shippingData.direccion || !shippingData.ciudad) {
      showWarning('Por favor completa la dirección y comuna');
      return;
    }

    try {
      setCalculandoEnvio(true);
      
      // Usar el nuevo sistema de geolocalización
      const result = await calculateShippingCost(
        shippingData.direccion,
        shippingData.ciudad
      );
      
      setCostoEnvio(result.costo);
      setMensajeEnvio(result.mensaje);
      
      if (result.costo > 0) {
        showSuccess(`Costo de envío: $${result.costo.toLocaleString('es-CL')}`);
      } else {
        showWarning(result.mensaje);
      }
    } catch (error: any) {
      const message = error?.message || 'Error al calcular envío';
      showError(message);
    } finally {
      setCalculandoEnvio(false);
    }
  };

  // Función auxiliar para actualizar dirección desde el autocompletado
  const handleAddressSelect = (_lat: number, _lon: number, comuna: string, postalCode?: string) => {
    setShippingData(prev => ({
      ...prev,
      ciudad: comuna,
      codigoPostal: postalCode || prev.codigoPostal
    }));
    
    // Calcular envío automáticamente
    setTimeout(() => {
      calculateShippingCost(shippingData.direccion, comuna).then(result => {
        setCostoEnvio(result.costo);
        setMensajeEnvio(result.mensaje);
        if (result.costo > 0) {
          showSuccess(`Costo de envío: $${result.costo.toLocaleString('es-CL')}`);
        }
      });
    }, 100);
  };

  const validarCupon = async () => {
    if (!codigoCupon.trim()) {
      showWarning('Ingresa un código de cupón');
      return;
    }

    setValidandoCupon(true);
    try {
      const { data } = await api.post('/coupons/validate', {
        codigo: codigoCupon,
        total: total
      });

      setCuponAplicado(data.coupon);
      showSuccess(`¡Cupón aplicado! Descuento: $${data.coupon.descuento.toLocaleString('es-CL')}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Cupón inválido';
      showError(message);
      setCuponAplicado(null);
    } finally {
      setValidandoCupon(false);
    }
  };

  const removerCupon = () => {
    setCuponAplicado(null);
    setCodigoCupon('');
    showSuccess('Cupón removido');
  };

  const calcularDescuento = () => {
    if (!cuponAplicado) return 0;
    return cuponAplicado.descuento;
  };

  const calcularTotal = () => {
    const subtotal = total;
    const descuento = calcularDescuento();
    return subtotal - descuento + costoEnvio;
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      showWarning('Tu carrito está vacío');
      return;
    }

    // Si no hay usuario, validar datos de invitado
    if (!user) {
      if (!shippingData.nombreInvitado || !shippingData.emailInvitado || 
          !shippingData.rutInvitado || !shippingData.direccion || !shippingData.ciudad) {
        setShowShippingForm(true);
        showWarning('Por favor completa todos los datos de envío');
        return;
      }
      
      // Validar RUT
      if (!validateRut(shippingData.rutInvitado)) {
        showError('El RUT ingresado no es válido');
        return;
      }
    } else {
      // Usuario registrado también necesita dirección
      if (!shippingData.direccion || !shippingData.ciudad) {
        setShowShippingForm(true);
        showWarning('Por favor completa la dirección de envío');
        return;
      }
    }

    setLoading(true);

    try {
      // Trackear inicio de checkout
      trackBeginCheckout(calcularTotal(), items.length);

      const orderItems = items.map((item) => ({
        productId: item.product.id,
        cantidad: item.cantidad,
      }));

      const checkoutData: any = {
        items: orderItems,
        direccion: shippingData.direccion,
        ciudad: shippingData.ciudad,
        region: shippingData.region,
        codigoPostal: shippingData.codigoPostal,
        costoEnvio,
      };

      // Incluir cupón si está aplicado
      if (cuponAplicado) {
        checkoutData.couponId = cuponAplicado.id;
        checkoutData.descuento = cuponAplicado.descuento;
      }

      if (!user) {
        checkoutData.esInvitado = true;
        checkoutData.nombreInvitado = shippingData.nombreInvitado;
        checkoutData.emailInvitado = shippingData.emailInvitado;
        checkoutData.rutInvitado = cleanRut(shippingData.rutInvitado);
        
        // Guardar datos del invitado en localStorage para usar después del checkout
        localStorage.setItem('guestCheckoutData', JSON.stringify({
          nombreInvitado: shippingData.nombreInvitado,
          emailInvitado: shippingData.emailInvitado,
          rutInvitado: shippingData.rutInvitado,
        }));
      }

      const response = await api.post('/orders/checkout', checkoutData);
      
      // Redirigir a Stripe Checkout
      window.location.href = response.data.url;
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Error al procesar el pago';
      showError(message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-700 mb-4">Tu carrito está vacío</h2>
        <Link to="/" className="btn-primary">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">🛒 Mi Carrito</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="card flex gap-4">
              <img
                src={item.product.imagenes[0] || 'https://via.placeholder.com/150'}
                alt={item.product.nombre}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product.nombre}</h3>
                <p className="text-primary font-bold">${item.product.precio.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.cantidad - 1)}
                    className="btn bg-gray-200 text-gray-700 px-3 py-1"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.cantidad + 1)}
                    className="btn bg-gray-200 text-gray-700 px-3 py-1"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary and Shipping Form */}
        <div className="space-y-4">
          {/* Shipping Form */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">📦 Datos de Envío</h2>
            
            {!user && (
              <>
                <input
                  type="text"
                  placeholder="Tu nombre completo *"
                  className="input mb-3"
                  value={shippingData.nombreInvitado}
                  onChange={(e) => setShippingData({...shippingData, nombreInvitado: e.target.value})}
                />
                <input
                  type="email"
                  placeholder="Tu email *"
                  className="input mb-3"
                  value={shippingData.emailInvitado}
                  onChange={(e) => setShippingData({...shippingData, emailInvitado: e.target.value})}
                />
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RUT *
                  </label>
                  <RutInput
                    value={shippingData.rutInvitado}
                    onChange={(value) => setShippingData({...shippingData, rutInvitado: value})}
                    placeholder="12.345.678-9"
                    className="input w-full"
                    required
                    showValidation
                  />
                </div>
              </>
            )}
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección completa *
              </label>
              <AddressAutocomplete
                value={shippingData.direccion}
                onChange={(address, postalCode) => {
                  setShippingData({
                    ...shippingData, 
                    direccion: address,
                    codigoPostal: postalCode || shippingData.codigoPostal
                  });
                }}
                onSelect={handleAddressSelect}
                placeholder="Ej: Av. La Florida 8555, La Florida"
                className="input w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Empieza a escribir y selecciona de las sugerencias
              </p>
            </div>
            
            <input
              type="text"
              placeholder="Comuna *"
              className="input mb-3"
              value={shippingData.ciudad}
              onChange={(e) => setShippingData({...shippingData, ciudad: e.target.value})}
            />
            
            <select
              className="input mb-3"
              value={shippingData.region}
              onChange={(e) => setShippingData({...shippingData, region: e.target.value})}
            >
              <option>Región Metropolitana</option>
              <option>Valparaíso</option>
              <option>O'Higgins</option>
              <option>Maule</option>
              <option>Biobío</option>
              <option>La Araucanía</option>
              <option>Los Lagos</option>
              <option>Otra región</option>
            </select>
            
            <input
              type="text"
              placeholder="Código Postal (opcional)"
              className="input mb-3"
              value={shippingData.codigoPostal}
              onChange={(e) => setShippingData({...shippingData, codigoPostal: e.target.value})}
            />
            
            <button
              onClick={calcularEnvio}
              disabled={calculandoEnvio || !shippingData.direccion || !shippingData.ciudad}
              className={`w-full mb-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                calculandoEnvio || !shippingData.direccion || !shippingData.ciudad
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {calculandoEnvio ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Calculando...
                </span>
              ) : (
                '📍 Calcular Costo de Envío'
              )}
            </button>
            
            {mensajeEnvio && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm">
                {mensajeEnvio}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Resumen</h2>
            
            {/* Cupón de descuento */}
            <div className="mb-4 pb-4 border-b">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎟️ ¿Tienes un cupón de descuento?
              </label>
              
              {/* Mensaje de cupón de ruleta disponible */}
              {codigoCupon && !cuponAplicado && codigoCupon.startsWith('RULETA') && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-purple-700">
                        ¡Cupón de ruleta detectado!
                      </p>
                      <p className="text-xs text-purple-600">
                        Haz clic en "Aplicar" para usar tu descuento
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!cuponAplicado ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="CÓDIGO"
                    className="input flex-1 font-mono uppercase"
                    value={codigoCupon}
                    onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && validarCupon()}
                  />
                  <button
                    onClick={validarCupon}
                    disabled={validandoCupon || !codigoCupon.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {validandoCupon ? '...' : 'Aplicar'}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-green-700">
                        {cuponAplicado.codigo}
                      </div>
                      <div className="text-sm text-green-600">
                        {cuponAplicado.tipo === 'PERCENTAGE' 
                          ? `${cuponAplicado.valor}% descuento` 
                          : `$${cuponAplicado.valor.toLocaleString('es-CL')} descuento`}
                      </div>
                    </div>
                    <button
                      onClick={removerCupon}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
              {cuponAplicado && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Descuento ({cuponAplicado.codigo}):</span>
                  <span>-${calcularDescuento().toLocaleString('es-CL')}</span>
                </div>
              )}
              {costoEnvio > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Envío:</span>
                  <span>${costoEnvio.toLocaleString('es-CL')}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">${calcularTotal().toLocaleString('es-CL')}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Proceder al Pago'}
            </button>
            <button
              onClick={clearCart}
              className="btn-outline w-full mt-2"
              disabled={loading}
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
