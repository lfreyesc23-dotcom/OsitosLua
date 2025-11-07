import { useState } from 'react';
import { formatRutOnInput, validateRut, getRutErrorMessage } from '../utils/rut';

interface RutInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  showValidation?: boolean;
}

const RutInput = ({ 
  value, 
  onChange, 
  placeholder = 'Ej: 12.345.678-9',
  className = 'input',
  required = false,
  disabled = false,
  showValidation = true
}: RutInputProps) => {
  const [touched, setTouched] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRutOnInput(e.target.value);
    onChange(formatted);
  };
  
  const handleBlur = () => {
    setTouched(true);
  };
  
  const isValid = validateRut(value);
  const error = touched && value ? getRutErrorMessage(value) : null;
  const showError = showValidation && touched && !isValid && value;
  
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`${className} ${showError ? 'border-red-500 focus:ring-red-500' : ''} ${isValid && value ? 'border-green-500' : ''}`}
          required={required}
          disabled={disabled}
          maxLength={12}
        />
        {showValidation && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <span className="text-green-500 text-xl">✓</span>
            ) : touched ? (
              <span className="text-red-500 text-xl">✗</span>
            ) : null}
          </div>
        )}
      </div>
      {showError && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      {showValidation && isValid && value && (
        <p className="text-green-600 text-xs mt-1">✓ RUT válido</p>
      )}
    </div>
  );
};

export default RutInput;
