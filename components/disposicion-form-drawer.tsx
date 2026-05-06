"use client"

import * as React from "react"
import { X, Save } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useFondeoStore } from "@/lib/fondeo-store"
import { fondeadores, type DisposicionCompleta } from "@/lib/mock-data"
import { toast } from "sonner"

interface DisposicionFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedLineaId?: string | null
  disposicion?: DisposicionCompleta | null
}

export function DisposicionFormDrawer({ 
  open, 
  onOpenChange,
  preselectedLineaId,
  disposicion
}: DisposicionFormDrawerProps) {
  const { lineas, addDisposicion, updateDisposicion } = useFondeoStore()
  const isEditMode = !!disposicion
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  // Form state
  const [fondeadorId, setFondeadorId] = React.useState("")
  const [lineaId, setLineaId] = React.useState("")
  const [contratoNumero, setContratoNumero] = React.useState("")
  const [cliente, setCliente] = React.useState("")
  const [montoDispuesto, setMontoDispuesto] = React.useState("")
  const [porcentaje, setPorcentaje] = React.useState("")

  // Get active fondeadores
  const activeFondeadores = fondeadores.filter(f => f.estatus === "Activo")
  
  // Get lineas for selected fondeador
  const fondeadorLineas = fondeadorId 
    ? lineas.filter(l => l.fondeadorId === fondeadorId && l.estatus === "Activa")
    : []

  // Initialize from preselected linea or edit mode
  React.useEffect(() => {
    if (open) {
      if (disposicion) {
        // Edit mode - populate with existing data
        setFondeadorId(disposicion.fondeadorId)
        setLineaId(disposicion.lineaId)
        setContratoNumero(disposicion.contratoNumero)
        setCliente(disposicion.cliente)
        setMontoDispuesto(disposicion.montoDispuesto.toString())
        setPorcentaje(disposicion.porcentajeParticipacion.toString())
      } else if (preselectedLineaId) {
        const linea = lineas.find(l => l.id === preselectedLineaId)
        if (linea) {
          setFondeadorId(linea.fondeadorId)
          setLineaId(linea.id)
        }
      }
    }
  }, [preselectedLineaId, disposicion, open, lineas])

  // Reset form when closed
  React.useEffect(() => {
    if (!open) {
      setFondeadorId("")
      setLineaId("")
      setContratoNumero("")
      setCliente("")
      setMontoDispuesto("")
      setPorcentaje("")
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const linea = lineas.find(l => l.id === lineaId)
    const fondeador = fondeadores.find(f => f.id === fondeadorId)
    
    if (!linea || !fondeador) {
      setIsSubmitting(false)
      return
    }

    if (isEditMode && disposicion) {
      // Update existing disposicion
      updateDisposicion(disposicion.id, {
        contratoNumero,
        cliente,
        montoDispuesto: parseFloat(montoDispuesto) || 0,
        porcentajeParticipacion: parseFloat(porcentaje) || 0
      })

      toast.success("Disposición actualizada", {
        description: `La disposición ${disposicion.numero} se actualizó correctamente`
      })
    } else {
      // Create new disposicion
      const newDisposicion: DisposicionCompleta = {
        id: `disp-${Date.now()}`,
        numero: `DISP-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        fondeadorId,
        fondeadorNombre: fondeador.nombre,
        lineaId,
        lineaNumero: linea.numeroLinea,
        contratoId: `c-${Date.now()}`,
        contratoNumero,
        cliente,
        montoDispuesto: parseFloat(montoDispuesto) || 0,
        porcentajeParticipacion: parseFloat(porcentaje) || 0,
        estatus: "Activa",
        pendiente: parseFloat(montoDispuesto) || 0,
        fechaCreacion: new Date().toISOString().split("T")[0],
        tipoInteres: "Fija",
        tasaInteres: 12.0,
        frecuenciaPago: "Mensual",
        plazoMeses: 12,
        esquemaAmortizacion: "Francés",
        periodoPago: "Día 15 de cada mes",
        zonaIVA: "16%",
        reglasRetorno: "Proporcional al % de participación"
      }

      addDisposicion(newDisposicion)

      toast.success("Disposición creada", {
        description: `La disposición ${newDisposicion.numero} se creó correctamente`
      })
    }
    
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const canSubmit = fondeadorId && lineaId && contratoNumero && cliente && montoDispuesto && porcentaje

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg overflow-hidden p-0 sm:max-w-xl">
        <div className="flex h-full flex-col">
          {/* Fixed Header */}
          <SheetHeader className="border-b bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <SheetTitle>{isEditMode ? "Editar disposición" : "Nueva disposición"}</SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <SheetDescription>
              {isEditMode 
                ? `Editando ${disposicion?.numero}` 
                : "Crear una nueva disposición de línea de fondeo"}
            </SheetDescription>
          </SheetHeader>

          {/* Scrollable Body */}
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fondeador">Fondeador *</FieldLabel>
              <Select value={fondeadorId} onValueChange={(v) => {
                setFondeadorId(v)
                setLineaId("") // Reset linea when fondeador changes
              }}>
                <SelectTrigger id="fondeador">
                  <SelectValue placeholder="Seleccionar fondeador" />
                </SelectTrigger>
                <SelectContent>
                  {activeFondeadores.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="linea">Línea de fondeo *</FieldLabel>
              <Select 
                value={lineaId} 
                onValueChange={setLineaId}
                disabled={!fondeadorId}
              >
                <SelectTrigger id="linea">
                  <SelectValue placeholder={fondeadorId ? "Seleccionar línea" : "Seleccione un fondeador primero"} />
                </SelectTrigger>
                <SelectContent>
                  {fondeadorLineas.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.numeroLinea}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Separator className="my-4" />

            <Field>
              <FieldLabel htmlFor="contrato">Número de contrato *</FieldLabel>
              <Input
                id="contrato"
                placeholder="Ej: CTR-2024-001"
                value={contratoNumero}
                onChange={(e) => setContratoNumero(e.target.value)}
                className="font-mono"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="cliente">Cliente *</FieldLabel>
              <Input
                id="cliente"
                placeholder="Nombre del cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
            </Field>

            <Separator className="my-4" />

            <Field>
              <FieldLabel htmlFor="monto">Monto a disponer *</FieldLabel>
              <Input
                id="monto"
                type="number"
                placeholder="0.00"
                value={montoDispuesto}
                onChange={(e) => setMontoDispuesto(e.target.value)}
                className="tabular-nums"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="porcentaje">% de participación *</FieldLabel>
              <Input
                id="porcentaje"
                type="number"
                placeholder="0 - 100"
                min={0}
                max={100}
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
                className="tabular-nums"
              />
            </Field>
          </FieldGroup>
            </div>

            {/* Fixed Footer */}
            <div className="border-t bg-background px-6 py-4">
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      {isEditMode ? "Guardar cambios" : "Crear disposición"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
