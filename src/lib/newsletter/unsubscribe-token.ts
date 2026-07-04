import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

const TOKEN_VERSION = 1;
const TOKEN_EXPIRY_MILLISECONDS =
  180 * 24 * 60 * 60 * 1000;

interface UnsubscribeTokenPayload {
  v: number;
  id: string;
  iat: number;
  exp: number;
}

export interface VerifiedUnsubscribeToken {
  subscriberId: string;
  issuedAt: number;
  expiresAt: number;
}

function getUnsubscribeSecret(): string {
  const secret =
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;

  if (!secret?.trim()) {
    throw new Error(
      "Newsletter unsubscribe service is not configured.",
    );
  }

  return secret;
}

function signPayload(
  encodedPayload: string,
): string {
  return createHmac(
    "sha256",
    getUnsubscribeSecret(),
  )
    .update(encodedPayload)
    .digest("base64url");
}

function isTokenPayload(
  value: unknown,
): value is UnsubscribeTokenPayload {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const payload = value as Record<
    string,
    unknown
  >;

  return (
    payload.v === TOKEN_VERSION &&
    typeof payload.id === "string" &&
    payload.id.trim().length > 0 &&
    typeof payload.iat === "number" &&
    Number.isFinite(payload.iat) &&
    typeof payload.exp === "number" &&
    Number.isFinite(payload.exp)
  );
}

export function createUnsubscribeToken(
  subscriberId: string,
  now = Date.now(),
): string {
  const normalizedSubscriberId =
    subscriberId.trim();

  if (!normalizedSubscriberId) {
    throw new Error(
      "A subscriber document ID is required.",
    );
  }

  const payload: UnsubscribeTokenPayload = {
    v: TOKEN_VERSION,
    id: normalizedSubscriberId,
    iat: now,
    exp:
      now +
      TOKEN_EXPIRY_MILLISECONDS,
  };

  const encodedPayload = Buffer.from(
    JSON.stringify(payload),
    "utf8",
  ).toString("base64url");

  const signature =
    signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyUnsubscribeToken(
  token: string,
  now = Date.now(),
): VerifiedUnsubscribeToken {
  const normalizedToken = token.trim();
  const parts = normalizedToken.split(".");

  if (parts.length !== 2) {
    throw new Error(
      "The unsubscribe link is invalid or expired.",
    );
  }

  const [
    encodedPayload,
    receivedSignature,
  ] = parts;

  if (
    !encodedPayload ||
    !receivedSignature
  ) {
    throw new Error(
      "The unsubscribe link is invalid or expired.",
    );
  }

  const expectedSignature =
    signPayload(encodedPayload);

  const receivedBuffer = Buffer.from(
    receivedSignature,
    "utf8",
  );
  const expectedBuffer = Buffer.from(
    expectedSignature,
    "utf8",
  );

  if (
    receivedBuffer.length !==
      expectedBuffer.length ||
    !timingSafeEqual(
      receivedBuffer,
      expectedBuffer,
    )
  ) {
    throw new Error(
      "The unsubscribe link is invalid or expired.",
    );
  }

  let parsedPayload: unknown;

  try {
    parsedPayload = JSON.parse(
      Buffer.from(
        encodedPayload,
        "base64url",
      ).toString("utf8"),
    );
  } catch {
    throw new Error(
      "The unsubscribe link is invalid or expired.",
    );
  }

  if (!isTokenPayload(parsedPayload)) {
    throw new Error(
      "The unsubscribe link is invalid or expired.",
    );
  }

  if (
    parsedPayload.iat >
    now + 5 * 60 * 1000
  ) {
    throw new Error(
      "The unsubscribe link is invalid or expired.",
    );
  }

  if (parsedPayload.exp <= now) {
    throw new Error(
      "The unsubscribe link is invalid or expired.",
    );
  }

  return {
    subscriberId: parsedPayload.id,
    issuedAt: parsedPayload.iat,
    expiresAt: parsedPayload.exp,
  };
}