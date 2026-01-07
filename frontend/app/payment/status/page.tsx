"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: Razorpay/Stripe may redirect with paymentId, status, etc.
    const paymentId = searchParams.get("paymentId");
    const bookingId = searchParams.get("bookingId");
    const paymentStatus = searchParams.get("status");
    if (!paymentId || !bookingId) {
      setStatus("error");
      setMessage("Missing payment or booking information.");
      setLoading(false);
      return;
    }
    // Call backend to verify payment
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/payments/verify?paymentId=${paymentId}&bookingId=${bookingId}&status=${paymentStatus}`,
          { withCredentials: true }
        );
        setStatus(res.data.status);
        setMessage(res.data.message || "");
      } catch (e) {
        setStatus("error");
        setMessage("Failed to verify payment.");
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  if (loading) return <div>Verifying payment...</div>;
  if (status === "success") return <div style={{ color: "green" }}>Payment Successful! {message}</div>;
  if (status === "failed" || status === "error") return <div style={{ color: "red" }}>Payment Failed. {message}</div>;
  return <div>Unknown payment status.</div>;
}
