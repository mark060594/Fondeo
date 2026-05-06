import Link from "next/link"
import {
  Users,
  CreditCard,
  FileText,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { KPICard } from "@/components/kpi-card"
import {
  calcularKPIs,
  getTopFondeadores,
  getLineasPorVencer,
  movimientosRecientes,
  formatCurrency,
  formatDate
} from "@/lib/mock-data"

export default function FondeoDashboard() {
  const kpis = calcularKPIs()
  const topFondeadores = getTopFondeadores()
  const lineasPorVencer = getLineasPorVencer()

  // Mock data for contratos con diferencia
  const contratosConDiferencia = [
    { contrato: "CONT-2024-0089", cliente: "Grupo Industrial ABC", diferencia: 125000 },
    { contrato: "CONT-2024-0156", cliente: "Distribuidora del Centro", diferencia: 89500 },
    { contrato: "CONT-2024-0201", cliente: "Manufacturas del Norte", diferencia: 67200 },
    { contrato: "CONT-2024-0178", cliente: "Comercializadora XYZ", diferencia: 45000 },
    { contrato: "CONT-2024-0215", cliente: "Transportes Rápidos", diferencia: 32800 }
  ]

  // Mock data for cartera pasiva
  const carteraPasiva = {
    pagado: 185000000,
    pendiente: 211700000,
    diferencia: 15200000,
    total: 396700000
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard de Fondeo</h1>
        <p className="text-muted-foreground">
          Control de obligaciones pasivas, espejeo y diferencias operativas
        </p>
      </div>

      {/* KPI Cards - Primary Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Fondeadores activos"
          value={kpis.fondeadoresActivos}
          icon={Users}
        />
        <KPICard
          title="Líneas activas"
          value={kpis.lineasActivas}
          icon={CreditCard}
        />
        <KPICard
          title="Disposiciones activas"
          value={kpis.disposicionesActivas}
          icon={FileText}
          description="mock"
        />
      </div>

      {/* KPI Cards - Financial Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Monto autorizado"
          value={formatCurrency(kpis.montoAutorizado)}
          icon={Wallet}
          trend={{ value: 8.2, isPositive: true }}
        />
        <KPICard
          title="Monto dispuesto"
          value={formatCurrency(kpis.montoDispuesto)}
          icon={TrendingUp}
          trend={{ value: 5.1, isPositive: true }}
        />
        <KPICard
          title="Monto disponible"
          value={formatCurrency(kpis.montoDisponible)}
          icon={TrendingDown}
        />
      </div>

      {/* KPI Cards - Obligations Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Obligación pasiva total"
          value={formatCurrency(kpis.obligacionPasiva)}
          description="mock"
        />
        <KPICard
          title="Pendiente total"
          value={formatCurrency(kpis.pendienteTotal)}
          description="mock"
        />
        <KPICard
          title="Diferencias abiertas"
          value={kpis.diferenciasAbiertas}
          icon={AlertCircle}
          description="mock"
        />
      </div>

      {/* Widgets Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Fondeadores */}
        <Card className="bg-card border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">Top fondeadores por monto fondeado</CardTitle>
                <CardDescription>Ranking de fondeadores activos</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/fondeo/fondeadores">
                  Ver todos
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fondeador</TableHead>
                  <TableHead className="text-right">Dispuesto</TableHead>
                  <TableHead className="text-right">Líneas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topFondeadores.map((fondeador, index) => (
                  <TableRow key={fondeador.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex size-5 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="font-medium truncate max-w-[180px]">
                          {fondeador.nombre}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {formatCurrency(fondeador.montoDispuesto)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {fondeador.lineasActivas}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Líneas por vencer */}
        <Card className="bg-card border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">Líneas por vencer</CardTitle>
                <CardDescription>Próximos 60 días</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/fondeo/lineas?estatus=Por+vencer">
                  Ver todas
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Línea</TableHead>
                  <TableHead>Fondeador</TableHead>
                  <TableHead className="text-right">Vencimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineasPorVencer.length > 0 ? (
                  lineasPorVencer.slice(0, 5).map((linea) => (
                    <TableRow key={linea.id}>
                      <TableCell className="font-mono text-sm">
                        {linea.numeroLinea}
                      </TableCell>
                      <TableCell className="truncate max-w-[150px]">
                        {linea.fondeadorNombre}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="font-normal">
                          {formatDate(linea.vigenciaFin)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No hay líneas por vencer en los próximos 60 días
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Contratos con diferencia */}
        <Card className="bg-card border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">Contratos con diferencia</CardTitle>
                <CardDescription>Top 5</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/fondeo/cartera-pasiva?estatus=Con+diferencia">
                  Ver todos
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Diferencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contratosConDiferencia.map((contrato) => (
                  <TableRow key={contrato.contrato}>
                    <TableCell className="font-mono text-sm">
                      {contrato.contrato}
                    </TableCell>
                    <TableCell className="truncate max-w-[150px]">
                      {contrato.cliente}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-amber-600">
                      {formatCurrency(contrato.diferencia)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Movimientos recientes */}
        <Card className="bg-card border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">Movimientos recientes</CardTitle>
                <CardDescription>Disposiciones y pagos</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/fondeo/disposiciones">
                  Ver todos
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {movimientosRecientes.map((mov) => (
                <div
                  key={mov.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={mov.tipo === "Disposición" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {mov.tipo}
                      </Badge>
                      <span className="text-sm">{mov.descripcion}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {mov.fondeador} - {formatDate(mov.fecha)}
                    </p>
                  </div>
                  <span className={`tabular-nums text-sm ${mov.tipo === "Pago" ? "text-emerald-600" : ""}`}>
                    {mov.tipo === "Pago" ? "-" : "+"}{formatCurrency(mov.monto)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen cartera pasiva / Espejeo */}
      <Card className="bg-card border-2 border-primary/20 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-medium">Espejeo / Cartera pasiva</CardTitle>
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">Central</Badge>
              </div>
              <CardDescription>Tabla pasiva derivada de la amortización activa - Pagado vs Pendiente</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/fondeo/cartera-pasiva">
                Ver espejeo completo
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total debido</p>
              <p className="text-xl font-semibold tabular-nums">{formatCurrency(carteraPasiva.total)}</p>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-foreground/20 rounded-full w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pagado</p>
              <p className="text-xl font-semibold tabular-nums text-emerald-600">{formatCurrency(carteraPasiva.pagado)}</p>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(carteraPasiva.pagado / carteraPasiva.total) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pendiente</p>
              <p className="text-xl font-semibold tabular-nums text-amber-600">{formatCurrency(carteraPasiva.pendiente)}</p>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(carteraPasiva.pendiente / carteraPasiva.total) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Diferencia</p>
              <p className="text-xl font-semibold tabular-nums text-rose-600">{formatCurrency(carteraPasiva.diferencia)}</p>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${(carteraPasiva.diferencia / carteraPasiva.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
