"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { LogoutButton } from "@/components/auth/logout-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, User, Settings, HelpCircle, ChevronDown } from "lucide-react"

export function UserMenu() {
  const { user, isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!isAuthenticated || !user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleIcon = () => {
    return user.role === "admin" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">{getInitials(user.nom)}</AvatarFallback>
          </Avatar>

          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user.nom}</p>
            <p className="text-xs text-gray-500">{user.cabinetNom || user.email}</p>
          </div>

          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">{getInitials(user.nom)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.nom}</p>
              <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs mt-1">
                {getRoleIcon()}
                <span className="ml-1">{user.role === "admin" ? "Administrateur" : "Cabinet"}</span>
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="h-4 w-4 mr-2" />
          Mon Profil
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </DropdownMenuItem>

        <DropdownMenuItem>
          <HelpCircle className="h-4 w-4 mr-2" />
          Support
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <LogoutButton
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
