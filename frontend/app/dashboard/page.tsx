'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { get } from '@/lib/api';
import { FaUsers, FaMicrophone, FaCalendarDays, FaHeart, FaPlus, FaArrowTrendUp } from 'react-icons/fa6';

export default function DashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0,
    givingMTD: 0,
    upcomingEvents: 0,
    totalSermons: 0,
    recentActivity: [] as any[]
  });
  const [givingData, setGivingData] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, donationsData, eventsData, sermonsData] = await Promise.all([
        get('/api/v1/users/'),
        get('/api/v1/giving/donations/'),
        get('/api/v1/events/'),
        get('/api/v1/sermons/'),
      ]) as [any, any, any, any];

      const users = Array.isArray(usersData) ? usersData : usersData?.results || [];
      const donations = Array.isArray(donationsData) ? donationsData : donationsData?.results || [];
      const events = Array.isArray(eventsData) ? eventsData : eventsData?.results || [];
      const sermons = Array.isArray(sermonsData) ? sermonsData : sermonsData?.results || [];

      // Calculate Giving MTD
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const givingMTD = donations
        .filter((d: any) => new Date(d.date_donated) >= firstDayOfMonth)
        .reduce((acc: number, d: any) => acc + Number(d.amount), 0);

      // Process Giving Trends (last 6 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trends = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = months[d.getMonth()];
        const amount = donations
          .filter((don: any) => {
            const donDate = new Date(don.date_donated);
            return donDate.getMonth() === d.getMonth() && donDate.getFullYear() === d.getFullYear();
          })
          .reduce((acc: number, don: any) => acc + Number(don.amount), 0);
        trends.push({ name: monthName, amount });
      }
      setGivingData(trends);

      setStats({
        members: users.length,
        givingMTD,
        upcomingEvents: events.filter((e: any) => new Date(e.start_time) >= now).length,
        totalSermons: sermons.length,
        recentActivity: donations.slice(0, 5) 
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, [fetchData]);

  if (!mounted) return null;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Dashboard Overview</h2>
          <p className="text-muted small mb-0">Real-time insights for Buckland Terrace Church</p>
        </div>
        <Button variant="primary" className="shadow-sm" onClick={fetchData} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : <><i className="bi bi-arrow-clockwise me-2"></i>Refresh Data</>}
        </Button>
      </div>

      {/* Stats Row */}
      <Row className="gy-4 mb-4">
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 overflow-hidden">
            <Card.Body className="position-relative">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-secondary fw-bold text-uppercase small letter-spacing-1">Total Members</div>
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <FaUsers size={20} />
                </div>
              </div>
              <h2 className="fw-bold mb-0">{stats.members}</h2>
              <div className="text-success small mt-2 d-flex align-items-center">
                <FaArrowTrendUp className="me-1" /> All registered users
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 overflow-hidden">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-secondary fw-bold text-uppercase small letter-spacing-1">Giving (MTD)</div>
                <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <FaHeart size={20} />
                </div>
              </div>
              <h2 className="fw-bold mb-0">&pound;{stats.givingMTD.toLocaleString()}</h2>
              <div className="text-muted small mt-2">Current month total</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 overflow-hidden">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-secondary fw-bold text-uppercase small letter-spacing-1">Upcoming Events</div>
                <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <FaCalendarDays size={20} />
                </div>
              </div>
              <h2 className="fw-bold mb-0">{stats.upcomingEvents}</h2>
              <div className="text-muted small mt-2">Scheduled activities</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 overflow-hidden">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-secondary fw-bold text-uppercase small letter-spacing-1">Sermon Library</div>
                <div className="bg-info bg-opacity-10 text-info rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <FaMicrophone size={20} />
                </div>
              </div>
              <h2 className="fw-bold mb-0">{stats.totalSermons}</h2>
              <div className="text-muted small mt-2">Published messages</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="gy-4 mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-4">Giving Trends (Last 6 Months)</h5>
              <div style={{ height: '350px' }}>
                {loading ? (
                  <div className="h-100 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={givingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6c757d', fontSize: 12 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6c757d', fontSize: 12 }}
                        tickFormatter={(value) => `£${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`£${value}`, 'Amount']} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#0d6efd" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorAmount)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row: Actions & Recent */}
      <Row className="gy-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4">Quick Actions</h5>
              <div className="row g-3">
                <Col sm={6}>
                  <Link href="/dashboard/members" className="text-decoration-none">
                    <Button variant="outline-primary" className="w-100 py-3 d-flex flex-column align-items-center gap-2 rounded-3 border-2">
                      <FaUsers size={24} />
                      <span className="fw-bold small">Manage Members</span>
                    </Button>
                  </Link>
                </Col>
                <Col sm={6}>
                  <Link href="/dashboard/sermons" className="text-decoration-none">
                    <Button variant="outline-info" className="w-100 py-3 d-flex flex-column align-items-center gap-2 rounded-3 border-2">
                      <FaMicrophone size={24} />
                      <span className="fw-bold small">Upload Sermon</span>
                    </Button>
                  </Link>
                </Col>
                <Col sm={6}>
                  <Link href="/dashboard/events" className="text-decoration-none">
                    <Button variant="outline-danger" className="w-100 py-3 d-flex flex-column align-items-center gap-2 rounded-3 border-2">
                      <FaCalendarDays size={24} />
                      <span className="fw-bold small">Schedule Event</span>
                    </Button>
                  </Link>
                </Col>
                <Col sm={6}>
                  <Button variant="outline-success" className="w-100 py-3 d-flex flex-column align-items-center gap-2 rounded-3 border-2">
                    <FaHeart size={24} />
                    <span className="fw-bold small">View Donations</span>
                  </Button>
                </Col>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4">Recent Donations</h5>
              <div className="table-responsive">
                <table className="table table-borderless table-hover align-middle">
                  <thead className="text-muted small text-uppercase letter-spacing-1">
                    <tr>
                      <th>Donor</th>
                      <th>Amount</th>
                      <th className="text-end">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentActivity.length > 0 ? stats.recentActivity.map((don: any) => (
                      <tr key={don.id}>
                        <td>
                          <div className="fw-bold">{don.donor_name || 'Anonymous'}</div>
                          <div className="text-muted small">{don.donor_email || 'No email'}</div>
                        </td>
                        <td className="text-success fw-bold">&pound;{Number(don.amount).toLocaleString()}</td>
                        <td className="text-end text-muted small">{new Date(don.date_donated).toLocaleDateString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-muted small">No recent donations found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx global>{`
        .letter-spacing-1 { letter-spacing: 1px; }
      `}</style>
    </>
  );
}
