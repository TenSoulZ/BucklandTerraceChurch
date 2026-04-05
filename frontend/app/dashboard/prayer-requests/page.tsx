'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Spinner, Badge } from 'react-bootstrap';
import { get } from '@/lib/api';
import { FaMagnifyingGlass, FaEllipsisVertical } from 'react-icons/fa6';

export default function PrayerRequestsManagement() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data: any = await get('/api/v1/prayer/requests/');
      const results = Array.isArray(data) ? data : data?.results || [];
      setRequests(results);
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(req => 
    `${req.title} ${req.requester_name} ${req.content}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Prayer Requests</h2>
          <p className="text-muted small mb-0">Review and manage community prayer needs</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Body className="p-0">
          <div className="p-4 bg-white border-bottom">
            <InputGroup style={{ maxWidth: '400px' }}>
              <InputGroup.Text className="bg-light border-0">
                <FaMagnifyingGlass className="text-muted" />
              </InputGroup.Text>
              <Form.Control 
                placeholder="Search requests..." 
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
                  <th className="px-4 py-3">Requester</th>
                  <th className="py-3">Request Details</th>
                  <th className="py-3">Privacy</th>
                  <th className="py-3">Status</th>
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
                ) : filteredRequests.length > 0 ? filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-4 py-3">
                      <div className="fw-bold">{req.is_anonymous ? 'Anonymous' : req.requester_name}</div>
                      {!req.is_anonymous && req.requester_email && (
                        <div className="text-muted small">{req.requester_email}</div>
                      )}
                    </td>
                    <td className="py-3" style={{ maxWidth: '300px' }}>
                      <div className="fw-bold mb-1 text-truncate">{req.title}</div>
                      <div className="text-muted small text-truncate">{req.content}</div>
                      <div className="text-muted small mt-1" style={{ fontSize: '0.7rem' }}>
                        Submitted: {new Date(req.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex flex-column gap-1 align-items-start">
                        <Badge bg={req.is_public ? 'info' : 'secondary'} className="fw-normal px-2 py-1">
                          {req.is_public ? 'Public Wall' : 'Private'}
                        </Badge>
                        <Badge bg={req.is_anonymous ? 'dark' : 'light'} text={req.is_anonymous ? 'light' : 'dark'} className="fw-normal px-2 py-1 border">
                          {req.is_anonymous ? 'Anonymous' : 'Named'}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 text-capitalize">
                      <Badge bg={req.status === 'answered' ? 'success' : req.status === 'praying' ? 'primary' : 'warning'} className="fw-normal px-2 py-1">
                        {req.status || 'Pending'}
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
                      No prayer requests found matching your search.
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
