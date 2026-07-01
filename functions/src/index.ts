import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as SibApiV3Sdk from "sib-api-v3-sdk";
import { defineSecret } from "firebase-functions/params";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Stored in Google Cloud Secret Manager.
 *
 * It was created using:
 * firebase functions:secrets:set BREVO_API_KEY
 */
const brevoApiKey = defineSecret("BREVO_API_KEY");

/**
 * Explicit runtime account.
 *
 * This prevents Cloud Functions from trying to use the missing
 * Compute Engine default service account:
 * 903524162713-compute@developer.gserviceaccount.com
 */
const RUNTIME_SERVICE_ACCOUNT =
  "dibf-223d3@appspot.gserviceaccount.com";

const SENDER = {
  email: "office.dibglobal@gmail.com",
  name: "DIB Foundation",
};

const SUBSCRIBERS_COLLECTION = "newsletterSubscriptions";
const CAMPAIGNS_COLLECTION = "newsletterCampaigns";

/**
 * Replace this with the final DIB Foundation production domain
 * when the website is publicly deployed on its permanent domain.
 */
const PUBLIC_SITE_URL =
  "https://studio-8071626946-149cb.web.app";

/**
 * Creates an authenticated Brevo transactional email client.
 */
function getBrevoClient() {
  const apiKeyValue = brevoApiKey.value();

  if (!apiKeyValue) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "BREVO_API_KEY is missing or unavailable to this function."
    );
  }

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKeyAuthentication =
    defaultClient.authentications["api-key"];

  apiKeyAuthentication.apiKey = apiKeyValue;

  return new SibApiV3Sdk.TransactionalEmailsApi();
}

/**
 * Normalizes and performs basic validation on an email address.
 */
function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const email = value.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email) ? email : null;
}

/**
 * Extracts a safe message from a Brevo or JavaScript error without
 * exposing credentials.
 */
function getSafeErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const possibleBrevoError = error as {
      response?: {
        statusCode?: unknown;
        body?: {
          message?: unknown;
          code?: unknown;
        };
      };
      message?: unknown;
    };

    const parts: string[] = [];

    const statusCode =
      possibleBrevoError.response?.statusCode;

    const responseCode =
      possibleBrevoError.response?.body?.code;

    const responseMessage =
      possibleBrevoError.response?.body?.message;

    if (
      typeof statusCode === "number" ||
      typeof statusCode === "string"
    ) {
      parts.push(`HTTP ${statusCode}`);
    }

    if (typeof responseCode === "string") {
      parts.push(responseCode);
    }

    if (typeof responseMessage === "string") {
      parts.push(responseMessage);
    }

    if (
      parts.length === 0 &&
      typeof possibleBrevoError.message === "string"
    ) {
      parts.push(possibleBrevoError.message);
    }

    if (parts.length > 0) {
      return parts.join(": ").slice(0, 500);
    }
  }

  if (error instanceof Error) {
    return error.message.slice(0, 500);
  }

  if (typeof error === "string") {
    return error.slice(0, 500);
  }

  return "Unknown Brevo email delivery error.";
}

/**
 * Extracts the Brevo message ID from the SDK response when available.
 */
function getBrevoMessageId(
  response: unknown
): string | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const result = response as {
    body?: {
      messageId?: unknown;
      messageIds?: unknown;
    };
    messageId?: unknown;
  };

  const responseBody = result.body;

  if (typeof responseBody?.messageId === "string") {
    return responseBody.messageId;
  }

  const messageIds = responseBody?.messageIds;

  if (
    Array.isArray(messageIds) &&
    typeof messageIds[0] === "string"
  ) {
    return messageIds[0];
  }

  if (typeof result.messageId === "string") {
    return result.messageId;
  }

  return null;
}

/**
 * Builds the newsletter unsubscribe URL.
 */
function createUnsubscribeUrl(email: string): string {
  return (
    `${PUBLIC_SITE_URL}/unsubscribe?email=` +
    encodeURIComponent(email)
  );
}

/**
 * Sends an existing newsletter campaign to all active subscribers.
 *
 * This is intended to be called from the DIBF admin newsletter page.
 */
export const sendNewsletter = functions
  .runWith({
    secrets: [brevoApiKey],
    serviceAccount: RUNTIME_SERVICE_ACCOUNT,
  })
  .https.onCall(async (data) => {
    const campaignId =
      typeof data?.campaignId === "string"
        ? data.campaignId.trim()
        : "";

    if (!campaignId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a campaignId."
      );
    }

    const campaignReference = db
      .collection(CAMPAIGNS_COLLECTION)
      .doc(campaignId);

    const campaignDocument =
      await campaignReference.get();

    if (!campaignDocument.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Campaign not found."
      );
    }

    const campaign = campaignDocument.data();

    const subject =
      typeof campaign?.subject === "string"
        ? campaign.subject.trim()
        : "";

    const rawContent =
      campaign?.content ?? campaign?.body;

    const content =
      typeof rawContent === "string"
        ? rawContent.trim()
        : "";

    if (!subject || !content) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Campaign must have a subject and content."
      );
    }

    const subscribersSnapshot = await db
      .collection(SUBSCRIBERS_COLLECTION)
      .where("status", "==", "active")
      .get();

    const subscriberEmails =
      subscribersSnapshot.docs
        .map((document) =>
          normalizeEmail(document.data().email)
        )
        .filter(
          (email): email is string => email !== null
        );

    /*
     * Remove duplicate email addresses before sending.
     */
    const subscribers = Array.from(
      new Set(subscriberEmails)
    );

    if (subscribers.length === 0) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "No active subscribers were found."
      );
    }

    await campaignReference.update({
      status: "sending",
      recipientCount: subscribers.length,
      brevoLastAttemptAt:
        admin.firestore.FieldValue.serverTimestamp(),
      updatedAt:
        admin.firestore.FieldValue.serverTimestamp(),
    });

    try {
      const transactionalEmailsApi =
        getBrevoClient();

      const sendPromises = subscribers.map(
        async (email) => {
          const unsubscribeUrl =
            createUnsubscribeUrl(email);

          const sendSmtpEmail =
            new SibApiV3Sdk.SendSmtpEmail();

          sendSmtpEmail.to = [{ email }];
          sendSmtpEmail.sender = SENDER;
          sendSmtpEmail.subject = subject;

          sendSmtpEmail.htmlContent = `
            <div
              style="
                max-width: 680px;
                margin: 0 auto;
                padding: 24px;
                font-family: Arial, Helvetica, sans-serif;
                line-height: 1.6;
                color: #10243e;
              "
            >
              ${content}

              <hr
                style="
                  margin-top: 32px;
                  border: 0;
                  border-top: 1px solid #dddddd;
                "
              />

              <p
                style="
                  margin-top: 20px;
                  font-size: 12px;
                  color: #666666;
                "
              >
                You are receiving this email because you
                subscribed to DIB Foundation updates.
                <br />
                <a href="${unsubscribeUrl}">
                  Unsubscribe
                </a>
              </p>
            </div>
          `;

          return transactionalEmailsApi
            .sendTransacEmail(sendSmtpEmail);
        }
      );

      await Promise.all(sendPromises);

      await campaignReference.update({
        status: "sent",
        sentAt:
          admin.firestore.FieldValue.serverTimestamp(),
        recipientCount: subscribers.length,
        brevoLastAttemptAt:
          admin.firestore.FieldValue.serverTimestamp(),
        brevoLastError:
          admin.firestore.FieldValue.delete(),
        updatedAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        recipientCount: subscribers.length,
        result:
          `Successfully sent the newsletter to ` +
          `${subscribers.length} subscriber(s).`,
      };
    } catch (error) {
      const safeErrorMessage =
        getSafeErrorMessage(error);

      console.error(
        "Brevo newsletter delivery failed:",
        safeErrorMessage
      );

      try {
        await campaignReference.update({
          status: "failed",
          brevoLastError: safeErrorMessage,
          brevoLastAttemptAt:
            admin.firestore.FieldValue.serverTimestamp(),
          updatedAt:
            admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (updateError) {
        console.error(
          "Unable to save the campaign error:",
          getSafeErrorMessage(updateError)
        );
      }

      throw new functions.https.HttpsError(
        "internal",
        "An error occurred while sending the newsletter."
      );
    }
  });

/**
 * Sends a welcome email when a new active subscription is created.
 *
 * Firestore path:
 * newsletterSubscriptions/{subscriberId}
 */
export const onNewSubscriber = functions
  .runWith({
    secrets: [brevoApiKey],
    serviceAccount: RUNTIME_SERVICE_ACCOUNT,
  })
  .firestore.document(
    `${SUBSCRIBERS_COLLECTION}/{subscriberId}`
  )
  .onCreate(async (snapshot) => {
    const subscriber = snapshot.data();

    if (!subscriber) {
      console.log(
        `Subscription ${snapshot.id} has no data.`
      );

      return null;
    }

    const email = normalizeEmail(subscriber.email);

    const status =
      typeof subscriber.status === "string"
        ? subscriber.status.trim().toLowerCase()
        : "active";

    if (!email) {
      console.log(
        `Subscription ${snapshot.id} has an invalid email.`
      );

      await snapshot.ref.update({
        welcomeEmailSent: false,
        brevoLastError:
          "Missing or invalid subscriber email address.",
        brevoLastAttemptAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

      return null;
    }

    if (status !== "active") {
      console.log(
        `Subscription ${snapshot.id} is not active. ` +
          "Welcome email skipped."
      );

      return null;
    }

    /*
     * Re-read the document so a duplicate event does not send
     * another welcome email after successful delivery.
     */
    const currentDocument = await snapshot.ref.get();
    const currentSubscriber = currentDocument.data();

    if (
      currentSubscriber?.welcomeEmailSent === true
    ) {
      console.log(
        `A welcome email has already been sent to ${email}.`
      );

      return null;
    }

    const unsubscribeUrl =
      createUnsubscribeUrl(email);

    const sendSmtpEmail =
      new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = SENDER;
    sendSmtpEmail.subject =
      "Welcome to the DIB Foundation Community!";

    sendSmtpEmail.htmlContent = `
      <div
        style="
          max-width: 640px;
          margin: 0 auto;
          padding: 32px 24px;
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.6;
          color: #10243e;
        "
      >
        <h1
          style="
            margin-bottom: 24px;
            color: #0b8f67;
          "
        >
          Welcome to the DIB Foundation Community!
        </h1>

        <p>
          Thank you for subscribing to DIB Foundation
          updates.
        </p>

        <p>
          We are excited to have you with us. You will now
          receive our latest news, stories, initiatives,
          and impact updates directly in your inbox.
        </p>

        <p>
          Through DIB Foundation, we are committed to
          advancing health equity, youth empowerment,
          mental health awareness, community wellbeing,
          and sustainable humanitarian impact.
        </p>

        <p>
          Warm regards,
          <br />
          <strong>The DIB Foundation Team</strong>
        </p>

        <hr
          style="
            margin-top: 32px;
            border: 0;
            border-top: 1px solid #dddddd;
          "
        />

        <p
          style="
            margin-top: 20px;
            font-size: 12px;
            color: #666666;
          "
        >
          You are receiving this email because you
          subscribed to DIB Foundation updates.
          <br />

          <a href="${unsubscribeUrl}">
            Unsubscribe
          </a>
        </p>
      </div>
    `;

    try {
      const transactionalEmailsApi =
        getBrevoClient();

      const response =
        await transactionalEmailsApi
          .sendTransacEmail(sendSmtpEmail);

      const messageId =
        getBrevoMessageId(response);

      await snapshot.ref.update({
        email,
        welcomeEmailSent: true,
        welcomeEmailSentAt:
          admin.firestore.FieldValue.serverTimestamp(),
        brevoLastAttemptAt:
          admin.firestore.FieldValue.serverTimestamp(),
        brevoLastError:
          admin.firestore.FieldValue.delete(),
        ...(messageId
          ? {
              brevoMessageId: messageId,
            }
          : {}),
      });

      console.log(
        `Welcome email sent successfully to ${email}.`
      );

      return null;
    } catch (error) {
      const safeErrorMessage =
        getSafeErrorMessage(error);

      console.error(
        `Brevo welcome email failed for ${email}:`,
        safeErrorMessage
      );

      try {
        await snapshot.ref.update({
          welcomeEmailSent: false,
          brevoLastError: safeErrorMessage,
          brevoLastAttemptAt:
            admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (updateError) {
        console.error(
          "Unable to save the welcome email error:",
          getSafeErrorMessage(updateError)
        );
      }

      throw error;
    }
  });