'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FaGlobe, FaMessage, FaHeart, FaShareNodes, FaUsers } from 'react-icons/fa6';
import Link from 'next/link';

import { get, post } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function LiveService() {
  const [mounted, setMounted] = useState(false);
  const [stream, setStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const { user } = useAuthStore();

  const fetchLiveStream = async () => {
    try {
      const data = await get('/api/v1/live/current/');
      setStream(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setStream(null);
      } else {
        console.error('Error fetching live stream:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchLiveStream();
    
    // Poll for updates every 10 seconds (viewer count & chat)
    const interval = setInterval(fetchLiveStream, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !stream) return;

    setChatLoading(true);
    try {
      await post('/api/v1/live-chat/', {
        stream: stream.id,
        message: chatMessage,
      });
      setChatMessage('');
      await fetchLiveStream(); // Refresh chat immediately
    } catch (error) {
      console.error('Error posting message:', error);
    } finally {
      setChatLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Navigation />
      <div className="bg-dark text-white py-4 min-vh-100">
        <Container fluid="lg">
          <Row className="gy-4">
            {/* Main Content: Video Player */}
            <Col lg={8} xl={9}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                  <Spinner animation="border" variant="light" />
                </div>
              ) : stream ? (
                <>
                  <div className="mb-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg="danger" className="px-3 py-2 animate-pulse d-flex align-items-center gap-1">
                        <span className="rounded-circle bg-white" style={{ width: '8px', height: '8px' }}></span>
                        LIVE
                      </Badge>
                      <h4 className="mb-0 fw-bold d-none d-sm-block">{stream.title}</h4>
                    </div>
                    <div className="text-secondary small d-flex align-items-center gap-3">
                      <span className="d-flex align-items-center gap-1">
                        <FaUsers /> {stream.viewer_count} viewing
                      </span>
                    </div>
                  </div>

                  {/* Video Player Placeholder */}
                  <div className="bg-black rounded-4 shadow-lg overflow-hidden position-relative mb-4" style={{ aspectRatio: '16/9' }}>
                    <iframe 
                      src={`https://www.youtube.com/embed/${stream.youtube_video_id}?autoplay=1&mute=1`} 
                      title="Live Stream"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div className="bg-dark p-3 rounded-4 border border-secondary border-opacity-25">
                    <h2 className="fw-bold mb-3">{stream.title}</h2>
                    <div className="d-flex flex-wrap gap-3 mb-4">
                      <Button variant="outline-light" className="rounded-pill d-flex align-items-center gap-2">
                        <FaHeart /> Like
                      </Button>
                      <Button variant="outline-light" className="rounded-pill d-flex align-items-center gap-2">
                        <FaShareNodes /> Share
                      </Button>
                    </div>
                    <p className="text-secondary" style={{ whiteSpace: 'pre-wrap' }}>
                      {stream.description || "Welcome to our online service! We are so glad you are joining us from wherever you are in the world."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-dark rounded-4 p-5 text-center border border-secondary border-opacity-25 d-flex flex-column align-items-center justify-content-center h-100" style={{ minHeight: '500px' }}>
                   <div className="bg-secondary bg-opacity-25 rounded-circle p-4 mb-4">
                      <FaGlobe size={48} className="opacity-50" />
                   </div>
                   <h2 className="fw-bold mb-3">Service is Currently Offline</h2>
                   <p className="text-secondary mb-4 max-w-2xl mx-auto">
                     Our live broadcast has concluded or hasn't started yet. Join us for our regular services on Sundays at 10:00 AM (GMT+2).
                   </p>
                   <div className="d-flex gap-3">
                     <Link href="/sermons">
                        <Button variant="primary" className="rounded-pill px-4 fw-bold">Watch Past Sermons</Button>
                     </Link>
                     <Link href="/events">
                        <Button variant="outline-light" className="rounded-pill px-4 fw-bold">View Schedule</Button>
                     </Link>
                   </div>
                </div>
              )}
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
                  <div className="flex-grow-1 p-3 overflow-auto d-flex flex-column-reverse" style={{ height: '400px' }}>
                    {/* Chat Messages */}
                    {stream?.chat_messages && stream.chat_messages.length > 0 ? (
                      stream.chat_messages.map((msg: any) => (
                        <div key={msg.id} className="mb-3">
                          <div className="small fw-bold text-primary">{msg.author_name}</div>
                          <div className="small opacity-75 text-break">{msg.message}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-secondary small my-auto opacity-50">
                        No messages yet. Be the first to say hello!
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-top border-secondary border-opacity-25 bg-black bg-opacity-25">
                    {user ? (
                      <form onSubmit={handleChatSubmit} className="d-flex gap-2 mb-3">
                        <input 
                          type="text" 
                          className="form-control form-control-sm bg-dark text-white border-secondary" 
                          placeholder="Say hello..." 
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          disabled={chatLoading || !stream}
                          maxLength={200}
                        />
                        <Button type="submit" variant="primary" size="sm" disabled={chatLoading || !chatMessage.trim() || !stream}>
                          Send
                        </Button>
                      </form>
                    ) : (
                       <Link href="/login" className="d-block mb-3">
                          <Button variant="primary" className="w-100 fw-bold rounded-pill">
                            Sign in to Chat
                          </Button>
                       </Link>
                    )}
                    
                    <div className="d-grid gap-2">
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
