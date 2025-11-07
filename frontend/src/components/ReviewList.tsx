import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface Review {
  id: string;
  rating: number;
  comentario: string;
  createdAt: string;
  user: {
    nombre: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface Props {
  productId: string;
}

export default function ReviewList({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/reviews/product/${productId}`);
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (error) {
      console.error('Error al cargar reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <FaStar className="text-yellow-400 w-5 h-5" />
            ) : (
              <FaRegStar className="text-gray-300 w-5 h-5" />
            )}
          </span>
        ))}
      </div>
    );
  };

  const renderRatingBar = (stars: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 w-12">{stars} estrellas</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 w-8">{count}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Resumen de calificaciones */}
      {stats && stats.totalReviews > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Promedio */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {stats.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <p className="text-gray-600">
                Basado en {stats.totalReviews} {stats.totalReviews === 1 ? 'opinión' : 'opiniones'}
              </p>
            </div>

            {/* Distribución */}
            <div className="space-y-2">
              {renderRatingBar(5, stats.ratingDistribution[5], stats.totalReviews)}
              {renderRatingBar(4, stats.ratingDistribution[4], stats.totalReviews)}
              {renderRatingBar(3, stats.ratingDistribution[3], stats.totalReviews)}
              {renderRatingBar(2, stats.ratingDistribution[2], stats.totalReviews)}
              {renderRatingBar(1, stats.ratingDistribution[1], stats.totalReviews)}
            </div>
          </div>
        </div>
      )}

      {/* Lista de reviews */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aún no hay opiniones para este producto.</p>
          <p className="text-sm mt-2">¡Sé el primero en dejar tu opinión!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-semibold text-lg">
                    {review.user.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{review.user.nombre}</h4>
                    <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  <p className="text-gray-700 leading-relaxed">{review.comentario}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
