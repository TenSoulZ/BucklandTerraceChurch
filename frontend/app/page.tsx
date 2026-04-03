'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col, Button, ProgressBar, Badge, Spinner } from 'react-bootstrap';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SermonCard from '@/components/SermonCard';
import EventCard from '@/components/EventCard';
import { get } from '@/lib/api';
import { FaLocationDot, FaClock, FaGlobe, FaArrowRight } from 'react-icons/fa6';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sermons, setSermons] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [sermonsData, eventsData, campaignsData] = await Promise.all([
          get('/api/v1/sermons/'),
          get('/api/v1/events/'),
          get('/api/v1/giving/campaigns/')
        ]);
        
        const extractData = (data: any) => Array.isArray(data) ? data : data?.results || [];
        setSermons(extractData(sermonsData).slice(0, 3));
        setEvents(extractData(eventsData).slice(0, 3));
        const activeCampaign = extractData(campaignsData).find((c: any) => c.is_active);
        setCampaign(activeCampaign || null);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <section className="position-relative d-flex align-items-center justify-content-center overflow-hidden" style={{ minHeight: '90vh' }}>
        <Image 
          src="/prayergroup.webp"
          alt="Prayer Group"
          fill
          priority
          className="object-fit-cover"
          style={{ zIndex: -2 }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)', zIndex: -1 }}></div>
        <Container className="position-relative z-1 text-center py-5">
          <div className="mx-auto mb-4" style={{ maxWidth: '800px' }}>
            <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill fw-bold letter-spacing-1 animate-fadeIn">WELCOME TO BUCKLAND TERRACE</Badge>
            <h1 className="display-1 fw-bold text-white mb-4 animate-slideUp text-shadow">Growing Together in <span className="text-primary text-gradient">Grace</span></h1>
            <p className="lead text-white mb-5 fs-4 animate-slideUp-delay text-shadow">
              Experience the life-transforming power of God's Word. Join our vibrant community in-person or online from anywhere in the world.
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-3 animate-slideUp-delay-2">
              <Link href="/about">
                <Button variant="primary" size="lg" className="fw-bold px-5 py-3 shadow-lg rounded-pill">
                  Join Us In Person
                </Button>
              </Link>
              <Button variant="outline-light" size="lg" className="fw-bold px-5 py-3 rounded-pill backdrop-blur d-flex align-items-center">
                <FaGlobe className="me-2" /> Join Online Church
              </Button>
            </div>
          </div>

          {/* Sunday Live Indicator - More subtle */}
          <div className="mt-5 pt-4">
            <div className="d-inline-flex align-items-center bg-white bg-opacity-10 border border-white border-opacity-20 rounded-pill px-4 py-2 text-white">
              <span className="position-relative d-flex h-3 w-3 me-2">
                <span className="animate-ping position-absolute inline-flex h-100 w-100 rounded-full bg-danger opacity-75"></span>
                <span className="position-relative inline-flex rounded-full h-3 w-3 bg-danger" style={{ width: '10px', height: '10px' }}></span>
              </span>
              <span className="fw-bold me-2 small uppercase letter-spacing-1">Next Service:</span>
              <span className="small">Sunday @ 10:00 AM (GMT+2)</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Simplified Welcome Section */}
      <section className="py-5 bg-white">
        <Container className="py-5">
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="display-5 fw-bold text-dark mb-4">A Place to Belong</h2>
              <p className="fs-4 text-muted mb-5 lh-base">
                Whether you're exploring faith for the first time or looking for a church family, you have a place here. We are a diverse community dedicated to serving Harare and beyond with the love of Christ.
              </p>
              <Link href="/contact" className="text-primary fw-bold text-decoration-none fs-5 hover-underline">
                Plan your visit today <FaArrowRight className="ms-2" />
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Focused Content Sections */}
      <div className="bg-light">
        {/* Latest Messages */}
        <section className="py-5">
          <Container>
            <div className="d-flex justify-content-between align-items-end mb-5 border-start border-primary border-4 ps-4">
              <div>
                <h6 className="text-primary fw-bold text-uppercase mb-1 small letter-spacing-1">Media</h6>
                <h2 className="fw-bold text-dark mb-0">Latest Messages</h2>
              </div>
              <Link href="/sermons" className="btn btn-link text-primary text-decoration-none fw-bold p-0">View All &rarr;</Link>
            </div>
            {loading ? (
              <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
            ) : (
              <Row className="gy-4">
                {sermons.map((sermon) => (
                  <Col md={4} key={sermon.id}>
                    <SermonCard sermon={sermon} />
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </section>

        {/* Upcoming Events */}
        <section className="py-5 bg-white rounded-top-5 shadow-sm mt-5">
          <Container>
            <div className="d-flex justify-content-between align-items-end mb-5 border-start border-danger border-4 ps-4">
              <div>
                <h6 className="text-danger fw-bold text-uppercase mb-1 small letter-spacing-1">Fellowship</h6>
                <h2 className="fw-bold text-dark mb-0">Upcoming Events</h2>
              </div>
              <Link href="/events" className="btn btn-link text-danger text-decoration-none fw-bold p-0">Full Calendar &rarr;</Link>
            </div>
            {loading ? (
              <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
            ) : (
              <Row className="gy-4">
                {events.map((event) => (
                  <Col md={4} key={event.id}>
                    <EventCard event={event} />
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </section>

        {/* Giving Campaign - Clean & Modern */}
        {campaign && (
          <section className="py-5 gradient-brand text-white">
            <Container className="py-5 text-center">
              <Col lg={8} className="mx-auto">
                <Badge bg="light" className="text-primary mb-3 px-3 py-2 fw-bold">ACTIVE CAMPAIGN</Badge>
                <h2 className="display-5 fw-bold mb-4">{campaign.name}</h2>
                <p className="lead mb-5 text-white-50">{campaign.description}</p>
                
                <div className="bg-white rounded-4 p-4 shadow-lg mb-5 mx-auto" style={{ maxWidth: '600px' }}>
                  <div className="d-flex justify-content-between text-dark mb-3 fw-bold">
                    <span>&pound;{Number(campaign.current_amount).toLocaleString()} Raised</span>
                    <span className="text-primary">Goal: &pound;{Number(campaign.goal_amount).toLocaleString()}</span>
                  </div>
                  <ProgressBar 
                    variant="primary" 
                    now={Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100)} 
                    style={{ height: '12px' }} 
                    className="mb-0 rounded-pill" 
                  />
                </div>
                
                <Link href="/giving">
                  <Button variant="light" size="lg" className="fw-bold px-5 py-3 rounded-pill text-primary">Support Mission</Button>
                </Link>
              </Col>
            </Container>
          </section>
        )}

        {/* Visit Information */}
        <section className="py-5 bg-white">
          <Container className="py-5">
            <Row className="gy-5 align-items-center">
              <Col lg={5}>
                <h2 className="display-6 fw-bold mb-4">Visit Us This Sunday</h2>
                <p className="lead text-muted mb-5">We would love to welcome you in person. Our doors are open to everyone.</p>
                
                <div className="d-flex mb-4">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                    <FaClock size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Service Times</h5>
                    <p className="text-muted mb-0">Sundays @ 10:00 AM & 6:00 PM</p>
                  </div>
                </div>
                
                <div className="d-flex mb-5">
                  <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                    <FaLocationDot size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Our Location</h5>
                    <p className="text-muted mb-0">Stand 15493 Figtree Rd, Grace Park, Harare</p>
                  </div>
                </div>
                
                <Link href="/contact">
                  <Button variant="outline-dark" size="lg" className="fw-bold px-5 py-3 rounded-pill">Contact Us</Button>
                </Link>
              </Col>
              <Col lg={7}>
                <div className="rounded-5 shadow-lg overflow-hidden border border-light border-5" style={{ height: '450px' }}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121481.56475510619!2d30.957597143493777!3d-17.824794240788647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a4e1e6955555%3A0x8085d7b5f65a123!2sHarare%2C%20Zimbabwe!5e0!3m2!1sen!2sus!4v1714000000000!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy"
                  ></iframe>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      <Footer />
      
      {/* Local Styles for Home Page */}
      <style jsx global>{`
        .letter-spacing-1 { letter-spacing: 1px; }
        .text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        .text-gradient {
          background: linear-gradient(45deg, #0d6efd, #0dcaf0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .backdrop-blur {
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.1);
        }
        .rounded-top-5 { border-top-left-radius: 3rem; border-top-right-radius: 3rem; }
        .rounded-5 { border-radius: 3rem; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out; }
        .animate-slideUp-delay { animation: slideUp 0.8s ease-out 0.2s both; }
        .animate-slideUp-delay-2 { animation: slideUp 0.8s ease-out 0.4s both; }
      `}</style>
    </>
  );
}
