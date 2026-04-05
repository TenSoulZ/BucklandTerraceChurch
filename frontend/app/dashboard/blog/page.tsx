'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Spinner, Badge } from 'react-bootstrap';
import { get } from '@/lib/api';
import { FaMagnifyingGlass, FaPlus, FaEllipsisVertical } from 'react-icons/fa6';

export default function BlogManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data: any = await get('/api/v1/blog/posts/');
      const results = Array.isArray(data) ? data : data?.results || [];
      setPosts(results);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    `${post.title} ${post.author_details?.first_name || ''} ${post.author_details?.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Blog Management</h2>
          <p className="text-muted small mb-0">Manage church news and articles</p>
        </div>
        <Button variant="primary" className="shadow-sm d-flex align-items-center gap-2">
          <FaPlus /> New Post
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
                placeholder="Search posts..." 
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
                  <th className="px-4 py-3">Post Title</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Date</th>
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
                ) : filteredPosts.length > 0 ? filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-4 py-3">
                      <div className="fw-bold">{post.title}</div>
                      <div className="text-muted small">By {post.author_details?.first_name || 'Admin'} {post.author_details?.last_name || ''}</div>
                    </td>
                    <td className="py-3">
                      <Badge bg="info" className="fw-normal px-2 py-1">
                        {post.category_details?.name || 'General'}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge bg={post.is_published ? 'success' : 'warning'} className="fw-normal px-2 py-1">
                        {post.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted small">
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
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
                      No posts found matching your search.
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
