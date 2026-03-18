"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { getErrorMessage } from "../lib/errors";
import type { Booking, SubscriptionRecord, User } from "../lib/types";
import {
  ActionButton,
  DashboardShell,
  EmptyState,
  MessageBanner,
  MetricCard,
  SectionCard,
  StatusBadge,
  TextInput,
} from "../components/dashboard/DashboardUI";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  useEffect(() => {
    void loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const [userRes, bookingsRes, subscriptionRes] = await Promise.allSettled([
        api.get<User>("/api/users/profile"),
        api.get<Booking[] | Booking | null>("/api/bookings/myBookings"),
        api.get<SubscriptionRecord>("/api/subscriptions"),
      ]);

      if (userRes.status === "fulfilled") {
        setUser(userRes.value.data);
        setProfileForm({
          name: userRes.value.data.name ?? "",
          email: userRes.value.data.email ?? "",
          password: "",
        });
      } else {
        setMessage({
          tone: "error",
          text: getErrorMessage(userRes.reason, "Unable to load your profile."),
        });
      }

      if (bookingsRes.status === "fulfilled") {
        const bookingData = bookingsRes.value.data;
        setBookings(
          Array.isArray(bookingData)
            ? bookingData
            : bookingData
              ? [bookingData]
              : []
        );
      } else {
        setBookings([]);
      }

      if (subscriptionRes.status === "fulfilled") {
        setSubscription(subscriptionRes.value.data);
      } else {
        setSubscription(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProfile(true);
    setMessage(null);

    try {
      const payload: Record<string, string> = {
        name: profileForm.name,
        email: profileForm.email,
      };

      if (profileForm.password.trim()) {
        payload.password = profileForm.password;
      }

      const response = await api.put<User>("/api/users/profile", payload);
      setUser(response.data);
      setProfileForm((current) => ({ ...current, password: "" }));
      setMessage({
        tone: "success",
        text: "Profile updated successfully.",
      });
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Unable to update your profile."),
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleBookingCancel = async (bookingId: string) => {
    setCancellingBookingId(bookingId);
    setMessage(null);

    try {
      await api.put(`/api/bookings/cancel/${bookingId}`);
      await loadDashboard();
      setMessage({
        tone: "success",
        text: "Booking cancelled successfully.",
      });
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Unable to cancel this booking."),
      });
    } finally {
      setCancellingBookingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
    } finally {
      router.push("/auth/login");
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setMessage(null);

    try {
      await api.delete("/api/users/delete");
      router.push("/");
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Unable to delete your account."),
      });
    } finally {
      setDeletingAccount(false);
    }
  };

  const activeBookings = bookings.filter((booking) => booking.status !== "cancelled");

  return (
    <DashboardShell
      title="My Event Dashboard"
      description="Keep your account details current, track upcoming bookings, and manage your EventEase membership in one place."
    >
      {message ? <MessageBanner tone={message.tone}>{message.text}</MessageBanner> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Active bookings"
          value={String(activeBookings.length)}
          hint="Bookings that are still usable or awaiting confirmation."
        />
        <MetricCard
          label="Subscription"
          value={subscription?.status ?? "none"}
          hint="Your current EventEase membership status."
        />
        <MetricCard
          label="Account"
          value={user?.name ?? (loading ? "Loading" : "Guest")}
          hint="Keep your booking profile ready for faster checkouts."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Profile"
          description="Update the details tied to your account and future bookings."
          action={<ActionButton variant="secondary" onClick={handleLogout}>Logout</ActionButton>}
        >
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleProfileSave}>
            <TextInput
              label="Full name"
              value={profileForm.name}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Your name"
              required
            />
            <TextInput
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="you@example.com"
              required
            />
            <TextInput
              label="New password"
              type="password"
              value={profileForm.password}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Leave blank to keep current password"
              className="md:col-span-2"
            />
            <div className="md:col-span-2 flex justify-end">
              <ActionButton type="submit" disabled={savingProfile || loading}>
                {savingProfile ? "Saving..." : "Save profile"}
              </ActionButton>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Danger Zone"
          description="Permanently remove your account if you no longer plan to book or host events."
        >
          <div className="space-y-4 rounded-[22px] border border-rose-100 bg-rose-50 p-5">
            <p className="text-sm leading-6 text-rose-700">
              This action removes your user record. Only use it when you are sure.
            </p>
            <ActionButton
              variant="danger"
              disabled={deletingAccount || loading}
              onClick={handleDeleteAccount}
            >
              {deletingAccount ? "Deleting..." : "Delete account"}
            </ActionButton>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="My Bookings"
        description="Review your reserved events and cancel a booking if your plans change."
      >
        {loading ? (
          <p className="text-sm text-foreground/60">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            description="Once you book an event, it will appear here with quick cancellation controls."
          />
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="rounded-[22px] border border-black/5 bg-white px-5 py-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {booking.event?.title ?? "Untitled event"}
                      </h3>
                      <StatusBadge
                        tone={
                          booking.status === "confirmed"
                            ? "success"
                            : booking.status === "pending"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {booking.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-2 text-sm text-foreground/65">
                      {booking.event?.venue ?? "Venue TBD"} ·{" "}
                      {booking.event?.date
                        ? new Date(booking.event.date).toLocaleDateString()
                        : "Date TBD"}
                    </p>
                    <p className="mt-1 text-sm text-foreground/65">
                      {booking.numberOfSeats} ticket(s) · Rs. {booking.totalAmount}
                    </p>
                  </div>
                  <ActionButton
                    variant="secondary"
                    disabled={
                      cancellingBookingId === booking._id || booking.status === "cancelled"
                    }
                    onClick={() => handleBookingCancel(booking._id)}
                  >
                    {cancellingBookingId === booking._id
                      ? "Cancelling..."
                      : booking.status === "cancelled"
                        ? "Cancelled"
                        : "Cancel booking"}
                  </ActionButton>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </DashboardShell>
  );
}
