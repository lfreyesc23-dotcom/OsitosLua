import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import RutInput from '../components/RutInput';
import { validateRut, cleanRut } from '../utils/rut';
import api from '../api/axios';

const CheckoutSuccessPage = () => {
  const { clearCart } = useCart();
  const { user, login } = useAuth();
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Datos del invitado (vendrían de la sesión o localStorage)
  const [guestData, setGuestData] = useState({
    nombre: '',
    email: '',
    rut: '',
  });

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    clearCart();

    // Obtener datos del invitado del localStorage si existen
    const storedGuestData = localStorage.getItem('guestCheckoutData');
    if (storedGuestData) {
      const data = JSON.parse(storedGuestData);
      setGuestData({
        nombre: data.nombreInvitado || '',
        email: data.emailInvitado || '',
        rut: data.rutInvitado || '',
      });
    }
  }, [clearCart]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!validateRut(guestData.rut)) {
      setError('El RUT ingresado no es válido');
      return;
    }

    setLoading(true);

    try {
      // Crear cuenta
      await api.post('/auth/register', {
        email: guestData.email,
        nombre: guestData.nombre,
        password: formData.password,
        rut: cleanRut(guestData.rut),
      });

      // Iniciar sesión automáticamente
      await login(guestData.email, formData.password);

      // Limpiar datos del invitado
      localStorage.removeItem('guestCheckoutData');
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              ¡Cuenta creada exitosamente!
            </h1>
            <p className="text-gray-600">
              Ahora puedes ver tus órdenes y guardar tus datos para futuras compras.
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/orders" className="btn-primary block">
              Ver mis órdenes
            </Link>
            <Link to="/" className="btn-outline block">
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 mb-6">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">¡Pago exitoso!</h1>
          <p className="text-gray-600">
            Tu pedido ha sido confirmado. Recibirás un email con los detalles de tu compra.
          </p>
        </div>

        {/* Mostrar botón para crear cuenta solo si es invitado */}
        {!user && guestData.email && !showCreateAccount && (
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              🎁 ¿Quieres guardar tus datos?
            </h2>
            <p className="text-gray-600 mb-4">
              Crea una cuenta para ver tus órdenes y hacer compras más rápido
            </p>
            <button
              onClick={() => setShowCreateAccount(true)}
              className="btn-primary w-full"
            >
              Crear mi cuenta
            </button>
          </div>
        )}

        {/* Formulario para crear cuenta */}
        {!user && showCreateAccount && (
          <div className="card text-left mb-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">
              Crear Cuenta
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={guestData.nombre}
                  className="input bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={guestData.email}
                  className="input bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RUT
                </label>
                <RutInput
                  value={guestData.rut}
                  onChange={(value) => setGuestData({ ...guestData, rut: value })}
                  placeholder="12.345.678-9"
                  required
                  showValidation={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="input"
                  required
                  disabled={loading}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateAccount(false)}
                  className="btn-outline flex-1"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear Cuenta'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Enlaces principales */}
        <div className="space-y-3">
          {user && (
            <Link to="/orders" className="btn-primary block">
              Ver mis órdenes
            </Link>
          )}
          <Link to="/" className="btn-outline block">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
