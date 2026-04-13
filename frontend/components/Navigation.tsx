'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Navbar, Nav, Container, Offcanvas, Button } from 'react-bootstrap';
import { useAuthStore } from '@/store/auth';
import { memo, useCallback } from 'react';

function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  // Memoize logout handler to avoid unnecessary re-renders of Navigation component
  const handleLogout = useCallback(() => {
    logout();
    // API call to actual logout endpoint would go here
    window.location.href = '/';
  }, [logout]);

  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm" sticky="top">
      <Container fluid>
        <Link href="/" className="navbar-brand d-flex align-items-center">
            <Image
              src="/logo.png"
              alt="Buckland Terrace Community Church Logo"
              width={150}
              height={65}
              priority // prioritize loading of the logo as it is above-the-fold
              className="d-inline-block align-top me-2 object-fit-contain"
            />
        </Link>
        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-lg"
          aria-labelledby="offcanvasNavbarLabel-expand-lg"
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
              Buckland Terrace Community Church
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-center flex-grow-1 pe-3">
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
              <Link href="/live" className={`nav-link ${pathname === '/live' ? 'active' : ''}`}>
                <span className="d-flex align-items-center gap-1">
                  <span className="bg-danger rounded-circle d-inline-block shadow-sm" style={{ width: '8px', height: '8px' }}></span>
                  Live
                </span>
              </Link>
              <Link href="/sermons" className={`nav-link ${pathname?.startsWith('/sermons') ? 'active' : ''}`}>Sermons</Link>
              <Link href="/events" className={`nav-link ${pathname?.startsWith('/events') ? 'active' : ''}`}>Events</Link>
              <Link href="/ministries" className={`nav-link ${pathname?.startsWith('/ministries') ? 'active' : ''}`}>Ministries</Link>
              <Link href="/blog" className={`nav-link ${pathname?.startsWith('/blog') ? 'active' : ''}`}>Blog</Link>
              <Link href="/prayer" className={`nav-link ${pathname?.startsWith('/prayer') ? 'active' : ''}`}>Prayer</Link>
              <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link>
              <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
            </Nav>
            <Nav className="d-flex align-items-center">
              <Link href="/giving">
                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                }
                <Button variant="danger" className="me-3 mb-2 mb-lg-0 gradient-accent border-0">Give Online</Button>
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="nav-link me-2 text-secondary fw-bold">Dashboard</Link>
                  <Button variant="outline-dark" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <Link href="/login">
                  {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                  }
                  <Button variant="outline-primary" size="sm">Login</Button>
                </Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default memo(Navigation);
