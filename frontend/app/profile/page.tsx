"use client";
import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
}
interface Booking {
  _id: string;
  eventTitle: string;
  date: string;
}
interface Subscription {
  _id: string;
  type: string;
  status: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const [userRes, bookingsRes, subsRes] = await Promise.all([
          fetch("http://localhost:5000/api/users/me", { credentials: "include" }),
          fetch("http://localhost:5000/api/bookings/my", { credentials: "include" }),
          fetch("http://localhost:5000/api/subscriptions/my", { credentials: "include" })
        ]);
        if (!userRes.ok) throw new Error("Failed to fetch user info");
        if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
        if (!subsRes.ok) throw new Error("Failed to fetch subscriptions");
        setUser(await userRes.json());
        setBookings(await bookingsRes.json());
        setSubscriptions(await subsRes.json());
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h1>User Profile</h1>
      {user && (
        <div style={{ marginBottom: 24 }}>
          <strong>Name:</strong> {user.name}<br />
          <strong>Email:</strong> {user.email}
        </div>
      )}
      <h2>My Bookings</h2>
      {bookings.length === 0 ? <p>No bookings found.</p> : (
        <ul>
          {bookings.map(b => (
            <li key={b._id}>
              {b.eventTitle} - {new Date(b.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
      <h2>My Subscriptions</h2>
      {subscriptions.length === 0 ? <p>No subscriptions found.</p> : (
        <ul>
          {subscriptions.map(s => (
            <li key={s._id}>
              {s.type} - {s.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
