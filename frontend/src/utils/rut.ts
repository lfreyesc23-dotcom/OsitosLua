/**
 * Utilidades para validación y formato de RUT chileno
 */

/**
 * Limpia el RUT removiendo puntos y guión
 */
export const cleanRut = (rut: string): string => {
  return rut.replace(/[.-]/g, '').toUpperCase();
};

/**
 * Formatea el RUT con puntos y guión (12.345.678-9)
 */
export const formatRut = (rut: string): string => {
  const cleaned = cleanRut(rut);
  
  if (cleaned.length < 2) return cleaned;
  
  const dv = cleaned.slice(-1);
  const numbers = cleaned.slice(0, -1);
  
  // Agregar puntos de miles
  const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formatted}-${dv}`;
};

/**
 * Calcula el dígito verificador de un RUT
 */
const calculateDV = (rut: string): string => {
  const numbers = rut.replace(/[^0-9]/g, '');
  let sum = 0;
  let multiplier = 2;
  
  // Sumar dígitos multiplicados de derecha a izquierda
  for (let i = numbers.length - 1; i >= 0; i--) {
    sum += parseInt(numbers[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const dv = 11 - remainder;
  
  if (dv === 11) return '0';
  if (dv === 10) return 'K';
  return dv.toString();
};

/**
 * Valida si un RUT es válido
 */
export const validateRut = (rut: string): boolean => {
  if (!rut || rut.trim() === '') return false;
  
  const cleaned = cleanRut(rut);
  
  // Debe tener al menos 2 caracteres (número + DV)
  if (cleaned.length < 2) return false;
  
  // Separar número y DV
  const dv = cleaned.slice(-1);
  const numbers = cleaned.slice(0, -1);
  
  // Validar que la parte numérica solo tenga dígitos
  if (!/^\d+$/.test(numbers)) return false;
  
  // Validar que el DV sea válido (0-9 o K)
  if (!/^[0-9K]$/.test(dv)) return false;
  
  // Calcular y comparar DV
  const calculatedDV = calculateDV(numbers);
  
  return dv === calculatedDV;
};

/**
 * Formatea el RUT mientras el usuario escribe
 * Útil para onChange events
 */
export const formatRutOnInput = (value: string): string => {
  // Remover todo excepto números y K
  let cleaned = value.replace(/[^0-9Kk]/g, '').toUpperCase();
  
  // Limitar longitud máxima (12 dígitos + 1 DV)
  if (cleaned.length > 9) {
    cleaned = cleaned.substring(0, 9);
  }
  
  // Si no hay caracteres, retornar vacío
  if (cleaned.length === 0) return '';
  
  // Si solo hay un caracter, retornarlo
  if (cleaned.length === 1) return cleaned;
  
  // Separar número y DV
  const dv = cleaned.slice(-1);
  const numbers = cleaned.slice(0, -1);
  
  // Formatear con puntos
  const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formatted}-${dv}`;
};

/**
 * Obtiene mensaje de error para RUT inválido
 */
export const getRutErrorMessage = (rut: string): string | null => {
  if (!rut || rut.trim() === '') {
    return 'El RUT es obligatorio';
  }
  
  const cleaned = cleanRut(rut);
  
  if (cleaned.length < 2) {
    return 'RUT demasiado corto';
  }
  
  if (cleaned.length < 7) {
    return 'RUT inválido: debe tener al menos 7 dígitos';
  }
  
  if (!validateRut(rut)) {
    return 'RUT inválido: verifica el dígito verificador';
  }
  
  return null;
};

/**
 * Componente de input para RUT con validación
 * Retorna el valor formateado y el estado de validación
 */
export const useRutInput = (initialValue: string = '') => {
  const [value, setValue] = React.useState(initialValue);
  const [isValid, setIsValid] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const handleChange = (newValue: string) => {
    const formatted = formatRutOnInput(newValue);
    setValue(formatted);
    
    const valid = validateRut(formatted);
    setIsValid(valid);
    
    if (formatted && !valid) {
      setError(getRutErrorMessage(formatted));
    } else {
      setError(null);
    }
  };
  
  return {
    value,
    isValid,
    error,
    onChange: handleChange,
    formatted: value,
    clean: cleanRut(value)
  };
};

// Para uso sin React hooks
import React from 'react';
