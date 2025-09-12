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
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">{event.title}</h1>
        <p className="text-gray-800 mb-2">Date: {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-800 mb-2">Location: {event.location}</p>
        {event.description && <p className="text-gray-700 mb-4">{event.description}</p>}
        <Link href={`/home/bookEvent/${event._id}`}>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Book Now</button>
        </Link>
      </div>
    </div>
  );
}
