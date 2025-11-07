import { useState } from 'react';
import axios from '../api/axios';
import { showSuccess, showError } from '../utils/notifications';
import { trackNewsletterSignup } from '../utils/analytics';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showError('Por favor ingresa tu email');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post('/newsletter/subscribe', { email });
      showSuccess(data.message);
      trackNewsletterSignup(); // Trackear suscripción
      setEmail('');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Error al suscribirse al newsletter';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">📬</span>
        <div>
          <h3 className="text-xl font-bold mb-1">Suscríbete a nuestro Newsletter</h3>
          <p className="text-purple-100 text-sm">
            Recibe ofertas exclusivas y novedades directo en tu email
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Enviando...' : 'Suscribirme'}
        </button>
      </form>

      <p className="text-xs text-purple-100 mt-3">
        🔒 Tu privacidad es importante. No compartiremos tu información.
      </p>
    </div>
  );
}
