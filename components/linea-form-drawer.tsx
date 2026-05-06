"use client"

import * as React from "react"
import { X } from "lucide-react"
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
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { fondeadores, type LineaFondeo } from "@/lib/mock-data"
import { useFondeoStore } from "@/lib/fondeo-store"
import { toast } from "sonner"

interface LineaFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  linea?: LineaFondeo | null
  isEditMode?: boolean
}

export function LineaFormDrawer({ open, onOpenChange, linea, isEditMode = false }: LineaFormDrawerProps) {
  const { addLinea, updateLinea } = useFondeoStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [fondeadorId, setFondeadorId] = React.useState(linea?.fondeadorId || "")
  const [tipo, setTipo] = React.useState(linea?.tipo || "Simple")
  const [montoAutorizado, setMontoAutorizado] = React.useState(linea?.montoAutorizado?.toString() || "")
  const [tasaInteres, setTasaInteres] = React.useState(linea?.tasaInteres?.toString() || "")
  const [vigenciaInicio, setVigenciaInicio] = React.useState(linea?.vigenciaInicio || "")
  const [vigenciaFin, setVigenciaFin] = React.useState(linea?.vigenciaFin || "")
  const [estatus, setEstatus] = React.useState(linea?.estatus || "Activa")

  const activeFondeadores = fondeadores.filter(f => f.estatus === "Activo")

  // Reset form when drawer opens with new data
  React.useEffect(() => {
    if (open) {
      if (linea && isEditMode) {
        setFondeadorId(linea.fondeadorId)
        setTipo(linea.tipo)
        setMontoAutorizado(linea.montoAutorizado.toString())
        setTasaInteres(linea.tasaInteres?.toString() || "")
        setVigenciaInicio(linea.vigenciaInicio)
        setVigenciaFin(linea.vigenciaFin)
        setEstatus(linea.estatus)
      } else {
        setFondeadorId("")
        setTipo("Simple")
        setMontoAutorizado("")
        setTasaInteres("")
        setVigenciaInicio("")
        setVigenciaFin("")
        setEstatus("Activa")
      }
    }
  }, [open, linea, isEditMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const fondeadorName = activeFondeadores.find(f => f.id === fondeadorId)?.nombre || ""
    
    const formData = {
      fondeadorId,
      fondeadorNombre: fondeadorName,
      tipo: tipo as LineaFondeo["tipo"],
      montoAutorizado: parseFloat(montoAutorizado) || 0,
      tasaInteres: parseFloat(tasaInteres) || 0,
      vigenciaInicio,
      vigenciaFin,
      estatus: estatus as LineaFondeo["estatus"]
    }
    
    if (isEditMode && linea) {
      updateLinea(linea.id, formData)
      toast.success("Línea actualizada", {
        description: `La línea ${linea.numeroLinea} se actualizó correctamente`
      })
    } else {
      const newLinea: LineaFondeo = {
        id: `l-${Date.now()}`,
        numeroLinea: `LF-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        ...formData,
        montoDispuesto: 0,
        montoDisponible: parseFloat(montoAutorizado) || 0,
        disposiciones: 0
      }
      addLinea(newLinea)
      toast.success("Línea creada", {
        description: `La nueva línea ${newLinea.numeroLinea} se creó correctamente`
      })
    }
    
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0 gap-0">
        {/* Fixed Header */}
        <SheetHeader className="flex-shrink-0 p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle>{isEditMode ? "Editar línea de fondeo" : "Crear línea de fondeo"}</SheetTitle>
              {isEditMode && linea && (
                <p className="text-sm text-muted-foreground font-mono mt-1">{linea.numeroLinea}</p>
              )}
            </div>
            <SheetDescription className="sr-only">
              {isEditMode ? "Formulario para editar una línea de fondeo" : "Formulario para crear una nueva línea de fondeo"}
            </SheetDescription>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fondeador">Fondeador</FieldLabel>
                <Select value={fondeadorId} onValueChange={setFondeadorId}>
                  <SelectTrigger id="fondeador">
                    <SelectValue placeholder="Seleccionar fondeador" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeFondeadores.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="tipo">Tipo de línea</FieldLabel>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Revolvente">Revolvente</SelectItem>
                    <SelectItem value="Simple">Simple</SelectItem>
                    <SelectItem value="Estructurada">Estructurada</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="montoAutorizado">Monto autorizado (MXN)</FieldLabel>
                <Input
                  id="montoAutorizado"
                  type="number"
                  placeholder="0.00"
                  className="font-mono"
                  value={montoAutorizado}
                  onChange={(e) => setMontoAutorizado(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="tasaInteres">Tasa de interés anual (%)</FieldLabel>
                <Input
                  id="tasaInteres"
                  type="number"
                  step="0.01"
                  placeholder="12.50"
                  className="font-mono"
                  value={tasaInteres}
                  onChange={(e) => setTasaInteres(e.target.value)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="vigenciaInicio">Fecha de inicio</FieldLabel>
                  <Input 
                    id="vigenciaInicio" 
                    type="date" 
                    value={vigenciaInicio}
                    onChange={(e) => setVigenciaInicio(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="vigenciaFin">Fecha de vencimiento</FieldLabel>
                  <Input 
                    id="vigenciaFin" 
                    type="date" 
                    value={vigenciaFin}
                    onChange={(e) => setVigenciaFin(e.target.value)}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="estatus">Estatus</FieldLabel>
                <Select value={estatus} onValueChange={setEstatus}>
                  <SelectTrigger id="estatus">
                    <SelectValue placeholder="Seleccionar estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activa">Activa</SelectItem>
                    <SelectItem value="Suspendida">Suspendida</SelectItem>
                    <SelectItem value="Por vencer">Por vencer</SelectItem>
                    <SelectItem value="Agotada">Agotada</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t p-6">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Guardando...
                  </>
                ) : isEditMode ? (
                  "Guardar cambios"
                ) : (
                  "Crear línea"
                )}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
