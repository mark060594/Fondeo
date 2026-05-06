"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ChevronDown,
  Building2,
  Wallet,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  ArrowRightLeft,
  FileCheck,
  PieChart,
  Receipt,
  FileBarChart
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const fondeoItems = [
  {
    title: "Dashboard",
    url: "/admin/fondeo/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Fondeadores",
    url: "/admin/fondeo/fondeadores",
    icon: Users
  },
  {
    title: "Líneas de fondeo",
    url: "/admin/fondeo/lineas",
    icon: CreditCard
  },
  {
    title: "Asignación por contrato",
    url: "/admin/fondeo/asignacion",
    icon: FileCheck
  },
  {
    title: "Disposiciones",
    url: "/admin/fondeo/disposiciones",
    icon: ArrowRightLeft
  },
  {
    title: "Cartera pasiva",
    url: "/admin/fondeo/cartera-pasiva",
    icon: PieChart
  },
  {
    title: "Estado de cuenta",
    url: "/admin/fondeo/edo-cuenta",
    icon: Receipt
  },
  {
    title: "Reportes del fondeador",
    url: "/admin/fondeo/reportes",
    icon: FileBarChart
  }
]

const otherMenuItems = [
  {
    title: "Análisis",
    url: "/admin/analisis",
    icon: BarChart3
  },
  {
    title: "Comisiones",
    url: "/admin/comisiones",
    icon: Wallet
  },
  {
    title: "Reportes",
    url: "/admin/reportes",
    icon: FileText
  }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const isFondeoActive = pathname.startsWith("/admin/fondeo")

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/fondeo/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground text-background">
                  <Building2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">BREL Financial</span>
                  <span className="text-xs text-muted-foreground">Sistema de gestión</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Fondeo Menu with submenu */}
              <Collapsible defaultOpen={isFondeoActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Fondeo"
                      className={cn(
                        isFondeoActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <Wallet className="size-4" />
                      <span>Fondeo</span>
                      <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {fondeoItems.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === item.url}
                          >
                            <Link href={item.url}>
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Other menu items */}
              {otherMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Soporte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Configuración">
                  <Link href="/admin/configuracion">
                    <Settings className="size-4" />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Ayuda">
                  <Link href="/admin/ayuda">
                    <HelpCircle className="size-4" />
                    <span>Ayuda</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      JG
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Juan García</span>
                    <span className="text-xs text-muted-foreground">Administrador</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width]"
              >
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Mi perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
