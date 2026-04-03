'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab, Spinner, Modal, Button, Form, Alert, Badge, Card } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { get, post } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { FaCalendarXmark, FaLocationDot, FaClock, FaCircleCheck, FaUserGroup } from 'react-icons/fa6';

const localizer = momentLocalizer(moment);

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<any>('month');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // RSVP Form State
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  
  const { user } = useAuthStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsData, categoriesData] = await Promise.all([
        get('/api/v1/events/?ordering=start_time'),
        get('/api/v1/events/categories/'),
      ]) as [any, any];
      
      const eventResults = Array.isArray(eventsData) ? eventsData : eventsData?.results || [];
      const categoryResults = Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || [];
      
      setEvents(eventResults);
      setCategories(categoryResults);
      formatCalendarEvents(eventResults);
    } catch (error) {
      console.error('Error fetching events data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCalendarEvents = (results: any[]) => {
    const formatted = results.map((evt: any) => ({
      id: evt.id,
      title: evt.title,
      start: new Date(evt.start_time),
      end: new Date(evt.end_time || evt.start_time),
      resource: evt,
    }));
    setCalendarEvents(formatted);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
    setRsvpSuccess(false);
    setRsvpError('');
    setShowModal(true);
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setRsvpLoading(true);
    setRsvpError('');
    try {
      const payload: any = {
        event: selectedEvent.id,
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
      fetchData(); // Refresh to update RSVP counts if shown
    } catch (error: any) {
      console.error('RSVP Error:', error);
      setRsvpError('Failed to submit RSVP. You might have already RSVP\'d for this event.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const filteredEvents = selectedCategory 
    ? events.filter(e => e.category === selectedCategory)
    : events;

  const eventStyleGetter = (event: any) => {
    const color = event.resource.category_details?.color || '#0d6efd';
    return {
      style: {
        backgroundColor: color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  return (
    <>
      <Navigation />
      <div className="bg-light py-5 min-vh-100">
        <Container>
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary display-4">Upcoming Events</h1>
            <p className="lead text-muted max-w-2xl mx-auto">
              Join us for fellowship, worship, and serving our community.
            </p>
          </div>

          {/* Category Filters */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            <Button 
              variant={selectedCategory === null ? "primary" : "outline-primary"}
              className="rounded-pill px-4"
              onClick={() => setSelectedCategory(null)}
            >
              All Events
            </Button>
            {categories.map(cat => (
              <Button 
                key={cat.id}
                variant={selectedCategory === cat.id ? "dark" : "outline-dark"}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : { color: cat.color, borderColor: cat.color }}
                className="rounded-pill px-4"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <Tabs defaultActiveKey="list" id="events-tabs" className="mb-4 justify-content-center border-0">
            <Tab eventKey="list" title="List View" tabClassName="fw-bold px-4">
              {loading ? (
                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
              ) : filteredEvents.length > 0 ? (
                <Row className="gy-4 mt-2 mb-5">
                  {filteredEvents.map((event) => (
                    <Col md={6} lg={4} key={event.id}>
                      <EventCard event={event} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center text-muted py-5">
                  <FaCalendarXmark size={48} className="mb-3 d-block mx-auto opacity-50" />
                  <h5>No events found</h5>
                  <p>Try adjusting your filters or check back later.</p>
                </div>
              )}
            </Tab>
            <Tab eventKey="calendar" title="Calendar View" tabClassName="fw-bold px-4">
              <div className="bg-white p-4 rounded shadow-sm mt-3" style={{ height: '700px' }}>
                {loading ? (
                  <div className="h-100 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents.filter(ce => !selectedCategory || ce.resource.category === selectedCategory)}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    views={['month', 'week', 'day', 'agenda']}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                    date={calendarDate}
                    onNavigate={(newDate) => setCalendarDate(newDate)}
                    view={calendarView}
                    onView={(newView) => setCalendarView(newView)}
                  />
                )}
              </div>
            </Tab>
          </Tabs>

        </Container>
      </div>

      {/* Event Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        {selectedEvent && (
          <>
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="fw-bold fs-2">{selectedEvent.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2">
              <div className="mb-3">
                <Badge 
                  style={{ backgroundColor: selectedEvent.category_details?.color || '#0d6efd' }} 
                  className="px-3 py-2 fs-6"
                >
                  {selectedEvent.category_details?.name || 'General'}
                </Badge>
              </div>
              
              <Row className="gy-4 mb-4">
                <Col md={7}>
                  {selectedEvent.image_url && (
                    <img 
                      src={selectedEvent.image_url} 
                      alt={selectedEvent.title} 
                      className="img-fluid rounded shadow-sm mb-3 w-100" 
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                  )}
                  <p className="text-muted fs-5 lh-base" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedEvent.description}
                  </p>
                </Col>
                <Col md={5}>
                  <Card className="bg-light border-0 p-3 h-100">
                    <h5 className="fw-bold mb-3 d-flex align-items-center">
                      <FaClock className="text-primary me-2" /> When & Where
                    </h5>
                    <div className="mb-3">
                      <small className="text-uppercase fw-bold text-muted d-block small">Start Time</small>
                      <span>{moment(selectedEvent.start_time).format('LLLL')}</span>
                    </div>
                    <div className="mb-3">
                      <small className="text-uppercase fw-bold text-muted d-block small">End Time</small>
                      <span>{moment(selectedEvent.end_time).format('LLLL')}</span>
                    </div>
                    <div className="mb-3">
                      <small className="text-uppercase fw-bold text-muted d-block small">Location</small>
                      <div className="d-flex align-items-start">
                        <FaLocationDot className="text-danger mt-1 me-2" />
                        <div>
                          <strong>{selectedEvent.location_name}</strong>
                          <div className="small text-muted">{selectedEvent.location_address}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-3 border-top">
                      <div className="d-flex align-items-center text-primary fw-bold">
                        <FaUserGroup className="me-2" />
                        {selectedEvent.rsvps_count || 0} People attending
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* RSVP Form */}
              {new Date(selectedEvent.start_time) > new Date() && (
                <Card className="border-primary bg-primary bg-opacity-10 p-4 border-2">
                  <h4 className="fw-bold mb-3">Reserve Your Spot</h4>
                  {rsvpSuccess ? (
                    <Alert variant="success" className="d-flex align-items-center mb-0">
                      <FaCircleCheck className="me-2 fs-4" />
                      <div>
                        <strong>Success!</strong> Your RSVP has been confirmed. See you there!
                      </div>
                    </Alert>
                  ) : (
                    <Form onSubmit={handleRSVP}>
                      {rsvpError && <Alert variant="danger">{rsvpError}</Alert>}
                      {!user && (
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="small fw-bold">Name</Form.Label>
                              <Form.Control 
                                type="text" 
                                required 
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="small fw-bold">Email</Form.Label>
                              <Form.Control 
                                type="email" 
                                required 
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}
                      <Row className="align-items-end">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Number of Guests</Form.Label>
                            <Form.Control 
                              type="number" 
                              min="1" 
                              required 
                              value={guestsCount}
                              onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 mb-3 py-2 fw-bold"
                            disabled={rsvpLoading}
                          >
                            {rsvpLoading ? <Spinner animation="border" size="sm" /> : 'Confirm RSVP'}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Card>
              )}
            </Modal.Body>
          </>
        )}
      </Modal>

      <Footer />
    </>
  );
}
