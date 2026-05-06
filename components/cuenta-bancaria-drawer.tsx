"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import type { CuentaBancaria } from "@/lib/mock-data"

interface CuentaBancariaDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cuenta?: CuentaBancaria | null
  onSave: (cuenta: Omit<CuentaBancaria, "id">) => void
}

const bancos = [
  "Banamex",
  "BBVA",
  "Santander",
  "Banorte",
  "HSBC",
  "Scotiabank",
  "Banregio",
  "Inbursa",
  "Banco Azteca",
  "Afirme"
]

export function CuentaBancariaDrawer({
  open,
  onOpenChange,
  cuenta,
  onSave
}: CuentaBancariaDrawerProps) {
  const [banco, setBanco] = React.useState(cuenta?.banco || "")
  const [clabe, setClabe] = React.useState(cuenta?.clabe || "")
  const [alias, setAlias] = React.useState(cuenta?.alias || "")
  const [moneda, setMoneda] = React.useState<"MXN" | "USD">(cuenta?.moneda || "MXN")

  React.useEffect(() => {
    if (cuenta) {
      setBanco(cuenta.banco)
      setClabe(cuenta.clabe)
      setAlias(cuenta.alias)
      setMoneda(cuenta.moneda)
    } else {
      setBanco("")
      setClabe("")
      setAlias("")
      setMoneda("MXN")
    }
  }, [cuenta, open])

  const isValid = banco && clabe.length === 18 && alias

  const handleSave = () => {
    if (!isValid) return
    onSave({
      banco,
      clabe,
      alias,
      moneda,
      estatus: "Activa"
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        {/* Fixed Header */}
        <SheetHeader className="flex-shrink-0 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>{cuenta ? "Editar cuenta" : "Agregar cuenta bancaria"}</SheetTitle>
              <SheetDescription className="sr-only">
                {cuenta ? "Editar cuenta bancaria existente" : "Agregar una nueva cuenta bancaria al fondeador"}
              </SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Banco</FieldLabel>
              <Select value={banco} onValueChange={setBanco}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar banco" />
                </SelectTrigger>
                <SelectContent>
                  {bancos.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>CLABE / Cuenta</FieldLabel>
              <Input
                value={clabe}
                onChange={(e) => setClabe(e.target.value.replace(/\D/g, "").slice(0, 18))}
                placeholder="18 dígitos"
                className="font-mono"
                maxLength={18}
              />
              {clabe && clabe.length !== 18 && (
                <p className="text-xs text-muted-foreground">
                  {clabe.length}/18 dígitos
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel>Beneficiario / Alias</FieldLabel>
              <Input
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Ej: Principal, Secundaria..."
              />
            </Field>

            <Field>
              <FieldLabel>Moneda</FieldLabel>
              <Select value={moneda} onValueChange={(v) => setMoneda(v as "MXN" | "USD")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MXN">MXN - Pesos mexicanos</SelectItem>
                  <SelectItem value="USD">USD - Dólares americanos</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t px-6 py-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              {cuenta ? "Guardar cambios" : "Agregar cuenta"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
