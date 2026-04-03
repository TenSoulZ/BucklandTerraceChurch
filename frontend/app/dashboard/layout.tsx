'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Offcanvas, Nav, Button } from 'react-bootstrap';
import { useAuthStore } from '@/store/auth';
import { FaGauge, FaUsers, FaMicrophone, FaCalendarDays, FaHeart, FaPenNib, FaHandsPraying, FaTowerBroadcast, FaGear, FaBars } from 'react-icons/fa6';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: FaGauge },
    { href: '/dashboard/members', label: 'Members', icon: FaUsers },
    { href: '/dashboard/sermons', label: 'Sermons', icon: FaMicrophone },
    { href: '/dashboard/events', label: 'Events', icon: FaCalendarDays },
    { href: '/dashboard/giving', label: 'Giving', icon: FaHeart },
    { href: '/dashboard/blog', label: 'Blog', icon: FaPenNib },
    { href: '/dashboard/prayer-requests', label: 'Prayer Requests', icon: FaHandsPraying },
    { href: '/dashboard/communications', label: 'Communications', icon: FaTowerBroadcast },
    { href: '/dashboard/settings', label: 'Settings', icon: FaGear },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Mobile Toggle */}
      <div className="d-lg-none position-fixed top-0 start-0 w-100 bg-white p-3 shadow-sm z-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-primary fw-bold">BTC Dashboard</h5>
        <Button variant="outline-primary" size="sm" onClick={handleShow}>
          <FaBars size={20} />
        </Button>
      </div>
      {/* Sidebar - Desktop */}
      <div className="d-none d-lg-flex flex-column bg-dark text-white shadow" style={{ width: '280px', position: 'sticky', top: 0, height: '100vh' }}>
        <div className="p-4 border-bottom border-secondary">
          <Link href="/" className="text-white text-decoration-none">
            <h4 className="fw-bold mb-0">Buckland Terrace Community Church</h4>
            <small className="text-secondary opacity-75">Admin Dashboard</small>
          </Link>
        </div>
        <Nav className="flex-column p-3 flex-grow-1 overflow-auto">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={`nav-link text-white mb-2 rounded d-flex align-items-center ${pathname === link.href ? 'bg-primary fw-bold' : 'opacity-75 hover-opacity-100'}`}
            >
              <link.icon className="me-2" size={18} /> {link.label}
            </Link>
          ))}
        </Nav>
        <div className="p-3 border-top border-secondary mt-auto">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px' }}>
              <span className="fw-bold text-white">{user?.first_name?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <div className="fw-bold small lh-1">{user?.first_name} {user?.last_name}</div>
              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
            </div>
          </div>
          <Button variant="outline-light" size="sm" className="w-100" onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
      {/* Sidebar - Mobile Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} className="bg-dark text-white">
        <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-secondary">
          <Offcanvas.Title>
            <Link href="/" className="text-white text-decoration-none">
              <h5 className="fw-bold mb-0">Buckland Terrace Community Church</h5>
            </Link>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column p-0">
          <Nav className="flex-column p-3 flex-grow-1 overflow-auto">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={handleClose}
                className={`nav-link text-white mb-2 rounded d-flex align-items-center ${pathname === link.href ? 'bg-primary fw-bold' : 'opacity-75'}`}
              >
                <link.icon className="me-2" size={18} /> {link.label}
              </Link>
            ))}
          </Nav>
          <div className="p-3 border-top border-secondary mt-auto">
            <Button variant="outline-light" size="sm" className="w-100" onClick={() => { handleClose(); handleLogout(); }}>Sign Out</Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      {/* Main Content */}
      <div className="flex-grow-1 bg-light pt-5 pt-lg-0">
        <div className="p-4 p-md-5">
          {children}
        </div>
      </div>
    </div>
  );
}
