'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container>
        <Row className="gy-4">
          <Col lg={4}>
            <div className="mb-3">
              <Image
                src="/logo.png"
                alt="Buckland Terrace Community Church Logo"
                width={180}
                height={80}
                className="bg-white rounded p-1 object-fit-contain"
              />
            </div>
              <p className="text-secondary opacity-75">
                Stand Number 15493, Figtree Road<br />
                Buckland Terraces, Grace Park, Harare<br />
                info@bucklandterracechurch.org<br />
                +263 71 233 2632
              </p>
          </Col>
          <Col lg={4}>
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/sermons" className="text-light text-decoration-none opacity-75">Watch Sermons</Link></li>
              <li className="mb-2"><Link href="/events" className="text-light text-decoration-none opacity-75">Upcoming Events</Link></li>
              <li className="mb-2"><Link href="/giving" className="text-light text-decoration-none opacity-75">Give Online</Link></li>
              <li className="mb-2"><Link href="/prayer" className="text-light text-decoration-none opacity-75">Prayer Requests</Link></li>
              <li className="mb-2"><Link href="/contact" className="text-light text-decoration-none opacity-75">Contact Us</Link></li>
            </ul>
          </Col>
          <Col lg={4}>
            <h5 className="mb-3">Newsletter</h5>
            <p className="opacity-75">Subscribe to our newsletter for updates.</p>
            <form className="d-flex">
              <input type="email" className="form-control me-2" placeholder="Email address" />
              <button type="button" className="btn btn-primary">Subscribe</button>
            </form>
          </Col>
        </Row>
        <hr className="mt-5 mb-4 border-secondary opacity-25" />
        <Row>
          <Col className="text-center opacity-50">
            <small>&copy; {new Date().getFullYear()} Buckland Terrace Community Church. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
