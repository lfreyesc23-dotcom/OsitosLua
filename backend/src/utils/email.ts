import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    await transporter.sendMail({
      from: `"OsitosLua 🧸" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email enviado a: ${to}`);
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderId: string,
  total: number,
  items: any[],
  direccionEnvio?: {
    direccion?: string | null;
    ciudad?: string | null;
    region?: string | null;
    codigoPostal?: string | null;
    costoEnvio?: number;
  }
) => {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.nombre}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.cantidad}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.product.precio.toLocaleString('es-CL')}</td>
    </tr>
  `
    )
    .join('');

  const direccionHtml = direccionEnvio
    ? `
    <h3 style="color: #4B0082;">📦 Dirección de Envío:</h3>
    <div style="background: white; padding: 15px; border-left: 4px solid #FF69B4; margin: 20px 0;">
      <p><strong>Dirección:</strong> ${direccionEnvio.direccion}</p>
      <p><strong>Ciudad:</strong> ${direccionEnvio.ciudad}</p>
      <p><strong>Región:</strong> ${direccionEnvio.region}</p>
      ${direccionEnvio.codigoPostal ? `<p><strong>Código Postal:</strong> ${direccionEnvio.codigoPostal}</p>` : ''}
      ${direccionEnvio.costoEnvio ? `<p><strong>Costo de Envío:</strong> $${direccionEnvio.costoEnvio.toLocaleString('es-CL')}</p>` : ''}
    </div>
  `
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF69B4, #4B0082); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        th { background: #FF69B4; color: white; padding: 10px; text-align: left; }
        .total { font-size: 20px; font-weight: bold; color: #4B0082; text-align: right; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧸 ¡Gracias por tu compra!</h1>
        </div>
        <div class="content">
          <p>Hola,</p>
          <p>Tu pedido ha sido confirmado y está siendo procesado.</p>
          <p><strong>Número de orden:</strong> #${orderId.substring(0, 8)}</p>
          
          <h3 style="color: #4B0082;">Resumen de tu pedido:</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="total">
            Total: $${total.toLocaleString('es-CL')}
          </div>
          
          ${direccionHtml}
          
          <p style="margin-top: 30px;">Recibirás una notificación cuando tu pedido sea enviado.</p>
          
          <div class="footer">
            <p>¡Gracias por confiar en OsitosLua! 💕</p>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `✅ Confirmación de Pedido #${orderId.substring(0, 8)}`,
    html,
  });
};
