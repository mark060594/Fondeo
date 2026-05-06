"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, MoreHorizontal, Eye, DollarSign, Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CarteraPasivaDrawer } from "@/components/cartera-pasiva-drawer"
import { RegistrarPagoDrawer } from "@/components/registrar-pago-drawer"
import { useFondeoStore } from "@/lib/fondeo-store"
import {
  fondeadores,
  formatCurrency,
  type CarteraPasivaItem
} from "@/lib/mock-data"
import { toast } from "sonner"

const estatusColors: Record<string, string> = {
  "Al corriente": "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  "Pendiente": "bg-amber-500/15 text-amber-700 border-amber-200",
  "Parcial": "bg-sky-500/15 text-sky-700 border-sky-200",
  "Con diferencia": "bg-rose-500/15 text-rose-700 border-rose-200",
  "Liquidado": "bg-slate-500/15 text-slate-700 border-slate-200"
}

export default function CarteraPasivaPage() {
  const searchParams = useSearchParams()
  const { carteraPasiva, updateCarteraPasivaItem } = useFondeoStore()
  
  // Initialize filter from URL if present
  const initialFondeadorId = searchParams.get("fondeadorId")
  
  const [searchTerm, setSearchTerm] = React.useState("")
  const [fondeadorFilter, setFondeadorFilter] = React.useState(initialFondeadorId || "all")
  const [periodoFilter, setPeriodoFilter] = React.useState("all")
  const [estatusFilter, setEstatusFilter] = React.useState("all")
  const [selectedItem, setSelectedItem] = React.useState<CarteraPasivaItem | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [pagoDrawerOpen, setPagoDrawerOpen] = React.useState(false)

  // Get unique periods from data
  const periodos = [...new Set(carteraPasiva.map(c => c.periodo))].sort().reverse()

  const filteredItems = carteraPasiva.filter(item => {
    const matchesSearch =
      item.contratoNumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.disposicionNumero.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFondeador = fondeadorFilter === "all" || item.fondeadorId === fondeadorFilter
    const matchesPeriodo = periodoFilter === "all" || item.periodo === periodoFilter
    const matchesEstatus = estatusFilter === "all" || item.estatus === estatusFilter

    return matchesSearch && matchesFondeador && matchesPeriodo && matchesEstatus
  })

  const handleViewItem = (item: CarteraPasivaItem) => {
    setSelectedItem(item)
    setDrawerOpen(true)
  }

  const handleRegistrarPago = (item: CarteraPasivaItem) => {
    setSelectedItem(item)
    setPagoDrawerOpen(true)
  }

  const handleSavePago = (id: string, updates: { pagado: number; pendiente: number; diferencia: number }) => {
    // Determine new status
    let newEstatus: CarteraPasivaItem["estatus"] = "Al corriente"
    if (updates.pendiente > 0 && updates.pagado > 0) {
      newEstatus = "Parcial"
    } else if (updates.pendiente > 0) {
      newEstatus = "Pendiente"
    } else if (updates.diferencia > 0) {
      newEstatus = "Con diferencia"
    } else if (updates.pendiente === 0) {
      newEstatus = "Liquidado"
    }

    updateCarteraPasivaItem(id, {
      totalPagado: updates.pagado,
      pendiente: updates.pendiente,
      diferencia: updates.diferencia,
      estatus: newEstatus
    })
  }

  const handleExportar = () => {
    toast.success("Tabla pasiva descargada", {
      description: "Archivo Excel con detalle por periodo exportado correctamente"
    })
  }

  // Calculate summary stats
  const totalDebido = carteraPasiva.reduce((acc, c) => acc + c.totalDebido, 0)
  const totalPagado = carteraPasiva.reduce((acc, c) => acc + c.totalPagado, 0)
  const totalPendiente = carteraPasiva.reduce((acc, c) => acc + c.pendiente, 0)
  const totalDiferencia = carteraPasiva.reduce((acc, c) => acc + c.diferencia, 0)

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cartera pasiva</h1>
          <p className="text-sm text-muted-foreground">
            Tabla pasiva derivada del espejeo de amortización activa + seguimiento real de pagos al fondeador
          </p>
        </div>
        <Button onClick={handleExportar}>
          <Download className="mr-2 size-4" />
          Descargar tabla pasiva
        </Button>
      </div>

      {/* Concept Banner */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="size-4 text-primary" />
        <AlertDescription className="text-foreground/80">
          <strong>Vista central del módulo:</strong> La cartera pasiva es el espejo de la tabla de amortización activa. Muestra lo debido al fondeador (capital, interés, moratorios, descuentos, otros cargos/abonos) según el porcentaje de participación, más el seguimiento real de lo ya pagado/regresado. Desde aquí se gestiona el control de diferencias y se exporta la tabla pasiva.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total debido</p>
            <p className="text-2xl font-semibold tabular-nums">{formatCurrency(totalDebido)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total pagado</p>
            <p className="text-2xl font-semibold tabular-nums text-emerald-600">{formatCurrency(totalPagado)}</p>
          </CardContent>
        </Card>
        <Card className={totalPendiente > 0 ? "border-amber-300" : ""}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pendiente</p>
            <p className={`text-2xl font-semibold tabular-nums ${totalPendiente > 0 ? "text-amber-600" : ""}`}>
              {formatCurrency(totalPendiente)}
            </p>
          </CardContent>
        </Card>
        <Card className={totalDiferencia > 0 ? "border-rose-300" : ""}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Diferencia</p>
            <p className={`text-2xl font-semibold tabular-nums ${totalDiferencia > 0 ? "text-rose-600" : ""}`}>
              {formatCurrency(totalDiferencia)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por contrato, cliente o disposición..."
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
              <Select value={fondeadorFilter} onValueChange={setFondeadorFilter}>
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
              <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {periodos.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
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
                  <SelectItem value="Al corriente">Al corriente</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Parcial">Parcial</SelectItem>
                  <SelectItem value="Con diferencia">Con diferencia</SelectItem>
                  <SelectItem value="Liquidado">Liquidado</SelectItem>
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
                <TableHead className="font-semibold">Fondeador</TableHead>
                <TableHead className="font-semibold">Contrato</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Disposición</TableHead>
                <TableHead className="font-semibold">Periodo</TableHead>
                <TableHead className="text-right font-semibold">Capital debido</TableHead>
                <TableHead className="text-right font-semibold">Interés debido</TableHead>
                <TableHead className="text-right font-semibold">Total debido</TableHead>
                <TableHead className="text-right font-semibold">Pagado</TableHead>
                <TableHead className="text-right font-semibold">Pendiente</TableHead>
                <TableHead className="text-right font-semibold">Diferencia</TableHead>
                <TableHead className="font-semibold">Estatus</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="h-24 text-center text-muted-foreground">
                    No se encontraron registros con los filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewItem(item)}
                  >
                    <TableCell>
                      <span className="max-w-[120px] truncate" title={item.fondeadorNombre}>
                        {item.fondeadorNombre.length > 18
                          ? item.fondeadorNombre.substring(0, 18) + "..."
                          : item.fondeadorNombre}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.contratoNumero}</TableCell>
                    <TableCell>
                      <span className="max-w-[100px] truncate" title={item.cliente}>
                        {item.cliente.length > 15
                          ? item.cliente.substring(0, 15) + "..."
                          : item.cliente}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.disposicionNumero}</TableCell>
                    <TableCell className="font-mono text-sm">{item.periodo}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(item.capitalDebido)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(item.interesDebido)}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{formatCurrency(item.totalDebido)}</TableCell>
                    <TableCell className="text-right tabular-nums text-emerald-600">{formatCurrency(item.totalPagado)}</TableCell>
                    <TableCell className={`text-right font-medium tabular-nums ${item.pendiente > 0 ? "text-amber-600" : ""}`}>
                      {formatCurrency(item.pendiente)}
                    </TableCell>
                    <TableCell className={`text-right tabular-nums ${item.diferencia > 0 ? "text-rose-600 font-medium" : ""}`}>
                      {item.diferencia > 0 ? formatCurrency(item.diferencia) : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={estatusColors[item.estatus]}>
                        {item.estatus}
                      </Badge>
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
                            handleViewItem(item)
                          }}>
                            <Eye className="mr-2 size-4" />
                            Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleRegistrarPago(item)
                          }}>
                            <DollarSign className="mr-2 size-4" />
                            Registrar pago
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
        Mostrando {filteredItems.length} de {carteraPasiva.length} registros
      </div>

      {/* Detail Drawer */}
      <CarteraPasivaDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* Payment Drawer */}
      <RegistrarPagoDrawer
        open={pagoDrawerOpen}
        onOpenChange={setPagoDrawerOpen}
        item={selectedItem}
        tipo="cartera"
        onSave={handleSavePago}
      />
    </div>
  )
}
