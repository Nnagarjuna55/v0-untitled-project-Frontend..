"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ShieldCheck } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { GoogleIcon, MicrosoftIcon } from "@/components/icons" // Move icons to separate component file

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
    setError("") // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store the token in localStorage or using a state management solution
      localStorage.setItem("token", data.token)

      // Redirect to dashboard
      router.push("/dashboard/assignments")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "microsoft") => {
    // Implement social login logic here
    setError(`${provider} login not implemented yet`)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Benefits and testimonials (hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-between bg-mint/20 p-10 dark:bg-gray-800/50 lg:flex">
        {/* ... Keep existing left side content ... */}
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <Card className="w-full max-w-md border-0 shadow-lg lg:shadow-xl">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <div className="flex justify-center lg:hidden">
                <Logo size="md" />
              </div>
              <CardTitle className="text-center text-2xl font-bold">Log in to your account</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/50 dark:text-red-200">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                >
                  <GoogleIcon className="mr-2 h-5 w-5 text-[#4285F4]" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("microsoft")}
                  disabled={isLoading}
                >
                  <MicrosoftIcon className="mr-2 h-5 w-5 text-[#00A4EF]" />
                  Microsoft
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
                Sign up for free
              </Link>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500">
              <ShieldCheck className="mr-1 h-3 w-3" /> Secure login
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
