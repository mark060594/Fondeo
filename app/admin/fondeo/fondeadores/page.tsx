"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  Eye,
  MoreHorizontal,
  Filter,
  X,
  Pencil,
  ExternalLink
} from "lucide-react"
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
import { toast } from "sonner"
import { useFondeoStore } from "@/lib/fondeo-store"
import { formatCurrency, type Fondeador } from "@/lib/mock-data"
import { FondeadorDrawer } from "@/components/fondeador-drawer"
import { FondeadorFormDrawer } from "@/components/fondeador-form-drawer"
import { ConfirmModal } from "@/components/confirm-modal"

export default function FondeadoresPage() {
  const router = useRouter()
  const { fondeadores, toggleFondeadorEstatus, updateFondeador } = useFondeoStore()
  
  const [searchQuery, setSearchQuery] = React.useState("")
  const [estatusFilter, setEstatusFilter] = React.useState<string>("todos")
  const [tipoFilter, setTipoFilter] = React.useState<string>("todos")
  const [selectedFondeador, setSelectedFondeador] = React.useState<Fondeador | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [confirmModal, setConfirmModal] = React.useState<{
    open: boolean
    fondeador: Fondeador | null
  }>({ open: false, fondeador: null })

  // Filter fondeadores
  const filteredFondeadores = fondeadores.filter((f) => {
    const matchesSearch =
      f.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.rfc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEstatus = estatusFilter === "todos" || f.estatus === estatusFilter
    const matchesTipo = tipoFilter === "todos" || f.tipo === tipoFilter

    return matchesSearch && matchesEstatus && matchesTipo
  })

  const clearFilters = () => {
    setSearchQuery("")
    setEstatusFilter("todos")
    setTipoFilter("todos")
  }

  const hasActiveFilters = searchQuery || estatusFilter !== "todos" || tipoFilter !== "todos"

  const handleViewDetail = (fondeador: Fondeador) => {
    setSelectedFondeador(fondeador)
    setIsEditMode(false)
    setIsDetailOpen(true)
  }

  const handleEdit = (fondeador: Fondeador) => {
    setSelectedFondeador(fondeador)
    setIsEditMode(true)
    setIsFormOpen(true)
  }

  const handleToggleEstatus = (fondeador: Fondeador) => {
    setConfirmModal({ open: true, fondeador })
  }

  const confirmToggleEstatus = () => {
    if (confirmModal.fondeador) {
      toggleFondeadorEstatus(confirmModal.fondeador.id)
      toast.success("Estatus actualizado", {
        description: `El fondeador ahora está ${confirmModal.fondeador.estatus === "Activo" ? "Inactivo" : "Activo"}`
      })
    }
    setConfirmModal({ open: false, fondeador: null })
  }

  const handleViewLineas = (fondeador: Fondeador) => {
    router.push(`/admin/fondeo/lineas?fondeadorId=${fondeador.id}`)
  }

  const handleViewContratos = (fondeador: Fondeador) => {
    router.push(`/admin/fondeo/cartera-pasiva?fondeadorId=${fondeador.id}`)
  }

  const handleSaveEdit = (data: Partial<Fondeador>) => {
    if (selectedFondeador) {
      updateFondeador(selectedFondeador.id, data)
      toast.success("Cambios guardados", {
        description: "Los datos del fondeador se han actualizado correctamente"
      })
      setIsFormOpen(false)
      setSelectedFondeador(null)
    }
  }

  const handleCreate = () => {
    setSelectedFondeador(null)
    setIsEditMode(false)
    setIsFormOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fondeadores</h1>
          <p className="text-muted-foreground">
            Catálogo de fondeadores del sistema
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 size-4" />
          Crear fondeador
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o RFC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={estatusFilter} onValueChange={setEstatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Persona">Persona</SelectItem>
              <SelectItem value="Empresa">Empresa</SelectItem>
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
        <span>{filteredFondeadores.length} fondeadores encontrados</span>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Nombre / Razón social</TableHead>
              <TableHead className="font-semibold">RFC</TableHead>
              <TableHead className="font-semibold">Tipo</TableHead>
              <TableHead className="font-semibold">Estatus</TableHead>
              <TableHead className="text-center font-semibold">Líneas</TableHead>
              <TableHead className="text-right font-semibold">Monto autorizado</TableHead>
              <TableHead className="text-right font-semibold">Monto dispuesto</TableHead>
              <TableHead className="text-right font-semibold">Saldo pendiente</TableHead>
              <TableHead className="text-center font-semibold">Contratos</TableHead>
              <TableHead className="w-[100px] font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFondeadores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                  No se encontraron fondeadores
                </TableCell>
              </TableRow>
            ) : (
              filteredFondeadores.map((fondeador) => (
                <TableRow key={fondeador.id} className="group">
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {fondeador.nombre}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {fondeador.rfc}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal border-slate-200 text-slate-600">
                      {fondeador.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-normal ${
                        fondeador.estatus === "Activo" 
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {fondeador.estatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {fondeador.lineasActivas}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums">
                    {formatCurrency(fondeador.montoAutorizado)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums">
                    {formatCurrency(fondeador.montoDispuesto)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums text-amber-600">
                    {formatCurrency(fondeador.saldoPendiente)}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {fondeador.contratosRelacionados}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetail(fondeador)}
                        className="size-8"
                      >
                        <Eye className="size-4" />
                        <span className="sr-only">Ver detalle</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(fondeador)}
                        className="size-8"
                      >
                        <Pencil className="size-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Más opciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetail(fondeador)}>
                            <Eye className="mr-2 size-4" />
                            Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(fondeador)}>
                            <Pencil className="mr-2 size-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewLineas(fondeador)}>
                            <ExternalLink className="mr-2 size-4" />
                            Ver líneas
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewContratos(fondeador)}>
                            <ExternalLink className="mr-2 size-4" />
                            Ver contratos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleEstatus(fondeador)}
                            className={fondeador.estatus === "Activo" ? "text-destructive" : "text-emerald-600"}
                          >
                            {fondeador.estatus === "Activo" ? "Desactivar" : "Activar"}
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
      <FondeadorDrawer
        fondeador={selectedFondeador}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEdit={() => {
          setIsDetailOpen(false)
          setIsEditMode(true)
          setIsFormOpen(true)
        }}
      />

      {/* Create/Edit Form Drawer */}
      <FondeadorFormDrawer
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) {
            setSelectedFondeador(null)
            setIsEditMode(false)
          }
        }}
        fondeador={isEditMode ? selectedFondeador : null}
        onSave={handleSaveEdit}
      />

      {/* Confirm Status Toggle Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal({ ...confirmModal, open })}
        title={confirmModal.fondeador?.estatus === "Activo" ? "Desactivar fondeador" : "Activar fondeador"}
        description={
          confirmModal.fondeador?.estatus === "Activo"
            ? `¿Estás seguro de desactivar a "${confirmModal.fondeador?.nombre}"? No podrá realizar nuevas operaciones.`
            : `¿Estás seguro de activar a "${confirmModal.fondeador?.nombre}"?`
        }
        confirmText={confirmModal.fondeador?.estatus === "Activo" ? "Desactivar" : "Activar"}
        variant={confirmModal.fondeador?.estatus === "Activo" ? "destructive" : "default"}
        onConfirm={confirmToggleEstatus}
      />
    </div>
  )
}
