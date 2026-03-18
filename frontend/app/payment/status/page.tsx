"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "../../lib/api";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"success" | "failed" | "error" | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const bookingId = searchParams.get("bookingId");
    const paymentStatus = searchParams.get("status");

    if (!paymentId || !bookingId) {
      setStatus("error");
      setMessage("Missing payment or booking information.");
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        const response = await api.get("/api/payments/verify", {
          params: {
            paymentId,
            bookingId,
            status: paymentStatus,
          },
        });

        setStatus(response.data.status);
        setMessage(response.data.message || "");
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error?.response?.data?.message || "Failed to verify payment."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  const toneStyles =
    status === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(149,106,250,0.16),_transparent_38%)] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-[28px] border border-black/5 bg-background p-8 shadow-[0_24px_90px_rgba(149,106,250,0.14)]">
        <p className="text-sm uppercase tracking-[0.22em] text-primary/65">
          Payment Verification
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">
          {loading
            ? "Verifying payment..."
            : status === "success"
              ? "Payment successful"
              : "Payment update"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-foreground/65">
          This page finalizes the booking after Stripe returns control to the app.
        </p>

        <div className={`mt-6 rounded-2xl border px-4 py-4 text-sm ${toneStyles}`}>
          {loading ? "Checking payment status..." : message || "No update available."}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Go to dashboard
          </Link>
          <Link
            href="/home/allEvents"
            className="rounded-xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/14"
          >
            Explore more events
          </Link>
        </div>
      </div>
    </main>
  );
}
