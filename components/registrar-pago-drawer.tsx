"use client"

import * as React from "react"
import { X, DollarSign, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { formatCurrency, type CarteraPasivaItem } from "@/lib/mock-data"

interface RegistrarPagoDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: CarteraPasivaItem | null
  tipo?: "cartera" // kept for backwards compatibility
  onSave?: (id: string, updates: { pagado: number; pendiente: number; diferencia: number }) => void
}

export function RegistrarPagoDrawer({ 
  open, 
  onOpenChange, 
  item, 
  tipo,
  onSave 
}: RegistrarPagoDrawerProps) {
  const [montoPago, setMontoPago] = React.useState("")
  const [tipoPago, setTipoPago] = React.useState<"capital" | "interes" | "total">("total")
  const [fechaPago, setFechaPago] = React.useState<Date>(new Date())
  const [referencia, setReferencia] = React.useState("")
  const [notas, setNotas] = React.useState("")

  // Reset form when item changes
  React.useEffect(() => {
    if (item) {
      setMontoPago("")
      setTipoPago("total")
      setFechaPago(new Date())
      setReferencia("")
      setNotas("")
    }
  }, [item])

  if (!item) return null

  const pendiente = item.pendiente
  const montoNumerico = parseFloat(montoPago) || 0
  const esValido = montoNumerico > 0 && montoNumerico <= pendiente

  const handleSave = () => {
    if (!esValido) return

    const nuevoPagado = item.totalPagado + montoNumerico
    const nuevoPendiente = pendiente - montoNumerico
    const nuevaDiferencia = nuevoPendiente

    onSave?.(item.id, {
      pagado: nuevoPagado,
      pendiente: nuevoPendiente,
      diferencia: nuevaDiferencia
    })

    toast.success("Pago registrado", {
      description: `Se registró un pago de ${formatCurrency(montoNumerico)}`
    })

    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-hidden p-0 sm:max-w-lg">
        <div className="flex h-full flex-col">
          {/* Fixed Header */}
          <SheetHeader className="flex-shrink-0 border-b bg-background px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <SheetTitle className="text-xl">Registrar pago</SheetTitle>
                <SheetDescription className="sr-only">
                  Formulario para registrar un pago
                </SheetDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="size-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Context Info */}
            <Card className="mb-6 bg-muted/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Fondeador</p>
                    <p className="font-medium text-sm">{"fondeadorNombre" in item ? item.fondeadorNombre : ""}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contrato</p>
                    <p className="font-medium font-mono text-sm">{"contratoNumero" in item ? item.contratoNumero : ""}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Periodo</p>
                    <p className="font-medium text-sm">{"periodo" in item ? item.periodo : ""}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pendiente</p>
                    <p className="font-medium text-sm text-amber-600">{formatCurrency(pendiente)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tipoPago">Tipo de pago</Label>
                <Select value={tipoPago} onValueChange={(v) => setTipoPago(v as typeof tipoPago)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Pago total</SelectItem>
                    <SelectItem value="capital">Solo capital</SelectItem>
                    <SelectItem value="interes">Solo interés</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="montoPago">Monto del pago *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="montoPago"
                    type="number"
                    placeholder="0.00"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    className="pl-9"
                    min={0}
                    max={pendiente}
                    step={0.01}
                  />
                </div>
                {montoNumerico > pendiente && (
                  <p className="text-sm text-rose-600">El monto no puede exceder el pendiente ({formatCurrency(pendiente)})</p>
                )}
                <div className="flex gap-2 mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setMontoPago(pendiente.toString())}
                  >
                    Pago completo
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setMontoPago((pendiente / 2).toFixed(2))}
                  >
                    50%
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fecha de pago</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaPago && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {fechaPago ? format(fechaPago, "dd 'de' MMMM 'de' yyyy", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaPago}
                      onSelect={(date) => date && setFechaPago(date)}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referencia">Referencia / Folio</Label>
                <Input
                  id="referencia"
                  placeholder="Ej: SPEI-2025-0001"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas (opcional)</Label>
                <Textarea
                  id="notas"
                  placeholder="Observaciones adicionales..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t bg-background p-6">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!esValido}>
                <DollarSign className="mr-2 size-4" />
                Registrar pago
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
