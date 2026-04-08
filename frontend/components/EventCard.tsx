'use client';

import { memo, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Badge } from 'react-bootstrap';
import { imageKitLoader } from '@/lib/imagekit-loader';
import { FaClock, FaLocationDot } from 'react-icons/fa6';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    slug: string;
    start_time: string;
    location_name?: string;
    image_url?: string;
    category_details?: {
      name: string;
      color: string;
    };
  };
}

function EventCard({ event }: EventCardProps) {
  // Compute formatted date values only when the event start time changes
  const { day, month, time } = useMemo(() => {
    const d = new Date(event.start_time);
    return {
      day: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }, [event.start_time]);

  const thumbnail = event.image_url || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80';

  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: 'var(--bs-border-radius)' }}>
      <div className="position-relative" style={{ height: '180px' }}>
        <Image 
          loader={imageKitLoader}
          src={thumbnail} 
          alt={event.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {event.category_details && (
          <Badge 
            bg="transparent"
            className="position-absolute top-0 end-0 m-3 px-3 py-2 border-0 shadow-sm"
            style={{ backgroundColor: event.category_details.color }}
          >
            {event.category_details.name}
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex mb-3 align-items-center">
          <div className="text-center me-3 pe-3 border-end">
            <div className="text-danger fw-bold fs-4 lh-1">{day}</div>
            <div className="text-secondary small fw-bold text-uppercase">{month}</div>
          </div>
          <div>
            <Card.Title className="fw-bold mb-1 fs-5 lh-sm">{event.title}</Card.Title>
            <Card.Text className="text-muted small mb-0">
              <FaClock className="me-1 mb-1" /> {time}
              {event.location_name && (
                <><br /><FaLocationDot className="me-1 mb-1" /> {event.location_name}</>
              )}
            </Card.Text>
          </div>
        </div>
        <div className="mt-auto pt-3">
          <Link 
            href={`/events/${event.slug}`} 
            className="btn btn-outline-primary w-100"
          >
            View Details & RSVP
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default memo(EventCard);
