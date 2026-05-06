"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, MoreHorizontal, Eye, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DisposicionDrawer } from "@/components/disposicion-drawer"
import { useFondeoStore } from "@/lib/fondeo-store"
import {
  fondeadores,
  formatCurrency,
  type DisposicionCompleta
} from "@/lib/mock-data"
import { toast } from "sonner"

const estatusColors: Record<string, string> = {
  "Activa": "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  "En revisión": "bg-amber-500/15 text-amber-700 border-amber-200",
  "Parcial": "bg-sky-500/15 text-sky-700 border-sky-200",
  "Liquidada": "bg-slate-500/15 text-slate-700 border-slate-200",
  "Con diferencia": "bg-rose-500/15 text-rose-700 border-rose-200"
}

function DisposicionesPageContent() {
  const searchParams = useSearchParams()
  const { lineas, disposiciones, updateDisposicion } = useFondeoStore()
  
  // Get URL parameters
  const urlLineaId = searchParams.get("lineaId")
  
  const [searchTerm, setSearchTerm] = React.useState("")
  const [fondeadorFilter, setFondeadorFilter] = React.useState("all")
  const [lineaFilter, setLineaFilter] = React.useState(urlLineaId || "all")
  const [estatusFilter, setEstatusFilter] = React.useState("all")
  const [selectedDisposicion, setSelectedDisposicion] = React.useState<DisposicionCompleta | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  
  // If lineaId is set, also set the fondeador filter
  React.useEffect(() => {
    if (urlLineaId) {
      const linea = lineas.find(l => l.id === urlLineaId)
      if (linea) {
        setFondeadorFilter(linea.fondeadorId)
      }
    }
  }, [urlLineaId, lineas])

  // Filter líneas based on selected fondeador
  const filteredLineas = fondeadorFilter === "all"
    ? lineas
    : lineas.filter(l => l.fondeadorId === fondeadorFilter)

  const filteredDisposiciones = disposiciones.filter(d => {
    const matchesSearch =
      d.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.contratoNumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFondeador = fondeadorFilter === "all" || d.fondeadorId === fondeadorFilter
    const matchesLinea = lineaFilter === "all" || d.lineaId === lineaFilter
    const matchesEstatus = estatusFilter === "all" || d.estatus === estatusFilter

    return matchesSearch && matchesFondeador && matchesLinea && matchesEstatus
  })

  const handleViewDisposicion = (disposicion: DisposicionCompleta) => {
    setSelectedDisposicion(disposicion)
    setDrawerOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Disposiciones</h1>
          <p className="text-sm text-muted-foreground">
            Vista operativa de las asignaciones de fondeo por contrato
          </p>
        </div>
      </div>

      {/* Concept Banner */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="size-4 text-primary" />
        <AlertDescription className="text-foreground/80">
          <strong>Concepto:</strong> Las disposiciones representan la aplicación operativa de las asignaciones de fondeo guardadas a nivel contrato. Cada disposición se genera a partir de la estructura de participación definida en <strong>Asignación por contrato</strong>.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por disposición, contrato o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filtros:</span>
              </div>
              <Select value={fondeadorFilter} onValueChange={(v) => {
                setFondeadorFilter(v)
                setLineaFilter("all") // Reset línea when fondeador changes
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Fondeador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los fondeadores</SelectItem>
                  {fondeadores.filter(f => f.estatus === "Activo").map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nombre.length > 25 ? f.nombre.substring(0, 25) + "..." : f.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={lineaFilter} onValueChange={setLineaFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Línea" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las líneas</SelectItem>
                  {filteredLineas.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.numeroLinea}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={estatusFilter} onValueChange={setEstatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activa">Activa</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
                  <SelectItem value="Parcial">Parcial</SelectItem>
                  <SelectItem value="Liquidada">Liquidada</SelectItem>
                  <SelectItem value="Con diferencia">Con diferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Disposición</TableHead>
                <TableHead className="font-semibold">Fondeador</TableHead>
                <TableHead className="font-semibold">Línea</TableHead>
                <TableHead className="font-semibold">Contrato</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="text-right font-semibold">Monto dispuesto</TableHead>
                <TableHead className="text-right font-semibold">% Participación</TableHead>
                <TableHead className="font-semibold">Estatus</TableHead>
                <TableHead className="text-right font-semibold">Pendiente</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisposiciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                    No se encontraron disposiciones con los filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                filteredDisposiciones.map((disposicion) => (
                  <TableRow
                    key={disposicion.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDisposicion(disposicion)}
                  >
                    <TableCell className="font-medium">{disposicion.numero}</TableCell>
                    <TableCell>
                      <span className="max-w-[150px] truncate" title={disposicion.fondeadorNombre}>
                        {disposicion.fondeadorNombre.length > 20
                          ? disposicion.fondeadorNombre.substring(0, 20) + "..."
                          : disposicion.fondeadorNombre}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{disposicion.lineaNumero}</TableCell>
                    <TableCell className="font-mono text-sm">{disposicion.contratoNumero}</TableCell>
                    <TableCell>
                      <span className="max-w-[120px] truncate" title={disposicion.cliente}>
                        {disposicion.cliente.length > 18
                          ? disposicion.cliente.substring(0, 18) + "..."
                          : disposicion.cliente}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(disposicion.montoDispuesto)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {disposicion.porcentajeParticipacion}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={estatusColors[disposicion.estatus]}>
                        {disposicion.estatus}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-medium tabular-nums ${disposicion.pendiente > 0 ? "text-amber-600" : ""}`}>
                      {formatCurrency(disposicion.pendiente)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleViewDisposicion(disposicion)
                          }}>
                            <Eye className="mr-2 size-4" />
                            Ver detalle
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredDisposiciones.length} de {disposiciones.length} disposiciones
      </div>

      {/* Detail Drawer (read-only) */}
      <DisposicionDrawer
        disposicion={selectedDisposicion}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}

export default function DisposicionesPage() {
  return (
    <React.Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando disposiciones...</div>}>
      <DisposicionesPageContent />
    </React.Suspense>
  )
}
