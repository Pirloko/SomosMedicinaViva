import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { uploadImage, validateImageFile } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageUploaded: (url: string) => void
  folder: 'productos' | 'ingredientes' | 'otros'
  label?: string
}

const ImageUpload = ({ currentImageUrl, onImageUploaded, folder, label = 'Imagen' }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [useUrl, setUseUrl] = useState(false)
  const [manualUrl, setManualUrl] = useState(currentImageUrl || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar archivo
    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast({
        variant: 'destructive',
        title: '❌ Archivo inválido',
        description: validation.error,
      })
      return
    }

    // Mostrar preview local
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    try {
      setIsUploading(true)
      
      // Subir a Supabase Storage
      const publicUrl = await uploadImage(file, folder)
      
      if (publicUrl) {
        onImageUploaded(publicUrl)
        setPreviewUrl(publicUrl)
        toast({
          title: '✅ Imagen subida',
          description: 'La imagen se ha cargado correctamente',
        })
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Error al subir imagen',
        description: error.message || 'No se pudo subir la imagen',
      })
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (manualUrl) {
      setPreviewUrl(manualUrl)
      onImageUploaded(manualUrl)
      toast({
        title: '✅ URL guardada',
        description: 'La URL de la imagen se ha guardado',
      })
      setUseUrl(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageUploaded('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setUseUrl(!useUrl)}
        >
          {useUrl ? 'Subir archivo' : 'Usar URL'}
        </Button>
      </div>

      {/* Preview de Imagen */}
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

      {useUrl ? (
        /* Opción: URL Manual */
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <Button type="button" onClick={handleUrlSubmit}>
              Guardar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Pega la URL de una imagen (Unsplash, etc.)
          </p>
        </div>
      ) : (
        /* Opción: Upload de Archivo */
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
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
                  Subiendo...
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
              <p>JPG, JPEG, PNG, WEBP (máximo 5MB)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload

