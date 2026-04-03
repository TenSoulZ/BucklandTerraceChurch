'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner, Button } from 'react-bootstrap';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SermonCard from '@/components/SermonCard';
import { get } from '@/lib/api';
import { FaMagnifyingGlass, FaInbox } from 'react-icons/fa6';

export default function Sermons() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-date_preached');
  const [nextPage, setNextPage] = useState<string | null>(null);

  const fetchSermons = async (url: string, append = false) => {
    try {
      const data: any = await get(url);
      const results = Array.isArray(data) ? data : data?.results || [];
      if (append) {
        setSermons(prev => [...prev, ...results]);
      } else {
        setSermons(results);
      }
      setNextPage(data?.next || null);
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    // Debounce search slightly
    const timeoutId = setTimeout(() => {
      const url = `/api/v1/sermons/?search=${encodeURIComponent(searchTerm)}&ordering=${ordering}`;
      fetchSermons(url);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, ordering]);

  return (
    <>
      <Navigation />
      <div className="bg-light py-5 min-vh-100">
        <Container>
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary display-4">Sermon Library</h1>
            <p className="lead text-muted max-w-2xl mx-auto">
              Watch, listen, and grow with our collection of past messages.
            </p>
          </div>

          <Row className="justify-content-center mb-5">
            <Col md={8} lg={6}>
              <InputGroup className="shadow-sm">
                <Form.Control
                  placeholder="Search by title, preacher, or topic..."
                  aria-label="Search sermons"
                  className="border-0 py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputGroup.Text className="bg-white border-0 text-primary">
                  {loading ? <Spinner animation="border" size="sm" /> : <FaMagnifyingGlass />}
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h4 className="fw-bold mb-0">All Sermons</h4>
            <Form.Select 
              className="w-auto shadow-sm border-0"
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
            >
              <option value="-date_preached">Newest First</option>
              <option value="date_preached">Oldest First</option>
            </Form.Select>
          </div>

          <Row className="gy-4 mb-5">
            {sermons.length > 0 ? (
              sermons.map((sermon) => (
                <Col sm={6} lg={4} key={sermon.id}>
                  <SermonCard sermon={sermon} />
                </Col>
              ))
            ) : (
              !loading && (
                <div className="text-center text-muted py-5">
                  <FaInbox size={48} className="mb-3 d-block mx-auto opacity-50" />
                  <h5>No sermons found</h5>
                  <p>Try adjusting your search criteria.</p>
                </div>
              )
            )}
          </Row>
          
          {nextPage && (
            <div className="d-flex justify-content-center mt-5">
               <Button 
                  variant="outline-primary" 
                  className="px-4 py-2 fw-bold"
                  onClick={() => fetchSermons(nextPage, true)}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
            </div>
          )}

        </Container>
      </div>
      <Footer />
    </>
  );
}
