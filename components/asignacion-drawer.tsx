"use client"

import * as React from "react"
import Link from "next/link"
import { X, Plus, Trash2, AlertCircle, Info, Save, ExternalLink, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet"
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
  type ContratoAsignacion,
  type AsignacionFondeo,
  fondeadores,
  lineasFondeo,
  formatCurrency,
  formatDate
} from "@/lib/mock-data"
import { toast } from "sonner"

interface AsignacionDrawerProps {
  contrato: ContratoAsignacion | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (contratoId: string, updates: Partial<ContratoAsignacion>) => void
  isEditMode?: boolean
}

const estatusColors: Record<string, string> = {
  "Solo BREL": "bg-slate-500/15 text-slate-700 border-slate-200",
  "Con fondeadores": "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  "Con diferencia": "bg-rose-500/15 text-rose-700 border-rose-200",
  "En revisión": "bg-sky-500/15 text-sky-700 border-sky-200"
}

// BREL is the default participant - always exists
const BREL_PARTICIPANT = {
  id: "brel",
  fondeadorId: "brel",
  fondeadorNombre: "BREL Financial",
  lineaId: "brel-interno",
  lineaNumero: "Capital propio",
  isBrel: true
}

// Extended type with isBrel flag
interface AsignacionFondeoExtended extends AsignacionFondeo {
  isBrel?: boolean
}

// Mock existing assignments based on contract - BREL always exists
function getExistingAsignaciones(contratoId: string, montoContrato: number): AsignacionFondeoExtended[] {
  // Get external funders
  let externalFunders: AsignacionFondeoExtended[] = []
  
  if (contratoId === "ca1") {
    externalFunders = [
      {
        id: "a1",
        fondeadorId: "1",
        fondeadorNombre: "Banco Nacional de México S.A.",
        lineaId: "1",
        lineaNumero: "LF-2024-001",
        montoAsignado: 3500000,
        porcentajeParticipacion: 70
      },
      {
        id: "a2",
        fondeadorId: "2",
        fondeadorNombre: "BBVA Bancomer S.A.",
        lineaId: "4",
        lineaNumero: "LF-2023-015",
        montoAsignado: 1500000,
        porcentajeParticipacion: 30
      }
    ]
  } else if (contratoId === "ca2") {
    externalFunders = [
      {
        id: "a3",
        fondeadorId: "6",
        fondeadorNombre: "Grupo Financiero Santander",
        lineaId: "8",
        lineaNumero: "LF-2023-022",
        montoAsignado: 720000,
        porcentajeParticipacion: 60
      }
    ]
  } else if (contratoId === "ca4") {
    externalFunders = [
      {
        id: "a4",
        fondeadorId: "1",
        fondeadorNombre: "Banco Nacional de México S.A.",
        lineaId: "2",
        lineaNumero: "LF-2024-002",
        montoAsignado: 1280000,
        porcentajeParticipacion: 40
      },
      {
        id: "a5",
        fondeadorId: "2",
        fondeadorNombre: "BBVA Bancomer S.A.",
        lineaId: "5",
        lineaNumero: "LF-2024-008",
        montoAsignado: 960000,
        porcentajeParticipacion: 30
      },
      {
        id: "a6",
        fondeadorId: "3",
        fondeadorNombre: "Inversiones del Norte S.A. de C.V.",
        lineaId: "6",
        lineaNumero: "LF-2024-012",
        montoAsignado: 960000,
        porcentajeParticipacion: 30
      }
    ]
  } else if (contratoId === "ca5") {
    externalFunders = [
      {
        id: "a7",
        fondeadorId: "4",
        fondeadorNombre: "Carlos Mendoza Ríos",
        lineaId: "7",
        lineaNumero: "LF-2024-018",
        montoAsignado: 750000,
        porcentajeParticipacion: 100
      }
    ]
  }

  // Calculate BREL's participation (remainder)
  const externalTotal = externalFunders.reduce((acc, f) => acc + f.porcentajeParticipacion, 0)
  const brelParticipacion = Math.max(0, 100 - externalTotal)
  const brelMonto = (montoContrato * brelParticipacion) / 100

  // BREL always first
  const brelAsignacion: AsignacionFondeoExtended = {
    ...BREL_PARTICIPANT,
    montoAsignado: brelMonto,
    porcentajeParticipacion: brelParticipacion
  }

  return [brelAsignacion, ...externalFunders]
}

export function AsignacionDrawer({ contrato, open, onOpenChange, onSave, isEditMode = false }: AsignacionDrawerProps) {
  const [asignaciones, setAsignaciones] = React.useState<AsignacionFondeoExtended[]>([])
  const asignacionesRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (contrato) {
      setAsignaciones(getExistingAsignaciones(contrato.id, contrato.monto))
    }
  }, [contrato])

  // Scroll to assignments section when in edit mode
  React.useEffect(() => {
    if (open && isEditMode && asignacionesRef.current) {
      setTimeout(() => {
        asignacionesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [open, isEditMode])

  if (!contrato) return null

  const totalParticipacion = asignaciones.reduce((acc, a) => acc + a.porcentajeParticipacion, 0)
  const totalMontoAsignado = asignaciones.reduce((acc, a) => acc + a.montoAsignado, 0)
  const isValid = Math.abs(totalParticipacion - 100) < 0.01
  const faltante = 100 - totalParticipacion

  const addAsignacion = () => {
    const newAsignacion: AsignacionFondeoExtended = {
      id: `new-${Date.now()}`,
      fondeadorId: "",
      fondeadorNombre: "",
      lineaId: "",
      lineaNumero: "",
      montoAsignado: 0,
      porcentajeParticipacion: 0,
      isBrel: false
    }
    setAsignaciones([...asignaciones, newAsignacion])
  }

  const removeAsignacion = (id: string) => {
    // Cannot remove BREL
    const asignacion = asignaciones.find(a => a.id === id)
    if (asignacion?.isBrel) return
    
    setAsignaciones(asignaciones.filter(a => a.id !== id))
  }

  const updateAsignacion = (id: string, field: keyof AsignacionFondeoExtended, value: string | number) => {
    // Don't allow editing BREL's participation directly
    const asignacion = asignaciones.find(a => a.id === id)
    if (asignacion?.isBrel && field === "porcentajeParticipacion") return
    
    setAsignaciones(prev => {
      const updated = prev.map(a => {
        if (a.id !== id) return a
        
        const updatedItem = { ...a, [field]: value }
        
        // Auto-calculate monto when percentage changes
        if (field === "porcentajeParticipacion") {
          updatedItem.montoAsignado = (contrato.monto * (value as number)) / 100
        }
        
        // Update fondeador name when id changes
        if (field === "fondeadorId") {
          const fondeador = fondeadores.find(f => f.id === value)
          if (fondeador) {
            updatedItem.fondeadorNombre = fondeador.nombre
            updatedItem.lineaId = ""
            updatedItem.lineaNumero = ""
          }
        }
        
        // Update línea number when id changes
        if (field === "lineaId") {
          const linea = lineasFondeo.find(l => l.id === value)
          if (linea) {
            updatedItem.lineaNumero = linea.numeroLinea
          }
        }
        
        return updatedItem
      })
      
      // Recalculate BREL after external funder update
      const externalTotal = updated
        .filter(a => !a.isBrel)
        .reduce((acc, a) => acc + a.porcentajeParticipacion, 0)
      
      const brelParticipacion = Math.max(0, 100 - externalTotal)
      const brelMonto = (contrato.monto * brelParticipacion) / 100
      
      return updated.map(a => {
        if (a.isBrel) {
          return {
            ...a,
            porcentajeParticipacion: brelParticipacion,
            montoAsignado: brelMonto
          }
        }
        return a
      })
    })
  }

  const getLineasForFondeador = (fondeadorId: string) => {
    return lineasFondeo.filter(l => l.fondeadorId === fondeadorId && l.estatus === "Activa")
  }

  // Check for incomplete rows (excluding BREL)
  const hasIncompleteRows = asignaciones.some(a => 
    !a.isBrel && (!a.fondeadorId || !a.lineaId || a.porcentajeParticipacion === 0)
  )

  // Can save if total doesn't exceed 100% and no incomplete external rows
  const canSave = totalParticipacion <= 100 && !hasIncompleteRows

  const handleSave = () => {
    if (!contrato || !canSave) return

    // Determine new status: "Solo BREL" if no external funders, "Con fondeadores" otherwise
    const externalFunders = asignaciones.filter(a => !a.isBrel)
    const hasExternalFunders = externalFunders.some(a => a.porcentajeParticipacion > 0)
    const newEstatus = hasExternalFunders ? "Con fondeadores" : "Solo BREL"

    onSave?.(contrato.id, {
      estatusFondeo: newEstatus,
      porcentajeAsignado: 100, // Always 100% with BREL covering the remainder
      fondeadoresCount: externalFunders.filter(a => a.porcentajeParticipacion > 0).length
    })

    toast.success("Cambios guardados", {
      description: `La asignación del contrato ${contrato.numeroContrato} se ha actualizado correctamente`
    })

    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-hidden p-0 sm:max-w-3xl">
        <div className="flex h-full flex-col">
          {/* Fixed Header */}
          <SheetHeader className="border-b bg-background px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <SheetTitle className="text-xl">Asignar fondeo</SheetTitle>
                <SheetDescription className="sr-only">
                  Asignación de fondeo para el contrato
                </SheetDescription>
                <p className="text-sm text-muted-foreground">
                  {contrato.numeroContrato} • {contrato.cliente}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <Badge className="bg-primary text-primary-foreground">
                    Editando asignación
                  </Badge>
                )}
                <Badge variant="outline" className={estatusColors[contrato.estatusFondeo]}>
                  {contrato.estatusFondeo}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Contract Info */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Información del contrato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Monto</p>
                    <p className="text-lg font-semibold tabular-nums">{formatCurrency(contrato.monto)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plazo</p>
                    <p className="font-medium">{contrato.plazoMeses} meses</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tasa activa</p>
                    <p className="font-medium">{contrato.tasaActiva}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha contrato</p>
                    <p className="font-medium">{formatDate(contrato.fechaContrato)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Activo financiado</p>
                    <p className="font-medium">{contrato.activoFinanciado}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banner */}
            <Alert className="mb-6 border-sky-200 bg-sky-50">
              <Info className="size-4 text-sky-600" />
              <AlertDescription className="text-sky-800">
                <strong>BREL cubre automáticamente el porcentaje no asignado a fondeadores externos.</strong> La participación total siempre se mantiene en 100%.
              </AlertDescription>
            </Alert>

            {/* Participation Summary */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Distribución del contrato</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(totalMontoAsignado)} de {formatCurrency(contrato.monto)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress
                      value={100}
                      className="h-3 w-32 [&>div]:bg-emerald-500"
                    />
                    <span className="text-xl font-bold tabular-nums text-emerald-600">
                      100%
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-primary/60" />
                    <span>BREL: {asignaciones.find(a => a.isBrel)?.porcentajeParticipacion.toFixed(2) || 0}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-sky-500" />
                    <span>Externos: {(100 - (asignaciones.find(a => a.isBrel)?.porcentajeParticipacion || 0)).toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignments Table */}
            <Card ref={asignacionesRef} className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Asignaciones de fondeo</CardTitle>
                  <Button size="sm" onClick={addAsignacion}>
                    <Plus className="mr-2 size-4" />
                    Agregar fondeador externo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Fondeador</TableHead>
                      <TableHead className="font-semibold">Línea</TableHead>
                      <TableHead className="text-right font-semibold">Monto</TableHead>
                      <TableHead className="text-right font-semibold">% Participación</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asignaciones.map((asignacion) => (
                        <TableRow 
                          key={asignacion.id}
                          className={asignacion.isBrel ? "bg-primary/5" : ""}
                        >
                          <TableCell>
                            {asignacion.isBrel ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                  BREL
                                </Badge>
                                <span className="text-sm font-medium">BREL Financial</span>
                              </div>
                            ) : (
                              <Select
                                value={asignacion.fondeadorId}
                                onValueChange={(v) => updateAsignacion(asignacion.id, "fondeadorId", v)}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fondeadores.filter(f => f.estatus === "Activo").map((f) => (
                                    <SelectItem key={f.id} value={f.id}>
                                      {f.nombre.length > 25 ? f.nombre.substring(0, 25) + "..." : f.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            {asignacion.isBrel ? (
                              <span className="text-sm text-muted-foreground">Capital propio</span>
                            ) : (
                              <Select
                                value={asignacion.lineaId}
                                onValueChange={(v) => updateAsignacion(asignacion.id, "lineaId", v)}
                                disabled={!asignacion.fondeadorId}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getLineasForFondeador(asignacion.fondeadorId).map((l) => (
                                    <SelectItem key={l.id} value={l.id}>
                                      {l.numeroLinea}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {formatCurrency(asignacion.montoAsignado)}
                          </TableCell>
                          <TableCell>
                            {asignacion.isBrel ? (
                              <div className="w-24 text-right">
                                <span className="text-sm font-medium tabular-nums text-muted-foreground">
                                  {asignacion.porcentajeParticipacion.toFixed(2)}%
                                </span>
                                <p className="text-xs text-muted-foreground">Auto</p>
                              </div>
                            ) : (
                              <Input
                                type="number"
                                className="w-24 text-right"
                                value={asignacion.porcentajeParticipacion || ""}
                                onChange={(e) => updateAsignacion(asignacion.id, "porcentajeParticipacion", parseFloat(e.target.value) || 0)}
                                min={0}
                                max={100}
                                step={0.01}
                                placeholder="%"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {!asignacion.isBrel && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-muted-foreground hover:text-destructive"
                                onClick={() => removeAsignacion(asignacion.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Validation Alerts */}
            {totalParticipacion > 100 && (
              <Alert className="mb-6 border-rose-200 bg-rose-50">
                <AlertCircle className="size-4 text-rose-600" />
                <AlertDescription className="text-rose-800">
                  La suma de participación de fondeadores externos excede el 100%. Reduce el porcentaje de algún fondeador externo.
                </AlertDescription>
              </Alert>
            )}

            {hasIncompleteRows && asignaciones.filter(a => !a.isBrel).length > 0 && (
              <Alert className="mb-6 border-rose-200 bg-rose-50">
                <AlertCircle className="size-4 text-rose-600" />
                <AlertDescription className="text-rose-800">
                  Existen filas con datos incompletos. Cada fondeador externo debe tener fondeador, línea y % de participación.
                </AlertDescription>
              </Alert>
            )}

            {/* Reglas de Reparto - Unified */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Regla de reparto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm font-medium text-foreground">
                  Todos los cargos y abonos del contrato se distribuyen entre los fondeadores conforme al porcentaje de participación pactado.
                </p>
                <Separator />
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Conceptos incluidos</p>
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                      <div className="size-2 rounded-full bg-emerald-500" />
                      <span className="text-sm">Interés</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                      <div className="size-2 rounded-full bg-emerald-500" />
                      <span className="text-sm">Moratorios</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                      <div className="size-2 rounded-full bg-emerald-500" />
                      <span className="text-sm">Comisión neta / Remanente</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                      <div className="size-2 rounded-full bg-emerald-500" />
                      <span className="text-sm">Accesorias con utilidad</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                      <div className="size-2 rounded-full bg-emerald-500" />
                      <span className="text-sm">Otros cargos</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                      <div className="size-2 rounded-full bg-emerald-500" />
                      <span className="text-sm">Otros abonos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estimación pasiva próximo periodo (mock preview) */}
            {asignaciones.length > 0 && isValid && (
              <Card className="mt-6 border-sky-200 bg-sky-50/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-sky-600" />
                      <CardTitle className="text-base text-sky-900">Estimación pasiva próximo periodo</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="text-sky-700 hover:text-sky-800">
                      <Link href={`/admin/fondeo/cartera-pasiva?contratoId=${contrato.id}`}>
                        Ver espejeo
                        <ExternalLink className="ml-2 size-3" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {asignaciones.map((a) => (
                      <div key={a.id} className="flex items-center justify-between rounded-lg border border-sky-200 bg-white p-3">
                        <div>
                          <p className="text-sm font-medium">{a.fondeadorNombre || "Fondeador pendiente"}</p>
                          <p className="text-xs text-muted-foreground">{a.lineaNumero || "Línea pendiente"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold tabular-nums">{formatCurrency(a.montoAsignado * 0.02)}</p>
                          <p className="text-xs text-muted-foreground">Interés est. mensual</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between border-t border-sky-200 pt-3">
                      <p className="text-sm font-medium text-sky-900">Total estimado mensual</p>
                      <p className="text-base font-bold tabular-nums text-sky-700">
                        {formatCurrency(totalMontoAsignado * 0.02)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button disabled={!canSave} onClick={handleSave}>
                <Save className="mr-2 size-4" />
                Guardar asignación
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
