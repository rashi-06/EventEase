"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

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
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events", { withCredentials: true });
        setEvents(res.data);
      } catch (err: any) {
        setError(err?.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-900 text-center">All Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {events.map(event => (
          <div key={event._id} className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{event.title}</h3>
              <p className="text-gray-800 mb-1">Date: {new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-800 mb-3">Location: {event.location}</p>
            </div>
            <Link href={`/home/allEvents/${event._id}`} className="mt-4 inline-block text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
