"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type UnsubscribeState =
  | "idle"
  | "submitting"
  | "success"
  | "already-unsubscribed"
  | "invalid"
  | "error";

interface UnsubscribeResponse {
  success?: boolean;
  alreadyUnsubscribed?: boolean;
  error?: string;
}

interface UnsubscribeClientProps {
  token: string;
}

export function UnsubscribeClient({
  token,
}: UnsubscribeClientProps) {
  const [state, setState] = useState<UnsubscribeState>(
    token ? "idle" : "invalid",
  );

  const [message, setMessage] = useState(
    token
      ? ""
      : "This unsubscribe link is missing a valid token.",
  );

  async function handleUnsubscribe() {
    if (!token) {
      setState("invalid");
      setMessage(
        "This unsubscribe link is missing a valid token.",
      );
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch(
        "/api/newsletter/unsubscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        },
      );

      const result =
        (await response.json()) as UnsubscribeResponse;

      if (!response.ok || !result.success) {
        setState("invalid");
        setMessage(
          result.error ??
            "This unsubscribe link is invalid or expired.",
        );
        return;
      }

      if (result.alreadyUnsubscribed) {
        setState("already-unsubscribed");
        setMessage(
          "You have already been unsubscribed from DIB Foundation newsletter emails.",
        );
        return;
      }

      setState("success");
      setMessage(
        "You have been unsubscribed from DIB Foundation newsletter emails.",
      );
    } catch (error) {
      console.error("Unsubscribe request failed:", error);

      setState("error");
      setMessage(
        "We could not process your unsubscribe request. Please try again.",
      );
    }
  }

  const canSubmit =
    state === "idle" || state === "error";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            DIB Foundation
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Newsletter Unsubscribe
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            You can unsubscribe from DIB Foundation newsletter
            updates here. We will not display your email address
            on this page.
          </p>
        </div>

        {state === "invalid" ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {message ||
              "This unsubscribe link is invalid or expired."}
          </div>
        ) : (
          <div className="space-y-4">
            {(state === "success" ||
              state === "already-unsubscribed" ||
              state === "error") && (
              <div
                className={
                  state === "error"
                    ? "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    : "rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                }
              >
                {message}
              </div>
            )}

            {canSubmit && (
              <Button
                type="button"
                onClick={() => void handleUnsubscribe()}
              >
                Unsubscribe
              </Button>
            )}

            {state === "submitting" && (
              <Button type="button" disabled>
                Unsubscribing...
              </Button>
            )}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            Return to website
          </Link>
        </div>
      </div>
    </main>
  );
}