'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Button } from 'react-bootstrap';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { get } from '@/lib/api';
import { FaArrowRight, FaCalendarDays, FaInbox } from 'react-icons/fa6';
import Image from 'next/image';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const fetchPosts = async (url: string, append = false) => {
    try {
      const data: any = await get(url);
      const results = Array.isArray(data) ? data : data?.results || [];
      if (append) {
        setPosts(prev => [...prev, ...results]);
      } else {
        setPosts(results);
      }
      setNextPage(data.next);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts('/api/v1/blog/posts/');
  }, []);

  return (
    <>
      <Navigation />
      <div className="bg-light py-5 min-vh-100">
        <Container>
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary display-4">Church Blog</h1>
            <p className="lead text-muted max-w-2xl mx-auto">
              Insights, reflections, and updates from our pastoral team.
            </p>
          </div>

          <Row className="gy-4 mb-5">
            {loading && posts.length === 0 ? (
              <div className="text-center py-5 w-100"><Spinner animation="border" variant="primary" /></div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Col md={6} lg={4} key={post.id}>
                  <Card className="h-100 border-0 shadow-sm hover-lift transition-all" style={{ borderRadius: 'var(--bs-border-radius)' }}>
                    <div className="position-relative" style={{ height: '200px' }}>
                      {post.featured_image_url ? (
                        <Image 
                          src={post.featured_image_url} 
                          alt={post.title}
                          fill
                          style={{ objectFit: 'cover', borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0 0' }}
                        />
                      ) : (
                        <div 
                          className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 text-secondary"
                          style={{ borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0 0' }}
                        >
                          <i className="bi bi-image fs-1 opacity-25"></i>
                        </div>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        {post.category_details ? (
                          <Badge bg="primary" className="fw-normal px-3 py-2">{post.category_details.name}</Badge>
                        ) : (
                          <span></span>
                        )}
                        <small className="text-secondary d-flex align-items-center">
                          <FaCalendarDays className="me-2" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <Card.Title className="fw-bold mb-3 fs-4">{post.title}</Card.Title>
                      <Card.Text className="text-muted flex-grow-1">
                        {post.excerpt || (post.content.substring(0, 120) + '...')}
                      </Card.Text>
                      <Link href={`/blog/${post.slug}`} className="text-primary text-decoration-none fw-bold mt-3 d-flex align-items-center">
                        Read Article <FaArrowRight className="ms-2" size={14} />
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              !loading && (
                <div className="text-center text-muted py-5 w-100">
                  <FaInbox size={48} className="mb-3 d-block mx-auto opacity-50" />
                  <h5>No blog posts found</h5>
                  <p>Check back later for new updates.</p>
                </div>
              )
            )}
          </Row>

          {nextPage && (
            <div className="d-flex justify-content-center mt-4">
               <Button 
                variant="outline-primary" 
                className="px-5 py-2 fw-bold rounded-pill"
                onClick={() => fetchPosts(nextPage, true)}
                disabled={loading}
               >
                {loading ? <Spinner animation="border" size="sm" /> : 'Load More Articles'}
               </Button>
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
}
