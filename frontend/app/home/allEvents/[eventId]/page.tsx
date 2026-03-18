"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../lib/api";

interface Event {
  _id: string;
  title: string;
  date: string;
  venue: string;
  description?: string;
}

export default function EventDetailsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await api.get(`/api/events/${eventId}`);
        setEvent(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) return <div>Loading event...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">{event.title}</h1>
        <p className="text-gray-800 mb-2">Date: {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-800 mb-2">Venue: {event.venue}</p>
        {event.description && <p className="text-gray-700 mb-4">{event.description}</p>}
        <Link href={`/home/bookEvent/${event._id}`}>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Book Now</button>
        </Link>
      </div>
    </div>
  );
}
