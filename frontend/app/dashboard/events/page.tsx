"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { getErrorMessage } from "../../lib/errors";
import type { EventRecord, User } from "../../lib/types";
import {
  ActionButton,
  DashboardShell,
  EmptyState,
  MessageBanner,
  SectionCard,
  SelectInput,
  TextArea,
  TextInput,
} from "../../components/dashboard/DashboardUI";

type EventFormState = {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  price: string;
  availableSeats: string;
  totalSeats: string;
  imageUrl: string;
};

const emptyForm: EventFormState = {
  title: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  category: "Technology",
  price: "0",
  availableSeats: "25",
  totalSeats: "25",
  imageUrl: "",
};

const categories = [
  { label: "Music", value: "Music" },
  { label: "Art", value: "Art" },
  { label: "Technology", value: "Technology" },
  { label: "Workshop", value: "Workshop" },
  { label: "Sports", value: "Sports" },
  { label: "Other", value: "Other" },
];

const toPayload = (form: EventFormState) => ({
  title: form.title,
  description: form.description,
  date: form.date,
  time: form.time,
  venue: form.venue,
  category: form.category,
  price: Number(form.price),
  availableSeats: Number(form.availableSeats),
  totalSeats: Number(form.totalSeats),
  imageUrl: form.imageUrl,
});

export default function DashboardEventsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [form, setForm] = useState<EventFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const [userRes, eventsRes] = await Promise.all([
        api.get<User>("/api/users/profile"),
        api.get<EventRecord[]>("/api/events"),
      ]);

      setUser(userRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Unable to load your event workspace."),
      });
    } finally {
      setLoading(false);
    }
  };

  const myEvents = useMemo(() => {
    if (!user) return [];

    return events.filter((event) => {
      if (!event.organizer) return false;
      if (typeof event.organizer === "string") return event.organizer === user._id;
      return event.organizer._id === user._id;
    });
  }, [events, user]);

  const handleChange = (field: keyof EventFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingId) {
        await api.put(`/api/events/${editingId}`, toPayload(form));
        setMessage({
          tone: "success",
          text: "Event updated successfully.",
        });
      } else {
        await api.post("/api/events", toPayload(form));
        setMessage({
          tone: "success",
          text: "Event created successfully.",
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Unable to save the event."),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event: EventRecord) => {
    setEditingId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 10),
      time: event.time,
      venue: event.venue,
      category: event.category,
      price: String(event.price),
      availableSeats: String(event.availableSeats),
      totalSeats: String(event.totalSeats),
      imageUrl: event.imageUrl ?? "",
    });
  };

  const handleDelete = async (eventId: string) => {
    setDeletingId(eventId);
    setMessage(null);

    try {
      await api.delete(`/api/events/${eventId}`);
      setMessage({
        tone: "success",
        text: "Event deleted successfully.",
      });
      if (editingId === eventId) {
        setEditingId(null);
        setForm(emptyForm);
      }
      await loadData();
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Unable to delete the event."),
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardShell
      title="Event Control Room"
      description="Create new events, refine existing ones, and clean up anything you no longer want published through the event APIs."
    >
      {message ? <MessageBanner tone={message.tone}>{message.text}</MessageBanner> : null}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title={editingId ? "Edit event" : "Create event"}
          description="This form is connected to the create and update event APIs."
          action={
            editingId ? (
              <ActionButton
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Clear form
              </ActionButton>
            ) : null
          }
        >
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <TextInput
              label="Title"
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              required
            />
            <SelectInput
              label="Category"
              value={form.category}
              onChange={(event) => handleChange("category", event.target.value)}
              options={categories}
            />
            <TextInput
              label="Date"
              type="date"
              value={form.date}
              onChange={(event) => handleChange("date", event.target.value)}
              required
            />
            <TextInput
              label="Time"
              type="time"
              value={form.time}
              onChange={(event) => handleChange("time", event.target.value)}
              required
            />
            <TextInput
              label="Venue"
              value={form.venue}
              onChange={(event) => handleChange("venue", event.target.value)}
              required
            />
            <TextInput
              label="Image URL"
              value={form.imageUrl}
              onChange={(event) => handleChange("imageUrl", event.target.value)}
              placeholder="https://example.com/banner.jpg"
            />
            <TextInput
              label="Price"
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => handleChange("price", event.target.value)}
              required
            />
            <TextInput
              label="Available seats"
              type="number"
              min="1"
              value={form.availableSeats}
              onChange={(event) => handleChange("availableSeats", event.target.value)}
              required
            />
            <TextInput
              label="Total seats"
              type="number"
              min="1"
              value={form.totalSeats}
              onChange={(event) => handleChange("totalSeats", event.target.value)}
              required
            />
            <div className="md:col-span-2">
              <TextArea
                label="Description"
                value={form.description}
                onChange={(event) => handleChange("description", event.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <ActionButton type="submit" disabled={saving || loading}>
                {saving ? "Saving..." : editingId ? "Update event" : "Create event"}
              </ActionButton>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="My events"
          description="Loaded from the event listing API and filtered to the signed-in organizer."
        >
          {loading ? (
            <p className="text-sm text-foreground/60">Loading your events...</p>
          ) : myEvents.length === 0 ? (
            <EmptyState
              title="No managed events yet"
              description="Create your first event on the left and it will show up here with edit and delete actions."
            />
          ) : (
            <div className="grid gap-4">
              {myEvents.map((event) => (
                <article
                  key={event._id}
                  className="rounded-[22px] border border-black/5 bg-white px-5 py-4"
                >
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-primary/60">
                        {event.category}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-foreground">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-foreground/65">
                        {event.description}
                      </p>
                    </div>
                    <div className="grid gap-2 text-sm text-foreground/65">
                      <p>
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </p>
                      <p>{event.venue}</p>
                      <p>
                        Rs. {event.price} · {event.availableSeats}/{event.totalSeats} seats
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <ActionButton variant="secondary" onClick={() => handleEdit(event)}>
                        Edit
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        disabled={deletingId === event._id}
                        onClick={() => handleDelete(event._id)}
                      >
                        {deletingId === event._id ? "Deleting..." : "Delete"}
                      </ActionButton>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
