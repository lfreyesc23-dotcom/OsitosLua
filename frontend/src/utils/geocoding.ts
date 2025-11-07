// Servicio de geocodificación usando Nominatim (OpenStreetMap - gratuito)
interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    municipality?: string;
    suburb?: string;
    postcode?: string;
    state?: string;
    country?: string;
  };
}

/**
 * Buscar direcciones en Chile usando Nominatim
 */
export const searchAddress = async (query: string): Promise<GeocodingResult[]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query + ', Chile')}` +
      `&format=json` +
      `&addressdetails=1` +
      `&limit=5` +
      `&countrycodes=cl`,
      {
        headers: {
          'User-Agent': 'OsitosLua E-commerce App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error en la búsqueda de direcciones');
    }

    return await response.json();
  } catch (error) {
    console.error('Error buscando dirección:', error);
    return [];
  }
};

/**
 * Obtener coordenadas de una dirección específica
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    const results = await searchAddress(address);
    if (results.length > 0) {
      return {
        lat: parseFloat(results[0].lat),
        lon: parseFloat(results[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Error en geocodificación:', error);
    return null;
  }
};

/**
 * Calcular distancia entre dos puntos (fórmula de Haversine)
 * Retorna distancia en kilómetros
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Coordenadas de La Cisterna, Santiago
 */
export const LA_CISTERNA_COORDS = {
  lat: -33.5327,
  lon: -70.6656
};

/**
 * Calcular costo de envío basado en ubicación
 */
export const calculateShippingCost = async (address: string, comuna: string): Promise<{
  costo: number;
  mensaje: string;
  distancia?: number;
}> => {
  try {
    // Si es La Cisterna, costo fijo de $3,000
    if (comuna.toLowerCase().includes('cisterna')) {
      return {
        costo: 3000,
        mensaje: '📍 Envío a La Cisterna - Despacho en el día',
        distancia: 0
      };
    }

    // Geocodificar la dirección
    const coords = await geocodeAddress(`${address}, ${comuna}, Chile`);
    
    if (!coords) {
      return {
        costo: 0,
        mensaje: '⚠️ No pudimos calcular el envío automáticamente. Te contactaremos para coordinar con Starken.',
        distancia: undefined
      };
    }

    // Calcular distancia desde La Cisterna
    const distancia = calculateDistance(
      LA_CISTERNA_COORDS.lat,
      LA_CISTERNA_COORDS.lon,
      coords.lat,
      coords.lon
    );

    // Dentro de 30km: $5,000
    if (distancia <= 30) {
      return {
        costo: 5000,
        mensaje: `🚚 Envío a ${Math.round(distancia)}km de distancia - Despacho en 24-48 horas`,
        distancia
      };
    }

    // Fuera de 30km: Evaluado por Starken
    return {
      costo: 0,
      mensaje: `📦 Distancia ${Math.round(distancia)}km - Envío coordinado con Starken. Te contactaremos con el costo exacto.`,
      distancia
    };

  } catch (error) {
    console.error('Error calculando costo de envío:', error);
    return {
      costo: 0,
      mensaje: '⚠️ Error al calcular envío. Te contactaremos para coordinar.',
      distancia: undefined
    };
  }
};

/**
 * Obtener código postal de coordenadas
 */
export const getPostalCodeFromCoords = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
      `lat=${lat}` +
      `&lon=${lon}` +
      `&format=json` +
      `&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'OsitosLua E-commerce App'
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.address?.postcode || null;
  } catch (error) {
    console.error('Error obteniendo código postal:', error);
    return null;
  }
};
