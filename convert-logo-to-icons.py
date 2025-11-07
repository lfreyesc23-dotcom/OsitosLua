#!/usr/bin/env python3
"""
Script para convertir las imágenes del portapapeles/adjuntas a iconos PWA
INSTRUCCIONES DE USO:
1. Descarga una de las 3 imágenes que mostraste
2. Guárdala como "logo-ositoslua.png" en /Users/luisreyes/OsitosLua/
3. Ejecuta: python3 convert-logo-to-icons.py
"""

from PIL import Image
import os
import sys

# Configuración
WORKSPACE_DIR = '/Users/luisreyes/OsitosLua'
PUBLIC_DIR = os.path.join(WORKSPACE_DIR, 'frontend', 'public')

# Nombres posibles para la imagen de entrada
INPUT_NAMES = [
    'logo-ositoslua.png',
    'logo.png',
    'ositoslua.png',
    'icon.png',
    'teddy.png'
]

# Tamaños PWA requeridos
SIZES = {
    'pwa-192x192.png': 192,
    'pwa-512x512.png': 512,
    'apple-touch-icon.png': 180,
}

def find_logo():
    """Busca el logo en el directorio"""
    for name in INPUT_NAMES:
        path = os.path.join(WORKSPACE_DIR, name)
        if os.path.exists(path):
            return path
    return None

def create_icon(input_path, output_path, size):
    """Crea un icono del tamaño especificado"""
    try:
        with Image.open(input_path) as img:
            # Convertir a RGBA para transparencia
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # Redimensionar con alta calidad
            icon = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Guardar
            icon.save(output_path, 'PNG', optimize=True, quality=95)
            
            kb = os.path.getsize(output_path) / 1024
            print(f"✅ {os.path.basename(output_path)} - {size}x{size}px ({kb:.1f}KB)")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    return True

def main():
    print("=" * 60)
    print("🧸 GENERADOR DE ICONOS PWA - OSITOSLUA")
    print("=" * 60)
    
    # Buscar logo
    logo_path = find_logo()
    
    if not logo_path:
        print("\n❌ ERROR: No se encontró el logo")
        print("\n📝 INSTRUCCIONES:")
        print("   1. Guarda una de las 3 imágenes que mostraste como:")
        print(f"      {WORKSPACE_DIR}/logo-ositoslua.png")
        print("\n   2. Ejecuta nuevamente:")
        print("      python3 convert-logo-to-icons.py")
        print("\n   Nombres aceptados:")
        for name in INPUT_NAMES:
            print(f"      - {name}")
        return 1
    
    print(f"\n✅ Logo encontrado: {os.path.basename(logo_path)}")
    
    # Crear directorio si no existe
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    print(f"📂 Destino: frontend/public/\n")
    
    # Generar iconos
    success_count = 0
    for filename, size in SIZES.items():
        output_path = os.path.join(PUBLIC_DIR, filename)
        if create_icon(logo_path, output_path, size):
            success_count += 1
    
    print("\n" + "=" * 60)
    if success_count == len(SIZES):
        print("✨ ¡ÉXITO! Todos los iconos fueron generados")
        print("=" * 60)
        print("\n🚀 PRÓXIMOS PASOS:")
        print("   1. Verifica los iconos:")
        print("      ls -lh frontend/public/*.png")
        print("\n   2. Prueba la PWA:")
        print("      cd frontend && npm run dev")
        print("\n   3. Abre Chrome DevTools → Application → Manifest")
        return 0
    else:
        print(f"⚠️ Solo se generaron {success_count} de {len(SIZES)} iconos")
        return 1

if __name__ == "__main__":
    sys.exit(main())
