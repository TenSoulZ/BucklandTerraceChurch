'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { post } from '@/lib/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    setError('');
    
    try {
      // API endpoint for password reset would go here
      // await post('/api/v1/auth/password-reset/', data);
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1500);
    } catch (err: any) {
      setError('An error occurred. Please try again later.');
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
              <h2 className="fw-bold text-primary">Forgot Password</h2>
              <p className="text-muted">Enter your email to receive a reset link</p>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
              <Alert variant="success">
                If an account exists for that email, a password reset link has been sent.
              </Alert>
            )}

            {!success && (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-4" controlId="email">
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

                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Send Reset Link'}
                </Button>
                
                <div className="text-center text-muted small">
                  Remembered your password? <Link href="/login" className="text-decoration-none fw-bold">Sign In</Link>
                </div>
              </Form>
            )}
            
            {success && (
               <div className="text-center mt-3">
                  <Link href="/login">
                    <Button variant="outline-primary" className="rounded-pill px-4">Back to Login</Button>
                  </Link>
               </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}
