export type User = {
  _id: string;
  name: string;
  email: string;
};

export type Booking = {
  _id: string;
  event?: {
    _id?: string;
    title?: string;
    date?: string;
    venue?: string;
  };
  numberOfSeats: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

export type SubscriptionRecord = {
  _id: string;
  plan?: string;
  status?: "active" | "cancelled" | "expired";
  endDate?: string;
  startDate?: string;
  price?: number;
  isActive?: boolean;
};

export type SubscriptionStatusResponse = {
  subscription: SubscriptionRecord;
  isActive: boolean;
};

export type EventRecord = {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  imageUrl?: string;
  organizer?: {
    _id?: string;
    name?: string;
  } | string;
};
