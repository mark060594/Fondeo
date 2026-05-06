"use client"

import * as React from "react"
import { Search, Filter, MoreHorizontal, Eye, FileEdit, AlertCircle } from "lucide-react"
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AsignacionDrawer } from "@/components/asignacion-drawer"
import { useFondeoStore } from "@/lib/fondeo-store"
import {
  formatCurrency,
  type ContratoAsignacion
} from "@/lib/mock-data"

const estatusColors: Record<string, string> = {
  "Solo BREL": "bg-slate-500/15 text-slate-700 border-slate-200",
  "Con fondeadores": "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  "Con diferencia": "bg-rose-500/15 text-rose-700 border-rose-200",
  "En revisión": "bg-sky-500/15 text-sky-700 border-sky-200"
}

export default function AsignacionPage() {
  const { contratos, updateContrato } = useFondeoStore()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [estatusFilter, setEstatusFilter] = React.useState("all")
  const [selectedContrato, setSelectedContrato] = React.useState<ContratoAsignacion | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [isEditMode, setIsEditMode] = React.useState(false)

  const filteredContratos = contratos.filter(c => {
    const matchesSearch =
      c.numeroContrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstatus = estatusFilter === "all" || c.estatusFondeo === estatusFilter

    return matchesSearch && matchesEstatus
  })

  const handleViewContrato = (contrato: ContratoAsignacion, editMode = false) => {
    setSelectedContrato(contrato)
    setIsEditMode(editMode)
    setDrawerOpen(true)
  }

  // Handle drawer save
  const handleDrawerSave = (contratoId: string, updates: Partial<ContratoAsignacion>) => {
    updateContrato(contratoId, updates)
    // Update local selected contrato if it was modified
    if (selectedContrato?.id === contratoId) {
      setSelectedContrato({ ...selectedContrato, ...updates })
    }
  }

  // Calculate summary stats
  const totalContratos = contratos.length
  const sinAsignar = contratos.filter(c => c.estatusFondeo === "Sin asignar").length
  const parciales = contratos.filter(c => c.estatusFondeo === "Parcial").length
  const conDiferencia = contratos.filter(c => c.estatusFondeo === "Con diferencia").length

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Asignación por contrato</h1>
          <p className="text-sm text-muted-foreground">
            Asigna fondeadores y líneas a contratos
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <Alert className="border-sky-200 bg-sky-50">
        <AlertCircle className="size-4 text-sky-600" />
        <AlertDescription className="text-sky-800">
          <strong>BREL cubre por default el 100% del contrato.</strong> Cuando se agregan fondeadores externos, el porcentaje de BREL se reduce automáticamente. La participación total siempre debe mantenerse en 100%.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total contratos</p>
            <p className="text-2xl font-semibold">{totalContratos}</p>
          </CardContent>
        </Card>
        <Card className={sinAsignar > 0 ? "border-slate-300" : ""}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Solo BREL</p>
            <p className="text-2xl font-semibold text-slate-600">{sinAsignar}</p>
            <p className="text-xs text-muted-foreground mt-1">Sin fondeadores externos</p>
          </CardContent>
        </Card>
        <Card className={parciales > 0 ? "border-amber-300" : ""}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Con fondeadores</p>
            <p className="text-2xl font-semibold text-amber-600">{parciales}</p>
            <p className="text-xs text-muted-foreground mt-1">BREL + externos</p>
          </CardContent>
        </Card>
        <Card className={conDiferencia > 0 ? "border-rose-300" : ""}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Con diferencia</p>
            <p className="text-2xl font-semibold text-rose-600">{conDiferencia}</p>
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
                placeholder="Buscar por contrato o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filtros:</span>
              </div>
              <Select value={estatusFilter} onValueChange={setEstatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Estatus fondeo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Solo BREL">Solo BREL</SelectItem>
                  <SelectItem value="Con fondeadores">Con fondeadores</SelectItem>
                  <SelectItem value="Con diferencia">Con diferencia</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
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
                <TableHead className="font-semibold">Contrato</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="text-right font-semibold">Monto</TableHead>
                <TableHead className="font-semibold">Estatus fondeo</TableHead>
                <TableHead className="font-semibold">% Asignado</TableHead>
                <TableHead className="text-center font-semibold">Fondeadores</TableHead>
                <TableHead className="text-right font-semibold">Diferencia</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No se encontraron contratos con los filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                filteredContratos.map((contrato) => (
                  <TableRow
                    key={contrato.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewContrato(contrato)}
                  >
                    <TableCell className="font-medium font-mono">{contrato.numeroContrato}</TableCell>
                    <TableCell>
                      <span className="max-w-[180px] truncate" title={contrato.cliente}>
                        {contrato.cliente}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(contrato.monto)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={estatusColors[contrato.estatusFondeo]}>
                        {contrato.estatusFondeo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={contrato.porcentajeAsignado}
                          className={`h-2 w-20 ${
                            contrato.porcentajeAsignado === 100
                              ? "[&>div]:bg-emerald-500"
                              : contrato.porcentajeAsignado > 0
                              ? "[&>div]:bg-amber-500"
                              : "[&>div]:bg-slate-300"
                          }`}
                        />
                        <span className={`text-sm font-medium tabular-nums ${
                          contrato.porcentajeAsignado === 100 ? "text-emerald-600" :
                          contrato.porcentajeAsignado > 0 ? "text-amber-600" : "text-slate-500"
                        }`}>
                          {contrato.porcentajeAsignado}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex size-6 items-center justify-center rounded-full text-sm font-medium ${
                        contrato.fondeadoresCount === 0 ? "bg-slate-100 text-slate-500" : "bg-sky-100 text-sky-700"
                      }`}>
                        {contrato.fondeadoresCount}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium tabular-nums ${
                      contrato.diferencia !== 0 ? (contrato.diferencia > 0 ? "text-amber-600" : "text-rose-600") : ""
                    }`}>
                      {contrato.diferencia !== 0 ? formatCurrency(Math.abs(contrato.diferencia)) : "-"}
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
                            handleViewContrato(contrato)
                          }}>
                            <Eye className="mr-2 size-4" />
                            Ver / Asignar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleViewContrato(contrato, true)
                          }}>
                            <FileEdit className="mr-2 size-4" />
                            Editar asignación
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
        Mostrando {filteredContratos.length} de {contratos.length} contratos
      </div>

      {/* Drawer */}
      <AsignacionDrawer
        contrato={selectedContrato}
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open)
          if (!open) setIsEditMode(false)
        }}
        onSave={handleDrawerSave}
        isEditMode={isEditMode}
      />
    </div>
  )
}
