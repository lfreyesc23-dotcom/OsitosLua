import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    user: {
      nombre: string;
    };
    createdAt: string;
  }>;
}

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/reportes');
      setData(response.data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">📊 Panel de Administración</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary to-primary-dark text-white">
          <p className="text-sm opacity-90">Total Usuarios</p>
          <p className="text-4xl font-bold">{data.totalUsers}</p>
        </div>
        <div className="card bg-gradient-to-br from-accent to-accent-light text-white">
          <p className="text-sm opacity-90">Total Productos</p>
          <p className="text-4xl font-bold">{data.totalProducts}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-sm opacity-90">Total Órdenes</p>
          <p className="text-4xl font-bold">{data.totalOrders}</p>
        </div>
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <p className="text-sm opacity-90">Ingresos Totales</p>
          <p className="text-4xl font-bold">${data.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/products" className="card hover:shadow-xl transition text-center p-8">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-bold">Gestionar Productos</h3>
          <p className="text-gray-600 mt-2">Crear, editar y eliminar productos</p>
        </Link>
        <Link to="/admin/orders" className="card hover:shadow-xl transition text-center p-8">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-bold">Ver Órdenes</h3>
          <p className="text-gray-600 mt-2">Gestionar todas las órdenes</p>
        </Link>
        <Link to="/admin/coupons" className="card hover:shadow-xl transition text-center p-8">
          <div className="text-5xl mb-4">🎟️</div>
          <h3 className="text-xl font-bold">Cupones de Descuento</h3>
          <p className="text-gray-600 mt-2">Crear y gestionar cupones</p>
        </Link>
        <Link to="/admin/reviews" className="card hover:shadow-xl transition text-center p-8">
          <div className="text-5xl mb-4">⭐</div>
          <h3 className="text-xl font-bold">Reviews</h3>
          <p className="text-gray-600 mt-2">Moderar opiniones de clientes</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Órdenes Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Cliente</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#{order.id.substring(0, 8)}</td>
                  <td className="py-3 px-4">{order.user.nombre}</td>
                  <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
