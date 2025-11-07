import { useState, useEffect, useRef } from 'react';
import { searchAddress } from '../utils/geocoding';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, postalCode?: string) => void;
  onSelect?: (lat: number, lon: number, comuna: string, postalCode?: string) => void;
  placeholder?: string;
  className?: string;
}

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  onSelect,
  placeholder = 'Buscar dirección...',
  className = ''
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<number>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    
    // Limpiar timeout anterior
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Si el input está vacío, limpiar sugerencias
    if (!inputValue.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Buscar después de 500ms de inactividad
    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchAddress(inputValue);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error buscando direcciones:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const address = suggestion.display_name;
    const comuna = suggestion.address.municipality || 
                    suggestion.address.city || 
                    suggestion.address.town || 
                    suggestion.address.suburb || 
                    '';
    const postalCode = suggestion.address.postcode;
    
    onChange(address, postalCode);
    setShowSuggestions(false);
    setSuggestions([]);

    if (onSelect) {
      onSelect(
        parseFloat(suggestion.lat),
        parseFloat(suggestion.lon),
        comuna,
        postalCode
      );
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={className}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">📍</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {suggestion.address.road || suggestion.address.suburb || 'Dirección'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {suggestion.address.municipality || suggestion.address.city || suggestion.address.town}
                    {suggestion.address.postcode && ` - CP: ${suggestion.address.postcode}`}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !isSearching && value.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            No se encontraron direcciones. Puedes escribir manualmente.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
