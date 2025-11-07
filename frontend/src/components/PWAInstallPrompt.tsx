import { useEffect, useState } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Detectar si ya está en modo standalone
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    setIsStandalone(isInStandaloneMode);

    // Escuchar evento de instalación (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Mostrar prompt después de 5 segundos si no se ha descartado antes
      const hasShownPrompt = localStorage.getItem('pwa-install-prompt-shown');
      if (!hasShownPrompt) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Para iOS, mostrar instrucciones después de 10 segundos
    if (isIOSDevice && !isInStandaloneMode) {
      const hasShownIOSPrompt = localStorage.getItem('pwa-ios-prompt-shown');
      if (!hasShownIOSPrompt) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 10000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la PWA');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-shown', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('pwa-ios-prompt-shown', 'true');
    } else {
      localStorage.setItem('pwa-install-prompt-shown', 'true');
    }
  };

  // No mostrar si ya está instalado
  if (isStandalone) return null;

  // No mostrar si el usuario lo cerró
  if (!showPrompt) return null;

  // Prompt para iOS
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-in">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="text-4xl">📱</div>
            <div>
              <h3 className="font-bold text-lg mb-2">
                ¡Instala OsitosLua en tu iPhone!
              </h3>
              <p className="text-purple-100 text-sm mb-4">
                Accede más rápido desde tu pantalla de inicio
              </p>

              <div className="bg-white/10 rounded-lg p-3 text-sm space-y-2">
                <p className="flex items-center gap-2">
                  <span>1.</span>
                  <span>Toca el botón de compartir <span className="text-xl">⬆️</span></span>
                </p>
                <p className="flex items-center gap-2">
                  <span>2.</span>
                  <span>Selecciona "Agregar a pantalla de inicio"</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>3.</span>
                  <span>Confirma con "Agregar"</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prompt para Android/Desktop
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-6">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">🧸</div>
          <div>
            <h3 className="font-bold text-lg mb-1">
              ¡Instala OsitosLua!
            </h3>
            <p className="text-purple-100 text-sm">
              Accede más rápido y recibe notificaciones de ofertas exclusivas
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <FaDownload />
            Instalar
          </button>
          <button
            onClick={handleDismiss}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition"
          >
            Ahora no
          </button>
        </div>

        <p className="text-xs text-purple-100 mt-3 text-center">
          📦 Ocupa menos de 5MB
        </p>
      </div>
    </div>
  );
}
