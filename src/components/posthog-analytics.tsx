"use client";

// PostHog product analytics + session replay.
//
// This runs alongside the existing GTM/GA4 tags, which stay the source of
// truth for Google Ads conversion reporting. PostHog is here for session
// replay and funnels — the "why didn't this visitor call" question that GA4
// doesn't answer — not to replace pageview reporting.

import { useEffect } from "react";
import posthog from "posthog-js";

export function PostHogAnalytics() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    // No key configured (local dev, or a preview built before the env var
    // existed) — stay inert rather than throwing on init.
    if (!key) return;

    posthog.init(key, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      // Captures pageviews on App Router client-side navigations as well as
      // hard loads. Without this, moving between / and /gallery is invisible.
      defaults: "2025-05-24",
      session_recording: {
        // Visitors type addresses and phone numbers into the chat widget.
        // Never record the contents of any input.
        maskAllInputs: true,
      },
    });
  }, []);

  return null;
}
