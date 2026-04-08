'use client';

import { memo, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from 'react-bootstrap';
import { imageKitLoader } from '@/lib/imagekit-loader';
import { FaPlay } from 'react-icons/fa6';

interface SermonCardProps {
  sermon: {
    id: number;
    title: string;
    preacher: string;
    date_preached: string;
    thumbnail_url?: string;
    slug: string;
  };
}

export default memo(function SermonCard({ sermon }: SermonCardProps) {
  const thumbnail = sermon.thumbnail_url || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=800&q=80';
  // Compute formatted date only when the sermon date changes
  const formattedDate = useMemo(() => new Date(sermon.date_preached).toLocaleDateString(), [sermon.date_preached]);

  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: 'var(--bs-border-radius)' }}>
      <div className="position-relative" style={{ height: '200px' }}>
        <Image 
          loader={imageKitLoader}
          src={thumbnail} 
          alt={sermon.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="position-absolute top-50 start-50 translate-middle">
          <Link 
            href={`/sermons/${sermon.slug}`} 
            className="btn btn-primary rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm" 
            style={{ width: '60px', height: '60px' }}
          >
            <FaPlay size={24} style={{ marginLeft: '4px' }} />
          </Link>
        </div>
      </div>
      <Card.Body>
        <Card.Title className="fw-bold mb-1">{sermon.title}</Card.Title>
        <Card.Text className="text-secondary small mb-2">
          {sermon.preacher} &bull; {formattedDate}
        </Card.Text>
      </Card.Body>
    </Card>
  );
});
