import { useState } from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaLink, FaCheck } from 'react-icons/fa';
import { showSuccess } from '../utils/notifications';
import { trackCustomEvent } from '../utils/analytics';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Detectar si el navegador soporta Web Share API (móviles)
  const canShare = typeof navigator !== 'undefined' && navigator.share;

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: description || title,
        url,
      });
      trackCustomEvent('Social', 'native_share', 'Web Share API');
      showSuccess('Compartido exitosamente');
    } catch (error: any) {
      // Usuario canceló o error
      if (error.name !== 'AbortError') {
        console.error('Error al compartir:', error);
      }
    }
  };

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackCustomEvent('Social', 'share', 'Facebook');
  };

  const handleTwitterShare = () => {
    const text = description ? `${title} - ${description}` : title;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackCustomEvent('Social', 'share', 'Twitter');
  };

  const handleWhatsAppShare = () => {
    const text = `${title}\n${description || ''}\n${url}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackCustomEvent('Social', 'share', 'WhatsApp');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showSuccess('Link copiado al portapapeles');
      trackCustomEvent('Social', 'copy_link', url);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>📤</span>
        Compartir
      </h3>

      <div className="space-y-3">
        {/* Native Share (móviles) */}
        {canShare && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
          >
            <span className="text-xl">📱</span>
            Compartir
          </button>
        )}

        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <FaFacebook className="text-xl" />
          Facebook
        </button>

        {/* Twitter */}
        <button
          onClick={handleTwitterShare}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 transition-all shadow-md hover:shadow-lg"
        >
          <FaTwitter className="text-xl" />
          Twitter
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
        >
          <FaWhatsapp className="text-xl" />
          WhatsApp
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {copied ? (
            <>
              <FaCheck className="text-xl" />
              ¡Copiado!
            </>
          ) : (
            <>
              <FaLink className="text-xl" />
              Copiar Link
            </>
          )}
        </button>
      </div>

      {/* Share Stats (opcional) */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Comparte con tus amigos y familiares 💕
        </p>
      </div>
    </div>
  );
}
