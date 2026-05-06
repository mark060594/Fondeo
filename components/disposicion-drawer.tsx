"use client"

import * as React from "react"
import { X, Download, Printer } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  type DisposicionCompleta,
  generarTablaPasiva,
  formatCurrency,
  formatDate
} from "@/lib/mock-data"

interface DisposicionDrawerProps {
  disposicion: DisposicionCompleta | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const estatusColors: Record<string, string> = {
  "Activa": "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  "En revisión": "bg-amber-500/15 text-amber-700 border-amber-200",
  "Parcial": "bg-sky-500/15 text-sky-700 border-sky-200",
  "Liquidada": "bg-slate-500/15 text-slate-700 border-slate-200",
  "Con diferencia": "bg-rose-500/15 text-rose-700 border-rose-200"
}

const historialMock = [
  { fecha: "2025-03-12 14:30", accion: "Pago registrado", usuario: "María López", detalle: "Pago de capital e interés período 3" },
  { fecha: "2025-02-15 10:15", accion: "Pago registrado", usuario: "María López", detalle: "Pago de capital e interés período 2" },
  { fecha: "2025-01-15 09:45", accion: "Pago registrado", usuario: "María López", detalle: "Pago de capital e interés período 1" },
  { fecha: "2025-01-15 09:00", accion: "Disposición creada", usuario: "Juan García", detalle: "Alta de disposición en sistema" },
  { fecha: "2025-01-14 16:30", accion: "Línea asignada", usuario: "Juan García", detalle: "Vinculación con línea de fondeo" }
]

export function DisposicionDrawer({ disposicion, open, onOpenChange }: DisposicionDrawerProps) {
  if (!disposicion) return null

  const tablaPasiva = generarTablaPasiva(disposicion.id)
  const totalPendiente = tablaPasiva.reduce((acc, p) => acc + p.pendiente, 0)
  const totalDiferencia = tablaPasiva.reduce((acc, p) => acc + p.diferencia, 0)

  const handleImprimir = () => {
    toast.success("Preparando impresión", {
      description: `Documento de disposición ${disposicion.numero} listo para imprimir`
    })
  }

  const handleExportar = () => {
    toast.success("Exportación generada", {
      description: `Archivo de disposición ${disposicion.numero} descargado`
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0 gap-0">
          {/* Fixed Header */}
          <SheetHeader className="flex-shrink-0 px-6 py-4 border-b bg-background">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <SheetTitle className="text-xl">{disposicion.numero}</SheetTitle>
                <SheetDescription className="sr-only">
                  Detalles de la disposición {disposicion.numero}
                </SheetDescription>
                <p className="text-sm text-muted-foreground">
                  {disposicion.cliente} • {disposicion.contratoNumero}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={estatusColors[disposicion.estatus]}>
                  {disposicion.estatus}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="condiciones">Condiciones</TabsTrigger>
                <TabsTrigger value="tabla-pasiva">Espejeo / Tabla pasiva</TabsTrigger>
                <TabsTrigger value="historial">Historial</TabsTrigger>
              </TabsList>
                {/* General Tab */}
                <TabsContent value="general" className="m-0 space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-border/60 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Monto dispuesto</p>
                        <p className="text-2xl font-semibold tabular-nums">{formatCurrency(disposicion.montoDispuesto)}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-border/60 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Pendiente</p>
                        <p className={`text-2xl font-semibold tabular-nums ${disposicion.pendiente > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                          {formatCurrency(disposicion.pendiente)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* General Info */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Información general</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Fondeador</p>
                          <p className="font-medium">{disposicion.fondeadorNombre}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Línea de fondeo</p>
                          <p className="font-medium font-mono">{disposicion.lineaNumero}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contrato</p>
                          <p className="font-medium font-mono">{disposicion.contratoNumero}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cliente</p>
                          <p className="font-medium">{disposicion.cliente}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">% Participación</p>
                          <p className="font-medium">{disposicion.porcentajeParticipacion}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha creación</p>
                          <p className="font-medium">{formatDate(disposicion.fechaCreacion)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Condiciones Financieras Tab */}
                <TabsContent value="condiciones" className="m-0 space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Condiciones financieras</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">% Participación</p>
                          <p className="font-medium">{disposicion.porcentajeParticipacion}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo de interés</p>
                          <p className="font-medium">{disposicion.tipoInteres}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tasa de interés</p>
                          <p className="font-medium">{disposicion.tasaInteres}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Frecuencia de pago</p>
                          <p className="font-medium">{disposicion.frecuenciaPago}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Plazo</p>
                          <p className="font-medium">{disposicion.plazoMeses} meses</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Esquema amortización</p>
                          <p className="font-medium">{disposicion.esquemaAmortizacion}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Periodo de pago</p>
                          <p className="font-medium">{disposicion.periodoPago}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">IVA / Zona IVA</p>
                          <p className="font-medium">{disposicion.zonaIVA}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Regla de reparto</p>
                        <p className="text-sm font-medium text-foreground">
                          Todos los cargos y abonos se distribuyen conforme al % de participación.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Espejeo / Tabla Pasiva Tab */}
                <TabsContent value="tabla-pasiva" className="m-0 space-y-6">
                  {/* Helper text */}
                  <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                    <p className="text-sm text-sky-800">
                      <strong>Espejeo / Tabla pasiva:</strong> Vista por periodo de lo debido, pagado, pendiente y diferencia según esta disposición. Permite verificar que los pagos al fondeador coinciden con lo devengado.
                    </p>
                  </div>
                  
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-border/60 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total debido</p>
                        <p className="text-xl font-semibold tabular-nums">
                          {formatCurrency(tablaPasiva.reduce((acc, p) => acc + p.totalDebido, 0))}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-border/60 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total pagado</p>
                        <p className="text-xl font-semibold tabular-nums text-emerald-600">
                          {formatCurrency(tablaPasiva.reduce((acc, p) => acc + p.totalPagado, 0))}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-border/60 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Pendiente</p>
                        <p className={`text-xl font-semibold tabular-nums ${totalPendiente > 0 ? "text-amber-600" : ""}`}>
                          {formatCurrency(totalPendiente)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Table */}
                  <Card>
                    <CardContent className="p-0">
                      <div className="max-h-[400px] overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="sticky top-0 bg-muted/50 font-semibold">Per.</TableHead>
                              <TableHead className="sticky top-0 bg-muted/50 font-semibold">Fecha</TableHead>
                              <TableHead className="sticky top-0 bg-muted/50 text-right font-semibold">Capital</TableHead>
                              <TableHead className="sticky top-0 bg-muted/50 text-right font-semibold">Interés</TableHead>
                              <TableHead className="sticky top-0 bg-muted/50 text-right font-semibold">Morat.</TableHead>
                              <TableHead className="sticky top-0 bg-muted/50 text-right font-semibold">Acces.</TableHead>
                              <TableHead className="sticky top-0 bg-muted/50 text-right font-semibold">Total debido</TableHead>
                              <TableHead className="sticky top-0 bg-muted/50 text-right font-semibold">Pagado</TableHead>
                              <TableHead className="sticky top-0 bg-muted/50 text-right font-semibold">Pendiente</TableHead>
                              <TableHead className="sticky top-0 bg-muted/50 text-right font-semibold">Diferencia</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tablaPasiva.map((periodo) => (
                              <TableRow key={periodo.periodo}>
                                <TableCell className="font-medium">{periodo.periodo}</TableCell>
                                <TableCell className="text-sm">{formatDate(periodo.fecha)}</TableCell>
                                <TableCell className="text-right tabular-nums">{formatCurrency(periodo.capital)}</TableCell>
                                <TableCell className="text-right tabular-nums">{formatCurrency(periodo.interes)}</TableCell>
                                <TableCell className={`text-right tabular-nums ${periodo.moratorios > 0 ? "text-rose-600" : ""}`}>
                                  {formatCurrency(periodo.moratorios)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">{formatCurrency(periodo.accesorios)}</TableCell>
                                <TableCell className="text-right font-medium tabular-nums">{formatCurrency(periodo.totalDebido)}</TableCell>
                                <TableCell className="text-right tabular-nums text-emerald-600">{formatCurrency(periodo.totalPagado)}</TableCell>
                                <TableCell className={`text-right font-medium tabular-nums ${periodo.pendiente > 0 ? "text-amber-600" : ""}`}>
                                  {formatCurrency(periodo.pendiente)}
                                </TableCell>
                                <TableCell className={`text-right tabular-nums ${periodo.diferencia > 0 ? "text-rose-600 font-medium" : ""}`}>
                                  {formatCurrency(periodo.diferencia)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  {totalDiferencia > 0 && (
                    <Card className="border-rose-200 bg-rose-50">
                      <CardContent className="p-4">
                        <p className="text-sm font-medium text-rose-800">
                          Diferencia acumulada: {formatCurrency(totalDiferencia)}
                        </p>
                        <p className="mt-1 text-sm text-rose-600">
                          Se detectaron diferencias en los pagos. Revise el espejeo para más detalles.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Historial Tab */}
                <TabsContent value="historial" className="m-0 space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Historial de cambios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {historialMock.map((item, index) => (
                          <div key={index} className="flex gap-4 border-l-2 border-muted pl-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{item.accion}</p>
                                <span className="text-xs text-muted-foreground">{item.fecha}</span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{item.detalle}</p>
                              <p className="mt-1 text-xs text-muted-foreground">Por: {item.usuario}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
            </Tabs>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleImprimir}>
                  <Printer className="mr-2 size-4" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportar}>
                  <Download className="mr-2 size-4" />
                  Exportar
                </Button>
              </div>
              <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
            </div>
          </div>
      </SheetContent>
    </Sheet>
  )
}
