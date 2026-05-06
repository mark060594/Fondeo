"use client"

import * as React from "react"
import { X, DollarSign, Download, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, FileSpreadsheet } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  type CarteraPasivaItem,
  formatCurrency,
  formatDate
} from "@/lib/mock-data"
import { useFondeoStore } from "@/lib/fondeo-store"
import { toast } from "sonner"

interface CarteraPasivaDrawerProps {
  item: CarteraPasivaItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const estatusColors: Record<string, string> = {
  "Al corriente": "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  "Pendiente": "bg-amber-500/15 text-amber-700 border-amber-200",
  "Parcial": "bg-sky-500/15 text-sky-700 border-sky-200",
  "Con diferencia": "bg-rose-500/15 text-rose-700 border-rose-200",
  "Liquidado": "bg-slate-500/15 text-slate-700 border-slate-200"
}

// Mock comparativa data
const comparativaData = {
  amortizacionActiva: 175000,
  porcentajeParticipacion: 50,
  debidoFondeador: 87500,
  pagadoFondeador: 70000,
  brecha: 17500
}

// Mock periodos table - aligned with tabla pasiva model
const periodosMock = [
  { noPago: "Inicial", fecha: "2024-01-15", importe: 0, ivaRenta: 0, intereses: 0, amortizacion: 0, capVivo: 1500000, total: 0 },
  { noPago: "1", fecha: "2024-02-15", importe: 143125, ivaRenta: 22900, intereses: 17500, amortizacion: 125000, capVivo: 1375000, total: 165525 },
  { noPago: "2", fecha: "2024-03-15", importe: 143125, ivaRenta: 22900, intereses: 16875, amortizacion: 125000, capVivo: 1250000, total: 165525 },
  { noPago: "3", fecha: "2024-04-15", importe: 143125, ivaRenta: 22900, intereses: 16250, amortizacion: 125000, capVivo: 1125000, total: 165525 }
]

export function CarteraPasivaDrawer({ item, open, onOpenChange }: CarteraPasivaDrawerProps) {
  const { updateCarteraPasivaItem } = useFondeoStore()
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false)
  const [paymentAmount, setPaymentAmount] = React.useState("")
  const [paymentRef, setPaymentRef] = React.useState("")
  const [paymentNotes, setPaymentNotes] = React.useState("")

  if (!item) return null

  const handleRegisterPayment = () => {
    const amount = parseFloat(paymentAmount) || 0
    if (amount <= 0) return

    const newPagado = item.totalPagado + amount
    const newPendiente = Math.max(0, item.pendiente - amount)
    
    // Determine new status
    let newEstatus: CarteraPasivaItem["estatus"] = item.estatus
    if (newPendiente === 0) {
      newEstatus = "Liquidado"
    } else if (newPendiente < item.pendiente) {
      newEstatus = "Parcial"
    }

    updateCarteraPasivaItem(item.id, {
      totalPagado: newPagado,
      pendiente: newPendiente,
      diferencia: newPendiente,
      estatus: newEstatus
    })

    toast.success("Pago registrado", {
      description: `Se registró un pago de ${formatCurrency(amount)}`
    })

    setPaymentDialogOpen(false)
    setPaymentAmount("")
    setPaymentRef("")
    setPaymentNotes("")
  }

  const handleExportTablaPasiva = () => {
    toast.success("Tabla pasiva descargada", {
      description: `Archivo Excel con detalle por periodo exportado correctamente`
    })
  }

  // Mock summary data
  const montoFondeado = 1500000
  const capitalRecuperado = 375000
  const interesGenerado = 52500
  const interesPagado = 35000
  const pendienteTotal = item.pendiente
  const diferencia = item.diferencia

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-hidden p-0 sm:max-w-3xl">
        <div className="flex h-full flex-col">
          {/* Fixed Header */}
          <SheetHeader className="border-b bg-background px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <SheetTitle className="text-xl">Detalle cartera pasiva</SheetTitle>
                <SheetDescription className="sr-only">
                  Detalle de cartera pasiva del periodo
                </SheetDescription>
                <p className="text-sm text-muted-foreground">
                  {item.contratoNumero} • {item.cliente} • Periodo {item.periodo}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={estatusColors[item.estatus]}>
                  {item.estatus}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="resumen" className="h-full">
              <div className="border-b bg-muted/30 px-6">
                <TabsList className="h-12 w-full justify-start gap-2 bg-transparent p-0">
                  <TabsTrigger value="resumen" className="data-[state=active]:bg-background">
                    Resumen
                  </TabsTrigger>
                  <TabsTrigger value="espejeo" className="data-[state=active]:bg-background">
                    Espejeo
                  </TabsTrigger>
                  <TabsTrigger value="periodos" className="data-[state=active]:bg-background">
                    Por periodos
                  </TabsTrigger>
                  <TabsTrigger value="pagos" className="data-[state=active]:bg-background">
                    Pagos registrados
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                {/* Resumen Tab */}
                <TabsContent value="resumen" className="m-0 space-y-6">
                  {/* Executive Summary */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Resumen ejecutivo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-sm text-muted-foreground">Monto fondeado</p>
                          <p className="text-xl font-semibold tabular-nums">{formatCurrency(montoFondeado)}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-sm text-muted-foreground">Capital recuperado</p>
                          <p className="text-xl font-semibold tabular-nums text-emerald-600">{formatCurrency(capitalRecuperado)}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-sm text-muted-foreground">Interés generado</p>
                          <p className="text-xl font-semibold tabular-nums">{formatCurrency(interesGenerado)}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-sm text-muted-foreground">Interés pagado</p>
                          <p className="text-xl font-semibold tabular-nums text-emerald-600">{formatCurrency(interesPagado)}</p>
                        </div>
                        <div className={`rounded-lg p-4 ${pendienteTotal > 0 ? "bg-amber-50" : "bg-muted/50"}`}>
                          <p className="text-sm text-muted-foreground">Pendiente</p>
                          <p className={`text-xl font-semibold tabular-nums ${pendienteTotal > 0 ? "text-amber-600" : ""}`}>
                            {formatCurrency(pendienteTotal)}
                          </p>
                        </div>
                        <div className={`rounded-lg p-4 ${diferencia > 0 ? "bg-rose-50" : "bg-muted/50"}`}>
                          <p className="text-sm text-muted-foreground">Diferencia</p>
                          <p className={`text-xl font-semibold tabular-nums ${diferencia > 0 ? "text-rose-600" : ""}`}>
                            {formatCurrency(diferencia)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* General Info */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Información general</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Fondeador</p>
                          <p className="font-medium">{item.fondeadorNombre}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contrato</p>
                          <p className="font-medium font-mono">{item.contratoNumero}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cliente</p>
                          <p className="font-medium">{item.cliente}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Disposición</p>
                          <p className="font-medium font-mono">{item.disposicionNumero}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Periodo</p>
                          <p className="font-medium">{item.periodo}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alert if there's a difference */}
                  {diferencia > 0 && (
                    <Card className="border-rose-200 bg-rose-50">
                      <CardContent className="flex items-start gap-3 p-4">
                        <AlertTriangle className="mt-0.5 size-5 text-rose-600" />
                        <div>
                          <p className="font-medium text-rose-800">Se detectó una diferencia de {formatCurrency(diferencia)}</p>
                          <p className="mt-1 text-sm text-rose-600">
                            El monto pagado al fondeador no coincide con el debido. Revise el espejeo para más detalles.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Espejeo Tab */}
                <TabsContent value="espejeo" className="m-0 space-y-6">
                  {/* Microcopy - Updated formula explanation */}
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-medium text-foreground mb-2">
                      <strong>Pasivo = Activo × % participación</strong>
                    </p>
                    <p className="text-sm text-foreground/80">
                      Primero existe la tabla de amortización activa (lo que se cobra al cliente). 
                      Luego se aplica el porcentaje de participación del fondeador. 
                      Eso genera la tabla pasiva (lo debido al fondeador).
                    </p>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Cálculo del espejeo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Visual flow */}
                      <div className="grid grid-cols-5 items-center gap-2 text-center">
                        <div className="rounded-lg bg-emerald-50 p-4">
                          <p className="text-xs text-muted-foreground">Amortización Activa</p>
                          <p className="text-lg font-semibold tabular-nums text-emerald-700">{formatCurrency(comparativaData.amortizacionActiva)}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold text-muted-foreground">×</span>
                        </div>
                        <div className="rounded-lg bg-sky-50 p-4">
                          <p className="text-xs text-muted-foreground">% Participación</p>
                          <p className="text-lg font-semibold tabular-nums text-sky-700">{comparativaData.porcentajeParticipacion}%</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold text-muted-foreground">=</span>
                        </div>
                        <div className="rounded-lg bg-amber-50 p-4">
                          <p className="text-xs text-muted-foreground">Debido Fondeador</p>
                          <p className="text-lg font-semibold tabular-nums text-amber-700">{formatCurrency(comparativaData.debidoFondeador)}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Detailed comparison */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="size-5 text-emerald-500" />
                            <div>
                              <p className="font-medium">Amortización activa (contrato)</p>
                              <p className="text-sm text-muted-foreground">Tabla de amortización original</p>
                            </div>
                          </div>
                          <p className="text-lg font-semibold tabular-nums text-emerald-600">{formatCurrency(comparativaData.amortizacionActiva)}</p>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <TrendingDown className="size-5 text-amber-500" />
                            <div>
                              <p className="font-medium">Pagado al fondeador</p>
                              <p className="text-sm text-muted-foreground">Monto transferido real</p>
                            </div>
                          </div>
                          <p className="text-lg font-semibold tabular-nums text-amber-600">{formatCurrency(comparativaData.pagadoFondeador)}</p>
                        </div>

                        <div className={`flex items-center justify-between rounded-lg border p-4 ${comparativaData.brecha > 0 ? "border-rose-200 bg-rose-50" : ""}`}>
                          <div className="flex items-center gap-3">
                            <AlertTriangle className={`size-5 ${comparativaData.brecha > 0 ? "text-rose-500" : "text-muted-foreground"}`} />
                            <div>
                              <p className="font-medium">Brecha</p>
                              <p className="text-sm text-muted-foreground">Diferencia entre debido y pagado</p>
                            </div>
                          </div>
                          <p className={`text-lg font-semibold tabular-nums ${comparativaData.brecha > 0 ? "text-rose-600" : ""}`}>
                            {formatCurrency(comparativaData.brecha)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Periodos Tab */}
                <TabsContent value="periodos" className="m-0 space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Tabla pasiva por periodos</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">No. de pagos</TableHead>
                              <TableHead className="font-semibold">Fecha</TableHead>
                              <TableHead className="text-right font-semibold">Importe</TableHead>
                              <TableHead className="text-right font-semibold">IVA de la renta</TableHead>
                              <TableHead className="text-right font-semibold">Intereses</TableHead>
                              <TableHead className="text-right font-semibold">Amortización</TableHead>
                              <TableHead className="text-right font-semibold">Cap. Vivo</TableHead>
                              <TableHead className="text-right font-semibold">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {periodosMock.map((p, idx) => (
                              <TableRow key={idx} className={p.noPago === "Inicial" ? "bg-muted/30" : ""}>
                                <TableCell className="font-medium">{p.noPago}</TableCell>
                                <TableCell>{p.fecha}</TableCell>
                                <TableCell className="text-right tabular-nums">{p.importe > 0 ? formatCurrency(p.importe) : "-"}</TableCell>
                                <TableCell className="text-right tabular-nums">{p.ivaRenta > 0 ? formatCurrency(p.ivaRenta) : "-"}</TableCell>
                                <TableCell className="text-right tabular-nums">{p.intereses > 0 ? formatCurrency(p.intereses) : "-"}</TableCell>
                                <TableCell className="text-right tabular-nums">{p.amortizacion > 0 ? formatCurrency(p.amortizacion) : "-"}</TableCell>
                                <TableCell className="text-right tabular-nums font-medium">{formatCurrency(p.capVivo)}</TableCell>
                                <TableCell className="text-right tabular-nums font-medium">{p.total > 0 ? formatCurrency(p.total) : "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pagos Tab */}
                <TabsContent value="pagos" className="m-0 space-y-6">
                  {/* Microcopy explaining connection */}
                  <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                    <p className="text-sm text-sky-800">
                      <strong>Conexión con saldos:</strong> Los pagos registrados aquí actualizan automáticamente el saldo pendiente, 
                      la diferencia y el estado de cuenta del fondeador.
                    </p>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Historial de pagos al fondeador</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setPaymentDialogOpen(true)}>
                          <DollarSign className="mr-2 size-4" />
                          Registrar pago
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Fecha</TableHead>
                            <TableHead className="font-semibold">Referencia</TableHead>
                            <TableHead className="font-semibold">Concepto</TableHead>
                            <TableHead className="text-right font-semibold">Monto</TableHead>
                            <TableHead className="font-semibold">Estatus</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>2024-03-15</TableCell>
                            <TableCell className="font-mono text-sm">SPEI-789456</TableCell>
                            <TableCell>Pago periodo 1</TableCell>
                            <TableCell className="text-right tabular-nums text-emerald-600">{formatCurrency(142500)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Aplicado</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>2024-04-15</TableCell>
                            <TableCell className="font-mono text-sm">SPEI-456123</TableCell>
                            <TableCell>Pago periodo 2</TableCell>
                            <TableCell className="text-right tabular-nums text-emerald-600">{formatCurrency(142500)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Aplicado</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>2024-05-15</TableCell>
                            <TableCell className="font-mono text-sm">SPEI-123789</TableCell>
                            <TableCell>Pago parcial periodo 3</TableCell>
                            <TableCell className="text-right tabular-nums text-emerald-600">{formatCurrency(120000)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">Parcial</Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-border/60 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total pagado</p>
                        <p className="text-xl font-semibold tabular-nums text-emerald-600">{formatCurrency(405000)}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-border/60 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Pendiente</p>
                        <p className="text-xl font-semibold tabular-nums text-amber-600">{formatCurrency(item.pendiente)}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-border/60 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Pagos realizados</p>
                        <p className="text-xl font-semibold tabular-nums">3</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Fixed Footer - Only Excel Export Button */}
          <div className="border-t bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <DollarSign className="mr-2 size-4" />
                    Registrar pago parcial
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar pago parcial</DialogTitle>
                    <DialogDescription>
                      Registra un pago parcial para el periodo {item.periodo}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="rounded-lg bg-muted/50 p-3 mb-2">
                      <p className="text-sm text-muted-foreground">Pendiente actual</p>
                      <p className="text-lg font-semibold text-amber-600">{formatCurrency(item.pendiente)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Monto del pago</Label>
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        max={item.pendiente}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Referencia de pago</Label>
                      <Input 
                        placeholder="Ej: SPEI-123456"
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notas / Evidencia</Label>
                      <Textarea 
                        placeholder="Descripción del pago..." 
                        rows={3}
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleRegisterPayment}
                      disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                    >
                      Registrar pago
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button onClick={handleExportTablaPasiva}>
                <FileSpreadsheet className="mr-2 size-4" />
                Exportar Excel (Tabla Pasiva)
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
