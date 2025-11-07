import { useState } from 'react';
import { showSuccess, showError } from '../utils/notifications';

interface DiscountWheelProps {
  onClose: () => void;
  onWin: (discount: number) => void;
}

const DiscountWheel = ({ onClose, onWin }: DiscountWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  // Opciones de descuento: 5%, 10%, 15%, "Siga participando" (0%)
  const segments = [
    { discount: 5, color: 'from-pink-400 to-pink-600', label: '5%' },
    { discount: 0, color: 'from-gray-300 to-gray-500', label: '¡Sigue!' },
    { discount: 10, color: 'from-purple-400 to-purple-600', label: '10%' },
    { discount: 0, color: 'from-gray-300 to-gray-500', label: '¡Sigue!' },
    { discount: 15, color: 'from-blue-400 to-blue-600', label: '15%' },
    { discount: 0, color: 'from-gray-300 to-gray-500', label: '¡Sigue!' },
    { discount: 10, color: 'from-purple-400 to-purple-600', label: '10%' },
    { discount: 5, color: 'from-pink-400 to-pink-600', label: '5%' },
  ];

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    
    // Calcular rotación aleatoria (mínimo 5 vueltas completas)
    const minRotation = 360 * 5;
    const randomRotation = Math.random() * 360;
    const totalRotation = minRotation + randomRotation;
    
    setRotation(totalRotation);

    // Calcular el segmento ganador
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const segmentAngle = 360 / segments.length;
      const segmentIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % segments.length;
      const wonDiscount = segments[segmentIndex].discount;
      
      setResult(wonDiscount);
      setIsSpinning(false);

      // Guardar que ya usó la ruleta
      localStorage.setItem('wheelUsed', 'true');
      
      if (wonDiscount > 0) {
        // Guardar cupón de descuento
        const couponCode = `RULETA${wonDiscount}`;
        localStorage.setItem('wheelDiscount', JSON.stringify({
          code: couponCode,
          discount: wonDiscount,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
        }));
        
        showSuccess(`🎉 ¡Ganaste ${wonDiscount}% de descuento! Código: ${couponCode}`);
        onWin(wonDiscount);
      } else {
        showError('¡Sigue participando! Intenta de nuevo en tu próxima visita');
      }

      // Cerrar después de 3 segundos
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 4000); // Duración de la animación
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          🎡 Ruleta de Descuentos
        </h2>
        <p className="text-center text-gray-600 mb-6">
          ¡Gira la ruleta y gana descuentos especiales!
        </p>

        {/* Ruleta */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          {/* Indicador superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-red-500"></div>
          </div>

          {/* Círculo de la ruleta */}
          <div 
            className="w-full h-full rounded-full border-8 border-gray-800 relative overflow-hidden shadow-xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
            }}
          >
            {segments.map((segment, index) => {
              const angle = (360 / segments.length) * index;
              return (
                <div
                  key={index}
                  className={`absolute w-full h-full bg-gradient-to-br ${segment.color}`}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%)',
                    transformOrigin: '50% 50%'
                  }}
                >
                  <div 
                    className="absolute top-8 left-1/2 text-white font-bold text-lg"
                    style={{ transform: 'translateX(-50%)' }}
                  >
                    {segment.label}
                  </div>
                </div>
              );
            })}
            
            {/* Centro de la ruleta */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-800 flex items-center justify-center text-2xl font-bold shadow-lg">
              🎁
            </div>
          </div>
        </div>

        {/* Resultado */}
        {result !== null && (
          <div className={`text-center p-4 rounded-xl mb-4 ${
            result > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {result > 0 ? (
              <>
                <p className="text-2xl font-bold">🎉 ¡Ganaste {result}% OFF!</p>
                <p className="text-sm mt-1">Código: RULETA{result}</p>
              </>
            ) : (
              <p className="text-lg font-bold">¡Sigue participando! 💪</p>
            )}
          </div>
        )}

        {/* Botón de girar */}
        <button
          onClick={spinWheel}
          disabled={isSpinning || result !== null}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg ${
            isSpinning || result !== null
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transform hover:scale-105'
          }`}
        >
          {isSpinning ? '🎡 Girando...' : result !== null ? '✅ ¡Listo!' : '🎯 ¡Girar Ruleta!'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          * Solo una vez por usuario. Válido por 7 días.
        </p>
      </div>
    </div>
  );
};

export default DiscountWheel;
