"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { getErrorMessage } from "../../lib/errors";
import type {
  SubscriptionRecord,
  SubscriptionStatusResponse,
} from "../../lib/types";
import {
  ActionButton,
  DashboardShell,
  EmptyState,
  MessageBanner,
  SectionCard,
  StatusBadge,
  TextInput,
} from "../../components/dashboard/DashboardUI";

export default function DashboardSubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [statusInfo, setStatusInfo] = useState<SubscriptionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [purchaseForm, setPurchaseForm] = useState({
    amount: "499",
    paymentId: "",
  });
  const [intentAmount, setIntentAmount] = useState("499");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [processing, setProcessing] = useState({
    activate: false,
    cancel: false,
    purchase: false,
    intent: false,
  });

  useEffect(() => {
    void loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    setLoading(true);

    const [subscriptionRes, statusRes] = await Promise.allSettled([
      api.get<SubscriptionRecord>("/api/subscriptions"),
      api.get<SubscriptionStatusResponse>("/api/subscriptions/status"),
    ]);

    if (subscriptionRes.status === "fulfilled") {
      setSubscription(subscriptionRes.value.data);
    } else {
      setSubscription(null);
    }

    if (statusRes.status === "fulfilled") {
      setStatusInfo(statusRes.value.data);
    } else {
      setStatusInfo(null);
    }

    setLoading(false);
  };

  const setProcessingFlag = (
    key: "activate" | "cancel" | "purchase" | "intent",
    value: boolean
  ) => {
    setProcessing((current) => ({ ...current, [key]: value }));
  };

  const handleActivate = async () => {
    setProcessingFlag("activate", true);
    setMessage(null);

    try {
      await api.post("/api/subscriptions");
      await loadSubscriptionData();
      setMessage({
        tone: "success",
        text: "Subscription activated successfully.",
      });
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Unable to activate the subscription."),
      });
    } finally {
      setProcessingFlag("activate", false);
    }
  };

  const handleCancel = async () => {
    setProcessingFlag("cancel", true);
    setMessage(null);

    try {
      await api.delete("/api/subscriptions");
      await loadSubscriptionData();
      setMessage({
        tone: "success",
        text: "Subscription cancelled successfully.",
      });
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Unable to cancel the subscription."),
      });
    } finally {
      setProcessingFlag("cancel", false);
    }
  };

  const handlePurchase = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessingFlag("purchase", true);
    setMessage(null);

    try {
      await api.post("/api/subscriptions/purchase", {
        amount: Number(purchaseForm.amount),
        paymentId: purchaseForm.paymentId,
      });
      await loadSubscriptionData();
      setMessage({
        tone: "success",
        text: "Purchase API completed successfully.",
      });
      setPurchaseForm((current) => ({ ...current, paymentId: "" }));
    } catch (error) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Unable to complete the purchase flow."),
      });
    } finally {
      setProcessingFlag("purchase", false);
    }
  };

  const handleIntentCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessingFlag("intent", true);
    setMessage(null);

    try {
      const response = await api.post<{ clientSecret: string }>(
        "/api/payments/create-payment-intent",
        {
          amount: Number(intentAmount),
        }
      );
      setClientSecret(response.data.clientSecret);
      setMessage({
        tone: "success",
        text: "Payment intent created successfully.",
      });
    } catch (error) {
      setClientSecret(null);
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Unable to create a payment intent."),
      });
    } finally {
      setProcessingFlag("intent", false);
    }
  };

  const effectiveSubscription = statusInfo?.subscription ?? subscription;
  const activeTone =
    statusInfo?.isActive || effectiveSubscription?.status === "active"
      ? "success"
      : effectiveSubscription?.status === "cancelled"
        ? "danger"
        : "neutral";

  return (
    <DashboardShell
      title="Membership & Payments"
      description="Manage your EventEase plan, keep your access active, and review payment setup from one place."
    >
      {message ? <MessageBanner tone={message.tone}>{message.text}</MessageBanner> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Current subscription"
          description="Check your current plan, renewal window, and access status."
          action={
            effectiveSubscription ? (
              <StatusBadge tone={activeTone}>
                {statusInfo?.isActive ? "active now" : effectiveSubscription.status ?? "unknown"}
              </StatusBadge>
            ) : null
          }
        >
          {loading ? (
            <p className="text-sm text-foreground/60">Loading subscription data...</p>
          ) : effectiveSubscription ? (
            <div className="grid gap-3 rounded-[22px] border border-black/5 bg-white p-5 text-sm text-foreground/70">
              <p>
                <span className="font-semibold text-foreground">Plan:</span>{" "}
                {effectiveSubscription.plan ?? "standard"}
              </p>
              <p>
                <span className="font-semibold text-foreground">Price:</span> Rs.{" "}
                {effectiveSubscription.price ?? 499}
              </p>
              <p>
                <span className="font-semibold text-foreground">Start:</span>{" "}
                {effectiveSubscription.startDate
                  ? new Date(effectiveSubscription.startDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold text-foreground">End:</span>{" "}
                {effectiveSubscription.endDate
                  ? new Date(effectiveSubscription.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <ActionButton onClick={handleActivate} disabled={processing.activate}>
                  {processing.activate ? "Activating..." : "Activate / refresh"}
                </ActionButton>
                <ActionButton
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={processing.cancel}
                >
                  {processing.cancel ? "Cancelling..." : "Cancel subscription"}
                </ActionButton>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No subscription yet"
              description="Use the actions below to create a standard subscription or test the purchase flow."
            />
          )}
        </SectionCard>

        <SectionCard
          title="Purchase subscription"
          description="Activate a paid plan with a payment reference and keep premium organizer access enabled."
        >
          <form className="grid gap-4" onSubmit={handlePurchase}>
            <TextInput
              label="Amount"
              type="number"
              min="1"
              value={purchaseForm.amount}
              onChange={(event) =>
                setPurchaseForm((current) => ({ ...current, amount: event.target.value }))
              }
              required
            />
            <TextInput
              label="Payment reference"
              value={purchaseForm.paymentId}
              onChange={(event) =>
                setPurchaseForm((current) => ({ ...current, paymentId: event.target.value }))
              }
              placeholder="txn_demo_123"
              required
            />
            <div className="flex justify-end">
              <ActionButton type="submit" disabled={processing.purchase}>
                {processing.purchase ? "Processing..." : "Run purchase API"}
              </ActionButton>
            </div>
          </form>
        </SectionCard>
      </div>

      <SectionCard
        title="Payment setup"
        description="Generate a payment intent to validate that Stripe checkout is ready before you charge a customer."
      >
        <form className="grid gap-4 md:grid-cols-[0.7fr_auto]" onSubmit={handleIntentCreate}>
          <TextInput
            label="Amount"
            type="number"
            min="1"
            value={intentAmount}
            onChange={(event) => setIntentAmount(event.target.value)}
            required
          />
          <div className="flex items-end">
            <ActionButton type="submit" disabled={processing.intent} className="w-full md:w-auto">
              {processing.intent ? "Creating..." : "Create intent"}
            </ActionButton>
          </div>
        </form>
        {clientSecret ? (
          <div className="mt-5 rounded-[22px] border border-primary/15 bg-primary/5 px-4 py-4 text-sm text-foreground/75">
            <p className="font-medium text-foreground">Stripe client secret</p>
            <p className="mt-2 break-all font-mono text-xs">{clientSecret}</p>
          </div>
        ) : null}
      </SectionCard>
    </DashboardShell>
  );
}
