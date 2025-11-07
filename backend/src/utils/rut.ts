/**
 * Utilidades para validación de RUT chileno
 */

/**
 * Limpia el RUT removiendo puntos y guión
 */
export const cleanRut = (rut: string): string => {
  return rut.replace(/[.-]/g, '').toUpperCase();
};

/**
 * Calcula el dígito verificador de un RUT
 */
const calculateDV = (rut: string): string => {
  const numbers = rut.replace(/[^0-9]/g, '');
  let sum = 0;
  let multiplier = 2;
  
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
  
  if (cleaned.length < 2) return false;
  
  const dv = cleaned.slice(-1);
  const numbers = cleaned.slice(0, -1);
  
  if (!/^\d+$/.test(numbers)) return false;
  if (!/^[0-9K]$/.test(dv)) return false;
  
  const calculatedDV = calculateDV(numbers);
  
  return dv === calculatedDV;
};

/**
 * Formatea el RUT con puntos y guión
 */
export const formatRut = (rut: string): string => {
  const cleaned = cleanRut(rut);
  
  if (cleaned.length < 2) return cleaned;
  
  const dv = cleaned.slice(-1);
  const numbers = cleaned.slice(0, -1);
  
  const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formatted}-${dv}`;
};
