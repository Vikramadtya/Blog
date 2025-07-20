import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

/**
 * Notifies via Slack and adds a new subscription to Firestore.
 * @param {string} email - The email address to add.
 */
export const notify = async (email) => {
  if (!validateEmail(email)) {
    console.warn(`Invalid email format: ${email}`);
    throw new Error("Invalid email format.");
  }

  // Notify in Slack about the new subscription
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (slackWebhookUrl) {
    try {
      const response = await fetch(slackWebhookUrl, {
        method: "POST",
        body: JSON.stringify({ text: `${email} has subscribed to the blog` }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        console.error(
          "Failed to send Slack notification:",
          await response.text(),
        );
      }
    } catch (error) {
      console.error("Error sending Slack notification:", error);
    }
  } else {
    console.warn("SLACK_WEBHOOK_URL is not set. Skipping Slack notification.");
  }

  // Add the subscription to Firestore
  const subscriptionCollectionRef = collection(db, "subscriptions");
  await addDoc(subscriptionCollectionRef, {
    email: email,
    subscribedAt: Timestamp.now(),
  });
};
