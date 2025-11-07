import { body, param, query, ValidationChain } from 'express-validator';

// =====================================
// VALIDADORES DE AUTENTICACIÓN
// =====================================

export const registerValidator: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nombre debe tener entre 2 y 100 caracteres'),
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  body('rut')
    .optional()
    .trim()
    .isLength({ min: 8, max: 12 })
    .withMessage('RUT inválido'),
];

export const loginValidator: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Contraseña requerida'),
];

// =====================================
// VALIDADORES DE PRODUCTOS
// =====================================

export const createProductValidator: ValidationChain[] = [
  body('nombre')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Nombre debe tener entre 3 y 200 caracteres'),
  body('descripcion')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Descripción debe tener entre 10 y 2000 caracteres'),
  body('precio')
    .isFloat({ min: 0.01, max: 100000000 })
    .withMessage('Precio debe ser mayor a 0'),
  body('descuento')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Descuento debe estar entre 0 y 100'),
  body('stock')
    .isInt({ min: 0, max: 100000 })
    .withMessage('Stock debe ser un número positivo'),
  body('imagenes')
    .isArray({ min: 1, max: 10 })
    .withMessage('Debe haber entre 1 y 10 imágenes'),
  body('imagenes.*')
    .isURL()
    .withMessage('Cada imagen debe ser una URL válida'),
  body('categoria')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Categoría inválida'),
];

export const updateProductValidator: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('ID de producto inválido'),
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 }),
  body('precio')
    .optional()
    .isFloat({ min: 0.01 }),
  body('descuento')
    .optional()
    .isFloat({ min: 0, max: 100 }),
  body('stock')
    .optional()
    .isInt({ min: 0 }),
  body('imagenes')
    .optional()
    .isArray({ min: 1, max: 10 }),
  body('categoria')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }),
];

export const productIdValidator: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('ID de producto inválido'),
];

// =====================================
// VALIDADORES DE ÓRDENES
// =====================================

export const checkoutValidator: ValidationChain[] = [
  body('items')
    .isArray({ min: 1, max: 50 })
    .withMessage('El carrito debe tener entre 1 y 50 items'),
  body('items.*.productId')
    .isUUID()
    .withMessage('ID de producto inválido'),
  body('items.*.cantidad')
    .isInt({ min: 1, max: 100 })
    .withMessage('Cantidad debe estar entre 1 y 100'),
  
  body('esInvitado')
    .optional()
    .isBoolean()
    .withMessage('esInvitado debe ser booleano'),
  
  // Validaciones para invitados
  body('emailInvitado')
    .if(body('esInvitado').equals('true'))
    .isEmail()
    .normalizeEmail()
    .withMessage('Email de invitado inválido'),
  body('nombreInvitado')
    .if(body('esInvitado').equals('true'))
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nombre de invitado inválido'),
  body('rutInvitado')
    .optional()
    .trim()
    .isLength({ min: 8, max: 12 })
    .withMessage('RUT inválido'),
  
  // Dirección de envío
  body('direccion')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Dirección debe tener entre 5 y 200 caracteres'),
  body('ciudad')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Ciudad inválida'),
  body('region')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Región inválida'),
  body('codigoPostal')
    .optional()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Código postal inválido'),
  
  body('costoEnvio')
    .optional()
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('Costo de envío inválido'),
  
  body('couponId')
    .optional()
    .isUUID()
    .withMessage('ID de cupón inválido'),
  body('descuento')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Descuento inválido'),
];

// =====================================
// VALIDADORES DE CUPONES
// =====================================

export const createCouponValidator: ValidationChain[] = [
  body('codigo')
    .trim()
    .isLength({ min: 3, max: 50 })
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Código debe ser alfanumérico en mayúsculas'),
  body('tipo')
    .isIn(['PERCENTAGE', 'FIXED'])
    .withMessage('Tipo debe ser PERCENTAGE o FIXED'),
  body('valor')
    .isFloat({ min: 0.01 })
    .withMessage('Valor debe ser mayor a 0'),
  body('minCompra')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monto mínimo inválido'),
  body('maxUsos')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Máximo de usos debe ser al menos 1'),
  body('fechaExpiracion')
    .optional()
    .isISO8601()
    .withMessage('Fecha de expiración inválida'),
];

export const validateCouponValidator: ValidationChain[] = [
  body('codigo')
    .trim()
    .notEmpty()
    .withMessage('Código requerido'),
  body('total')
    .isFloat({ min: 0.01 })
    .withMessage('Total inválido'),
];

// =====================================
// VALIDADORES DE REVIEWS
// =====================================

export const createReviewValidator: ValidationChain[] = [
  body('productId')
    .isUUID()
    .withMessage('ID de producto inválido'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating debe estar entre 1 y 5'),
  body('comentario')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comentario debe tener entre 10 y 1000 caracteres'),
];

export const reviewIdValidator: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('ID de review inválido'),
];

// =====================================
// VALIDADORES DE CONTACTO
// =====================================

export const contactValidator: ValidationChain[] = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('mensaje')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Mensaje debe tener entre 10 y 2000 caracteres'),
];

// =====================================
// VALIDADORES DE NEWSLETTER
// =====================================

export const newsletterValidator: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
];

// =====================================
// VALIDADORES DE PAGINACIÓN
// =====================================

export const paginationValidator: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Página debe ser un número positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
];

// =====================================
// VALIDADORES DE BÚSQUEDA
// =====================================

export const searchValidator: ValidationChain[] = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Búsqueda inválida'),
  query('categoria')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Categoría inválida'),
  query('minPrecio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Precio mínimo inválido'),
  query('maxPrecio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Precio máximo inválido'),
];
