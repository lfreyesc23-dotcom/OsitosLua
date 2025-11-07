import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { showSuccess, showError } from '../../utils/notifications';

interface Coupon {
  id: string;
  codigo: string;
  tipo: 'PERCENTAGE' | 'FIXED';
  valor: number;
  minCompra: number;
  maxUsos: number | null;
  usosActuales: number;
  activo: boolean;
  fechaInicio: string;
  fechaExpiracion: string | null;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    codigo: '',
    tipo: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    valor: '',
    minCompra: '0',
    maxUsos: '',
    fechaExpiracion: '',
    activo: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await api.get('/coupons');
      setCoupons(response.data);
    } catch (error) {
      showError('Error al cargar los cupones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        codigo: formData.codigo.toUpperCase(),
        tipo: formData.tipo,
        valor: parseFloat(formData.valor),
        minCompra: parseFloat(formData.minCompra),
        maxUsos: formData.maxUsos ? parseInt(formData.maxUsos) : null,
        fechaExpiracion: formData.fechaExpiracion || null,
        activo: formData.activo
      };

      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon.id}`, data);
        showSuccess('Cupón actualizado exitosamente');
      } else {
        await api.post('/coupons', data);
        showSuccess('Cupón creado exitosamente');
      }

      setShowModal(false);
      resetForm();
      fetchCoupons();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Error al guardar el cupón');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      codigo: coupon.codigo,
      tipo: coupon.tipo,
      valor: coupon.valor.toString(),
      minCompra: coupon.minCompra.toString(),
      maxUsos: coupon.maxUsos?.toString() || '',
      fechaExpiracion: coupon.fechaExpiracion 
        ? new Date(coupon.fechaExpiracion).toISOString().split('T')[0] 
        : '',
      activo: coupon.activo
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cupón?')) return;

    try {
      await api.delete(`/coupons/${id}`);
      showSuccess('Cupón eliminado exitosamente');
      fetchCoupons();
    } catch (error) {
      showError('Error al eliminar el cupón');
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      await api.put(`/coupons/${coupon.id}`, { activo: !coupon.activo });
      showSuccess(coupon.activo ? 'Cupón desactivado' : 'Cupón activado');
      fetchCoupons();
    } catch (error) {
      showError('Error al cambiar el estado del cupón');
    }
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      codigo: '',
      tipo: 'PERCENTAGE',
      valor: '',
      minCompra: '0',
      maxUsos: '',
      fechaExpiracion: '',
      activo: true
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL');
  };

  const isExpired = (fecha: string | null) => {
    if (!fecha) return false;
    return new Date(fecha) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="text-center text-gray-600">Cargando cupones...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🎟️ Gestión de Cupones
            </h1>
            <p className="text-gray-600">Crea y administra códigos de descuento</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin"
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition font-medium"
            >
              ← Volver
            </Link>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-lg"
            >
              + Nuevo Cupón
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-gray-500 text-sm mb-1">Total Cupones</div>
            <div className="text-3xl font-bold text-purple-600">{coupons.length}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-gray-500 text-sm mb-1">Activos</div>
            <div className="text-3xl font-bold text-green-600">
              {coupons.filter(c => c.activo).length}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-gray-500 text-sm mb-1">Expirados</div>
            <div className="text-3xl font-bold text-red-600">
              {coupons.filter(c => isExpired(c.fechaExpiracion)).length}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-gray-500 text-sm mb-1">Total Usos</div>
            <div className="text-3xl font-bold text-blue-600">
              {coupons.reduce((sum, c) => sum + c.usosActuales, 0)}
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Código</th>
                  <th className="px-6 py-4 text-left">Tipo</th>
                  <th className="px-6 py-4 text-left">Valor</th>
                  <th className="px-6 py-4 text-left">Min. Compra</th>
                  <th className="px-6 py-4 text-left">Usos</th>
                  <th className="px-6 py-4 text-left">Expiración</th>
                  <th className="px-6 py-4 text-left">Estado</th>
                  <th className="px-6 py-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No hay cupones registrados. ¡Crea el primero!
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-purple-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-purple-600">
                          {coupon.codigo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          coupon.tipo === 'PERCENTAGE' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {coupon.tipo === 'PERCENTAGE' ? 'Porcentaje' : 'Fijo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {coupon.tipo === 'PERCENTAGE' 
                          ? `${coupon.valor}%` 
                          : formatCurrency(coupon.valor)}
                      </td>
                      <td className="px-6 py-4">
                        {formatCurrency(coupon.minCompra)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">
                          {coupon.usosActuales}
                          {coupon.maxUsos ? ` / ${coupon.maxUsos}` : ' / ∞'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {coupon.fechaExpiracion ? (
                          <span className={isExpired(coupon.fechaExpiracion) ? 'text-red-600' : 'text-gray-600'}>
                            {formatDate(coupon.fechaExpiracion)}
                            {isExpired(coupon.fechaExpiracion) && ' (Vencido)'}
                          </span>
                        ) : (
                          <span className="text-gray-400">Sin expiración</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(coupon)}
                          className={`px-4 py-1 rounded-full text-sm font-medium ${
                            coupon.activo
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {coupon.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-3xl">
                <h2 className="text-2xl font-bold">
                  {editingCoupon ? '✏️ Editar Cupón' : '➕ Crear Nuevo Cupón'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Código */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Código del Cupón *
                  </label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    placeholder="DESCUENTO2024"
                    required
                    disabled={!!editingCoupon}
                  />
                  <p className="text-sm text-gray-500 mt-1">Ejemplo: VERANO20, BIENVENIDA, FIDELIDAD</p>
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tipo de Descuento *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="PERCENTAGE">Porcentaje (%)</option>
                    <option value="FIXED">Monto Fijo (CLP)</option>
                  </select>
                </div>

                {/* Valor */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Valor del Descuento *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.tipo === 'PERCENTAGE' ? '100' : undefined}
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={formData.tipo === 'PERCENTAGE' ? '15' : '5000'}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.tipo === 'PERCENTAGE' 
                      ? 'Porcentaje de descuento (0-100)' 
                      : 'Monto en CLP a descontar'}
                  </p>
                </div>

                {/* Compra Mínima */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Compra Mínima Requerida (CLP)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.minCompra}
                    onChange={(e) => setFormData({ ...formData, minCompra: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">Deja en 0 para sin mínimo</p>
                </div>

                {/* Usos Máximos */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Máximo de Usos
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={formData.maxUsos}
                    onChange={(e) => setFormData({ ...formData, maxUsos: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ilimitado"
                  />
                  <p className="text-sm text-gray-500 mt-1">Deja vacío para usos ilimitados</p>
                </div>

                {/* Fecha Expiración */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Fecha de Expiración
                  </label>
                  <input
                    type="date"
                    value={formData.fechaExpiracion}
                    onChange={(e) => setFormData({ ...formData, fechaExpiracion: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Deja vacío para sin expiración</p>
                </div>

                {/* Activo */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <label htmlFor="activo" className="text-gray-700 font-medium">
                    Cupón Activo
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-lg"
                  >
                    {editingCoupon ? 'Actualizar' : 'Crear'} Cupón
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
