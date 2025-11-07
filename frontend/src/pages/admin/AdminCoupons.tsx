import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { showSuccess, showError, showWarning } from '../../utils/notifications';

interface Coupon {
  id: string;
  codigo: string;
  tipo: 'PERCENTAGE' | 'FIXED';
  valor: number;
  minimoCompra: number;
  maximoUsos: number;
  usosActuales: number;
  activo: boolean;
  fechaInicio: string;
  fechaFin: string;
  createdAt: string;
}

const AdminCouponsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    codigo: '',
    tipo: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    valor: 0,
    minimoCompra: 0,
    maximoUsos: 100,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchCoupons();
  }, [user, navigate]);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCoupons(data);
    } catch (error: any) {
      showError('Error al cargar cupones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo || formData.valor <= 0) {
      showWarning('Completa todos los campos obligatorios');
      return;
    }

    try {
      await api.post('/coupons', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      showSuccess('Cupón creado exitosamente');
      setShowForm(false);
      setFormData({
        codigo: '',
        tipo: 'PERCENTAGE',
        valor: 0,
        minimoCompra: 0,
        maximoUsos: 100,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      fetchCoupons();
    } catch (error: any) {
      showError(error.response?.data?.error || 'Error al crear cupón');
    }
  };

  const toggleActive = async (id: string, activo: boolean) => {
    try {
      await api.patch(`/coupons/${id}`, { activo: !activo }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showSuccess(`Cupón ${!activo ? 'activado' : 'desactivado'}`);
      fetchCoupons();
    } catch (error: any) {
      showError('Error al actualizar cupón');
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cupón?')) return;

    try {
      await api.delete(`/coupons/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showSuccess('Cupón eliminado');
      fetchCoupons();
    } catch (error: any) {
      showError('Error al eliminar cupón');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Cupones</h1>
            <p className="text-gray-600 mt-1">Crea y administra descuentos y ofertas especiales</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Cupón'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Cupón</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código del Cupón *
                </label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="ej: VERANO2025"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Descuento *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'PERCENTAGE' | 'FIXED' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="PERCENTAGE">Porcentaje (%)</option>
                  <option value="FIXED">Monto Fijo ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor del Descuento *
                </label>
                <input
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={formData.tipo === 'PERCENTAGE' ? '10' : '5000'}
                  min="0"
                  step="0.01"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.tipo === 'PERCENTAGE' ? 'Porcentaje de descuento (ej: 10 = 10%)' : 'Monto en pesos chilenos'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compra Mínima
                </label>
                <input
                  type="number"
                  value={formData.minimoCompra}
                  onChange={(e) => setFormData({ ...formData, minimoCompra: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo de Usos
                </label>
                <input
                  type="number"
                  value={formData.maximoUsos}
                  onChange={(e) => setFormData({ ...formData, maximoUsos: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="100"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Crear Cupón
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de cupones */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay cupones creados. ¡Crea tu primer cupón!
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-purple-600">{coupon.codigo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {coupon.tipo === 'PERCENTAGE' 
                          ? `${coupon.valor}%` 
                          : `$${coupon.valor.toLocaleString('es-CL')}`
                        }
                      </div>
                      {coupon.minimoCompra > 0 && (
                        <div className="text-xs text-gray-500">
                          Min: ${coupon.minimoCompra.toLocaleString('es-CL')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {coupon.usosActuales} / {coupon.maximoUsos}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-500">
                        {new Date(coupon.fechaInicio).toLocaleDateString('es-CL')} - {new Date(coupon.fechaFin).toLocaleDateString('es-CL')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        coupon.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleActive(coupon.id, coupon.activo)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        {coupon.activo ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCouponsPage;
