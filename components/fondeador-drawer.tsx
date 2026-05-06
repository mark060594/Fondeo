"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Plus,
  ExternalLink,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { KPICard } from "@/components/kpi-card"
import { CuentaBancariaDrawer } from "@/components/cuenta-bancaria-drawer"
import { FunderDocsTabContent } from "@/components/funder-docs-tab-content"
import { toast } from "sonner"
import { useFondeoStore } from "@/lib/fondeo-store"
import {
  type Fondeador,
  type CuentaBancaria,
  contratosMock,
  formatCurrency,
  formatDate
} from "@/lib/mock-data"

interface FondeadorDrawerProps {
  fondeador: Fondeador | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
}

export function FondeadorDrawer({ fondeador, open, onOpenChange, onEdit }: FondeadorDrawerProps) {
  const router = useRouter()
  const { lineas, cuentasBancarias, addCuentaBancaria } = useFondeoStore()
  const [isCuentaDrawerOpen, setIsCuentaDrawerOpen] = React.useState(false)
  const [selectedCuenta, setSelectedCuenta] = React.useState<CuentaBancaria | null>(null)

  if (!fondeador) return null

  const cuentas = cuentasBancarias[fondeador.id] || []
  const lineasDelFondeador = lineas.filter(l => l.fondeadorId === fondeador.id)

  // Mock financial KPIs
  const totalFondeado = fondeador.montoDispuesto
  const capitalRecuperado = Math.round(fondeador.montoDispuesto * 0.35)
  const pagado = Math.round(fondeador.montoDispuesto * 0.4)
  const pendiente = fondeador.saldoPendiente
  const diferencia = Math.round(fondeador.saldoPendiente * 0.02)

  // Mock audit timeline
  const auditTimeline = [
    { fecha: "2025-03-10 14:32", accion: "Actualización de datos de contacto", usuario: "Juan García" },
    { fecha: "2025-02-28 10:15", accion: "Nueva línea de fondeo agregada", usuario: "María López" },
    { fecha: "2025-02-15 09:45", accion: "Cuenta bancaria agregada", usuario: "Juan García" },
    { fecha: "2025-01-20 16:20", accion: "Cambio de estatus a Activo", usuario: "Admin Sistema" },
    { fecha: fondeador.fechaCreacion + " 09:00", accion: "Fondeador creado", usuario: "Admin Sistema" }
  ]

  const handleAddCuenta = () => {
    setSelectedCuenta(null)
    setIsCuentaDrawerOpen(true)
  }

  const handleSaveCuenta = (cuenta: Omit<CuentaBancaria, "id">) => {
    const newCuenta: CuentaBancaria = {
      ...cuenta,
      id: `cb-${Date.now()}`
    }
    addCuentaBancaria(fondeador.id, newCuenta)
    toast.success("Cuenta bancaria agregada", {
      description: `Se agregó la cuenta ${cuenta.alias} correctamente`
    })
  }

  const handleViewLineas = () => {
    onOpenChange(false)
    router.push(`/admin/fondeo/lineas?fondeadorId=${fondeador.id}`)
  }

  const handleViewEstadoCuenta = () => {
    onOpenChange(false)
    router.push(`/admin/fondeo/edo-cuenta?fondeadorId=${fondeador.id}`)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0 gap-0">
          {/* Fixed Header */}
          <SheetHeader className="flex-shrink-0 px-6 py-4 border-b bg-background">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <SheetTitle className="text-xl">{fondeador.nombre}</SheetTitle>
                <SheetDescription className="sr-only">
                  Detalles del fondeador {fondeador.nombre}
                </SheetDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono">{fondeador.rfc}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <Badge 
                    variant="outline"
                    className={
                      fondeador.estatus === "Activo" 
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }
                  >
                    {fondeador.estatus}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 text-slate-600">{fondeador.tipo}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="size-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <Tabs defaultValue="resumen" className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-6">
                <TabsTrigger value="resumen">Resumen</TabsTrigger>
                <TabsTrigger value="cuentas">Cuentas</TabsTrigger>
                <TabsTrigger value="lineas">Líneas</TabsTrigger>
                <TabsTrigger value="contratos">Contratos</TabsTrigger>
                <TabsTrigger value="estado">Estado</TabsTrigger>
                <TabsTrigger value="docs">Docs</TabsTrigger>
                <TabsTrigger value="audit">Auditoría</TabsTrigger>
              </TabsList>

              {/* Resumen Tab */}
              <TabsContent value="resumen" className="space-y-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Información de contacto</h3>
                  <div className="grid gap-3">
                    {fondeador.tipo === "Empresa" ? (
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 className="size-4 text-muted-foreground" />
                        <span>Empresa</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-sm">
                        <User className="size-4 text-muted-foreground" />
                        <span>Persona física</span>
                      </div>
                    )}
                    {fondeador.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="size-4 text-muted-foreground" />
                        <span>{fondeador.email}</span>
                      </div>
                    )}
                    {fondeador.telefono && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="size-4 text-muted-foreground" />
                        <span>{fondeador.telefono}</span>
                      </div>
                    )}
                    {fondeador.direccion && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span>{fondeador.direccion}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span>Registrado el {formatDate(fondeador.fechaCreacion)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Financial KPIs */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Resumen financiero</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <KPICard title="Total fondeado" value={formatCurrency(totalFondeado)} />
                    <KPICard title="Capital recuperado" value={formatCurrency(capitalRecuperado)} variant="success" />
                    <KPICard title="Pagado" value={formatCurrency(pagado)} variant="success" />
                    <KPICard title="Pendiente" value={formatCurrency(pendiente)} variant="warning" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <KPICard
                      title="Diferencia"
                      value={formatCurrency(diferencia)}
                      variant={diferencia > 0 ? "danger" : "default"}
                    />
                    <KPICard title="Líneas activas" value={fondeador.lineasActivas} />
                  </div>
                </div>
              </TabsContent>

              {/* Cuentas bancarias Tab */}
              <TabsContent value="cuentas" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Cuentas bancarias</h3>
                  <Button size="sm" onClick={handleAddCuenta}>
                    <Plus className="mr-2 size-4" />
                    Agregar cuenta
                  </Button>
                </div>
                {cuentas.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Banco</TableHead>
                        <TableHead className="font-semibold">CLABE</TableHead>
                        <TableHead className="font-semibold">Alias</TableHead>
                        <TableHead className="font-semibold">Moneda</TableHead>
                        <TableHead className="font-semibold">Estatus</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cuentas.map((cuenta) => (
                        <TableRow key={cuenta.id}>
                          <TableCell className="font-medium">{cuenta.banco}</TableCell>
                          <TableCell className="font-mono text-sm">{cuenta.clabe}</TableCell>
                          <TableCell>{cuenta.alias}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-200 text-slate-600">{cuenta.moneda}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                cuenta.estatus === "Activa" 
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                                  : "border-slate-200 bg-slate-50 text-slate-600"
                              }
                            >
                              {cuenta.estatus}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    No hay cuentas bancarias registradas
                  </div>
                )}
              </TabsContent>

              {/* Líneas Tab */}
              <TabsContent value="lineas" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Líneas de fondeo asociadas</h3>
                  <Button size="sm" variant="outline" onClick={handleViewLineas}>
                    <ExternalLink className="mr-2 size-4" />
                    Ver todas
                  </Button>
                </div>
                {lineasDelFondeador.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Número</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold">Estatus</TableHead>
                        <TableHead className="text-right font-semibold">Autorizado</TableHead>
                        <TableHead className="text-right font-semibold">Dispuesto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineasDelFondeador.map((linea) => (
                        <TableRow key={linea.id}>
                          <TableCell className="font-mono text-sm">{linea.numeroLinea}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-200 text-slate-600">{linea.tipo}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                linea.estatus === "Activa" 
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                                  : "border-slate-200 bg-slate-50 text-slate-600"
                              }
                            >
                              {linea.estatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm tabular-nums">
                            {formatCurrency(linea.montoAutorizado)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm tabular-nums">
                            {formatCurrency(linea.montoDispuesto)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    No hay líneas de fondeo asociadas
                  </div>
                )}
              </TabsContent>

              {/* Contratos Tab */}
              <TabsContent value="contratos" className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Contratos fondeados</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Contrato</TableHead>
                      <TableHead className="font-semibold">Cliente</TableHead>
                      <TableHead className="text-right font-semibold">Monto</TableHead>
                      <TableHead className="font-semibold">Estatus</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contratosMock.map((contrato) => (
                      <TableRow key={contrato.id}>
                        <TableCell className="font-mono text-sm">{contrato.numeroContrato}</TableCell>
                        <TableCell>{contrato.cliente}</TableCell>
                        <TableCell className="text-right font-mono text-sm tabular-nums">
                          {formatCurrency(contrato.monto)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              contrato.estatus === "Activo"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : contrato.estatus === "Liquidado"
                                ? "border-slate-200 bg-slate-50 text-slate-600"
                                : "border-rose-200 bg-rose-50 text-rose-700"
                            }
                          >
                            {contrato.estatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Estado de cuenta Tab */}
              <TabsContent value="estado" className="space-y-4">
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Los reportes detallados del fondeador se encuentran en el submódulo dedicado
                  </p>
                  <Button variant="outline" onClick={handleViewEstadoCuenta}>
                    <ExternalLink className="mr-2 size-4" />
                    Ir a Estado de cuenta
                  </Button>
                </div>
              </TabsContent>

              {/* Documentos Tab */}
              <TabsContent value="docs" className="space-y-4">
                <FunderDocsTabContent 
                  fondeadorId={fondeador.id} 
                  fondeadorNombre={fondeador.nombre} 
                />
              </TabsContent>

              {/* Auditoría Tab */}
              <TabsContent value="audit" className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Historial de cambios</h3>
                <div className="space-y-4">
                  {auditTimeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="size-2 rounded-full bg-primary" />
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
              </TabsContent>
            </Tabs>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t bg-background px-6 py-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
              {onEdit && (
                <Button onClick={onEdit}>
                  <Pencil className="mr-2 size-4" />
                  Editar fondeador
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Bank Account Sub-drawer */}
      <CuentaBancariaDrawer
        open={isCuentaDrawerOpen}
        onOpenChange={setIsCuentaDrawerOpen}
        cuenta={selectedCuenta}
        onSave={handleSaveCuenta}
      />
    </>
  )
}
