import { FieldValue } from "firebase-admin/firestore";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/lib/firestore/collection-names";
import { verifyUnsubscribeToken } from "@/lib/newsletter/unsubscribe-token";

export const runtime = "nodejs";

interface UnsubscribeRequestBody {
  token?: unknown;
}

function isRequestBody(
  value: unknown,
): value is UnsubscribeRequestBody {
  return (
    typeof value === "object" &&
    value !== null
  );
}

export async function POST(
  request: NextRequest,
) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "A valid request body is required.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !isRequestBody(requestBody) ||
    typeof requestBody.token !== "string" ||
    requestBody.token.trim().length === 0
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "An unsubscribe token is required.",
      },
      {
        status: 400,
      },
    );
  }

  let subscriberId: string;

  try {
    const verifiedToken =
      verifyUnsubscribeToken(
        requestBody.token.trim(),
      );

    subscriberId = verifiedToken.subscriberId;
  } catch (error) {
    const isConfigurationError =
      error instanceof Error &&
      error.message
        .toLowerCase()
        .includes("not configured");

    if (isConfigurationError) {
      console.error(
        "Newsletter unsubscribe configuration error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "The unsubscribe service is temporarily unavailable.",
        },
        {
          status: 503,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "The unsubscribe link is invalid or expired.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const subscriberReference = adminDb
      .collection(
        COLLECTIONS.newsletterSubscriptions,
      )
      .doc(subscriberId);

    const subscriberSnapshot =
      await subscriberReference.get();

    if (!subscriberSnapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The unsubscribe request could not be processed.",
        },
        {
          status: 404,
        },
      );
    }

    const currentStatus =
      subscriberSnapshot.get("status");

    if (currentStatus === "unsubscribed") {
      return NextResponse.json({
        success: true,
        alreadyUnsubscribed: true,
      });
    }

    await subscriberReference.update({
      status: "unsubscribed",
      unsubscribedAt:
        FieldValue.serverTimestamp(),
      updatedAt:
        FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      alreadyUnsubscribed: false,
    });
  } catch (error) {
    console.error(
      "Failed to unsubscribe newsletter subscriber:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "The unsubscribe request could not be processed.",
      },
      {
        status: 500,
      },
    );
  }
}