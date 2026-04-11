'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Container, Row, Col, Badge, Spinner, Button, Card, Alert, Form } from 'react-bootstrap';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { get, post } from '@/lib/api';
import { imageKitLoader } from '@/lib/imagekit-loader';
import { useAuthStore } from '@/store/auth';
import { FaCalendarDays, FaClock, FaLocationDot, FaArrowLeft, FaCircleCheck, FaUserGroup } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';

export default function EventDetails() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuthStore();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // RSVP Form State
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get(`/api/v1/events/${slug}/`);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchEvent();
    }
  }, [slug, fetchEvent]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpLoading(true);
    setRsvpError('');
    try {
      const payload: any = {
        event: event.id,
        guests_count: guestsCount,
      };

      if (user) {
        payload.user = user.id;
      } else {
        payload.guest_name = guestName;
        payload.guest_email = guestEmail;
      }

      await post('/api/v1/events/rsvps/', payload);
      setRsvpSuccess(true);
      fetchEvent(); // Refresh to update counts
    } catch (error: any) {
      console.error('RSVP Error:', error);
      setRsvpError('Failed to submit RSVP. You might have already RSVP\'d for this event.');
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <Spinner animation="border" variant="primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navigation />
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
          <h2 className="mb-4">Event not found</h2>
          <Link href="/events">
            <Button variant="primary" className="rounded-pill px-4">Back to Events</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="bg-light py-5 min-vh-100">
        <Container>
          <Link href="/events" className="text-decoration-none text-muted mb-4 d-inline-flex align-items-center hover-primary">
            <FaArrowLeft className="me-2" /> Back to Calendar
          </Link>

          <Row className="gy-5 mt-2">
            <Col lg={8}>
              <div className="bg-white rounded-4 shadow-sm overflow-hidden mb-5">
                {event.image_url && (
                  <div className="position-relative w-100" style={{ height: '400px' }}>
                    <Image 
                      loader={imageKitLoader}
                      src={event.image_url} 
                      alt={event.title} 
                      fill
                      className="object-fit-cover"
                    />
                  </div>
                )}
                
                <div className="p-4 p-md-5">
                  <div className="mb-4">
                    <Badge 
                      style={{ backgroundColor: event.category_details?.color || '#0d6efd' }} 
                      className="px-3 py-2 fs-6 fw-normal"
                    >
                      {event.category_details?.name || 'General'}
                    </Badge>
                  </div>

                  <h1 className="display-5 fw-bold mb-4">{event.title}</h1>
                  
                  <div className="fs-5 text-muted lh-base mb-5" style={{ whiteSpace: 'pre-wrap' }}>
                    {event.description}
                  </div>

                  {/* Desktop RSVP - redundant if also in sidebar but good for flow */}
                  <div className="d-lg-none mt-5">
                    {/* RSVP section will show here on mobile */}
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="sticky-top" style={{ top: '100px' }}>
                <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center text-primary">
                    <FaClock className="me-2" /> Event Schedule
                  </h5>
                  
                  <div className="mb-4">
                    <small className="text-uppercase fw-bold text-muted d-block small mb-1">Start Time</small>
                    <div className="d-flex align-items-center">
                      <FaCalendarDays className="text-secondary me-2" />
                      <span className="fw-bold">{moment(event.start_time).format('LLLL')}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <small className="text-uppercase fw-bold text-muted d-block small mb-1">End Time</small>
                    <div className="d-flex align-items-center">
                      <FaCalendarDays className="text-secondary me-2" />
                      <span className="fw-bold">{moment(event.end_time).format('LLLL')}</span>
                    </div>
                  </div>

                  <hr className="my-4 opacity-10" />

                  <h5 className="fw-bold mb-3 d-flex align-items-center text-danger">
                    <FaLocationDot className="me-2" /> Location
                  </h5>
                  <div className="fw-bold fs-5 mb-1">{event.location_name}</div>
                  <div className="text-muted small mb-4">{event.location_address}</div>
                  
                  <div className="p-3 bg-light rounded-3 d-flex align-items-center text-primary fw-bold">
                    <FaUserGroup className="me-2" />
                    {event.rsvps_count || 0} People attending
                  </div>
                </Card>

                {/* RSVP Section */}
                {new Date(event.start_time) > new Date() ? (
                  <Card className="border-primary border-2 shadow-lg rounded-4 p-4 bg-primary bg-opacity-10">
                    <h4 className="fw-bold mb-3">RSVP Now</h4>
                    <p className="text-muted small mb-4">Let us know you're coming so we can prepare for you!</p>
                    
                    {rsvpSuccess ? (
                      <Alert variant="success" className="d-flex align-items-center mb-0">
                        <FaCircleCheck className="me-2 fs-4" />
                        <div>
                          <strong>Confirmed!</strong> See you at the event.
                        </div>
                      </Alert>
                    ) : (
                      <Form onSubmit={handleRSVP}>
                        {rsvpError && <Alert variant="danger" className="small">{rsvpError}</Alert>}
                        {!user && (
                          <>
                            <Form.Group className="mb-3">
                              <Form.Label className="small fw-bold">Your Name</Form.Label>
                              <Form.Control 
                                type="text" 
                                required 
                                size="sm"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label className="small fw-bold">Your Email</Form.Label>
                              <Form.Control 
                                type="email" 
                                required 
                                size="sm"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                              />
                            </Form.Group>
                          </>
                        )}
                        <Form.Group className="mb-4">
                          <Form.Label className="small fw-bold">Number of Guests</Form.Label>
                          <Form.Control 
                            type="number" 
                            min="1" 
                            required 
                            size="sm"
                            value={guestsCount}
                            onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                          />
                        </Form.Group>
                        <Button 
                          variant="primary" 
                          type="submit" 
                          className="w-100 py-2 fw-bold shadow-sm"
                          disabled={rsvpLoading}
                        >
                          {rsvpLoading ? <Spinner animation="border" size="sm" /> : 'Confirm Attendance'}
                        </Button>
                      </Form>
                    )}
                  </Card>
                ) : (
                  <Alert variant="secondary" className="text-center fw-bold rounded-4 border-0">
                    This event has already passed.
                  </Alert>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
      
      <style jsx>{`
        .hover-primary:hover { color: var(--bs-primary) !important; }
      `}</style>
    </>
  );
}
