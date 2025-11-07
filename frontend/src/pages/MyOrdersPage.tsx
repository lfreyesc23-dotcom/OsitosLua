import { useEffect, useState } from 'react';
import api from '../api/axios';
import { showError } from '../utils/notifications';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  direccion?: string;
  ciudad?: string;
  region?: string;
  costoEnvio?: number;
  orderItems: Array<{
    cantidad: number;
    product: {
      nombre: string;
      precio: number;
      imagenes: string[];
    };
  }>;
}

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al cargar las órdenes';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '✅ Pagada';
      case 'SHIPPED':
        return '🚚 Enviada';
      default:
        return '⏳ Pendiente';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando tus órdenes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          📦 Historial de Compras
        </h1>

        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-xl text-gray-500 mb-4">No tienes órdenes aún</p>
            <p className="text-gray-400 mb-6">¡Explora nuestro catálogo y haz tu primera compra!</p>
            <a href="/" className="btn-primary inline-block">
              Ir a la tienda
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Orden #{order.id.substring(0, 8).toUpperCase()}</p>
                    <p className="text-sm font-medium text-gray-700">
                      📅 {new Date(order.createdAt).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <p className="text-2xl font-bold text-primary">
                      ${order.total.toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>

                {/* Productos */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-gray-700">Productos:</h3>
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                      <img
                        src={item.product.imagenes[0] || 'https://via.placeholder.com/80'}
                        alt={item.product.nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.nombre}</p>
                        <p className="text-sm text-gray-600">
                          {item.cantidad} × ${item.product.precio.toLocaleString('es-CL')}
                        </p>
                      </div>
                      <p className="font-bold text-accent">
                        ${(item.cantidad * item.product.precio).toLocaleString('es-CL')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Dirección */}
                {order.direccion && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-blue-900 mb-2">📍 Dirección de Envío</h3>
                    <p className="text-sm text-blue-800">
                      {order.direccion}<br />
                      {order.ciudad}, {order.region}
                    </p>
                    {order.costoEnvio !== undefined && order.costoEnvio > 0 && (
                      <p className="text-sm text-blue-700 mt-2">
                        <strong>Costo de envío:</strong> ${order.costoEnvio.toLocaleString('es-CL')}
                      </p>
                    )}
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Estado del Pedido:</h3>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
                      <div
                        className={`h-full transition-all ${
                          order.status === 'COMPLETED' ? 'w-1/2 bg-green-500' :
                          order.status === 'SHIPPED' ? 'w-full bg-blue-500' :
                          'w-0'
                        }`}
                      />
                    </div>

                    <div className="flex-1 text-center z-10">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        order.status !== 'PENDING' ? 'bg-green-500 text-white' : 'bg-gray-300'
                      }`}>
                        ⏳
                      </div>
                      <p className="text-xs font-medium">Pendiente</p>
                    </div>

                    <div className="flex-1 text-center z-10">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        order.status === 'COMPLETED' || order.status === 'SHIPPED' ? 'bg-green-500 text-white' : 'bg-gray-300'
                      }`}>
                        ✅
                      </div>
                      <p className="text-xs font-medium">Pagada</p>
                    </div>

                    <div className="flex-1 text-center z-10">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        order.status === 'SHIPPED' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                      }`}>
                        🚚
                      </div>
                      <p className="text-xs font-medium">Enviada</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  className="btn-outline w-full mt-4"
                >
                  {selectedOrder?.id === order.id ? '▲ Ocultar detalles' : '▼ Ver más detalles'}
                </button>

                {selectedOrder?.id === order.id && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">ID completo:</p>
                    <p className="font-mono text-xs break-all">{order.id}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
