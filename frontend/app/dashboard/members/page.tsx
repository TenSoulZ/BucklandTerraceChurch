'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Spinner, Badge } from 'react-bootstrap';
import { get } from '@/lib/api';
import { FaMagnifyingGlass, FaUserPlus, FaEllipsisVertical } from 'react-icons/fa6';

export default function MembersManagement() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data: any = await get('/api/v1/users/');
      const results = Array.isArray(data) ? data : data?.results || [];
      setMembers(results);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => 
    `${member.first_name} ${member.last_name} ${member.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Member Management</h2>
          <p className="text-muted small mb-0">View and manage church members</p>
        </div>
        <Button variant="primary" className="shadow-sm d-flex align-items-center gap-2">
          <FaUserPlus /> Add Member
        </Button>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Body className="p-0">
          <div className="p-4 bg-white border-bottom">
            <InputGroup style={{ maxWidth: '400px' }}>
              <InputGroup.Text className="bg-light border-0">
                <FaMagnifyingGlass className="text-muted" />
              </InputGroup.Text>
              <Form.Control 
                placeholder="Search members..." 
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
                  <th className="px-4 py-3">Member</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Status</th>
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
                ) : filteredMembers.length > 0 ? filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" style={{ width: '40px', height: '40px' }}>
                          {member.first_name ? member.first_name.charAt(0) : member.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold">{member.first_name} {member.last_name}</div>
                          <div className="text-muted small">ID: #{member.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{member.email}</td>
                    <td className="py-3 text-capitalize">{member.role || 'Member'}</td>
                    <td className="py-3">
                      <Badge bg={member.is_active ? 'success' : 'secondary'} className="fw-normal px-2 py-1">
                        {member.is_active ? 'Active' : 'Inactive'}
                      </Badge>
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
                      No members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <style jsx global>{`
        .letter-spacing-1 { letter-spacing: 1px; }
      `}</style>
    </>
  );
}
