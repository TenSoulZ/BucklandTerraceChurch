'use client';

import { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const givingData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 4500 },
  { name: 'May', amount: 6000 },
  { name: 'Jun', amount: 5500 },
];

const memberData = [
  { name: '2021', members: 120 },
  { name: '2022', members: 150 },
  { name: '2023', members: 180 },
  { name: '2024', members: 220 },
  { name: '2025', members: 280 },
  { name: '2026', members: 340 },
];

export default function DashboardOverview() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Dashboard Overview</h2>
        <Button variant="primary"><i className="bi bi-download me-2"></i>Export Report</Button>
      </div>

      {/* Stats Row */}
      <Row className="gy-4 mb-4">
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-secondary fw-bold text-uppercase small">Total Members</div>
                <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-people-fill"></i>
                </div>
              </div>
              <h3 className="fw-bold mb-0">340</h3>
              <div className="text-success small mt-2"><i className="bi bi-arrow-up-right me-1"></i>+12% this year</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-secondary fw-bold text-uppercase small">Giving (MTD)</div>
                <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-currency-pound"></i>
                </div>
              </div>
              <h3 className="fw-bold mb-0">&pound;5,500</h3>
              <div className="text-success small mt-2"><i className="bi bi-arrow-up-right me-1"></i>+5% from last month</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-secondary fw-bold text-uppercase small">Upcoming Events</div>
                <div className="bg-danger text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-calendar-event"></i>
                </div>
              </div>
              <h3 className="fw-bold mb-0">8</h3>
              <div className="text-muted small mt-2">Next: Community Outreach (Apr 10)</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-secondary fw-bold text-uppercase small">Sermons</div>
                <div className="bg-info text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-mic-fill"></i>
                </div>
              </div>
              <h3 className="fw-bold mb-0">124</h3>
              <div className="text-muted small mt-2">Latest: Walking in Faith</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="gy-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4">Giving Trends (Last 6 Months)</h5>
              <div style={{ height: '300px' }}>
                {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={givingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--bs-primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--bs-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip formatter={(value) => [`£${value}`, 'Amount']} />
                    <Area type="monotone" dataKey="amount" stroke="var(--bs-primary)" fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
                ) : <div>Loading chart...</div>}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4">Member Growth</h5>
              <div style={{ height: '300px' }}>
                {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memberData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="members" fill="var(--bs-secondary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                ) : <div>Loading chart...</div>}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions Row */}
      <Row className="gy-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" className="text-start"><i className="bi bi-plus-circle me-2"></i> Add New Member</Button>
                <Button variant="outline-primary" className="text-start"><i className="bi bi-mic me-2"></i> Upload Sermon</Button>
                <Button variant="outline-primary" className="text-start"><i className="bi bi-calendar-plus me-2"></i> Create Event</Button>
                <Button variant="outline-primary" className="text-start"><i className="bi bi-envelope me-2"></i> Send Broadcast</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Recent Activity</h5>
              </div>
              <ul className="list-unstyled mb-0">
                <li className="mb-3 d-flex align-items-start">
                  <div className="bg-light rounded p-2 me-3 text-primary"><i className="bi bi-person-plus"></i></div>
                  <div>
                    <div className="fw-bold small">New Member Registered</div>
                    <div className="text-muted small">Jane Smith joined the church.</div>
                  </div>
                  <div className="ms-auto text-muted small">2h ago</div>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <div className="bg-light rounded p-2 me-3 text-success"><i className="bi bi-cash"></i></div>
                  <div>
                    <div className="fw-bold small">Donation Received</div>
                    <div className="text-muted small">&pound;500 towards Building Fund.</div>
                  </div>
                  <div className="ms-auto text-muted small">5h ago</div>
                </li>
                <li className="mb-0 d-flex align-items-start">
                  <div className="bg-light rounded p-2 me-3 text-danger"><i className="bi bi-heart"></i></div>
                  <div>
                    <div className="fw-bold small">New Prayer Request</div>
                    <div className="text-muted small">Anonymous request submitted.</div>
                  </div>
                  <div className="ms-auto text-muted small">1d ago</div>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
