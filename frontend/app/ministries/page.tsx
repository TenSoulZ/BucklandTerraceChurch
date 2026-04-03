'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  FaBuildingColumns, 
  FaBookOpen, 
  FaGlobe, 
  FaPerson, 
  FaPersonDress, 
  FaBolt, 
  FaChildReaching, 
  FaMusic, 
  FaHeart, 
  FaDoorOpen 
} from 'react-icons/fa6';

const ministries = [
  { name: 'Grace Board Of Elders', icon: FaBuildingColumns, desc: 'Providing spiritual oversight, prayer, and guidance for our congregation.' },
  { name: 'Grace Pastoral Assembly', icon: FaBookOpen, desc: 'Equipping our pastoral leaders for effective ministry and shepherding.' },
  { name: 'Grace Evangelistic And Outreach Ministry', icon: FaGlobe, desc: 'Taking the Gospel to our local community and beyond through service and testimony.' },
  { name: "Grace Men's Fellowship", icon: FaPerson, desc: 'A brotherhood of men committed to growing in faith, accountability, and leadership.' },
  { name: "Grace Women's Union", icon: FaPersonDress, desc: 'Empowering women to serve, connect, and grow through fellowship and prayer.' },
  { name: 'Grace Youth Fellowship', icon: FaBolt, desc: 'Guiding the next generation to encounter Christ and discover their God-given purpose.' },
  { name: "Grace Children's Ministry", icon: FaChildReaching, desc: 'Providing a safe, fun, and faith-filled environment for kids to learn about Jesus.' },
  { name: 'Grace Music Ministry', icon: FaMusic, desc: 'Leading the congregation in anointed worship and praise during our services.' },
  { name: 'Grace Compassionate And Outreach Ministry', icon: FaHeart, desc: 'Extending a helping hand to the vulnerable, needy, and marginalized.' },
  { name: 'Grace Hospitality And Protocol', icon: FaDoorOpen, desc: 'Ensuring every visitor and member feels welcomed, loved, and at home.' },
];

export default function MinistriesPage() {
  return (
    <>
      <Navigation />
      
      {/* Page Header */}
      <section className="bg-light py-5 mb-5 text-center border-bottom">
        <Container>
          <h1 className="display-4 fw-bold text-primary mb-3">Our Ministries</h1>
          <p className="lead text-muted max-w-2xl mx-auto">
            Discover the various ways you can get involved, serve the community, and grow in your faith at Buckland Terrace Community Church.
          </p>
        </Container>
      </section>

      {/* Ministries Grid */}
      <section className="py-4 mb-5">
        <Container>
          <Row className="gy-4">
            {ministries.map((ministry, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="h-100 border-0 shadow-sm text-center p-4 hover-lift transition-all">
                  <div className="d-flex justify-content-center align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '80px', height: '80px' }}>
                      <ministry.icon size={36} />
                    </div>
                  </div>
                  <Card.Body className="d-flex flex-column p-0">
                    <Card.Title className="fw-bold fs-5 mb-3">{ministry.name}</Card.Title>
                    <Card.Text className="text-muted flex-grow-1">
                      {ministry.desc}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-primary text-white text-center">
        <Container>
          <h2 className="fw-bold mb-3">Ready to Serve?</h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            We believe everyone has a unique role to play in the body of Christ. If you feel called to serve in any of these ministries, we'd love to connect with you.
          </p>
          <Link href="/contact" className="btn btn-light btn-lg fw-bold px-5 text-primary shadow-sm rounded-pill">
            Get Involved
          </Link>
        </Container>
      </section>

      <Footer />
    </>
  );
}
