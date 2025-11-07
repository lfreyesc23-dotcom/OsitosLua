#!/usr/bin/env python3
"""
Script para generar iconos PWA simples con PIL/Pillow
Ejecutar: python3 generate-pwa-icons.py
Requiere: pip install pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Configuración
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), 'frontend', 'public')
BACKGROUND_COLOR = (255, 182, 193)  # Rosa pastel #FFB6C1

# Iconos a generar
ICONS = [
    {'name': 'pwa-192x192.png', 'size': 192},
    {'name': 'pwa-512x512.png', 'size': 512},
    {'name': 'apple-touch-icon.png', 'size': 180},
]

def generate_icon(size, output_path):
    """Genera un icono con fondo rosa y texto 'OL'"""
    # Crear imagen con fondo rosa
    img = Image.new('RGB', (size, size), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Círculo decorativo blanco semi-transparente
    circle_radius = int(size * 0.4)
    circle_bbox = [
        size // 2 - circle_radius,
        size // 2 - circle_radius,
        size // 2 + circle_radius,
        size // 2 + circle_radius
    ]
    draw.ellipse(circle_bbox, fill=(255, 255, 255, 50))
    
    # Texto "OL" (OsitosLua)
    text = "🧸"
    try:
        # Intentar usar una fuente grande
        font_size = int(size * 0.5)
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", font_size)
    except:
        # Fallback a fuente por defecto
        font = ImageFont.load_default()
        text = "OL"  # Cambiar a iniciales si no hay fuente para emoji
    
    # Centrar texto
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size - text_width) // 2, (size - text_height) // 2 - int(size * 0.05))
    
    # Dibujar texto
    draw.text(position, text, fill=(139, 69, 19), font=font)  # Marrón #8B4513
    
    # Guardar
    img.save(output_path, 'PNG')
    print(f"✅ Generado: {output_path}")

def main():
    # Crear directorio si no existe
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    
    print("🎨 Generando iconos PWA...\n")
    
    # Generar cada icono
    for icon in ICONS:
        output_path = os.path.join(PUBLIC_DIR, icon['name'])
        try:
            generate_icon(icon['size'], output_path)
        except Exception as e:
            print(f"❌ Error generando {icon['name']}: {e}")
    
    print("\n✨ ¡Iconos generados exitosamente!")
    print("\n📝 Notas:")
    print("- Los iconos tienen fondo rosa pastel (#FFB6C1)")
    print("- El emoji 🧸 puede no renderizar, se usa 'OL' como fallback")
    print("- Puedes mejorar con: https://realfavicongenerator.net/")
    print("- O crear un logo SVG profesional y convertir a PNG")

if __name__ == "__main__":
    main()
