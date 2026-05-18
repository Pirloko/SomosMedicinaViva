import { useState, useRef, useId } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { uploadImage, validateImageFile } from '@/lib/storage'
import { compressImageToWebP, type ImageUploadFolder } from '@/lib/imageCompress'
import { useToast } from '@/hooks/use-toast'
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageUploaded: (url: string) => void
  folder: ImageUploadFolder
  label?: string
}

const ImageUpload = ({ currentImageUrl, onImageUploaded, folder, label = 'Imagen' }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewObjectUrlRef = useRef<string | null>(null)
  const { toast } = useToast()
  const inputId = useId()

  const revokePreviewObjectUrl = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = null
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast({
        variant: 'destructive',
        title: '❌ Archivo inválido',
        description: validation.error,
      })
      return
    }

    revokePreviewObjectUrl()
    const localPreview = URL.createObjectURL(file)
    previewObjectUrlRef.current = localPreview
    setPreviewUrl(localPreview)

    try {
      setIsUploading(true)

      const webpFile = await compressImageToWebP(file, folder)
      const publicUrl = await uploadImage(webpFile, folder)

      if (publicUrl) {
        revokePreviewObjectUrl()
        onImageUploaded(publicUrl)
        setPreviewUrl(publicUrl)
        toast({
          title: '✅ Imagen subida',
          description: `Optimizada a WebP (${(webpFile.size / 1024).toFixed(0)} KB)`,
        })
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'No se pudo subir la imagen'
      toast({
        variant: 'destructive',
        title: '❌ Error al subir imagen',
        description: message,
      })
      revokePreviewObjectUrl()
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    revokePreviewObjectUrl()
    setPreviewUrl(null)
    onImageUploaded('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {label ? (
        <Label htmlFor={inputId}>{label}</Label>
      ) : null}

      {previewUrl && (
        <div className="relative w-full aspect-square max-w-xs mx-auto rounded-lg overflow-hidden border-2 border-border">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <input
            id={inputId}
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Comprimiendo y subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {previewUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
              </>
            )}
          </Button>
        </div>
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <ImageIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Formatos permitidos:</p>
            <p>JPG, JPEG, PNG o WEBP (hasta 15 MB). Se redimensionan y guardan como WebP para carga rápida y menor consumo.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload
