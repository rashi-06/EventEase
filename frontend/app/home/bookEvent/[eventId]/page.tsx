"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";
import {Elements, PaymentElement, useStripe, useElements} from "@stripe/react-stripe-js";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  price?: number;
  availableSeats?: number;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!stripe || !elements) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });
    if (result.error) {
      setError(result.error.message || "Payment failed");
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      setSuccess("Payment successful!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <PaymentElement options={{ layout: "tabs" }} />
      <button type="submit" style={{ width: "100%", marginTop: 12 }} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
    </form>
  );
}

export default function BookEventPage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [noOfTickets, setNoOfTickets] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${params.eventId}`,{ withCredentials: true });
        setEvent(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [params.eventId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        { eventId: params.eventId, name, email, noOfTickets },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      setBookingId(res.data.bookingId || null);
      setClientSecret(res.data.clientSecret || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Booking failed");
    }
  };

  if (loading) return <div>Loading event...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Book Event: {event.title}</h1>
        <p className="text-gray-800 mb-1">Date: {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-800 mb-1">Location: {event.location}</p>
        <p className="text-gray-800 mb-4">Price: ₹{event.price || 0}</p>
        {!clientSecret ? (
          <form onSubmit={handleBooking} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <input
              type="number"
              min={1}
              max={event.availableSeats || 10}
              value={noOfTickets}
              onChange={e => setNoOfTickets(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">Book Now</button>
          </form>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        )}
      </div>
    </div>
  );
}
