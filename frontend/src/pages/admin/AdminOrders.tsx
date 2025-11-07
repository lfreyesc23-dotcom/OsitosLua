import { useEffect, useState } from 'react';
import api from '../../api/axios';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  esInvitado: boolean;
  emailInvitado?: string;
  nombreInvitado?: string;
  direccion?: string;
  ciudad?: string;
  region?: string;
  costoEnvio?: number;
  user?: {
    nombre: string;
    email: string;
  };
  orderItems: Array<{
    cantidad: number;
    product: {
      nombre: string;
      precio: number;
    };
  }>;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      alert('✅ Estado actualizado');
      fetchOrders();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">📋 Gestión de Órdenes</h1>

      {/* Orders Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">Cliente</th>
              <th className="text-left py-3 px-4">Total</th>
              <th className="text-left py-3 px-4">Estado</th>
              <th className="text-left py-3 px-4">Fecha</th>
              <th className="text-left py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">#{order.id.substring(0, 8)}</td>
                <td className="py-3 px-4">
                  <div>
                    {order.esInvitado ? (
                      <>
                        <p className="font-medium">{order.nombreInvitado || 'Invitado'}</p>
                        <p className="text-sm text-gray-500">{order.emailInvitado}</p>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Invitado</span>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">{order.user?.nombre}</p>
                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">${order.total.toLocaleString('es-CL')}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-2 py-1 rounded border"
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="COMPLETED">Completada</option>
                    <option value="SHIPPED">Enviada</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  {new Date(order.createdAt).toLocaleDateString('es-ES')}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-primary hover:underline"
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              Detalles de Orden #{selectedOrder.id.substring(0, 8).toUpperCase()}
            </h2>

            <div className="space-y-6">
              {/* Cliente */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">👤 Cliente:</h3>
                {selectedOrder.esInvitado ? (
                  <>
                    <p className="font-medium">{selectedOrder.nombreInvitado || 'Invitado'}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.emailInvitado}</p>
                    <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Compra como Invitado
                    </span>
                  </>
                ) : (
                  <>
                    <p className="font-medium">{selectedOrder.user?.nombre}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                  </>
                )}
              </div>

              {/* Dirección de Envío */}
              {selectedOrder.direccion && (
                <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-blue-900">📦 Dirección de Envío:</h3>
                  <p className="text-blue-800">{selectedOrder.direccion}</p>
                  <p className="text-blue-800">{selectedOrder.ciudad}, {selectedOrder.region}</p>
                  {selectedOrder.costoEnvio !== undefined && selectedOrder.costoEnvio > 0 && (
                    <p className="text-sm text-blue-700 mt-2">
                      <strong>Costo de envío:</strong> ${selectedOrder.costoEnvio.toLocaleString('es-CL')}
                    </p>
                  )}
                </div>
              )}

              {/* Productos */}
              <div>
                <h3 className="font-bold mb-3">📦 Productos:</h3>
                <div className="space-y-2">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2 bg-gray-50 p-3 rounded">
                      <span className="font-medium">
                        {item.product.nombre} <span className="text-gray-500">× {item.cantidad}</span>
                      </span>
                      <span className="font-bold text-accent">
                        ${(item.product.precio * item.cantidad).toLocaleString('es-CL')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 pt-4 bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${selectedOrder.total.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn-outline flex-1"
                >
                  Cerrar
                </button>
                {selectedOrder.status === 'COMPLETED' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'SHIPPED');
                      setSelectedOrder(null);
                    }}
                    className="btn-primary flex-1"
                  >
                    🚚 Marcar como Enviada
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
