import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Button, Input } from '../components/common';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="max-w-md w-full space-y-6 p-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold">OCR Portal</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your files and OCR results
          </p>
        </div>

        {/* Form Card */}
        <div className="border rounded-lg p-6 bg-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password <span className="text-destructive">*</span>
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* Development Helper */}
          <div className="mt-4 p-3 rounded-md bg-muted text-xs">
            <p className="font-medium mb-1">Development Mode:</p>
            <p>Use any email with 'admin' for ADMIN role</p>
            <p>Any other email for USER role</p>
            <p>Password: minimum 6 characters</p>
          </div>
        </div>
      </div>
    </div>
  );
}
