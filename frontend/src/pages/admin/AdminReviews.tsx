import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { showSuccess, showError } from '../../utils/notifications';
import { FaStar, FaRegStar, FaCheck, FaTimes } from 'react-icons/fa';

interface Review {
  id: string;
  rating: number;
  comentario: string;
  aprobado: boolean;
  createdAt: string;
  user: {
    nombre: string;
    email: string;
  };
  product: {
    nombre: string;
    imagen: string;
  };
}

interface Stats {
  total: number;
  aprobadas: number;
  pendientes: number;
  promedioGeneral: number;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/reviews/admin/all');
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (error) {
      showError('Error al cargar reviews');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.put(`/reviews/admin/${id}/approve`);
      showSuccess('Review aprobada correctamente');
      fetchReviews();
    } catch (error) {
      showError('Error al aprobar review');
      console.error(error);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('¿Estás seguro de rechazar esta review? Se eliminará permanentemente.')) {
      return;
    }

    try {
      await axios.put(`/reviews/admin/${id}/reject`);
      showSuccess('Review rechazada y eliminada');
      fetchReviews();
    } catch (error) {
      showError('Error al rechazar review');
      console.error(error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <FaStar className="text-yellow-400 w-4 h-4" />
            ) : (
              <FaRegStar className="text-gray-300 w-4 h-4" />
            )}
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'pending') return !review.aprobado;
    if (filter === 'approved') return review.aprobado;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Reviews</h1>
        <p className="mt-2 text-gray-600">Modera las opiniones de tus clientes</p>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total</p>
                <p className="mt-2 text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Aprobadas</p>
                <p className="mt-2 text-3xl font-bold text-green-900">{stats.aprobadas}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">Pendientes</p>
                <p className="mt-2 text-3xl font-bold text-orange-900">{stats.pendientes}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Promedio</p>
                <p className="mt-2 text-3xl font-bold text-purple-900">{stats.promedioGeneral}</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'pending'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pendientes ({reviews.filter((r) => !r.aprobado).length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'approved'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Aprobadas ({reviews.filter((r) => r.aprobado).length})
        </button>
      </div>

      {/* Lista de reviews */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay reviews para mostrar</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comentario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.product.imagen}
                          alt={review.product.nombre}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {review.product.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{review.user.nombre}</p>
                        <p className="text-sm text-gray-500">{review.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderStars(review.rating)}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-md line-clamp-2">
                        {review.comentario}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {review.aprobado ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✅ Aprobada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          ⏳ Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!review.aprobado && (
                          <button
                            onClick={() => handleApprove(review.id)}
                            className="inline-flex items-center p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                            title="Aprobar"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleReject(review.id)}
                          className="inline-flex items-center p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                          title="Rechazar y eliminar"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
