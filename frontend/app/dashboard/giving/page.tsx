'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Spinner, Badge, Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { get } from '@/lib/api';
import { FaMagnifyingGlass, FaPlus } from 'react-icons/fa6';

export default function GivingManagement() {
  const [donations, setDonations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donationsData, campaignsData] = await Promise.all([
        get('/api/v1/giving/donations/'),
        get('/api/v1/giving/campaigns/'),
      ]) as [any, any];
      
      setDonations(Array.isArray(donationsData) ? donationsData : donationsData?.results || []);
      setCampaigns(Array.isArray(campaignsData) ? campaignsData : campaignsData?.results || []);
    } catch (error) {
      console.error('Error fetching giving data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDonations = donations.filter(don => 
    `${don.donor_name} ${don.donor_email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Giving Management</h2>
          <p className="text-muted small mb-0">Oversee donations and campaigns</p>
        </div>
        <Button variant="primary" className="shadow-sm d-flex align-items-center gap-2">
          <FaPlus /> Create Campaign
        </Button>
      </div>

      <Tabs defaultActiveKey="donations" className="mb-4 dashboard-tabs border-0">
        <Tab eventKey="donations" title="All Donations" tabClassName="fw-bold px-4">
          <Card className="border-0 shadow-sm overflow-hidden mt-3">
            <Card.Body className="p-0">
              <div className="p-4 bg-white border-bottom">
                <InputGroup style={{ maxWidth: '400px' }}>
                  <InputGroup.Text className="bg-light border-0">
                    <FaMagnifyingGlass className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Search donations..." 
                    className="bg-light border-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>

              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="bg-light text-muted small text-uppercase letter-spacing-1">
                    <tr>
                      <th className="px-4 py-3">Donor</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Campaign</th>
                      <th className="py-3">Method</th>
                      <th className="py-3 text-end px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                    ) : filteredDonations.length > 0 ? filteredDonations.map((don) => (
                      <tr key={don.id}>
                        <td className="px-4 py-3">
                          <div className="fw-bold">{don.donor_name || 'Anonymous'}</div>
                          <div className="text-muted small">{don.donor_email || 'No email'}</div>
                        </td>
                        <td className="py-3 text-success fw-bold">&pound;{Number(don.amount).toLocaleString()}</td>
                        <td className="py-3 text-muted">{don.campaign_details?.name || 'General Fund'}</td>
                        <td className="py-3 text-capitalize">{don.payment_method}</td>
                        <td className="py-3 text-end px-4 text-muted small">
                          {new Date(don.date_donated).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="text-center py-5 text-muted">
                          No donations found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="campaigns" title="Campaigns" tabClassName="fw-bold px-4">
          <div className="row gy-4 mt-1">
            {loading ? (
              <div className="col-12 text-center py-5"><Spinner animation="border" variant="primary" /></div>
            ) : campaigns.length > 0 ? campaigns.map((campaign) => (
              <div key={campaign.id} className="col-md-6">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">{campaign.name}</h5>
                        <p className="text-muted small mb-0">{campaign.description}</p>
                      </div>
                      <Badge bg={campaign.is_active ? 'success' : 'secondary'}>
                        {campaign.is_active ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2 small fw-bold">
                        <span>&pound;{Number(campaign.current_amount).toLocaleString()} raised</span>
                        <span className="text-primary">Goal: &pound;{Number(campaign.goal_amount).toLocaleString()}</span>
                      </div>
                      <ProgressBar 
                        variant="primary" 
                        now={Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100)} 
                        style={{ height: '10px' }}
                        className="rounded-pill"
                      />
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div className="text-muted small">
                        {campaign.start_date ? `Started ${new Date(campaign.start_date).toLocaleDateString()}` : ''}
                      </div>
                      <Button variant="outline-primary" size="sm">Edit Campaign</Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )) : (
              <div className="col-12 text-center py-5 text-muted">No campaigns found.</div>
            )}
          </div>
        </Tab>
      </Tabs>

      <style jsx global>{`
        .letter-spacing-1 { letter-spacing: 1px; }
        .dashboard-tabs .nav-link {
          color: #6c757d;
          background: transparent !important;
          border: none !important;
          border-bottom: 2px solid transparent !important;
        }
        .dashboard-tabs .nav-link.active {
          color: #0d6efd !important;
          border-bottom: 2px solid #0d6efd !important;
        }
      `}</style>
    </>
  );
}
