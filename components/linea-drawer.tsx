"use client"

import * as React from "react"
import {
  X,
  Calendar,
  Percent,
  AlertCircle,
  Info,
  Pencil
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  type LineaFondeo,
  disposicionesSimpleMock,
  contratosMock,
  formatCurrency,
  formatDate
} from "@/lib/mock-data"

interface LineaDrawerProps {
  linea: LineaFondeo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
}

export function LineaDrawer({ linea, open, onOpenChange, onEdit }: LineaDrawerProps) {
  if (!linea) return null

  const utilizacion = (linea.montoDispuesto / linea.montoAutorizado) * 100

  // Mock audit timeline
  const auditTimeline = [
    { fecha: "2025-03-08 11:20", accion: "Nueva disposición registrada", usuario: "María López" },
    { fecha: "2025-02-25 16:45", accion: "Pago aplicado", usuario: "Sistema" },
    { fecha: "2025-02-10 09:30", accion: "Modificación de tasa de interés", usuario: "Juan García" },
    { fecha: linea.fechaCreacion + " 10:00", accion: "Línea de fondeo creada", usuario: "Admin Sistema" }
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0 gap-0">
        {/* Fixed Header */}
        <SheetHeader className="flex-shrink-0 p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-xl font-mono">{linea.numeroLinea}</SheetTitle>
              <SheetDescription className="sr-only">
                Detalles de la línea de fondeo {linea.numeroLinea}
              </SheetDescription>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{linea.fondeadorNombre}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant="outline"
                  className={
                    linea.estatus === "Activa" 
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : linea.estatus === "Por vencer"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : linea.estatus === "Agotada"
                      ? "border-slate-200 bg-slate-50 text-slate-600"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }
                >
                  {linea.estatus}
                </Badge>
                <Badge variant="outline" className="border-slate-200 text-slate-600">{linea.tipo}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Important Notice */}
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="size-4 text-primary" />
            <AlertDescription>
              <strong>Línea = bolsa general de fondeo.</strong> Disposición = aplicación concreta de recursos a un contrato específico con sus propias condiciones financieras.
            </AlertDescription>
          </Alert>

          {/* Datos generales + vigencia */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Datos generales</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tipo de línea</p>
                <p className="font-medium">{linea.tipo}</p>
              </div>
              {linea.tasaInteres && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Percent className="size-3" />
                    Tasa de interés
                  </p>
                  <p className="font-medium">{linea.tasaInteres}% anual</p>
                </div>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  Vigencia inicio
                </p>
                <p className="font-medium">{formatDate(linea.vigenciaInicio)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  Vigencia fin
                </p>
                <p className="font-medium">{formatDate(linea.vigenciaFin)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Capacidad financiera */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Capacidad financiera</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border/60 bg-card p-4 space-y-1">
                <p className="text-sm text-muted-foreground">Autorizado</p>
                <p className="text-xl font-semibold tabular-nums">{formatCurrency(linea.montoAutorizado)}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-4 space-y-1">
                <p className="text-sm text-muted-foreground">Dispuesto</p>
                <p className="text-xl font-semibold tabular-nums">{formatCurrency(linea.montoDispuesto)}</p>
              </div>
              <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50/50 p-4 space-y-1">
                <p className="text-sm text-muted-foreground">Disponible</p>
                <p className="text-xl font-semibold tabular-nums text-emerald-600">{formatCurrency(linea.montoDisponible)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Utilización de línea</span>
                <span className="font-medium">{utilizacion.toFixed(1)}%</span>
              </div>
              <Progress value={utilizacion} className="h-2" />
            </div>
          </div>

          <Separator />

          {/* Disposiciones asociadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Disposiciones asociadas (mock)</h3>
              <Badge variant="outline">{linea.disposiciones} total</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estatus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disposicionesSimpleMock.map((disp) => (
                  <TableRow key={disp.id}>
                    <TableCell className="font-mono text-sm">{disp.numero}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {formatCurrency(disp.monto)}
                    </TableCell>
                    <TableCell>{formatDate(disp.fecha)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          disp.estatus === "Activa"
                            ? "default"
                            : disp.estatus === "Pagada"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {disp.estatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Contratos relacionados */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Contratos relacionados (mock)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estatus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contratosMock.slice(0, 3).map((contrato) => (
                  <TableRow key={contrato.id}>
                    <TableCell className="font-mono text-sm">{contrato.numeroContrato}</TableCell>
                    <TableCell>{contrato.cliente}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {formatCurrency(contrato.monto)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          contrato.estatus === "Activo"
                            ? "default"
                            : contrato.estatus === "Liquidado"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {contrato.estatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Historial/Auditoría */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Historial de cambios</h3>
            <div className="space-y-4">
              {auditTimeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-2 rounded-full bg-foreground" />
                    {index < auditTimeline.length - 1 && (
                      <div className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">{item.accion}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.fecha} - {item.usuario}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t bg-background p-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            {onEdit && (
              <Button onClick={onEdit}>
                <Pencil className="mr-2 size-4" />
                Editar línea
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
