'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Container, Row, Col, Badge, Spinner, Button, Card } from 'react-bootstrap';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { get } from '@/lib/api';
import { FaCalendarDays, FaUser, FaArrowLeft, FaShare, FaTag } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPostDetails() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get(`/api/v1/blog/posts/${slug}/`);
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post details:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, fetchPost]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <Spinner animation="border" variant="primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navigation />
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
          <h2 className="mb-4">Article not found</h2>
          <Link href="/blog">
            <Button variant="primary" className="rounded-pill px-4">Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="bg-light py-5 min-vh-100">
        <article>
          <Container>
            <Link href="/blog" className="text-decoration-none text-muted mb-4 d-inline-flex align-items-center hover-primary">
              <FaArrowLeft className="me-2" /> Back to Blog
            </Link>

            <Row className="justify-content-center">
              <Col lg={9}>
                <div className="bg-white rounded-4 shadow-sm overflow-hidden mb-5">
                  {post.featured_image_url && (
                    <div className="position-relative w-100" style={{ height: '500px' }}>
                      <Image 
                        src={post.featured_image_url} 
                        alt={post.title} 
                        fill
                        className="object-fit-cover"
                        priority
                      />
                    </div>
                  )}
                  
                  <div className="p-4 p-md-5">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      {post.category_details && (
                        <Badge bg="primary" className="px-3 py-2 fs-6 fw-normal">
                          {post.category_details.name}
                        </Badge>
                      )}
                      <span className="text-muted d-flex align-items-center small">
                        <FaCalendarDays className="me-2" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </span>
                    </div>

                    <h1 className="display-4 fw-bold mb-4">{post.title}</h1>
                    
                    <div className="d-flex align-items-center mb-5 pb-4 border-bottom">
                      <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" style={{ width: '48px', height: '48px' }}>
                        {post.author_details?.first_name ? post.author_details.first_name.charAt(0) : 'A'}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{post.author_details?.first_name} {post.author_details?.last_name || 'Admin'}</div>
                        <div className="text-muted small">Church Leadership Team</div>
                      </div>
                    </div>

                    <div className="blog-content fs-5 lh-lg text-secondary mb-5" dangerouslySetInnerHTML={{ __html: post.content }}>
                    </div>

                    {post.tags_details && post.tags_details.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-5 pt-4 border-top">
                        <span className="me-2 text-muted fw-bold small text-uppercase py-2">Tags:</span>
                        {post.tags_details.map((tag: any) => (
                          <Badge key={tag.id} bg="light" text="dark" className="border px-3 py-2 fw-normal">
                            <FaTag className="me-2 opacity-50" size={12} />
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Share and Newsletter */}
                <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 bg-primary text-white text-center">
                  <h3 className="fw-bold mb-3">Found this helpful?</h3>
                  <p className="lead mb-4 opacity-75">Share this article with your community or subscribe to our newsletter for more updates.</p>
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    <Button variant="light" className="rounded-pill px-4 fw-bold text-primary d-flex align-items-center">
                      <FaShare className="me-2" /> Share Article
                    </Button>
                    <Button variant="outline-light" className="rounded-pill px-4 fw-bold">
                      Subscribe for Updates
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </Container>
        </article>
      </div>
      <Footer />
      
      <style jsx global>{`
        .blog-content p { margin-bottom: 1.5rem; }
        .blog-content img { max-width: 100%; height: auto; border-radius: 1rem; margin: 2rem 0; }
        .blog-content h2, .blog-content h3 { color: var(--bs-dark); font-weight: 700; margin-top: 2.5rem; margin-bottom: 1.25rem; }
        .hover-primary:hover { color: var(--bs-primary) !important; }
      `}</style>
    </>
  );
}
