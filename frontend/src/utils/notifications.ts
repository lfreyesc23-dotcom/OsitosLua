type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationConfig {
  message: string;
  type?: NotificationType;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

const getNotificationStyles = (type: NotificationType, position: string) => {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-orange-500',
    info: 'bg-blue-500'
  };

  const positions = {
    'top-right': 'top-20 right-4',
    'top-center': 'top-20 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return `fixed ${positions[position as keyof typeof positions]} ${bgColors[type]} text-white px-6 py-3 rounded-xl shadow-2xl z-[9999] animate-slide-in min-w-[300px] max-w-md`;
};

export const showNotification = ({
  message,
  type = 'success',
  duration = 3000,
  position = 'top-right'
}: NotificationConfig) => {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = getNotificationStyles(type, position);
  
  // Contenido con icono
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-2xl">${icons[type]}</span>
      <p class="font-medium">${message}</p>
    </div>
  `;

  // Agregar al DOM
  document.body.appendChild(notification);

  // Animar entrada
  setTimeout(() => {
    notification.style.animation = 'slide-in 0.3s ease-out';
  }, 10);

  // Remover después del duration
  setTimeout(() => {
    notification.style.animation = 'slide-out 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, duration);

  return notification;
};

// Funciones de atajo
export const showSuccess = (message: string, duration?: number) => {
  return showNotification({ message, type: 'success', duration });
};

export const showError = (message: string, duration?: number) => {
  return showNotification({ message, type: 'error', duration });
};

export const showWarning = (message: string, duration?: number) => {
  return showNotification({ message, type: 'warning', duration });
};

export const showInfo = (message: string, duration?: number) => {
  return showNotification({ message, type: 'info', duration });
};
