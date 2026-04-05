'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Spinner, Badge } from 'react-bootstrap';
import { get } from '@/lib/api';
import { FaMagnifyingGlass, FaMicrophone, FaEllipsisVertical } from 'react-icons/fa6';

export default function SermonsManagement() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSermons = async () => {
    setLoading(true);
    try {
      const data: any = await get('/api/v1/sermons/');
      const results = Array.isArray(data) ? data : data?.results || [];
      setSermons(results);
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const filteredSermons = sermons.filter(sermon => 
    `${sermon.title} ${sermon.preacher}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Sermon Management</h2>
          <p className="text-muted small mb-0">Manage your sermon archive and media</p>
        </div>
        <Button variant="primary" className="shadow-sm d-flex align-items-center gap-2">
          <FaMicrophone /> Upload Sermon
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
                placeholder="Search sermons..." 
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
                  <th className="px-4 py-3">Sermon Title</th>
                  <th className="py-3">Preacher</th>
                  <th className="py-3">Date</th>
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
                ) : filteredSermons.length > 0 ? filteredSermons.map((sermon) => (
                  <tr key={sermon.id}>
                    <td className="px-4 py-3">
                      <div className="fw-bold">{sermon.title}</div>
                      <div className="text-muted small">{sermon.series_details?.title || 'No Series'}</div>
                    </td>
                    <td className="py-3">{sermon.preacher}</td>
                    <td className="py-3">{new Date(sermon.date_preached).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Badge bg={sermon.is_published ? 'success' : 'warning'} className="fw-normal px-2 py-1">
                        {sermon.is_published ? 'Published' : 'Draft'}
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
                      No sermons found matching your search.
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
