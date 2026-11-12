"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/db/schema"
import Loading from "@/app/dashboard/tasks/loading"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, position: 'overall-cordinator' | 'head-coordinator' | 'core-coordinator' | 'executive' | 'members'
  ) => Promise<void>
  logout: () => void
  updateUser: (a: User) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Check for stored user on initialization
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } catch (error) {
            console.error("Failed to parse stored user:", error)
            localStorage.removeItem("user")
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  // Protect routes
  useEffect(() => {
    if (!isInitialized) return

    const publicRoutes = ["/", "/login", "/register"]
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!user && !isPublicRoute) {
      router.push("/login")
    } else if (user && isPublicRoute) {
      router.push("/dashboard")
    }
  }, [user, pathname, isInitialized])

  if (!isInitialized) {
    return <Loading /> // or null or a spinner
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Use relative URL for API calls to avoid CORS issues
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Login failed"

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, use the text as error message
          errorMessage = errorText.includes("<!DOCTYPE") ? "Server error - please try again" : errorText
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Save user to state and localStorage
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, position: 'overall-cordinator' | 'head-coordinator' | 'core-coordinator' | 'executive' | 'members') => {
    // Registrations are currently closed. Short-circuit and inform the user.
    toast({
      variant: "destructive",
      title: "Registrations closed",
      description: "New registrations are temporarily disabled. Please contact the team for more information.",
    })
    return
    
    /* Original implementation (commented out while registrations are closed):
    try {
      setIsLoading(true)

      // Use relative URL for API calls to avoid CORS issues
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, position }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Registration failed"

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, use the text as error message
          errorMessage = errorText.includes("<!DOCTYPE") ? "Server error - please try again" : errorText
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Save user to state and localStorage
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
    */
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const updateUser = async (updatedUser: User) => {
    setUser(updatedUser)
    const response = await fetch("/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = "Failed to update user"
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.error || errorMessage
      } catch {
        // If response is not JSON, use the text as error message
        errorMessage = errorText.includes("<!DOCTYPE") ? "Server error - please try again" : errorText
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }
  return <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
