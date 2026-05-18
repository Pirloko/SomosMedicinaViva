/**
 * Comprime imágenes en el navegador a WebP con tamaño máximo razonable
 * para reducir egress en Supabase Storage y mejorar tiempos de carga.
 */

export type ImageUploadFolder = 'productos' | 'ingredientes' | 'otros'

type CompressPreset = {
  maxWidth: number
  maxHeight: number
  initialQuality: number
  minQuality: number
  maxOutputBytes: number
}

const PRESETS: Record<ImageUploadFolder, CompressPreset> = {
  /** Catálogo y modales: suficiente para ~400–800px en pantalla */
  productos: {
    maxWidth: 960,
    maxHeight: 960,
    initialQuality: 0.85,
    minQuality: 0.55,
    maxOutputBytes: 480 * 1024,
  },
  /** Thumbnails en listas admin / ingredientes */
  ingredientes: {
    maxWidth: 560,
    maxHeight: 560,
    initialQuality: 0.82,
    minQuality: 0.5,
    maxOutputBytes: 220 * 1024,
  },
  /** Hero, puntos de venta, about, fondo: un poco más grande */
  otros: {
    maxWidth: 1400,
    maxHeight: 1400,
    initialQuality: 0.82,
    minQuality: 0.52,
    maxOutputBytes: 900 * 1024,
  },
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}

function scaleToFit(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1)
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  }
}

/**
 * Convierte a WebP redimensionando y bajando calidad si hace falta para cumplir maxOutputBytes.
 */
export async function compressImageToWebP(
  file: File,
  folder: ImageUploadFolder
): Promise<File> {
  const preset = PRESETS[folder]
  const img = await loadImageFromFile(file)
  const { width: tw, height: th } = scaleToFit(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
    preset.maxWidth,
    preset.maxHeight
  )

  const canvas = document.createElement('canvas')
  canvas.width = tw
  canvas.height = th
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('No se pudo preparar la compresión')
  }
  ctx.drawImage(img, 0, 0, tw, th)

  let quality = preset.initialQuality
  let blob: Blob | null = null

  while (quality >= preset.minQuality) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', quality)
    })
    if (blob && blob.size <= preset.maxOutputBytes) {
      break
    }
    quality -= 0.06
  }

  if (!blob || blob.size === 0) {
    throw new Error('No se pudo generar WebP')
  }

  if (blob.size > preset.maxOutputBytes * 1.2) {
    throw new Error(
      'La imagen sigue siendo muy pesada tras comprimir. Prueba con una foto más pequeña o de menor resolución.'
    )
  }

  const baseName = file.name.replace(/\.[^/.]+$/, '') || 'imagen'
  return new File([blob], `${baseName}.webp`, {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}
