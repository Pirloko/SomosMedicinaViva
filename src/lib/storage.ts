import { supabase } from './supabase'

// Nombre del bucket para imágenes
const BUCKET_NAME = 'imagenes'

// Tipos de archivo permitidos (entrada antes de comprimir a WebP)
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
/** Máximo del archivo original que el usuario elige (se comprime en cliente antes de subir) */
const MAX_INPUT_FILE_SIZE = 15 * 1024 * 1024 // 15MB
/** Máximo del archivo ya comprimido que se envía a Storage */
const MAX_UPLOAD_FILE_SIZE = 1.5 * 1024 * 1024 // 1.5MB

/**
 * Subir imagen a Supabase Storage
 * @param file - Archivo de imagen
 * @param folder - Carpeta destino ('productos', 'ingredientes', etc.)
 * @returns URL pública de la imagen o null si hay error
 */
export const uploadImage = async (file: File, folder: string = 'productos'): Promise<string | null> => {
  try {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Usa: JPG, PNG o WEBP')
    }

    if (file.size > MAX_UPLOAD_FILE_SIZE) {
      throw new Error(
        `La imagen comprimida sigue siendo muy grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo ${(MAX_UPLOAD_FILE_SIZE / 1024 / 1024).toFixed(1)}MB`
      )
    }

    // Siempre WebP en storage para menor egress y mejor caché
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '31536000',
        contentType: 'image/webp',
        upsert: false,
      })

    if (error) {
      console.error('Error al subir imagen:', error)
      throw error
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error: any) {
    console.error('Error en uploadImage:', error)
    throw error
  }
}

/**
 * Eliminar imagen de Supabase Storage
 * @param imageUrl - URL completa de la imagen
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extraer path del URL
    const path = imageUrl.split(`${BUCKET_NAME}/`)[1]
    
    if (!path) {
      console.warn('No se pudo extraer el path de la imagen')
      return
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) {
      console.error('Error al eliminar imagen:', error)
      throw error
    }
  } catch (error) {
    console.error('Error en deleteImage:', error)
    // No lanzar error, solo loguear (la imagen puede no existir)
  }
}

/**
 * Obtener URL pública de una imagen
 * @param path - Path dentro del bucket
 */
export const getPublicUrl = (path: string): string => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)

  return data.publicUrl
}

/**
 * Validar archivo antes de subir
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Usa: JPG, JPEG, PNG o WEBP',
    }
  }

  if (file.size > MAX_INPUT_FILE_SIZE) {
    return {
      valid: false,
      error: `El archivo es muy grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo ${(MAX_INPUT_FILE_SIZE / 1024 / 1024).toFixed(0)}MB (se comprimirá a WebP al subir)`,
    }
  }

  return { valid: true }
}

