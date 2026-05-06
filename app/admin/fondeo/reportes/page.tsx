"use client"

import * as React from "react"
import { Download, CalendarIcon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  fondeadores,
  movimientosEstadoCuenta,
  formatCurrency,
  formatDate
} from "@/lib/mock-data"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

// Mock data for detail by contract
const detalleContratos = [
  { contrato: "CONT-2024-0125", cliente: "Grupo Industrial ABC", montoFondeado: 2500000, capitalRecuperado: 625000, interesGenerado: 156250, pagosRealizados: 781250, saldoPendiente: 1875000 },
  { contrato: "CONT-2024-0126", cliente: "Distribuidora del Centro", montoFondeado: 1800000, capitalRecuperado: 360000, interesGenerado: 117000, pagosRealizados: 477000, saldoPendiente: 1440000 }
]

// Mock data for RES por contrato
const resContratos = [
  { contrato: "CONT-2024-0125", cliente: "Grupo Industrial ABC", capitalColocado: 5000000, porcentaje: 50, montoContrato: 5000000, montoFondeador: 2500000, capitalAmortizado: 625000, interesRealizado: 156250, otrosCargos: 12500, otrosAbonos: 0, saldoFondeador: 1875000, estatus: "Vigente" },
  { contrato: "CONT-2024-0126", cliente: "Distribuidora del Centro", capitalColocado: 3600000, porcentaje: 50, montoContrato: 3600000, montoFondeador: 1800000, capitalAmortizado: 360000, interesRealizado: 117000, otrosCargos: 9000, otrosAbonos: 0, saldoFondeador: 1440000, estatus: "Vigente" }
]

// Mock data for F2 Fondeos
const f2Fondeos = [
  { proyecto: "PROY-2024-001", cliente: "Grupo Industrial ABC", llamadaCapital: "LC-001", estatus: "Fondeado", contratoPrestamo: "CONT-2024-0125", contratoAP: "AP-001", bienArrendado: "Maquinaria CNC", fechaAP: "2024-03-15", plazo: 36, tasaInteres: 12.5, montoProyecto: 5000000, montoMCA: 2500000, estatusFondeo: "Completo", fechaFondeo: "2024-03-20", bancoFondeo: "BBVA", montoTransferido: 2500000, pendiente: 0 },
  { proyecto: "PROY-2024-002", cliente: "Distribuidora del Centro", llamadaCapital: "LC-002", estatus: "Fondeado", contratoPrestamo: "CONT-2024-0126", contratoAP: "AP-002", bienArrendado: "Equipo de transporte", fechaAP: "2024-04-01", plazo: 24, tasaInteres: 13.0, montoProyecto: 3600000, montoMCA: 1800000, estatusFondeo: "Completo", fechaFondeo: "2024-04-05", bancoFondeo: "Santander", montoTransferido: 1800000, pendiente: 0 }
]

export default function EstadoCuentaPage() {
  const [selectedFondeador, setSelectedFondeador] = React.useState("")
  const [periodoTipo, setPeriodoTipo] = React.useState("mes")
  const [selectedMonth, setSelectedMonth] = React.useState("2025-03")
  const [dateFrom, setDateFrom] = React.useState<Date>()
  const [dateTo, setDateTo] = React.useState<Date>()

  // Get selected fondeador data
  const fondeador = fondeadores.find(f => f.id === selectedFondeador)

  // Mock KPIs based on selection
  const kpis = {
    saldoInicial: 4500000,
    capitalFondeado: 4300000,
    capitalRecuperado: 985000,
    interesesPeriodo: 273250,
    pagosRealizados: 1258250,
    saldoPendiente: 4083292
  }

  const showData = selectedFondeador !== ""

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reportes del fondeador</h1>
          <p className="text-sm text-muted-foreground">
            Consulta los reportes financieros y operativos del fondeador
          </p>
        </div>
      </div>

      {/* Concept Banner */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="size-4 text-primary" />
        <AlertDescription className="text-foreground/80">
          <strong>Concepto:</strong> Los reportes del fondeador consolidan la información financiera y operativa: saldos, disposiciones, recuperaciones, intereses y pagos realizados del periodo seleccionado.
        </AlertDescription>
      </Alert>

      {/* Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1 space-y-2">
              <Label>Fondeador (obligatorio)</Label>
              <Select value={selectedFondeador} onValueChange={setSelectedFondeador}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar fondeador..." />
                </SelectTrigger>
                <SelectContent>
                  {fondeadores.filter(f => f.estatus === "Activo").map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de periodo</Label>
              <Select value={periodoTipo} onValueChange={setPeriodoTipo}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes">Mes específico</SelectItem>
                  <SelectItem value="rango">Rango de fechas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {periodoTipo === "mes" ? (
              <div className="space-y-2">
                <Label>Mes</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-03">Marzo 2025</SelectItem>
                    <SelectItem value="2025-02">Febrero 2025</SelectItem>
                    <SelectItem value="2025-01">Enero 2025</SelectItem>
                    <SelectItem value="2024-12">Diciembre 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Desde</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Hasta</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {dateTo ? format(dateTo, "dd/MM/yyyy") : "Fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content - Only show if fondeador is selected */}
      {!showData ? (
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">Selecciona un fondeador</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Para ver el estado de cuenta, primero selecciona un fondeador del listado.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Fondeador Header */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{fondeador?.nombre}</h2>
                  <p className="text-sm text-muted-foreground">
                    RFC: {fondeador?.rfc} • Periodo: {periodoTipo === "mes" ? selectedMonth : "Rango personalizado"}
                  </p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-200">
                  Activo
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* KPIs with BREL accent */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
            <Card className="relative overflow-hidden border-border/60 bg-card shadow-none">
              <div className="absolute left-0 top-0 h-full w-1 bg-slate-400" />
              <CardContent className="p-4 pl-5">
                <p className="text-xs text-muted-foreground">Saldo inicial</p>
                <p className="text-lg font-semibold tabular-nums">{formatCurrency(kpis.saldoInicial)}</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-border/60 bg-card shadow-none">
              <div className="absolute left-0 top-0 h-full w-1 bg-sky-500" />
              <CardContent className="p-4 pl-5">
                <p className="text-xs text-muted-foreground">Capital fondeado</p>
                <p className="text-lg font-semibold tabular-nums text-sky-600">{formatCurrency(kpis.capitalFondeado)}</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-border/60 bg-card shadow-none">
              <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
              <CardContent className="p-4 pl-5">
                <p className="text-xs text-muted-foreground">Capital recuperado</p>
                <p className="text-lg font-semibold tabular-nums text-emerald-600">{formatCurrency(kpis.capitalRecuperado)}</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-border/60 bg-card shadow-none">
              <div className="absolute left-0 top-0 h-full w-1 bg-violet-500" />
              <CardContent className="p-4 pl-5">
                <p className="text-xs text-muted-foreground">Intereses periodo</p>
                <p className="text-lg font-semibold tabular-nums">{formatCurrency(kpis.interesesPeriodo)}</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-border/60 bg-card shadow-none">
              <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
              <CardContent className="p-4 pl-5">
                <p className="text-xs text-muted-foreground">Pagos realizados</p>
                <p className="text-lg font-semibold tabular-nums text-emerald-600">{formatCurrency(kpis.pagosRealizados)}</p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-amber-300 bg-card shadow-none">
              <div className="absolute left-0 top-0 h-full w-1 bg-amber-500" />
              <CardContent className="p-4 pl-5">
                <p className="text-xs text-muted-foreground">Saldo pendiente</p>
                <p className="text-lg font-semibold tabular-nums text-amber-600">{formatCurrency(kpis.saldoPendiente)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Data Source Note */}
          <p className="text-xs text-muted-foreground">
            Fuente: datos internos BREL (asignación + disposiciones + pagos registrados).
          </p>

          {/* Tabs */}
          <Tabs defaultValue="detalle-contrato" className="space-y-4">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="detalle-contrato">Detalle por contrato</TabsTrigger>
              <TabsTrigger value="operacion-fondeo">Operación de fondeo</TabsTrigger>
              <TabsTrigger value="movimientos-saldo">Movimientos del saldo</TabsTrigger>
            </TabsList>

            {/* Detalle por contrato Tab */}
            <TabsContent value="detalle-contrato" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Desglose del capital, intereses y saldo pendiente del fondeador por cada contrato fondeado.
              </p>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Detalle por contrato</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => {
                      toast.success("Exportación generada", { description: "Detalle por contrato descargado" })
                    }}>
                      <Download className="mr-2 size-4" />
                      Exportar reporte
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Contrato</TableHead>
                          <TableHead className="font-semibold">Cliente</TableHead>
                          <TableHead className="text-right font-semibold">Capital colocado</TableHead>
                          <TableHead className="text-right font-semibold">% Partic.</TableHead>
                          <TableHead className="text-right font-semibold">Monto fondeador</TableHead>
                          <TableHead className="text-right font-semibold">Capital amort.</TableHead>
                          <TableHead className="text-right font-semibold">Interés real.</TableHead>
                          <TableHead className="text-right font-semibold">Otros cargos</TableHead>
                          <TableHead className="text-right font-semibold">Saldo fondeador</TableHead>
                          <TableHead className="font-semibold">Estatus</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resContratos.map((c) => (
                          <TableRow key={c.contrato}>
                            <TableCell className="font-medium font-mono">{c.contrato}</TableCell>
                            <TableCell>{c.cliente}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatCurrency(c.capitalColocado)}</TableCell>
                            <TableCell className="text-right tabular-nums font-medium">{c.porcentaje}%</TableCell>
                            <TableCell className="text-right tabular-nums">{formatCurrency(c.montoFondeador)}</TableCell>
                            <TableCell className="text-right tabular-nums text-emerald-600">{formatCurrency(c.capitalAmortizado)}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatCurrency(c.interesRealizado)}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatCurrency(c.otrosCargos)}</TableCell>
                            <TableCell className="text-right font-medium tabular-nums text-amber-600">{formatCurrency(c.saldoFondeador)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                                {c.estatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Operación de fondeo Tab */}
            <TabsContent value="operacion-fondeo" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Seguimiento operativo de disposiciones, llamadas de capital y transferencias relacionadas al fondeo.
              </p>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Operación de fondeo</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => {
                      toast.success("Exportación generada", { description: "Operación de fondeo descargada" })
                    }}>
                      <Download className="mr-2 size-4" />
                      Exportar reporte
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Proyecto</TableHead>
                          <TableHead className="font-semibold">Cliente</TableHead>
                          <TableHead className="font-semibold">Contrato</TableHead>
                          <TableHead className="font-semibold">Bien arrendado</TableHead>
                          <TableHead className="font-semibold">Fecha AP</TableHead>
                          <TableHead className="text-right font-semibold">Plazo</TableHead>
                          <TableHead className="text-right font-semibold">Monto MCA</TableHead>
                          <TableHead className="font-semibold">Estatus fondeo</TableHead>
                          <TableHead className="font-semibold">Banco</TableHead>
                          <TableHead className="text-right font-semibold">Transferido</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {f2Fondeos.map((f) => (
                          <TableRow key={f.proyecto}>
                            <TableCell className="font-medium font-mono">{f.proyecto}</TableCell>
                            <TableCell>{f.cliente}</TableCell>
                            <TableCell className="font-mono text-sm">{f.contratoPrestamo}</TableCell>
                            <TableCell>{f.bienArrendado}</TableCell>
                            <TableCell>{f.fechaAP}</TableCell>
                            <TableCell className="text-right tabular-nums">{f.plazo} meses</TableCell>
                            <TableCell className="text-right tabular-nums">{formatCurrency(f.montoMCA)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                                {f.estatusFondeo}
                              </Badge>
                            </TableCell>
                            <TableCell>{f.bancoFondeo}</TableCell>
                            <TableCell className="text-right tabular-nums text-emerald-600">{formatCurrency(f.montoTransferido)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Movimientos del saldo Tab */}
            <TabsContent value="movimientos-saldo" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Historial cronológico de cargos y abonos que explican la variación del saldo del fondeador.
              </p>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Movimientos del saldo</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => {
                      toast.success("Exportación generada", { description: "Movimientos del saldo descargados" })
                    }}>
                      <Download className="mr-2 size-4" />
                      Exportar reporte
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Fecha</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold">Referencia</TableHead>
                        <TableHead className="font-semibold">Contrato</TableHead>
                        <TableHead className="text-right font-semibold">Cargo</TableHead>
                        <TableHead className="text-right font-semibold">Abono</TableHead>
                        <TableHead className="text-right font-semibold">Saldo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movimientosEstadoCuenta.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="text-sm">{formatDate(m.fecha)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              m.tipo === "Disposición" ? "bg-sky-500/15 text-sky-700 border-sky-200" :
                              m.tipo === "Ajuste" ? "bg-amber-500/15 text-amber-700 border-amber-200" :
                              "bg-emerald-500/15 text-emerald-700 border-emerald-200"
                            }>
                              {m.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{m.referencia}</TableCell>
                          <TableCell className="font-mono text-sm">{m.contratoNumero}</TableCell>
                          <TableCell className={`text-right tabular-nums ${m.cargo > 0 ? "text-sky-600" : ""}`}>
                            {m.cargo > 0 ? formatCurrency(m.cargo) : "-"}
                          </TableCell>
                          <TableCell className={`text-right tabular-nums ${m.abono > 0 ? "text-emerald-600" : ""}`}>
                            {m.abono > 0 ? formatCurrency(m.abono) : "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {formatCurrency(m.saldo)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
