'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FaCompass, FaEye, FaStar, FaUsers, FaHeart } from 'react-icons/fa6';

export default function AboutPage() {
  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-light py-5 text-center border-bottom">
        <Container>
          <h1 className="display-4 fw-bold text-primary mb-3">About Us</h1>
          <p className="lead text-muted max-w-2xl mx-auto">
            Discover who we are, what we believe, and the principles that guide our community.
          </p>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center align-items-center">
            <Col md={10} lg={6}>
              <h2 className="fw-bold mb-4">Our Story</h2>
              <p className="fs-5 text-muted lh-lg">
                Buckland Terrace Community Church was founded with a vision to create a welcoming 
                environment where people from all walks of life can encounter the love of Christ. 
                From our humble beginnings to where we are today, God has been incredibly faithful 
                in guiding our journey and expanding our impact in the community.
              </p>
            </Col>
            <Col md={10} lg={5} className="mt-4 mt-lg-0 text-center">
              <div className="rounded-3 shadow-lg overflow-hidden border border-light border-5 position-relative" style={{ minHeight: '400px' }}>
                <Image 
                  src="/pastor-erismus-wife.jpeg" 
                  alt="Pastor Erasmus Makarimayi and his wife" 
                  fill
                  className="object-fit-cover"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="gy-4">
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm p-4 text-center hover-lift transition-all">
                <Card.Body>
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '80px', height: '80px' }}>
                    <FaCompass size={36} />
                  </div>
                  <Card.Title className="fw-bold fs-3 mb-3">Our Mission</Card.Title>
                  <Card.Text className="text-muted fs-5">
                    To glorify God by making disciples of Jesus Christ who love God, love others, and serve the world.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm p-4 text-center hover-lift transition-all">
                <Card.Body>
                  <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '80px', height: '80px' }}>
                    <FaEye size={36} />
                  </div>
                  <Card.Title className="fw-bold fs-3 mb-3">Our Vision</Card.Title>
                  <Card.Text className="text-muted fs-5">
                    A community where every person experiences the transforming love of Christ and discovers their God-given purpose.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Core Values */}
      <section className="py-5 bg-white border-bottom">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Our Values</h2>
            <p className="lead text-muted">The principles that guide everything we do.</p>
          </div>
          <Row className="gy-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <div className="mb-3 text-primary">
                    <FaStar size={36} />
                  </div>
                  <Card.Title className="fw-bold mb-3">Faith</Card.Title>
                  <Card.Text className="text-muted">
                    We believe in the power of faith to transform lives.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <div className="mb-3 text-primary">
                    <FaUsers size={36} />
                  </div>
                  <Card.Title className="fw-bold mb-3">Community</Card.Title>
                  <Card.Text className="text-muted">
                    We value authentic relationships and fellowship.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <div className="mb-3 text-primary">
                    <FaHeart size={36} />
                  </div>
                  <Card.Title className="fw-bold mb-3">Service</Card.Title>
                  <Card.Text className="text-muted">
                    We are committed to serving God and others.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* What to Expect */}
      <section className="py-5 bg-light border-bottom">
        <Container>
          <h2 className="fw-bold mb-5 text-center">What to Expect</h2>
          <Row className="gy-4">
            {[
              { title: 'Warm Welcome', icon: 'bi-emoji-smile', desc: "We're a family and we want you to feel at home from the moment you walk in." },
              { title: 'Gospel Centered', icon: 'bi-journal-bookmark', desc: "Our messages are rooted in the Word of God and applicable to your daily life." },
              { title: 'Engaging Worship', icon: 'bi-music-note-beamed', desc: "Dynamic praise and worship that moves the heart and honors God." },
              { title: 'Kids Program', icon: 'bi-smartwatch', desc: "A safe, fun, and faith-filled environment for your little ones during our services." }
            ].map((item, i) => (
              <Col md={6} lg={3} key={i}>
                <div className="text-center px-3">
                  <div className="text-primary mb-3">
                    <i className={`bi ${item.icon} fs-1`}></i>
                  </div>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="small text-muted">{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Leadership Section */}
      <section className="py-5 mb-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Our Leadership</h2>
            <p className="lead text-muted">Dedicated to serving the flock with love and integrity.</p>
          </div>
          <Row className="gy-4 justify-content-center">
            <Col md={6} lg={4}>
              <Card className="border-0 shadow-sm text-center p-4 h-100 hover-lift transition-all">
                <Card.Body>
                  <div className="mx-auto mb-4 overflow-hidden rounded-circle shadow-sm border border-white border-4 position-relative" style={{ width: '200px', height: '200px' }}>
                    <Image 
                      src="/Pastor-Erismus.jpeg" 
                      alt="Pastor Erasmus Makarimayi" 
                      fill
                      className="object-fit-cover"
                    />
                  </div>
                  <Card.Title className="fw-bold mb-1 fs-3">Pastor Erasmus Makarimayi</Card.Title>
                  <Card.Text className="text-primary small fw-bold text-uppercase mb-3">Founder & Visionary</Card.Text>
                  <Card.Text className="text-muted">
                    Leading Buckland Terrace Community Church with a divine vision to reach souls 
                    and transform communities through the uncompromised Word of God.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="border-0 shadow-sm text-center p-4 h-100 hover-lift transition-all">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="bg-primary bg-opacity-10 mx-auto rounded-circle d-flex justify-content-center align-items-center mb-4" style={{ width: '150px', height: '150px' }}>
                    <FaUsers size={60} className="text-primary" />
                  </div>
                  <Card.Title className="fw-bold mb-1 fs-4">Church Leadership</Card.Title>
                  <Card.Text className="text-primary small fw-bold text-uppercase mb-3">Supporting Ministry</Card.Text>
                  <Card.Text className="text-muted">
                    Our dedicated team of elders, deacons, and ministry leaders who serve 
                    alongside Pastor Erasmus to fulfill the Great Commission.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
}
