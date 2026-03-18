"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { api } from "../../../lib/api";
import type { EventRecord } from "../../../lib/types";
import {
  ActionButton,
  MessageBanner,
  TextInput,
} from "../../../components/dashboard/DashboardUI";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

function CheckoutForm({
  bookingId,
}: {
  bookingId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe is still loading. Please try again.");
      setLoading(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message || "Payment failed.");
      setLoading(false);
      return;
    }

    const paymentId = result.paymentIntent?.id;
    const status = result.paymentIntent?.status ?? "unknown";
    router.push(
      `/payment/status?paymentId=${encodeURIComponent(paymentId ?? "")}&bookingId=${encodeURIComponent(bookingId)}&status=${encodeURIComponent(status)}`
    );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: "tabs" }} />
      {error ? <MessageBanner tone="error">{error}</MessageBanner> : null}
      <ActionButton type="submit" disabled={loading} className="w-full">
        {loading ? "Processing payment..." : "Confirm payment"}
      </ActionButton>
    </form>
  );
}

export default function BookEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [noOfTickets, setNoOfTickets] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const response = await api.get<EventRecord>(`/api/events/${eventId}`);
        setEvent(response.data);
      } catch (fetchError: any) {
        setError(
          fetchError?.response?.data?.message ||
            "Failed to fetch event details."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  const handleBooking = async (eventSubmit: React.FormEvent) => {
    eventSubmit.preventDefault();
    setError("");
    setSaving(true);

    try {
      const bookingResponse = await api.post("/api/bookings", {
        eventId,
        noOfTickets,
        name,
        email,
      });

      const createdBookingId = bookingResponse.data.bookingId;

      const paymentResponse = await api.post("/api/payments/create-payment-intent", {
        amount: (event?.price ?? 0) * noOfTickets,
        bookingId: createdBookingId,
      });

      setBookingId(createdBookingId);
      setClientSecret(paymentResponse.data.clientSecret);
    } catch (bookingError: any) {
      setError(
        bookingError?.response?.data?.message || "Booking failed."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading event...</div>;
  }

  if (!event) {
    return <div className="p-10 text-center">Event not found.</div>;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(149,106,250,0.16),_transparent_38%)] px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[28px] border border-black/5 bg-background p-8 shadow-[0_24px_90px_rgba(149,106,250,0.14)]">
          <p className="text-sm uppercase tracking-[0.22em] text-primary/65">
            Event Booking
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">
            {event.title}
          </h1>
          <p className="mt-4 text-sm leading-6 text-foreground/65">
            {event.description || "Secure your seats and complete payment through Stripe."}
          </p>

          <div className="mt-6 grid gap-3 rounded-[22px] border border-black/5 bg-white p-5 text-sm text-foreground/70">
            <p>
              <span className="font-semibold text-foreground">Date:</span>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold text-foreground">Time:</span>{" "}
              {event.time}
            </p>
            <p>
              <span className="font-semibold text-foreground">Venue:</span>{" "}
              {event.venue}
            </p>
            <p>
              <span className="font-semibold text-foreground">Price:</span> Rs.{" "}
              {event.price ?? 0}
            </p>
            <p>
              <span className="font-semibold text-foreground">Available seats:</span>{" "}
              {event.availableSeats ?? 0}
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/5 bg-background p-8 shadow-[0_24px_90px_rgba(149,106,250,0.14)]">
          <h2 className="text-2xl font-semibold text-foreground">
            {clientSecret ? "Complete payment" : "Reserve your tickets"}
          </h2>
          <p className="mt-2 text-sm text-foreground/65">
            {clientSecret
              ? "Your booking is created. Finish the Stripe payment below."
              : "This form creates the booking first, then prepares a payment intent."}
          </p>

          {error ? <div className="mt-4"><MessageBanner tone="error">{error}</MessageBanner></div> : null}

          {!clientSecret ? (
            <form className="mt-6 space-y-4" onSubmit={handleBooking}>
              <TextInput
                label="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
              />
              <TextInput
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
              <TextInput
                label="Tickets"
                type="number"
                min="1"
                max={String(event.availableSeats ?? 10)}
                value={String(noOfTickets)}
                onChange={(event) => setNoOfTickets(Number(event.target.value))}
                required
              />
              <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-4 text-sm text-foreground/70">
                Total payable: <span className="font-semibold text-foreground">Rs. {(event.price ?? 0) * noOfTickets}</span>
              </div>
              <ActionButton type="submit" disabled={saving} className="w-full">
                {saving ? "Preparing payment..." : "Continue to payment"}
              </ActionButton>
            </form>
          ) : bookingId ? (
            <div className="mt-6">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm bookingId={bookingId} />
              </Elements>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
