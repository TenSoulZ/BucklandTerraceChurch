'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { get, post } from '@/lib/api';
import { FaHandsPraying, FaPaperPlane, FaUserSecret } from 'react-icons/fa6';

const prayerSchema = z.object({
  requester_name: z.string().min(1, 'Name is required'),
  requester_email: z.string().email('Invalid email address'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  is_public: z.boolean(),
  is_anonymous: z.boolean(),
});

type PrayerFormValues = z.infer<typeof prayerSchema>;

export default function PrayerPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PrayerFormValues>({
    resolver: zodResolver(prayerSchema),
    defaultValues: {
      is_public: true,
      is_anonymous: false
    }
  });

  const fetchRequests = async () => {
    try {
      const data: any = await get('/api/v1/prayer/requests/');
      const results = Array.isArray(data) ? data : data?.results || [];
      // Only show public ones
      setRequests(results.filter((r: any) => r.is_public));
    } catch (err) {
      console.error('Error fetching prayer requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onSubmit = async (data: PrayerFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      await post('/api/v1/prayer/requests/', data);
      setSuccess(true);
      reset();
      fetchRequests(); // Refresh list
    } catch (err: any) {
      setError('Failed to submit prayer request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="bg-light py-5 min-vh-100">
        <Container>
          <Row className="gy-5">
            {/* Left Column: Intro and List */}
            <Col lg={7}>
              <div className="mb-5">
                <h1 className="display-4 fw-bold text-primary mb-3">Prayer Requests</h1>
                <p className="lead text-muted">
                  "For where two or three are gathered together in My name, I am there in the midst of them." — Matthew 18:20
                </p>
                <p className="text-muted">
                  Submit your prayer requests and let our community stand with you in faith. You can choose to keep your request private or share it on our Wall of Prayer.
                </p>
              </div>

              <h3 className="fw-bold mb-4 d-flex align-items-center">
                <FaHandsPraying className="text-primary me-2" /> Wall of Prayer
              </h3>

              {loading ? (
                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
              ) : requests.length > 0 ? (
                <div className="d-flex flex-column gap-4">
                  {requests.map((req) => (
                    <Card key={req.id} className="border-0 shadow-sm hover-lift transition-all">
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="fw-bold mb-0 text-dark">{req.title}</h5>
                          <Badge bg="light" className="text-secondary border fw-normal">
                            {new Date(req.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-muted mb-3">{req.content}</p>
                        <div className="d-flex align-items-center small text-secondary">
                          <div className="bg-primary bg-opacity-10 text-primary rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                            {req.is_anonymous ? <FaUserSecret size={12} /> : <i className="bi bi-person-fill"></i>}
                          </div>
                          <span>Praying for <strong>{req.is_anonymous ? 'Anonymous' : req.requester_name}</strong></span>
                          <span className="mx-2">&bull;</span>
                          <span className="text-primary fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>{req.status}</span>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-sm text-center py-5 bg-white bg-opacity-50">
                   <Card.Body>
                      <FaHandsPraying size={48} className="text-muted opacity-25 mb-3" />
                      <p className="text-muted mb-0">No public prayer requests yet. Be the first to share.</p>
                   </Card.Body>
                </Card>
              )}
            </Col>

            {/* Right Column: Submission Form */}
            <Col lg={5}>
              <Card className="border-0 shadow-lg p-3 sticky-top" style={{ top: '100px', borderRadius: 'var(--bs-border-radius)' }}>
                <Card.Body>
                  <h3 className="fw-bold mb-4">Request Prayer</h3>
                  
                  {success && <Alert variant="success" dismissible onClose={() => setSuccess(false)}>Your prayer request has been submitted successfully!</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="requester_name">
                      <Form.Label className="small fw-bold">Your Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter your name" 
                        {...register('requester_name')}
                        isInvalid={!!errors.requester_name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.requester_name?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="requester_email">
                      <Form.Label className="small fw-bold">Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="email@example.com" 
                        {...register('requester_email')}
                        isInvalid={!!errors.requester_email}
                      />
                      <Form.Control.Feedback type="invalid">{errors.requester_email?.message}</Form.Control.Feedback>
                      <Form.Text className="text-muted">Your email will never be shared publicly.</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="title">
                      <Form.Label className="small fw-bold">Subject / Title</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g. Prayer for Healing" 
                        {...register('title')}
                        isInvalid={!!errors.title}
                      />
                      <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="content">
                      <Form.Label className="small fw-bold">How can we pray for you?</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        placeholder="Describe your prayer request..." 
                        {...register('content')}
                        isInvalid={!!errors.content}
                      />
                      <Form.Control.Feedback type="invalid">{errors.content?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <div className="mb-4">
                      <Form.Check 
                        type="switch"
                        id="is_public"
                        label="Share on the Wall of Prayer"
                        className="mb-2"
                        {...register('is_public')}
                      />
                      <Form.Check 
                        type="switch"
                        id="is_anonymous"
                        label="Submit Anonymously"
                        {...register('is_anonymous')}
                      />
                    </div>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center shadow-sm"
                      disabled={submitting}
                    >
                      {submitting ? <Spinner animation="border" size="sm" className="me-2" /> : <FaPaperPlane className="me-2" />}
                      Submit Request
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}
