import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import RutInput from '../components/RutInput';
import { validateRut, cleanRut } from '../utils/rut';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rut: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar RUT si se proporcionó
    if (formData.rut && !validateRut(formData.rut)) {
      setError('El RUT ingresado no es válido');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        nombre: formData.nombre,
        email: formData.email,
        mensaje: formData.mensaje,
        rut: formData.rut ? cleanRut(formData.rut) : undefined,
      };
      
      await axios.post('/contact', dataToSend);
      setSuccess(true);
      setFormData({ nombre: '', email: '', rut: '', mensaje: '' });
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            ¡Mensaje Enviado!
          </h2>
          <p className="text-gray-600">
            Gracias por contactarnos. Te responderemos pronto.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Redirigiendo a inicio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            📧 Contáctanos
          </h1>
          <p className="text-center text-gray-600 mb-8">
            ¿Tienes alguna pregunta o sugerencia? ¡Nos encantaría escucharte!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                required
                className="input"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RUT (Opcional)
              </label>
              <RutInput
                value={formData.rut}
                onChange={(value) => setFormData({ ...formData, rut: value })}
                placeholder="12.345.678-9"
                showValidation={true}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ingresa tu RUT si deseas recibir respuestas personalizadas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje *
              </label>
              <textarea
                required
                rows={6}
                className="input resize-none"
                value={formData.mensaje}
                onChange={(e) =>
                  setFormData({ ...formData, mensaje: e.target.value })
                }
                placeholder="Cuéntanos cómo podemos ayudarte..."
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-bold text-lg mb-4 text-center text-accent">
              Otras formas de contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="text-center">
                <div className="text-2xl mb-2">📧</div>
                <p className="font-semibold">Email</p>
                <p>info@ositoslua.cl</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📍</div>
                <p className="font-semibold">Ubicación</p>
                <p>Santiago, Chile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
