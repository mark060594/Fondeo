"use client"

import { create } from "zustand"
import {
  type Fondeador,
  type LineaFondeo,
  type DisposicionCompleta,
  type ContratoAsignacion,
  type CarteraPasivaItem,
  type CuentaBancaria,
  fondeadores as initialFondeadores,
  lineasFondeo as initialLineas,
  disposicionesCompletas as initialDisposiciones,
  contratosAsignacion as initialContratos,
  carteraPasiva as initialCartera,
  cuentasBancarias as initialCuentas
} from "@/lib/mock-data"

interface FondeoState {
  // Data
  fondeadores: Fondeador[]
  lineas: LineaFondeo[]
  disposiciones: DisposicionCompleta[]
  contratos: ContratoAsignacion[]
  carteraPasiva: CarteraPasivaItem[]
  cuentasBancarias: Record<string, CuentaBancaria[]>
  
  // Actions - Fondeadores
  updateFondeador: (id: string, updates: Partial<Fondeador>) => void
  toggleFondeadorEstatus: (id: string) => void
  addFondeador: (fondeador: Fondeador) => void
  
  // Actions - Líneas
  updateLinea: (id: string, updates: Partial<LineaFondeo>) => void
  toggleLineaEstatus: (id: string, newEstatus: LineaFondeo["estatus"]) => void
  addLinea: (linea: LineaFondeo) => void
  
  // Actions - Disposiciones
  updateDisposicion: (id: string, updates: Partial<DisposicionCompleta>) => void
  toggleDisposicionEstatus: (id: string, newEstatus: DisposicionCompleta["estatus"]) => void
  addDisposicion: (disposicion: DisposicionCompleta) => void
  
  // Actions - Contratos/Asignaciones
  updateContrato: (id: string, updates: Partial<ContratoAsignacion>) => void
  
  // Actions - Cartera Pasiva
  updateCarteraPasivaItem: (id: string, updates: Partial<CarteraPasivaItem>) => void
  
  // Actions - Cuentas Bancarias
  addCuentaBancaria: (fondeadorId: string, cuenta: CuentaBancaria) => void
  updateCuentaBancaria: (fondeadorId: string, cuentaId: string, updates: Partial<CuentaBancaria>) => void
  toggleCuentaEstatus: (fondeadorId: string, cuentaId: string) => void
}

export const useFondeoStore = create<FondeoState>((set) => ({
  // Initial data
  fondeadores: initialFondeadores,
  lineas: initialLineas,
  disposiciones: initialDisposiciones,
  contratos: initialContratos,
  carteraPasiva: initialCartera,
  cuentasBancarias: initialCuentas,
  
  // Fondeadores actions
  updateFondeador: (id, updates) =>
    set((state) => ({
      fondeadores: state.fondeadores.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      )
    })),
    
  toggleFondeadorEstatus: (id) =>
    set((state) => ({
      fondeadores: state.fondeadores.map((f) =>
        f.id === id
          ? { ...f, estatus: f.estatus === "Activo" ? "Inactivo" : "Activo" }
          : f
      )
    })),
    
  addFondeador: (fondeador) =>
    set((state) => ({
      fondeadores: [...state.fondeadores, fondeador]
    })),
  
  // Líneas actions
  updateLinea: (id, updates) =>
    set((state) => ({
      lineas: state.lineas.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      )
    })),
    
  toggleLineaEstatus: (id, newEstatus) =>
    set((state) => ({
      lineas: state.lineas.map((l) =>
        l.id === id ? { ...l, estatus: newEstatus } : l
      )
    })),
    
  addLinea: (linea) =>
    set((state) => ({
      lineas: [...state.lineas, linea]
    })),
  
  // Disposiciones actions
  updateDisposicion: (id, updates) =>
    set((state) => ({
      disposiciones: state.disposiciones.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      )
    })),
    
  toggleDisposicionEstatus: (id, newEstatus) =>
    set((state) => ({
      disposiciones: state.disposiciones.map((d) =>
        d.id === id ? { ...d, estatus: newEstatus } : d
      )
    })),
    
  addDisposicion: (disposicion) =>
    set((state) => ({
      disposiciones: [...state.disposiciones, disposicion]
    })),
  
  // Contratos actions
  updateContrato: (id, updates) =>
    set((state) => ({
      contratos: state.contratos.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      )
    })),
  
  // Cartera Pasiva actions
  updateCarteraPasivaItem: (id, updates) =>
    set((state) => ({
      carteraPasiva: state.carteraPasiva.map((cp) =>
        cp.id === id ? { ...cp, ...updates } : cp
      )
    })),
  
  // Cuentas Bancarias actions
  addCuentaBancaria: (fondeadorId, cuenta) =>
    set((state) => ({
      cuentasBancarias: {
        ...state.cuentasBancarias,
        [fondeadorId]: [...(state.cuentasBancarias[fondeadorId] || []), cuenta]
      }
    })),
    
  updateCuentaBancaria: (fondeadorId, cuentaId, updates) =>
    set((state) => ({
      cuentasBancarias: {
        ...state.cuentasBancarias,
        [fondeadorId]: (state.cuentasBancarias[fondeadorId] || []).map((c) =>
          c.id === cuentaId ? { ...c, ...updates } : c
        )
      }
    })),
    
  toggleCuentaEstatus: (fondeadorId, cuentaId) =>
    set((state) => ({
      cuentasBancarias: {
        ...state.cuentasBancarias,
        [fondeadorId]: (state.cuentasBancarias[fondeadorId] || []).map((c) =>
          c.id === cuentaId
            ? { ...c, estatus: c.estatus === "Activa" ? "Inactiva" : "Activa" }
            : c
        )
      }
    }))
}))
