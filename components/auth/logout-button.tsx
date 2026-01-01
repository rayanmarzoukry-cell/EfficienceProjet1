"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  showIcon?: boolean
  showText?: boolean
  className?: string
}

export function LogoutButton({
  variant = "outline",
  size = "sm",
  showIcon = true,
  showText = true,
  className = "",
}: LogoutButtonProps) {
  const { logout, isLoading } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Button onClick={handleLogout} variant={variant} size={size} disabled={isLoading} className={className}>
      {showIcon && <LogOut className="h-4 w-4 mr-1" />}
      {showText && "Déconnexion"}
    </Button>
  )
}
