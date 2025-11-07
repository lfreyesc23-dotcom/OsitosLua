import { Router, Request, Response } from 'express';

const router = Router();

// Calcular costo de envío
router.post('/calculate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { ciudad, region } = req.body;

    if (!ciudad || !region) {
      res.status(400).json({ error: 'Ciudad y región son requeridas' });
      return;
    }

    let costoEnvio = 0;

    // Normalizar strings para comparación
    const ciudadLower = ciudad.toLowerCase().trim();
    const regionLower = region.toLowerCase().trim();

    // Santiago - Lo Valledor y La Cisterna (envío gratis o bajo costo)
    if (
      regionLower.includes('metropolitana') ||
      regionLower.includes('santiago')
    ) {
      if (
        ciudadLower.includes('lo valledor') ||
        ciudadLower.includes('valledor')
      ) {
        costoEnvio = 0; // Gratis en Lo Valledor
      } else if (
        ciudadLower.includes('la cisterna') ||
        ciudadLower.includes('cisterna')
      ) {
        costoEnvio = 2000; // $2.000 en La Cisterna
      } else {
        costoEnvio = 5000; // $5.000 en otras comunas de Santiago
      }
    } else {
      // Regiones
      costoEnvio = 8000; // $8.000 a regiones
    }

    res.json({
      ciudad,
      region,
      costoEnvio,
      mensaje: getCostoEnvioMensaje(costoEnvio, ciudadLower),
    });
  } catch (error) {
    console.error('Error al calcular envío:', error);
    res.status(500).json({ error: 'Error al calcular costo de envío' });
  }
});

function getCostoEnvioMensaje(costo: number, ciudad: string): string {
  if (costo === 0) {
    return '¡Envío gratis! Estás en nuestra zona de cobertura.';
  } else if (costo === 2000) {
    return 'Envío cercano: $2.000';
  } else if (costo === 5000) {
    return 'Envío en Santiago: $5.000';
  } else {
    return 'Envío a regiones: $8.000';
  }
}

export default router;
