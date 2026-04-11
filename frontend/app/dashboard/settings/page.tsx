'use client';

import { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuthStore } from '@/store/auth';
import { FaUser, FaLock, FaBell, FaGlobe } from 'react-icons/fa6';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Account Settings</h2>
        <p className="text-muted small mb-0">Manage your profile and system preferences</p>
      </div>

      {success && <Alert variant="success" className="mb-4 shadow-sm border-0">Settings updated successfully!</Alert>}

      <Row className="gy-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <FaUser className="me-2 text-primary" /> Profile Information
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSave}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted text-uppercase">First Name</Form.Label>
                      <Form.Control type="text" defaultValue={user?.first_name} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted text-uppercase">Last Name</Form.Label>
                      <Form.Control type="text" defaultValue={user?.last_name} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted text-uppercase">Email Address</Form.Label>
                  <Form.Control type="email" defaultValue={user?.email} disabled />
                  <Form.Text className="text-muted">Contact support to change your email address.</Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" className="px-4 fw-bold rounded-pill">Save Changes</Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <FaLock className="me-2 text-danger" /> Security & Password
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted text-uppercase">Current Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted text-uppercase">New Password</Form.Label>
                      <Form.Control type="password" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted text-uppercase">Confirm New Password</Form.Label>
                      <Form.Control type="password" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="outline-danger" type="submit" className="px-4 fw-bold rounded-pill">Update Password</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <FaBell className="me-2 text-warning" /> Notifications
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Form.Check type="switch" id="email-notif" label="Email Notifications" defaultChecked className="mb-3" />
              <Form.Check type="switch" id="sms-notif" label="SMS Alerts" className="mb-3" />
              <Form.Check type="switch" id="admin-notif" label="Admin Alerts" defaultChecked className="mb-3" />
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm bg-primary text-white p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <FaGlobe className="me-2" /> System Info
            </h5>
            <div className="small opacity-75 mb-1">Last Login</div>
            <div className="fw-bold mb-3">{new Date().toLocaleString()}</div>
            <div className="small opacity-75 mb-1">Server Region</div>
            <div className="fw-bold">SIN (Singapore)</div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
