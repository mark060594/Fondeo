// Mock data for Fondeo module

export interface Fondeador {
  id: string
  nombre: string
  rfc: string
  tipo: "Persona" | "Empresa"
  estatus: "Activo" | "Inactivo"
  lineasActivas: number
  montoAutorizado: number
  montoDispuesto: number
  saldoPendiente: number
  contratosRelacionados: number
  fechaCreacion: string
  email?: string
  telefono?: string
  direccion?: string
}

export interface CuentaBancaria {
  id: string
  banco: string
  clabe: string
  alias: string
  moneda: "MXN" | "USD"
  estatus: "Activa" | "Inactiva"
}

export interface LineaFondeo {
  id: string
  numeroLinea: string
  fondeadorId: string
  fondeadorNombre: string
  tipo: "Revolvente" | "Simple" | "Estructurada"
  estatus: "Activa" | "Por vencer" | "Agotada" | "Suspendida" | "Cancelada"
  montoAutorizado: number
  montoDispuesto: number
  montoDisponible: number
  vigenciaInicio: string
  vigenciaFin: string
  disposiciones: number
  tasaInteres?: number
  fechaCreacion: string
}

export interface DisposicionSimple {
  id: string
  numero: string
  monto: number
  fecha: string
  estatus: "Activa" | "Pagada" | "Vencida"
}

export interface DisposicionCompleta {
  id: string
  numero: string
  fondeadorId: string
  fondeadorNombre: string
  lineaId: string
  lineaNumero: string
  contratoId: string
  contratoNumero: string
  cliente: string
  montoDispuesto: number
  porcentajeParticipacion: number
  estatus: "Activa" | "En revisión" | "Parcial" | "Liquidada" | "Con diferencia"
  pendiente: number
  fechaCreacion: string
  // Condiciones financieras
  tipoInteres: "Fija" | "Variable"
  tasaInteres: number
  frecuenciaPago: "Mensual" | "Quincenal" | "Semanal"
  plazoMeses: number
  esquemaAmortizacion: "Francés" | "Alemán" | "Bullet"
  periodoPago: string
  zonaIVA: "16%" | "8%" | "Exento"
  reglasRetorno: string
}

export interface TablaPasiva {
  periodo: number
  fecha: string
  capital: number
  interes: number
  moratorios: number
  accesorios: number
  totalDebido: number
  totalPagado: number
  pendiente: number
  diferencia: number
}

export interface ContratoAsignacion {
  id: string
  numeroContrato: string
  cliente: string
  monto: number
  plazoMeses: number
  tasaActiva: number
  fechaContrato: string
  activoFinanciado: string
  estatusFondeo: "Solo BREL" | "Con fondeadores" | "Con diferencia" | "En revisión"
  porcentajeAsignado: number
  fondeadoresCount: number
  diferencia: number
}

export interface AsignacionFondeo {
  id: string
  fondeadorId: string
  fondeadorNombre: string
  lineaId: string
  lineaNumero: string
  montoAsignado: number
  porcentajeParticipacion: number
}

export interface CarteraPasivaItem {
  id: string
  fondeadorId: string
  fondeadorNombre: string
  contratoId: string
  contratoNumero: string
  cliente: string
  disposicionId: string
  disposicionNumero: string
  periodo: string
  capitalDebido: number
  interesDebido: number
  totalDebido: number
  totalPagado: number
  pendiente: number
  diferencia: number
  estatus: "Al corriente" | "Pendiente" | "Parcial" | "Con diferencia" | "Liquidado"
}



export interface MovimientoEstadoCuenta {
  id: string
  fecha: string
  tipo: "Disposición" | "Pago capital" | "Pago interés" | "Ajuste" | "Cargo"
  referencia: string
  contratoNumero: string
  cargo: number
  abono: number
  saldo: number
}

export interface MovimientoReciente {
  id: string
  tipo: "Disposición" | "Pago"
  descripcion: string
  monto: number
  fecha: string
  fondeador: string
}

export interface ContratoRelacionado {
  id: string
  numeroContrato: string
  cliente: string
  monto: number
  estatus: "Activo" | "Liquidado" | "Vencido"
}

// Fondeadores mock data
export const fondeadores: Fondeador[] = [
  {
    id: "1",
    nombre: "Banco Nacional de México S.A.",
    rfc: "BNM840515VB1",
    tipo: "Empresa",
    estatus: "Activo",
    lineasActivas: 3,
    montoAutorizado: 150000000,
    montoDispuesto: 95000000,
    saldoPendiente: 45000000,
    contratosRelacionados: 127,
    fechaCreacion: "2022-03-15",
    email: "fondeo@banamex.com",
    telefono: "+52 55 1234 5678",
    direccion: "Av. Paseo de la Reforma 390, CDMX"
  },
  {
    id: "2",
    nombre: "BBVA Bancomer S.A.",
    rfc: "BBV950101AB2",
    tipo: "Empresa",
    estatus: "Activo",
    lineasActivas: 2,
    montoAutorizado: 200000000,
    montoDispuesto: 145000000,
    saldoPendiente: 78000000,
    contratosRelacionados: 203,
    fechaCreacion: "2021-08-20",
    email: "fondeo@bbva.mx",
    telefono: "+52 55 2345 6789"
  },
  {
    id: "3",
    nombre: "Inversiones del Norte S.A. de C.V.",
    rfc: "INO180423KL9",
    tipo: "Empresa",
    estatus: "Activo",
    lineasActivas: 1,
    montoAutorizado: 50000000,
    montoDispuesto: 32000000,
    saldoPendiente: 18000000,
    contratosRelacionados: 45,
    fechaCreacion: "2023-01-10"
  },
  {
    id: "4",
    nombre: "Carlos Mendoza Ríos",
    rfc: "MERC750812HDF",
    tipo: "Persona",
    estatus: "Activo",
    lineasActivas: 1,
    montoAutorizado: 15000000,
    montoDispuesto: 12000000,
    saldoPendiente: 5500000,
    contratosRelacionados: 18,
    fechaCreacion: "2023-06-05"
  },
  {
    id: "5",
    nombre: "Financiera del Bajío",
    rfc: "FBA990305MN3",
    tipo: "Empresa",
    estatus: "Inactivo",
    lineasActivas: 0,
    montoAutorizado: 30000000,
    montoDispuesto: 0,
    saldoPendiente: 0,
    contratosRelacionados: 12,
    fechaCreacion: "2020-11-22"
  },
  {
    id: "6",
    nombre: "Grupo Financiero Santander",
    rfc: "GFS010815QR7",
    tipo: "Empresa",
    estatus: "Activo",
    lineasActivas: 2,
    montoAutorizado: 180000000,
    montoDispuesto: 110000000,
    saldoPendiente: 62000000,
    contratosRelacionados: 156,
    fechaCreacion: "2022-05-18"
  },
  {
    id: "7",
    nombre: "María Elena Vázquez Torres",
    rfc: "VATM680215MDF",
    tipo: "Persona",
    estatus: "Activo",
    lineasActivas: 1,
    montoAutorizado: 8000000,
    montoDispuesto: 6500000,
    saldoPendiente: 3200000,
    contratosRelacionados: 9,
    fechaCreacion: "2024-02-14"
  }
]

// Cuentas bancarias mock data
export const cuentasBancarias: Record<string, CuentaBancaria[]> = {
  "1": [
    { id: "cb1", banco: "Banamex", clabe: "002180012345678901", alias: "Principal", moneda: "MXN", estatus: "Activa" },
    { id: "cb2", banco: "HSBC", clabe: "021180098765432101", alias: "Secundaria", moneda: "MXN", estatus: "Activa" },
    { id: "cb3", banco: "Banamex USD", clabe: "002180012345678902", alias: "Dólares", moneda: "USD", estatus: "Activa" }
  ],
  "2": [
    { id: "cb4", banco: "BBVA", clabe: "012180011111111101", alias: "Principal", moneda: "MXN", estatus: "Activa" },
    { id: "cb5", banco: "BBVA USD", clabe: "012180022222222201", alias: "Internacional", moneda: "USD", estatus: "Activa" }
  ],
  "3": [
    { id: "cb6", banco: "Banorte", clabe: "072180033333333301", alias: "Única", moneda: "MXN", estatus: "Activa" }
  ],
  "4": [
    { id: "cb7", banco: "Scotiabank", clabe: "044180044444444401", alias: "Personal", moneda: "MXN", estatus: "Activa" }
  ],
  "6": [
    { id: "cb8", banco: "Santander", clabe: "014180055555555501", alias: "Principal", moneda: "MXN", estatus: "Activa" },
    { id: "cb9", banco: "Santander USD", clabe: "014180066666666601", alias: "Dólares", moneda: "USD", estatus: "Inactiva" }
  ],
  "7": [
    { id: "cb10", banco: "Banregio", clabe: "058180077777777701", alias: "Personal", moneda: "MXN", estatus: "Activa" }
  ]
}

// Líneas de fondeo mock data
export const lineasFondeo: LineaFondeo[] = [
  {
    id: "1",
    numeroLinea: "LF-2024-001",
    fondeadorId: "1",
    fondeadorNombre: "Banco Nacional de México S.A.",
    tipo: "Revolvente",
    estatus: "Activa",
    montoAutorizado: 80000000,
    montoDispuesto: 52000000,
    montoDisponible: 28000000,
    vigenciaInicio: "2024-01-01",
    vigenciaFin: "2025-12-31",
    disposiciones: 45,
    tasaInteres: 12.5,
    fechaCreacion: "2024-01-01"
  },
  {
    id: "2",
    numeroLinea: "LF-2024-002",
    fondeadorId: "1",
    fondeadorNombre: "Banco Nacional de México S.A.",
    tipo: "Simple",
    estatus: "Activa",
    montoAutorizado: 40000000,
    montoDispuesto: 28000000,
    montoDisponible: 12000000,
    vigenciaInicio: "2024-03-15",
    vigenciaFin: "2025-03-14",
    disposiciones: 22,
    tasaInteres: 13.0,
    fechaCreacion: "2024-03-15"
  },
  {
    id: "3",
    numeroLinea: "LF-2024-003",
    fondeadorId: "1",
    fondeadorNombre: "Banco Nacional de México S.A.",
    tipo: "Estructurada",
    estatus: "Por vencer",
    montoAutorizado: 30000000,
    montoDispuesto: 15000000,
    montoDisponible: 15000000,
    vigenciaInicio: "2023-06-01",
    vigenciaFin: "2025-05-31",
    disposiciones: 18,
    tasaInteres: 11.8,
    fechaCreacion: "2023-06-01"
  },
  {
    id: "4",
    numeroLinea: "LF-2023-015",
    fondeadorId: "2",
    fondeadorNombre: "BBVA Bancomer S.A.",
    tipo: "Revolvente",
    estatus: "Activa",
    montoAutorizado: 120000000,
    montoDispuesto: 95000000,
    montoDisponible: 25000000,
    vigenciaInicio: "2023-08-01",
    vigenciaFin: "2026-07-31",
    disposiciones: 89,
    tasaInteres: 11.5,
    fechaCreacion: "2023-08-01"
  },
  {
    id: "5",
    numeroLinea: "LF-2024-008",
    fondeadorId: "2",
    fondeadorNombre: "BBVA Bancomer S.A.",
    tipo: "Simple",
    estatus: "Activa",
    montoAutorizado: 80000000,
    montoDispuesto: 50000000,
    montoDisponible: 30000000,
    vigenciaInicio: "2024-02-01",
    vigenciaFin: "2025-07-31",
    disposiciones: 34,
    tasaInteres: 12.0,
    fechaCreacion: "2024-02-01"
  },
  {
    id: "6",
    numeroLinea: "LF-2024-012",
    fondeadorId: "3",
    fondeadorNombre: "Inversiones del Norte S.A. de C.V.",
    tipo: "Simple",
    estatus: "Activa",
    montoAutorizado: 50000000,
    montoDispuesto: 32000000,
    montoDisponible: 18000000,
    vigenciaInicio: "2024-01-15",
    vigenciaFin: "2025-01-14",
    disposiciones: 28,
    tasaInteres: 14.0,
    fechaCreacion: "2024-01-15"
  },
  {
    id: "7",
    numeroLinea: "LF-2024-018",
    fondeadorId: "4",
    fondeadorNombre: "Carlos Mendoza Ríos",
    tipo: "Simple",
    estatus: "Activa",
    montoAutorizado: 15000000,
    montoDispuesto: 12000000,
    montoDisponible: 3000000,
    vigenciaInicio: "2024-06-01",
    vigenciaFin: "2025-05-31",
    disposiciones: 12,
    tasaInteres: 15.5,
    fechaCreacion: "2024-06-01"
  },
  {
    id: "8",
    numeroLinea: "LF-2023-022",
    fondeadorId: "6",
    fondeadorNombre: "Grupo Financiero Santander",
    tipo: "Revolvente",
    estatus: "Activa",
    montoAutorizado: 100000000,
    montoDispuesto: 70000000,
    montoDisponible: 30000000,
    vigenciaInicio: "2023-05-01",
    vigenciaFin: "2026-04-30",
    disposiciones: 67,
    tasaInteres: 11.2,
    fechaCreacion: "2023-05-01"
  },
  {
    id: "9",
    numeroLinea: "LF-2024-025",
    fondeadorId: "6",
    fondeadorNombre: "Grupo Financiero Santander",
    tipo: "Estructurada",
    estatus: "Por vencer",
    montoAutorizado: 80000000,
    montoDispuesto: 40000000,
    montoDisponible: 40000000,
    vigenciaInicio: "2024-01-01",
    vigenciaFin: "2025-04-30",
    disposiciones: 25,
    tasaInteres: 12.8,
    fechaCreacion: "2024-01-01"
  },
  {
    id: "10",
    numeroLinea: "LF-2024-030",
    fondeadorId: "7",
    fondeadorNombre: "María Elena Vázquez Torres",
    tipo: "Simple",
    estatus: "Activa",
    montoAutorizado: 8000000,
    montoDispuesto: 6500000,
    montoDisponible: 1500000,
    vigenciaInicio: "2024-02-15",
    vigenciaFin: "2025-02-14",
    disposiciones: 8,
    tasaInteres: 16.0,
    fechaCreacion: "2024-02-15"
  }
]

// Disposiciones simple mock data
export const disposicionesSimpleMock: DisposicionSimple[] = [
  { id: "d1", numero: "DISP-2024-001", monto: 5000000, fecha: "2024-01-15", estatus: "Activa" },
  { id: "d2", numero: "DISP-2024-002", monto: 8000000, fecha: "2024-02-20", estatus: "Activa" },
  { id: "d3", numero: "DISP-2024-003", monto: 3500000, fecha: "2024-03-10", estatus: "Pagada" },
  { id: "d4", numero: "DISP-2024-004", monto: 12000000, fecha: "2024-04-05", estatus: "Activa" },
  { id: "d5", numero: "DISP-2024-005", monto: 6500000, fecha: "2024-05-12", estatus: "Vencida" }
]

// Disposiciones completas mock data
export const disposicionesCompletas: DisposicionCompleta[] = [
  {
    id: "dc1",
    numero: "DISP-2025-0001",
    fondeadorId: "1",
    fondeadorNombre: "Banco Nacional de México S.A.",
    lineaId: "1",
    lineaNumero: "LF-2024-001",
    contratoId: "c1",
    contratoNumero: "CONT-2024-0125",
    cliente: "Grupo Industrial ABC",
    montoDispuesto: 2500000,
    porcentajeParticipacion: 70,
    estatus: "Activa",
    pendiente: 1875000,
    fechaCreacion: "2025-01-15",
    tipoInteres: "Fija",
    tasaInteres: 12.5,
    frecuenciaPago: "Mensual",
    plazoMeses: 24,
    esquemaAmortizacion: "Francés",
    periodoPago: "Día 15 de cada mes",
    zonaIVA: "16%",
    reglasRetorno: "Proporcional al % de participación"
  },
  {
    id: "dc2",
    numero: "DISP-2025-0002",
    fondeadorId: "2",
    fondeadorNombre: "BBVA Bancomer S.A.",
    lineaId: "4",
    lineaNumero: "LF-2023-015",
    contratoId: "c1",
    contratoNumero: "CONT-2024-0125",
    cliente: "Grupo Industrial ABC",
    montoDispuesto: 1071428,
    porcentajeParticipacion: 30,
    estatus: "Activa",
    pendiente: 803571,
    fechaCreacion: "2025-01-15",
    tipoInteres: "Fija",
    tasaInteres: 11.5,
    frecuenciaPago: "Mensual",
    plazoMeses: 24,
    esquemaAmortizacion: "Francés",
    periodoPago: "Día 15 de cada mes",
    zonaIVA: "16%",
    reglasRetorno: "Proporcional al % de participación"
  },
  {
    id: "dc3",
    numero: "DISP-2025-0003",
    fondeadorId: "1",
    fondeadorNombre: "Banco Nacional de México S.A.",
    lineaId: "2",
    lineaNumero: "LF-2024-002",
    contratoId: "c2",
    contratoNumero: "CONT-2024-0126",
    cliente: "Distribuidora del Centro",
    montoDispuesto: 1800000,
    porcentajeParticipacion: 100,
    estatus: "Activa",
    pendiente: 1440000,
    fechaCreacion: "2025-01-20",
    tipoInteres: "Fija",
    tasaInteres: 13.0,
    frecuenciaPago: "Mensual",
    plazoMeses: 18,
    esquemaAmortizacion: "Alemán",
    periodoPago: "Día 20 de cada mes",
    zonaIVA: "16%",
    reglasRetorno: "Proporcional al % de participación"
  },
  {
    id: "dc4",
    numero: "DISP-2025-0004",
    fondeadorId: "6",
    fondeadorNombre: "Grupo Financiero Santander",
    lineaId: "8",
    lineaNumero: "LF-2023-022",
    contratoId: "c4",
    contratoNumero: "CONT-2024-0128",
    cliente: "Comercializadora XYZ",
    montoDispuesto: 950000,
    porcentajeParticipacion: 100,
    estatus: "En revisión",
    pendiente: 712500,
    fechaCreacion: "2025-02-01",
    tipoInteres: "Variable",
    tasaInteres: 11.2,
    frecuenciaPago: "Quincenal",
    plazoMeses: 12,
    esquemaAmortizacion: "Francés",
    periodoPago: "Días 1 y 15",
    zonaIVA: "16%",
    reglasRetorno: "Proporcional al % de participación"
  },
  {
    id: "dc5",
    numero: "DISP-2025-0005",
    fondeadorId: "3",
    fondeadorNombre: "Inversiones del Norte S.A. de C.V.",
    lineaId: "6",
    lineaNumero: "LF-2024-012",
    contratoId: "c5",
    contratoNumero: "CONT-2024-0129",
    cliente: "Transportes Rápidos",
    montoDispuesto: 1500000,
    porcentajeParticipacion: 100,
    estatus: "Con diferencia",
    pendiente: 450000,
    fechaCreacion: "2025-02-10",
    tipoInteres: "Fija",
    tasaInteres: 14.0,
    frecuenciaPago: "Mensual",
    plazoMeses: 12,
    esquemaAmortizacion: "Bullet",
    periodoPago: "Día 10 de cada mes",
    zonaIVA: "8%",
    reglasRetorno: "Proporcional al % de participación"
  },
  {
    id: "dc6",
    numero: "DISP-2025-0006",
    fondeadorId: "4",
    fondeadorNombre: "Carlos Mendoza Ríos",
    lineaId: "7",
    lineaNumero: "LF-2024-018",
    contratoId: "c6",
    contratoNumero: "CONT-2024-0130",
    cliente: "Ferretería La Esquina",
    montoDispuesto: 350000,
    porcentajeParticipacion: 50,
    estatus: "Activa",
    pendiente: 280000,
    fechaCreacion: "2025-02-15",
    tipoInteres: "Fija",
    tasaInteres: 15.5,
    frecuenciaPago: "Semanal",
    plazoMeses: 6,
    esquemaAmortizacion: "Francés",
    periodoPago: "Viernes",
    zonaIVA: "16%",
    reglasRetorno: "Proporcional al % de participación"
  },
  {
    id: "dc7",
    numero: "DISP-2025-0007",
    fondeadorId: "7",
    fondeadorNombre: "María Elena Vázquez Torres",
    lineaId: "10",
    lineaNumero: "LF-2024-030",
    contratoId: "c6",
    contratoNumero: "CONT-2024-0130",
    cliente: "Ferretería La Esquina",
    montoDispuesto: 350000,
    porcentajeParticipacion: 50,
    estatus: "Activa",
    pendiente: 280000,
    fechaCreacion: "2025-02-15",
    tipoInteres: "Fija",
    tasaInteres: 16.0,
    frecuenciaPago: "Semanal",
    plazoMeses: 6,
    esquemaAmortizacion: "Francés",
    periodoPago: "Viernes",
    zonaIVA: "16%",
    reglasRetorno: "Proporcional al % de participación"
  },
  {
    id: "dc8",
    numero: "DISP-2024-0089",
    fondeadorId: "2",
    fondeadorNombre: "BBVA Bancomer S.A.",
    lineaId: "5",
    lineaNumero: "LF-2024-008",
    contratoId: "c3",
    contratoNumero: "CONT-2024-0127",
    cliente: "Manufacturas del Norte",
    montoDispuesto: 3200000,
    porcentajeParticipacion: 100,
    estatus: "Liquidada",
    pendiente: 0,
    fechaCreacion: "2024-08-01",
    tipoInteres: "Fija",
    tasaInteres: 12.0,
    frecuenciaPago: "Mensual",
    plazoMeses: 6,
    esquemaAmortizacion: "Francés",
    periodoPago: "Día 1 de cada mes",
    zonaIVA: "16%",
    reglasRetorno: "Proporcional al % de participación"
  }
]

// Tabla pasiva mock data generator
export function generarTablaPasiva(disposicionId: string): TablaPasiva[] {
  const periodos: TablaPasiva[] = []
  const baseCapital = 100000
  const baseInteres = 1250
  
  for (let i = 1; i <= 12; i++) {
    const pagado = i <= 8 ? baseCapital + baseInteres : (i === 9 ? baseCapital * 0.5 : 0)
    const totalDebido = baseCapital + baseInteres
    const pendiente = totalDebido - pagado
    periodos.push({
      periodo: i,
      fecha: `2025-${String(i).padStart(2, '0')}-15`,
      capital: baseCapital,
      interes: baseInteres,
      moratorios: i > 9 ? 250 : 0,
      accesorios: i % 3 === 0 ? 150 : 0,
      totalDebido: totalDebido + (i > 9 ? 250 : 0) + (i % 3 === 0 ? 150 : 0),
      totalPagado: pagado,
      pendiente: pendiente > 0 ? pendiente : 0,
      diferencia: i === 9 ? baseCapital * 0.5 : 0
    })
  }
  return periodos
}

// Contratos para asignación mock data
export const contratosAsignacion: ContratoAsignacion[] = [
  {
    id: "ca1",
    numeroContrato: "CONT-2025-0201",
    cliente: "Automotriz del Pacífico",
    monto: 5000000,
    plazoMeses: 36,
    tasaActiva: 18.5,
    fechaContrato: "2025-03-01",
    activoFinanciado: "Flota vehicular (10 unidades)",
    estatusFondeo: "Con fondeadores",
    porcentajeAsignado: 100,
    fondeadoresCount: 2,
    diferencia: 0
  },
  {
    id: "ca2",
    numeroContrato: "CONT-2025-0202",
    cliente: "Mueblería Moderna",
    monto: 1200000,
    plazoMeses: 24,
    tasaActiva: 16.0,
    fechaContrato: "2025-03-05",
    activoFinanciado: "Maquinaria industrial",
    estatusFondeo: "Con fondeadores",
    porcentajeAsignado: 100,
    fondeadoresCount: 1,
    diferencia: 0
  },
  {
    id: "ca3",
    numeroContrato: "CONT-2025-0203",
    cliente: "Constructora Hernández",
    monto: 8500000,
    plazoMeses: 48,
    tasaActiva: 17.5,
    fechaContrato: "2025-03-08",
    activoFinanciado: "Equipo de construcción",
    estatusFondeo: "Solo BREL",
    porcentajeAsignado: 100,
    fondeadoresCount: 0,
    diferencia: 0
  },
  {
    id: "ca4",
    numeroContrato: "CONT-2025-0204",
    cliente: "Agroindustrias del Valle",
    monto: 3200000,
    plazoMeses: 18,
    tasaActiva: 15.5,
    fechaContrato: "2025-03-10",
    activoFinanciado: "Tractores y sembradoras",
    estatusFondeo: "Con fondeadores",
    porcentajeAsignado: 100,
    fondeadoresCount: 3,
    diferencia: 0
  },
  {
    id: "ca5",
    numeroContrato: "CONT-2025-0205",
    cliente: "Textiles Oaxaca",
    monto: 750000,
    plazoMeses: 12,
    tasaActiva: 19.0,
    fechaContrato: "2025-03-11",
    activoFinanciado: "Máquinas de coser industriales",
    estatusFondeo: "En revisión",
    porcentajeAsignado: 100,
    fondeadoresCount: 1,
    diferencia: 0
  }
]

// Cartera pasiva mock data
export const carteraPasiva: CarteraPasivaItem[] = [
  {
    id: "cp1",
    fondeadorId: "1",
    fondeadorNombre: "Banco Nacional de México S.A.",
    contratoId: "c1",
    contratoNumero: "CONT-2024-0125",
    cliente: "Grupo Industrial ABC",
    disposicionId: "dc1",
    disposicionNumero: "DISP-2025-0001",
    periodo: "2025-03",
    capitalDebido: 104167,
    interesDebido: 26041,
    totalDebido: 130208,
    totalPagado: 130208,
    pendiente: 0,
    diferencia: 0,
    estatus: "Al corriente"
  },
  {
    id: "cp2",
    fondeadorId: "2",
    fondeadorNombre: "BBVA Bancomer S.A.",
    contratoId: "c1",
    contratoNumero: "CONT-2024-0125",
    cliente: "Grupo Industrial ABC",
    disposicionId: "dc2",
    disposicionNumero: "DISP-2025-0002",
    periodo: "2025-03",
    capitalDebido: 44643,
    interesDebido: 10268,
    totalDebido: 54911,
    totalPagado: 54911,
    pendiente: 0,
    diferencia: 0,
    estatus: "Al corriente"
  },
  {
    id: "cp3",
    fondeadorId: "1",
    fondeadorNombre: "Banco Nacional de México S.A.",
    contratoId: "c2",
    contratoNumero: "CONT-2024-0126",
    cliente: "Distribuidora del Centro",
    disposicionId: "dc3",
    disposicionNumero: "DISP-2025-0003",
    periodo: "2025-03",
    capitalDebido: 100000,
    interesDebido: 19500,
    totalDebido: 119500,
    totalPagado: 85000,
    pendiente: 34500,
    diferencia: 34500,
    estatus: "Parcial"
  },
  {
    id: "cp4",
    fondeadorId: "6",
    fondeadorNombre: "Grupo Financiero Santander",
    contratoId: "c4",
    contratoNumero: "CONT-2024-0128",
    cliente: "Comercializadora XYZ",
    disposicionId: "dc4",
    disposicionNumero: "DISP-2025-0004",
    periodo: "2025-03",
    capitalDebido: 79167,
    interesDebido: 8868,
    totalDebido: 88035,
    totalPagado: 0,
    pendiente: 88035,
    diferencia: 88035,
    estatus: "Pendiente"
  },
  {
    id: "cp5",
    fondeadorId: "3",
    fondeadorNombre: "Inversiones del Norte S.A. de C.V.",
    contratoId: "c5",
    contratoNumero: "CONT-2024-0129",
    cliente: "Transportes Rápidos",
    disposicionId: "dc5",
    disposicionNumero: "DISP-2025-0005",
    periodo: "2025-03",
    capitalDebido: 125000,
    interesDebido: 17500,
    totalDebido: 142500,
    totalPagado: 120000,
    pendiente: 22500,
    diferencia: 22500,
    estatus: "Con diferencia"
  },
  {
    id: "cp6",
    fondeadorId: "2",
    fondeadorNombre: "BBVA Bancomer S.A.",
    contratoId: "c3",
    contratoNumero: "CONT-2024-0127",
    cliente: "Manufacturas del Norte",
    disposicionId: "dc8",
    disposicionNumero: "DISP-2024-0089",
    periodo: "2025-02",
    capitalDebido: 533333,
    interesDebido: 32000,
    totalDebido: 565333,
    totalPagado: 565333,
    pendiente: 0,
    diferencia: 0,
    estatus: "Liquidado"
  }
]

// Movimientos estado de cuenta mock data
export const movimientosEstadoCuenta: MovimientoEstadoCuenta[] = [
  { id: "mec1", fecha: "2025-03-01", tipo: "Disposición", referencia: "DISP-2025-0001", contratoNumero: "CONT-2024-0125", cargo: 2500000, abono: 0, saldo: 2500000 },
  { id: "mec2", fecha: "2025-03-05", tipo: "Disposición", referencia: "DISP-2025-0003", contratoNumero: "CONT-2024-0126", cargo: 1800000, abono: 0, saldo: 4300000 },
  { id: "mec3", fecha: "2025-03-10", tipo: "Pago capital", referencia: "PAG-2025-0012", contratoNumero: "CONT-2024-0125", cargo: 0, abono: 104167, saldo: 4195833 },
  { id: "mec4", fecha: "2025-03-10", tipo: "Pago interés", referencia: "PAG-2025-0013", contratoNumero: "CONT-2024-0125", cargo: 0, abono: 26041, saldo: 4169792 },
  { id: "mec5", fecha: "2025-03-11", tipo: "Pago capital", referencia: "PAG-2025-0014", contratoNumero: "CONT-2024-0126", cargo: 0, abono: 65000, saldo: 4104792 },
  { id: "mec6", fecha: "2025-03-11", tipo: "Pago interés", referencia: "PAG-2025-0015", contratoNumero: "CONT-2024-0126", cargo: 0, abono: 20000, saldo: 4084792 },
  { id: "mec7", fecha: "2025-03-12", tipo: "Ajuste", referencia: "AJ-2025-0003", contratoNumero: "CONT-2024-0126", cargo: 0, abono: 1500, saldo: 4083292 }
]

// Contratos relacionados mock data
export const contratosMock: ContratoRelacionado[] = [
  { id: "c1", numeroContrato: "CONT-2024-0125", cliente: "Grupo Industrial ABC", monto: 2500000, estatus: "Activo" },
  { id: "c2", numeroContrato: "CONT-2024-0126", cliente: "Distribuidora del Centro", monto: 1800000, estatus: "Activo" },
  { id: "c3", numeroContrato: "CONT-2024-0127", cliente: "Manufacturas del Norte", monto: 3200000, estatus: "Liquidado" },
  { id: "c4", numeroContrato: "CONT-2024-0128", cliente: "Comercializadora XYZ", monto: 950000, estatus: "Activo" },
  { id: "c5", numeroContrato: "CONT-2024-0129", cliente: "Transportes Rápidos", monto: 1500000, estatus: "Vencido" }
]

// Movimientos recientes mock data
export const movimientosRecientes: MovimientoReciente[] = [
  { id: "m1", tipo: "Disposición", descripcion: "Nueva disposición LF-2024-001", monto: 5000000, fecha: "2025-03-11", fondeador: "Banco Nacional de México" },
  { id: "m2", tipo: "Pago", descripcion: "Pago parcial DISP-2024-003", monto: 1200000, fecha: "2025-03-10", fondeador: "BBVA Bancomer" },
  { id: "m3", tipo: "Disposición", descripcion: "Nueva disposición LF-2024-008", monto: 8500000, fecha: "2025-03-09", fondeador: "BBVA Bancomer" },
  { id: "m4", tipo: "Pago", descripcion: "Liquidación DISP-2024-002", monto: 3500000, fecha: "2025-03-08", fondeador: "Santander" },
  { id: "m5", tipo: "Disposición", descripcion: "Nueva disposición LF-2024-012", monto: 2800000, fecha: "2025-03-07", fondeador: "Inversiones del Norte" }
]

// KPI calculations
export function calcularKPIs() {
  const fondeadoresActivos = fondeadores.filter(f => f.estatus === "Activo").length
  const lineasActivas = lineasFondeo.filter(l => l.estatus === "Activa").length
  const disposicionesActivas = 248 // mock
  const montoAutorizado = lineasFondeo.reduce((acc, l) => acc + l.montoAutorizado, 0)
  const montoDispuesto = lineasFondeo.reduce((acc, l) => acc + l.montoDispuesto, 0)
  const montoDisponible = lineasFondeo.reduce((acc, l) => acc + l.montoDisponible, 0)
  const obligacionPasiva = 285000000 // mock
  const pendienteTotal = 211700000 // mock
  const diferenciasAbiertas = 3 // mock

  return {
    fondeadoresActivos,
    lineasActivas,
    disposicionesActivas,
    montoAutorizado,
    montoDispuesto,
    montoDisponible,
    obligacionPasiva,
    pendienteTotal,
    diferenciasAbiertas
  }
}

// Top fondeadores by monto fondeado
export function getTopFondeadores() {
  return fondeadores
    .filter(f => f.estatus === "Activo")
    .sort((a, b) => b.montoDispuesto - a.montoDispuesto)
    .slice(0, 5)
}

// Líneas por vencer (próximos 30/60 días)
export function getLineasPorVencer() {
  const hoy = new Date()
  const en60Dias = new Date(hoy.getTime() + 60 * 24 * 60 * 60 * 1000)
  
  return lineasFondeo
    .filter(l => {
      const vigenciaFin = new Date(l.vigenciaFin)
      return vigenciaFin <= en60Dias && l.estatus !== "Cancelada"
    })
    .sort((a, b) => new Date(a.vigenciaFin).getTime() - new Date(b.vigenciaFin).getTime())
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
