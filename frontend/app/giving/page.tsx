'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Button, Spinner, Table, Tab, Tabs } from 'react-bootstrap';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { get } from '@/lib/api';
import { FaHeartPulse, FaLandmark, FaMobileScreenButton, FaCreditCard, FaHandHoldingHeart } from 'react-icons/fa6';

export default function GivingPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data: any = await get('/api/v1/giving/campaigns/');
        const results = Array.isArray(data) ? data : data?.results || [];
        setCampaigns(results.filter((c: any) => c.is_active));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <>
      <Navigation />
      <div className="bg-light py-5 min-vh-100">
        <Container>
          {/* Hero Section */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">Giving</h1>
            <p className="lead text-muted max-w-2xl mx-auto">
              "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Corinthians 9:7
            </p>
          </div>

          <Row className="gy-5">
            {/* Active Campaigns */}
            <Col lg={8}>
              <h3 className="fw-bold mb-4 d-flex align-items-center">
                <FaHeartPulse className="text-danger me-2" /> Active Campaigns
              </h3>
              
              {loading ? (
                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
              ) : campaigns.length > 0 ? (
                <div className="d-flex flex-column gap-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="border-0 shadow-sm overflow-hidden">
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h4 className="fw-bold mb-1 text-dark">{campaign.name}</h4>
                            <p className="text-muted">{campaign.description}</p>
                          </div>
                          <Badge bg="success" className="px-3 py-2">ACTIVE</Badge>
                        </div>
                        
                        <div className="mb-4">
                          <div className="d-flex justify-content-between mb-2 fw-bold">
                            <span>Raised: &pound;{Number(campaign.current_amount).toLocaleString()}</span>
                            <span className="text-primary">Goal: &pound;{Number(campaign.goal_amount).toLocaleString()}</span>
                          </div>
                          <ProgressBar 
                            variant="primary" 
                            now={Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100)} 
                            style={{ height: '15px' }}
                            className="rounded-pill shadow-sm"
                          />
                          <div className="text-end mt-2 small text-muted">
                            {Math.round((campaign.current_amount / campaign.goal_amount) * 100)}% of goal reached
                          </div>
                        </div>
                        
                        <Button variant="primary" className="fw-bold px-4 py-2">Support this Campaign</Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-sm text-center py-5 bg-white bg-opacity-50">
                  <Card.Body>
                    <FaHandHoldingHeart size={48} className="text-muted opacity-25 mb-3" />
                    <p className="text-muted mb-0">No specific campaigns at the moment. General tithes and offerings are always welcome.</p>
                  </Card.Body>
                </Card>
              )}

              {/* Giving Principles */}
              <div className="mt-5 p-4 bg-white rounded shadow-sm">
                <h4 className="fw-bold mb-3">Why We Give</h4>
                <p className="text-muted">
                  At Buckland Terrace Community Church, we believe giving is an act of worship and a way to support the work of God in our community and around the world. Your generosity helps us maintain our facilities, support our ministries, and reach out to those in need.
                </p>
                <ul className="text-muted">
                  <li><strong>Tithing:</strong> The practice of giving the first 10% of our income back to God.</li>
                  <li><strong>Offerings:</strong> Gifts given above and beyond the tithe for special projects or needs.</li>
                  <li><strong>Missions:</strong> Supporting the spread of the Gospel locally and globally.</li>
                </ul>
              </div>
            </Col>

            {/* Giving Methods */}
            <Col lg={4}>
              <div className="sticky-top" style={{ top: '100px' }}>
                <h3 className="fw-bold mb-4">Ways to Give</h3>
                
                <Tabs defaultActiveKey="bank" id="giving-tabs" className="mb-3 custom-giving-tabs border-0">
                  <Tab eventKey="bank" title={<><FaLandmark className="me-1" /> Bank</>} tabClassName="fw-bold border-0">
                    <Card className="border-0 shadow-sm mt-2">
                      <Card.Body className="text-center py-5">
                        <FaLandmark size={48} className="text-muted opacity-25 mb-3" />
                        <h5 className="fw-bold">Bank Details Coming Soon</h5>
                        <p className="text-muted small">We are currently finalizing our bank account details. Please check back later or give in-person during our services.</p>
                      </Card.Body>
                    </Card>
                  </Tab>
                  
                  <Tab eventKey="mobile" title={<><FaMobileScreenButton className="me-1" /> Mobile</>} tabClassName="fw-bold border-0">
                    <Card className="border-0 shadow-sm mt-2">
                      <Card.Body className="text-center py-5">
                        <FaMobileScreenButton size={48} className="text-muted opacity-25 mb-3" />
                        <h5 className="fw-bold">Mobile Giving Coming Soon</h5>
                        <p className="text-muted small">Merchant codes for EcoCash and OneMoney will be updated here shortly. Thank you for your patience.</p>
                      </Card.Body>
                    </Card>
                  </Tab>

                  <Tab eventKey="card" title={<><FaCreditCard className="me-1" /> Card</>} tabClassName="fw-bold border-0">
                    <Card className="border-0 shadow-sm mt-2">
                      <Card.Body className="text-center py-4">
                        <FaCreditCard size={48} className="text-muted opacity-25 mb-3" />
                        <h5 className="fw-bold">Online Payment</h5>
                        <p className="text-muted small">We are currently setting up secure online credit card payments. Please use Bank or Mobile methods in the meantime.</p>
                        <Button variant="outline-primary" disabled className="mt-2">Pay via Paynow</Button>
                      </Card.Body>
                    </Card>
                  </Tab>
                </Tabs>

                <Card className="border-0 shadow-sm mt-4 bg-primary text-white p-2">
                  <Card.Body>
                    <h5 className="fw-bold mb-2">In-Person Giving</h5>
                    <p className="small mb-0 opacity-75">
                      You can also give during our Sunday services using the envelopes provided in the pews. Cash and checks are accepted.
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
      
      <style jsx global>{`
        .custom-giving-tabs .nav-link {
          color: #6c757d;
          background: transparent !important;
          border: none !important;
          border-bottom: 2px solid transparent !important;
        }
        .custom-giving-tabs .nav-link.active {
          color: #0d6efd !important;
          border-bottom: 2px solid #0d6efd !important;
        }
      `}</style>
    </>
  );
}

function Badge({ children, bg, className }: { children: React.ReactNode, bg: string, className?: string }) {
  return (
    <span className={`badge bg-${bg} ${className}`}>
      {children}
    </span>
  );
}
