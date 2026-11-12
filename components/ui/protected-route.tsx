"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import type { User } from "@/db/schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { LoadingSpinner } from "./loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  checkPermission?: (user: User | null) => boolean
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, requireAuth = true, checkPermission, fallback }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to access this page.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <Link href={ROUTES.login}>
              <Button className="w-full">Sign In</Button>
            </Link>
            {/* Registration temporarily closed - Create Account disabled */}
            <Button disabled variant="outline" className="w-full">
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (checkPermission && !checkPermission(user)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this resource.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href={ROUTES.dashboard}>
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
