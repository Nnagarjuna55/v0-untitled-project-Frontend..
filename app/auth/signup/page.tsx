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
import { GoogleIcon, MicrosoftIcon } from "@/components/icons"

interface SignupFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
    setError("") // Clear error when user types
  }

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Signup failed")
      }

      // Optionally auto-login the user here
      // Store the token if returned
      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      // Redirect to dashboard or welcome page
      router.push("/dashboard/welcome")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async (provider: "google" | "microsoft") => {
    // Implement social signup logic here
    setError(`${provider} signup not implemented yet`)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Benefits and testimonials (hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-between bg-mint/20 p-10 dark:bg-gray-800/50 lg:flex">
        <div>
          <Logo size="lg" />
        </div>
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-onest">Join GradeGenie Today</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Start saving hours every week with AI-powered grading assistance.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-gray-700 dark:text-gray-200">Free trial - no credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-gray-700 dark:text-gray-200">Grade 100 assignments free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-gray-700 dark:text-gray-200">Cancel anytime</span>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  "Setting up GradeGenie was incredibly easy. Within minutes, I was grading papers faster than ever!"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">— Michael Chen, Math Teacher</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} GradeGenie. All rights reserved.
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <Card className="w-full max-w-md border-0 shadow-lg lg:shadow-xl">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <div className="flex justify-center lg:hidden">
                <Logo size="md" />
              </div>
              <CardTitle className="text-center text-2xl font-bold">Create your account</CardTitle>
              <CardDescription className="text-center">
                Start your free trial today
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
                  onClick={() => handleSocialSignup("google")}
                  disabled={isLoading}
                >
                  <GoogleIcon className="mr-2 h-5 w-5 text-[#4285F4]" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialSignup("microsoft")}
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
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
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Log in
              </Link>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500">
              <ShieldCheck className="mr-1 h-3 w-3" /> Secure signup
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
