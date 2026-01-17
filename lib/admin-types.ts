/**
 * Types pour l'authentification admin
 */

export interface Admin {
  id: string
  email: string
  name: string
  role: 'admin'
}

export interface User {
  id: string
  email: string
  name: string
  password: string
  role: 'admin' | 'user'
  cabinet?: string
  createdAt: Date
  isActive: boolean
  lastLogin?: Date | null
}

export interface TokenPayload {
  id: string
  email: string
  role: 'admin' | 'user'
}

export interface AuthResponse {
  success: boolean
  message: string
  admin?: Admin
  error?: string
}

export interface UserResponse {
  success: boolean
  message: string
  user?: Omit<User, 'password'>
  users?: Array<Omit<User, 'password'>>
  temporaryPassword?: string
  errors?: string[]
}

export interface ApiError {
  error: string
  errors?: string[]
}
