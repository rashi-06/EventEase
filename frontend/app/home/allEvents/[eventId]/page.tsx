"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
}

export default function EventDetailsPage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${params.eventId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch event");
        return res.json();
      })
      .then(data => setEvent(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.eventId]);

  if (loading) return <div>Loading event...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>{event.title}</h1>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      {event.description && <p>{event.description}</p>}
      <Link href={`/home/bookEvent/${event._id}`}>
        <button style={{ marginTop: 16, padding: "8px 24px" }}>Book Now</button>
      </Link>
    </div>
  );
}
