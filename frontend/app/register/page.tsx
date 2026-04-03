'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const registerSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError('');
    
    try {
      // Mock register for now
      // await api.post('/api/v1/auth/register/', data);
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card className="shadow-sm border-0 w-100" style={{ maxWidth: '500px' }}>
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">Create an Account</h2>
              <p className="text-muted">Join Buckland Terrace Community Church online</p>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Registration successful! Redirecting to login...</Alert>}

            {!success && (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Form.Group controlId="first_name">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        {...register('first_name')}
                        isInvalid={!!errors.first_name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.first_name?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Group controlId="last_name">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        {...register('last_name')}
                        isInvalid={!!errors.last_name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.last_name?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    {...register('email')}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    {...register('password')}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                  <Form.Text className="text-muted small">Must be at least 8 characters long.</Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                
                <div className="text-center text-muted small">
                  Already have an account? <Link href="/login" className="text-decoration-none fw-bold">Sign In</Link>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}
