'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { post } from '@/lib/api';
import { FaLocationDot, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa6';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      await post('/api/v1/communications/contact/', data);
      setSuccess(true);
      reset();
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="bg-light py-5 min-vh-100">
        <Container>
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">Contact Us</h1>
            <p className="lead text-muted max-w-2xl mx-auto">
              Have questions or want to learn more about our church? We'd love to hear from you.
            </p>
          </div>

          <Row className="gy-5">
            {/* Contact Information */}
            <Col lg={4}>
              <div className="d-flex flex-column gap-4">
                <Card className="border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-start">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                      <FaLocationDot size={24} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Our Location</h5>
                      <p className="text-muted mb-0">
                        Stand Number 15493, Figtree Road<br />
                        Buckland Terraces, Grace Park, Harare
                      </p>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-start">
                    <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 me-3">
                      <FaPhone size={24} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Phone Number</h5>
                      <p className="text-muted mb-0">+263 71 233 2632</p>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-start">
                    <div className="bg-info bg-opacity-10 text-info rounded-circle p-3 me-3">
                      <FaEnvelope size={24} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Email Address</h5>
                      <p className="text-muted mb-0">info@bucklandterracechurch.org</p>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-start">
                    <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3 me-3">
                      <FaClock size={24} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Service Times</h5>
                      <p className="text-muted mb-0">
                        Sunday Morning: 10:00 AM<br />
                        Sunday Evening: 6:00 PM
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>

            {/* Contact Form */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm p-4">
                <Card.Body>
                  <h3 className="fw-bold mb-4">Send us a Message</h3>
                  
                  {success && (
                    <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
                      Your message has been sent successfully! We will get back to you soon.
                    </Alert>
                  )}
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="name">
                          <Form.Label className="small fw-bold">Full Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Your Name" 
                            {...register('name')}
                            isInvalid={!!errors.name}
                          />
                          <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="email">
                          <Form.Label className="small fw-bold">Email Address</Form.Label>
                          <Form.Control 
                            type="email" 
                            placeholder="email@example.com" 
                            {...register('email')}
                            isInvalid={!!errors.email}
                          />
                          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="subject">
                      <Form.Label className="small fw-bold">Subject</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="What is this regarding?" 
                        {...register('subject')}
                        isInvalid={!!errors.subject}
                      />
                      <Form.Control.Feedback type="invalid">{errors.subject?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="message">
                      <Form.Label className="small fw-bold">Message</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={6} 
                        placeholder="Write your message here..." 
                        {...register('message')}
                        isInvalid={!!errors.message}
                      />
                      <Form.Control.Feedback type="invalid">{errors.message?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="px-5 py-3 fw-bold d-flex align-items-center justify-content-center shadow-sm"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Spinner animation="border" size="sm" className="me-2" />
                      ) : (
                        <FaPaperPlane className="me-2" />
                      )}
                      Send Message
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

              {/* Map Section */}
              <div className="mt-5 bg-white rounded shadow-sm overflow-hidden p-2" style={{ height: '400px' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121481.56475510619!2d30.957597143493777!3d-17.824794240788647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a4e1e6955555%3A0x8085d7b5f65a123!2sHarare%2C%20Zimbabwe!5e0!3m2!1sen!2sus!4v1714000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, borderRadius: 'var(--bs-border-radius)' }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}
