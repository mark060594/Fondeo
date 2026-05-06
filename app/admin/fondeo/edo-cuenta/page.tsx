"use client"

import * as React from "react"
import { CalendarIcon, Info, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  fondeadores,
  formatCurrency
} from "@/lib/mock-data"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

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

  const handleDownloadPDF = () => {
    toast.success("PDF generado", {
      description: `Estado de cuenta de ${fondeador?.nombre} descargado`
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Estado de cuenta</h1>
          <p className="text-sm text-muted-foreground">
            Vista ejecutiva del saldo del fondeador (obligación pasiva y pagos registrados)
          </p>
        </div>
        {showData && (
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 size-4" />
            Descargar PDF
          </Button>
        )}
      </div>

      {/* Concept Banner */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="size-4 text-primary" />
        <AlertDescription className="text-foreground/80">
          <strong>Concepto:</strong> El estado de cuenta muestra el resumen financiero del periodo seleccionado: saldo inicial, cargos (disposiciones, intereses), abonos (pagos) y saldo final pendiente.
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

          {/* KPIs */}
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

          {/* Estado de cuenta detail */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumen del periodo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-muted-foreground">Saldo inicial del periodo</span>
                  <span className="font-medium tabular-nums">{formatCurrency(kpis.saldoInicial)}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-muted-foreground">(+) Nuevas disposiciones</span>
                  <span className="font-medium tabular-nums text-sky-600">+ {formatCurrency(kpis.capitalFondeado)}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-muted-foreground">(+) Intereses generados</span>
                  <span className="font-medium tabular-nums text-sky-600">+ {formatCurrency(kpis.interesesPeriodo)}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-muted-foreground">(-) Pagos de capital</span>
                  <span className="font-medium tabular-nums text-emerald-600">- {formatCurrency(kpis.capitalRecuperado)}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-muted-foreground">(-) Pagos de interés</span>
                  <span className="font-medium tabular-nums text-emerald-600">- {formatCurrency(kpis.interesesPeriodo * 0.7)}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold">Saldo final del periodo</span>
                  <span className="text-xl font-bold tabular-nums text-amber-600">{formatCurrency(kpis.saldoPendiente)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Source Note */}
          <p className="text-xs text-muted-foreground">
            Fuente: datos internos BREL (asignación + disposiciones + pagos registrados).
          </p>
        </>
      )}
    </div>
  )
}
