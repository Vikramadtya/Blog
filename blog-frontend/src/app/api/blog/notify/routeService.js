import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import datastore from "../../lib/datastore-info";
import { logger } from "../../lib/api-utils";

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

/**
 * Sends a notification to a Slack webhook. This is a non-critical, fire-and-forget operation.
 * @param {string} message - The message to send to Slack.
 */
const sendSlackNotification = async (message) => {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!slackWebhookUrl) {
    logger.warn("SLACK_WEBHOOK_URL is not set. Skipping Slack notification.");
    return;
  }

  logger.info("Sending Slack notification...");
  try {
    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      body: JSON.stringify({ text: message }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      // Log the error but don't throw, as this is a non-critical failure.
      const errorText = await response.text();
      logger.error("Failed to send Slack notification:", {
        status: response.status,
        text: errorText,
      });
    } else {
      logger.success("Slack notification sent successfully.");
    }
  } catch (error) {
    logger.error(
      "An error occurred while sending the Slack notification:",
      error,
    );
  }
};

/**
 * Adds a new subscription to Firestore and triggers a Slack notification.
 * @param {string} email - The email address to add.
 * @returns {Promise<string>} - A promise that resolves to the new document's ID.
 */
export const addSubscription = async (email) => {
  const context = `subscription for ${email}`;
  logger.info(`Attempting to add ${context} to Firestore...`);

  try {
    // 1. Perform the critical action: adding the document to Firestore.
    const subscriptionCollectionRef = collection(
      db,
      datastore.subscription.name,
    );
    const newDocRef = await addDoc(subscriptionCollectionRef, {
      email: email,
      subscribedAt: Timestamp.now(),
    });

    logger.success(
      `Successfully added ${context} with document ID: ${newDocRef.id}`,
    );

    // 2. After the critical action succeeds, trigger the non-critical notification.
    await sendSlackNotification(`🎉 New Subscription: ${email}`);

    // 3. Return the ID of the new document.
    return newDocRef.id;
  } catch (error) {
    // If the Firestore operation fails, log it and re-throw the error.
    logger.error(`Failed to add ${context} to Firestore:`, error);
    throw new Error("Failed to save subscription to the database.");
  }
};
