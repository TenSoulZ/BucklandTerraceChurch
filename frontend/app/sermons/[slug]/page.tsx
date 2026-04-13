'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Container, Row, Col, Badge, Spinner, Button, Card, Form } from 'react-bootstrap';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { get } from '@/lib/api';
import { FaCalendarDays, FaMicrophone, FaTag, FaArrowLeft, FaShare, FaMessage } from 'react-icons/fa6';
import Link from 'next/link';

export default function SermonDetails() {
  const params = useParams();
  const slug = params.slug as string;
  const [sermon, setSermon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSermon = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get(`/api/v1/sermons/${slug}/`);
      setSermon(data);
    } catch (error) {
      console.error('Error fetching sermon details:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchSermon();
    }
  }, [slug, fetchSermon]);

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

  if (!sermon) {
    return (
      <>
        <Navigation />
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
          <h2 className="mb-4">Sermon not found</h2>
          <Link href="/sermons">
            <Button variant="primary" className="rounded-pill px-4">Back to Sermons</Button>
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
          <Link href="/sermons" className="text-decoration-none text-muted mb-4 d-inline-flex align-items-center hover-primary">
            <FaArrowLeft className="me-2" /> Back to Library
          </Link>

          <Row className="gy-5 mt-2">
            <Col lg={8}>
              {/* Media Player Placeholder / Video Embed */}
              <div className="bg-dark rounded-4 shadow-lg overflow-hidden mb-4 position-relative" style={{ aspectRatio: '16/9' }}>
                {sermon.video_url ? (
                  <iframe 
                    src={sermon.video_url.replace('watch?v=', 'embed/')}
                    title={sermon.title}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white p-5 text-center">
                    <FaMicrophone size={64} className="mb-4 opacity-25" />
                    <h3 className="fw-bold">Media Content Not Available</h3>
                    <p className="opacity-50">This sermon may only be available for in-person viewing or the media hasn't been uploaded yet.</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm">
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {sermon.tags_details?.map((tag: any) => (
                    <Badge key={tag.id} bg="light" text="dark" className="border px-3 py-2 fw-normal">
                      <FaTag className="me-2 opacity-50" size={12} />
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <h1 className="display-5 fw-bold mb-4">{sermon.title}</h1>
                
                <div className="d-flex flex-wrap align-items-center gap-4 text-muted mb-5 pb-4 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3">
                      <FaMicrophone />
                    </div>
                    <div>
                      <small className="d-block text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Preacher</small>
                      <span className="text-dark fw-bold">{sermon.preacher}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-2 me-3">
                      <FaCalendarDays />
                    </div>
                    <div>
                      <small className="d-block text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Date</small>
                      <span className="text-dark fw-bold">{new Date(sermon.date_preached).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                  </div>
                </div>

                <h5 className="fw-bold mb-3">About this Message</h5>
                <div className="fs-5 text-muted lh-base mb-5" style={{ whiteSpace: 'pre-wrap' }}>
                  {sermon.description}
                </div>

                {sermon.audio_url && (
                  <div className="bg-light p-4 rounded-3 d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center">
                      <div className="bg-dark text-white rounded-circle p-2 me-3">
                        <i className="bi bi-headphones"></i>
                      </div>
                      <span className="fw-bold">Listen to Audio Version</span>
                    </div>
                    <a href={sermon.audio_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-pill px-4">Download MP3</a>
                  </div>
                )}

                {/* Engagement Section */}
                <div className="mt-5 pt-4">
                  <h4 className="fw-bold mb-4 d-flex align-items-center">
                    <FaMessage className="text-primary me-2" /> Discussion & Reflections
                  </h4>
                  <Card className="border-0 bg-light p-4 rounded-4 shadow-sm mb-4">
                    <p className="text-muted small mb-3">Join the conversation about this message. Share what you've learned or how it impacted you.</p>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Control as="textarea" rows={3} placeholder="Write your reflection here..." className="border-0 shadow-sm" />
                      </Form.Group>
                      <div className="d-flex justify-content-end">
                        <Button variant="primary" className="fw-bold rounded-pill px-4">Post Reflection</Button>
                      </div>
                    </Form>
                  </Card>
                  
                  <div className="text-center py-4 border-top border-secondary border-opacity-10 mt-5">
                    <p className="text-muted small">Only registered community members can participate in discussions.</p>
                    <Link href="/login" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">Sign In to Engage</Link>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="sticky-top" style={{ top: '100px' }}>
                {sermon.series_details && (
                  <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                    <div className="bg-primary p-3 text-white fw-bold small text-uppercase letter-spacing-1 text-center">
                      Sermon Series
                    </div>
                    <Card.Body className="p-4 text-center">
                      <h4 className="fw-bold mb-3">{sermon.series_details.title}</h4>
                      <p className="text-muted small mb-4">{sermon.series_details.description}</p>
                      <Link href={`/sermons?series=${sermon.series_details.id}`}>
                        <Button variant="outline-primary" className="w-100 rounded-pill fw-bold">View Series</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                )}

                <Card className="border-0 shadow-sm rounded-4 text-center p-4">
                  <h5 className="fw-bold mb-3">Share this Sermon</h5>
                  <p className="text-muted small mb-4">Help spread the word by sharing this message with your friends and family.</p>
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="outline-dark" className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <i className="bi bi-facebook fs-5"></i>
                    </Button>
                    <Button variant="outline-dark" className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <i className="bi bi-twitter-x fs-5"></i>
                    </Button>
                    <Button variant="outline-dark" className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <FaShare fs-5 />
                    </Button>
                  </div>
                </Card>

                <div className="mt-5 p-4 bg-primary bg-opacity-10 rounded-4 text-center">
                  <h5 className="fw-bold text-primary mb-3">Join us this Sunday</h5>
                  <p className="small text-muted mb-4">Experience the power of God's Word in person at our Harare campus.</p>
                  <Link href="/contact" className="btn btn-primary w-100 rounded-pill fw-bold">Plan Your Visit</Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
      
      <style jsx>{`
        .letter-spacing-1 { letter-spacing: 1px; }
        .hover-primary:hover { color: var(--bs-primary) !important; }
      `}</style>
    </>
  );
}
