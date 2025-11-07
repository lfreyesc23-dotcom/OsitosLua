#!/usr/bin/env python3
"""
Script para procesar las imágenes del logo y generar iconos PWA
en los tamaños correctos
"""

from PIL import Image
import os

# Configuración
WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(WORKSPACE_DIR, 'frontend', 'public')

# Archivos de entrada (imágenes subidas por el usuario)
# Estos archivos deben estar en el directorio actual
INPUT_IMAGES = [
    'image.png',  # Primera imagen
    'image (1).png',  # Segunda imagen
    'image (2).png'   # Tercera imagen (con círculo)
]

# Tamaños de salida requeridos para PWA
OUTPUT_SIZES = [
    {'name': 'pwa-192x192.png', 'size': (192, 192)},
    {'name': 'pwa-512x512.png', 'size': (512, 512)},
    {'name': 'apple-touch-icon.png', 'size': (180, 180)},
]

def find_input_image():
    """Busca la mejor imagen de entrada disponible"""
    for img_name in INPUT_IMAGES:
        img_path = os.path.join(WORKSPACE_DIR, img_name)
        if os.path.exists(img_path):
            print(f"✅ Usando imagen: {img_name}")
            return img_path
    
    # Si no encuentra las imágenes con esos nombres, buscar cualquier PNG reciente
    png_files = [f for f in os.listdir(WORKSPACE_DIR) if f.lower().endswith('.png')]
    if png_files:
        # Ordenar por fecha de modificación (más reciente primero)
        png_files.sort(key=lambda x: os.path.getmtime(os.path.join(WORKSPACE_DIR, x)), reverse=True)
        img_path = os.path.join(WORKSPACE_DIR, png_files[0])
        print(f"✅ Usando imagen más reciente: {png_files[0]}")
        return img_path
    
    return None

def process_image(input_path, output_path, size):
    """Redimensiona la imagen al tamaño especificado manteniendo calidad"""
    try:
        # Abrir imagen
        img = Image.open(input_path)
        
        # Convertir a RGBA si no lo es (para mantener transparencia)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Redimensionar con alta calidad (LANCZOS es el mejor filtro)
        img_resized = img.resize(size, Image.Resampling.LANCZOS)
        
        # Guardar como PNG con máxima calidad
        img_resized.save(output_path, 'PNG', optimize=True)
        
        # Obtener tamaño del archivo
        file_size = os.path.getsize(output_path) / 1024  # KB
        print(f"✅ Generado: {os.path.basename(output_path)} ({size[0]}x{size[1]}px, {file_size:.1f}KB)")
        
    except Exception as e:
        print(f"❌ Error procesando {output_path}: {e}")

def main():
    print("🎨 Procesando logos de OsitosLua para iconos PWA...\n")
    
    # Crear directorio public si no existe
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    
    # Buscar imagen de entrada
    input_image = find_input_image()
    
    if not input_image:
        print("❌ ERROR: No se encontró ninguna imagen PNG en el directorio")
        print("   Por favor, coloca la imagen del logo en:")
        print(f"   {WORKSPACE_DIR}/")
        return
    
    print(f"📂 Directorio de salida: {PUBLIC_DIR}\n")
    
    # Generar cada tamaño
    for output in OUTPUT_SIZES:
        output_path = os.path.join(PUBLIC_DIR, output['name'])
        process_image(input_image, output_path, output['size'])
    
    print("\n✨ ¡Iconos PWA generados exitosamente!")
    print("\n📋 Archivos creados:")
    for output in OUTPUT_SIZES:
        output_path = os.path.join(PUBLIC_DIR, output['name'])
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path) / 1024
            print(f"   ✅ {output['name']} ({file_size:.1f}KB)")
    
    print("\n🚀 Próximos pasos:")
    print("   1. Verificar iconos en /frontend/public/")
    print("   2. Probar PWA: cd frontend && npm run dev")
    print("   3. Abrir DevTools → Application → Manifest")

if __name__ == "__main__":
    main()
