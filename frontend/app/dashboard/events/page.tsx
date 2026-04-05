'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Spinner, Badge } from 'react-bootstrap';
import { get } from '@/lib/api';
import { FaMagnifyingGlass, FaCalendarPlus, FaEllipsisVertical } from 'react-icons/fa6';

export default function EventsManagement() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data: any = await get('/api/v1/events/');
      const results = Array.isArray(data) ? data : data?.results || [];
      setEvents(results);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    `${event.title} ${event.location_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Event Management</h2>
          <p className="text-muted small mb-0">Manage the church calendar and RSVPs</p>
        </div>
        <Button variant="primary" className="shadow-sm d-flex align-items-center gap-2">
          <FaCalendarPlus /> Schedule Event
        </Button>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Body className="p-0">
          <div className="p-4 bg-white border-bottom">
            <InputGroup style={{ maxWidth: '400px' }}>
              <InputGroup.Text className="bg-light border-0">
                <FaMagnifyingGlass className="text-muted" />
              </InputGroup.Text>
              <Form.Control 
                placeholder="Search events..." 
                className="bg-light border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>

          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-muted small text-uppercase letter-spacing-1">
                <tr>
                  <th className="px-4 py-3">Event Title</th>
                  <th className="py-3">Date & Time</th>
                  <th className="py-3">Location</th>
                  <th className="py-3 text-center">RSVPs</th>
                  <th className="py-3 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : filteredEvents.length > 0 ? filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-4 py-3">
                      <div className="fw-bold">{event.title}</div>
                      <div className="text-muted small">{event.category_details?.name || 'General'}</div>
                    </td>
                    <td className="py-3">
                      <div>{new Date(event.start_time).toLocaleDateString()}</div>
                      <div className="text-muted small">{new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="py-3">{event.location_name}</td>
                    <td className="py-3 text-center">
                      <Badge bg="info" className="fw-normal px-2 py-1">
                        {event.rsvps_count || 0}
                      </Badge>
                    </td>
                    <td className="py-3 text-end px-4">
                      <Button variant="link" className="text-muted p-0">
                        <FaEllipsisVertical />
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      No events found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <style jsx global>{`
        .letter-spacing-1 { letter-spacing: 1px; }
      `}</style>
    </>
  );
}
