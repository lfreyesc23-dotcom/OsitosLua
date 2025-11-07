import express, { Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { protect, admin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Configurar multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  },
});

// Subir imagen a Cloudinary (protegido - solo admin)
router.post(
  '/',
  protect as any,
  admin as any,
  upload.single('image'),
  async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
      }

      // Subir a Cloudinary usando un stream
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'ositoslua',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(req.file!.buffer);
      });

      const result: any = await uploadPromise;

      res.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      res.status(500).json({ message: 'Error al subir la imagen' });
    }
  }
);

export default router;
