"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  Plus,
  Eye,
  MoreHorizontal,
  Filter,
  X,
  Info,
  Pencil
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { fondeadores, formatCurrency, formatDate, type LineaFondeo } from "@/lib/mock-data"
import { useFondeoStore } from "@/lib/fondeo-store"
import { LineaDrawer } from "@/components/linea-drawer"
import { LineaFormDrawer } from "@/components/linea-form-drawer"
import { ConfirmModal } from "@/components/confirm-modal"
import { toast } from "sonner"

export default function LineasFondeoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lineas, toggleLineaEstatus, updateLinea } = useFondeoStore()
  
  // Initialize filter from URL if present
  const initialFondeadorId = searchParams.get("fondeadorId")
  
  const [searchQuery, setSearchQuery] = React.useState("")
  const [fondeadorFilter, setFondeadorFilter] = React.useState<string>(initialFondeadorId || "todos")
  const [estatusFilter, setEstatusFilter] = React.useState<string>("todos")
  const [selectedLinea, setSelectedLinea] = React.useState<LineaFondeo | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [confirmModal, setConfirmModal] = React.useState<{
    open: boolean
    linea: LineaFondeo | null
    action: "suspender" | "activar"
  }>({ open: false, linea: null, action: "suspender" })

  // Get unique fondeadores for filter
  const uniqueFondeadores = fondeadores.filter(f => f.estatus === "Activo")

  // Filter lineas
  const filteredLineas = lineas.filter((l) => {
    const matchesSearch =
      l.numeroLinea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.fondeadorNombre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFondeador = fondeadorFilter === "todos" || l.fondeadorId === fondeadorFilter
    const matchesEstatus = estatusFilter === "todos" || l.estatus === estatusFilter

    return matchesSearch && matchesFondeador && matchesEstatus
  })

  const clearFilters = () => {
    setSearchQuery("")
    setFondeadorFilter("todos")
    setEstatusFilter("todos")
  }

  const hasActiveFilters = searchQuery || fondeadorFilter !== "todos" || estatusFilter !== "todos"

  const handleViewDetail = (linea: LineaFondeo) => {
    setSelectedLinea(linea)
    setIsDetailOpen(true)
  }

  const handleFormClose = (open: boolean) => {
    if (!open) {
      setIsEditMode(false)
      setSelectedLinea(null)
    }
    setIsFormOpen(open)
  }

  const handleSuspenderLinea = (linea: LineaFondeo) => {
    const action = linea.estatus === "Suspendida" ? "activar" : "suspender"
    setConfirmModal({ open: true, linea, action })
  }

  const confirmSuspender = () => {
    if (!confirmModal.linea) return
    
    const newEstatus = confirmModal.action === "suspender" ? "Suspendida" : "Activa"
    toggleLineaEstatus(confirmModal.linea.id, newEstatus)
    
    toast.success("Estatus actualizado", {
      description: `La línea ${confirmModal.linea.numeroLinea} ahora está ${newEstatus.toLowerCase()}`
    })
    
    setConfirmModal({ open: false, linea: null, action: "suspender" })
  }

  const handleEditLinea = (linea: LineaFondeo) => {
    setSelectedLinea(linea)
    setIsEditMode(true)
    setIsFormOpen(true)
  }

  const handleVerDisposiciones = (linea: LineaFondeo) => {
    router.push(`/admin/fondeo/disposiciones?lineaId=${linea.id}`)
  }

  const handleNuevaDisposicion = (linea: LineaFondeo) => {
    router.push(`/admin/fondeo/disposiciones?lineaId=${linea.id}&create=1`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Líneas de fondeo</h1>
          <p className="text-muted-foreground">
            Gestión de líneas de crédito de fondeadores
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Crear línea
        </Button>
      </div>

      {/* Concept Banner */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="size-4 text-primary" />
        <AlertDescription className="text-foreground/80">
          <strong>Concepto:</strong> La línea de fondeo es una "bolsa de dinero" general que el fondeador pone a disposición. La lógica financiera detallada (tasas, plazos, condiciones) vive en las disposiciones que se derivan de cada línea.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número o fondeador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={fondeadorFilter} onValueChange={setFondeadorFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Fondeador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los fondeadores</SelectItem>
              {uniqueFondeadores.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.nombre.length > 25 ? f.nombre.slice(0, 25) + "..." : f.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={estatusFilter} onValueChange={setEstatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Activa">Activa</SelectItem>
              <SelectItem value="Por vencer">Por vencer</SelectItem>
              <SelectItem value="Agotada">Agotada</SelectItem>
              <SelectItem value="Suspendida">Suspendida</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="size-4" />
        <span>{filteredLineas.length} líneas encontradas</span>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de línea</TableHead>
              <TableHead>Fondeador</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead className="text-right">Monto autorizado</TableHead>
              <TableHead className="text-right">Monto dispuesto</TableHead>
              <TableHead className="text-right">Monto disponible</TableHead>
              <TableHead>Vigencia</TableHead>
              <TableHead className="text-center">Disposiciones</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLineas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                  No se encontraron líneas de fondeo
                </TableCell>
              </TableRow>
            ) : (
              filteredLineas.map((linea) => (
                <TableRow key={linea.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {linea.numeroLinea}
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate">
                    {linea.fondeadorNombre}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal border-slate-200 text-slate-600">
                      {linea.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-normal ${
                        linea.estatus === "Activa" 
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : linea.estatus === "Por vencer"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : linea.estatus === "Agotada"
                          ? "border-slate-200 bg-slate-50 text-slate-600"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {linea.estatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {formatCurrency(linea.montoAutorizado)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {formatCurrency(linea.montoDispuesto)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {formatCurrency(linea.montoDisponible)}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-col">
                      <span>{formatDate(linea.vigenciaInicio)}</span>
                      <span className="text-muted-foreground">al {formatDate(linea.vigenciaFin)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {linea.disposiciones}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetail(linea)}
                      >
                        <Eye className="size-4" />
                        <span className="sr-only">Ver detalle</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Más opciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetail(linea)}>
                            <Eye className="mr-2 size-4" />
                            Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditLinea(linea)}>
                            <Pencil className="mr-2 size-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleVerDisposiciones(linea)}>
                            Ver disposiciones
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleNuevaDisposicion(linea)}>
                            Nueva disposición
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleSuspenderLinea(linea)}
                            className={linea.estatus === "Suspendida" ? "text-emerald-600" : "text-destructive"}
                          >
                            {linea.estatus === "Suspendida" ? "Activar línea" : "Suspender línea"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Drawer */}
      <LineaDrawer
        linea={selectedLinea}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEdit={() => selectedLinea && handleEditLinea(selectedLinea)}
      />

      {/* Create/Edit Form Drawer */}
      <LineaFormDrawer
        open={isFormOpen}
        onOpenChange={handleFormClose}
        linea={isEditMode ? selectedLinea : null}
        isEditMode={isEditMode}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal({ ...confirmModal, open })}
        title={confirmModal.action === "suspender" ? "Suspender línea" : "Activar línea"}
        description={
          confirmModal.action === "suspender"
            ? `¿Estás seguro de suspender la línea ${confirmModal.linea?.numeroLinea}? No se podrán realizar nuevas disposiciones.`
            : `¿Estás seguro de activar la línea ${confirmModal.linea?.numeroLinea}?`
        }
        confirmText={confirmModal.action === "suspender" ? "Suspender" : "Activar"}
        variant={confirmModal.action === "suspender" ? "destructive" : "default"}
        onConfirm={confirmSuspender}
      />
    </div>
  )
}
