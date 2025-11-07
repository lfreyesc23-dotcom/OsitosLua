import { useState } from 'react';
import axios from '../api/axios';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { showSuccess, showError } from '../utils/notifications';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  productId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: Props) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      showError('Por favor selecciona una calificación');
      return;
    }

    if (comentario.trim().length < 10) {
      showError('El comentario debe tener al menos 10 caracteres');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post('/reviews', {
        productId,
        rating,
        comentario: comentario.trim(),
      });

      showSuccess('¡Gracias por tu opinión! Será revisada por nuestro equipo.');
      setRating(0);
      setComentario('');
      onReviewSubmitted();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Error al enviar tu opinión. Intenta nuevamente.';
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          <a href="/login" className="text-pink-600 hover:text-pink-700 font-semibold">
            Inicia sesión
          </a>{' '}
          para dejar tu opinión sobre este producto
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Deja tu opinión</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de estrellas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                {star <= (hoverRating || rating) ? (
                  <FaStar className="text-yellow-400 w-8 h-8" />
                ) : (
                  <FaRegStar className="text-gray-300 w-8 h-8" />
                )}
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {rating === 1 && 'Malo'}
                {rating === 2 && 'Regular'}
                {rating === 3 && 'Bueno'}
                {rating === 4 && 'Muy bueno'}
                {rating === 5 && 'Excelente'}
              </span>
            )}
          </div>
        </div>

        {/* Campo de comentario */}
        <div>
          <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
            Tu opinión
          </label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Cuéntanos qué te pareció el producto (mínimo 10 caracteres)..."
            minLength={10}
            maxLength={1000}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {comentario.length}/1000 caracteres
          </p>
        </div>

        {/* Nota sobre moderación */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Tu opinión será revisada por nuestro equipo antes de ser publicada.
          </p>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? 'Enviando...' : 'Publicar opinión'}
        </button>
      </form>
    </div>
  );
}
