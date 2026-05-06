"use client"

import * as React from "react"
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  X,
  CheckCircle2,
  Loader2,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Types
export interface FunderDocument {
  id: string
  fileName: string
  fileType: "pdf" | "image"
  extension: string
  sizeInBytes: number
  uploadedAt: string
  uploadedBy: string
  url?: string
  previewUrl?: string
}

interface FunderDocsTabContentProps {
  fondeadorId: string
  fondeadorNombre: string
}

// Mock data - only PDF and images
const mockDocuments: FunderDocument[] = [
  {
    id: "doc-1",
    fileName: "Contrato_Marco_2025.pdf",
    fileType: "pdf",
    extension: "pdf",
    sizeInBytes: 2456000,
    uploadedAt: "2025-03-15T10:30:00",
    uploadedBy: "Juan García",
    url: "/docs/contrato.pdf",
    previewUrl: "/docs/contrato.pdf"
  },
  {
    id: "doc-2",
    fileName: "Identificacion_Oficial.jpg",
    fileType: "image",
    extension: "jpg",
    sizeInBytes: 845000,
    uploadedAt: "2025-03-10T14:20:00",
    uploadedBy: "María López",
    url: "/docs/id.jpg",
    previewUrl: "/docs/id.jpg"
  },
  {
    id: "doc-3",
    fileName: "Acta_Constitutiva.pdf",
    fileType: "pdf",
    extension: "pdf",
    sizeInBytes: 1230000,
    uploadedAt: "2025-02-28T09:15:00",
    uploadedBy: "Juan García",
    url: "/docs/acta.pdf"
  },
  {
    id: "doc-4",
    fileName: "Estados_Financieros_2024.pdf",
    fileType: "pdf",
    extension: "pdf",
    sizeInBytes: 3450000,
    uploadedAt: "2025-03-18T11:00:00",
    uploadedBy: "Juan García",
    url: "/docs/estados.pdf"
  },
  {
    id: "doc-5",
    fileName: "Comprobante_Domicilio.png",
    fileType: "image",
    extension: "png",
    sizeInBytes: 520000,
    uploadedAt: "2025-01-15T08:30:00",
    uploadedBy: "María López",
    url: "/docs/comprobante.png"
  }
]

// Utility functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) + " " + date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit"
  })
}

function getFileIcon(fileType: FunderDocument["fileType"]) {
  switch (fileType) {
    case "pdf":
      return <FileText className="size-5 text-rose-600" />
    case "image":
      return <ImageIcon className="size-5 text-sky-600" />
    default:
      return <File className="size-5 text-slate-500" />
  }
}

function getExtensionBadgeColor(extension: string): string {
  const colors: Record<string, string> = {
    pdf: "bg-rose-100 text-rose-700 border-rose-200",
    jpg: "bg-sky-100 text-sky-700 border-sky-200",
    jpeg: "bg-sky-100 text-sky-700 border-sky-200",
    png: "bg-sky-100 text-sky-700 border-sky-200"
  }
  return colors[extension.toLowerCase()] || "bg-slate-100 text-slate-700 border-slate-200"
}

// Allowed file types - only PDF and images
const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function FunderDocsTabContent({ fondeadorId, fondeadorNombre }: FunderDocsTabContentProps) {
  const [documents, setDocuments] = React.useState<FunderDocument[]>(mockDocuments)
  const [isDragging, setIsDragging] = React.useState(false)
  const [pendingFile, setPendingFile] = React.useState<File | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [previewDoc, setPreviewDoc] = React.useState<FunderDocument | null>(null)
  const [deleteDoc, setDeleteDoc] = React.useState<FunderDocument | null>(null)
  const [replaceDoc, setReplaceDoc] = React.useState<FunderDocument | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isReplacing, setIsReplacing] = React.useState(false)
  
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const replaceInputRef = React.useRef<HTMLInputElement>(null)

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelected(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0])
    }
    e.target.value = ""
  }

  const handleFileSelected = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || ""
    
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      toast.error("Tipo de archivo no permitido", {
        description: "Solo se permiten archivos PDF, JPG y PNG"
      })
      return
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Archivo muy grande", {
        description: "El archivo no puede exceder 10MB"
      })
      return
    }

    setPendingFile(file)
  }

  const handleUploadPendingFile = async () => {
    if (!pendingFile) return

    setIsUploading(true)

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1200))

    const extension = pendingFile.name.split(".").pop()?.toLowerCase() || ""
    const fileType: FunderDocument["fileType"] = extension === "pdf" ? "pdf" : "image"

    const newDoc: FunderDocument = {
      id: `doc-new-${Date.now()}`,
      fileName: pendingFile.name,
      fileType,
      extension,
      sizeInBytes: pendingFile.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Usuario Actual"
    }

    setDocuments(prev => [newDoc, ...prev])
    setPendingFile(null)
    setIsUploading(false)

    toast.success("Documento cargado", {
      description: pendingFile.name
    })
  }

  const removePendingFile = () => {
    setPendingFile(null)
  }

  const handleDownload = (doc: FunderDocument) => {
    toast.success("Descarga iniciada", {
      description: doc.fileName
    })
  }

  const handlePreview = (doc: FunderDocument) => {
    setPreviewDoc(doc)
  }

  const handleDelete = async () => {
    if (!deleteDoc) return

    setIsDeleting(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    setDocuments(prev => prev.filter(d => d.id !== deleteDoc.id))
    setIsDeleting(false)
    setDeleteDoc(null)

    toast.success("Documento eliminado", {
      description: deleteDoc.fileName
    })
  }

  const handleReplaceClick = (doc: FunderDocument) => {
    setReplaceDoc(doc)
    setTimeout(() => replaceInputRef.current?.click(), 100)
  }

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !replaceDoc) {
      setReplaceDoc(null)
      return
    }

    const file = e.target.files[0]
    const extension = file.name.split(".").pop()?.toLowerCase() || ""

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      toast.error("Tipo de archivo no permitido")
      setReplaceDoc(null)
      e.target.value = ""
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("El archivo excede 10MB")
      setReplaceDoc(null)
      e.target.value = ""
      return
    }

    setIsReplacing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const fileType: FunderDocument["fileType"] = extension === "pdf" ? "pdf" : "image"

    setDocuments(prev => prev.map(d => {
      if (d.id === replaceDoc.id) {
        return {
          ...d,
          fileName: file.name,
          fileType,
          extension,
          sizeInBytes: file.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: "Usuario Actual"
        }
      }
      return d
    }))

    setIsReplacing(false)
    setReplaceDoc(null)
    e.target.value = ""

    toast.success("Documento reemplazado", {
      description: `${replaceDoc.fileName} → ${file.name}`
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Documentos</h3>

      {/* Upload Zone */}
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-muted-foreground/40",
          (isUploading || pendingFile) && "pointer-events-none opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isUploading || !!pendingFile}
        />
        <Upload className={cn(
          "mx-auto size-8 mb-2",
          isDragging ? "text-primary" : "text-muted-foreground"
        )} />
        <p className="text-sm text-muted-foreground mb-1">
          Arrastra archivo aquí o{" "}
          <button
            type="button"
            className="text-primary hover:underline font-medium"
            onClick={() => fileInputRef.current?.click()}
          >
            selecciona archivo
          </button>
        </p>
        <p className="text-xs text-muted-foreground">
          PDF, JPG, PNG • Máx. 10MB por archivo
        </p>
      </div>

      {/* Pending File */}
      {pendingFile && (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <File className="size-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">{pendingFile.name}</span>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatFileSize(pendingFile.size)}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={removePendingFile}
              disabled={isUploading}
            >
              <X className="size-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleUploadPendingFile}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 size-4" />
                  Subir
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Documents List */}
      {documents.length > 0 ? (
        <div className="space-y-1">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-md border px-3 py-2.5 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  {getFileIcon(doc.fileType)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{doc.fileName}</span>
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px] px-1.5 py-0 uppercase flex-shrink-0", getExtensionBadgeColor(doc.extension))}
                    >
                      {doc.extension}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{formatFileSize(doc.sizeInBytes)}</span>
                    <span>•</span>
                    <span>{formatDateTime(doc.uploadedAt)}</span>
                    <span>•</span>
                    <span>{doc.uploadedBy}</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 flex-shrink-0">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handlePreview(doc)}>
                    <Eye className="mr-2 size-4" />
                    Ver
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload(doc)}>
                    <Download className="mr-2 size-4" />
                    Descargar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleReplaceClick(doc)}>
                    <RefreshCw className="mr-2 size-4" />
                    Reemplazar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setDeleteDoc(doc)}
                    className="text-rose-600 focus:text-rose-600"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed py-8 text-center">
          <CheckCircle2 className="mx-auto size-8 text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            No hay documentos cargados
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Sube el primer archivo usando la zona de arriba
          </p>
        </div>
      )}

      {/* Hidden input for replacement */}
      <input
        ref={replaceInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleReplaceFile}
      />

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewDoc && getFileIcon(previewDoc.fileType)}
              {previewDoc?.fileName}
            </DialogTitle>
            <DialogDescription>
              {previewDoc && (
                <>
                  {formatFileSize(previewDoc.sizeInBytes)} • Subido el {formatDateTime(previewDoc.uploadedAt)} por {previewDoc.uploadedBy}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-[300px] rounded-lg border bg-muted/30 flex items-center justify-center">
            {previewDoc?.fileType === "pdf" ? (
              <div className="text-center p-8">
                <FileText className="mx-auto size-16 text-rose-500 mb-4" />
                <p className="text-sm text-muted-foreground">Vista previa de PDF</p>
                <p className="text-xs text-muted-foreground mt-1">(En producción se mostraría el PDF embebido)</p>
              </div>
            ) : previewDoc?.fileType === "image" ? (
              <div className="text-center p-8">
                <ImageIcon className="mx-auto size-16 text-sky-500 mb-4" />
                <p className="text-sm text-muted-foreground">Vista previa de imagen</p>
                <p className="text-xs text-muted-foreground mt-1">(En producción se mostraría la imagen)</p>
              </div>
            ) : (
              <div className="text-center p-8">
                <File className="mx-auto size-16 text-slate-400 mb-4" />
                <p className="text-sm text-muted-foreground">No hay vista previa disponible</p>
                <p className="text-xs text-muted-foreground mt-1">Descarga el archivo para verlo</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDoc(null)}>
              Cerrar
            </Button>
            {previewDoc && (
              <Button onClick={() => handleDownload(previewDoc)}>
                <Download className="mr-2 size-4" />
                Descargar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDoc} onOpenChange={() => !isDeleting && setDeleteDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar <strong>{deleteDoc?.fileName}</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Replace Loading Overlay */}
      {isReplacing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Reemplazando documento...</p>
          </div>
        </div>
      )}
    </div>
  )
}
