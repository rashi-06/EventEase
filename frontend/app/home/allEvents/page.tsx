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

export default function AllEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then(data => setEvents(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h1>All Events</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {events.map(event => (
          <div key={event._id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, width: 250 }}>
            <h3>{event.title}</h3>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <Link href={`/home/allEvents/${event._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
