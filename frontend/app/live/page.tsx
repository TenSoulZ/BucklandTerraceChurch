'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FaGlobe, FaMessage, FaHeart, FaShareNodes, FaUsers } from 'react-icons/fa6';
import Link from 'next/link';

export default function LiveService() {
  const [mounted, setMounted] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Mock live status check
    setIsLive(true);
    setViewerCount(Math.floor(Math.random() * 50) + 120);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Navigation />
      <div className="bg-dark text-white py-4 min-vh-100">
        <Container fluid="lg">
          <Row className="gy-4">
            {/* Main Content: Video Player */}
            <Col lg={8} xl={9}>
              <div className="mb-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="danger" className="px-3 py-2 animate-pulse d-flex align-items-center gap-1">
                    <span className="rounded-circle bg-white" style={{ width: '8px', height: '8px' }}></span>
                    LIVE
                  </Badge>
                  <h4 className="mb-0 fw-bold d-none d-sm-block">Sunday Morning Service</h4>
                </div>
                <div className="text-secondary small d-flex align-items-center gap-3">
                  <span className="d-flex align-items-center gap-1">
                    <FaUsers /> {viewerCount} viewing
                  </span>
                </div>
              </div>

              {/* Video Player Placeholder */}
              <div className="bg-black rounded-4 shadow-lg overflow-hidden position-relative mb-4" style={{ aspectRatio: '16/9' }}>
                <iframe 
                  src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID" 
                  title="Live Stream"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                ></iframe>
              </div>

              <div className="bg-dark p-3 rounded-4 border border-secondary border-opacity-25">
                <h2 className="fw-bold mb-3">Growing Together in Grace</h2>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Button variant="outline-light" className="rounded-pill d-flex align-items-center gap-2">
                    <FaHeart /> 245
                  </Button>
                  <Button variant="outline-light" className="rounded-pill d-flex align-items-center gap-2">
                    <FaShareNodes /> Share
                  </Button>
                </div>
                <p className="text-secondary">
                  Welcome to our online service! We are so glad you are joining us from wherever you are in the world. 
                  Today's message focuses on the power of community and faith in distant times.
                </p>
              </div>
            </Col>

            {/* Sidebar: Interaction */}
            <Col lg={4} xl={3}>
              <Card className="bg-dark border-secondary border-opacity-25 h-100 rounded-4 overflow-hidden shadow-lg" style={{ maxHeight: '80vh' }}>
                <Card.Header className="bg-dark border-secondary border-opacity-25 py-3 text-center">
                  <h5 className="mb-0 fw-bold d-flex align-items-center justify-content-center gap-2">
                    <FaMessage className="text-primary" /> Live Community
                  </h5>
                </Card.Header>
                <Card.Body className="p-0 d-flex flex-column">
                  <div className="flex-grow-1 p-3 overflow-auto" style={{ height: '400px' }}>
                    {/* Mock Chat Messages */}
                    <div className="mb-3">
                      <div className="small fw-bold text-primary">Pastor Erismus</div>
                      <div className="small opacity-75">Welcome everyone! Glad to see you all here.</div>
                    </div>
                    <div className="mb-3">
                      <div className="small fw-bold text-info">Sister Sarah</div>
                      <div className="small opacity-75">Good morning from Bulawayo! Blessed to be part of this.</div>
                    </div>
                    <div className="mb-3">
                      <div className="small fw-bold text-success">Brother John</div>
                      <div className="small opacity-75">Amen! Watching from Harare.</div>
                    </div>
                    <div className="mb-3">
                      <div className="small fw-bold text-warning">Grace M.</div>
                      <div className="small opacity-75">Greetings church family!</div>
                    </div>
                  </div>
                  
                  <div className="p-3 border-top border-secondary border-opacity-25 bg-black bg-opacity-25">
                    <div className="d-grid gap-2">
                      <Button variant="primary" className="fw-bold rounded-pill">
                        Sign in to Chat
                      </Button>
                      <Link href="/prayer" className="text-decoration-none">
                        <Button variant="outline-danger" className="w-100 rounded-pill fw-bold">
                          Submit Prayer Request
                        </Button>
                      </Link>
                      <Link href="/giving" className="text-decoration-none">
                        <Button variant="outline-success" className="w-100 rounded-pill fw-bold">
                          Give Online
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <div className="mt-4 p-4 bg-primary bg-opacity-10 rounded-4 border border-primary border-opacity-25">
                <h6 className="fw-bold text-primary mb-2">New here?</h6>
                <p className="small text-secondary mb-3">We'd love to get to know you! Fill out our online connection card.</p>
                <Link href="/contact" className="btn btn-sm btn-primary w-100 rounded-pill fw-bold">I'm New</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />

      <style jsx global>{`
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .7; }
        }
      `}</style>
    </>
  );
}
