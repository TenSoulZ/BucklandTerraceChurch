'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError('');
    
    try {
      // Mock login for now
      // const response = await api.post('/api/v1/auth/login/', data);
      // setAuth(response.user, response.access);
      setTimeout(() => {
        setAuth({ id: 1, email: data.email, first_name: 'Admin', last_name: 'User', roles: ['admin'] }, 'mock-token');
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card className="shadow-sm border-0 w-100" style={{ maxWidth: '450px' }}>
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">Welcome Back</h2>
              <p className="text-muted">Sign in to access your dashboard</p>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  {...register('email')}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <div className="d-flex justify-content-between">
                  <Form.Label>Password</Form.Label>
                  <Link href="/forgot-password" className="small text-decoration-none">Forgot password?</Link>
                </div>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  {...register('password')}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <div className="text-center text-muted small">
                Don't have an account? <Link href="/register" className="text-decoration-none fw-bold">Create an account</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}
