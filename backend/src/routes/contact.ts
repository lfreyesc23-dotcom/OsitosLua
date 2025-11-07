import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../utils/email';
import { validateRut, cleanRut } from '../utils/rut';

const router = Router();
const prisma = new PrismaClient();

// Enviar mensaje de contacto
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, mensaje, rut } = req.body;

    if (!nombre || !email || !mensaje) {
      res.status(400).json({ error: 'Todos los campos son requeridos' });
      return;
    }

    // Validar RUT si se proporcionó
    if (rut) {
      const cleanedRut = cleanRut(rut);
      if (!validateRut(cleanedRut)) {
        res.status(400).json({ error: 'El RUT ingresado no es válido' });
        return;
      }
    }

    // Guardar en base de datos como sugerencia/contacto
    const sugerencia = await prisma.suggestion.create({
      data: {
        nombre,
        email,
        mensaje,
      },
    });

    // Enviar email al admin
    const emailAdmin = process.env.EMAIL_USER;
    
    await sendEmail({
      to: emailAdmin!,
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF69B4;">📧 Nuevo Mensaje de Contacto</h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>De:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${rut ? `<p><strong>RUT:</strong> ${rut}</p>` : ''}
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CL')}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-left: 4px solid #FF69B4; margin: 20px 0;">
            <h3 style="color: #4B0082; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6;">${mensaje}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px;">
            Puedes responder directamente a: <a href="mailto:${email}">${email}</a>
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">
              OsitosLua - Sistema de Contacto 🧸
            </p>
          </div>
        </div>
      `,
    });

    res.status(201).json({
      message: '¡Mensaje enviado exitosamente! Te responderemos pronto.',
      sugerencia,
    });
  } catch (error) {
    console.error('Error al enviar mensaje de contacto:', error);
    res.status(500).json({ error: 'Error al enviar mensaje de contacto' });
  }
});

export default router;
