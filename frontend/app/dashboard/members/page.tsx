'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Spinner, Badge, Modal, Alert, Row, Col } from 'react-bootstrap';
import { get, post } from '@/lib/api';
import { FaMagnifyingGlass, FaUserPlus, FaEllipsisVertical } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const memberSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function MembersManagement() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      role: 'Member'
    }
  });

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

  const onSubmit = async (data: MemberFormValues) => {
    setSubmitting(true);
    setError('');
    try {
      await post('/api/v1/users/', data);
      setShowModal(false);
      reset();
      fetchMembers();
    } catch (err: any) {
      setError('Failed to add member. Please check if the email is already in use.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Member Management</h2>
          <p className="text-muted small mb-0">View and manage church members</p>
        </div>
        <Button variant="primary" className="shadow-sm d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
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

      {/* Add Member Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Add New Member</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {error && <Alert variant="danger" className="small">{error}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">First Name</Form.Label>
                  <Form.Control type="text" {...register('first_name')} isInvalid={!!errors.first_name} />
                  <Form.Control.Feedback type="invalid">{errors.first_name?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Last Name</Form.Label>
                  <Form.Control type="text" {...register('last_name')} isInvalid={!!errors.last_name} />
                  <Form.Control.Feedback type="invalid">{errors.last_name?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Email Address</Form.Label>
              <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">Assign Role</Form.Label>
              <Form.Select {...register('role')}>
                <option value="Member">Member</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="light" onClick={() => setShowModal(false)} className="px-4 fw-bold">Cancel</Button>
              <Button variant="primary" type="submit" disabled={submitting} className="px-4 fw-bold">
                {submitting ? <Spinner animation="border" size="sm" /> : 'Save Member'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style jsx global>{`
        .letter-spacing-1 { letter-spacing: 1px; }
      `}</style>
    </>
  );
}
