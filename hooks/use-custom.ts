// Hooks réutilisables pour EFFICIENCE ANALYTICS

import { useState, useCallback, useEffect } from "react"

// Hook pour gérer la pagination
export function usePagination<T>(items: T[], pageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedItems = items.slice(startIndex, startIndex + pageSize)

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
  }
}

// Hook pour gérer les filtres
export function useFilters<T>(items: T[], filterFn?: (item: T, filters: Record<string, any>) => boolean) {
  const [filters, setFilters] = useState<Record<string, any>>({})

  const filteredItems = filterFn
    ? items.filter((item) => filterFn(item, filters))
    : items.filter((item) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true
          const itemValue = (item as any)[key]
          return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
        })
      })

  const addFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  return {
    filters,
    filteredItems,
    addFilter,
    removeFilter,
    clearFilters,
  }
}

// Hook pour gérer le tri
export function useSorting<T>(items: T[], defaultSortKey?: string, defaultSortOrder: "asc" | "desc" = "asc") {
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey || null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder)

  const sortedItems = [...items].sort((a, b) => {
    if (!sortKey) return 0

    const aValue = (a as any)[sortKey]
    const bValue = (b as any)[sortKey]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    }

    const aStr = String(aValue).toLowerCase()
    const bStr = String(bValue).toLowerCase()
    return sortOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  const toggleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }, [sortKey])

  return {
    sortKey,
    sortOrder,
    sortedItems,
    toggleSort,
  }
}

// Hook pour gérer les données asynchrones
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(async () => {
    setStatus("pending")
    setData(null)
    setError(null)

    try {
      const response = await asyncFunction()
      setData(response)
      setStatus("success")
      return response
    } catch (error) {
      setError(error as E)
      setStatus("error")
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    execute,
    status,
    data,
    error,
  }
}

// Hook pour gérer les modals
export function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

// Hook pour gérer le localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch {
        console.error(`Error storing value in localStorage for key "${key}"`)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue] as const
}

// Hook pour les notifications/toasts
export function useNotification() {
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info"; duration?: number }>>([])

  const addNotification = useCallback((message: string, type: "success" | "error" | "info" = "info", duration = 5000) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, message, type, duration }])

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return {
    notifications,
    addNotification,
    removeNotification,
  }
}

// Hook pour débouncer une fonction
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Hook pour throttle une fonction
export function useThrottle<T>(value: T, interval: number = 1000): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdated = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()

    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const handler = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, interval)

      return () => clearTimeout(handler)
    }
  }, [value, interval])

  return throttledValue
}

// Hook pour gérer un formulaire
export function useForm<T extends Record<string, any>>(initialValues: T, onSubmit?: (values: T) => void | Promise<void>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)

      try {
        if (onSubmit) {
          await onSubmit(values)
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, onSubmit]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  }
}

// Import React useRef
import { useRef }
