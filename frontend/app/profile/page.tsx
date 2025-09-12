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
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">User Profile</h1>
        {user && (
          <div className="mb-6">
            <div className="text-lg font-semibold text-gray-900">{user.name}</div>
            <div className="text-gray-800">{user.email}</div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">My Bookings</h2>
        {bookings.length === 0 ? <p className="text-gray-600">No bookings found.</p> : (
          <ul className="space-y-2">
            {bookings.map(b => (
              <li key={b._id} className="bg-blue-50 rounded-lg px-4 py-2 flex justify-between items-center">
                <span className="text-gray-900">{b.eventTitle}</span>
                <span className="text-gray-700 text-sm">{new Date(b.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">My Subscriptions</h2>
        {subscriptions.length === 0 ? <p className="text-gray-600">No subscriptions found.</p> : (
          <ul className="space-y-2">
            {subscriptions.map(s => (
              <li key={s._id} className="bg-blue-50 rounded-lg px-4 py-2 flex justify-between items-center">
                <span className="text-gray-900">{s.type}</span>
                <span className="text-gray-700 text-sm">{s.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
