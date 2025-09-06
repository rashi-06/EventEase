"use client";
import React, { useEffect, useState } from "react";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
}

export default function BookEventPage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: params.eventId, name, email }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Booking failed");
      setSuccess("Booking successful!");
      setName("");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Booking failed");
    }
  };

  if (loading) return <div>Loading event...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>Book Event: {event.title}</h1>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      <form onSubmit={handleBooking} style={{ marginTop: 24 }}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button type="submit" style={{ width: "100%" }}>Book Now</button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
      </form>
    </div>
  );
}
