'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Spinner, Badge, Tabs, Tab } from 'react-bootstrap';
import { get } from '@/lib/api';
import { FaMagnifyingGlass, FaPlus, FaEllipsisVertical, FaTowerBroadcast, FaUsersLine, FaEnvelope } from 'react-icons/fa6';

const CommunicationsManagement = () => {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [broadcastsData, groupsData, messagesData] = await Promise.all([
        get('/api/v1/communications/broadcasts/'),
        get('/api/v1/communications/groups/'),
        get('/api/v1/communications/contact/')
      ]) as [any, any, any];
      
      setBroadcasts(Array.isArray(broadcastsData) ? broadcastsData : broadcastsData?.results || []);
      setGroups(Array.isArray(groupsData) ? groupsData : groupsData?.results || []);
      setMessages(Array.isArray(messagesData) ? messagesData : messagesData?.results || []);
    } catch (error) {
      console.error('Error fetching communications data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBroadcasts = broadcasts.filter(b => 
    `${b.subject} ${b.content} ${b.channel}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(m => 
    `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Communications</h2>
          <p className="text-muted small mb-0">Manage broadcasts, groups, and contact messages</p>
        </div>
        <Button variant="primary" className="shadow-sm d-flex align-items-center gap-2">
          <FaPlus /> New Broadcast
        </Button>
      </div>

      <Tabs defaultActiveKey="broadcasts" className="mb-4 dashboard-tabs border-0">
        {/* Broadcasts Tab */}
        <Tab eventKey="broadcasts" title={<><FaTowerBroadcast className="me-2" /> Broadcasts</>} tabClassName="fw-bold px-4">
          <Card className="border-0 shadow-sm overflow-hidden mt-3">
            <Card.Body className="p-0">
              <div className="p-4 bg-white border-bottom">
                <InputGroup style={{ maxWidth: '400px' }}>
                  <InputGroup.Text className="bg-light border-0">
                    <FaMagnifyingGlass className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Search broadcasts..." 
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
                      <th className="px-4 py-3">Subject</th>
                      <th className="py-3">Channel</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Scheduled / Sent</th>
                      <th className="py-3 text-end px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                    ) : filteredBroadcasts.length > 0 ? filteredBroadcasts.map((broadcast) => (
                      <tr key={broadcast.id}>
                        <td className="px-4 py-3">
                          <div className="fw-bold text-truncate" style={{ maxWidth: '250px' }}>{broadcast.subject}</div>
                          <div className="text-muted small">By {broadcast.creator_email || 'System'}</div>
                        </td>
                        <td className="py-3 text-uppercase small fw-bold text-secondary">{broadcast.channel}</td>
                        <td className="py-3">
                          <Badge 
                            bg={broadcast.status === 'sent' ? 'success' : broadcast.status === 'scheduled' ? 'info' : 'warning'} 
                            className="fw-normal px-2 py-1"
                          >
                            {broadcast.status || 'Draft'}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted small">
                          {broadcast.sent_at 
                            ? new Date(broadcast.sent_at).toLocaleString() 
                            : broadcast.scheduled_for 
                              ? new Date(broadcast.scheduled_for).toLocaleString() 
                              : '-'}
                        </td>
                        <td className="py-3 text-end px-4">
                          <Button variant="link" className="text-muted p-0">
                            <FaEllipsisVertical />
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="text-center py-5 text-muted">
                          No broadcasts found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        
        {/* Contact Messages Tab */}
        <Tab eventKey="messages" title={<><FaEnvelope className="me-2" /> Contact Inbox</>} tabClassName="fw-bold px-4">
          <Card className="border-0 shadow-sm overflow-hidden mt-3">
            <Card.Body className="p-0">
              <div className="p-4 bg-white border-bottom">
                <InputGroup style={{ maxWidth: '400px' }}>
                  <InputGroup.Text className="bg-light border-0">
                    <FaMagnifyingGlass className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Search messages..." 
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
                      <th className="px-4 py-3">Sender</th>
                      <th className="py-3">Subject / Message</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Received</th>
                      <th className="py-3 text-end px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                    ) : filteredMessages.length > 0 ? filteredMessages.map((msg) => (
                      <tr key={msg.id} className={msg.is_read ? 'opacity-75' : ''}>
                        <td className="px-4 py-3">
                          <div className={`fw-bold ${!msg.is_read && 'text-dark'}`}>{msg.name}</div>
                          <div className="text-muted small">{msg.email}</div>
                        </td>
                        <td className="py-3" style={{ maxWidth: '350px' }}>
                          <div className="fw-bold mb-1 text-truncate">{msg.subject}</div>
                          <div className="text-muted small text-truncate">{msg.message}</div>
                        </td>
                        <td className="py-3">
                          <Badge bg={msg.is_read ? 'light' : 'danger'} text={msg.is_read ? 'dark' : 'light'} className={`fw-normal px-2 py-1 ${msg.is_read && 'border'}`}>
                            {msg.is_read ? 'Read' : 'New'}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted small">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-end px-4">
                          <Button variant="link" className="text-muted p-0">
                            <FaEllipsisVertical />
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="text-center py-5 text-muted">
                          No messages found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        {/* Groups Tab */}
        <Tab eventKey="groups" title={<><FaUsersLine className="me-2" /> Target Groups</>} tabClassName="fw-bold px-4">
          <div className="row gy-4 mt-1">
            {loading ? (
              <div className="col-12 text-center py-5"><Spinner animation="border" variant="primary" /></div>
            ) : groups.length > 0 ? groups.map((group) => (
              <div key={group.id} className="col-md-4">
                <Card className="border-0 shadow-sm h-100 hover-lift">
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded p-3">
                        <FaUsersLine size={24} />
                      </div>
                      <Badge bg="secondary" className="fw-normal">
                        {group.members_count} Members
                      </Badge>
                    </div>
                    <h5 className="fw-bold mb-2">{group.name}</h5>
                    <p className="text-muted small mb-4 flex-grow-1">{group.description || 'No description provided.'}</p>
                    <Button variant="outline-primary" size="sm" className="w-100 fw-bold">Manage Group</Button>
                  </Card.Body>
                </Card>
              </div>
            )) : (
              <div className="col-12 text-center py-5 text-muted">
                <FaUsersLine size={48} className="mb-3 opacity-25" />
                <h5>No target groups created yet.</h5>
                <p>Groups help you organize your congregation for targeted messaging.</p>
              </div>
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
};

export default CommunicationsManagement;
