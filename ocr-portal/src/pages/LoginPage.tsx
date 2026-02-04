import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Button, Input } from '../components/common';

const loginSchema = z.object({
  email: z.string().email('유효하지 않은 이메일 주소입니다'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
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
      setError('로그인에 실패했습니다. 자격 증명을 확인하세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="max-w-md w-full space-y-6 p-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold">OCR Portal</h1>
          <p className="text-muted-foreground mt-2">
            파일과 OCR 결과에 액세스하려면 로그인하세요
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
                  이메일 <span className="text-destructive">*</span>
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
                  비밀번호 <span className="text-destructive">*</span>
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? '로그인 중...' : '로그인'}
              </Button>
            </div>
          </form>

          {/* Development Helper */}
          <div className="mt-4 p-3 rounded-md bg-muted text-xs">
            <p className="font-medium mb-1">개발 모드:</p>
            <p>'admin'이 포함된 이메일은 관리자 권한으로 로그인됩니다</p>
            <p>그 외의 이메일은 일반 사용자 권한으로 로그인됩니다</p>
            <p>비밀번호: 최소 6자 이상</p>
          </div>
        </div>
      </div>
    </div>
  );
}
