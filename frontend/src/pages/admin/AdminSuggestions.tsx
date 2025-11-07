import { useState, useEffect } from 'react';
import axios from '../../api/axios';

interface Sugerencia {
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
  leido: boolean;
  respondido: boolean;
  createdAt: string;
}

const AdminSuggestions = () => {
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'pending'>('all');

  useEffect(() => {
    fetchSugerencias();
  }, []);

  const fetchSugerencias = async () => {
    try {
      const { data } = await axios.get('/suggestions');
      setSugerencias(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarLeido = async (id: string) => {
    try {
      await axios.patch(`/suggestions/${id}/leido`);
      fetchSugerencias();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const marcarRespondido = async (id: string) => {
    try {
      await axios.patch(`/suggestions/${id}/respondido`);
      fetchSugerencias();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta sugerencia?')) return;
    try {
      await axios.delete(`/suggestions/${id}`);
      fetchSugerencias();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredSugerencias = sugerencias.filter((s) => {
    if (filter === 'unread') return !s.leido;
    if (filter === 'pending') return s.leido && !s.respondido;
    return true;
  });

  if (loading) {
    return <div className="text-center p-8">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        💬 Sugerencias y Contactos
      </h1>

      <div className="card mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
          >
            Todas ({sugerencias.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded ${
              filter === 'unread' ? 'bg-accent text-white' : 'bg-gray-200'
            }`}
          >
            No leídas ({sugerencias.filter((s) => !s.leido).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${
              filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
            }`}
          >
            Pendientes ({sugerencias.filter((s) => s.leido && !s.respondido).length})
          </button>
        </div>
      </div>

      {filteredSugerencias.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No hay sugerencias {filter !== 'all' && 'en esta categoría'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSugerencias.map((sug) => (
            <div
              key={sug.id}
              className={`card ${!sug.leido ? 'border-l-4 border-primary bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{sug.nombre}</h3>
                  <a href={`mailto:${sug.email}`} className="text-primary hover:underline text-sm">
                    {sug.email}
                  </a>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(sug.createdAt).toLocaleString('es-CL')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {sug.respondido ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      ✓ Respondido
                    </span>
                  ) : sug.leido ? (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      👁 Leído
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      • Nuevo
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-4">
                <p className="whitespace-pre-wrap">{sug.mensaje}</p>
              </div>

              <div className="flex gap-2">
                {!sug.leido && (
                  <button
                    onClick={() => marcarLeido(sug.id)}
                    className="btn-outline text-sm"
                  >
                    Marcar como Leído
                  </button>
                )}
                {sug.leido && !sug.respondido && (
                  <button
                    onClick={() => marcarRespondido(sug.id)}
                    className="btn-primary text-sm"
                  >
                    Marcar como Respondido
                  </button>
                )}
                <a
                  href={`mailto:${sug.email}?subject=Re: Tu mensaje en OsitosLua`}
                  className="btn-accent text-sm"
                >
                  📧 Responder
                </a>
                <button
                  onClick={() => eliminar(sug.id)}
                  className="btn-outline text-sm text-red-600 border-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSuggestions;
