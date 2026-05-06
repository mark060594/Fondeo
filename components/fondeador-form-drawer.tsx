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
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { useFondeoStore } from "@/lib/fondeo-store"
import { toast } from "sonner"
import type { Fondeador } from "@/lib/mock-data"

interface FondeadorFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fondeador?: Fondeador | null
  onSave?: (data: Partial<Fondeador>) => void
}

export function FondeadorFormDrawer({ open, onOpenChange, fondeador, onSave }: FondeadorFormDrawerProps) {
  const { addFondeador, updateFondeador } = useFondeoStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const isEditing = !!fondeador

  // Form state
  const [tipo, setTipo] = React.useState<"Empresa" | "Persona">("Empresa")
  const [nombre, setNombre] = React.useState("")
  const [rfc, setRfc] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [telefono, setTelefono] = React.useState("")
  const [direccion, setDireccion] = React.useState("")
  const [estatus, setEstatus] = React.useState<"Activo" | "Inactivo">("Activo")

  // Initialize form when fondeador changes
  React.useEffect(() => {
    if (fondeador) {
      setTipo(fondeador.tipo)
      setNombre(fondeador.nombre)
      setRfc(fondeador.rfc)
      setEmail(fondeador.email || "")
      setTelefono(fondeador.telefono || "")
      setDireccion(fondeador.direccion || "")
      setEstatus(fondeador.estatus)
    } else {
      setTipo("Empresa")
      setNombre("")
      setRfc("")
      setEmail("")
      setTelefono("")
      setDireccion("")
      setEstatus("Activo")
    }
  }, [fondeador, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = { tipo, nombre, rfc, email, telefono, direccion, estatus }
    
    if (isEditing && fondeador) {
      // Update existing
      if (onSave) {
        onSave(formData)
      } else {
        updateFondeador(fondeador.id, formData)
        toast.success("Cambios guardados", {
          description: "Los datos del fondeador se han actualizado"
        })
      }
    } else {
      // Create new
      const newFondeador: Fondeador = {
        id: `f-${Date.now()}`,
        ...formData,
        lineasActivas: 0,
        montoAutorizado: 0,
        montoDispuesto: 0,
        saldoPendiente: 0,
        contratosRelacionados: 0,
        fechaCreacion: new Date().toISOString().split("T")[0]
      }
      addFondeador(newFondeador as any)
      toast.success("Fondeador creado", {
        description: `Se agregó ${nombre} al catálogo de fondeadores`
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
            <SheetTitle>{isEditing ? "Editar fondeador" : "Crear fondeador"}</SheetTitle>
            <SheetDescription className="sr-only">
              {isEditing ? "Formulario para editar un fondeador" : "Formulario para crear un nuevo fondeador"}
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
                <FieldLabel htmlFor="tipo">Tipo de fondeador</FieldLabel>
                <Select value={tipo} onValueChange={(v) => setTipo(v as "Empresa" | "Persona")}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Empresa">Empresa</SelectItem>
                    <SelectItem value="Persona">Persona física</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="nombre">Nombre / Razón social *</FieldLabel>
                <Input 
                  id="nombre" 
                  placeholder="Nombre completo o razón social"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="rfc">RFC *</FieldLabel>
                <Input 
                  id="rfc" 
                  placeholder="RFC con homoclave" 
                  className="font-mono uppercase"
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value.toUpperCase())}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="contacto@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
                <Input 
                  id="telefono" 
                  type="tel" 
                  placeholder="+52 55 1234 5678"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="direccion">Dirección</FieldLabel>
                <Textarea 
                  id="direccion" 
                  placeholder="Dirección fiscal completa" 
                  rows={3}
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="estatus">Estatus</FieldLabel>
                <Select value={estatus} onValueChange={(v) => setEstatus(v as "Activo" | "Inactivo")}>
                  <SelectTrigger id="estatus">
                    <SelectValue placeholder="Seleccionar estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
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
              <Button type="submit" disabled={isSubmitting || !nombre || !rfc}>
                {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear fondeador"}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
