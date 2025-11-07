import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useEffect } from 'react';

const CheckoutSuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    clearCart();
  }, [clearCart]);

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
};

export default CheckoutSuccessPage;
