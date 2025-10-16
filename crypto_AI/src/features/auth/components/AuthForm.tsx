import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/common/Card'
import type { LoginRequest, SignupRequest } from '@/types/auth'

interface AuthFormProps {
  type: 'login' | 'signup'
  onSubmit: (data: LoginRequest | SignupRequest) => void
  isPending: boolean
  disabled?: boolean
}

export function AuthForm({ type, onSubmit, isPending, disabled = false }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (type === 'signup' && !formData.name) {
      newErrors.name = 'Name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (type === 'login') {
        onSubmit({
          email: formData.email,
          password: formData.password,
        })
      } else {
        onSubmit({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        })
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear existing error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Real-time validation
    if (field === 'email' && value) {
      if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      }
    }
    
    if (field === 'password' && value) {
      if (value.length < 8) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }))
      } else if (value.length >= 8) {
        // Clear password error if it meets requirements
        setErrors(prev => ({ ...prev, password: '' }))
      }
    }
    
    if (field === 'name' && value) {
      if (value.length < 2) {
        setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }))
      } else {
        setErrors(prev => ({ ...prev, name: '' }))
      }
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
              placeholder="Enter your password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || disabled}
        >
          {isPending ? 'Loading...' : type === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </Card>
  )
}
